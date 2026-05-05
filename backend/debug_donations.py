import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from donations.models import Donation

print(f"Total Donations: {Donation.objects.count()}")
for d in Donation.objects.all():
    print(f"ID: {d.id} | Title: {d.title} | Type: {d.donation_type}")
