# PowerShell script to start chatbot server in background
$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Chatbot Server" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

# Check if port 8002 is already in use
$portInUse = Get-NetTCPConnection -LocalPort 8002 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "Port 8002 is already in use. Stopping existing process..." -ForegroundColor Yellow
    $process = Get-Process -Id $portInUse.OwningProcess -ErrorAction SilentlyContinue
    if ($process) {
        Stop-Process -Id $process.Id -Force
        Start-Sleep -Seconds 2
    }
}

# Set environment variable
$env:API_PORT = "8002"

# Change to script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Activate virtual environment if exists
if (Test-Path ".venv\Scripts\Activate.ps1") {
    Write-Host "Activating virtual environment..." -ForegroundColor Cyan
    . .venv\Scripts\Activate.ps1
}

# Start server
Write-Host "Starting server on http://localhost:8002" -ForegroundColor Green
Write-Host "API endpoint: http://localhost:8002/api/chat/" -ForegroundColor Cyan
Write-Host "Health check: http://localhost:8002/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

python start_chatbot.py

