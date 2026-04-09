const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, 'index.js');
if (!fs.existsSync(target)) {
    console.error("Target file not found:", target);
    process.exit(1);
}

let content = fs.readFileSync(target, 'utf8');

// Regex matches strings (group 1) OR comments (group 2)
// This prevents matching // or /* inside strings
const regex = /("(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|`(?:\\[\s\S]|[^`\\])*`)|(\/\*[\s\S]*?\*\/|\/\/.*)/g;

let commentCount = 0;
let keptCount = 0;

const output = content.replace(regex, (match, string, comment) => {
    if (string) return string; // It's a string, keep it

    // It's a comment
    commentCount++;

    // Rule: Keep Header and Section Separators (approx 5% relevance)
    if (comment.includes('DEMONIC WhatsApp Bot') ||
        comment.includes('=====') ||
        comment.includes('CREDITS')) {
        keptCount++;
        return comment;
    }

    return ''; // Remove other comments
});

// Remove blank lines left behind (lines appearing empty or just whitespace)
const lines = output.split('\n');
const cleanedLines = lines.filter(line => line.trim() !== '');
const finalOutput = cleanedLines.join('\n');

fs.writeFileSync(target, finalOutput);
console.log(`Cleanup Complete. Comments found: ${commentCount}, Kept: ${keptCount}`);
