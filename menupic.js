/**
 * DEMONIC Menu Picture
 * Used in /menu command
 */

const fs = require("fs");
const path = require("path");

// Menu image file path
const IMAGE_PATH = path.join(__dirname, "img.jpg");

// Function to send menu image with caption and buttons
const sendMenuImage = async (sock, from, VERSION, PREFIX) => {
  try {
    // Check if image file exists
    if (!fs.existsSync(IMAGE_PATH)) {
      console.warn("⚠️ Image file not found at: " + IMAGE_PATH);
      return null;
    }

    // Create the menu text as caption
    const menuCaption = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🤖 DEMONIC v${VERSION} 
┃ Advanced WhatsApp Bot
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔑 OWNER PANEL
├─ ${PREFIX}public • Enable public access
├─ ${PREFIX}private • Restrict to owner
├─ ${PREFIX}creategc [name] • Create group
├─ ${PREFIX}ping • Response time check
├─ ${PREFIX}uptime • Bot uptime
├─ ${PREFIX}server • Server statistics
├─ ${PREFIX}status • Full bot status
├─ ${PREFIX}setprefix [char] • Change prefix
├─ ${PREFIX}change-name [name] • Change bot name
├─ ${PREFIX}ownerinfo • Owner contact info
├─ ${PREFIX}setownerinfo [info] • Update owner info
├─ ${PREFIX}nexchat • Nexchat web app link
├─ ${PREFIX}links • Community links
└─ ${PREFIX}broadcast [msg] • Send to all groups

👑 ADMIN TOOLS
├─ ${PREFIX}kick @user • Remove member
├─ ${PREFIX}promote @user • Grant admin
├─ ${PREFIX}demote @user • Revoke admin
├─ ${PREFIX}warn @user • Issue warning
├─ ${PREFIX}unwarn @user • Clear warning
└─ ${PREFIX}warnlist • Violation list

🎯 GROUP CONTROL
├─ ${PREFIX}tagall • Mention everyone
├─ ${PREFIX}hidetag [msg] • Mention (hidden)
├─ ${PREFIX}online • Active members
├─ ${PREFIX}tagonline • Tag active users
├─ ${PREFIX}tagoffline • Tag inactive users
├─ ${PREFIX}antilink on/off • Block URLs
├─ ${PREFIX}antisticker on/off • Block stickers
├─ ${PREFIX}antighost on/off • Block view-once
├─ ${PREFIX}antibadwords on/off • Block profanity
├─ ${PREFIX}antigay on/off • Block gay keywords
├─ ${PREFIX}antichat on/off • Mute all chat
├─ ${PREFIX}anticall on/off • Block calls
├─ ${PREFIX}autotyping on/off • Auto typing presence
├─ ${PREFIX}autorecording on/off • Auto recording presence
├─ ${PREFIX}autoreact on/off • Save emoji reactions
└─ ${PREFIX}welcome on/off • Join message

📱 MEDIA TOOLS
├─ ${PREFIX}vv • View hidden media
├─ ${PREFIX}vv1 • Backup View
├─ ${PREFIX}vv2 • Backup View 2
├─ ${PREFIX}vv3 • Backup View 3
├─ ${PREFIX}steal • Steal a status update
├─ ${PREFIX}tosticker • Image/Video→Sticker
├─ ${PREFIX}tosticker2 • Image/Video→Sticker (v2)
├─ ${PREFIX}toimage • Sticker→Image
├─ ${PREFIX}toimage2 • Sticker→Image (v2)
├─ ${PREFIX}tovideo • Sticker→Video
├─ ${PREFIX}tovideo2 • Image→Video
├─ ${PREFIX}tovidsticker • Video→Animated Sticker
├─ ${PREFIX}tovidsticker2 • Video→Animated Sticker (v2)
└─ ${PREFIX}repo • Download bot file

🎬 DOWNLOADER
├─ ${PREFIX}downloader • Menu
├─ ${PREFIX}ytdl [url] • YouTube (Requires RapidAPI)
├─ ${PREFIX}tiktokdl [url] • TikTok
├─ ${PREFIX}instadl [url] • Instagram
├─ ${PREFIX}fbdl [url] • Facebook
└─ ${PREFIX}apkdl [app] • APK files

🛡️ GROUP DEFENSE (Admin Only)
├─ ${PREFIX}group-defense on • Enable full protection
└─ ${PREFIX}group-defense off • Disable protection

🛡️ GROUP UTILITY (Admin Only)
├─ ${PREFIX}link • Get group link
├─ ${PREFIX}pair [number] • Generate WhatsApp pairing code
├─ ${PREFIX}revoke • Reset group link
├─ ${PREFIX}getinfo • View group details
├─ ${PREFIX}admins • Tag all admins
└─ ${PREFIX}vcf • Export all contacts (VCF file)

🎪 FUN & GAMES
├─ ${PREFIX}ship @u1 @u2 • Matchmaking
├─ ${PREFIX}math [expr] • Calculator
├─ ${PREFIX}calc [expr] • Math solver
├─ ${PREFIX}fact • Random fact
├─ ${PREFIX}8ball [q] • Magic answer
├─ ${PREFIX}coinflip • Heads/Tails
├─ ${PREFIX}weather [city] • Weather info
├─ ${PREFIX}countdown [sec] • Countdown timer (max 3600s)
├─ ${PREFIX}hack @user • Security analysis
├─ ${PREFIX}joke • Random joke (+10 pts)
├─ ${PREFIX}meme • Random meme
├─ ${PREFIX}truth • Truth question (+15 pts)
├─ ${PREFIX}dare • Dare challenge (+15 pts)
├─ ${PREFIX}roll • Dice 1-6 (+5 pts)
├─ ${PREFIX}repeat [text] • Echo text (+5 pts)
├─ ${PREFIX}reverse [text] • Reverse text (+5 pts)
├─ ${PREFIX}uppercase [text] • ALL CAPS (+5 pts)
├─ ${PREFIX}lowercase [text] • lowercase (+5 pts)
├─ ${PREFIX}myscore • Show your score
└─ ${PREFIX}topscores • Top 10 players

🎨 UTILITIES & INFO
├─ ${PREFIX}cat • Random cat image
├─ ${PREFIX}dog • Random dog image
├─ ${PREFIX}advice • Random advice
├─ ${PREFIX}meme • Funny meme
├─ ${PREFIX}lyrics [song] • Search song lyrics
├─ ${PREFIX}define [word] • Dictionary lookup
├─ ${PREFIX}dict [word] • Word definition
├─ ${PREFIX}wiki [query] • Wikipedia search
├─ ${PREFIX}app [name] • Search application
├─ ${PREFIX}analyze • Image analysis (Vision AI)
├─ ${PREFIX}vision • Image analysis
├─ ${PREFIX}translate [lang] [text] • Translate text
├─ ${PREFIX}tr [lang] [text] • Quick translate
├─ ${PREFIX}tts [text] • Convert text to speech
├─ ${PREFIX}say [text] • Text-to-speech
├─ ${PREFIX}profile • Your profile info
├─ ${PREFIX}curl [url] • Check website status
├─ ${PREFIX}curl2 [url] • Check for phishing
└─ ${PREFIX}afk [reason] • Set away status

🪲 BUG BOT (Owner Only)
├─ ${PREFIX}overkill @user • 50k msgs 🔥
├─ ${PREFIX}overload @user • 100k msgs 💀
├─ ${PREFIX}overdeadly @user • 5000 msgs 👹
├─ ${PREFIX}deadly @user • 2000 msgs ☠️
├─ ${PREFIX}highrate-bug @user [count] • 100-1000 msgs
├─ ${PREFIX}lowrate-bug @user [count] • 50-500 msgs
├─ ${PREFIX}stopbug @user • Stop any active bug
└─ ${PREFIX}bugged • List all active bugs

🛡️ PROTECTION & CONTROL
├─ ${PREFIX}antibug @user • Toggle protection
└─ ${PREFIX}self-destruct • Delete bot

powered by DEMONIC BOT`;

    // Read and send image with caption and buttons
    const imageBuffer = fs.readFileSync(IMAGE_PATH);
    const sendResult = await sock.sendMessage(from, {
      image: imageBuffer,
      mimetype: "image/jpeg",
      caption: menuCaption,
      footer: "DEMONIC • v" + VERSION,
      buttons: [
        {
          buttonId: "id1",
          buttonText: { displayText: "📢 Channel" },
          type: 1
        },
        {
          buttonId: "id2",
          buttonText: { displayText: "👥 Community" },
          type: 1
        }
      ],
      headerType: 4
    });

    return sendResult;
  } catch (error) {
    console.error("Error sending menu image:", error);
    return null;
  }
};

const menuImage = "img.jpg";

module.exports = {
  menuImage,
  sendMenuImage
};
