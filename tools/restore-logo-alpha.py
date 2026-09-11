#!/usr/bin/env python3
"""
Accelity Partners — logo asset restoration.

WHY THIS EXISTS
---------------
The logo PNGs supplied to this project have been flattened onto an opaque white
canvas, and the supplied logo PDFs are not readable as PDFs. Consequences:

  * every "reversed" / "white" colourway is unusable (white artwork on a white
    plate renders as a blank rectangle);
  * the knockout inside the A symbol is filled with opaque white instead of
    showing the surface beneath it, so the mark cannot sit on Mist or Navy.

This script RESTORES the transparency the kit README says these exports should
have. It does not redraw, retype, stretch, rotate or re-letter anything: every
pixel keeps its original coverage value, and colours are snapped back to the
exact brand HEX values in brand-specifications.json.

The reversed lockup is reconstructed as the approved colourway defined in the
kit (orange symbol + white wordmark) from the unchanged primary geometry.

THIS IS A REVIEW-QUALITY STAND-IN. Replace every output with the official
02_Logos/SVG masters before publication. See docs/GAPS.md.
"""

import os
import numpy as np
from PIL import Image

SRC = "/mnt/project"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "brand")

ORANGE = np.array([245, 130, 32], dtype=float)   # Acceleration Orange #F58220
NAVY = np.array([11, 45, 75], dtype=float)       # Foundation Navy    #0B2D4B
WHITE = np.array([255, 255, 255], dtype=float)


def unflatten(path):
    """Split a white-flattened two-ink logo into per-ink coverage masks.

    A pixel P composited from ink C over white at coverage a satisfies
        P = a*C + (1-a)*255   =>   (255 - P) = a * (255 - C)
    so for each candidate ink we solve for a by projection and keep the ink
    with the smaller residual. Orange and navy never touch in these lockups,
    so the classification is unambiguous along every edge.
    """
    px = np.asarray(Image.open(path).convert("RGB"), dtype=float)
    ink = 255.0 - px                                  # how much ink at this pixel

    best_a = None
    best_res = None
    best_id = None

    for idx, colour in enumerate((ORANGE, NAVY)):
        d = 255.0 - colour
        a = (ink @ d) / float(d @ d)
        a = np.clip(a, 0.0, 1.0)
        res = np.linalg.norm(ink - a[..., None] * d, axis=-1)
        if best_res is None:
            best_a, best_res, best_id = a, res, np.full(a.shape, idx)
        else:
            take = res < best_res
            best_a = np.where(take, a, best_a)
            best_id = np.where(take, idx, best_id)
            best_res = np.where(take, res, best_res)

    alpha_orange = np.where(best_id == 0, best_a, 0.0)
    alpha_navy = np.where(best_id == 1, best_a, 0.0)
    # Drop coverage that is indistinguishable from the white plate.
    alpha_orange[alpha_orange < 0.004] = 0.0
    alpha_navy[alpha_navy < 0.004] = 0.0
    return alpha_orange, alpha_navy


def compose(alpha_orange, alpha_navy, wordmark_colour):
    """Rebuild an RGBA image: symbol always orange, wordmark per colourway."""
    h, w = alpha_orange.shape
    out = np.zeros((h, w, 4), dtype=float)
    a = alpha_orange + alpha_navy
    a = np.clip(a, 0.0, 1.0)
    # Straight (non-premultiplied) alpha: pick the ink that owns the pixel.
    owns_orange = alpha_orange >= alpha_navy
    rgb = np.where(owns_orange[..., None], ORANGE, np.asarray(wordmark_colour, dtype=float))
    out[..., :3] = rgb
    out[..., 3] = a * 255.0
    return Image.fromarray(np.round(out).astype(np.uint8), mode="RGBA")


LOCKUPS = {
    "horizontal_no_tagline": "logo-horizontal",
    "horizontal_tagline": "logo-horizontal-tagline",
    "stacked_tagline": "logo-stacked-tagline",
    "stacked_no_tagline": "logo-stacked",
    "symbol": "symbol",
}

def main():
    os.makedirs(OUT, exist_ok=True)
    made = []
    for src_name, out_name in LOCKUPS.items():
        src = os.path.join(SRC, f"Accelity_Partners_{src_name}_primary.png")
        if not os.path.exists(src):
            print(f"  skip (missing): {src}")
            continue
        ao, an = unflatten(src)

        primary = compose(ao, an, NAVY)
        primary.save(os.path.join(OUT, f"{out_name}-primary.png"), optimize=True)
        made.append(f"{out_name}-primary.png")

        reversed_ = compose(ao, an, WHITE)
        reversed_.save(os.path.join(OUT, f"{out_name}-reversed.png"), optimize=True)
        made.append(f"{out_name}-reversed.png")

    # Square profile icons are supplied with their own solid background, so the
    # flattening did not damage them. Copy them through untouched.
    for src_name, out_name, size in (
        ("profile_navy_512", "icon-navy-512", 512),
        ("profile_navy_1024", "icon-navy-1024", 1024),
        ("profile_white_512", "icon-white-512", 512),
    ):
        src = os.path.join(SRC, f"Accelity_Partners_{src_name}.png")
        if not os.path.exists(src):
            continue
        im = Image.open(src).convert("RGB")
        if im.size != (size, size):
            im = im.resize((size, size), Image.LANCZOS)
        im.save(os.path.join(OUT, f"{out_name}.png"), optimize=True)
        made.append(f"{out_name}.png")

    # Browser icons, derived from the approved navy profile icon only.
    base = Image.open(os.path.join(OUT, "icon-navy-1024.png")).convert("RGB")
    for size, name in ((180, "apple-touch-icon.png"), (32, "favicon-32.png"), (16, "favicon-16.png")):
        base.resize((size, size), Image.LANCZOS).save(os.path.join(OUT, name), optimize=True)
        made.append(name)

    for name in sorted(made):
        p = os.path.join(OUT, name)
        print(f"  {name:34s} {os.path.getsize(p):>8,} bytes")


if __name__ == "__main__":
    main()
