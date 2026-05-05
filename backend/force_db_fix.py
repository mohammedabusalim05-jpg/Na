import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def force_fix():
    print("Forcefully adding status column...")
    with connection.cursor() as cursor:
        try:
            cursor.execute("ALTER TABLE donations_donationrequest ADD COLUMN status VARCHAR(10) NOT NULL DEFAULT 'pending';")
            print("SUCCESS: Added status column.")
        except Exception as e:
            print(f"INFO: Could not add status (might exist): {e}")

        try:
            cursor.execute("ALTER TABLE donations_donationrequest DROP COLUMN is_approved;")
            print("SUCCESS: Dropped is_approved column.")
        except Exception as e:
            print(f"INFO: Could not drop is_approved (might not exist): {e}")

if __name__ == "__main__":
    force_fix()
