#!/usr/bin/env python3
"""
Simple HTTP Server for Family Tree Website
No authentication or database required - all data stored locally in browser
"""

import http.server
import socketserver
import webbrowser
import os
from pathlib import Path

# Configuration
PORT = 8000
DIRECTORY = Path(__file__).parent

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)
    
    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()

def start_server():
    """Start the local web server"""
    
    # Change to the script directory
    os.chdir(DIRECTORY)
    
    # Create the server
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print("=" * 60)
        print("🌳 Family Tree Website Server")
        print("=" * 60)
        print(f"\n✅ Server started successfully!")
        print(f"\n🌐 Open your browser and visit:")
        print(f"   http://localhost:{PORT}")
        print(f"\n📁 Serving files from: {DIRECTORY}")
        print(f"\n💾 All data is stored locally in your browser")
        print(f"   (No database or cloud storage required)")
        print(f"\n⏹️  Press Ctrl+C to stop the server")
        print("\n" + "=" * 60 + "\n")
        
        # Automatically open browser
        try:
            webbrowser.open(f'http://localhost:{PORT}')
            print("🚀 Opening browser automatically...\n")
        except:
            print("⚠️  Could not open browser automatically.")
            print(f"   Please manually open: http://localhost:{PORT}\n")
        
        # Start serving
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Server stopped. Goodbye!")

if __name__ == "__main__":
    start_server()

