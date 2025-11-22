# PowerShell script to start chatbot server
$env:API_PORT = "8001"
Write-Host "Starting Chatbot API server on http://0.0.0.0:8001" -ForegroundColor Green
Write-Host "API endpoint: http://localhost:8001/api/chat/" -ForegroundColor Cyan
python start_chatbot.py

