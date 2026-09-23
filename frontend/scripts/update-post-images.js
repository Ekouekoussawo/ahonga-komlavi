#!/usr/bin/env node

/**
 * Update wp-content.json snapshot with featured image URLs
 *
 * This script:
 * 1. Fetches posts from WordPress REST API with embedded media
 * 2. Extracts featured image URLs
 * 3. Updates the snapshot JSON with these images
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const SNAPSHOT_PATH = path.join(__dirname, '../public/_generated/wp-content.json');
const WP_API = process.env.NEXT_PUBLIC_WP_API || 'https://evangelisteahongankomlavi.com/wp-json/wp/v2';

// Default featured images for each post
const DEFAULT_IMAGES = {
  44833: 'https://evangelisteahongankomlavi.com/gallery/photo-1.jpg',
  44834: 'https://evangelisteahongankomlavi.com/gallery/photo-2.jpg',
  44835: 'https://evangelisteahongankomlavi.com/gallery/photo-3.jpg',
  44832: 'https://evangelisteahongankomlavi.com/gallery/photo-4.jpg',
  44802: 'https://evangelisteahongankomlavi.com/gallery/photo-5.jpg',
};

async function fetchWithTimeout(url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(timeout, () => {
      req.abort();
      reject(new Error('Timeout'));
    });
  });
}

async function updateSnapshotWithImages() {
  console.log('📸 Updating post featured images...\n');

  if (!fs.existsSync(SNAPSHOT_PATH)) {
    console.error('❌ Snapshot not found:', SNAPSHOT_PATH);
    process.exit(1);
  }

  const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf-8'));
  console.log(`✓ Loaded ${snapshot.length} posts\n`);

  try {
    console.log('📡 Fetching from WordPress API...');
    const posts = await fetchWithTimeout(`${WP_API}/posts?per_page=100&_embed=true`);

    const imageMap = new Map();
    for (const post of posts) {
      if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
        imageMap.set(post.id, post._embedded['wp:featuredmedia'][0].source_url);
      }
    }

    console.log(`✓ Found ${imageMap.size} posts with images`);

    let updated = 0;
    for (const post of snapshot) {
      const url = imageMap.get(post.id) || DEFAULT_IMAGES[post.id];
      if (url) {
        post.featured_media_url = url;
        if (imageMap.has(post.id)) updated++;
      }
    }

    console.log(`✓ Updated ${updated} from API, ${snapshot.length - updated} from defaults\n`);
  } catch (error) {
    console.warn('⚠️  WordPress API unavailable:', error.message);
    console.log('Using default images...\n');

    for (const post of snapshot) {
      if (!post.featured_media_url) {
        post.featured_media_url = DEFAULT_IMAGES[post.id] || '/gallery/photo-13.jpg';
      }
    }
  }

  fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2), 'utf-8');
  console.log('✅ Snapshot updated with featured images');
  console.log(`📁 File: ${SNAPSHOT_PATH}\n`);
}

updateSnapshotWithImages().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
