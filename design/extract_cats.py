"""마스코트 스프라이트 시트에서 개별 고양이를 배경 투명 PNG로 추출.
- 그리드 셀 단위로 크롭
- 모서리에서 flood-fill로 '배경 흰색만' 투명화 (눈 흰자 등 내부 흰색은 보존)
- 알파 bbox로 오토크롭
"""
from PIL import Image, ImageDraw
import os
import numpy as np
from collections import deque

SENTINEL = (255, 0, 255)  # 배경 마킹용(이미지에 없는 색)
OUT = os.path.join(os.path.dirname(__file__), "mascot-cut")
os.makedirs(OUT, exist_ok=True)


def keep_largest_component(rgba):
    """이웃 셀에서 딸려온 조각 제거: 가장 큰 연결 덩어리만 남긴다(4-연결)."""
    arr = np.array(rgba)
    alpha = arr[:, :, 3] > 0
    H, W = alpha.shape
    visited = np.zeros((H, W), bool)
    best, best_size = None, 0
    for y in range(H):
        row = alpha[y]
        for x in range(W):
            if row[x] and not visited[y, x]:
                q = deque([(y, x)])
                visited[y, x] = True
                comp = [(y, x)]
                while q:
                    cy, cx = q.popleft()
                    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        ny, nx = cy + dy, cx + dx
                        if 0 <= ny < H and 0 <= nx < W and alpha[ny, nx] and not visited[ny, nx]:
                            visited[ny, nx] = True
                            q.append((ny, nx))
                            comp.append((ny, nx))
                if len(comp) > best_size:
                    best_size, best = len(comp), comp
    keep = np.zeros((H, W), bool)
    if best:
        ys, xs = zip(*best)
        keep[np.array(ys), np.array(xs)] = True
    arr[~keep] = (0, 0, 0, 0)
    return Image.fromarray(arr, "RGBA")


def extract(sheet_path, cols, rows, prefix):
    img = Image.open(sheet_path).convert("RGB")
    W, H = img.size
    cw, ch = W / cols, H / rows
    count = 0
    for r in range(rows):
        for c in range(cols):
            box = (int(c * cw), int(r * ch), int((c + 1) * cw), int((r + 1) * ch))
            cell = img.crop(box)
            # 배경이 셀 가장자리에 확실히 닿도록 흰 테두리 2px 추가
            bordered = Image.new("RGB", (cell.width + 4, cell.height + 4), (255, 255, 255))
            bordered.paste(cell, (2, 2))
            # 네 모서리에서 flood-fill → 배경 흰색을 SENTINEL로
            for corner in [(0, 0), (bordered.width - 1, 0), (0, bordered.height - 1),
                           (bordered.width - 1, bordered.height - 1)]:
                ImageDraw.floodfill(bordered, corner, SENTINEL, thresh=40)
            # SENTINEL → 투명, 나머지 불투명
            rgba = bordered.convert("RGBA")
            px = rgba.load()
            for y in range(rgba.height):
                for x in range(rgba.width):
                    if px[x, y][:3] == SENTINEL:
                        px[x, y] = (0, 0, 0, 0)
            # 이웃 셀 조각 제거(가장 큰 덩어리만)
            rgba = keep_largest_component(rgba)
            # 알파 bbox 오토크롭
            bbox = rgba.getbbox()
            if bbox:
                rgba = rgba.crop(bbox)
            # 너무 작으면(빈 셀) 스킵
            if rgba.width < 30 or rgba.height < 30:
                continue
            out = os.path.join(OUT, f"{prefix}_r{r}c{c}.png")
            rgba.save(out)
            count += 1
    return count


d = os.path.dirname(__file__)
n1 = extract(os.path.join(d, "mascot-raw", "cats-set1.jpg"), 5, 4, "s1")
n2 = extract(os.path.join(d, "mascot-raw", "cats-set2.jpg"), 6, 4, "s2")
print(f"set1: {n1}개, set2: {n2}개 추출 완료 → {OUT}")
