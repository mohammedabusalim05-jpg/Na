import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.db import connection

def check():
    with connection.cursor() as cursor:
        cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'donations_donationrequest';")
        cols = [row[0] for row in cursor.fetchall()]
    
    with open('db_status_check.txt', 'w') as f:
        f.write(f"Columns: {', '.join(cols)}\n")
        if 'status' in cols:
            f.write("STATUS: OK\n")
        else:
            f.write("STATUS: MISSING\n")

if __name__ == "__main__":
    check()
