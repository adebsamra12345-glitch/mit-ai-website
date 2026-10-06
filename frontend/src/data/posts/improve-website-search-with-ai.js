export default {
  slug: 'improve-website-search-with-ai',
  title: 'How to Improve Website Search with AI (And Why You Must)',
  description:
    "Learn how replacing keyword search with AI semantic search can improve your website's user experience, reduce bounce rates, and increase conversions.",
  category: 'Engineering & UX',
  lang: 'en',
  date: '2024-09-01',
  updated: '2026-10-06',
  readMinutes: 5,
  tags: ['Semantic Search', 'Embeddings', 'RAG', 'UX'],
  body: [
    {
      t: 'p',
      c: 'If your users search for "forgot password" but your site only understands "reset credentials," you have a search problem. Standard keyword search was the gold standard for a decade, but users now expect the intelligence of Google and ChatGPT: they ask questions and use natural language.',
    },
    { t: 'h2', c: 'The limitation of lexical search' },
    {
      t: 'p',
      c: 'Lexical search is literal: it looks for the exact string the user typed. If a user searches for **"how to connect Stripe"** but your documentation says **"payment gateway integration,"** a lexical search returns *zero results*.',
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'The cost of zero results',
      c: 'A "0 results found" page is often the last page a user sees before abandoning your app or opening a support ticket.',
    },
    { t: 'h2', c: 'Enter semantic search' },
    {
      t: 'p',
      c: 'Semantic search converts your content into vectors (embeddings) that represent *meaning*. When a user types a query, the engine finds the documents closest in meaning to the intent.',
    },
    {
      t: 'ul',
      items: [
        '**Understands synonyms:** "laptop" and "notebook" match without manual tagging.',
        '**Handles typos gracefully:** misspellings rarely break retrieval.',
        '**Understands context:** "Apple" near "iPhone" is the company; near "pie" it is the fruit.',
      ],
    },
    { t: 'h2', c: 'How to implement it (RAG)' },
    {
      t: 'ol',
      items: [
        '**Vectorize your data:** run help docs, catalogs, or knowledge-base articles through an embedding model (for example OpenAI\'s `text-embedding-3-small`; see our [OpenAI API guide](/blog/openai-api-integration-guide)).',
        '**Store in a vector database:** pgvector, Milvus, Qdrant, or Pinecone.',
        '**Retrieve and generate:** find the nearest vectors for each query and optionally pass them to an LLM (such as Claude; see the [Claude API guide](/blog/claude-api-integration-guide)) to write a direct, conversational answer.',
      ],
    },
  ],
  cta: {
    title: "Don't build this from scratch.",
    text: 'Building and maintaining vector databases, embedding syncs, and LLM latency is hard. Let our ML experts implement an Enterprise RAG solution tailored to your platform.',
    links: [{ to: '/services/enterprise-rag-solutions', label: 'Explore Our RAG Solutions' }],
  },
}
