import pymupdf

orig = pymupdf.open(r"C:\Users\Sharvari\.gemini\antigravity\brain\715d7933-e5df-479c-ae89-dd5d28831b99\.user_uploaded\media_1793585200566_8b426f15.pdf")
curr = pymupdf.open(r"c:\Users\Sharvari\OneDrive\Desktop\ShashikantTurf\Sharvari_Pore_Resume.pdf")

print("=== VERIFY PAGE 1 ===")
print("Drawings in orig:", len(orig[0].get_drawings()), "Drawings in curr:", len(curr[0].get_drawings()))
print("Curr Page 1 Links:", curr[0].get_links())

print("\n=== VERIFY PAGE 2 ===")
print("Drawings in orig:", len(orig[1].get_drawings()), "Drawings in curr:", len(curr[1].get_drawings()))
print("Curr Page 2 Links:", curr[1].get_links())

# Check all drawings in curr
for pno in [0, 1]:
    print(f"\n--- Drawings in curr page {pno+1} ---")
    for d in curr[pno].get_drawings():
        item = d["items"][0]
        color = [round(c, 2) for c in d["color"]] if d.get("color") else None
        print(f"  Line ({round(item[1].x, 2)}, {round(item[1].y, 2)}) -> ({round(item[2].x, 2)}, {round(item[2].y, 2)}) w={round(d['width'], 2)} c={color}")

