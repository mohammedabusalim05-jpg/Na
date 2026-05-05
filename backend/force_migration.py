import subprocess
import time

def run_interactive_migration():
    print("Starting makemigrations...")
    process = subprocess.Popen(
        ['python', 'manage.py', 'makemigrations', 'donations'],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=0
    )

    # Give it a moment to prompt
    time.sleep(2)
    
    # Send "2" (No) assuming it asks "Did you rename ...?"
    # If it asks for default, "2" might be "Quit".
    # We'll try "2\n" for "No, it's not a rename".
    print("Sending '2' (No)...")
    try:
        out, err = process.communicate(input="2\n", timeout=10)
        print("STDOUT:", out)
        print("STDERR:", err)
    except subprocess.TimeoutExpired:
        process.kill()
        print("Timed out!")
        out, err = process.communicate()
        print("STDOUT (after kill):", out)
        print("STDERR (after kill):", err)

if __name__ == "__main__":
    run_interactive_migration()
