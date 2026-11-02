import pymupdf

pdf_path = r"C:\Users\Sharvari\.gemini\antigravity\brain\715d7933-e5df-479c-ae89-dd5d28831b99\.user_uploaded\media_1793585200566_8b426f15.pdf"
doc = pymupdf.open(pdf_path)

for pno, page in enumerate(doc):
    print(f"\n==================== PAGE {pno+1} ====================")
    td = page.get_text("dict")
    for b in td["blocks"]:
        if "lines" in b:
            for l in b["lines"]:
                line_str = " ".join([s["text"] for s in l["spans"]])
                s0 = l["spans"][0]
                bbox = [round(x, 1) for x in l["bbox"]]
                print(f"y={bbox[1]} font={s0['font']} size={round(s0['size'], 1)} color={hex(s0['color'])} :: {line_str}")
    
    # Check drawings (lines, borders)
    drawings = page.get_drawings()
    print(f"Drawings count: {len(drawings)}")
    for d in drawings[:10]:
        print("Drawing:", d.get("items"), "rect:", d.get("rect"), "color:", d.get("color"), "width:", d.get("width"))
