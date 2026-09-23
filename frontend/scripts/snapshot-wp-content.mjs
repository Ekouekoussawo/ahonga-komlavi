#!/usr/bin/env node
/**
 * Pre-build WordPress content snapshot.
 *
 * Primary source: WordPress REST API (works in local dev).
 * Fallback 1: Local MySQL dump (app/sql/local.sql)
 *             — used when WP API is blocked by ModSecurity.
 * Fallback 2: Preserve existing snapshot file.
 * Fallback 3: Build uses hardcoded fallback content.
 *
 * This runs as a `prebuild` hook — in its own process, completely
 * independent of Next.js's fetch cache.
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const WP_API = process.env.NEXT_PUBLIC_WP_API
  || "https://evangelisteahongankomlavi.com/wp/wp-json/wp/v2";
const OUT_DIR = join(process.cwd(), "public", "_generated");
const OUT_FILE = join(OUT_DIR, "wp-content.json");
const SQL_DUMP = join(process.cwd(), "..", "app", "sql", "local.sql");

// Single source of truth for the default post image (see lib/images.ts).
// Duplicated here because .mjs cannot import .ts.
const DEFAULT_POST_IMAGE = "/gallery/1.jpg";

/**
 * Normalize every post's image URL before writing the snapshot.
 * A broken/missing image is replaced with DEFAULT_POST_IMAGE so the
 * static export never ships a 404 image.
 *
 * Resolution order (first hit wins):
 *   1. _embedded["wp:featuredmedia"][0].source_url
 *   2. post.featured_media_url — only if the file actually exists
 *   3. the same post's previous snapshot value — only if it still exists
 *   4. DEFAULT_POST_IMAGE
 */
async function normalizeImages(posts, previousSnapshot) {
  const prevById = new Map();
  if (previousSnapshot) {
    for (const p of previousSnapshot) prevById.set(p.id, p);
  }

  const substitutions = [];

  for (const post of posts) {
    const embedded = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
    if (embedded) {
      post.featured_media_url = embedded;
      continue;
    }

    let candidate = post.featured_media_url || prevById.get(post.id)?.featured_media_url;
    if (!candidate) {
      post.featured_media_url = DEFAULT_POST_IMAGE;
      substitutions.push(`  ${post.id} ${post.slug}: no image -> ${DEFAULT_POST_IMAGE}`);
      continue;
    }

    // Local path: must exist under public/
    if (candidate.startsWith("/")) {
      const fullPath = join(process.cwd(), "public", candidate);
      if (existsSync(fullPath)) {
        post.featured_media_url = candidate;
      } else {
        post.featured_media_url = DEFAULT_POST_IMAGE;
        substitutions.push(`  ${post.id} ${post.slug}: ${candidate} missing -> ${DEFAULT_POST_IMAGE}`);
      }
      continue;
    }

    // Remote URL: HEAD check with 5s timeout.
    // Network errors count as "keep" so an offline build doesn't wipe good URLs.
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 5000);
      const resp = await fetch(candidate, { method: "HEAD", signal: ctrl.signal });
      clearTimeout(timer);
      if (resp.ok) {
        post.featured_media_url = candidate;
      } else {
        post.featured_media_url = DEFAULT_POST_IMAGE;
        substitutions.push(`  ${post.id} ${post.slug}: ${candidate} -> HTTP ${resp.status} -> ${DEFAULT_POST_IMAGE}`);
      }
    } catch {
      // Offline — keep the candidate rather than wipe it
      post.featured_media_url = candidate;
    }
  }

  if (substitutions.length) {
    console.log(`[snapshot] Image substitutions:\n${substitutions.join("\n")}`);
  }
}

async function main() {
  const hadExisting = existsSync(OUT_FILE);

  // 1. Try WordPress REST API
  try {
    const res = await fetch(`${WP_API}/posts?per_page=100&_embed=true`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      },
    });

    if (res.ok) {
      let posts = await res.json();

      let previousSnapshot = null;
      try {
        if (existsSync(OUT_FILE)) {
          previousSnapshot = JSON.parse(readFileSync(OUT_FILE, "utf-8"));
        }
      } catch { /* ignore */ }

      normalizeImages(posts, previousSnapshot);

      mkdirSync(OUT_DIR, { recursive: true });
      writeFileSync(OUT_FILE, JSON.stringify(posts), "utf-8");
      console.log(`[snapshot] Wrote ${posts.length} posts from WP API to public/_generated/wp-content.json`);
      return;
    }

    if (res.status === 406) {
      console.warn("[snapshot] WP API blocked by ModSecurity (406), trying SQL dump...");
    } else {
      console.warn(`[snapshot] WP API returned ${res.status}, trying SQL dump...`);
    }
  } catch (err) {
    console.warn(`[snapshot] WP API unreachable: ${err.message}, trying SQL dump...`);
  }

  // 2. Try SQL dump extraction
  try {
    const pythonPath = process.env.PYTHON
      || (process.platform === "win32" ? "python" : "python3");
    const extractScript = join(process.cwd(), "scripts", "extract-from-sql.py");

    if (existsSync(SQL_DUMP) && existsSync(extractScript)) {
      console.log("[snapshot] Extracting posts from local SQL dump...");
      execSync(`${pythonPath} "${extractScript}"`, {
        cwd: process.cwd(),
        stdio: "inherit",
        timeout: 60000,
      });
      if (existsSync(OUT_FILE)) {
        const data = JSON.parse(readFileSync(OUT_FILE, "utf-8"));
        normalizeImages(data, hadExisting ? data : null);
        writeFileSync(OUT_FILE, JSON.stringify(data), "utf-8");
        console.log(`[snapshot] Wrote ${data.length} posts from SQL dump to public/_generated/wp-content.json`);
        return;
      }
    }
  } catch (err) {
    console.warn(`[snapshot] SQL dump extraction failed: ${err.message}`);
  }

  // 3. Preserve existing snapshot, but still normalize images
  if (hadExisting) {
    try {
      const existing = JSON.parse(readFileSync(OUT_FILE, "utf-8"));
      normalizeImages(existing, existing);
      writeFileSync(OUT_FILE, JSON.stringify(existing), "utf-8");
      console.warn("[snapshot] WP unreachable, preserved and normalized existing snapshot.");
    } catch {
      console.warn("[snapshot] WP unreachable, preserving existing snapshot as-is.");
    }
  } else {
    console.warn("[snapshot] WP unreachable and no existing snapshot or SQL dump.");
    console.warn("[snapshot] Creating empty snapshot for CI/CD fallback.");
    mkdirSync(OUT_DIR, { recursive: true });
    writeFileSync(OUT_FILE, JSON.stringify([]), "utf-8");
  }
}

main().catch((err) => {
  console.error("[snapshot] Fatal error:", err);
  process.exit(0);
});