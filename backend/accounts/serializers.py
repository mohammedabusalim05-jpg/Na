from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password
# from donations.serializers import DonationSerializer

# class UserDetailSerializer(serializers.ModelSerializer):
#     donations = DonationSerializer(many=True, read_only=True)

#     class Meta:
#         model = User
#         fields = ["id", "username", "email", "first_name", "last_name", "phone", "governorate", "blood_type", "donations"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    full_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ["full_name", "email", "password", "phone", "governorate", "blood_type", "role"]

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        full_name = validated_data.pop("full_name", "")
        password = validated_data.pop("password")

        email = validated_data.get("email")
        role = validated_data.get("role", "DONOR")

        # ❗️ مهم جداً — username = email نفسه
        user = User(
            email=email,
            username=email,
            phone=validated_data.get("phone"),
            governorate=validated_data.get("governorate"),
            blood_type=validated_data.get("blood_type"),
            role=role,
        )

        user.set_password(password)

        # نضيف الاسم الكامل للـ first_name (اختياري)
        if full_name:
            user.first_name = full_name

        user.save()
        return user
