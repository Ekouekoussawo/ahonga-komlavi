#!/usr/bin/env python3
"""Manually fire a GitHub repository_dispatch to test the rebuild pipeline.

This is the manual fallback the plan calls for (`/rebuild?token=...` equivalent)
— it lets Oel force a rebuild from this machine without touching WordPress.

The `wp-post-published` event type is what `.github/workflows/deploy.yml`
listens for, so this reproduces exactly what the mu-plugin would send.

Usage:
    python scripts/test-dispatch.py [--post-id 123]
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request

REPO = "Ekouekoussawo/evangelisteahongankomlavi"
EVENT = "wp-post-published"


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--post-id", type=int, default=0, help="post id to include in the payload")
    args = ap.parse_args()

    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
    if not token:
        sys.exit("set GH_TOKEN (a repo-scoped PAT with actions:write) before running")

    payload = json.dumps({
        "event_type": EVENT,
        "client_payload": {
            "post_id": args.post_id,
            "triggered_by": "manual_test_dispatch",
        },
    }).encode()

    req = urllib.request.Request(
        f"https://api.github.com/repos/{REPO}/dispatches",
        data=payload,
        headers={
            "Accept": "application/vnd.github+json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
            "X-GitHub-Api-Version": "2022-11-28",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            body = resp.read().decode()
            print(f"HTTP {resp.status} — dispatch accepted")
            print(body[:300])
    except urllib.error.HTTPError as e:
        print(f"HTTP {e.code} — {e.reason}")
        print(e.read().decode()[:500])
        sys.exit(1)


if __name__ == "__main__":
    main()