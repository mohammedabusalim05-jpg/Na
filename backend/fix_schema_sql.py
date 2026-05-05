import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def fix_schema():
    print("Attempting to fix schema via Raw SQL...")
    with connection.cursor() as cursor:
        # Check if column exists
        cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'donations_donationrequest' AND column_name = 'status';")
        if cursor.fetchone():
            print("Status column already exists. Skipping.")
        else:
            print("Adding 'status' column...")
            cursor.execute("ALTER TABLE donations_donationrequest ADD COLUMN status varchar(10) NOT NULL DEFAULT 'pending';")
            print("Column 'status' added.")

        # Check if is_approved exists and drop it
        cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'donations_donationrequest' AND column_name = 'is_approved';")
        if cursor.fetchone():
            print("Dropping 'is_approved' column...")
            cursor.execute("ALTER TABLE donations_donationrequest DROP COLUMN is_approved;")
            print("Column 'is_approved' dropped.")
        else:
            print("'is_approved' column already gone.")

if __name__ == "__main__":
    fix_schema()
