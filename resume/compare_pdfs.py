import pymupdf

orig = pymupdf.open(r"C:\Users\Sharvari\.gemini\antigravity\brain\715d7933-e5df-479c-ae89-dd5d28831b99\.user_uploaded\media_1793585200566_8b426f15.pdf")
curr = pymupdf.open(r"c:\Users\Sharvari\OneDrive\Desktop\ShashikantTurf\Sharvari_Pore_Resume.pdf")

print("=== PAGE 1 COMPARISON ===")
print("ORIG DRAWINGS count:", len(orig[0].get_drawings()))
print("CURR DRAWINGS count:", len(curr[0].get_drawings()))

print("\n--- ORIG PAGE 1 TEXT BLOCKS ---")
for b in orig[0].get_text("blocks"):
    print(f"y={round(b[1], 1)}: {repr(b[4].strip())}")

print("\n--- CURR PAGE 1 TEXT BLOCKS ---")
for b in curr[0].get_text("blocks"):
    print(f"y={round(b[1], 1)}: {repr(b[4].strip())}")

print("\n=== PAGE 2 COMPARISON ===")
print("ORIG DRAWINGS count:", len(orig[1].get_drawings()))
print("CURR DRAWINGS count:", len(curr[1].get_drawings()))

print("\n--- ORIG PAGE 2 TEXT BLOCKS ---")
for b in orig[1].get_text("blocks"):
    print(f"y={round(b[1], 1)}: {repr(b[4].strip())}")

print("\n--- CURR PAGE 2 TEXT BLOCKS ---")
for b in curr[1].get_text("blocks"):
    print(f"y={round(b[1], 1)}: {repr(b[4].strip())}")

