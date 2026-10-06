import localLlmTrainingGuide from './local-llm-training-guide.js'
import qloraFineTuning from './qlora-fine-tuning-step-by-step.js'
import trainingDataPreparation from './llm-training-data-preparation.js'
import runLlmLocally from './run-llm-locally-ollama-llama-cpp-vllm.js'
import claudeApiGuide from './claude-api-integration-guide.js'
import openaiApiGuide from './openai-api-integration-guide.js'
import multiProviderGateway from './multi-provider-llm-gateway.js'
import ragVsFineTuning from './rag-vs-fine-tuning-for-enterprise.js'
import improveSearchWithAi from './improve-website-search-with-ai.js'

/** Newest first. Each post is plain data; see components/blog/ArticleBody for the block types. */
export const posts = [
  multiProviderGateway,
  openaiApiGuide,
  claudeApiGuide,
  runLlmLocally,
  trainingDataPreparation,
  qloraFineTuning,
  localLlmTrainingGuide,
  ragVsFineTuning,
  improveSearchWithAi,
].sort((a, b) => b.date.localeCompare(a.date))

export const categories = [...new Set(posts.map((p) => p.category))]

export const getPost = (slug) => posts.find((p) => p.slug === slug)
export const postPath = (post) => `/blog/${post.slug}`
