# DEMONIC Bot - One-Click Session Reset & Restart
# This script deletes the session folder and restarts the bot
# Usage: PowerShell -ExecutionPolicy Bypass -File reset-session.ps1

Write-Host "`n" -ForegroundColor Cyan
Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🔄 DEMONIC BOT - SESSION RESET & RESTART" -ForegroundColor Cyan
Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "`n"

# Check if session folder exists
$sessionDir = ".\session"
if (Test-Path $sessionDir) {
    Write-Host "🗑️  Removing existing session folder..." -ForegroundColor Yellow
    try {
        Remove-Item -Recurse -Force $sessionDir
        Write-Host "✅ Session folder deleted successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to delete session folder: $_" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "ℹ️  No existing session folder found" -ForegroundColor Blue
}

Write-Host "`n"
Write-Host "📋 Checking dependencies..." -ForegroundColor Cyan

# Check if node_modules exists
if (-not (Test-Path ".\node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ npm install failed" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Dependencies ready" -ForegroundColor Green
Write-Host "`n"

Write-Host "🚀 Starting DEMONIC Bot v1.8.0..." -ForegroundColor Cyan
Write-Host "📱 Enter your phone number to get an 8-digit pairing code" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "`n"

# Start the bot
node index.js

Write-Host "`n"
Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🔴 Bot stopped" -ForegroundColor Red
Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "`n"
