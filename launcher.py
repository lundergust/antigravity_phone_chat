import sys
import subprocess
import time
import random
import string
import os
import socket
import argparse
import logging

# -----------------------------------------------------------------------------
# Dependency Management
# -----------------------------------------------------------------------------
def check_dependencies():
    """Checks and installs required Python packages."""
    needed = ["pyngrok", "python-dotenv", "qrcode"]
    missing = []
    
    for pkg in needed:
        try:
            if pkg == "pyngrok": from pyngrok import ngrok
            elif pkg == "python-dotenv": from dotenv import load_dotenv
            elif pkg == "qrcode": import qrcode
        except ImportError:
            missing.append(pkg)

    if missing:
        print(f"📦 Installing missing Python dependencies: {', '.join(missing)}...")
        subprocess.check_call([sys.executable, "-m", "pip", "install"] + missing)

def check_node_environment():
    """Ensures Node dependencies are installed in root and web folders."""
    is_windows = sys.platform == "win32"
    
    # 1. Backend (Root)
    if not os.path.exists("node_modules"):
        print("📦 Installing Backend dependencies (root)...")
        subprocess.check_call(["npm", "install"], shell=is_windows)

    # 2. Frontend (Web)
    web_dir = os.path.join(os.getcwd(), "web")
    if os.path.exists(web_dir):
        # We run install if node_modules is missing or to sync new packages like lucide-react
        print("📦 Syncing Frontend dependencies (./web)...")
        subprocess.check_call(["npm", "install"], cwd=web_dir, shell=is_windows)
    else:
        print("❌ Error: './web' folder not found. React UI must be in the 'web' directory.")
        sys.exit(1)

# -----------------------------------------------------------------------------
# Helpers
# -----------------------------------------------------------------------------
def get_local_ip():
    """Determines the LAN IP for mobile connection."""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 80))
        IP = s.getsockname()[0]
    except Exception:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP

def print_qr(url):
    """Prints a QR code to the terminal."""
    import qrcode
    qr = qrcode.QRCode(version=1, box_size=1, border=1)
    qr.add_data(url)
    qr.make(fit=True)
    qr.print_ascii(invert=True)

# -----------------------------------------------------------------------------
# Main Execution
# -----------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="Antigravity Phone Connect Launcher")
    parser.add_argument('--mode', choices=['local', 'web'], default='web', help="Mode to run in")
    args = parser.parse_args()

    # 1. Environment Prep
    check_dependencies()
    check_node_environment()
    
    from pyngrok import ngrok
    from dotenv import load_dotenv
    load_dotenv()
    
    is_windows = sys.platform == "win32"
    passcode = os.environ.get('APP_PASSWORD')
    if not passcode:
        passcode = ''.join(random.choices(string.digits, k=6))
        os.environ['APP_PASSWORD'] = passcode
    
    processes = []
    
    try:
        # 2. Start Backend (Node)
        print("🚀 Starting Backend Server...")
        backend_log = open("server_log.txt", "w", encoding='utf-8')
        p_back = subprocess.Popen(["node", "server.js"], stdout=backend_log, stderr=backend_log, env=os.environ.copy())
        processes.append(p_back)

        # 3. Start Frontend (Vite)
        # We use --host to ensure it listens on the network for your phone
        print("🚀 Starting Vite UI (./web) with --host...")
        react_env = os.environ.copy()
        react_env["BROWSER"] = "none" 
        
        p_front = subprocess.Popen(
            ["npm", "run", "dev", "--", "--host"], 
            cwd="web", 
            shell=is_windows, 
            env=react_env
        )
        processes.append(p_front)

        # 4. Networking Setup
        # Vite default port is 5173
        port = "5173" 
        final_url = ""

        if args.mode == 'local':
            ip = get_local_ip()
            final_url = f"http://{ip}:{port}"
            print(f"\n📡 LOCAL WIFI ACCESS: {final_url}")
        else:
            token = os.environ.get('NGROK_AUTHTOKEN')
            if token:
                ngrok.set_auth_token(token)
            
            print("🌐 Establishing Web Tunnel (Ngrok)...")
            tunnel = ngrok.connect(port, host_header="rewrite")
            final_url = f"{tunnel.public_url}?key={passcode}"
            print(f"\n🌍 GLOBAL WEB ACCESS: {tunnel.public_url}")

        print(f"🔑 Passcode: {passcode}")
        print("\n📱 Scan this QR Code with your phone:")
        print_qr(final_url)
        print("\n" + "="*50)
        print("✅ All systems running. Press Ctrl+C to stop.")
        print("="*50)

        # Keep alive and monitor
        while True:
            time.sleep(1)
            if p_back.poll() is not None:
                print("❌ Backend server stopped unexpectedly.")
                break
            if p_front.poll() is not None:
                print("❌ Frontend (Vite) stopped unexpectedly.")
                break

    except KeyboardInterrupt:
        print("\n👋 Shutting down processes...")
    finally:
        for p in processes:
            p.terminate()
        if args.mode == 'web':
            ngrok.kill()
        backend_log.close()
        sys.exit(0)

if __name__ == "__main__":
    main()