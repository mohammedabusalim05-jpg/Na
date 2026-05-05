from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email must be set")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("role", "ADMIN")  # ⭐ أدمن تلقائيًا

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    # ⛔ نحن لا نستخدم username للتسجيل
    username = models.CharField(
        max_length=150,
        blank=True,
        null=True
    )

    email = models.EmailField(unique=True)

    phone = models.CharField(max_length=20, blank=True, null=True)
    governorate = models.CharField(max_length=100, blank=True, null=True)
    blood_type = models.CharField(max_length=5, blank=True, null=True)
    birth_date = models.DateField(null=True, blank=True)
    # ⭐⭐⭐ الإضافة المهمة ⭐⭐⭐
    ROLE_CHOICES = (
        ("ADMIN", "Admin"),
        ("DONOR", "Donor"),
        ("VOLUNTEER", "Volunteer"),
        ("BENEFICIARY", "Beneficiary"),
        ("NGO_EMPLOYEE", "NGO Employee"),
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="DONOR"
    )
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()   # ⭐ هذا السطر هو المفتاح

    def __str__(self):
        return self.email

