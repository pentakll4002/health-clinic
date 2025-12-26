#!/usr/bin/env python
"""Start script for chatbot FastAPI server"""
import uvicorn
import os
import sys

# Change to script directory to ensure proper imports
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

# Add current directory to path for imports
if script_dir not in sys.path:
    sys.path.insert(0, script_dir)

if __name__ == "__main__":
    port = int(os.getenv("API_PORT", "8002"))
    print("=" * 60)
    print(f"Starting Chatbot API server on http://0.0.0.0:{port}")
    print(f"API endpoint: http://localhost:{port}/api/chat/")
    print(f"Health check: http://localhost:{port}/health")
    print("=" * 60)
    try:
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=port,
            reload=True,
            log_level="info"
        )
    except Exception as e:
        print(f"Error starting server: {e}", file=sys.stderr)
        sys.exit(1)

