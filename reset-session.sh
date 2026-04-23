#!/bin/bash
# DEMONIC Bot - One-Click Session Reset & Restart
# This script deletes the session folder and restarts the bot
# Usage: bash reset-session.sh

echo ""
echo "═════════════════════════════════════════════════════════════"
echo "  🔄 DEMONIC BOT - SESSION RESET & RESTART"
echo "═════════════════════════════════════════════════════════════"
echo ""

# Check if session folder exists
if [ -d "./session" ]; then
    echo "🗑️  Removing existing session folder..."
    rm -rf ./session
    if [ $? -eq 0 ]; then
        echo "✅ Session folder deleted successfully"
    else
        echo "❌ Failed to delete session folder"
        exit 1
    fi
else
    echo "ℹ️  No existing session folder found"
fi

echo ""
echo "📋 Checking dependencies..."

# Check if node_modules exists
if [ ! -d "./node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --no-audit --no-fund
    if [ $? -ne 0 ]; then
        echo "❌ npm install failed"
        exit 1
    fi
fi

echo "✅ Dependencies ready"
echo ""

echo "🚀 Starting DEMONIC Bot v1.8.0..."
echo "📱 Enter your phone number to get an 8-digit pairing code"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the bot
node index.js

echo ""
echo "═════════════════════════════════════════════════════════════"
echo "  🔴 Bot stopped"
echo "═════════════════════════════════════════════════════════════"
echo ""
