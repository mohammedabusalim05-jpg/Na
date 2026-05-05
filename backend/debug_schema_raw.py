import os
import django
from django.db import connection

# Minimal setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def run():
    print("Running raw SQL check...")
    with connection.cursor() as cursor:
        cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'donations_donationrequest';")
        rows = cursor.fetchall()
        print("Columns:", [r[0] for r in rows])

if __name__ == '__main__':
    run()
