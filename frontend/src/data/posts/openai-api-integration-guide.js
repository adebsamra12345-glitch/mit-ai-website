export default {
  slug: 'openai-api-integration-guide',
  title: 'ربط OpenAI API بتطبيقك: دليل عملي من الإعداد إلى الإنتاج',
  description:
    'دليل ربط OpenAI API: الإعداد، Responses API و Chat Completions، البث المباشر، المخرجات المنظمة JSON، استدعاء الدوال، التضمينات (Embeddings) للبحث الدلالي، وإدارة التكلفة والأخطاء.',
  category: 'ربط الـ APIs',
  lang: 'ar',
  date: '2026-10-05',
  updated: '2026-10-06',
  readMinutes: 9,
  tags: ['OpenAI API', 'Responses API', 'Embeddings', 'Function Calling'],
  body: [
    {
      t: 'p',
      c: 'تقدم OpenAI واجهات متعددة للنماذج اللغوية والتضمينات والصوت والصور. هذا الدليل يغطي ما يحتاجه معظم المطورين لبناء ميزة دردشة أو بحث ذكي أو استخراج بيانات منظمة، مع الانتباه لما يهم الإنتاج.',
    },
    { t: 'toc' },
    {
      t: 'callout',
      kind: 'info',
      title: 'ملاحظة حول أسماء النماذج',
      c: 'نستخدم في الأمثلة متغير بيئة `OPENAI_MODEL` بدل اسم ثابت لأن النماذج المتاحة وأسعارها تتغير باستمرار. اختر النموذج من صفحة النماذج في توثيق OpenAI بحسب جودته وسرعته وتكلفته.',
    },
    { t: 'h2', c: '1. الإعداد' },
    {
      t: 'code',
      lang: 'bash',
      c: `pip install openai
export OPENAI_API_KEY="sk-..."
export OPENAI_MODEL="<model-id-from-docs>"`,
    },
    { t: 'h2', c: '2. أول طلب عبر Responses API' },
    {
      t: 'p',
      c: 'Responses API هي الواجهة الأحدث والموصى بها للمشاريع الجديدة، وتدمج النص والأدوات في واجهة واحدة.',
    },
    {
      t: 'code',
      lang: 'python',
      c: `import os
from openai import OpenAI

client = OpenAI()  # يقرأ OPENAI_API_KEY

response = client.responses.create(
    model=os.environ["OPENAI_MODEL"],
    instructions="أنت مساعد دعم لشركة Mit AI. أجب بالعربية وباختصار.",
    input="ما هي خدماتكم؟",
)
print(response.output_text)`,
    },
    { t: 'h2', c: '3. Chat Completions: الواجهة الكلاسيكية' },
    {
      t: 'p',
      c: 'ما زالت واسعة الاستخدام، وهي الصيغة التي تتبناها معظم الخوادم المتوافقة مع OpenAI (Ollama و vLLM وغيرها)، لذلك تبقى مفيدة إذا أردت التبديل بين المزوّدين بتغيير `base_url` فقط.',
    },
    {
      t: 'code',
      lang: 'python',
      c: `completion = client.chat.completions.create(
    model=os.environ["OPENAI_MODEL"],
    messages=[
        {"role": "system", "content": "أنت مساعد Mit."},
        {"role": "user", "content": "مرحباً"},
    ],
)
print(completion.choices[0].message.content)`,
    },
    { t: 'h2', c: '4. البث المباشر' },
    {
      t: 'code',
      lang: 'python',
      c: `stream = client.chat.completions.create(
    model=os.environ["OPENAI_MODEL"],
    messages=[{"role": "user", "content": "اشرح RAG ببساطة"}],
    stream=True,
)
for chunk in stream:
    delta = chunk.choices[0].delta.content
    if delta:
        print(delta, end="", flush=True)`,
    },
    { t: 'h2', c: '5. مخرجات منظمة (JSON) بدون تخمين' },
    {
      t: 'p',
      c: 'عندما تحتاج بيانات يقرأها كودك (استخراج اسم ورقم وتاريخ من رسالة)، لا تعتمد على "اطلب من النموذج إرجاع JSON". استخدم المخرجات المنظمة المرتبطة بمخطط، وتحقق من النتيجة بمكتبة مثل Pydantic.',
    },
    {
      t: 'code',
      lang: 'python',
      c: `from pydantic import BaseModel

class Lead(BaseModel):
    name: str
    email: str | None
    interest: str

completion = client.chat.completions.parse(
    model=os.environ["OPENAI_MODEL"],
    messages=[
        {"role": "system", "content": "استخرج بيانات العميل المحتمل."},
        {"role": "user", "content": "أنا سارة، مهتمة بروبوت دردشة لمتجري. sara@example.com"},
    ],
    response_format=Lead,
)
lead = completion.choices[0].message.parsed`,
    },
    { t: 'h2', c: '6. استدعاء الدوال (Function Calling)' },
    {
      t: 'p',
      c: 'كما في Claude، تصف دوالك بمخطط JSON، فيقرر النموذج متى يطلب استدعاءها، وتنفذها أنت وتعيد النتيجة. المبدأ واحد عبر المزوّدين، وهو ما يسهّل بناء [طبقة موحدة](/blog/multi-provider-llm-gateway).',
    },
    {
      t: 'code',
      lang: 'python',
      c: `tools = [{
    "type": "function",
    "function": {
        "name": "get_order_status",
        "description": "حالة الطلب برقمه",
        "parameters": {
            "type": "object",
            "properties": {"order_id": {"type": "string"}},
            "required": ["order_id"],
        },
    },
}]
completion = client.chat.completions.create(
    model=os.environ["OPENAI_MODEL"], messages=messages, tools=tools
)
calls = completion.choices[0].message.tool_calls or []`,
    },
    { t: 'h2', c: '7. التضمينات للبحث الدلالي و RAG' },
    {
      t: 'code',
      lang: 'python',
      c: `emb = client.embeddings.create(
    model="text-embedding-3-small",
    input=["كيف أحجز استشارة؟", "سياسة الاسترجاع"],
)
vectors = [item.embedding for item in emb.data]
# خزّنها في pgvector أو Qdrant أو Pinecone ثم ابحث بأقرب تشابه`,
    },
    {
      t: 'p',
      c: 'التفاصيل المعمارية لهذا النمط في [كيف تحسّن بحث موقعك بالذكاء الاصطناعي](/blog/improve-website-search-with-ai) وفي صفحة [Enterprise RAG](/services/enterprise-rag-solutions).',
    },
    { t: 'h2', c: '8. التكلفة والموثوقية' },
    {
      t: 'ul',
      items: [
        '**التسعير بالرموز (tokens):** سجّل `usage` لكل طلب وضع سقفاً شهرياً في لوحة التحكم.',
        '**حدود المعدل (429):** أعد المحاولة بتأخير تصاعدي مع عشوائية (exponential backoff + jitter). الـ SDK الرسمي يعيد المحاولة تلقائياً لأخطاء معينة.',
        '**المهلات:** حدد `timeout` معقولاً، وفكّر بالبث للردود الطويلة.',
        '**الخصوصية:** لا ترسل بيانات شخصية غير ضرورية، وراجع سياسات الاحتفاظ بالبيانات في حسابك.',
        '**الإشراف:** إن كان تطبيقك مفتوحاً للعامة فاستخدم أدوات الإشراف على المحتوى ورقابة المدخلات.',
      ],
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'Claude أم OpenAI؟',
      c: 'لا يوجد "أفضل" مطلق؛ يعتمد على مهمتك. اختبر الاثنين على 50 سؤالاً حقيقياً من عملك وقارن الجودة والزمن والتكلفة. وإن بنيت الطبقة الموحدة من البداية فلن تحتاج للالتزام بمزوّد واحد. انظر [دليل Claude API](/blog/claude-api-integration-guide).',
    },
  ],
  faqs: [
    {
      question: 'ما الفرق بين Responses API و Chat Completions؟',
      answer:
        'Responses API هي الواجهة الأحدث التي توحّد النص والأدوات والحالة، وChat Completions هي الواجهة الكلاسيكية المدعومة على نطاق واسع في الخوادم المتوافقة مع OpenAI.',
    },
    {
      question: 'كيف أحمي مفتاح OpenAI API؟',
      answer:
        'خزّنه في متغيرات البيئة على الخادم فقط، ولا تضعه في كود الواجهة الأمامية، وحدّد سقف إنفاق، ودوّره دورياً.',
    },
  ],
}
