from django.db import models

class ContactInquiry(models.Model):
    """نموذج تخزين طلبات الاستشارات والتواصل من الموقع"""
    STATUS_CHOICES = [
        ('new', 'طلب جديد'),
        ('contacted', 'تم التواصل'),
        ('scheduled', 'تم تحديد موعد استشارة'),
        ('completed', 'مكتمل'),
        ('cancelled', 'ملغى'),
    ]

    SERVICE_CHOICES = [
        ('conversational_ai', 'حلول المحادثة الذكية والمساعدين الرقميين'),
        ('data_analytics', 'تحليل البيانات والأنظمة التنبؤية'),
        ('custom_ai', 'حلول الذكاء الاصطناعي المخصصة وأتمتة مسارات العمل'),
        ('general_consultation', 'استشارة عامة في التحول الذكي'),
        ('other', 'أخرى'),
    ]

    name = models.CharField('الاسم الكامل', max_length=150)
    email = models.EmailField('البريد الإلكتروني')
    phone = models.CharField('رقم الهاتف / واتساب', max_length=50, blank=True)
    company = models.CharField('اسم الشركة أو النشاط', max_length=150, blank=True)
    service = models.CharField('الخدمة المطلوبة', max_length=100, choices=SERVICE_CHOICES, default='general_consultation', blank=True)
    message = models.TextField('تفاصيل الطلب أو الاستفسار')
    status = models.CharField('حالة الطلب', max_length=30, choices=STATUS_CHOICES, default='new')
    notes = models.TextField('ملاحظات فريق العمل', blank=True)
    created_at = models.DateTimeField('تاريخ الطلب', auto_now_add=True)
    updated_at = models.DateTimeField('آخر تحديث', auto_now=True)

    class Meta:
        verbose_name = 'طلب استشارة / تواصل'
        verbose_name_plural = 'طلبات الاستشارات والتواصل'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.get_service_display()} ({self.created_at.strftime('%Y-%m-%d')})"


class ChatSession(models.Model):
    """جلسات المحادثة للمساعد الرقمي Mit"""
    session_id = models.CharField('معرف الجلسة', max_length=120, unique=True, db_index=True)
    created_at = models.DateTimeField('تاريخ البدء', auto_now_add=True)
    updated_at = models.DateTimeField('آخر نشاط', auto_now=True)

    class Meta:
        verbose_name = 'جلسة محادثة'
        verbose_name_plural = 'جلسات المحادثة'
        ordering = ['-updated_at']

    def __str__(self):
        return f"جلسة {self.session_id[:16]} ({self.messages.count()} رسائل)"


class ChatMessage(models.Model):
    """سجل رسائل المحادثة بين المستخدم والمساعد"""
    ROLE_CHOICES = [
        ('user', 'المستخدم'),
        ('assistant', 'المساعد Mit'),
        ('system', 'النظام'),
    ]

    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages', verbose_name='الجلسة')
    role = models.CharField('الطرف', max_length=20, choices=ROLE_CHOICES)
    content = models.TextField('نص الرسالة')
    provider = models.CharField('المزود المستخدم', max_length=50, blank=True, default='')
    created_at = models.DateTimeField('وقت الإرسال', auto_now_add=True)

    class Meta:
        verbose_name = 'رسالة محادثة'
        verbose_name_plural = 'رسائل المحادثات'
        ordering = ['created_at']

    def __str__(self):
        return f"{self.get_role_display()}: {self.content[:40]}..."
