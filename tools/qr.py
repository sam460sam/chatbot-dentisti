"""
The QR codes in the contact panel and the inner-page bands.

Each code encodes a short address on this site, not the wa.me link itself:

    https://twinbyteservices.com/wa/{lang}           (home panel)
    https://twinbyteservices.com/wa/{lang}/{page}    (assistant, websites, prices)

The build turns those addresses into 302 redirects to the prefilled WhatsApp
chat (scripts/wa-redirects.mjs, reading src/i18n/contact.ts), so a message
can change without touching these files. Run this again only if the domain
or the list of pages changes.

Run once, in a scratch virtualenv (segno is a build-time tool, not a site
dependency):

    python3 -m venv /tmp/qr-venv
    /tmp/qr-venv/bin/pip install segno
    /tmp/qr-venv/bin/python tools/qr.py

Writes public/brand/qr-wa-{en,nl,it}.svg and
public/brand/qr-wa-{lang}-{assistant,websites,prices}.svg: error correction M,
a 4-module quiet zone, navy modules on a transparent ground (the cream tile
behind them is CSS), a viewBox and no fixed size, no XML declaration, and
crispEdges so the modules never blur at any zoom.
"""
from pathlib import Path
import io
import re

import segno

BASE = 'https://twinbyteservices.com'
LANGS = ('en', 'nl', 'it')
PAGES = ('assistant', 'websites', 'prices')
OUT = Path(__file__).resolve().parent.parent / 'public' / 'brand'


def write(name: str, url: str) -> None:
    qr = segno.make(url, error='m', micro=False)
    buf = io.BytesIO()
    qr.save(
        buf,
        kind='svg',
        dark='#0A0F1E',
        light=None,
        border=4,
        scale=1,
        omitsize=True,
        xmldecl=False,
        svgns=True,
        nl=False,
        svgclass=None,
        lineclass=None,
    )
    svg = buf.getvalue().decode('utf-8')
    # crisp modules at any scale
    svg = re.sub(r'<svg ', '<svg shape-rendering="crispEdges" ', svg, count=1)
    (OUT / name).write_text(svg + '\n', encoding='utf-8')
    print(f'{name}: {url} (version {qr.version}, {qr.symbol_size(border=4)[0]} modules)')


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for lang in LANGS:
        write(f'qr-wa-{lang}.svg', f'{BASE}/wa/{lang}')
        for page in PAGES:
            write(f'qr-wa-{lang}-{page}.svg', f'{BASE}/wa/{lang}/{page}')


if __name__ == '__main__':
    main()
