#!/usr/bin/env python3
"""Lightweight PHP syntax sanity check (balanced braces + open/close tags).

php.exe isn't on PATH on this machine, so this validates the mu-plugin's
structure well enough to catch gross errors before uploading. A real
`php -l` runs on the server during deployment.
"""
import sys

path = sys.argv[1]
src = open(path, encoding="utf-8").read()

errors = []

# 1. Must start with <?php
if not src.lstrip().startswith("<?php"):
    errors.append("does not start with <?php")

# 2. Brace balance — raw count is reliable; string-stripping regexes are lossy.
for kind, op, cl in [("curly", "{", "}"), ("paren", "(", ")"), ("bracket", "[", "]")]:
    if src.count(op) != src.count(cl):
        errors.append(f"unbalanced {kind}: {src.count(op)} open vs {src.count(cl)} close")

# 3. No stray bare <?php mid-file
if src.count("<?php") > 1:
    errors.append(f"multiple <?php tags ({src.count('<?php')})")

# 4. Required hooks present
for hook in ["publish_post", "publish_page", "save_post", "wp_remote_post", "repository_dispatch"]:
    if hook not in src:
        errors.append(f"missing expected token: {hook}")

if errors:
    for e in errors:
        print(f"FAIL: {e}")
    sys.exit(1)
print(f"OK: {path} — braces balanced, hooks present, single open tag")