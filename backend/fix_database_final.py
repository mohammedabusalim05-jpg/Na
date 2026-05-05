"""
Comprehensive Database Schema Fix Script
This will ensure the status column exists and is_approved is removed
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.db import connection

def fix_database_schema():
    """Fix the donations_donationrequest table schema"""
    print("=" * 60)
    print("DATABASE SCHEMA FIX SCRIPT")
    print("=" * 60)
    
    with connection.cursor() as cursor:
        # Check current columns
        print("\n1. Checking current table structure...")
        cursor.execute("""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'donations_donationrequest'
            ORDER BY ordinal_position;
        """)
        
        columns = cursor.fetchall()
        print(f"\nFound {len(columns)} columns:")
        for col in columns:
            print(f"  - {col[0]} ({col[1]})")
        
        column_names = [col[0] for col in columns]
        
        # Fix 1: Add status column if missing
        if 'status' not in column_names:
            print("\n2. Adding 'status' column...")
            cursor.execute("""
                ALTER TABLE donations_donationrequest 
                ADD COLUMN status VARCHAR(10) NOT NULL DEFAULT 'pending';
            """)
            print("   ✓ Status column added successfully")
        else:
            print("\n2. Status column already exists ✓")
        
        # Fix 2: Remove is_approved column if exists
        if 'is_approved' in column_names:
            print("\n3. Removing 'is_approved' column...")
            cursor.execute("""
                ALTER TABLE donations_donationrequest 
                DROP COLUMN is_approved;
            """)
            print("   ✓ is_approved column removed successfully")
        else:
            print("\n3. is_approved column already removed ✓")
        
        # Verify final state
        print("\n4. Verifying final schema...")
        cursor.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'donations_donationrequest'
            ORDER BY ordinal_position;
        """)
        
        final_columns = [row[0] for row in cursor.fetchall()]
        print(f"\nFinal columns: {', '.join(final_columns)}")
        
        # Check for required columns
        required = ['id', 'name', 'phone', 'category', 'description', 'status', 'created_at']
        missing = [col for col in required if col not in final_columns]
        
        if missing:
            print(f"\n⚠️  WARNING: Missing required columns: {missing}")
            return False
        else:
            print("\n✅ All required columns present!")
            return True

if __name__ == "__main__":
    try:
        success = fix_database_schema()
        print("\n" + "=" * 60)
        if success:
            print("DATABASE SCHEMA FIX COMPLETED SUCCESSFULLY!")
            print("You can now submit donation requests.")
        else:
            print("DATABASE SCHEMA FIX INCOMPLETE - CHECK WARNINGS ABOVE")
        print("=" * 60)
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
