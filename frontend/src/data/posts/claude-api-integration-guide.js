export default {
  slug: 'claude-api-integration-guide',
  title: 'ربط Claude API بتطبيقك: دليل عملي بـ Python و JavaScript',
  description:
    'دليل ربط Claude API من الصفر: إنشاء المفتاح، أول طلب، البث المباشر (Streaming)، استخدام الأدوات (Tool Use)، التخزين المؤقت للأوامر (Prompt Caching)، ومعالجة الأخطاء في بيئة الإنتاج.',
  category: 'ربط الـ APIs',
  lang: 'ar',
  date: '2026-10-05',
  updated: '2026-10-06',
  readMinutes: 10,
  tags: ['Claude API', 'Anthropic', 'Streaming', 'Tool Use', 'Prompt Caching'],
  featured: true,
  body: [
    {
      t: 'p',
      c: 'Claude API من Anthropic يتيح لك دمج نماذج Claude في موقعك أو تطبيقك أو خدمة الدعم لديك عبر نقطة نهاية واحدة هي Messages API. في هذا الدليل نبني تكاملاً كاملاً خطوة بخطوة، مع الإشارة إلى الممارسات التي تحتاجها قبل الانتقال إلى الإنتاج.',
    },
    { t: 'toc' },
    { t: 'h2', c: '1. الإعداد' },
    {
      t: 'ol',
      items: [
        'أنشئ حساباً في Anthropic Console وولّد مفتاح API.',
        'خزّن المفتاح في متغير بيئة `ANTHROPIC_API_KEY` ولا تضعه أبداً في كود الواجهة الأمامية أو المستودع.',
        'ثبّت الحزمة الرسمية.',
      ],
    },
    {
      t: 'code',
      lang: 'bash',
      c: `pip install anthropic          # Python
npm install @anthropic-ai/sdk  # JavaScript / TypeScript`,
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'أمان المفتاح',
      c: 'أي مفتاح يظهر في كود المتصفح يمكن لأي شخص سرقته. اجعل تطبيقك يستدعي **خادمك** (backend)، وخادمك هو من يستدعي Claude. هذا ما نفعله في مساعد Mit على هذا الموقع.',
    },
    { t: 'h2', c: '2. أول طلب' },
    {
      t: 'code',
      lang: 'python',
      c: `import anthropic

client = anthropic.Anthropic()  # يقرأ ANTHROPIC_API_KEY من البيئة

message = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=1024,
    system="أنت مساعد دعم لشركة Mit AI. أجب بالعربية وباختصار.",
    messages=[{"role": "user", "content": "ما هي خدمات الشركة؟"}],
)

print(message.content[0].text)`,
    },
    {
      t: 'code',
      lang: 'javascript',
      c: `import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // يقرأ ANTHROPIC_API_KEY

const message = await client.messages.create({
  model: "claude-opus-5-5",
  max_tokens: 1024,
  system: "أنت مساعد دعم لشركة Mit AI. أجب بالعربية وباختصار.",
  messages: [{ role: "user", content: "ما هي خدمات الشركة؟" }],
});

console.log(message.content[0].text);`,
    },
    {
      t: 'ul',
      items: [
        '`system` هو مكان تعليمات الشخصية والقواعد، وهو حقل مستقل عن `messages`.',
        '`max_tokens` حد أقصى لطول الرد؛ إن كان صغيراً جداً سيُقطع الرد في منتصفه.',
        'تتغير معرّفات النماذج وخصائصها بسرعة. راجع صفحة النماذج في توثيق Anthropic لاختيار الأنسب لحالتك من حيث الجودة والسرعة والتكلفة.',
        'في بعض النماذج الأحدث لا تُقبل معاملات مثل `temperature`؛ إن ظهر خطأ 400 فراجع التوثيق الخاص بالنموذج.',
      ],
    },
    { t: 'h2', c: '3. المحادثات متعددة الأدوار' },
    {
      t: 'p',
      c: 'الـ API **بلا حالة** (stateless): أنت من يرسل سجل المحادثة كاملاً في كل طلب، مع تبادل الأدوار `user` و `assistant`. احتفظ بالسجل في قاعدة بياناتك، وقلّصه (آخر N رسائل أو تلخيص) لضبط التكلفة.',
    },
    {
      t: 'code',
      lang: 'python',
      c: `history = [
    {"role": "user", "content": "أريد مساعداً صوتياً لمتجري."},
    {"role": "assistant", "content": "ممتاز! كم عدد المنتجات تقريباً؟"},
    {"role": "user", "content": "حوالي 300 منتج."},
]
reply = client.messages.create(model="claude-opus-5-5", max_tokens=600, messages=history)`,
    },
    { t: 'h2', c: '4. البث المباشر (Streaming)' },
    {
      t: 'p',
      c: 'لواجهات الدردشة، البث يعرض الرد كلمة بكلمة فيشعر المستخدم بالسرعة، ويحميك من انتهاء المهلة في الردود الطويلة.',
    },
    {
      t: 'code',
      lang: 'python',
      c: `with client.messages.stream(
    model="claude-opus-5-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "اشرح RAG ببساطة"}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)

final = stream.get_final_message()  # الرسالة الكاملة وعدد الرموز المستهلكة`,
    },
    { t: 'h2', c: '5. استخدام الأدوات (Tool Use)' },
    {
      t: 'p',
      c: 'تعرّف أدواتك (دوال في كودك) بوصف ومخطط JSON. عندما يحتاج Claude أداة يرجع كتلة `tool_use`، فتنفّذها أنت وتعيد النتيجة في `tool_result`. هكذا يستعلم المساعد عن حالة طلب أو يحجز موعداً.',
    },
    {
      t: 'code',
      lang: 'python',
      c: `tools = [{
    "name": "get_order_status",
    "description": "يرجع حالة طلب العميل برقم الطلب.",
    "input_schema": {
        "type": "object",
        "properties": {"order_id": {"type": "string"}},
        "required": ["order_id"],
    },
}]

messages = [{"role": "user", "content": "أين طلبي رقم A-1042؟"}]
response = client.messages.create(
    model="claude-opus-5-5", max_tokens=1024, tools=tools, messages=messages
)

while response.stop_reason == "tool_use":
    messages.append({"role": "assistant", "content": response.content})
    results = []
    for block in response.content:
        if block.type == "tool_use":
            output = lookup_order(block.input["order_id"])  # دالتك
            results.append({
                "type": "tool_result",
                "tool_use_id": block.id,
                "content": output,
            })
    messages.append({"role": "user", "content": results})
    response = client.messages.create(
        model="claude-opus-5-5", max_tokens=1024, tools=tools, messages=messages
    )

print(response.content[0].text)`,
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'ملاحظات مهمة',
      c: 'أعد جميع نتائج الأدوات المتوازية في **رسالة مستخدم واحدة**، وعند فشل أداة أعد `tool_result` مع `is_error: true` بدل إسقاطه. ولا تثق بمدخلات الأداة: تحقق منها كأي مدخل مستخدم.',
    },
    { t: 'h2', c: '6. التخزين المؤقت للأوامر (Prompt Caching)' },
    {
      t: 'p',
      c: 'إذا كان لديك system prompt طويل أو وثائق ثابتة تُرسل في كل طلب، فعّل التخزين المؤقت لتدفع أقل على الجزء المتكرر وتحصل على استجابة أسرع. ضع `cache_control` على آخر كتلة ثابتة، وأبقِ المحتوى المتغير بعدها.',
    },
    {
      t: 'code',
      lang: 'python',
      c: `response = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=600,
    system=[{
        "type": "text",
        "text": LONG_COMPANY_KNOWLEDGE,          # ثابت بين الطلبات
        "cache_control": {"type": "ephemeral"},
    }],
    messages=[{"role": "user", "content": user_question}],
)
print(response.usage.cache_read_input_tokens)  # > 0 يعني أن الكاش يعمل`,
    },
    {
      t: 'p',
      c: 'أي تغيير في البادئة (مثل طابع زمني داخل الـ system prompt) يُبطل الكاش. وهناك حد أدنى لطول المحتوى القابل للتخزين يختلف بحسب النموذج.',
    },
    { t: 'h2', c: '7. الأخطاء والموثوقية' },
    {
      t: 'code',
      lang: 'python',
      c: `import anthropic

try:
    message = client.messages.create(...)
except anthropic.RateLimitError:
    ...  # 429: أعد المحاولة بتأخير تصاعدي
except anthropic.APIConnectionError:
    ...  # مشكلة شبكة
except anthropic.APIStatusError as e:
    ...  # بقية أخطاء الـ API (e.status_code)`,
    },
    {
      t: 'ul',
      items: [
        'الـ SDK يعيد المحاولة تلقائياً مرتين افتراضياً عند أخطاء الشبكة و 429 و 5xx.',
        'تحقق من `stop_reason` قبل استخدام الرد: القيمة `refusal` تعني أن النموذج رفض الطلب، و `max_tokens` تعني أن الرد قُطع.',
        'سجّل `usage` (الرموز المُدخلة والمُخرجة) لكل طلب لتراقب التكلفة.',
        'ضع حداً لطول رسالة المستخدم ولمعدل الطلبات لكل جلسة لحماية ميزانيتك.',
      ],
    },
    { t: 'h2', c: 'كيف نستخدمه في مساعد Mit' },
    {
      t: 'p',
      c: 'الـ backend في هذا الموقع يدعم Claude كمزوّد ذكاء اصطناعي: يكفي ضبط `AI_PROVIDER=anthropic` ومفتاح `AI_API_KEY` في ملف `.env`، وإن تعذّر الاتصال يتراجع المساعد تلقائياً إلى قاعدة المعرفة المحلية. للمقارنة مع المزوّد الآخر اقرأ [ربط OpenAI API](/blog/openai-api-integration-guide) و[بناء طبقة موحدة لعدة مزوّدين](/blog/multi-provider-llm-gateway).',
    },
  ],
  faqs: [
    {
      question: 'هل يمكن استدعاء Claude API مباشرة من المتصفح؟',
      answer:
        'لا يُنصح بذلك لأنه يكشف مفتاح الـ API. الأسلوب الصحيح أن يستدعي المتصفح خادمك وهو يستدعي Claude.',
    },
    {
      question: 'كيف أخفض تكلفة استخدام Claude API؟',
      answer:
        'فعّل Prompt Caching للمحتوى المتكرر، قلّص سجل المحادثة، اضبط max_tokens، اختر النموذج الأنسب للمهمة، وراقب usage في كل طلب.',
    },
  ],
}
