export default {
  slug: 'qlora-fine-tuning-step-by-step',
  title: 'ضبط نموذج LLM بتقنية QLoRA خطوة بخطوة (كود كامل)',
  description:
    'شرح عملي لضبط نموذج لغوي مفتوح الأوزان بتقنية QLoRA باستخدام Transformers و PEFT و TRL: إعداد البيئة، تحميل النموذج بدقة 4-bit، التدريب، الدمج، والتصدير.',
  category: 'تدريب النماذج',
  lang: 'ar',
  date: '2026-10-02',
  updated: '2026-10-06',
  readMinutes: 10,
  tags: ['QLoRA', 'PEFT', 'TRL', 'Hugging Face', 'Python'],
  body: [
    {
      t: 'p',
      c: 'في هذا الشرح نضبط نموذجاً بحجم 7B–8B على مجموعة تعليمات خاصة بنا باستخدام QLoRA. الكود مبني على مكتبات Hugging Face (`transformers` و `peft` و `trl` و `bitsandbytes`). واجهات هذه المكتبات تتطور بسرعة، فإذا اختلف اسم معامل في إصدارك راجع التوثيق الرسمي للإصدار المثبّت.',
    },
    { t: 'toc' },
    {
      t: 'callout',
      kind: 'info',
      title: 'المتطلبات',
      c: 'بطاقة NVIDIA بذاكرة 12–16 GB على الأقل، نظام Linux أو WSL2، Python 3.10+، وتعريف CUDA مثبّت.',
    },
    { t: 'h2', c: '1. تجهيز البيئة' },
    {
      t: 'code',
      lang: 'bash',
      c: `python -m venv .venv && source .venv/bin/activate
pip install -U torch transformers peft trl bitsandbytes datasets accelerate`,
    },
    { t: 'h2', c: '2. صيغة البيانات' },
    {
      t: 'p',
      c: 'نستخدم ملف JSONL حيث يمثّل كل سطر محادثة بصيغة `messages`. تفضّل مكتبة TRL هذه الصيغة وتطبّق قالب المحادثة الخاص بالنموذج تلقائياً.',
    },
    {
      t: 'code',
      lang: 'json',
      c: `{"messages": [
  {"role": "system", "content": "أنت مساعد دعم فني لشركة Mit AI."},
  {"role": "user", "content": "كيف أحجز استشارة؟"},
  {"role": "assistant", "content": "اضغط زر «احجز استشارة مجانية» وعبّئ النموذج، وسنتواصل معك."}
]}`,
    },
    { t: 'h2', c: '3. تحميل النموذج بدقة 4-bit' },
    {
      t: 'code',
      lang: 'python',
      c: `import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig

MODEL_ID = "Qwen/Qwen2.5-7B-Instruct"  # أو أي نموذج مفتوح مناسب

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_use_double_quant=True,
)

tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_ID,
    quantization_config=bnb_config,
    device_map="auto",
)`,
    },
    {
      t: 'ul',
      items: [
        '`nf4`: نوع تكميم مصمّم لأوزان موزّعة توزيعاً طبيعياً، وهو الخيار الموصى به في QLoRA.',
        '`double_quant`: يكمّم ثوابت التكميم نفسها لتوفير ذاكرة إضافية.',
        'استخدم `float16` بدل `bfloat16` إن كانت بطاقتك لا تدعم bf16.',
      ],
    },
    { t: 'h2', c: '4. إعداد LoRA' },
    {
      t: 'code',
      lang: 'python',
      c: `from peft import LoraConfig

peft_config = LoraConfig(
    r=16,                # رتبة المصفوفات: أكبر = سعة أكبر وذاكرة أكثر
    lora_alpha=32,       # معامل التحجيم، غالباً 1–2 ضعف r
    lora_dropout=0.05,
    target_modules="all-linear",
    task_type="CAUSAL_LM",
)`,
    },
    { t: 'h2', c: '5. التدريب' },
    {
      t: 'code',
      lang: 'python',
      c: `from datasets import load_dataset
from trl import SFTConfig, SFTTrainer

dataset = load_dataset("json", data_files={"train": "train.jsonl", "validation": "val.jsonl"})

training_args = SFTConfig(
    output_dir="out/mit-qlora",
    num_train_epochs=2,
    per_device_train_batch_size=2,
    gradient_accumulation_steps=8,   # حجم دفعة فعلي = 16
    learning_rate=2e-4,
    lr_scheduler_type="cosine",
    warmup_ratio=0.03,
    bf16=True,
    gradient_checkpointing=True,     # يوفّر ذاكرة مقابل زمن أطول
    logging_steps=10,
    eval_strategy="steps",
    eval_steps=100,
    save_steps=100,
    max_length=2048,
)

trainer = SFTTrainer(
    model=model,
    args=training_args,
    train_dataset=dataset["train"],
    eval_dataset=dataset["validation"],
    peft_config=peft_config,
    processing_class=tokenizer,
)
trainer.train()
trainer.save_model("out/mit-qlora/adapter")`,
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'نفدت الذاكرة؟',
      c: 'خفّض `per_device_train_batch_size` إلى 1 وارفع `gradient_accumulation_steps`، وقلّل `max_length`، وتأكد من تفعيل `gradient_checkpointing`. هذه الإعدادات تبادل السرعة بالذاكرة دون المساس بجودة التدريب.',
    },
    { t: 'h2', c: '6. اختبار سريع للنتيجة' },
    {
      t: 'code',
      lang: 'python',
      c: `messages = [{"role": "user", "content": "كيف أحجز استشارة؟"}]
inputs = tokenizer.apply_chat_template(
    messages, add_generation_prompt=True, return_tensors="pt", return_dict=True
).to(trainer.model.device)

output = trainer.model.generate(**inputs, max_new_tokens=200)
print(tokenizer.decode(output[0][inputs["input_ids"].shape[1]:], skip_special_tokens=True))`,
    },
    { t: 'h2', c: '7. دمج الـ Adapter وتصدير النموذج' },
    {
      t: 'p',
      c: 'للنشر نحمّل النموذج الأساسي بدقة كاملة (fp16/bf16) ثم ندمج الـ Adapter فيه، فينتج نموذج مستقل لا يحتاج `peft` وقت التشغيل.',
    },
    {
      t: 'code',
      lang: 'python',
      c: `from peft import PeftModel

base = AutoModelForCausalLM.from_pretrained(MODEL_ID, torch_dtype=torch.bfloat16, device_map="auto")
merged = PeftModel.from_pretrained(base, "out/mit-qlora/adapter").merge_and_unload()
merged.save_pretrained("out/mit-merged")
tokenizer.save_pretrained("out/mit-merged")`,
    },
    {
      t: 'p',
      c: 'للتشغيل عبر Ollama أو llama.cpp حوّل النموذج المدموج إلى صيغة GGUF باستخدام سكربت `convert_hf_to_gguf.py` من مستودع llama.cpp ثم كمّمه (مثلاً Q4_K_M). التفاصيل في [مقارنة أدوات التشغيل المحلي](/blog/run-llm-locally-ollama-llama-cpp-vllm).',
    },
    { t: 'h2', c: 'نصائح لرفع الجودة' },
    {
      t: 'ul',
      items: [
        'ابدأ بـ `r=16` وعدد حقب 1–3؛ زيادة الحقب كثيراً تؤدي غالباً إلى حفظ الأمثلة.',
        'احتفظ بمجموعة تحقق لم يرها النموذج، وراقب `eval_loss`: إن ارتفعت بينما تنخفض خسارة التدريب فأنت في طور الإفراط في التعلّم.',
        'درّب على **إجابات المساعد فقط** إن أمكن (assistant-only loss) كي لا يتعلم النموذج تقليد أسئلة المستخدم.',
        'قيّم دائماً بمقارنة مباشرة مع النموذج الأساسي على نفس الأسئلة.',
      ],
    },
  ],
  faqs: [
    {
      question: 'كم يستغرق ضبط QLoRA لنموذج 7B؟',
      answer:
        'يعتمد على حجم البيانات وطول السياق والبطاقة. لمجموعة من بضعة آلاف مثال على بطاقة واحدة، يتراوح الزمن عادةً بين ساعة وبضع ساعات.',
    },
    {
      question: 'هل يمكنني استخدام QLoRA مع نماذج عربية؟',
      answer:
        'نعم. الطريقة مستقلة عن اللغة، وتعتمد الجودة على النموذج الأساسي وجودة بيانات التدريب العربية. نماذج مثل Qwen تدعم العربية بشكل جيد.',
    },
  ],
}
