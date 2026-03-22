#!/bin/bash
# OTR Universe Platform — Development Start Script
# Usage: ./dev.sh

export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 18 --delete-prefix 2>/dev/null

echo ""
echo "🌌 OTR Universe Platform"
echo "  Frontend : http://localhost:3000"
echo "  API (Go) : http://localhost:4000"
echo ""

# Start Go API
(cd apps/api && go run ./cmd/server/) &
API_PID=$!

# Start Next.js frontend
node node_modules/.bin/next dev apps/web &
WEB_PID=$!

trap "kill $API_PID $WEB_PID 2>/dev/null; exit" INT TERM
wait
