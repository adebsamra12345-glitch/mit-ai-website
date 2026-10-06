export default {
  slug: 'multi-provider-llm-gateway',
  title: 'بناء طبقة موحدة لعدة مزوّدين: Claude و OpenAI والنماذج المحلية',
  description:
    'كيف تصمم خدمة Backend تتبدل بين Claude و OpenAI والنماذج المحلية بسهولة: واجهة موحدة، التراجع التلقائي (Fallback)، التحكم بالتكلفة، المراقبة، وحماية المفاتيح.',
  category: 'ربط الـ APIs',
  lang: 'ar',
  date: '2026-10-06',
  updated: '2026-10-06',
  readMinutes: 8,
  tags: ['Architecture', 'LLM Gateway', 'Fallback', 'Claude API', 'OpenAI API'],
  body: [
    {
      t: 'p',
      c: 'الاعتماد على مزوّد واحد يعني أن توقفه أو رفع أسعاره أو تغيير نموذجه يصبح مشكلة في منتجك. الحل: طبقة رفيعة بينك وبين المزوّدين تعرض واجهة واحدة لباقي التطبيق. هكذا بنينا مساعد Mit في هذا الموقع.',
    },
    { t: 'toc' },
    { t: 'h2', c: 'المبدأ: واجهة صغيرة وتنفيذات متعددة' },
    {
      t: 'p',
      c: 'يحتاج تطبيقك دالة واحدة: أعطني سجل المحادثة وتعليمات النظام، وأرجع نصاً. كل مزوّد يُنفَّذ خلف هذه الدالة، ويُختار بمتغير بيئة.',
    },
    {
      t: 'code',
      lang: 'python',
      c: `import os
from typing import Callable

Message = dict[str, str]  # {"role": "user" | "assistant", "content": "..."}
Provider = Callable[[str, list[Message]], str]  # (system_prompt, messages) -> reply

def call_anthropic(system: str, messages: list[Message]) -> str:
    import anthropic
    client = anthropic.Anthropic(api_key=os.environ["AI_API_KEY"])
    response = client.messages.create(
        model=os.environ["AI_MODEL_NAME"],
        max_tokens=600,
        system=system,
        messages=messages,
    )
    return response.content[0].text

def call_openai_compatible(system: str, messages: list[Message]) -> str:
    from openai import OpenAI
    client = OpenAI(
        api_key=os.environ.get("AI_API_KEY") or "not-needed",
        base_url=os.environ.get("AI_API_BASE") or None,  # Ollama / vLLM / OpenAI
    )
    completion = client.chat.completions.create(
        model=os.environ["AI_MODEL_NAME"],
        messages=[{"role": "system", "content": system}, *messages],
    )
    return completion.choices[0].message.content

PROVIDERS: dict[str, Provider] = {
    "anthropic": call_anthropic,
    "openai": call_openai_compatible,
    "ollama": call_openai_compatible,   # Ollama يعرض واجهة متوافقة مع OpenAI
    "custom": call_openai_compatible,
}`,
    },
    { t: 'h2', c: 'التراجع التلقائي (Fallback)' },
    {
      t: 'p',
      c: 'أي مزوّد خارجي قد يفشل: مهلة، 429، 5xx. اجعل آخر حلقة في السلسلة **محلية وبلا شبكة** (قاعدة معرفة أو قوالب ردود)، فلا يرى المستخدم صفحة خطأ أبداً.',
    },
    {
      t: 'code',
      lang: 'python',
      c: `import logging
logger = logging.getLogger(__name__)

def generate_reply(system, messages, user_text):
    name = os.getenv("AI_PROVIDER", "knowledge_base")
    provider = PROVIDERS.get(name)
    if provider:
        try:
            return provider(system, messages), name
        except Exception:
            logger.exception("provider %s failed, using fallback", name)
    return knowledge_base_reply(user_text), "knowledge_base"`,
    },
    { t: 'h2', c: 'أفضل الممارسات' },
    {
      t: 'ul',
      items: [
        '**المفاتيح على الخادم فقط** ومن متغيرات البيئة، مع تدوير دوري.',
        '**السجل المختصر:** أرسل آخر 6–10 رسائل فقط؛ هذا يخفض التكلفة ويحدّ من تضخم السياق.',
        '**حدود الاستخدام:** سقف لطول الرسالة وعدد الرسائل لكل جلسة وIP، لمنع إساءة الاستخدام واستنزاف الميزانية.',
        '**المراقبة:** سجّل المزوّد المستخدم، الزمن، الرموز المستهلكة، وحالات التراجع. هذه بيانات قرارك القادم.',
        '**المهلات القصيرة:** 15–25 ثانية للدردشة، ثم تراجع. المستخدم لن ينتظر أكثر.',
        '**اختبار مقارن دوري:** شغّل مجموعة أسئلتك الثابتة على كل مزوّد وقارن الجودة والتكلفة قبل تغيير الإعداد الافتراضي.',
        '**حقن التعليمات (Prompt Injection):** عامل مدخلات المستخدم والوثائق المسترجعة كنص غير موثوق، ولا تمنح النموذج صلاحيات أكثر مما يلزم.',
      ],
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'أين تضع النموذج المحلي؟',
      c: 'استخدم نموذجاً محلياً مضبوطاً ([دليل التدريب](/blog/local-llm-training-guide)) للمهام المتكررة والحساسة للخصوصية، وواجهة سحابية ([Claude](/blog/claude-api-integration-guide) أو [OpenAI](/blog/openai-api-integration-guide)) للمهام الصعبة. الطبقة الموحدة تتيح التوجيه بين الاثنين حسب نوع الطلب.',
    },
  ],
  faqs: [
    {
      question: 'لماذا لا أستخدم مزوّداً واحداً فقط؟',
      answer:
        'يمكنك ذلك، لكن الطبقة الموحدة تقلل مخاطر توقف الخدمة وتغيّر الأسعار وتتيح لك المقارنة والتحسين دون إعادة كتابة التطبيق.',
    },
  ],
}
