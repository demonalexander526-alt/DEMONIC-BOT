#!/usr/bin/env node
/**
 * DEMONIC Bot Pre-Flight Check
 * Validates environment and configuration before bot startup
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n' + '═'.repeat(70));
console.log('🔍 DEMONIC BOT PRE-FLIGHT CHECK');
console.log('═'.repeat(70) + '\n');

let allOK = true;

// Check 1: Node.js version
console.log('1️⃣  Node.js Version Check');
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  const [major] = nodeVersion.match(/\d+/);
  if (parseInt(major) >= 18) {
    console.log(`   ✅ Node.js ${nodeVersion} (required: >=18)`);
  } else {
    console.log(`   ❌ Node.js ${nodeVersion} (required: >=18)`);
    allOK = false;
  }
} catch (e) {
  console.log('   ❌ Node.js not found');
  allOK = false;
}

// Check 2: npm version
console.log('\n2️⃣  npm Version Check');
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`   ✅ npm ${npmVersion}`);
} catch (e) {
  console.log('   ❌ npm not found');
  allOK = false;
}

// Check 3: Required files
console.log('\n3️⃣  Required Files Check');
const requiredFiles = [
  'index.js',
  'menupic.js',
  'menuaudio.js',
  'package.json',
  'README.md'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const size = fs.statSync(file).size;
    console.log(`   ✅ ${file} (${(size / 1024).toFixed(1)} KB)`);
  } else {
    console.log(`   ❌ ${file} (missing)`);
    allOK = false;
  }
});

// Check 4: package.json dependencies
console.log('\n4️⃣  Dependencies in package.json');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deps = pkg.dependencies || {};
  const requiredDeps = ['@whiskeysockets/baileys', 'chalk', 'axios', 'pino', 'fs-extra'];
  
  requiredDeps.forEach(dep => {
    if (deps[dep]) {
      console.log(`   ✅ ${dep} (${deps[dep]})`);
    } else {
      console.log(`   ⚠️  ${dep} (not declared)`);
    }
  });
} catch (e) {
  console.log(`   ❌ Failed to read package.json: ${e.message}`);
  allOK = false;
}

// Check 5: node_modules status
console.log('\n5️⃣  Dependencies Installation Status');
if (fs.existsSync('node_modules')) {
  const baileyExists = fs.existsSync('node_modules/@whiskeysockets/baileys');
  if (baileyExists) {
    console.log(`   ✅ node_modules installed (baileys found)`);
  } else {
    console.log(`   ⚠️  node_modules exists but missing key dependencies`);
    console.log(`      Run: npm install --no-audit --no-fund`);
  }
} else {
  console.log(`   ⚠️  node_modules not found`);
  console.log(`      Run: npm install --no-audit --no-fund`);
}

// Check 6: Config file
console.log('\n6️⃣  Configuration File');
if (fs.existsSync('config.json')) {
  try {
    const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    console.log(`   ✅ config.json found`);
    if (config.PERFORMANCE_MODE) {
      console.log(`      └─ Performance mode: ${config.PERFORMANCE_MODE}`);
    }
  } catch (e) {
    console.log(`   ⚠️  config.json exists but is invalid JSON`);
  }
} else {
  console.log(`   ℹ️  config.json not found (will be created on first run)`);
}

// Check 7: Session folder
console.log('\n7️⃣  Session Folder');
if (fs.existsSync('auth_info_baileys')) {
  console.log(`   ✅ Session folder exists (bot already paired)`);
  const files = fs.readdirSync('auth_info_baileys').length;
  console.log(`      └─ Contains ${files} session files`);
} else {
  console.log(`   ℹ️  Session folder not found (will be created on first run)`);
}

// Check 8: Performance mode configuration
console.log('\n8️⃣  Performance Mode Configuration');
const modes = {
  low: {
    KEEPALIVE_PRESENCE_MS: 300000,
    HEALTH_CHECK_INTERVAL_MS: 120000,
    MAX_CACHED_MESSAGES: 100
  },
  high: {
    KEEPALIVE_PRESENCE_MS: 60000,
    HEALTH_CHECK_INTERVAL_MS: 60000,
    MAX_CACHED_MESSAGES: 1000
  }
};

Object.entries(modes).forEach(([mode, settings]) => {
  console.log(`   ${mode === 'low' ? '🟢' : '⚡'} ${mode.toUpperCase()}-END MODE:`);
  Object.entries(settings).forEach(([key, val]) => {
    console.log(`      └─ ${key}: ${val.toLocaleString()}`);
  });
});

// Summary
console.log('\n' + '═'.repeat(70));
if (allOK) {
  console.log('✅ PRE-FLIGHT CHECK PASSED - Ready to deploy!');
  console.log('\n🚀 Next steps:');
  console.log('   1. npm install --no-audit --no-fund');
  console.log('   2. node index.js');
  console.log('   3. Scan QR code with WhatsApp');
  console.log('\n📝 Commands to test:');
  console.log('   • /menu        - View all commands');
  console.log('   • /status      - Bot status report');
  console.log('   • /alive       - Quick health check');
  console.log('   • /low-end     - Conservative mode (owner only)');
  console.log('   • /high-end    - Aggressive mode (owner only)');
  console.log('\n💡 Tips:');
  console.log('   • Rainbow console output shows bot is working');
  console.log('   • Check /status for connection quality (should be 🟢 EXCELLENT)');
  console.log('   • If disconnected, bot auto-reconnects with backoff');
} else {
  console.log('❌ PRE-FLIGHT CHECK FAILED - See issues above');
  console.log('\n🔧 Fix & retry:');
  console.log('   1. Install Node.js >= v18');
  console.log('   2. Run: npm install --no-audit --no-fund');
  console.log('   3. Run this check again: node pre-flight.js');
}
console.log('═'.repeat(70) + '\n');

process.exit(allOK ? 0 : 1);
