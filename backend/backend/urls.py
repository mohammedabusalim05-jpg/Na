from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("", lambda request: redirect("/api/donations/")),  # 👈 إعادة توجيه تلقائي
    path("admin/", admin.site.urls),
    path("api/accounts/", include("accounts.urls")),
    path("api/donations/", include("donations.urls")),
    path("api/campaigns/", include("campaigns.urls")),
    path("api/volunteers/", include("volunteers.urls")),
    path("api/notifications/", include("notifications.urls")),
    path("api/cases/", include("cases.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)