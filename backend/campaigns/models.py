from django.db import models
from django.conf import settings
import uuid


class Campaign(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    status = models.CharField(
        max_length=30,
        choices=[
            ("Draft", "Draft"),
            ("PendingVerification", "Pending Verification"),
            ("Approved", "Approved"),
            ("Rejected", "Rejected"),
        ],
        default="Draft"
    )

    ngo = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="campaigns"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
