"""
خدمة توليد ردود مساعد Mit.

المزود يُختار عبر المتغير AI_PROVIDER:
    knowledge_base (الافتراضي) | anthropic | openai | groq | gemini | ollama | custom

أي فشل في المزود الخارجي (مفتاح مفقود، مهلة، حد معدل ...) يرجع تلقائياً إلى قاعدة المعرفة المحلية،
فلا يرى الزائر رسالة خطأ أبداً.
"""
import logging
import os
from dataclasses import dataclass
from typing import Callable

import requests

from .knowledge import SYSTEM_PROMPT, smart_knowledge_base_reply

logger = logging.getLogger(__name__)

HISTORY_LIMIT = 6        # عدد الرسائل السابقة المرسلة كسياق
MAX_REPLY_TOKENS = 600
REQUEST_TIMEOUT = 20     # ثوانٍ

DEFAULT_MODELS = {
    'anthropic': 'claude-opus-5-5',
    'openai': 'gpt-4o-mini',
    'groq': 'llama-3.3-70b-versatile',
    'gemini': 'gemini-1.5-flash',
    'ollama': 'qwen2.5:7b',
    'custom': 'qwen2.5-72b-instruct',
}
OPENAI_URL = 'https://api.openai.com/v1'
GROQ_URL = 'https://api.groq.com/openai/v1'

Message = dict  # {"role": "user" | "assistant", "content": str}


@dataclass(frozen=True)
class AIConfig:
    provider: str
    api_key: str
    model: str
    api_base: str

    @classmethod
    def from_env(cls) -> 'AIConfig':
        provider = os.getenv('AI_PROVIDER', 'knowledge_base').strip().lower()
        model = os.getenv('AI_MODEL_NAME', '').strip() or DEFAULT_MODELS.get(provider, '')
        return cls(
            provider=provider,
            api_key=os.getenv('AI_API_KEY', '').strip(),
            model=model,
            api_base=os.getenv('AI_API_BASE', '').strip(),
        )


# ------------------------------------------------------------------------------
# تجهيز سجل المحادثة
# ------------------------------------------------------------------------------
def build_messages(history: list[Message] | None, user_message: str) -> list[Message]:
    """
    يبني قائمة رسائل صالحة لكل المزودين: أدوار user/assistant فقط، تبدأ برسالة user،
    وتتناوب الأدوار (تُدمج الرسائل المتتالية من نفس الطرف)، وتنتهي برسالة المستخدم الحالية.
    """
    raw = [
        {'role': 'assistant' if m.get('role') == 'assistant' else 'user', 'content': (m.get('content') or '').strip()}
        for m in (history or [])[-HISTORY_LIMIT:]
    ]
    raw.append({'role': 'user', 'content': user_message})

    messages: list[Message] = []
    for m in raw:
        if not m['content']:
            continue
        if messages and messages[-1]['role'] == m['role']:
            messages[-1]['content'] += '\n' + m['content']
        else:
            messages.append(dict(m))
    while messages and messages[0]['role'] != 'user':
        messages.pop(0)
    return messages


# ------------------------------------------------------------------------------
# المزودون: كل دالة تستقبل (config, messages) وترجع نص الرد
# ------------------------------------------------------------------------------
def _call_anthropic(config: AIConfig, messages: list[Message]) -> str:
    """Claude عبر SDK الرسمي. لا نمرّر temperature لأن النماذج الحديثة ترفضه."""
    import anthropic

    client = anthropic.Anthropic(api_key=config.api_key or None, timeout=REQUEST_TIMEOUT, max_retries=1)
    response = client.messages.create(
        model=config.model,
        max_tokens=MAX_REPLY_TOKENS,
        system=SYSTEM_PROMPT,
        messages=messages,
    )
    if response.stop_reason == 'refusal':
        raise ValueError('Claude declined the request')
    text = ''.join(block.text for block in response.content if block.type == 'text').strip()
    if not text:
        raise ValueError('Empty response from Claude')
    return text


def _call_openai_compatible(config: AIConfig, messages: list[Message]) -> str:
    """OpenAI وGroq وأي خادم متوافق (vLLM, Ollama /v1, DeepSeek, Together ...)."""
    base = config.api_base or (GROQ_URL if config.provider == 'groq' else OPENAI_URL)
    headers = {'Content-Type': 'application/json'}
    if config.api_key:
        headers['Authorization'] = f'Bearer {config.api_key}'

    response = requests.post(
        base.rstrip('/') + '/chat/completions',
        headers=headers,
        json={
            'model': config.model,
            'messages': [{'role': 'system', 'content': SYSTEM_PROMPT}, *messages],
            'temperature': 0.7,
            'max_tokens': MAX_REPLY_TOKENS,
        },
        timeout=REQUEST_TIMEOUT,
    )
    response.raise_for_status()
    return response.json()['choices'][0]['message']['content'].strip()


def _call_gemini(config: AIConfig, messages: list[Message]) -> str:
    url = f'https://generativelanguage.googleapis.com/v1beta/models/{config.model}:generateContent'
    response = requests.post(
        url,
        headers={'x-goog-api-key': config.api_key},  # في الترويسة بدل الرابط كي لا يظهر المفتاح في السجلات
        json={
            'systemInstruction': {'parts': [{'text': SYSTEM_PROMPT}]},
            'contents': [
                {'role': 'model' if m['role'] == 'assistant' else 'user', 'parts': [{'text': m['content']}]}
                for m in messages
            ],
            'generationConfig': {'temperature': 0.7, 'maxOutputTokens': MAX_REPLY_TOKENS},
        },
        timeout=REQUEST_TIMEOUT,
    )
    response.raise_for_status()
    candidates = response.json().get('candidates') or []
    parts = candidates[0].get('content', {}).get('parts', []) if candidates else []
    text = ''.join(p.get('text', '') for p in parts).strip()
    if not text:
        raise ValueError('Empty response from Gemini')
    return text


def _call_ollama(config: AIConfig, messages: list[Message]) -> str:
    base = (config.api_base or 'http://localhost:11434').rstrip('/')
    response = requests.post(
        f'{base}/api/chat',
        json={
            'model': config.model,
            'messages': [{'role': 'system', 'content': SYSTEM_PROMPT}, *messages],
            'stream': False,
        },
        timeout=REQUEST_TIMEOUT + 5,
    )
    response.raise_for_status()
    text = response.json().get('message', {}).get('content', '').strip()
    if not text:
        raise ValueError('Empty response from Ollama')
    return text


PROVIDERS: dict[str, Callable[[AIConfig, list[Message]], str]] = {
    'anthropic': _call_anthropic,
    'openai': _call_openai_compatible,
    'groq': _call_openai_compatible,
    'custom': _call_openai_compatible,
    'gemini': _call_gemini,
    'ollama': _call_ollama,
}


def _is_configured(config: AIConfig) -> bool:
    """هل لدى المزود ما يلزمه للعمل؟ (مفتاح، أو عنوان خادم خاص)"""
    if config.provider == 'ollama':
        return True
    if config.provider in ('openai', 'groq', 'custom'):
        return bool(config.api_key or config.api_base)
    return bool(config.api_key)


def generate_ai_reply(user_message: str, session_id: str | None = None, history_messages: list[Message] | None = None) -> tuple[str, str]:
    """يرجع (نص الرد، اسم المزود الذي ولّده)."""
    config = AIConfig.from_env()
    provider_call = PROVIDERS.get(config.provider)

    if provider_call and _is_configured(config):
        try:
            return provider_call(config, build_messages(history_messages, user_message)), config.provider
        except Exception:
            logger.warning('AI provider %s failed, using knowledge base', config.provider, exc_info=True)

    return smart_knowledge_base_reply(user_message), 'knowledge_base'
