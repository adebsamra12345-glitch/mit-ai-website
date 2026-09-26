from django.urls import path
from .views import chat_view, contact_view, health_view

urlpatterns = [
    path('chat/', chat_view, name='api-chat'),
    path('chat', chat_view, name='api-chat-no-slash'),
    path('contact/', contact_view, name='api-contact'),
    path('contact', contact_view, name='api-contact-no-slash'),
    path('consultations/', contact_view, name='api-consultations'),
    path('consultations', contact_view, name='api-consultations-no-slash'),
    path('health/', health_view, name='api-health'),
    path('health', health_view, name='api-health-no-slash'),
]
