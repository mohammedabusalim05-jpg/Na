from rest_framework import serializers
from .models import AidRequest


class AidRequestSerializer(serializers.ModelSerializer):
    beneficiary_email = serializers.EmailField(source='beneficiary.email', read_only=True)
    beneficiary_name = serializers.CharField(source='beneficiary.first_name', read_only=True)
    approved_by_ngo_email = serializers.EmailField(source='approved_by_ngo.email', read_only=True)
    approved_by_ngo_name = serializers.CharField(source='approved_by_ngo.first_name', read_only=True)
    raised_amount = serializers.SerializerMethodField()
    remaining_amount = serializers.SerializerMethodField()
    funding_percentage = serializers.SerializerMethodField()
    is_fully_funded = serializers.SerializerMethodField()

    class Meta:
        model = AidRequest
        fields = [
            'id',
            'beneficiary',
            'beneficiary_email',
            'beneficiary_name',
            'title',
            'description',
            'category',
            'urgency_level',
            'location',
            'needed_amount',
            'raised_amount',
            'remaining_amount',
            'funding_percentage',
            'is_fully_funded',
            'status',
            'admin_note',
            'ngo_status',
            'approved_by_ngo',
            'approved_by_ngo_email',
            'approved_by_ngo_name',
            'ngo_note',
            'ngo_approved_at',
            'created_at',
            'updated_at',
        ]

        read_only_fields = [
            'id',
            'beneficiary',
            'beneficiary_email',
            'beneficiary_name',
            'raised_amount',
            'remaining_amount',
            'funding_percentage',
            'is_fully_funded',
            'status',
            'admin_note',
            'ngo_status',
            'approved_by_ngo',
            'approved_by_ngo_email',
            'approved_by_ngo_name',
            'ngo_note',
            'ngo_approved_at',
            'created_at',
            'updated_at',
        ]

    def get_raised_amount(self, obj):
        return obj.raised_amount()

    def get_remaining_amount(self, obj):
        return obj.remaining_amount()

    def get_funding_percentage(self, obj):
        return obj.funding_percentage()

    def get_is_fully_funded(self, obj):
        return obj.is_fully_funded()


class AidRequestAdminUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AidRequest
        fields = [
            'status',
            'admin_note',
        ]
