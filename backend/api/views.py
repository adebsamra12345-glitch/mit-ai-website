import datetime
import json
import logging
import re
import uuid

from django.core.cache import cache
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db import DatabaseError, connection
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .ai_service import AIConfig, generate_ai_reply, HISTORY_LIMIT
from .models import ChatMessage, ChatSession, ContactInquiry

logger = logging.getLogger(__name__)

MAX_MESSAGE_LENGTH = 1000
MAX_FIELD_LENGTH = 150
SESSION_ID_RE = re.compile(r'^[A-Za-z0-9_-]{1,120}$')

CHAT_RATE = (30, 60)         # 30 طلب كل 60 ثانية لكل عنوان IP
CONTACT_RATE = (10, 3600)    # 10 طلبات استشارة في الساعة لكل عنوان IP

FALLBACK_REPLY = (
    "عذرًا، حدث خطأ غير متوقع أثناء معالجة رسالتك. "
    "يمكنك إعادة المحاولة أو التواصل معنا مباشرة عبر الهاتف 0993448083."
)


def api_response(data: dict, status: int = 200) -> JsonResponse:
    """JSON بترميز عربي مقروء."""
    return JsonResponse(data, status=status, json_dumps_params={'ensure_ascii': False})


def api_error(message: str, status: int = 400) -> JsonResponse:
    return api_response({'error': message}, status)


def parse_json_body(request) -> dict | None:
    """يرجع الجسم كقاموس، أو None إذا لم يكن JSON كائنًا صالحًا."""
    try:
        data = json.loads(request.body.decode('utf-8'))
    except (ValueError, UnicodeDecodeError):
        return None
    return data if isinstance(data, dict) else None


def text_field(data: dict, key: str, default: str = '') -> str:
    value = data.get(key, default)
    return value.strip() if isinstance(value, str) else default


def client_ip(request) -> str:
    forwarded = request.META.get('HTTP_X_FORWARDED_FOR', '')
    return forwarded.split(',')[0].strip() or request.META.get('REMOTE_ADDR', 'unknown')


def is_rate_limited(request, scope: str, limit: int, window: int) -> bool:
    """حد معدل بسيط لكل IP (ذاكرة Django المؤقتة)."""
    key = f'rl:{scope}:{client_ip(request)}'
    if cache.add(key, 1, window):
        return False
    try:
        return cache.incr(key) > limit
    except ValueError:  # انتهت صلاحية المفتاح بين الاستدعاءين
        cache.set(key, 1, window)
        return False


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def chat_view(request):
    """
    محادثة المساعد الرقمي Mit
    POST /api/chat/   Body: {"message": "...", "sessionId": "اختياري"}
    Response: {"reply": "...", "sessionId": "...", "provider": "..."}
    """
    if request.method == "OPTIONS":
        return api_response({"status": "ok"})

    if is_rate_limited(request, 'chat', *CHAT_RATE):
        return api_error("طلبات كثيرة خلال وقت قصير، يرجى المحاولة بعد قليل.", 429)

    data = parse_json_body(request)
    if data is None:
        return api_error("طلب غير صالح، يرجى إرسال بيانات بصيغة JSON سليمة.")

    user_message = text_field(data, 'message')
    if not user_message:
        return api_error("حقل الرسالة 'message' مطلوب.")
    if len(user_message) > MAX_MESSAGE_LENGTH:
        return api_error(f"الرسالة طويلة جداً (الحد الأقصى {MAX_MESSAGE_LENGTH} حرف).")

    session_id = text_field(data, 'sessionId')
    if not SESSION_ID_RE.match(session_id):
        session_id = f"mit_{uuid.uuid4().hex[:12]}"

    # التخزين ثانوي: إن تعذّرت قاعدة البيانات يستمر المساعد بالرد (بدون سجل محادثة)
    session, history = None, []
    try:
        session, _ = ChatSession.objects.get_or_create(session_id=session_id)
        # السجل يُقرأ قبل حفظ الرسالة الحالية كي لا تتكرر في السياق
        recent = session.messages.order_by('-created_at')[:HISTORY_LIMIT]
        history = [{"role": m.role, "content": m.content} for m in reversed(list(recent))]
        ChatMessage.objects.create(session=session, role='user', content=user_message)
    except DatabaseError:
        logger.exception("Chat storage unavailable; replying without history")
        session = None

    try:
        reply, provider = generate_ai_reply(user_message, session_id=session_id, history_messages=history)
    except Exception:
        logger.exception("Reply generation failed")
        reply, provider = FALLBACK_REPLY, 'error_fallback'

    if session is not None:
        try:
            ChatMessage.objects.create(session=session, role='assistant', content=reply, provider=provider)
        except DatabaseError:
            logger.exception("Could not store assistant reply")

    return api_response({"reply": reply, "sessionId": session_id, "provider": provider})


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def contact_view(request):
    """
    حفظ طلبات الاستشارة والتواصل
    POST /api/contact/   Body: {name, email, phone, company, service, message}
    """
    if request.method == "OPTIONS":
        return api_response({"status": "ok"})

    if is_rate_limited(request, 'contact', *CONTACT_RATE):
        return api_error("تم إرسال عدد كبير من الطلبات، يرجى المحاولة لاحقاً.", 429)

    data = parse_json_body(request)
    if data is None:
        return api_error("بيانات غير صالحة، يرجى إرسال JSON سليم.")

    name = text_field(data, 'name')[:MAX_FIELD_LENGTH]
    email = text_field(data, 'email')[:MAX_FIELD_LENGTH]
    phone = text_field(data, 'phone')[:50]
    company = text_field(data, 'company')[:MAX_FIELD_LENGTH]
    message = text_field(data, 'message')[:5000] or "طلب استشارة عامة في حلول الذكاء الاصطناعي."

    valid_services = {value for value, _ in ContactInquiry.SERVICE_CHOICES}
    service = text_field(data, 'service', 'general_consultation')
    if service not in valid_services:
        service = 'general_consultation'

    if not name:
        return api_error("حقل الاسم مطلوب.")
    if not email and not phone:
        return api_error("يرجى تزويدنا بالبريد الإلكتروني أو رقم الهاتف لنتواصل معك.")
    if email:
        try:
            validate_email(email)
        except ValidationError:
            return api_error("صيغة البريد الإلكتروني غير صحيحة.")

    inquiry = ContactInquiry.objects.create(
        name=name, email=email, phone=phone, company=company, service=service, message=message, status='new',
    )

    return api_response(
        {
            "status": "success",
            "message": "تم استلام طلبك بنجاح! سيتواصل معك فريق Mit AI Technology في أقرب وقت لتحديد موعد الاستشارة.",
            "id": inquiry.id,
        },
        status=201,
    )


@require_http_methods(["GET"])
def health_view(request):
    """فحص صحة الخادم: GET /api/health/"""
    try:
        connection.ensure_connection()
        db_ok = True
    except Exception:
        db_ok = False

    config = AIConfig.from_env()
    return api_response(
        {
            "status": "healthy" if db_ok else "degraded",
            "service": "Mit AI Backend API",
            "database": "connected" if db_ok else "error",
            "ai_engine": {
                "active_provider": config.provider,
                "model_name": config.model,
                "knowledge_base": "ready",
            },
            "stats": {
                "total_consultations": ContactInquiry.objects.count() if db_ok else 0,
                "total_chat_sessions": ChatSession.objects.count() if db_ok else 0,
            },
            "timestamp": datetime.datetime.now().isoformat(),
        }
    )
