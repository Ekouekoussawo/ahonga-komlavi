# Alternative: WordPress Webhook Trigger (Real-time, not polling)
# When a post is published in WordPress, trigger a rebuild immediately
#
# Setup:
# 1. Create a GitHub Actions workflow (deploy-on-push.yml)
# 2. In WordPress, install a webhook plugin or add this to functions.php
# 3. The webhook calls GitHub Actions API when a post is published
#
# WordPress functions.php addition (if WordPress PHP was working):
# add_action('publish_post', function($post_id) {
#     $url = 'https://api.github.com/dispatches';
#     $data = json_encode(['event_type' => 'wordpress-publish']);
#     // Use cURL to call GitHub API with token
# });

name: Deploy on WordPress Publish

on:
  repository_dispatch:
    types: [wordpress-publish]

jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install dependencies
        run: npm install

      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.HOSTGATOR_SSH_KEY }}" > ~/.ssh/id_ed25519_hostgator
          chmod 600 ~/.ssh/id_ed25519_hostgator

      - name: Generate snapshot from live DB
        run: |
          # Direct MySQL dump from HostGator
          ssh -i ~/.ssh/id_ed25519_hostgator zank@gator3223.hostgator.com \
            "mysqldump -u zank_ahonga -p'${{ secrets.DB_PASSWORD }}' zank_ahonga \
            --no-data eak_posts eak_term_relationships eak_term_taxonomy" \
            > database.sql
          # Generate snapshot from the dump
          python scripts/extract-from-sql.py app/sql/local.sql public/_generated/wp-content.json

      - name: Build
        run: npm run build

      - name: Deploy
        run: |
          rsync -avz --delete \
            -e "ssh -i ~/.ssh/id_ed25519_hostgator -o StrictHostKeyChecking=no" \
            out/ zank@gator3223.hostgator.com:/home4/zank/evangelisteahongankomlavi.com/
