import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def check_columns():
    table_name = 'donations_donationrequest'
    print(f"Inspecting table: {table_name}")
    with connection.cursor() as cursor:
        try:
            cursor.execute(f"SELECT column_name FROM information_schema.columns WHERE table_name = '{table_name}'")
            columns = [row[0] for row in cursor.fetchall()]
            print("Columns found:", columns)
            
            if 'status' in columns:
                print("✅ 'status' column EXISTS.")
            else:
                print("❌ 'status' column is MISSING.")
                
            if 'is_approved' in columns:
                print("⚠️ 'is_approved' column STILL EXISTS (should be removed).")
            else:
                print("✅ 'is_approved' column is GONE.")
                
        except Exception as e:
            print(f"Error inspecting table: {e}")

if __name__ == "__main__":
    check_columns()
