from django.contrib import admin
from .models import AidRequest


@admin.register(AidRequest)
class AidRequestAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'title',
        'beneficiary',
        'category',
        'urgency_level',
        'status',
        'created_at',
    )
    list_filter = ('status', 'category', 'urgency_level')
    search_fields = ('title', 'description', 'beneficiary__email')
    readonly_fields = ('created_at', 'updated_at')