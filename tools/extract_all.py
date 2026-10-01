import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image
from extract2 import SHEET, SH, SW, box_blur, model_background, flood_from_border, components

OUT = 'tools/out'

# (category, name, nominal box) -- box is the cell the sprite belongs to.
ITEMS = [
    ('mascot', 'mascot-coding',        (0, 0, 256, 256)),
    ('mascot', 'mascot-thinking',      (256, 0, 512, 256)),
    ('mascot', 'mascot-idea',          (512, 0, 768, 256)),
    ('mascot', 'mascot-stressed',      (768, 0, 1024, 256)),
    ('mascot', 'mascot-cheering',      (1024, 0, 1280, 256)),
    ('mascot', 'mascot-searching',     (1280, 0, 1536, 256)),
    ('mascot', 'mascot-money',         (0, 256, 256, 505)),
    ('mascot', 'mascot-rocket',        (256, 256, 512, 505)),
    ('mascot', 'mascot-ai',            (512, 256, 790, 505)),
    ('mascot', 'mascot-overwhelmed',   (790, 256, 1024, 505)),
    ('mascot', 'mascot-trophy',        (1024, 256, 1280, 505)),
    ('mascot', 'mascot-celebrate',     (1280, 256, 1536, 505)),

    ('growth', 'growth-01-sprout',     (0, 505, 170, 730)),
    ('growth', 'growth-02-plant',      (170, 505, 340, 730)),
    ('growth', 'growth-03-tree',       (340, 505, 512, 730)),
    ('growth', 'growth-04-big-tree',   (512, 505, 700, 730)),
    ('growth', 'growth-05-skill-tree', (700, 505, 940, 730)),

    ('bugs', 'bug-salary',             (968, 498, 1095, 614)),
    ('bugs', 'bug-workload',           (1096, 498, 1218, 614)),
    ('bugs', 'bug-technology',         (1219, 490, 1368, 614)),
    ('bugs', 'bug-noopportunity',      (1358, 498, 1500, 614)),
    ('bugs', 'bug-boss',               (960, 616, 1104, 730)),
    ('bugs', 'bug-promotion',          (1105, 614, 1258, 730)),
    ('bugs', 'bug-ai',                 (1262, 618, 1396, 730)),
    ('bugs', 'bug-noBug',              (1398, 616, 1532, 730)),

    ('badges', 'badge-salary',            (105, 852, 252, 1000)),
    ('badges', 'badge-job-change',        (271, 852, 418, 1000)),
    ('badges', 'badge-senior',            (437, 852, 584, 1000)),
    ('badges', 'badge-global',            (600, 852, 748, 1000)),
    ('badges', 'badge-remote',            (779, 852, 922, 1000)),
    ('badges', 'badge-ai',                (952, 852, 1098, 1000)),
    ('badges', 'badge-work-life-balance', (1119, 852, 1268, 1000)),
    ('badges', 'badge-tech-levelup',      (1287, 852, 1435, 1000)),
]

OVERRIDE = {
    # (top, right, bottom, left) where the default square margin reaches
    # into a neighbouring sprite.
    'mascot-overwhelmed': (4, 28, 28, 4),
    'mascot-idea': (28, 18, 28, 18),
}
MARGIN = {'mascot': 28, 'growth': 20, 'bugs': 10, 'ai': 14, 'badges': (4, 12, 12, 12)}
# how big a blob must be (relative to the biggest kept blob) to survive
KEEP_RATIO = {'mascot': 0.004, 'growth': 0.004, 'bugs': 0.05, 'ai': 0.02, 'badges': 0.02}


def _matte(category, box, margin, lo, hi):
    nx0, ny0, nx1, ny1 = box
    mt, mr, mb, ml = (margin if isinstance(margin, tuple) else (margin,) * 4)
    ex0, ey0 = max(0, nx0 - ml), max(0, ny0 - mt)
    ex1, ey1 = min(SW, nx1 + mr), min(SH, ny1 + mb)
    crop = SHEET[ey0:ey1, ex0:ex1]
    h, w, _ = crop.shape

    bg = model_background(crop)
    dist = box_blur(np.sqrt(((crop - bg) ** 2).sum(axis=2)), 1)

    border = np.zeros((h, w), bool)
    border[0, :] = border[-1, :] = True
    border[:, 0] = border[:, -1] = True
    seed = border & (dist < lo)
    if not seed.any():
        seed = border

    fg = ~flood_from_border(seed, dist > hi)

    cy0, cy1 = ny0 - ey0, ny1 - ey0
    cx0, cx1 = nx0 - ex0, nx1 - ex0

    # A sprite sitting against the sheet's own edge is not "clipped" -- only
    # borders that cut into the middle of the sheet mean a neighbour bleed.
    real = dict(top=ey0 > 0, bottom=ey1 < SH, left=ex0 > 0, right=ex1 < SW)

    blobs = []
    for c in components(fg):
        ys = np.array([p[0] for p in c]); xs = np.array([p[1] for p in c])
        centroid_in = (cy0 <= ys.mean() < cy1) and (cx0 <= xs.mean() < cx1)
        touches = ((real['top'] and ys.min() <= 1) or
                   (real['bottom'] and ys.max() >= h - 2) or
                   (real['left'] and xs.min() <= 1) or
                   (real['right'] and xs.max() >= w - 2))
        blobs.append([len(c), ys, xs, centroid_in, touches])
    if not blobs:
        return crop, np.zeros((h, w)), True, 0

    centred = [b for b in blobs if b[3]] or blobs
    main = max(centred, key=lambda b: b[0])

    keep = np.zeros((h, w), bool)
    keep[main[1], main[2]] = True
    dropped = 0
    ratio = KEEP_RATIO[category]
    for b in blobs:
        if b is main:
            continue
        if not b[3] or b[4]:
            dropped += b[0]
        elif b[0] >= max(main[0] * ratio, 20):
            keep[b[1], b[2]] = True

    soft = np.clip((dist - lo) / (hi - lo), 0, 1)
    alpha = box_blur(np.where(keep, soft, 0.0), 1)
    alpha = np.where(keep, np.clip(alpha * 1.6, 0, 1), 0.0)
    return crop, alpha, main[4], dropped


def extract_item(category, box, lo=22.0, hi=55.0, margin=None):
    if margin is None:
        margin = MARGIN[category]
    crop, alpha, main_clipped, dropped = _matte(category, box, margin, lo, hi)
    return np.dstack([crop, alpha * 255]).astype(np.uint8), alpha, dropped, main_clipped, margin


def trim(rgba, pad=4):
    a = rgba[:, :, 3]
    ys, xs = np.nonzero(a > 10)
    if len(ys) == 0:
        return rgba
    y0, y1 = max(0, ys.min() - pad), min(rgba.shape[0], ys.max() + 1 + pad)
    x0, x1 = max(0, xs.min() - pad), min(rgba.shape[1], xs.max() + 1 + pad)
    return rgba[y0:y1, x0:x1]


if __name__ == '__main__':
    report = []
    for cat, name, box in ITEMS:
        rgba, alpha, dropped, main_clipped, margin = extract_item(cat, box, margin=OVERRIDE.get(name))
        t = trim(rgba)
        d = os.path.join(OUT, cat)
        os.makedirs(d, exist_ok=True)
        Image.fromarray(t, 'RGBA').save(os.path.join(d, name + '.png'))
        flags = []
        if main_clipped:
            flags.append('STILL-CLIPPED')
        if dropped > 400:
            flags.append('dropped=%d' % dropped)
        if OVERRIDE.get(name):
            flags.append('margin=%s' % (margin,))
        report.append((name, t.shape[1], t.shape[0], int((alpha > 0.35).sum()), ' '.join(flags)))
    print('%-28s %5s %5s %8s %s' % ('name', 'w', 'h', 'px', 'NOTES'))
    for r in report:
        print('%-28s %5d %5d %8d %s' % r)
