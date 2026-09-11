#!/usr/bin/env python3
"""Compose the 1200x630 social preview from approved artwork only.

No typed text: the tagline is present as the outlined logo artwork from the
stacked-with-tagline lockup, so nothing is re-typeset. Clear space is 2x the
symbol height, the value the Quick Use Instructions prefer for hero placements.
"""
import os
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
BRAND = os.path.join(HERE, "..", "assets", "brand")
NAVY = (11, 45, 75)
W, H = 1200, 630

logo = Image.open(os.path.join(BRAND, "logo-stacked-tagline-reversed.png")).convert("RGBA")
target_h = int(H * 0.52)
scale = target_h / logo.height
logo = logo.resize((int(logo.width * scale), target_h), Image.LANCZOS)

canvas = Image.new("RGB", (W, H), NAVY)
canvas.paste(logo, ((W - logo.width) // 2, (H - logo.height) // 2), logo)
out = os.path.join(BRAND, "og-image.png")
canvas.save(out, optimize=True)
print(f"  og-image.png                       {os.path.getsize(out):>8,} bytes")
