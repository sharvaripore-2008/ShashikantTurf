import os
import subprocess
import pymupdf

base_dir = os.path.dirname(os.path.abspath(__file__))
html_path = os.path.join(base_dir, "Sharvari_Pore_Resume.html")
pdf_path = os.path.join(base_dir, "Sharvari_Pore_Resume.pdf")
edge_exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

print("HTML Path:", html_path)
print("Target PDF Path:", pdf_path)

user_data_dir = os.path.join(base_dir, "edge_temp_profile")
os.makedirs(user_data_dir, exist_ok=True)

cmd = [
    edge_exe,
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    f"--user-data-dir={user_data_dir}",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_path}",
    html_path
]

print("Running Edge headless print-to-pdf...")
result = subprocess.run(cmd, capture_output=True, text=True)
print("Exit code:", result.returncode)

if os.path.exists(pdf_path):
    doc = pymupdf.open(pdf_path)
    print(f"PDF Successfully created! Pages: {len(doc)}, Size: {os.path.getsize(pdf_path)} bytes")
    
    # Render preview images
    for i, page in enumerate(doc):
        pix = page.get_pixmap(dpi=150)
        img_path = os.path.join(base_dir, f"preview_page_{i+1}.png")
        pix.save(img_path)
        print(f"Saved preview: {img_path}")
else:
    print("PDF creation failed:", result.stderr)
