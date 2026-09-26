from django.test import TestCase, Client
import json
from .models import ContactInquiry, ChatSession, ChatMessage

class ApiEndpointsTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_health_endpoint(self):
        response = self.client.get('/api/health/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get('status'), 'healthy')
        self.assertIn('ai_engine', data)

    def test_contact_submission(self):
        payload = {
            "name": "أحمد السوري",
            "email": "ahmad@example.com",
            "phone": "0993123456",
            "company": "شركة المستقبل",
            "service": "conversational_ai",
            "message": "نحتاج إلى مساعد رقمي ذكي لموقعنا وتطبيقاتنا"
        }
        response = self.client.post(
            '/api/contact/',
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data.get('status'), 'success')
        self.assertTrue(ContactInquiry.objects.filter(email="ahmad@example.com").exists())

    def test_chat_interaction(self):
        payload = {
            "message": "مرحباً، ما هي الخدمات التي تقدمها شركة Mit AI؟",
            "sessionId": "test-session-123"
        }
        response = self.client.post(
            '/api/chat/',
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('reply', data)
        self.assertTrue(len(data['reply']) > 10)
        self.assertEqual(data.get('sessionId'), 'test-session-123')
        self.assertTrue(ChatMessage.objects.filter(session__session_id='test-session-123').exists())
