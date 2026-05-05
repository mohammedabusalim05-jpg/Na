from rest_framework import serializers
from django.contrib.auth import get_user_model
from cases.models import AidRequest
from .models import Donation, DonationRequest, NGOCategory


User = get_user_model()


# =========================
# DONATION SERIALIZER
# =========================
class DonationSerializer(serializers.ModelSerializer):
    aid_request_title = serializers.CharField(source="aid_request.title", read_only=True)
    assigned_ngo_email = serializers.EmailField(source="assigned_ngo.email", read_only=True)
    assigned_ngo_name = serializers.CharField(source="assigned_ngo.first_name", read_only=True)

    class Meta:
        model = Donation
        fields = "__all__"
        read_only_fields = ["id", "user", "created_at"]


    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # إضافة تفاصيل المستخدم إن وُجد
        if instance.user:
            representation["user_details"] = {
                "id": instance.user.id,
                "name": instance.user.first_name or instance.user.username,
                "email": instance.user.email,
                "phone": getattr(instance.user, "phone", None),
            }
        else:
            representation["user_details"] = None

        return representation


class NGOCategorySerializer(serializers.ModelSerializer):
    ngo_id = serializers.IntegerField(source="ngo.id", read_only=True)
    ngo_email = serializers.EmailField(source="ngo.email", read_only=True)
    ngo_name = serializers.SerializerMethodField()

    class Meta:
        model = NGOCategory
        fields = [
            "id",
            "donation_type",
            "display_name",
            "description",
            "ngo_id",
            "ngo_name",
            "ngo_email",
        ]

    def get_ngo_name(self, obj):
        return obj.ngo.first_name or obj.ngo.username or obj.ngo.email

# =========================
# DONATION CREATE SERIALIZER (Guest + User)
# =========================
class DonationCreateSerializer(serializers.ModelSerializer):
    aid_request_id = serializers.PrimaryKeyRelatedField(
        source="aid_request",
        queryset=AidRequest.objects.all(),
        required=False,
        allow_null=True,
        write_only=True
    )
    assigned_ngo_id = serializers.PrimaryKeyRelatedField(
        source="assigned_ngo",
        queryset=User.objects.filter(role="NGO_EMPLOYEE"),
        required=False,
        allow_null=True,
        write_only=True
    )

    class Meta:
        model = Donation
        fields = [
            "title",
            "description",
            "donation_type",
            "image",
            "location",
            "amount",
            "guest_name",
            "guest_email",
            "guest_phone",
            "donor_birth_date",
            "donor_gender",
            "donor_blood_type",
            "donor_last_donation_date",
            "aid_request_id",
            "assigned_ngo_id",
        ]

    def validate(self, data):
        donation_type = data.get("donation_type")

        if donation_type == "blood":
            required_fields = [
                "guest_name",
                "guest_phone",
                "donor_birth_date",
                "donor_gender",
                "donor_blood_type",
            ]

            for field in required_fields:
                if not data.get(field):
                    raise serializers.ValidationError(
                        {field: "This field is required for blood donations."}
                    )

        if donation_type == "money":
            amount = data.get("amount")
            if amount is None or amount <= 0:
                raise serializers.ValidationError(
                    {"amount": "Financial donations require an amount greater than 0."}
                )

        aid_request = data.get("aid_request")
        assigned_ngo = data.get("assigned_ngo")

        if aid_request and assigned_ngo:
            raise serializers.ValidationError(
                {"assigned_ngo_id": "Do not provide assigned_ngo_id for case-specific donations."}
            )

        if aid_request and donation_type != "money":
            raise serializers.ValidationError(
                {"donation_type": "Case-specific donations must be money donations."}
            )

        if aid_request:
            if aid_request.status == "COMPLETED" or aid_request.remaining_amount() <= 0:
                raise serializers.ValidationError(
                    {"aid_request_id": "This aid request is already fully funded."}
                )

            if aid_request.status != "APPROVED" or aid_request.ngo_status != "APPROVED":
                raise serializers.ValidationError(
                    {
                        "aid_request_id": (
                            "Donations can only be linked to published NGO-approved cases."
                        )
                    }
                )

            remaining_amount = aid_request.remaining_amount()
            amount = data.get("amount")

            if amount > remaining_amount:
                raise serializers.ValidationError(
                    {
                        "amount": (
                            f"Only {remaining_amount} JOD is remaining for this aid request."
                        )
                    }
                )

        if assigned_ngo:
            if getattr(assigned_ngo, "role", None) != "NGO_EMPLOYEE":
                raise serializers.ValidationError(
                    {"assigned_ngo_id": "Selected user must have role NGO_EMPLOYEE."}
                )

            if not NGOCategory.objects.filter(
                ngo=assigned_ngo,
                donation_type=donation_type,
                is_active=True
            ).exists():
                raise serializers.ValidationError(
                    {"assigned_ngo_id": "Selected NGO is not active for this donation category."}
                )

        return data

# =========================
# DONATION REQUEST SERIALIZER
# =========================
class DonationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonationRequest
        fields = "__all__"
        read_only_fields = ["user", "status", "created_at"]
        extra_kwargs = {
            # دعم Guest بدون أخطاء
            "user": {"required": False, "allow_null": True},
            "proof_document": {"required": False, "allow_null": True},
        }

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # إضافة تفاصيل المستخدم إن وُجد
        if instance.user:
            representation["user_details"] = {
                "id": instance.user.id,
                "name": instance.user.first_name or instance.user.username,
                "email": instance.user.email,
                "phone": getattr(instance.user, "phone", None),
            }
        else:
            representation["user_details"] = None

        return representation
