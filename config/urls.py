from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('kharandi.apps.accounts.urls')),
    path('api/marketplace/', include('kharandi.apps.marketplace.urls')),
    path('api/payments/', include('kharandi.apps.payments.urls')),
    path('api/courses/', include('kharandi.apps.courses.urls')),
    path('api/notify/', include('kharandi.apps.notifications.urls')),
    path('api/search/', include('kharandi.apps.search.urls')),
    path('api/results/', include('kharandi.apps.search.exam_urls')),
    path('api/reports/', include('kharandi.apps.reports.urls')),
    path('api/support/', include('kharandi.apps.support.urls')),
    path('api/ai/', include('kharandi.apps.ai_assistant.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
