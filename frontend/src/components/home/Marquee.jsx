const ITEMS = ['Claude', 'OpenAI', 'Llama', 'Qwen', 'Mistral', 'RAG', 'LoRA', 'QLoRA', 'vLLM', 'Ollama', 'pgvector', 'Embeddings']

/** Infinite technology ticker; the duplicate row is hidden from assistive tech. */
export default function Marquee() {
  const row = (hidden) => (
    <ul className="marquee-row" aria-hidden={hidden || undefined}>
      {ITEMS.map((item) => (
        <li key={item} dir="ltr">{item}</li>
      ))}
    </ul>
  )
  return (
    <div className="marquee" role="presentation">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
