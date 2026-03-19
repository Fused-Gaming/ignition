#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Fused Gaming — Multi-Brand Deploy Script
#
# Usage:
#   ./scripts/deploy.sh <brand> [provider]
#
# Brands:   stakereloadxs | stakereload | gambareload | gambarewards | stakeclaimbot
# Provider: vercel (default) | vps | docker
#
# Examples:
#   ./scripts/deploy.sh stakereloadxs
#   ./scripts/deploy.sh gambareload vercel
#   ./scripts/deploy.sh stakereload vps
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

BRAND="${1:-}"
PROVIDER="${2:-vercel}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEB_DIR="$ROOT_DIR/apps/web"
CONFIG_DIR="$ROOT_DIR/configs/brands"

# ── Validate brand ────────────────────────────────────────────────────────────
if [[ -z "$BRAND" ]]; then
  echo "❌  Usage: $0 <brand> [vercel|vps|docker]"
  echo ""
  echo "   Available brands:"
  for f in "$CONFIG_DIR"/*.json; do
    echo "     • $(basename "$f" .json)"
  done
  exit 1
fi

CONFIG_FILE="$CONFIG_DIR/${BRAND}.json"
if [[ ! -f "$CONFIG_FILE" ]]; then
  echo "❌  Brand config not found: $CONFIG_FILE"
  exit 1
fi

# ── Read domain from config ───────────────────────────────────────────────────
DOMAIN=$(node -e "const c=require('$CONFIG_FILE'); console.log(c.domain)")
echo ""
echo "🚀  Deploying brand: $BRAND → $DOMAIN"
echo "    Provider: $PROVIDER"
echo ""

# ── Build ─────────────────────────────────────────────────────────────────────
cd "$WEB_DIR"

echo "📦  Installing dependencies..."
npm install --silent

echo "🏗   Building Next.js..."
NEXT_PUBLIC_BRAND="$BRAND" \
NEXT_PUBLIC_BASE_URL="https://$DOMAIN" \
npm run build

# ── Deploy ────────────────────────────────────────────────────────────────────
case "$PROVIDER" in
  vercel)
    echo "▲   Deploying to Vercel..."
    if ! command -v vercel &>/dev/null; then
      echo "❌  vercel CLI not found. Run: npm i -g vercel"
      exit 1
    fi
    vercel deploy \
      --prod \
      --yes \
      --env "NEXT_PUBLIC_BRAND=$BRAND" \
      --env "NEXT_PUBLIC_BASE_URL=https://$DOMAIN" \
      --build-env "NEXT_PUBLIC_BRAND=$BRAND"
    echo ""
    echo "✅  Deployed to Vercel. Add CNAME: $DOMAIN → cname.vercel-dns.com"
    ;;

  vps)
    DEPLOY_USER="${DEPLOY_USER:-deploy}"
    DEPLOY_HOST="${DEPLOY_HOST:?Set DEPLOY_HOST env var (e.g. 1.2.3.4)}"
    DEPLOY_PATH="${DEPLOY_PATH:-/var/www/$BRAND}"

    echo "🖥   Syncing to VPS $DEPLOY_HOST:$DEPLOY_PATH ..."
    rsync -az --delete \
      --exclude=".git" \
      --exclude="node_modules" \
      --exclude=".next/cache" \
      "$WEB_DIR/" \
      "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/"

    ssh "$DEPLOY_USER@$DEPLOY_HOST" bash <<REMOTE
      set -e
      cd "$DEPLOY_PATH"
      npm install --omit=dev --silent
      NEXT_PUBLIC_BRAND="$BRAND" NEXT_PUBLIC_BASE_URL="https://$DOMAIN" npm run build
      # Restart via PM2 (or adapt to your process manager)
      pm2 reload "$BRAND" --update-env 2>/dev/null || \
        pm2 start npm --name "$BRAND" -- start -- -p \${PORT:-3000}
REMOTE
    echo ""
    echo "✅  Deployed to VPS. Point DNS: $DOMAIN → $DEPLOY_HOST"
    ;;

  docker)
    IMAGE="fused-gaming/${BRAND}:latest"
    echo "🐳  Building Docker image: $IMAGE ..."
    docker build \
      --build-arg NEXT_PUBLIC_BRAND="$BRAND" \
      --build-arg NEXT_PUBLIC_BASE_URL="https://$DOMAIN" \
      -t "$IMAGE" \
      -f "$ROOT_DIR/apps/web/Dockerfile" \
      "$ROOT_DIR"

    echo ""
    echo "✅  Docker image built: $IMAGE"
    echo "   Run with:"
    echo "   docker run -p 3000:3000 \\"
    echo "     -e NOWPAYMENTS_API_KEY=xxx \\"
    echo "     -e NEXT_PUBLIC_BRAND=$BRAND \\"
    echo "     $IMAGE"
    ;;

  *)
    echo "❌  Unknown provider: $PROVIDER (use vercel, vps, or docker)"
    exit 1
    ;;
esac

echo ""
echo "─────────────────────────────────────────────────────"
echo "   Brand:    $BRAND"
echo "   Domain:   $DOMAIN"
echo "   Provider: $PROVIDER"
echo "─────────────────────────────────────────────────────"
echo ""
