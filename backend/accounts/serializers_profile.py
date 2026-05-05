from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "phone", "governorate", "blood_type", "is_staff", "is_superuser", "is_active", "date_joined","role"]
        read_only_fields = ["id", "email", "username", "is_staff", "is_superuser", "date_joined"]
