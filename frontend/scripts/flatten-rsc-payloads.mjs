// Next.js's static export writes each route's client-navigation "flight"
// payload as a real nested file — e.g. about/__next.about/__PAGE__.txt —
// but the browser's <Link> prefetch requests it as a single flattened
// filename with dots instead of slashes: about/__next.about.__PAGE__.txt.
// Vercel's routing layer maps one to the other; a plain Apache static host
// has no such rule, so the prefetch 404s (the real page load still works
// fine — this only restores the instant-navigation optimization).
// This script creates the flat sibling file static hosts can serve as-is.
import { readdirSync, statSync, copyFileSync } from "node:fs";
import { join, dirname, basename } from "node:path";

const OUT_DIR = join(import.meta.dirname, "..", "out");

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
    } else if (entry === "__PAGE__.txt") {
      flatten(full);
    }
  }
}

function flatten(pageFile) {
  // Walk up from the file until we hit the ancestor dir named "__next.*",
  // collecting path segments so we can dot-join them back together.
  const segments = [basename(pageFile)]; // "__PAGE__.txt"
  let dir = dirname(pageFile);
  let nextDirSegment = null;

  while (true) {
    const name = basename(dir);
    if (name.startsWith("__next.")) {
      nextDirSegment = name;
      break;
    }
    segments.unshift(name);
    dir = dirname(dir);
  }
  if (!nextDirSegment) return; // not under a __next.* payload dir

  const routeDir = dirname(dir);
  const flatName = [nextDirSegment, ...segments].join(".");
  copyFileSync(pageFile, join(routeDir, flatName));
  console.log(`${pageFile.replace(OUT_DIR, "out")} -> ${flatName}`);
}

walk(OUT_DIR);
