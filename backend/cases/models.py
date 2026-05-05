from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import Sum
from decimal import Decimal


class AidRequest(models.Model):
    CATEGORY_CHOICES = [
        ('MEDICAL', 'Medical Help'),
        ('FOOD', 'Food Support'),
        ('HOUSING', 'Housing Support'),
        ('EDUCATION', 'Education Support'),
        ('EMERGENCY', 'Emergency Help'),
        ('FINANCIAL', 'Financial Support'),
        ('OTHER', 'Other'),
    ]

    URGENCY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('CRITICAL', 'Critical'),
    ]

    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('COMPLETED', 'Completed'),
    ]

    NGO_STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]

    beneficiary = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='aid_requests'
    )

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    urgency_level = models.CharField(max_length=20, choices=URGENCY_CHOICES, default='MEDIUM')
    location = models.CharField(max_length=255)

    needed_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        null=True,
        blank=True
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    admin_note = models.TextField(blank=True, null=True)
    ngo_status = models.CharField(max_length=20, choices=NGO_STATUS_CHOICES, default='PENDING')
    approved_by_ngo = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name='approved_aid_requests',
        null=True,
        blank=True
    )
    ngo_note = models.TextField(blank=True, null=True)
    ngo_approved_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.beneficiary.email}"

    def raised_amount(self):
        total = self.donations.filter(
            donation_type="money",
            amount__isnull=False
        ).aggregate(total=Sum("amount"))["total"]

        return total or Decimal("0.00")

    def remaining_amount(self):
        needed = self.needed_amount or Decimal("0.00")
        remaining = needed - self.raised_amount()
        return max(remaining, Decimal("0.00"))

    def funding_percentage(self):
        needed = self.needed_amount or Decimal("0.00")

        if needed <= 0:
            return 0

        percentage = (self.raised_amount() / needed) * Decimal("100")
        return min(round(percentage, 2), Decimal("100.00"))

    def is_fully_funded(self):
        needed = self.needed_amount or Decimal("0.00")
        return needed > 0 and self.raised_amount() >= needed
