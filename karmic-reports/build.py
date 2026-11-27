#!/usr/bin/env python3
"""Build karmic-tail PDFs from markdown reports using the Aqeeq template."""
import glob
import html
import os
import re
import subprocess
import sys

TEMPLATE = open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'template.html'), encoding='utf-8').read()
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)),'out')
os.makedirs(OUT, exist_ok=True)


def parse_md(text):
    """Split md into (title, subtitle, body_html)."""
    lines = text.split('\n')
    title, subtitle = '', ''
    body_lines = []
    h1_done = False
    for ln in lines:
        if ln.startswith('# ') and not h1_done:
            h1_done = True
            t = ln[2:].strip()
            # strip "الذيل الكارمي" prefix and code ([12 - 16 - 4] or 12-16-4)
            t = re.sub(r'^الذيل الكارمي\s*', '', t)
            t = re.sub(r'^\[[\d\s-]+\]\s*', '', t)
            t = re.sub(r'^[\d]+-[\d]+-[\d]+\s*', '', t)
            t = re.sub(r'^—\s*', '', t).strip()
            parts = re.split(r'\s+—\s+', t, maxsplit=1)
            title = parts[-1] if len(parts) == 2 else t
            if ' / ' in title:
                title, subtitle = title.split(' / ', 1)
            continue
        if h1_done and not subtitle and re.match(r'^شفرة[:：]?\s*«', ln.strip()):
            subtitle = ln.strip().split('«', 1)[1].rsplit('»', 1)[0]
            continue
        if h1_done and re.match(r'^##\s+شفرة', ln.strip()):
            continue  # code line already on the cover
        body_lines.append(ln)
    return title, subtitle, '\n'.join(body_lines)


def inline(s):
    s = html.escape(s)
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
    return s


def md_to_html(body):
    out, in_list = [], False
    for ln in body.split('\n'):
        s = ln.rstrip()
        if not s.strip():
            if in_list:
                out.append('</ul>')
                in_list = False
            continue
        if s.startswith('### '):
            if in_list:
                out.append('</ul>'); in_list = False
            out.append(f'<h3>{inline(s[4:])}</h3>')
        elif s.startswith('## '):
            if in_list:
                out.append('</ul>'); in_list = False
            out.append(f'<h2>{inline(s[3:])}</h2>')
        elif s.startswith('# '):
            if in_list:
                out.append('</ul>'); in_list = False
            out.append(f'<h2>{inline(s[2:])}</h2>')
        elif re.match(r'^\s*-\s+', s) or re.match(r'^\s*\*\s+', s):
            if not in_list:
                out.append('<ul>'); in_list = True
            item = re.sub(r'^\s*[-*]\s+', '', s)
            out.append(f'<li>{inline(item)}</li>')
        elif re.match(r'^\s*---\s*$', s):
            if in_list:
                out.append('</ul>'); in_list = False
            continue
        elif re.match(r'^\s*\d+\.\s+', s):
            if not in_list:
                out.append('<ul>'); in_list = True
            item = re.sub(r'^\s*\d+\.\s+', '', s)
            out.append(f'<li>{inline(item)}</li>')
        else:
            if in_list:
                out.append('</ul>'); in_list = False
            out.append(f'<p>{inline(s)}</p>')
    if in_list:
        out.append('</ul>')
    return '\n'.join(out)


def build(md_path):
    text = open(md_path, encoding='utf-8').read()
    title, subtitle, body = parse_md(text)
    if not title.strip():
        title, subtitle = subtitle, ''
    m = re.search(r'karmic-tail-([\d-]+)\.md', md_path)
    code = m.group(1)
    page = (TEMPLATE
            .replace('__CODE__', code)
            .replace('__TITLE__', html.escape(title))
            .replace('__SUBTITLE__', html.escape(subtitle))
            .replace('__BODY__', md_to_html(body)))
    html_path = os.path.join(OUT, code + '.html')
    pdf_path = os.path.join(OUT, f'karmic-tail-{code}.pdf')
    open(html_path, 'w', encoding='utf-8').write(page)
    r = subprocess.run([
        'google-chrome', '--headless', '--disable-gpu', '--no-sandbox',
        '--no-pdf-header-footer', f'--print-to-pdf={pdf_path}', html_path
    ], capture_output=True, text=True, timeout=120)
    ok = os.path.exists(pdf_path) and os.path.getsize(pdf_path) > 1000
    print(f'{code}: {"OK " + str(os.path.getsize(pdf_path)) + "B" if ok else "FAIL " + r.stderr[-200:]}')


if __name__ == '__main__':
    paths = sys.argv[1:] or sorted(glob.glob(os.path.join(os.path.dirname(os.path.abspath(__file__)),'final','karmic-tail-*.md')))
    for p in paths:
        build(p)
