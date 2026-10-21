"""Generate the extension icons (icons/icon-16.png, icon-48.png, icon-128.png).

Requires Pillow and a font with CJK glyphs (default: WenQuanYi Zen Hei).
Usage: python3 scripts/make_icons.py [path/to/font.ttc]
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

FONT = sys.argv[1] if len(sys.argv) > 1 else "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc"
OUT = Path(__file__).resolve().parent.parent / "icons"
GREEN = (76, 175, 80, 255)  # matches the popup toggle
SCALE = 4  # draw large, then downsample for smooth edges


def render(size):
    big = size * SCALE
    img = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((0, 0, big - 1, big - 1), radius=big * 0.22, fill=GREEN)
    font = ImageFont.truetype(FONT, int(big * 0.68))
    draw.text((big / 2, big / 2), "拼", font=font, fill="white", anchor="mm")
    return img.resize((size, size), Image.LANCZOS)


OUT.mkdir(exist_ok=True)
for s in (16, 48, 128):
    render(s).save(OUT / f"icon-{s}.png")
    print("wrote", OUT / f"icon-{s}.png")
