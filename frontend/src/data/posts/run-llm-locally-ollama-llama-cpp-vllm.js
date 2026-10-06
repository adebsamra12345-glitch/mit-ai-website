export default {
  slug: 'run-llm-locally-ollama-llama-cpp-vllm',
  title: 'تشغيل نماذج LLM محلياً: مقارنة Ollama و llama.cpp و vLLM',
  description:
    'مقارنة عملية بين Ollama و llama.cpp و vLLM لتشغيل نماذج اللغة محلياً: السهولة، الأداء، دعم المستخدمين المتعددين، وكيفية الربط مع تطبيقك عبر واجهة متوافقة مع OpenAI.',
  category: 'النشر المحلي',
  lang: 'ar',
  date: '2026-10-04',
  updated: '2026-10-06',
  readMinutes: 8,
  tags: ['Ollama', 'llama.cpp', 'vLLM', 'GGUF', 'Self-hosting'],
  body: [
    {
      t: 'p',
      c: 'بعد ضبط النموذج تأتي مرحلة تشغيله. اختيار أداة التشغيل يحدد تكلفتك وزمن الاستجابة وعدد المستخدمين الذين يمكنك خدمتهم. هذه مقارنة عملية بين الأدوات الثلاث الأشهر.',
    },
    { t: 'toc' },
    {
      t: 'table',
      head: ['', 'Ollama', 'llama.cpp', 'vLLM'],
      rows: [
        ['السهولة', 'الأعلى: أمر واحد', 'متوسطة', 'تحتاج GPU وإعداداً'],
        ['العتاد', 'CPU و GPU و Apple Silicon', 'CPU و GPU و Apple Silicon', 'GPU (NVIDIA بالدرجة الأولى)'],
        ['الصيغة', 'GGUF عبر Modelfile', 'GGUF', 'Safetensors (Hugging Face)'],
        ['عدة مستخدمين بالتزامن', 'محدود', 'جيد مع إعداد', 'ممتاز (Continuous batching)'],
        ['الأنسب لـ', 'التطوير والتجارب وأجهزة المكاتب', 'تحكم دقيق وأجهزة محدودة', 'الإنتاج بحمل عالٍ'],
      ],
    },
    { t: 'h2', c: 'Ollama: الأسرع للبدء' },
    {
      t: 'p',
      c: 'يُنزّل النماذج ويشغّلها كخدمة محلية بواجهة REST. مناسب للتجارب ولأدوات داخلية بحمل خفيف.',
    },
    {
      t: 'code',
      lang: 'bash',
      c: `ollama pull qwen2.5:7b
ollama run qwen2.5:7b "عرّف RAG في جملة"`,
    },
    {
      t: 'p',
      c: 'لتشغيل نموذجك المضبوط، أنشئ ملف `Modelfile` يشير إلى ملف GGUF:',
    },
    {
      t: 'code',
      lang: 'bash',
      c: `# Modelfile
FROM ./mit-merged-Q4_K_M.gguf
PARAMETER temperature 0.3
SYSTEM "أنت Mit، المساعد الرقمي لشركة Mit AI Technology."

# ثم:
ollama create mit-assistant -f Modelfile
ollama run mit-assistant`,
    },
    { t: 'h2', c: 'llama.cpp: تحكم كامل وأجهزة متواضعة' },
    {
      t: 'p',
      c: 'المحرك الذي بُنيت عليه أدوات كثيرة. يوفّر `llama-server` خادماً بواجهة متوافقة مع OpenAI، ويدعم مستويات تكميم متعددة (Q4_K_M توازن جيد بين الحجم والجودة) وتفريغ جزء من الطبقات إلى GPU.',
    },
    {
      t: 'code',
      lang: 'bash',
      c: `llama-server -m mit-merged-Q4_K_M.gguf --port 8080 -c 4096 -ngl 99`,
    },
    { t: 'h2', c: 'vLLM: الإنتاج بحمل عالٍ' },
    {
      t: 'p',
      c: 'مصمَّم لخدمة عدد كبير من الطلبات المتزامنة بكفاءة عالية عبر الدفعات المستمرة وإدارة ذاكرة KV-cache. يحتاج GPU، ويقرأ النماذج بصيغة Hugging Face.',
    },
    {
      t: 'code',
      lang: 'bash',
      c: `pip install vllm
vllm serve ./out/mit-merged --port 8000 --max-model-len 4096`,
    },
    { t: 'h2', c: 'الربط مع تطبيقك' },
    {
      t: 'p',
      c: 'الأدوات الثلاث تعرض واجهة متوافقة مع OpenAI، فيكفي تغيير `base_url`. هذه هي الطريقة التي يتصل بها الـ backend في موقعنا بنماذج Qwen المحلية (`AI_PROVIDER=custom`).',
    },
    {
      t: 'code',
      lang: 'python',
      c: `from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="not-needed")

reply = client.chat.completions.create(
    model="./out/mit-merged",
    messages=[{"role": "user", "content": "مرحباً"}],
)
print(reply.choices[0].message.content)`,
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'أي أداة أختار؟',
      c: 'ابدأ بـ Ollama للتجربة. عندما تحتاج خدمة عشرات المستخدمين بالتزامن انتقل إلى vLLM. استخدم llama.cpp إذا كان عتادك محدوداً أو تريد تحكماً دقيقاً. وإن لم ترد إدارة بنية تحتية، فالربط مع [Claude API](/blog/claude-api-integration-guide) أو [OpenAI API](/blog/openai-api-integration-guide) خيار مناسب.',
    },
  ],
  faqs: [
    {
      question: 'هل يمكن تشغيل نموذج LLM بدون بطاقة رسومية؟',
      answer:
        'نعم، عبر llama.cpp أو Ollama على المعالج، مع نماذج صغيرة مكمَّمة. السرعة أقل بكثير من GPU لكنها كافية للتجارب والاستخدام الخفيف.',
    },
  ],
}
