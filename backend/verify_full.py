import os
import sys
import subprocess
import time
import requests

def run_command(command):
    print(f"Running: {command}")
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error executing {command}:\n{result.stderr}")
        return False
    print(f"Success:\n{result.stdout}")
    return True

def check_server(url, retries=5):
    print(f"Checking server availability at {url}...")
    for i in range(retries):
        try:
            requests.get(url)
            print("Server is up!")
            return True
        except requests.exceptions.ConnectionError:
            print(f"Server not ready, retrying ({i+1}/{retries})...")
            time.sleep(2)
    print("Server failed to respond.")
    return False

def main():
    # 1. Migrations
    print("--- Step 1: Applying Migrations ---")
    if not run_command("python manage.py makemigrations"): return
    if not run_command("python manage.py migrate"): return

    # 2. Check Server (Assume it's running via external command, or valid url)
    # If not running, we could try to start it, but usually we rely on the user's environment or separate process.
    # The agent started a background server task, so we assume it's up.
    if not check_server("http://127.0.0.1:8000/api/donations/"):
        print("WARNING: Server might not be running. Please ensure 'runserver' is active.")
        # Attempt to run check scripts anyway might fail
    
    # 3. Verify Guest
    print("\n--- Step 2: Verifying Guest Login ---")
    if not run_command("python verify_fix.py"): return

    # 4. Verify Request
    print("\n--- Step 3: Verifying Donation Request ---")
    if not run_command("python verify_request.py"): return

    print("\n=== ALL SYSTEM CHECKS PASSED ===")

if __name__ == "__main__":
    main()
