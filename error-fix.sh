#!/usr/bin/env bash

set -euo pipefail

GREEN="\e[32m"
YELLOW="\e[33m"
BLUE="\e[34m"
RED="\e[31m"
BOLD="\e[1m"
RESET="\e[0m"

SESSION_PATH="./session"

if [ "$#" -gt 0 ]; then
  SESSION_PATH="$1"
fi

if [ ! -e "$SESSION_PATH" ]; then
  echo -e "${YELLOW}⚠️  No session file or folder found at: ${SESSION_PATH}${RESET}"
  exit 0
fi

echo -e "${BLUE}${BOLD}NEXO-TECH SESSION REPAIR${RESET}"
echo -e "${GREEN}This script will remove the WhatsApp session directory to force a repair/re-pair.${RESET}"
echo -e "${GREEN}Target directory: ${SESSION_PATH}${RESET}"
echo -e "${YELLOW}(Equivalent command: rm -rf ${SESSION_PATH})${RESET}"

tty=$(tty 2>/dev/null || true)
if [ -n "$tty" ]; then
  read -rp "${BOLD}${RED}Delete this session data and continue? [y/N]: ${RESET}" confirm
else
  confirm="n"
fi

if [[ "$confirm" =~ ^[Yy]$ ]]; then
  rm -rf "$SESSION_PATH"
  echo -e "${GREEN}✅ Session data deleted. Restart the bot and scan the QR code again.${RESET}"
else
  echo -e "${YELLOW}❌ Aborted. No files were deleted.${RESET}"
fi
