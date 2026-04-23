# 🔗 DEMONIC Bot v1.8.0 - WEB PAIRING GUIDE (8-Digit Code)

## Quick Start

### Option 1: One-Click Reset & Pair (Recommended)

#### Windows (PowerShell)
```powershell
cd C:\Users\Baha\Desktop\DEMONIC-V.1.6.0
PowerShell -ExecutionPolicy Bypass -File reset-session.ps1
```

#### Mac/Linux (Bash)
```bash
cd ~/path/to/DEMONIC-V.1.6.0
bash reset-session.sh
```

**What happens:**
1. ✅ Session folder deleted (removes old pairing)
2. ✅ Dependencies verified/installed
3. ✅ Bot starts and prompts for phone number
4. ✅ 8-digit pairing code generated
5. ✅ Enter code in WhatsApp → Linked Devices → Link with phone number

---

## Manual Pairing Steps

### Step 1: Clean Session (First Time)
```powershell
# Windows
Remove-Item -Recurse -Force .\session

# Mac/Linux
rm -rf ./session
```

### Step 2: Install Dependencies
```powershell
npm install --no-audit --no-fund
```

### Step 3: Start Bot
```powershell
node index.js
```

**Expected output:**
```
╔══════════════════════════════════════════════╗
║        DEMONIC WHATSAPP BOT v1.8.0         ║
╚══════════════════════════════════════════════╝

🔹 DEMONIC BOT launch complete...

📱 Enter your WhatsApp phone number (with country code, e.g., 1234567890): 
```

### Step 4: Enter Your Phone Number
When prompted, type your WhatsApp phone number **with country code** (no + or spaces):

```
📱 Enter your WhatsApp phone number (with country code, e.g., 1234567890): 1234567890
```

**Examples:**
- USA: `12125551234`
- UK: `442071838750`
- India: `919876543210`
- Nigeria: `2349054345858`

### Step 5: Get Your 8-Digit Code

The bot will generate a pairing code:

```
═══════════════════════════════════════════════════════════════

✅ PAIRING CODE GENERATED!

📋 Your 8-Digit Code:  12345678 

👇 Next Steps:

1. Open WhatsApp on your phone
2. Go to Settings → Linked Devices
3. Tap "Link with phone number"
4. Enter your number: 1234567890
5. Enter this code: 12345678
6. Approve on your phone

⏳ Waiting for pairing confirmation...

═══════════════════════════════════════════════════════════════
```

### Step 6: Pair on Your Phone

1. On your WhatsApp phone, go to **Settings** → **Linked Devices**
2. Tap **"Link with phone number"** (web pairing method)
3. Enter your phone number: `1234567890`
4. When prompted, enter the code from the terminal: `12345678`
5. Tap **Continue** and approve

### Step 7: Wait for Connection

The terminal will show:
```
✅ BOT CONNECTED - Ready to receive messages
✅ DEMONIC v1.8.0 IS NOW ONLINE!
```

✨ **Bot is now paired!**

---

## Pairing Commands

### Check Pairing Status
Send this in any chat:
```
/pair-status
```

**If paired:**
```
✅ BOT PAIRING STATUS

🟢 Status: PAIRED & CONNECTED

📱 Session Info:
├─ Bot JID: 1234567890
├─ Session Files: 8
├─ Session Size: 45.32 KB
└─ Connection: Active

✨ Bot is ready to use!
```

**If NOT paired:**
```
🔴 Status: NOT PAIRED

The bot needs to be paired with WhatsApp first.

📱 To pair the bot:
1. Go to bot server/terminal
2. Run: PowerShell -ExecutionPolicy Bypass -File reset-session.ps1
3. Enter your phone number when prompted
4. Get the 8-digit code and enter it in WhatsApp
5. Send /pair-status again to verify

💡 Alternative: Use /pair [number] as owner to generate a pairing code
```

### Pair Another Phone (Owner Only)
```
/pair 1234567890
```

**Response:**
```
✅ REAL-TIME PAIRING CODE GENERATED

📱 Number: 1234567890
🔑 Code: 1234-5678

⏰ Valid for: 15 minutes

📋 How to pair:
1. Open WhatsApp on the phone
2. Go to Settings → Linked Devices
3. Tap "Link with phone number"
4. Enter the code: 1234-5678

💾 Session saved as: session-1234567890
✅ Number will be automatically added as admin!
```

---

## Troubleshooting

### Issue: "Invalid phone number" error

**Solution:**
- Enter the number **with country code** (no + or spaces)
- Examples:
  - ✅ Correct: `12125551234`
  - ❌ Wrong: `+1 212 555 1234`
  - ❌ Wrong: `1 (212) 555-1234`
- Must be at least 10 digits

---

### Issue: Code is not working in WhatsApp

**Solution:**
1. Ensure you're using **"Link with phone number"** method (NOT the QR method)
2. Double-check the code matches exactly
3. Code is valid for **15 minutes** only
4. If expired, restart the bot: `Ctrl+C` then `node index.js`

---

### Issue: "Connection timeout" during pairing

**Solution:**
1. Close the bot: `Ctrl+C`
2. Check internet connection: `ping 8.8.8.8`
3. Clear session: `Remove-Item -Recurse -Force .\session`
4. Restart: `node index.js`

---

### Issue: Bot says "NOT PAIRED" but I entered the code

**Solution:**
1. Wait 10-20 seconds for connection to fully establish
2. Check logs for `✅ BOT CONNECTED` message
3. Send `/pair-status` again to refresh
4. If still not paired, check WhatsApp:
   - Open **WhatsApp** → **Settings** → **Linked Devices**
   - Verify the device appears in the list
   - If not, restart WhatsApp and try again

---

### Issue: "Network error" or "WhatsApp unreachable"

**Solution:**
1. Ensure stable internet connection
2. Try a different WhatsApp number if available
3. Restart the bot
4. If problem persists, wait 10 minutes and retry

---

## Session Files & Storage

### What gets saved?
After pairing, these files are created in `./session/`:
```
./session/
├─ creds.json             # WhatsApp credentials
├─ keys/                  # Encryption keys
├─ auth_info/             # Authentication info
└─ app-state-sync/        # App state cache
```

### How to backup session
```powershell
# Create backup
Copy-Item -Recurse .\session .\session.backup

# Restore backup
Remove-Item -Recurse -Force .\session
Copy-Item -Recurse .\session.backup .\session
node index.js
```

### How to clear & re-pair
```powershell
Remove-Item -Recurse -Force .\session
node index.js
# Enter phone number again
# Enter new pairing code
```

---

## Advanced: Multi-Bot Setup

To run multiple bots on the same machine:

### Create separate session directories
```powershell
# Bot 1
mkdir bot1
cd bot1
npm install
node index.js
# Enter phone number for Bot 1
# Bot 1 paired with session1

# Bot 2 (separate terminal)
mkdir bot2
cd bot2
npm install
node index.js
# Enter phone number for Bot 2
# Bot 2 paired with session2
```

Each bot uses its own phone number and pairing code.

---

## Performance After Pairing

### Initial metrics:
- **Startup:** 5-10 seconds (warm)
- **Memory:** 80-120 MB (low-end mode)
- **CPU:** 5-15% (idle)
- **Reconnect:** < 1 minute

### Verify with commands:
```
/alive       # Quick health check
/status      # Full bot status
/uptime      # How long running
/pair-status # Pairing confirmation
```

---

## 📱 WhatsApp Linked Devices (Background Info)

WhatsApp supports up to **4 linked devices** per account via web pairing:

- **Phone:** Primary device (always running)
- **Web:** 1 linked device
- **Desktop:** 1 linked device
- **Tablet:** 1 linked device

The DEMONIC bot takes one **linked device** slot. If you need more bots, use different WhatsApp accounts or separate phone numbers.

---

## Quick Reference

| Task | Command |
|------|---------|
| Reset & pair | `PowerShell -ExecutionPolicy Bypass -File reset-session.ps1` |
| Check status | `/pair-status` |
| Pair alternative number | `/pair 1234567890` |
| Clear session (manual) | `Remove-Item -Recurse -Force .\session` |
| Start bot | `node index.js` |
| Monitor bot | `node monitor.js` |

---

## 🎉 Success Checklist

- ✅ Ran reset script or `node index.js`
- ✅ Entered phone number when prompted
- ✅ Received 8-digit pairing code
- ✅ Went to WhatsApp → Settings → Linked Devices
- ✅ Tapped "Link with phone number"
- ✅ Entered code in WhatsApp
- ✅ Terminal shows `✅ BOT CONNECTED`
- ✅ Terminal shows `✅ DEMONIC v1.8.0 IS NOW ONLINE!`
- ✅ Sent `/pair-status` → shows "PAIRED & CONNECTED"
- ✅ Sent `/menu` → bot responds with commands
- ✅ Sent `/alive` → bot returns health check

**You're all set! 🚀**

---

For issues, check [TESTING.md](TESTING.md) or [DEPLOYMENT.md](DEPLOYMENT.md).
