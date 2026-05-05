import os
import sys
import time

print("Script started.")
print("Setting env vars...")
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

print("Importing django...")
import django
from django.db import connection

print("Running django.setup()...")
try:
    django.setup()
    print("django.setup() finished.")
except Exception as e:
    print(f"django.setup() failed: {e}", flush=True)
    sys.exit(1)

def fix_schema():
    print("Attempting to get cursor...", flush=True)
    try:
        with connection.cursor() as cursor:
            print("Cursor obtained.", flush=True)
            
            # Check status
            print("Checking status column...")
            cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'donations_donationrequest' AND column_name = 'status';")
            if cursor.fetchone():
                print("Status column exists.")
            else:
                print("Adding status column...")
                cursor.execute("ALTER TABLE donations_donationrequest ADD COLUMN status varchar(10) NOT NULL DEFAULT 'pending';")
                print("Status column added.")
                
            # Check is_approved
            print("Checking is_approved column...")
            cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'donations_donationrequest' AND column_name = 'is_approved';")
            if cursor.fetchone():
                print("Dropping is_approved column...")
                cursor.execute("ALTER TABLE donations_donationrequest DROP COLUMN is_approved;")
                print("is_approved column dropped.")
            else:
                print("is_approved column does not exist.")
                
    except Exception as e:
        print(f"DB Error: {e}")

if __name__ == "__main__":
    fix_schema()
