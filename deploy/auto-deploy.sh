#!/usr/bin/env bash
# Auto-deploy script for HostGator
# Run this via GitHub Actions or cron to keep Next.js site in sync with WordPress
#
# Usage: ./auto-deploy.sh
#
# Prerequisites:
# - SSH key at ~/.ssh/id_ed25519_hostgator
# - Node.js + npm installed
# - Git repo with the Next.js project
# - .env with HOSTGATOR_HOST, HOSTGATOR_USER, HOSTGATOR_SSH_KEY_PATH

set -e

HOST="gator3223.hostgator.com"
USER="zank"
SSH_KEY="$HOME/.ssh/id_ed25519_hostgator"
DB_USER="zank_ahonga"
DB_NAME="zank_ahonga"
DB_PASSWORD="csdFVM5sAIonVoO8UCwE5J4o"  # From wp-config.php on server
SITE_ROOT="/home4/zank/evangelisteahongankomlavi.com"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== Step 1: Dump latest posts from HostGator MySQL ==="
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$USER@$HOST" \
  "mysql -u $DB_USER -p'$DB_PASSWORD' $DB_NAME \
   -e \"SELECT ID, post_date, post_content, post_title, post_excerpt, post_name, post_type \
   FROM eak_posts WHERE post_status='publish' AND post_type IN ('post','page') \
   ORDER BY post_date DESC\"" \
  > "$PROJECT_DIR/public/_generated/wp-content-dump.txt"

echo "=== Step 2: Generate snapshot from dump ==="
python "$PROJECT_DIR/scripts/extract-from-sql.py" "$PROJECT_DIR/app/sql/local.sql" \
  "$PROJECT_DIR/public/_generated/wp-content.json"

echo "=== Step 3: Build Next.js ==="
cd "$PROJECT_DIR"
npm install --no-audit --no-fund
NODE_ENV=production npm run build

echo "=== Step 4: Deploy to HostGator via rsync ==="
# Sync out/ to HostGator (exclude node_modules, .git, etc.)
rsync -avz --delete \
  --exclude='node_modules/' \
  --exclude='.git/' \
  --exclude='.env*' \
  --exclude='*.md' \
  -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
  "$PROJECT_DIR/out/" \
  "$USER@$HOST:$SITE_ROOT/"

echo "=== Step 5: Verify deployment ==="
curl -s -o /dev/null -w "Homepage: %{http_code}\n" "https://evangelisteahongankomlavi.com/"
curl -s -o /dev/null -w "Sermons: %{http_code}\n" "https://evangelisteahongankomlavi.com/sermons/"
curl -s -o /dev/null -w "Snapshot: %{http_code}\n" "https://evangelisteahongankomlavi.com/_generated/wp-content.json"

echo "=== Auto-deploy complete! ==="
