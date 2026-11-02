import pymupdf

orig = pymupdf.open(r"C:\Users\Sharvari\.gemini\antigravity\brain\715d7933-e5df-479c-ae89-dd5d28831b99\.user_uploaded\media_1793585200566_8b426f15.pdf")

for pno, page in enumerate(orig):
    print(f"\n=== PAGE {pno+1} SPAN ORIGINS ===")
    for b in page.get_text("dict")["blocks"]:
        if "lines" in b:
            for l in b["lines"]:
                for s in l["spans"]:
                    print(f"origin=({round(s['origin'][0], 2)}, {round(s['origin'][1], 2)}) font={s['font']} sz={round(s['size'], 2)} color={hex(s['color'])} text={repr(s['text'])}")

