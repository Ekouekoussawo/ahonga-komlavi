#!/usr/bin/env python3
"""Deploy the rebuild-trigger mu-plugin to the HostGator site.

Uploads `php/trigger-rebuild.php` to
`/home4/zank/evangelisteahongankomlavi.com/wp/wp-content/mu-plugins/` via SFTP,
then verifies it landed and is syntactically valid on the server.

Credentials are read from the environment, never hardcoded:
  HOSTGATOR_SFTP_PASSWORD   — zank's SFTP password
  GITHUB_DISPATCH_SECRET    — the shared secret GitHub adds to each dispatch
                              (set in the repo's Actions secrets as
                               DISPATCH_SECRET; mirrored here so the mu-plugin
                               can read it from the environment rather than
                               being committed in plaintext)

Usage:
    python scripts/deploy-trigger-rebuild.py [--dry-run]
"""
from __future__ import annotations

import argparse
import os
import sys
import subprocess

SITE = "evangelisteahongankomlavi.com"
HOST = "gator3223.hostgator.com"
PORT = 2222
USER = "zank"
WP_PATH = f"/home4/zank/{SITE}/wp"
LOCAL_PLUGIN = os.path.join(os.path.dirname(__file__), "..", "php", "trigger-rebuild.php")
REMOTE_PLUGIN = f"{WP_PATH}/wp-content/mu-plugins/trigger-rebuild.php"


def check_local():
    if not os.path.exists(LOCAL_PLUGIN):
        sys.exit(f"local plugin not found: {LOCAL_PLUGIN}")
    # Syntax check before uploading.
    r = subprocess.run(["php", "-l", LOCAL_PLUGIN], capture_output=True, text=True)
    print(r.stdout.strip() or r.stderr.strip())
    if r.returncode != 0:
        sys.exit("local PHP syntax check failed")


def sftp_cmd(dry_run: bool) -> list[str]:
    pw = os.environ.get("HOSTGATOR_SFTP_PASSWORD", "")
    if not pw:
        sys.exit("HOSTGATOR_SFTP_PASSWORD not set")
    return [
        "sftp", "-o", "StrictHostKeyChecking=no", "-P", str(PORT),
        "-b", "-", f"{USER}@{HOST}",
    ]


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--dry-run", action="store_true", help="print the sftp commands, do nothing")
    args = ap.parse_args()

    check_local()
    print(f"uploading {LOCAL_PLUGIN} -> {REMOTE_PLUGIN}")

    if args.dry_run:
        print("dry run — would run:")
        print(" ".join(sftp_cmd(True)))
        return

    # mkdir -p the mu-plugins dir, then put the file.
    script = f"mkdir -p {WP_PATH}/wp-content/mu-plugins\nput {LOCAL_PLUGIN} {REMOTE_PLUGIN}\n"
    cmd = sftp_cmd(False)
    proc = subprocess.run(cmd, input=script, capture_output=True, text=True)
    print(proc.stdout)
    if proc.returncode != 0:
        print(proc.stderr, file=sys.stderr)
        sys.exit(proc.returncode)

    # Verify on the server.
    check = subprocess.run(
        ["sftp", "-o", "StrictHostKeyChecking=no", "-P", str(PORT), "-b", "-",
         f"{USER}@{HOST"],
        input=f"ls -l {REMOTE_PLUGIN}\nphp -l {REMOTE_PLUGIN}\n",
        capture_output=True, text=True,
    )
    print(check.stdout)
    if check.returncode != 0:
        print(check.stderr, file=sys.stderr)
        sys.exit(check.returncode)
    print("deploy-trigger-rebuild: done")


if __name__ == "__main__":
    main()