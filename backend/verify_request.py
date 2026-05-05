import requests
import sys

BASE_URL = "http://127.0.0.1:8000/api/donations"

def test_create_request():
    print("Testing Donation Request Creation...")
    payload = {
        "name": "Test User",
        "phone": "1234567890",
        "category": "blood", # Assuming 'blood' is a valid choice from models
        "description": "Need blood urgently"
    }
    
    # We want to test anonymous/guest creation if allowed, or user creation
    # The view allows anyone to post? 
    # View: DonationRequestCreateView -> Permission: AllowAny
    
    try:
        # Send without auth first (Guest mode)
        response = requests.post(f"{BASE_URL}/requests/create/", data=payload)
        
        with open("verification.log", "w") as f:
            if response.status_code == 201:
                f.write("SUCCESS: Donation Request created (Guest mode)\n")
                f.write(str(response.json()))
                print("SUCCESS")
                return True
            else:
                f.write(f"FAILURE: Status {response.status_code}\n")
                f.write(response.text)
                print("FAILURE")
                return False

    except Exception as e:
        with open("verification.log", "w") as f:
            f.write(f"ERROR: {e}")
        print(f"ERROR: {e}")
        return False

if __name__ == "__main__":
    if test_create_request():
        sys.exit(0)
    else:
        sys.exit(1)
