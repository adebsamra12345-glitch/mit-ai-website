import json
import uuid
import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import connection

from .models import ContactInquiry, ChatSession, ChatMessage
from .ai_service import generate_ai_reply


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def chat_view(request):
    """
    نقطة النهاية لمحادثة المساعد الرقمي Mit
    POST /api/chat/
    Body: { "message": "نص المستخدم", "sessionId": "معرف اختياري" }
    Response: { "reply": "رد المساعد", "sessionId": "...", "provider": "..." }
    """
    if request.method == "OPTIONS":
        return JsonResponse({"status": "ok"})

    try:
        data = json.loads(request.body.decode('utf-8'))
    except Exception:
        return JsonResponse(
            {"error": "طلب غير صالح، يرجى إرسال بيانات بصيغة JSON سليمة."},
            status=400,
            json_dumps_params={'ensure_ascii': False}
        )

    user_message = data.get('message', '').strip()
    session_id = data.get('sessionId', '').strip()

    if not user_message:
        return JsonResponse(
            {"error": "حقل الرسالة 'message' مطلوب."},
            status=400,
            json_dumps_params={'ensure_ascii': False}
        )

    # إنشاء أو استرجاع الجلسة
    if not session_id:
        session_id = f"mit_{uuid.uuid4().hex[:12]}"

    session, _ = ChatSession.objects.get_or_create(session_id=session_id)

    # جلب سجل الرسائل السابقة للجلسة لإعطاء سياق
    history_objs = session.messages.order_by('-created_at')[:6]
    history_messages = [
        {"role": m.role, "content": m.content}
        for m in reversed(list(history_objs))
    ]

    # حفظ رسالة المستخدم أولاً
    ChatMessage.objects.create(
        session=session,
        role='user',
        content=user_message,
    )

    # توليد الرد من خدمة الذكاء الاصطناعي وقاعدة المعرفة
    try:
        reply_text, provider = generate_ai_reply(
            user_message=user_message,
            session_id=session_id,
            history_messages=history_messages
        )
    except Exception as e:
        reply_text = (
            "عذرًا، حدث خطأ غير متوقع أثناء معالجة رسالتك. "
            "يمكنك إعادة المحاولة أو التواصل معنا مباشرة عبر الهاتف 0993448083."
        )
        provider = "error_fallback"

    # حفظ رد المساعد
    ChatMessage.objects.create(
        session=session,
        role='assistant',
        content=reply_text,
        provider=provider,
    )

    return JsonResponse(
        {
            "reply": reply_text,
            "sessionId": session.session_id,
            "provider": provider,
        },
        json_dumps_params={'ensure_ascii': False}
    )


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def contact_view(request):
    """
    نقطة النهاية لحفظ طلبات الاستشارات والتواصل
    POST /api/contact/
    Body: { "name": "...", "email": "...", "phone": "...", "company": "...", "service": "...", "message": "..." }
    """
    if request.method == "OPTIONS":
        return JsonResponse({"status": "ok"})

    try:
        data = json.loads(request.body.decode('utf-8'))
    except Exception:
        return JsonResponse(
            {"error": "بيانات غير صالحة، يرجى إرسال JSON سليم."},
            status=400,
            json_dumps_params={'ensure_ascii': False}
        )

    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    phone = data.get('phone', '').strip()
    company = data.get('company', '').strip()
    service = data.get('service', 'general_consultation').strip()
    message = data.get('message', '').strip()

    # التحقق من الحقول الأساسية
    if not name:
        return JsonResponse(
            {"error": "حقل الاسم مطلوب."},
            status=400,
            json_dumps_params={'ensure_ascii': False}
        )

    if not email and not phone:
        return JsonResponse(
            {"error": "يرجى تزويدنا بالبريد الإلكتروني أو رقم الهاتف لنتواصل معك."},
            status=400,
            json_dumps_params={'ensure_ascii': False}
        )

    if not message:
        message = "طلب استشارة عامة في حلول الذكاء الاصطناعي."

    # حفظ الطلب في قاعدة البيانات
    inquiry = ContactInquiry.objects.create(
        name=name,
        email=email,
        phone=phone,
        company=company,
        service=service,
        message=message,
        status='new',
    )

    return JsonResponse(
        {
            "status": "success",
            "message": "تم استلام طلبك بنجاح! سيتواصل معك فريق Mit AI Technology في أقرب وقت لتحديد موعد الاستشارة.",
            "id": inquiry.id,
        },
        status=201,
        json_dumps_params={'ensure_ascii': False}
    )


@require_http_methods(["GET"])
def health_view(request):
    """
    نقطة النهاية لفحص صحة الخادم وحالة الخدمات
    GET /api/health/
    """
    # فحص اتصال قاعدة البيانات
    db_ok = True
    try:
        connection.ensure_connection()
    except Exception:
        db_ok = False

    total_inquiries = ContactInquiry.objects.count() if db_ok else 0
    total_sessions = ChatSession.objects.count() if db_ok else 0

    import os
    provider = os.getenv('AI_PROVIDER', 'knowledge_base')
    model_name = os.getenv('AI_MODEL_NAME', 'qwen-2.5-72b')

    return JsonResponse(
        {
            "status": "healthy" if db_ok else "degraded",
            "service": "Mit AI Backend API",
            "database": "connected" if db_ok else "error",
            "ai_engine": {
                "active_provider": provider,
                "model_name": model_name,
                "knowledge_base": "ready",
            },
            "stats": {
                "total_consultations": total_inquiries,
                "total_chat_sessions": total_sessions,
            },
            "timestamp": datetime.datetime.now().isoformat(),
        },
        json_dumps_params={'ensure_ascii': False}
    )
