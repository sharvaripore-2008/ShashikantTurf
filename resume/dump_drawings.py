import pymupdf

pdf_path = r"C:\Users\Sharvari\.gemini\antigravity\brain\715d7933-e5df-479c-ae89-dd5d28831b99\.user_uploaded\media_1793585200566_8b426f15.pdf"
doc = pymupdf.open(pdf_path)

for pno, page in enumerate(doc):
    print(f"\n==================== PAGE {pno+1} DRAWINGS ====================")
    for idx, d in enumerate(page.get_drawings()):
        for item in d["items"]:
            if item[0] == "l":
                p1, p2 = item[1], item[2]
                print(f"Line {idx}: from ({round(p1.x, 2)}, {round(p1.y, 2)}) to ({round(p2.x, 2)}, {round(p2.y, 2)}) color={d.get('color')} width={d.get('width')}")
            elif item[0] == "re":
                r = item[1]
                print(f"Rect {idx}: {r} color={d.get('color')} width={d.get('width')}")

