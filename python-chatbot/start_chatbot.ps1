# PowerShell script to start chatbot server
$env:API_PORT = "8002"
Write-Host "Starting Chatbot API server on http://0.0.0.0:8002" -ForegroundColor Green
Write-Host "API endpoint: http://localhost:8002/api/chat/" -ForegroundColor Cyan
Write-Host "Health check: http://localhost:8002/health" -ForegroundColor Cyan
python start_chatbot.py

