import json
from unittest.mock import Mock, patch

from django.core.cache import cache
from django.test import TestCase

from .ai_service import AIConfig, build_messages, generate_ai_reply
from .knowledge import smart_knowledge_base_reply
from .models import ChatMessage, ContactInquiry


def post_json(client, url, payload):
    return client.post(url, data=json.dumps(payload), content_type='application/json')


class ApiEndpointsTests(TestCase):
    def setUp(self):
        cache.clear()

    def test_health_endpoint(self):
        data = self.client.get('/api/health/').json()
        self.assertEqual(data['status'], 'healthy')
        self.assertIn('ai_engine', data)

    def test_contact_submission(self):
        response = post_json(self.client, '/api/contact/', {
            'name': 'أحمد السوري', 'email': 'ahmad@example.com', 'phone': '0993123456',
            'service': 'conversational_ai', 'message': 'نحتاج مساعداً رقمياً',
        })
        self.assertEqual(response.status_code, 201)
        self.assertTrue(ContactInquiry.objects.filter(email='ahmad@example.com').exists())

    def test_contact_validation(self):
        self.assertEqual(post_json(self.client, '/api/contact/', {'email': 'a@b.co'}).status_code, 400)  # no name
        self.assertEqual(post_json(self.client, '/api/contact/', {'name': 'x'}).status_code, 400)  # no way to reach
        self.assertEqual(post_json(self.client, '/api/contact/', {'name': 'x', 'email': 'nope'}).status_code, 400)

    def test_contact_unknown_service_falls_back(self):
        post_json(self.client, '/api/contact/', {'name': 'x', 'phone': '1', 'service': 'hack'})
        self.assertEqual(ContactInquiry.objects.get().service, 'general_consultation')

    def test_chat_interaction(self):
        response = post_json(self.client, '/api/chat/', {'message': 'مرحباً، ما هي خدماتكم؟', 'sessionId': 'test-session-123'})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreater(len(data['reply']), 10)
        self.assertEqual(data['sessionId'], 'test-session-123')
        self.assertEqual(ChatMessage.objects.filter(session__session_id='test-session-123').count(), 2)

    def test_chat_rejects_bad_input(self):
        self.assertEqual(self.client.post('/api/chat/', data='not json', content_type='application/json').status_code, 400)
        self.assertEqual(post_json(self.client, '/api/chat/', ['list']).status_code, 400)
        self.assertEqual(post_json(self.client, '/api/chat/', {'message': 123}).status_code, 400)
        self.assertEqual(post_json(self.client, '/api/chat/', {'message': 'x' * 1001}).status_code, 400)

    def test_chat_replaces_invalid_session_id(self):
        data = post_json(self.client, '/api/chat/', {'message': 'مرحبا', 'sessionId': '<script>'}).json()
        self.assertTrue(data['sessionId'].startswith('mit_'))

    def test_chat_rate_limit(self):
        statuses = [post_json(self.client, '/api/chat/', {'message': 'مرحبا'}).status_code for _ in range(32)]
        self.assertEqual(statuses[:30], [200] * 30)
        self.assertEqual(statuses[30], 429)


class KnowledgeBaseTests(TestCase):
    def test_intents(self):
        self.assertIn('Mit', smart_knowledge_base_reply('مرحبا'))
        self.assertIn('0993448083', smart_knowledge_base_reply('ما رقم الهاتف؟'))
        self.assertIn('/blog', smart_knowledge_base_reply('عندكم مقالات؟'))
        self.assertIn('التكلفة', smart_knowledge_base_reply('كم السعر'))

    def test_latin_patterns_need_word_boundaries(self):
        # "rag" inside "storage" and "data" inside "database" must not trigger service intents
        self.assertNotIn('حلول الذكاء الاصطناعي المخصصة', smart_knowledge_base_reply('what is storage'))
        self.assertIn('Custom AI', smart_knowledge_base_reply('what is RAG'))


class BuildMessagesTests(TestCase):
    def test_alternates_roles_and_starts_with_user(self):
        history = [
            {'role': 'assistant', 'content': 'hello'},
            {'role': 'user', 'content': 'q1'},
            {'role': 'user', 'content': 'q2'},
            {'role': 'assistant', 'content': 'a'},
        ]
        messages = build_messages(history, 'q3')
        self.assertEqual([m['role'] for m in messages], ['user', 'assistant', 'user'])
        self.assertEqual(messages[0]['content'], 'q1\nq2')
        self.assertEqual(messages[-1]['content'], 'q3')

    def test_merges_current_message_into_trailing_user_turn(self):
        messages = build_messages([{'role': 'user', 'content': 'earlier'}], 'now')
        self.assertEqual(messages, [{'role': 'user', 'content': 'earlier\nnow'}])


class ProviderTests(TestCase):
    def test_default_is_knowledge_base(self):
        with patch.dict('os.environ', {'AI_PROVIDER': 'knowledge_base'}):
            self.assertEqual(generate_ai_reply('مرحبا')[1], 'knowledge_base')

    def test_provider_without_key_uses_knowledge_base(self):
        with patch.dict('os.environ', {'AI_PROVIDER': 'anthropic', 'AI_API_KEY': ''}):
            self.assertEqual(generate_ai_reply('مرحبا')[1], 'knowledge_base')

    def test_provider_failure_falls_back(self):
        with patch.dict('os.environ', {'AI_PROVIDER': 'anthropic', 'AI_API_KEY': 'k'}), \
             patch.dict('api.ai_service.PROVIDERS', {'anthropic': Mock(side_effect=RuntimeError('boom'))}):
            reply, provider = generate_ai_reply('مرحبا')
        self.assertEqual(provider, 'knowledge_base')
        self.assertTrue(reply)

    def test_provider_success_is_used(self):
        with patch.dict('os.environ', {'AI_PROVIDER': 'anthropic', 'AI_API_KEY': 'k'}), \
             patch.dict('api.ai_service.PROVIDERS', {'anthropic': lambda config, messages: 'من Claude'}):
            self.assertEqual(generate_ai_reply('مرحبا'), ('من Claude', 'anthropic'))

    def test_default_models(self):
        with patch.dict('os.environ', {'AI_PROVIDER': 'anthropic', 'AI_MODEL_NAME': ''}):
            self.assertEqual(AIConfig.from_env().model, 'claude-opus-5-5')
        with patch.dict('os.environ', {'AI_PROVIDER': 'openai', 'AI_MODEL_NAME': 'custom-model'}):
            self.assertEqual(AIConfig.from_env().model, 'custom-model')
