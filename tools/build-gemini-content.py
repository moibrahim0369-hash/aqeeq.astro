#!/usr/bin/env python3
"""
Build verbatim Gemini content for the Destiny Matrix.

Input : content-sources/gemini/*.md (raw backups of the 64 Gemini files) + MANIFEST.json
Output: assets/data/matrix/gemini/pos-NN.json   (positions + anatomical reference per arcana)
        assets/data/matrix/gemini/tails.json    (karmic tails, 2 per file)
        assets/data/matrix/gemini/index.json    (coverage + missing list)
        docs/gemini-inventory.json / .md        (full inventory of the 64 files)
        docs/gemini-reconciliation.json / .md   (source vs stored, word counts, result)

Rules: text is never summarised, re-worded, merged or re-ordered. Only structural markers
('>', '*', '-', table pipes) are turned into block kinds. Conversation chatter wrapped around
the interpretation by the author tool is separated and listed, not discarded silently.
"""
import json, os, re, sys, hashlib, collections

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'content-sources', 'gemini')
OUT = os.path.join(ROOT, 'assets', 'data', 'matrix', 'gemini')
DOCS = os.path.join(ROOT, 'docs')

ORD = ['أولاً', 'ثانياً', 'ثالثاً', 'رابعاً', 'خامساً', 'سادساً', 'سابعاً', 'ثامناً', 'تاسعاً']
POS_UNITS = {1: 'core', 2: 'money', 3: 'love', 4: 'tail_entry', 5: 'mission'}


def words(text):
    return len([t for t in text.split() if re.search(r'\w', t)])


def tokens(text):
    return [t for t in text.split() if re.search(r'\w', t)]


def read_body(path):
    t = open(path, encoding='utf8').read()
    head, body = t.split('\n---\n', 1) if '\n---\n' in t else ('', t)
    return head, body.strip('\n')


def line_block(line):
    s = line.rstrip()
    if not s.strip():
        return None
    m = re.match(r'^(\s*)>\s?(.*)$', s)
    if m:
        return ('q', 0, m.group(2)) if m.group(2).strip() else None
    m = re.match(r'^(\s*)[\*\-]\s+(.*)$', s)
    if m:
        return ('li', 0 if len(m.group(1)) <= 1 else 1, m.group(2))
    if s.lstrip().startswith('|'):
        cells = [c.strip() for c in s.strip().strip('|').split('|')]
        if all(re.fullmatch(r'-{2,}', c) for c in cells):
            return None  # table separator row
        return ('tr', 0, ' | '.join(cells))
    if len(s) - len(s.lstrip()) >= 2:
        return ('c', 1, s.strip())
    return ('p', 0, s.strip())


H1 = re.compile(r'^(' + '|'.join(ORD) + r')\s*:')
HU = re.compile(r'^الوحدة\s+\d+\s*:')
H2 = re.compile(r'^\d+\.\s')


def to_blocks(lines, sec=None):
    out = []
    for ln in lines:
        b = line_block(ln)
        if not b:
            continue
        k, d, t = b
        if k == 'p':
            if H1.match(t) or HU.match(t):
                k = 'h1'
            elif H2.match(t):
                k = 'h2'
        out.append({'k': k, 'd': d, 't': t})
    return out


def num_from_title(t):
    m = re.search(r'طاقة\s+(\d+)', t)
    return int(m.group(1)) if m else None


def classify(name):
    if 'destiny-matrix-positions' in name or name.startswith('طاقة 1 ('):
        return 'positions'
    if 'المرجع التشريحي الكامل' in name or name.startswith('رقم ') or name.startswith('نبدأ بـ طاقة'):
        return 'reference'
    if 'الذيل' in name and re.search(r'\d\d-الذيل', name):
        return 'tails'
    if name.startswith('الباب التأسيسي'):
        return 'foundation'
    return 'engine-or-instructions'


def main():
    manifest = json.load(open(os.path.join(SRC, 'MANIFEST.json'), encoding='utf8'))
    files = []
    for m in manifest:
        head, body = read_body(os.path.join(SRC, m['stored']))
        files.append({**m, 'body': body, 'type': classify(m['original'])})

    os.makedirs(OUT, exist_ok=True)
    os.makedirs(DOCS, exist_ok=True)
    inv, recon = [], []
    pos_data = {}   # n -> dict
    tails = []
    seen_hash = {}

    for f in files:
        lines = f['body'].split('\n')
        norm = hashlib.md5(re.sub(r'\s+', '', f['body']).encode()).hexdigest()
        dup_of = seen_hash.get(norm)
        seen_hash.setdefault(norm, f['stored'])
        rec = {'file': f['stored'], 'original': f['original'], 'type': f['type'],
               'chars': len(f['body']), 'words_total': words(f['body']), 'duplicate_of': dup_of}

        if f['type'] == 'positions':
            start = next(i for i, l in enumerate(lines) if l.startswith('عقيق أسترو |'))
            last_q = max(i for i, l in enumerate(lines) if l.lstrip().startswith('>'))
            content = lines[start:last_q + 1]
            chatter = lines[:start] + lines[last_q + 1:]
            title = content[0]
            n = num_from_title(title) or 1
            units, cur, hdr = {}, None, []
            for ln in content:
                mu = re.match(r'^الوحدة\s+(\d+)\s*:', ln)
                if mu:
                    cur = int(mu.group(1)); units[cur] = [ln]
                elif cur is None:
                    hdr.append(ln)
                else:
                    units[cur].append(ln)
            rec.update({'number': n, 'units': sorted(units), 'words_content': words('\n'.join(content)),
                        'words_chatter': words('\n'.join(chatter))})
            rec['chatter_sample'] = [c.strip()[:80] for c in chatter if c.strip()][:2]
            if dup_of:
                rec['note'] = 'نسخة مكررة حرفيًا من ملف آخر؛ لم تُنقل مرتين'
                inv.append(rec); continue
            P = pos_data.setdefault(n, {'number': n, 'sources': [], 'positions': {}, 'reference': None})
            P['sources'].append(f['stored'])
            P['header'] = to_blocks(hdr)
            for u, ls in units.items():
                key = POS_UNITS[u]
                blocks = to_blocks(ls)
                # unit heading line becomes h1
                if blocks and blocks[0]['k'] in ('p', 'h1'):
                    blocks[0]['k'] = 'h1'
                P['positions'][key] = {'unit': u, 'file': f['stored'], 'blocks': blocks}
                src_tok = tokens('\n'.join(ls)); st_tok = tokens('\n'.join(b['t'] for b in blocks))
                recon.append({'kind': 'position', 'key': key, 'number': n, 'file': f['stored'],
                              'words_source': len(src_tok), 'words_stored': len(st_tok),
                              'headings': sum(b['k'].startswith('h') for b in blocks),
                              'paragraphs': len(blocks), 'match': src_tok == st_tok})
            hdr_src = tokens('\n'.join(hdr)); hdr_st = tokens('\n'.join(b['t'] for b in P['header']))
            recon.append({'kind': 'position-header', 'key': 'header', 'number': n, 'file': f['stored'],
                          'words_source': len(hdr_src), 'words_stored': len(hdr_st), 'headings': 0,
                          'paragraphs': len(P['header']), 'match': hdr_src == hdr_st})

        elif f['type'] == 'reference':
            start = next(i for i, l in enumerate(lines) if l.startswith('عقيق أسترو |') or l.startswith('عقيق أسترو -'))
            end = max(i for i, l in enumerate(lines) if l.strip() == '};')
            content = lines[start:end + 1]
            chatter = lines[:start] + lines[end + 1:]
            n = num_from_title(content[0]) or num_from_title(f['original']) or 1
            rec.update({'number': n, 'words_content': words('\n'.join(content)),
                        'words_chatter': words('\n'.join(chatter))})
            rec['chatter_sample'] = [c.strip()[:80] for c in chatter if c.strip()][:2]
            if dup_of:
                rec['note'] = 'نسخة مكررة حرفيًا من ملف آخر؛ لم تُنقل مرتين'
                inv.append(rec); continue
            blocks, sec, sub_pos = [], 0, None
            code_start = None
            for i, ln in enumerate(content):
                if re.match(r'^تاسعاً\s*:', ln):
                    code_start = i
            main_lines = content[:code_start] if code_start is not None else content
            code_lines = content[code_start:] if code_start is not None else []
            for ln in main_lines:
                b = to_blocks([ln])
                if not b:
                    continue
                b = b[0]
                m1 = H1.match(ln)
                if m1:
                    sec = ORD.index(m1.group(1)) + 1; sub_pos = None
                b['sec'] = sec
                if sec == 2 and b['k'] == 'h2':
                    t = b['t']
                    sub_pos = ('core' if 'الجوهر' in t else 'money' if 'المال' in t else
                               'love' if 'العلاقات' in t else 'tail_entry' if ('قاع' in t or 'الذيل' in t) else None)
                if sec == 2 and sub_pos and not H1.match(ln):
                    b['pos'] = sub_pos
                blocks.append(b)
            P = pos_data.setdefault(n, {'number': n, 'sources': [], 'positions': {}, 'reference': None})
            P['sources'].append(f['stored'])
            P['reference'] = {'file': f['stored'], 'blocks': blocks,
                              'code': {'title': code_lines[0] if code_lines else '', 'text': '\n'.join(code_lines[1:])}}
            src_tok = tokens('\n'.join(main_lines)); st_tok = tokens('\n'.join(b['t'] for b in blocks))
            recon.append({'kind': 'reference', 'key': 'reference', 'number': n, 'file': f['stored'],
                          'words_source': len(src_tok), 'words_stored': len(st_tok),
                          'headings': sum(b['k'].startswith('h') for b in blocks), 'paragraphs': len(blocks),
                          'match': src_tok == st_tok})
            code_tok = tokens('\n'.join(code_lines))
            recon.append({'kind': 'reference-code', 'key': 'code', 'number': n, 'file': f['stored'],
                          'words_source': len(code_tok), 'words_stored': len(tokens(P['reference']['code']['title'] + '\n' + P['reference']['code']['text'])),
                          'headings': 1 if code_lines else 0, 'paragraphs': len(code_lines),
                          'match': code_tok == tokens(P['reference']['code']['title'] + '\n' + P['reference']['code']['text'])})

        elif f['type'] == 'tails':
            # split into tails by title lines
            idxs = [i for i, l in enumerate(lines) if l.startswith('عقيق أسترو | الذيل الكارمي')]
            all_chatter = []
            tcount = 0
            for ti, s in enumerate(idxs):
                e = idxs[ti + 1] if ti + 1 < len(idxs) else len(lines)
                seg = lines[s:e]
                # label line 'اسم الملف: ..' right before the title (for 2nd tail it is in previous segment end)
                label = None
                if s > 0 and lines[s - 1].startswith('اسم الملف:'):
                    label = lines[s - 1].replace('اسم الملف:', '').strip()
                # cut trailing chatter: after '4. بروتوكول' header keep only list/indented lines
                p4 = next((i for i, l in enumerate(seg) if re.match(r'^4\.\s', l)), None)
                cut = len(seg)
                if p4 is not None:
                    j = p4 + 1
                    while j < len(seg) and (not seg[j].strip() or re.match(r'^\s+\S', seg[j])):
                        j += 1
                    cut = j
                body_lines = seg[:cut]
                # drop next-tail label line if it is at the end of the segment
                tail_chatter = seg[cut:]
                if body_lines and body_lines[-1].startswith('اسم الملف:'):
                    tail_chatter = [body_lines.pop()] + tail_chatter
                while body_lines and not body_lines[-1].strip():
                    body_lines.pop()
                title = body_lines[0]
                mcode = re.search(r':\s*(\d+)\s*-\s*(\d+)\s*-\s*(\d+)', title)
                code = '-'.join(mcode.groups()) if mcode else None
                ordn = None
                if label:
                    mo = re.match(r'(\d+)-', label); ordn = int(mo.group(1)) if mo else None
                blocks = to_blocks(body_lines[1:])
                for b in blocks:
                    if b['k'] == 'p' and H2.match(b['t']):
                        b['k'] = 'h2'
                tails.append({'code': code, 'ordinal': ordn, 'file': f['stored'], 'label': label,
                              'title': title, 'blocks': blocks})
                src_tok = tokens('\n'.join(body_lines)); st_tok = tokens(title + '\n' + '\n'.join(b['t'] for b in blocks))
                recon.append({'kind': 'tail', 'key': code, 'number': ordn, 'file': f['stored'],
                              'words_source': len(src_tok), 'words_stored': len(st_tok),
                              'headings': 1 + sum(b['k'].startswith('h') for b in blocks),
                              'paragraphs': 1 + len(blocks), 'match': src_tok == st_tok})
                all_chatter += tail_chatter
                tcount += 1
            first = idxs[0]
            pre = lines[:first]
            # for first tail of a file the label line may be before title; do not count it as chatter
            pre = [l for l in pre if not l.startswith('اسم الملف:')]
            rec.update({'tails': tcount, 'words_content': rec['words_total'] - words('\n'.join(pre + all_chatter)),
                        'words_chatter': words('\n'.join(pre + all_chatter))})
            rec['chatter_sample'] = [c.strip()[:80] for c in (pre + all_chatter) if c.strip()][:2]
            if dup_of:
                rec['note'] = 'مكرر'
        else:
            rec['words_content'] = rec['words_total']
            rec['words_chatter'] = 0
            rec['note'] = ('نص تعليمي تأسيسي غير مرتبط بموضع في الخريطة؛ خارج نطاق هذه المرحلة'
                           if f['type'] == 'foundation' else 'ملف محركات/تعليمات برمجية؛ ليس تفسيرًا')
        inv.append(rec)

    # write per-arcana files
    for n, P in sorted(pos_data.items()):
        json.dump(P, open(os.path.join(OUT, 'pos-%02d.json' % n), 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))
    # file 01 carries no 'اسم الملف' labels: its two tails are ordinal 1 and 2 by file order
    for t in tails:
        if t['ordinal'] is None:
            t['ordinal'] = 1 if t['code'] == '18-6-5' else 2 if t['code'] == '18-9-9' else None
    tails.sort(key=lambda t: (t['ordinal'] or 99))
    json.dump({'tails': tails}, open(os.path.join(OUT, 'tails.json'), 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))

    # coverage / missing
    missing = []
    for n in range(1, 23):
        P = pos_data.get(n)
        for key in POS_UNITS.values():
            if not P or key not in P['positions']:
                missing.append({'number': n, 'item': 'position:' + key, 'reason': 'لا يوجد ملف مواضع Gemini لهذا الرقم' if not P or not P['positions'] else 'الوحدة غير موجودة'})
        if not P or not P['reference']:
            missing.append({'number': n, 'item': 'reference', 'reason': 'لا يوجد ملف المرجع التشريحي لهذا الرقم'})
    have_codes = {t['code'] for t in tails}
    index = {'numbers': {str(n): {'positions': sorted(pos_data[n]['positions']) if n in pos_data else [],
                                   'reference': bool(n in pos_data and pos_data[n]['reference'])} for n in range(1, 23)},
             'tails': [{'ordinal': t['ordinal'], 'code': t['code']} for t in tails],
             'positionsWithoutSource': ['father_top (F)', 'mother_top (G)', 'father_bottom (H)', 'mother_bottom (I)',
                                        'talents (B)', 'personal (A)', 'balance', 'purposes-personal/spiritual/planetary',
                                        'children_line', 'transformation_rx'],
             'missing': missing}
    json.dump(index, open(os.path.join(OUT, 'index.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    json.dump(inv, open(os.path.join(DOCS, 'gemini-inventory.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    json.dump(recon, open(os.path.join(DOCS, 'gemini-reconciliation.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    bad = [r for r in recon if not r['match']]
    print('files', len(files), 'arcana files', len(pos_data), 'tails', len(tails), 'recon rows', len(recon), 'mismatch', len(bad))
    for b in bad[:10]:
        print('MISMATCH', b)
    print('missing:', len(missing))
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
