# 🤖 DEMONIC BOT v1.7.0 - DEPLOYMENT GUIDE

## ⚡ Quick Start

### Step 1: Prerequisites
- **Node.js v18+** — [Download](https://nodejs.org/en/) (Windows installer recommended)
- **npm** (comes with Node.js)
- **WhatsApp** installed on phone (for pairing)

### Step 2: Install Dependencies
```powershell
cd C:\Users\Baha\Desktop\DEMONIC-V.1.6.0
npm install --no-audit --no-fund
```

**Expected output:**
```
added 150+ packages in 45s
```

### Step 3: Run Pre-Flight Check (Optional)
```powershell
node pre-flight.js
```

**Expected output:**
```
✅ Node.js v18.x.x (required: >=18)
✅ npm v9.x.x
✅ All required files present
✅ PRE-FLIGHT CHECK PASSED - Ready to deploy!
```

### Step 4: Start the Bot
```powershell
node index.js
```

**Expected output:**
```
╔══════════════════════════════════════════════╗
║        DEMONIC WHATSAPP BOT v1.7.0        ║
╚══════════════════════════════════════════════╝

🔹 DEMONIC BOT launch complete — optimized for production terminals.
🔹 Use /menu after pairing to access management, downloads, and AI commands.

✨ ENABLED FEATURES:
   Command System
  🐛 Bug Message Spam
  💣 Deadly Messages
  🔗 Anti-Link System
  👋 Welcome/Leave System
  📊 User Statistics
  🎮 Games (Dare/Truth)
  🔐 Owner Commands

⏳ Waiting for QR code generation...
```

### Step 5: Pair WhatsApp
1. Open WhatsApp on your phone
2. Go to **Settings → Linked Devices → Link a Device**
3. Point phone at the QR code in the terminal
4. Approve the pairing on WhatsApp

**Success indicator:**
```
✅ BOT CONNECTED - Ready to receive messages
✅ DEMONIC v1.7.0 IS NOW ONLINE!
```

---

## 🧪 Testing & Verification

### Test 1: Rainbow Console Output
After startup, the terminal should show **colorful rainbow text** for status messages and logs. This indicates the UI enhancements are working.

### Test 2: Send /menu Command
Send any chat:
```
/menu
```

**Expected:** Menu with all commands in formatted list

### Test 3: Check Bot Status
```
/status
```

**Expected output:**
```
🤖 DEMONIC STATUS 🤖

⏰ Time: 14:30:45
⏱️ Uptime: 0d 0h 5m
🧠 Memory: 85 MB
📊 Connection: 🟢 EXCELLENT

...
```

### Test 4: Health Check
```
/alive
```

**Expected:**
```
✅ BOT HEALTH CHECK

⏱️ Uptime: 5 minutes
📊 Memory: 85 MB
🟢 Connection Quality: EXCELLENT
💓 Heartbeat: HEALTHY
⏳ Last Activity: now
```

### Test 5: Performance Mode Toggle (Owner Only)
```
/low-end
```

**Expected:**
```
✅ Performance: LOW-END
Optimized for low-resource environments. Processing tuned for stability.
```

Then:
```
/high-end
```

**Expected:**
```
⚡ Performance: HIGH-END
Processing optimized for speed and heavier panels.
```

**Verify mode switched:**
```
/status
```
Check if intervals have updated in the status output.

### Test 6: Offline/Online Mode
```
/offline
```

**Expected:**
```
✅ Offline mode: ON
New messages will get auto-reply
```

Then:
```
/online
```

**Expected:**
```
✅ Offline mode: OFF
Bot is now in ONLINE mode
```

---

## 🔧 Performance Metrics

### Low-End Mode (Default)
```
Keep-Alive Interval:     5 minutes   (conservative, low CPU)
Health Check:            2 minutes   (less frequent)
Message Cache:           100 items   (minimal memory)
Max Cache Size:          50 MB       (tight memory budget)
→ Best for: Low-end systems, shared hosting, free tiers
```

### High-End Mode
```
Keep-Alive Interval:     1 minute    (aggressive, higher CPU)
Health Check:            1 minute    (more frequent)
Message Cache:           1000 items  (more buffering)
Max Cache Size:          200 MB      (comfortable memory)
→ Best for: Powerful systems, heavy loads, many groups
```

---

## 🛡️ Stability Features

### ✅ Auto-Reconnect with Backoff
- Transient disconnects **do not restart** the bot
- Exponential backoff: 1s → 2s → 4s → 8s → 16s → 30s max
- Only permanent logout errors trigger full restart

### ✅ Heartbeat Monitoring
- Tracks connection health every 2 minutes (low) or 1 minute (high)
- Displays status: 🟢 EXCELLENT / 🟡 GOOD / 🔴 MONITORING
- Sends presence updates to prevent idle timeouts

### ✅ Memory Management
- Auto-cleans old messages (>24 hrs)
- Prunes inactive users (>7 days)
- Garbage collection every hour
- Prevents memory leaks on 24/7 operation

### ✅ Rainbow Console
- **Vibrant colored output** for all status messages
- Easy to spot important events in logs
- Enhances developer experience

---

## 📊 Monitoring & Logs

### Check Memory Usage
Watch the `/status` output for memory:
- **< 100 MB**: ✅ Excellent
- **100-150 MB**: 🟡 Good
- **> 200 MB**: ❌ Investigate leak

### Monitor Connection Quality
The status report shows:
- **Connection Quality**: 🟢 EXCELLENT (< 2 min since last heartbeat)
- **Restarts**: ✅ No restarts (stable)
- **Heartbeat**: 💚 Healthy

### View Bot Logs
All important events are logged with timestamps:
```
[14:30:45] 📩 IN  | User: /menu
[14:31:02] 📤 OUT | Sending menu...
[14:35:00] ✅ Performance mode: low
```

---

## 🚨 Troubleshooting

### Issue: QR Code Not Displaying
**Solution:**
1. Check if terminal is wide enough (min 80 chars)
2. Try `node index.js 2>&1` to capture all output
3. Disable antivirus temporarily
4. Clear `auth_info_baileys` folder and restart

### Issue: "Bot is not responding"
**Solution:**
1. Send `/alive` to verify bot is running
2. Check `/status` for connection quality
3. If quality is poor (🔴), bot will auto-reconnect
4. Wait 10-30 seconds for reconnection

### Issue: Memory keeps increasing
**Solution:**
1. Switch to `/low-end` mode (smaller cache)
2. Ensure bot is not in spam/bug mode
3. Restart bot if memory > 250 MB
4. Check `/status` for activity stats

### Issue: Commands not working
**Solution:**
1. Make sure you're sending `/command` (with `/` prefix)
2. Owner commands (like `/low-end`) require owner JID in OWNERS list
3. Some commands need admin in groups
4. Check bot permissions in group settings

---

## 📁 File Structure

```
DEMONIC-V.1.6.0/
├── index.js                    # Main bot logic
├── menupic.js                  # Menu UI
├── menuaudio.js                # Audio menu
├── package.json                # Dependencies
├── config.json                 # Bot config (auto-created)
├── auth_info_baileys/          # Session files (auto-created)
├── pre-flight.js               # Deployment check
├── test_harness.js             # Offline tests
├── test_performance.js         # Performance mode test
└── README.md                   # Bot documentation
```

---

## 🔐 Security Notes

1. **Never share config.json** — Contains credentials
2. **Keep auth_info_baileys private** — Session keys stored there
3. **Use strong owner JID list** — Only trusted admins in OWNERS
4. **Monitor /bug commands** — Can be abused if not restricted

---

## 📈 Performance Expectations

### Startup Time
- Cold start (first pairing): 15-30 seconds
- Warm start (already paired): 5-10 seconds

### Memory Footprint
- Idle: 80-120 MB
- Active: 120-180 MB
- Peak (many chats): 180-250 MB

### CPU Usage
- Idle: < 5%
- Processing commands: 10-30%
- High-end mode: 15-40%
- Low-end mode: 5-15%

### Connection Stability
- Uptime: 24/7 (auto-restart on crashes)
- Reconnect time: < 1 minute
- Message delivery: < 500ms

---

## 💡 Advanced Configuration

### Adjust Performance Intervals Manually
Edit `config.json`:
```json
{
  "PERFORMANCE_MODE": "low",
  "OWNERS": ["1234567890@s.whatsapp.net"],
  ...
}
```

### Enable Garbage Collection
Run with `--expose-gc`:
```powershell
node --expose-gc index.js
```

### Redirect Logs to File
```powershell
node index.js > bot_logs.txt 2>&1
```

---

## ✨ New Features in v1.7.0

- 🎨 **Rainbow console output** for vibrant UI
- 🔄 **Smart reconnect** with exponential backoff
- ⚡ **Performance mode toggles** (`/low-end`, `/high-end`)
- 💚 **Health monitoring** with `/alive` command
- 📊 **24-hour status reports** to owners
- 🛡️ **Improved stability** (0 idle disconnects)
- 📈 **Memory optimization** (auto-cleanup)
- 🔗 **Fixed owner command conflicts** (/online, /offline)

---

## 📞 Support & Troubleshooting

If bot stops responding:
1. Check terminal for errors
2. Run `/alive` to verify
3. Check `/status` for health metrics
4. Restart bot: `Ctrl+C` then `node index.js`

If you see frequent reconnects:
1. Check internet connection
2. Try `/low-end` mode
3. Ensure 24/7 power & network
4. Clear `auth_info_baileys` if pairing issues persist

---

**Happy botting! 🚀**
