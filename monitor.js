#!/usr/bin/env node
/**
 * DEMONIC Bot Performance Monitor
 * Tracks real-time metrics during bot operation
 * Run in a separate terminal: node monitor.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const SESSION_DIR = './auth_info_baileys';
const CONFIG_PATH = './config.json';

console.log('\n' + '═'.repeat(80));
console.log('📊 DEMONIC BOT PERFORMANCE MONITOR');
console.log('═'.repeat(80) + '\n');
console.log('⏰ Monitoring started at', new Date().toLocaleString());
console.log('📂 Session directory:', SESSION_DIR);
console.log('⚙️  Config file:', CONFIG_PATH);
console.log('\nRefresh interval: 5 seconds\n');

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function getSessionSize() {
  if (!fs.existsSync(SESSION_DIR)) return 0;
  let total = 0;
  const files = fs.readdirSync(SESSION_DIR);
  files.forEach(file => {
    const stat = fs.statSync(path.join(SESSION_DIR, file));
    total += stat.size;
  });
  return total;
}

function getConfig() {
  if (!fs.existsSync(CONFIG_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch (e) {
    return null;
  }
}

function getSystemMetrics() {
  const freeMem = os.freemem();
  const totalMem = os.totalmem();
  const usedMem = totalMem - freeMem;
  const cpus = os.cpus();
  const avgLoad = os.loadavg()[0];

  return {
    freeMemory: freeMem,
    usedMemory: usedMem,
    totalMemory: totalMem,
    cpuCount: cpus.length,
    avgLoad: avgLoad,
    uptime: os.uptime()
  };
}

function printMetrics() {
  console.clear();
  console.log('═'.repeat(80));
  console.log('📊 DEMONIC BOT PERFORMANCE MONITOR');
  console.log('═'.repeat(80));
  console.log('📅', new Date().toLocaleString(), '\n');

  // System Metrics
  const sysMet = getSystemMetrics();
  const memPercent = Math.round((sysMet.usedMemory / sysMet.totalMemory) * 100);
  const uptime = Math.floor(sysMet.uptime / 3600);

  console.log('🖥️  SYSTEM METRICS');
  console.log('├─ Memory Usage:', formatBytes(sysMet.usedMemory), '/', formatBytes(sysMet.totalMemory), `(${memPercent}%)`);
  console.log('├─ Free Memory:', formatBytes(sysMet.freeMemory));
  console.log('├─ CPU Cores:', sysMet.cpuCount);
  console.log('├─ Avg Load:', sysMet.avgLoad.toFixed(2));
  console.log('└─ System Uptime:', uptime, 'hours\n');

  // Bot Config
  const config = getConfig();
  if (config) {
    console.log('⚙️  BOT CONFIGURATION');
    console.log('├─ Performance Mode:', config.PERFORMANCE_MODE || 'low');
    console.log('├─ Owners:', config.OWNERS ? config.OWNERS.length + ' owner(s)' : 'Not set');
    console.log('├─ Public Mode:', config.PUBLIC !== false ? 'ON' : 'OFF');
    console.log('└─ Offline Mode:', config.OFFLINE_MODE ? 'ON' : 'OFF\n');
  }

  // Session Files
  const sessionSize = getSessionSize();
  const sessionFiles = fs.existsSync(SESSION_DIR) ? fs.readdirSync(SESSION_DIR).length : 0;

  console.log('📁 SESSION DATA');
  console.log('├─ Session Directory:', SESSION_DIR);
  console.log('├─ Session Files:', sessionFiles);
  console.log('└─ Session Size:', formatBytes(sessionSize));

  // Bot Status
  if (fs.existsSync(SESSION_DIR) && sessionFiles > 0) {
    console.log('\n✅ BOT STATUS: PAIRED & READY');
    console.log('   (Bot should be running and connected)\n');
  } else {
    console.log('\n⏳ BOT STATUS: NOT YET PAIRED');
    console.log('   (Waiting for QR code scan)\n');
  }

  // Performance Expectations
  const isHighEnd = config && config.PERFORMANCE_MODE === 'high';
  console.log('📈 PERFORMANCE PROFILE:', isHighEnd ? '⚡ HIGH-END' : '🟢 LOW-END (Default)');
  if (isHighEnd) {
    console.log('├─ Keep-Alive Interval: 1 minute (aggressive)');
    console.log('├─ Health Check: Every 1 minute');
    console.log('├─ Cache Size: 1000 messages');
    console.log('└─ Expected Memory: 150-250 MB\n');
  } else {
    console.log('├─ Keep-Alive Interval: 5 minutes (conservative)');
    console.log('├─ Health Check: Every 2 minutes');
    console.log('├─ Cache Size: 100 messages');
    console.log('└─ Expected Memory: 80-150 MB\n');
  }

  // Quick Tests
  console.log('🧪 QUICK TESTS IN BOT:');
  console.log('├─ /menu        - View all commands');
  console.log('├─ /status      - Get detailed status');
  console.log('├─ /alive       - Health check');
  console.log('├─ /low-end     - Switch to low-resource mode');
  console.log('└─ /high-end    - Switch to high-performance mode\n');

  console.log('═'.repeat(80));
  console.log('🔄 Refreshing in 5 seconds... (Ctrl+C to stop)\n');
}

// Print metrics every 5 seconds
printMetrics();
setInterval(printMetrics, 5000);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n✅ Monitor stopped.');
  process.exit(0);
});
