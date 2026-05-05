from django.contrib import admin
from .models import Donation, DonationRequest, NGOCategory


@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "donation_type", "user", "assigned_ngo", "aid_request", "created_at")
    list_filter = ("donation_type", "is_completed", "approved_by_ngo", "created_at")
    search_fields = ("title", "user__email", "assigned_ngo__email")


@admin.register(DonationRequest)
class DonationRequestAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "category", "status", "created_at")
    list_filter = ("category", "status", "created_at")
    search_fields = ("name", "phone")


@admin.register(NGOCategory)
class NGOCategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "ngo", "donation_type", "display_name", "is_active", "created_at")
    list_filter = ("donation_type", "is_active", "created_at")
    search_fields = ("ngo__email", "ngo__first_name", "display_name")
