import os
import re
import json
import logging
import requests

logger = logging.getLogger(__name__)

# ==============================================================================
# قاعدة المعرفة الخاصة بشركة Mit AI Technology
# ==============================================================================
COMPANY_KNOWLEDGE = {
    "name": "Mit AI Technology",
    "name_ar": "شركة التحول الذكي للأنظمة (Mit AI Technology)",
    "tagline": "نحوّل التقنيات المعقدة إلى حلول عملية لأعمالك",
    "persona": "Mit (ميت) — المساعد الرقمي الروبوتي الذكي للشركة، خبير ومدرّب لتمثيل الشركة وخدمة الزوار بأسلوب ودود ومحترف.",
    "contact": {
        "email": "mmitaitechnoloy@gmail.com",
        "phone": "0993448083",
        "consultation": "نقدم استشارة مجانية مخصصة لتحليل احتياجاتك وتصميم الحل الأنسب لعملك عبر نموذج حجز الاستشارة في الموقع."
    },
    "services": [
        {
            "id": "conversational_ai",
            "title": "حلول المحادثة الذكية (Smart Conversational AI)",
            "summary": "مساعدون رقميون وروبوتات محادثة ذكية تفهم سياق عملك بدقة.",
            "details": "ندمج شات بوت ذكي ومساعدين رقميين مثل Mit، مدربين على قواعد معرفية مخصصة (RAG)، يدعمون المحادثات النصية والصوتية مع ربط كامل مع أنظمة خدمة العملاء ومواقع الويب وواتساب."
        },
        {
            "id": "data_analytics",
            "title": "تحليل البيانات والأنظمة التنبؤية (Data Analytics & Predictive Systems)",
            "summary": "تحويل البيانات إلى رؤى عملية وتنبؤات دقيقة تدعم اتخاذ القرارات.",
            "details": "بناء خوارزميات تعلم آلة متقدمة للتنبؤ بسلوك العملاء، وتوقع المبيعات، وكشف الأنماط، وتجهيز لوحات تحكم تفاعلية ذكية."
        },
        {
            "id": "custom_ai",
            "title": "حلول الذكاء الاصطناعي المخصصة وأتمتة مسارات العمل (Custom AI & Automation)",
            "summary": "نماذج ذكاء اصطناعي وأتمتة مخصصة بالكامل لخصوصية عملياتك.",
            "details": "تدريب وتخصيص نماذج مفتوحة المصدر (مثل Qwen 2.5 و Llama) مع حماية تامة لسرية البيانات، وأتمتة المهام الروتينية وتلخيص وتحليل المستندات المعقدة."
        }
    ],
    "strengths": [
        "خبرة متخصصة في أحدث نماذج الذكاء الاصطناعي مثل Qwen 2.5",
        "حلول مخصصة بالكامل وليس قوالب جاهزة عامة",
        "دعم المحادثة الصوتية والنصية باللغة العربية بكفاءة عالية",
        "حماية أمان وسرية بيانات الشركات والمؤسسات",
        "استشارة مجانية ومتابعة مستمرة بعد الإطلاق"
    ]
}

SYSTEM_PROMPT = f"""أنت "Mit" (ميت)، المساعد الرقمي الذكي والممثل الرسمي لشركة "Mit AI Technology" (شركة التحول الذكي للأنظمة).
شخصيتك: روبوت ذكي، ودود، فخور بعلامتك التجارية، محترف في مجال الذكاء الاصطناعي وحلول الأعمال.
لغة التحدث: اللغة العربية بأسلوب راقٍ وواضح وودود.

معلومات الشركة الأساسية:
- الاسم: {COMPANY_KNOWLEDGE['name_ar']}
- الشعار: {COMPANY_KNOWLEDGE['tagline']}
- خدماتنا الرئيسية:
  1. حلول المحادثة الذكية (شات بوت ومساعدين رقميين صوتي ونصي بتقنية RAG ونماذج مثل Qwen 2.5).
  2. تحليل البيانات والأنظمة التنبؤية (لوحات تحكم، توقعات المبيعات وسلوك العملاء).
  3. حلول الذكاء الاصطناعي المخصصة وأتمتة العمليات (تدريب نماذج مخصصة، أتمتة الوظائف وسرية تامة للبيانات).
- التواصل والاستشارة:
  - استشارة مجانية متاحة عبر نموذج "احجز استشارتك الآن" في الموقع.
  - البريد الإلكتروني: {COMPANY_KNOWLEDGE['contact']['email']}
  - الهاتف / واتساب: {COMPANY_KNOWLEDGE['contact']['phone']}

إرشادات الإجابة:
1. أجب باختصار وبشكل مركز ومباشر دون إطالة مفرطة.
2. إذا سأل المستخدم عن الخدمات أو الأسعار، وضّح الخدمة واقترح عليه حجز استشارة مجانية لتحديد السعر الأنسب لمشروعه.
3. إذا سأل عن التواصل، زوده بالبريد ورقم الهاتف واذكر إمكانية تعبئة النموذج.
4. حافظ دائمًا على شخصية Mit الودودة والمشجعة.
"""

def generate_ai_reply(user_message: str, session_id: str = None, history_messages: list = None) -> tuple[str, str]:
    """
    توليد رد ذكي بناءً على المزود المحدد في ملف .env
    يرجع (reply_text, provider_name)
    """
    provider = os.getenv('AI_PROVIDER', 'knowledge_base').strip().lower()
    api_key = os.getenv('AI_API_KEY', '').strip()
    model_name = os.getenv('AI_MODEL_NAME', 'qwen-2.5-72b').strip()
    api_base = os.getenv('AI_API_BASE', '').strip()

    # إذا كان المزود محدداً كـ external وكان هناك مفتاح أو سيرفر
    if provider in ('openai', 'groq', 'custom') and (api_key or api_base):
        try:
            reply = call_openai_compatible_api(
                user_message=user_message,
                provider=provider,
                api_key=api_key,
                model_name=model_name,
                api_base=api_base,
                history_messages=history_messages
            )
            return reply, provider
        except Exception as e:
            logger.warning(f"Failed to get response from {provider}: {e}. Falling back to knowledge_base.")

    elif provider == 'gemini' and api_key:
        try:
            reply = call_gemini_api(user_message, api_key, model_name)
            return reply, 'gemini'
        except Exception as e:
            logger.warning(f"Failed to get response from gemini: {e}. Falling back to knowledge_base.")

    elif provider == 'ollama':
        try:
            reply = call_ollama_api(user_message, model_name, api_base, history_messages)
            return reply, 'ollama'
        except Exception as e:
            logger.warning(f"Failed to get response from ollama: {e}. Falling back to knowledge_base.")

    # المحرك الذكي المعتمد على قاعدة المعرفة (Knowledge Base Smart Engine)
    reply = smart_knowledge_base_reply(user_message)
    return reply, 'knowledge_base'


# ==============================================================================
# محرك المعرفة المحلي الذكي (Built-in Contextual Knowledge Engine)
# ==============================================================================
def smart_knowledge_base_reply(text: str) -> str:
    """
    يحلل نص الرسالة ويولد رداً سياقياً دقيقاً ومفصلاً انطلاقاً من قاعدة معرفة Mit AI
    """
    norm = text.lower().strip()

    # 1. التحيات والترحيب
    greeting_patterns = ['مرحبا', 'مرحباً', 'أهلا', 'اهلاً', 'اهلا', 'السلام عليكم', 'سلام', 'صباح الخير', 'مساء الخير', 'هاي', 'hello', 'hi']
    if any(re.search(r'\b' + re.escape(p) + r'\b', norm) for p in greeting_patterns) or norm in greeting_patterns:
        return (
            "أهلاً وسهلاً بك! 👋 أنا Mit، المساعد الرقمي لشركة Mit AI Technology.\n"
            "يسعدني جداً مساعدتك اليوم. هل تود التعرف على خدماتنا في الذكاء الاصطناعي، أم ترغب في حجز استشارة مجانية لمشروعك؟"
        )

    # 2. من أنت / شخصية Mit
    identity_patterns = ['من أنت', 'من انت', 'مين انت', 'عرف عن نفسك', 'شكون انت', 'what are you', 'who are you', 'ما هو mit', 'ما هي شركة']
    if any(p in norm for p in identity_patterns):
        return (
            f"أنا {COMPANY_KNOWLEDGE['persona']}\n"
            f"أمثل شركة {COMPANY_KNOWLEDGE['name_ar']}؛ مهمتنا هي مساعدة الشركات على أتمتة أعمالها وتطوير أنظمة محادثة وتحليلات تنبؤية ذكية.\n"
            "كيف يمكنني دعمك أو دعم شركتك اليوم؟"
        )

    # 3. التواصل وأرقام الاتصال والبريد
    contact_patterns = ['تواصل', 'اتصال', 'رقم', 'هاتف', 'ايميل', 'بريد', 'إيميل', 'واتس', 'واتساب', 'عنوان', 'موقعكم', 'مكانكم', 'contact', 'email', 'phone']
    if any(p in norm for p in contact_patterns):
        return (
            "يسعدنا تواصلك معنا دائماً! 📞✉️\n\n"
            f"• البريد الإلكتروني: {COMPANY_KNOWLEDGE['contact']['email']}\n"
            f"• الهاتف / واتساب: {COMPANY_KNOWLEDGE['contact']['phone']}\n"
            "• كما يمكنك حجز استشارة مجانية مباشرة عبر نموذج 'احجز استشارتك الآن' أسفل الصفحة وسيتواصل معك خبراؤنا فوراً."
        )

    # 4. حجز الاستشارة
    consultation_patterns = ['استشارة', 'احجز', 'موعد', 'اجتماع', 'استشاره', 'مقابلة', 'book', 'consultation', 'meeting']
    if any(p in norm for p in consultation_patterns):
        return (
            "بالتأكيد! 🤝 نقدم في Mit AI استشارة أولية مجانية لتحليل طبيعة عملك واقتراح الحل الأمثل لك.\n"
            "يمكنك النقر على زر 'احجز استشارتك الآن' في الموقع وتعبئة بياناتك، أو ترك اسمك ورقمك وسيتولى فريقنا التواصل معك لتحديد الموعد المناسب."
        )

    # 5. الخدمات بالتفصيل
    # 5.1 المحادثة الذكية / الشات بوت
    chat_service_patterns = ['محادثة', 'شات', 'بوت', 'شاتبوت', 'صوتي', 'مساعد رقمي', 'خدمة عملاء', 'chatbot', 'voice']
    if any(p in norm for p in chat_service_patterns):
        svc = COMPANY_KNOWLEDGE['services'][0]
        return (
            f"💡 **{svc['title']}**:\n"
            f"{svc['details']}\n\n"
            "نوفر روبوتات ومساعدين مخصصين يتم تدريبهم على بيانات شركتك للإجابة عن العملاء صوتياً ونصوصاً بدقة متناهية 24/7. "
            "هل تود تخصيص مساعد ذكي مثل Mit لعملك؟"
        )

    # 5.2 تحليل البيانات والأنظمة التنبؤية
    data_service_patterns = ['تحليل', 'بيانات', 'تنبؤ', 'تنبؤية', 'مبيعات', 'لوحات تحكم', 'dashboard', 'analytics', 'data']
    if any(p in norm for p in data_service_patterns):
        svc = COMPANY_KNOWLEDGE['services'][1]
        return (
            f"📊 **{svc['title']}**:\n"
            f"{svc['details']}\n\n"
            "نساعدك على قراءة أرقام عملك واستشراف توجهات السوق بدقة لاتخاذ قرارات استثمارية وتشغيلية موفقة. هل تملك بيانات ترغب بتحليلها وتفعيل التنبؤات بها؟"
        )

    # 5.3 الحلول المخصصة والأتمتة
    custom_service_patterns = ['مخصص', 'أتمتة', 'اتمتة', 'مودل', 'تدريب', 'qwen', 'llama', 'fine-tuning', 'rag', 'سير عمل']
    if any(p in norm for p in custom_service_patterns):
        svc = COMPANY_KNOWLEDGE['services'][2]
        return (
            f"⚙️ **{svc['title']}**:\n"
            f"{svc['details']}\n\n"
            "نقوم ببناء وتدريب نماذج ذكاء اصطناعي مغلقة وخاصة بمؤسستك مع ضمان أعلى معايير الخصوصية والأمان. هل لديك مسار عمل معين ترغب في أتمتته؟"
        )

    # 5.4 الخدمات بشكل عام
    general_services_patterns = ['خدمات', 'ماذا تقدمون', 'شو بتقدمو', 'خدماتكم', 'منتجات', 'services', 'حلول']
    if any(p in norm for p in general_services_patterns):
        services_text = "\n".join([f"• **{s['title']}**: {s['summary']}" for s in COMPANY_KNOWLEDGE['services']])
        return (
            f"نقدم في **{COMPANY_KNOWLEDGE['name_ar']}** باقة متكاملة من حلول الذكاء الاصطناعي:\n\n"
            f"{services_text}\n\n"
            "أي من هذه الحلول يثير اهتمامك لمعرفة تفاصيل إضافية عنه؟"
        )

    # 6. الأسعار والتكلفة
    pricing_patterns = ['سعر', 'اسعار', 'أسعار', 'تكلفة', 'تكلفه', 'بكم', 'كم السعر', 'pricing', 'cost', 'price']
    if any(p in norm for p in pricing_patterns):
        return (
            "تختلف التكلفة وفقاً لحجم المشروع، وطبيعة البيانات، ومستوى التخصيص المطلوب (سواء كان مساعداً ذكياً، أو لوحة بيانات تنبؤية، أو تدريب نموذج مخصص).\n\n"
            "لذلك ندعوك لحجز **استشارة مجانية** مع فريقنا الهندسي لدراسة متطلباتك بدقة وتقديم عرض مالي وفني مفصل ومناسب لميزانيتك. يمكنك حجزها عبر الموقع الآن!"
        )

    # 7. الشكر والوداع
    thanks_patterns = ['شكرا', 'شكراً', 'تسلم', 'يعطيك العافية', 'مشكور', 'thanks', 'thank you']
    if any(p in norm for p in thanks_patterns):
        return "على الرحب والسعة دائماً! يسعدني جداً خدمتك، وأنا هنا بأي وقت إذا كانت لديك أية تساؤلات أخرى. أتمنى لك يوماً سعيداً ومليئاً بالإنجاز! ✨"

    # الرد التلقائي العام الموجه نحو القيمة
    return (
        f"شكراً لاستفسارك! في **{COMPANY_KNOWLEDGE['name_ar']}** نبتكر حلول ذكاء اصطناعي متكاملة (مساعدات محادثة ذكية، تحليل بيانات تنبؤية، وحلول مخصصة).\n\n"
        "يمكنني مساعدتك في:\n"
        "1. شرح تفاصيل أي من خدماتنا التقنية.\n"
        "2. توضيح آلية حجز استشارة مجانية لمشروعك.\n"
        "3. تزويدك بمعلومات التواصل المباشر مع فريقنا.\n\n"
        "عن ماذا ترغب أن نتحدث بالتحديد؟"
    )


# ==============================================================================
# تكاملات الـ LLMs الخارجية (OpenAI, Gemini, Ollama)
# ==============================================================================
def call_openai_compatible_api(user_message: str, provider: str, api_key: str, model_name: str, api_base: str, history_messages: list = None) -> str:
    """
    الاتصال بأي خادم متوافق مع OpenAI Chat Completions API
    (OpenAI, Groq, DeepSeek, Together, vLLM, أو سيرفر Qwen مخصص)
    """
    if api_base:
        url = api_base.rstrip('/') + '/chat/completions'
    elif provider == 'groq':
        url = 'https://api.groq.com/openai/v1/chat/completions'
        if not model_name or 'qwen' not in model_name:
            model_name = 'llama-3.3-70b-versatile'
    else:
        url = 'https://api.openai.com/v1/chat/completions'
        if not model_name:
            model_name = 'gpt-4o-mini'

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    # إضافة سجل المحادثة السابق (آخر 6 رسائل كحد أقصى)
    if history_messages:
        for msg in history_messages[-6:]:
            role = 'assistant' if msg.get('role') == 'assistant' else 'user'
            messages.append({"role": role, "content": msg.get('content', '')})

    messages.append({"role": "user", "content": user_message})

    headers = {
        "Content-Type": "application/json",
    }
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"

    payload = {
        "model": model_name,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 600,
    }

    response = requests.post(url, headers=headers, json=payload, timeout=20)
    response.raise_for_status()
    data = response.json()
    return data['choices'][0]['message']['content'].strip()


def call_gemini_api(user_message: str, api_key: str, model_name: str) -> str:
    """الاتصال بـ Google Gemini API"""
    model = model_name if model_name and 'gemini' in model_name else 'gemini-1.5-flash'
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": f"{SYSTEM_PROMPT}\n\nرسالة المستخدم: {user_message}"}]
            }
        ],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 600,
        }
    }

    response = requests.post(url, json=payload, timeout=20)
    response.raise_for_status()
    data = response.json()
    candidates = data.get('candidates', [])
    if candidates and 'content' in candidates[0]:
        parts = candidates[0]['content'].get('parts', [])
        if parts and 'text' in parts[0]:
            return parts[0]['text'].strip()

    raise ValueError("Empty response from Gemini")


def call_ollama_api(user_message: str, model_name: str, api_base: str, history_messages: list = None) -> str:
    """الاتصال بسيرفر Ollama محلي (مثل Qwen 2.5)"""
    base = api_base.rstrip('/') if api_base else 'http://localhost:11434'
    url = f"{base}/api/chat"
    model = model_name if model_name else 'qwen2.5:latest'

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    if history_messages:
        for msg in history_messages[-6:]:
            role = 'assistant' if msg.get('role') == 'assistant' else 'user'
            messages.append({"role": role, "content": msg.get('content', '')})
    messages.append({"role": "user", "content": user_message})

    payload = {
        "model": model,
        "messages": messages,
        "stream": False
    }

    response = requests.post(url, json=payload, timeout=25)
    response.raise_for_status()
    data = response.json()
    return data.get('message', {}).get('content', '').strip()
