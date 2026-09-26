from django.contrib import admin
from .models import ContactInquiry, ChatSession, ChatMessage


class ChatMessageInline(admin.TabularInline):
    model = ChatMessage
    extra = 0
    readonly_fields = ('role', 'content', 'provider', 'created_at')
    can_delete = False
    ordering = ('created_at',)


@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'email', 'service', 'status', 'created_at')
    list_filter = ('status', 'service', 'created_at')
    search_fields = ('name', 'email', 'phone', 'company', 'message')
    readonly_fields = ('created_at', 'updated_at')
    list_editable = ('status',)
    date_hierarchy = 'created_at'

    fieldsets = (
        ('معلومات العميل', {
            'fields': ('name', 'company', 'email', 'phone')
        }),
        ('تفاصيل الاستشارة', {
            'fields': ('service', 'message')
        }),
        ('متابعة الطلب', {
            'fields': ('status', 'notes', 'created_at', 'updated_at')
        }),
    )


@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ('session_id', 'messages_count', 'created_at', 'updated_at')
    search_fields = ('session_id',)
    readonly_fields = ('session_id', 'created_at', 'updated_at')
    inlines = [ChatMessageInline]
    date_hierarchy = 'created_at'

    def messages_count(self, obj):
        return obj.messages.count()
    messages_count.short_description = 'عدد الرسائل'


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('session', 'role', 'short_content', 'provider', 'created_at')
    list_filter = ('role', 'provider', 'created_at')
    search_fields = ('content', 'session__session_id')
    readonly_fields = ('session', 'role', 'content', 'provider', 'created_at')

    def short_content(self, obj):
        return obj.content[:60] + ('...' if len(obj.content) > 60 else '')
    short_content.short_description = 'محتوى الرسالة'
