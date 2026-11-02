import pymupdf

pdf_path = r"C:\Users\Sharvari\.gemini\antigravity\brain\715d7933-e5df-479c-ae89-dd5d28831b99\.user_uploaded\media_1793585200566_8b426f15.pdf"
doc = pymupdf.open(pdf_path)

for pno, p in enumerate(doc):
    print(f"\n==================== PAGE {pno+1} ====================")
    for b in p.get_text("dict")["blocks"]:
        if "lines" in b:
            for l in b["lines"]:
                spans_info = []
                for s in l["spans"]:
                    spans_info.append(f"[x={round(s['bbox'][0],1)}, y={round(s['bbox'][1],1)}, font={s['font']}, sz={round(s['size'],1)}, c={hex(s['color'])}] '{s['text']}'")
                print(" | ".join(spans_info))

