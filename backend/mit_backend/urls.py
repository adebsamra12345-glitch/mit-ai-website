from django.contrib import admin
from django.urls import path, include

# تخصيص واجهة الإدارة
admin.site.site_header = "لوحة تحكم Mit AI Technology"
admin.site.site_title = "إدارة Mit AI"
admin.site.index_title = "إدارة المحادثات والاستشارات"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
