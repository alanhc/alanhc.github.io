#!/usr/bin/env python3
"""Offline internal-link check over a Hugo build dir.

Stands in for the CI `lychee --offline` gate, which cannot run here (its
binary download is blocked by a permission rule).

Two things this must get right, both learned the hard way:
  1. Hugo's --minify emits UNQUOTED attribute values, so a regex that only
     matches href="..." silently checks zero links and reports a clean pass.
  2. Code samples inside <pre>/<code> contain things like src={`...`} that
     are not links at all. Scanning them produces false positives.
  3. Hugo's auto-summary flattens a post's first code block into
     <meta name=description content="...">, so attribute text there can look
     like a link too. Only the <body> is worth scanning.
"""
import os, re, sys
from urllib.parse import urlparse, unquote

root = sys.argv[1] if len(sys.argv) > 1 else "public"

# Scan only the body: <head> metadata carries flattened code (docstring, 3).
BODY = re.compile(r"<body\b[^>]*>(.*)</body\s*>", re.I | re.S)
# Strip code regions before looking for links (see docstring, point 2).
CODE = re.compile(r"<(pre|code|script|style)\b.*?</\1\s*>", re.I | re.S)
# Quoted or bare attribute values (see docstring, point 1).
ATTR = re.compile(r"""(?:href|src)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))""", re.I)

missing, checked = {}, 0
for dirpath, _, files in os.walk(root):
    for name in files:
        if not name.endswith(".html"):
            continue
        page = os.path.join(dirpath, name)
        with open(page, encoding="utf-8", errors="replace") as fh:
            html = fh.read()
        body = BODY.search(html)
        if body:
            html = body.group(1)
        html = CODE.sub(" ", html)
        for m in ATTR.finditer(html):
            raw = next(g for g in m.groups() if g is not None)
            if not raw:
                continue
            parsed = urlparse(raw)
            if parsed.scheme or parsed.netloc or raw.startswith(
                ("#", "mailto:", "data:", "tel:", "javascript:")):
                continue
            path = unquote(parsed.path)
            if not path:
                continue
            target = (os.path.join(root, path.lstrip("/")) if path.startswith("/")
                      else os.path.normpath(os.path.join(dirpath, path)))
            checked += 1
            ok = (os.path.isfile(os.path.join(target, "index.html"))
                  if os.path.isdir(target) else
                  (os.path.isfile(target) or os.path.isfile(target + ".html")
                   or os.path.isfile(os.path.join(target, "index.html"))))
            if not ok:
                missing.setdefault(path, set()).add(os.path.relpath(page, root))

print(f"internal links checked: {checked}")
print(f"broken targets: {len(missing)}")
for path, pages in sorted(missing.items()):
    print(f"  {path}  <- {sorted(pages)[:3]}")
sys.exit(1 if missing else 0)
