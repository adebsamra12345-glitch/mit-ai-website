/** Landing-page content for the three core services. Rendered by pages/ServicePage.jsx. */
export const services = [
  {
    slug: 'enterprise-rag-solutions',
    nav: 'Enterprise RAG Solutions',
    icon: '🔎',
    schema: 'faq',
    title: 'Enterprise RAG Solutions | Secure AI Search for B2B SaaS',
    description:
      'Upgrade your SaaS with enterprise RAG solutions. Deliver relevant, secure, source-grounded AI search experiences to your B2B customers.',
    h1: 'Secure Enterprise RAG Solutions for B2B SaaS',
    lead:
      'Stop losing users to bad search. Implement Retrieval-Augmented Generation that understands context, respects data privacy, and ships in weeks, not quarters.',
    primaryCta: 'Book a Technical Demo',
    secondaryCta: { label: 'Read the RAG guide', to: '/blog/rag-vs-fine-tuning-for-enterprise' },
    problem: {
      title: 'Why your current search is costing you revenue',
      text:
        'Traditional lexical search relies on exact keyword matching. When customers search "export financial report" but your UI says "download revenue ledger", they get zero results. That friction leads to churn.',
      items: [
        { title: 'Zero-result dead ends', text: 'Frustrating experiences that lower retention and raise support load.' },
        { title: 'Irrelevant matches', text: 'Users waste time sorting through results that only share a keyword.' },
        { title: 'No understanding of intent', text: 'Standard search cannot handle complex or conversational queries.' },
      ],
    },
    featuresTitle: 'Next-generation semantic search powered by RAG',
    featuresText:
      'We connect large language models to your own data, so users get context-aware answers that point back to the source documents.',
    features: [
      { title: 'Private by design', text: 'Tenant isolation and role-based access enforced at retrieval time. Your data is never used to train public models.' },
      { title: 'Grounded answers', text: 'Responses are generated from retrieved passages and cite their sources, which sharply reduces hallucinations.' },
      { title: 'Built for speed', text: 'Hybrid keyword + vector retrieval, caching, and streaming responses keep the experience responsive.' },
    ],
    faqs: [
      {
        question: 'What is RAG in AI?',
        answer:
          'Retrieval-Augmented Generation (RAG) improves the accuracy of LLMs by fetching relevant information from an external, secure data source before generating an answer. Unlike fine-tuning, RAG does not require retraining when your data changes.',
      },
      {
        question: 'Is enterprise RAG secure for B2B SaaS?',
        answer:
          "Yes. We design for tenant isolation and strict data governance so Client A can never retrieve Client B's content. Your data is not used to train public models.",
      },
      {
        question: 'RAG vs Fine-Tuning: which is better for enterprise?',
        answer:
          'RAG is best for injecting factual, frequently changing knowledge (like search). Fine-tuning is better for teaching a specific tone or behavior. Many systems combine both.',
      },
      {
        question: 'How long does it take to implement an enterprise RAG solution?',
        answer:
          'A first integration can take a few days via API. Full custom implementations with dedicated vector databases and role-based access control typically take 2-4 weeks, depending on your data.',
      },
    ],
  },
  {
    slug: 'llm-fine-tuning',
    nav: 'LLM Fine-Tuning',
    icon: '🧠',
    schema: 'faq',
    title: 'LLM Fine-Tuning for B2B SaaS | Custom AI Models',
    description:
      'Accelerate your AI roadmap with LLM fine-tuning. We train custom models on your domain data to improve accuracy, tone, and output consistency.',
    h1: 'Custom LLM Fine-Tuning Services for B2B SaaS',
    lead:
      "Generic models don't understand your domain. We fine-tune open-weight LLMs on your data to deliver accurate, industry-specific AI features without an in-house ML team.",
    primaryCta: 'Schedule an AI Audit',
    secondaryCta: { label: 'Local LLM training guide', to: '/blog/local-llm-training-guide' },
    problem: {
      title: 'The hidden cost of generic AI models',
      text:
        'Plugging a general-purpose model into your product is easy. Making it sound like your brand, understand your jargon, and perform specialized workflows reliably is hard.',
      items: [
        { title: 'Unreliable domain answers', text: 'Off-the-shelf models invent details in technical or legal domains and erode user trust.' },
        { title: 'Tone & formatting drift', text: 'Generic LLMs struggle to match your JSON schemas, voice, or report structure every time.' },
        { title: 'High inference costs', text: 'Relying on long prompts and big context windows inflates API spend.' },
      ],
    },
    featuresTitle: 'How our fine-tuning process works',
    featuresText: 'A transparent, measurable pipeline from raw data to a deployed model.',
    steps: true,
    features: [
      { title: 'Data curation & formatting', text: 'We turn raw logs, documents, and interactions into clean instruction-response datasets. See our [data preparation guide](/blog/llm-training-data-preparation).' },
      { title: 'Model selection & training', text: 'We pick the best open-weight model (Llama, Qwen, Mistral) and apply parameter-efficient fine-tuning (LoRA / QLoRA) on isolated GPUs.' },
      { title: 'Evaluation & deployment', text: 'We evaluate against your baseline on held-out examples, then deploy behind an API, in the cloud or on your own servers.' },
    ],
    faqs: [
      {
        question: 'What is LLM fine-tuning?',
        answer:
          'Fine-tuning further trains a pre-trained language model on a curated, domain-specific dataset so it learns the vocabulary, tone, and reasoning patterns of a specific industry or company.',
      },
      {
        question: 'How is fine-tuning different from RAG?',
        answer:
          "Fine-tuning bakes behavior into the model's weights. RAG keeps knowledge external and retrieves it at query time. Fine-tuning suits style and behavior; RAG suits factual, frequently updated data.",
      },
      {
        question: 'How long does LLM fine-tuning take?',
        answer:
          'Training itself takes hours to days depending on data and model size. Including data preparation and evaluation, a project typically takes 1-3 weeks.',
      },
      {
        question: 'Is my proprietary data safe during fine-tuning?',
        answer:
          'We train on isolated, private infrastructure and never use your data for public models. We can sign NDAs and data processing agreements as required.',
      },
    ],
  },
  {
    slug: 'ai-search-api',
    nav: 'AI Search API',
    icon: '⚡',
    schema: 'software',
    title: 'AI Search API for E-commerce & SaaS | Boost Conversions',
    description:
      'Integrate an AI Search API into your e-commerce or SaaS platform. Deliver semantic, typo-tolerant results that improve conversion and retention.',
    h1: 'AI Search API for E-commerce & B2B SaaS',
    lead:
      'Replace outdated keyword search without rebuilding your stack. Our semantic search understands user intent, tolerates typos, and surfaces what people actually mean.',
    primaryCta: 'Request API Access',
    secondaryCta: { label: 'How AI search works', to: '/blog/improve-website-search-with-ai' },
    features: [
      { title: 'Semantic intent matching', text: 'If a user searches for "winter coat", we also surface "cold weather jackets". We match meaning, not just letters.' },
      { title: 'Typo tolerance', text: "Don't lose sales to fat fingers. Embeddings map misspelled queries to the right products." },
      { title: 'Fast by design', text: 'Optimised indexes and caching keep the search bar feeling instant for shoppers.' },
    ],
    featuresTitle: 'Built for conversion and speed',
    developer: {
      title: 'Developer-first integration',
      text: 'Swap out your old search in hours with straightforward REST endpoints.',
      code: `const results = await aiSearch.query({
  index: 'product_catalog',
  query: 'waterproof running shoes',
  limit: 10,
})`,
    },
    faqs: [
      {
        question: 'Does AI search replace my existing search engine?',
        answer:
          'It can, or it can run alongside it. Hybrid retrieval that combines keyword and vector search usually gives the best relevance.',
      },
      {
        question: 'Does it work with Arabic content?',
        answer: 'Yes. We use multilingual embedding models, and we evaluate relevance on your own Arabic and English queries.',
      },
    ],
  },
]

export const getService = (slug) => services.find((s) => s.slug === slug)
export const servicePath = (service) => `/services/${service.slug}`
