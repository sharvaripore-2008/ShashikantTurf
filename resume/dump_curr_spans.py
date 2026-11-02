import pymupdf

orig = pymupdf.open(r"C:\Users\Sharvari\.gemini\antigravity\brain\715d7933-e5df-479c-ae89-dd5d28831b99\.user_uploaded\media_1793585200566_8b426f15.pdf")
curr = pymupdf.open(r"c:\Users\Sharvari\OneDrive\Desktop\ShashikantTurf\Sharvari_Pore_Resume.pdf")

print("=== SPANS DUMP CURR ===")
for pno in [0, 1]:
    print(f"\n--- PAGE {pno+1} ---")
    for b in curr[pno].get_text("dict")["blocks"]:
        if "lines" in b:
            for l in b["lines"]:
                for s in l["spans"]:
                    print(f"origin=({round(s['origin'][0], 2)}, {round(s['origin'][1], 2)}) sz={round(s['size'], 2)} font={s['font']} text={repr(s['text'])}")

