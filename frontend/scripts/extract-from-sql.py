#!/usr/bin/env python3
"""Extract WordPress posts from local.sql and create snapshot in WP REST API format.
Usage: python extract-from-sql.py [SQL_PATH] [OUTPUT_PATH]
"""
import re
import json
import os
import sys

DEFAULT_SQL = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "app", "sql", "local.sql"
)
DEFAULT_OUTPUT = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "public", "_generated", "wp-content.json"
)

SQL_PATH = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_SQL
OUTPUT_PATH = sys.argv[2] if len(sys.argv) > 2 else DEFAULT_OUTPUT


def extract_postmeta(sql):
    """Extract WordPress postmeta for featured images and URLs."""
    postmeta_map = {}

    # Find all wp_postmeta rows
    postmeta_inserts = re.findall(r"INSERT INTO `wp_postmeta` VALUES (.*?);", sql, re.DOTALL)

    for insert in postmeta_inserts:
        rows = split_sql_rows(insert)
        for row in rows:
            values = parse_sql_row(row)
            if len(values) < 4:
                continue

            try:
                post_id = values[1].strip().strip("'").strip("\\'")
                meta_key = values[2].strip().strip("'").strip("\\'")
                meta_value = values[3].strip().strip("'").strip("\\'")

                if post_id not in postmeta_map:
                    postmeta_map[post_id] = {}
                postmeta_map[post_id][meta_key] = meta_value
            except:
                continue

    return postmeta_map


def get_featured_image_from_meta(post_id, postmeta_map, posts_by_id):
    """Get featured image URL from postmeta or attachment posts."""
    if post_id not in postmeta_map:
        return None

    meta = postmeta_map[post_id]

    # Look for attachment URL in postmeta
    if "_wp_attached_file" in meta:
        url = meta["_wp_attached_file"]
        return f"/wp-content/uploads/{url}" if not url.startswith("http") else url

    # Look for thumbnail ID and try to find attachment
    if "_thumbnail_id" in meta:
        thumb_id = meta["_thumbnail_id"]
        if thumb_id in postmeta_map and "_wp_attached_file" in postmeta_map[thumb_id]:
            url = postmeta_map[thumb_id]["_wp_attached_file"]
            return f"/wp-content/uploads/{url}" if not url.startswith("http") else url

    return None


def main():
    print(f"Reading SQL dump from {SQL_PATH}...")
    if not os.path.exists(SQL_PATH):
        print(f"ERROR: SQL dump not found at {SQL_PATH}")
        sys.exit(1)

    with open(SQL_PATH, "r", encoding="utf-8", errors="replace") as f:
        sql = f.read()

    print(f"SQL size: {len(sql)} bytes")

    # Extract postmeta for featured images
    postmeta_map = extract_postmeta(sql)
    print(f"Extracted postmeta: {len(postmeta_map)} entries")

    posts_inserts = re.findall(r"INSERT INTO `wp_posts` VALUES (.*?);", sql, re.DOTALL)
    print(f"Found {len(posts_inserts)} wp_posts INSERT blocks")

    all_posts = []

    for insert in posts_inserts:
        rows = split_sql_rows(insert)
        for row in rows:
            values = parse_sql_row(row)
            if len(values) < 23:
                continue

            try:
                post_id = values[0].strip().strip("'").strip("\\'")
                post_author = values[1].strip().strip("'").strip("\\'")
                post_date = values[2].strip().strip("'").strip("\\'")
                post_content = values[4].strip().strip("'").strip("\\'") if len(values) > 4 else ""
                post_title = values[5].strip().strip("'").strip("\\'") if len(values) > 5 else ""
                post_excerpt = values[6].strip().strip("'").strip("\\'") if len(values) > 6 else ""
                post_status = values[7].strip().strip("'").strip("\\'") if len(values) > 7 else ""
                post_name = values[11].strip().strip("'").strip("\\'") if len(values) > 11 else ""
                post_type = values[20].strip().strip("'").strip("\\'") if len(values) > 20 else ""
            except Exception as e:
                continue

            if post_status != "publish":
                continue
            if post_type not in ("post", "page"):
                continue

            # Skip very old placeholder content (pre-2020)
            year = post_date[:4] if len(post_date) >= 4 else "2026"
            if int(year) < 2020:
                continue

            title = post_title.replace("�", "").replace("\\", "").strip()
            content = post_content.replace("�", "").replace("\\", "").strip()
            slug = post_name.replace("�", "").strip() or post_id
            date = post_date or "2026-01-01"

            # Try postmeta first, then content, then fallback
            image = get_featured_image_from_meta(post_id, postmeta_map, {})
            if not image:
                image = extract_featured_image(content)
            if not image:
                post_id_int = int(post_id) if post_id.isdigit() else 0
                fallbacks = ["/gallery/3.jpg", "/gallery/11.jpg", "/gallery/photo-11.jpg"]
                image = fallbacks[post_id_int % len(fallbacks)]

            categories = determine_categories(title, content, post_type)

            post_obj = {
                "id": int(post_id) if post_id.isdigit() else 0,
                "date": date,
                "title": {"rendered": title},
                "content": {"rendered": content[:5000]},
                "excerpt": {"rendered": post_excerpt.replace("�", "")[:500] if post_excerpt else title},
                "slug": slug,
                "author": int(post_author) if post_author.isdigit() else 1,
                "status": post_status,
                "type": post_type,
                "link": f"https://evangelisteahongankomlavi.com/?p={post_id}",
                "categories": categories,
                "tags": [],
                "featured_media_url": image,
                "_embedded": {
                    "author": [{"name": "Évangéliste Ahongan Komlavi", "slug": "admin", "avatar_urls": {}}],
                    "wp:term": [[{"name": "Prêches", "slug": "preches", "taxonomy": "category", "description": "", "count": 0, "parent": 0, "meta": []}]],
                    "wp:featuredmedia": [{"source_url": image, "alt_text": ""}],
                },
            }

            all_posts.append(post_obj)
            print(f"  [{post_type}] {title[:60]} ({date[:10]})")

    print(f"\nTotal published posts/pages: {len(all_posts)}")

    all_posts.sort(key=lambda p: p["date"], reverse=True)

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(all_posts, f, ensure_ascii=False, indent=2)

    print(f"\nSnapshot written to {OUTPUT_PATH}")
    print(f"Size: {os.path.getsize(OUTPUT_PATH)} bytes")


def split_sql_rows(insert_str):
    rows = []
    current = ""
    in_quote = False
    quote_char = None
    escape = False
    paren_depth = 0

    for c in insert_str:
        if escape:
            current += c
            escape = False
            continue
        if c == "\\":
            current += c
            escape = True
            continue
        if c in ('"', "'") and not escape:
            if in_quote and c == quote_char:
                in_quote = False
                current += c
            elif not in_quote:
                in_quote = True
                quote_char = c
                current += c
            else:
                current += c
            continue
        if in_quote:
            current += c
            continue
        if c == "(":
            paren_depth += 1
            if paren_depth == 1:
                if current.strip():
                    rows.append(current.strip())
                current = ""
            continue
        if c == ")":
            paren_depth -= 1
            if paren_depth == 0:
                if current.strip():
                    rows.append(current.strip())
                current = ""
            continue
        if paren_depth >= 1:
            current += c

    return rows


def extract_from_sql_with_fallback(sql):
    """Try WP-CLI export format first, then standard MySQL INSERT format"""
    # Try to find wp_posts table data in WP-CLI format (which has different structure)
    # For now, just try standard INSERT INTO pattern
    posts_inserts = re.findall(r"INSERT INTO `wp_posts` VALUES (.*?);", sql, re.DOTALL)
    if not posts_inserts:
        # Try alternative format without backticks
        posts_inserts = re.findall(r"INSERT INTO wp_posts VALUES (.*?);", sql, re.DOTALL)
    return posts_inserts


def parse_sql_row(row_str):
    values = []
    current = ""
    in_quote = False
    quote_char = None
    escape = False

    for c in row_str:
        if escape:
            current += c
            escape = False
            continue
        if c == "\\":
            current += c
            escape = True
            continue
        if c in ('"', "'") and not escape:
            if in_quote and c == quote_char:
                in_quote = False
                current += c
            elif not in_quote:
                in_quote = True
                quote_char = c
                current += c
            else:
                current += c
            continue
        if in_quote:
            current += c
            continue
        if c == ",":
            values.append(current)
            current = ""
            continue
        current += c

    if current.strip():
        values.append(current)

    return values


def extract_featured_image(content):
    if not content:
        return None
    match = re.search(r'src=["\']([^"\']+\.(?:jpg|jpeg|png|webp|gif))["\']', content, re.IGNORECASE)
    if match:
        return match.group(1)
    match = re.search(r'<!--\s*wp:image.*?url:\s*["\']([^"\']+)["\']', content, re.DOTALL | re.IGNORECASE)
    if match:
        return match.group(1)
    return None


def determine_categories(title, content, post_type):
    text = (title + " " + (content or "")).lower()
    if any(kw in text for kw in ["prêche", "prédication", "message", "enseignement"]):
        return [{"name": "Prêches", "slug": "preches"}]
    if any(kw in text for kw in ["joie", "louange", "culte"]):
        return [{"name": "Louange", "slug": "louange"}]
    if any(kw in text for kw in ["famille", "mariage", "enfant"]):
        return [{"name": "Famille", "slug": "famille"}]
    if any(kw in text for kw in ["jeune", "jeunesse", "adolescent"]):
        return [{"name": "Jeunesse", "slug": "jeunesse"}]
    if any(kw in text for kw in ["prière", "intercession", "priere"]):
        return [{"name": "Prière et Intercession", "slug": "priere-intercession"}]
    if any(kw in text for kw in ["mission", "évangélisation"]):
        return [{"name": "Mission", "slug": "mission"}]
    if any(kw in text for kw in ["étude", "bible", "écriture"]):
        return [{"name": "Étude Biblique", "slug": "etude-biblique"}]
    if post_type == "page":
        return [{"name": "Pages", "slug": "pages"}]
    return [{"name": "Prêches", "slug": "preches"}]


if __name__ == "__main__":
    main()
