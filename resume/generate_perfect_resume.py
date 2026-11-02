import os
import pymupdf

def generate_perfect_resume():
    doc = pymupdf.open()
    
    # Page size: A4 portrait
    width, height = 595.2756, 841.8898
    
    # Fonts
    font_reg = pymupdf.Font("helv")
    font_bold = pymupdf.Font("hebo")
    
    # Colors
    c_dark = (32/255, 33/255, 36/255)       # #202124 (0.1255, 0.1294, 0.1412)
    c_grey = (95/255, 99/255, 104/255)      # #5f6368 (0.3725, 0.3882, 0.4078)
    c_blue = (26/255, 115/255, 232/255)     # #1a73e8 (0.1020, 0.4510, 0.9098)
    c_line = (218/255, 220/255, 224/255)    # #dadce0 (0.8549, 0.8627, 0.8784)
    
    left_m = 57.02
    right_m = 538.25
    table_left = 70.87
    table_right = 524.41
    
    def draw_line(page, x1, y, x2, stroke_w=0.65, color=c_line):
        shape = page.new_shape()
        shape.draw_line(pymupdf.Point(x1, y), pymupdf.Point(x2, y))
        shape.finish(color=color, width=stroke_w)
        shape.commit()
        
    def add_link(page, x, y_baseline, text, uri, font, size):
        w = font.text_length(text, fontsize=size)
        # In the original template:
        # text baseline was y=413.27, underline was y=414.32 (which is baseline + 1.05)
        underline_y = y_baseline + 1.05
        draw_line(page, x, underline_y, x + w, stroke_w=1.0, color=c_blue)
        
        # Link rect for clickability
        rect = pymupdf.Rect(x, y_baseline - size + 1.0, x + w, underline_y + 2.0)
        page.insert_link({
            "kind": pymupdf.LINK_URI,
            "from": rect,
            "uri": uri
        })

    def add_footer(page, pno_str):
        # Line from 51.02 to 544.25 at y=802.20, width=0.60
        draw_line(page, 51.02, 802.20, 544.25, stroke_w=0.60, color=c_line)
        page.insert_text(pymupdf.Point(51.02, 817.80), "SHARVARI PORE", fontsize=7.5, fontname="helv", color=c_grey)
        page.insert_text(pymupdf.Point(540.08, 817.80), pno_str, fontsize=7.5, fontname="helv", color=c_grey)

    # ==========================================
    # PAGE 1
    # ==========================================
    p1 = doc.new_page(width=width, height=height)
    
    # 1. Header Name
    p1.insert_text(pymupdf.Point(57.02, 73.52), "SHARVARI PORE", fontsize=25.0, fontname="hebo", color=c_dark)
    
    # 2. Subtitle
    p1.insert_text(pymupdf.Point(57.02, 90.52), "Diploma Student — Information Technology | Frontend Development", fontsize=10.0, fontname="helv", color=c_grey)
    
    # 3. Contacts
    p1.insert_text(pymupdf.Point(70.87, 111.12), "Mumbai, Maharashtra, India", fontsize=8.6, fontname="helv", color=c_dark)
    p1.insert_text(pymupdf.Point(209.76, 111.12), "9082798970", fontsize=8.6, fontname="helv", color=c_dark)
    p1.insert_text(pymupdf.Point(308.98, 111.12), "sharvaripore11@gmail.com", fontsize=8.6, fontname="helv", color=c_dark)
    
    # 4. PROFILE
    p1.insert_text(pymupdf.Point(57.02, 138.82), "PROFILE", fontsize=10.3, fontname="hebo", color=c_dark)
    draw_line(p1, 57.02, 147.17, 538.25, stroke_w=0.65)
    
    p1.insert_text(pymupdf.Point(57.02, 161.17), "Information Technology diploma student with foundational knowledge of frontend development, programming, databases", fontsize=9.0, fontname="helv", color=c_dark)
    p1.insert_text(pymupdf.Point(57.02, 173.77), "and version control. Built a turf booking web project using HTML, CSS and JavaScript. Seeking an IT internship", fontsize=9.0, fontname="helv", color=c_dark)
    p1.insert_text(pymupdf.Point(57.02, 186.37), "to apply technical skills, learn from experienced developers and contribute to practical software projects.", fontsize=9.0, fontname="helv", color=c_dark)
    
    # 5. TECHNICAL SKILLS
    p1.insert_text(pymupdf.Point(57.02, 207.27), "TECHNICAL SKILLS", fontsize=10.3, fontname="hebo", color=c_dark)
    draw_line(p1, 57.02, 215.62, 538.25, stroke_w=0.65)
    
    skills = [
        ("Web", "HTML5, CSS3, JavaScript, responsive web design", 234.12, 234.62, 241.22),
        ("Programming", "C, C++, Java, Python; object-oriented programming", 254.72, 255.22, 261.82),
        ("Database", "SQL, DBMS", 275.32, 275.82, 282.42),
        ("Computer Science", "Data structures, computer networks", 295.92, 296.42, 303.02),
        ("Developer Tools", "Visual Studio Code, Git, GitHub", 316.52, 317.02, 323.62),
    ]
    for label, val, y_lbl, y_val, y_line in skills:
        p1.insert_text(pymupdf.Point(table_left, y_lbl), label, fontsize=8.5, fontname="hebo", color=c_dark)
        p1.insert_text(pymupdf.Point(175.75, y_val), val, fontsize=9.0, fontname="helv", color=c_dark)
        draw_line(p1, table_left, y_line, table_right, stroke_w=0.45)
        
    # 6. PROJECT (Shifted up by 20.60 pt due to removal of 'Other' row)
    delta = 20.60
    proj_y = 365.52 - delta # 344.92
    p1.insert_text(pymupdf.Point(57.02, proj_y), "PROJECT", fontsize=10.3, fontname="hebo", color=c_dark)
    draw_line(p1, 57.02, 373.87 - delta, 538.25, stroke_w=0.65)
    
    # Project title & tags
    p1.insert_text(pymupdf.Point(57.02, 390.87 - delta), "Shashikant Turf — Turf Booking Website", fontsize=12.0, fontname="hebo", color=c_dark)
    p1.insert_text(pymupdf.Point(57.02, 402.07 - delta), "HTML • CSS • JavaScript", fontsize=8.2, fontname="helv", color=c_grey)
    
    # Project Link
    link_url = "https://starlit-trifle-eb16db.netlify.app"
    p1.insert_text(pymupdf.Point(57.02, 413.27 - delta), link_url, fontsize=8.4, fontname="helv", color=c_blue)
    add_link(p1, 57.02, 413.27 - delta, link_url, link_url, font_reg, 8.4)
    
    # Bullets
    bullets = [
        "• Created a web-based concept to simplify access to sports turf information and booking services.",
        "• Designed a user-friendly interface for players and administrators with responsive layouts.",
        "• Planned features for turf slot scheduling, day/night floodlight views, notices, and booking management.",
        "• Focused on making routine sports ground booking activities easier to access online."
    ]
    bullet_origins = [
        427.67 - delta,
        442.77 - delta,
        457.87 - delta,
        472.97 - delta
    ]
    for b_text, by in zip(bullets, bullet_origins):
        p1.insert_text(pymupdf.Point(60.02, by), b_text, fontsize=8.8, fontname="helv", color=c_dark)
        
    # 7. EDUCATION
    edu_y = 502.57 - delta
    p1.insert_text(pymupdf.Point(57.02, edu_y), "EDUCATION", fontsize=10.3, fontname="hebo", color=c_dark)
    draw_line(p1, 57.02, 510.92 - delta, 538.25, stroke_w=0.65)
    
    # Row 1 (Diploma)
    p1.insert_text(pymupdf.Point(table_left, 527.92 - delta), "Diploma in Information Technology", fontsize=9.0, fontname="hebo", color=c_dark)
    p1.insert_text(pymupdf.Point(221.89, 527.92 - delta), " — Currently pursuing", fontsize=9.0, fontname="helv", color=c_dark)
    draw_line(p1, table_left, 534.52 - delta, table_right, stroke_w=0.45)
    
    # Row 2 (SSC)
    p1.insert_text(pymupdf.Point(table_left, 546.52 - delta), "SSC (10th)", fontsize=9.0, fontname="hebo", color=c_dark)
    p1.insert_text(pymupdf.Point(116.37, 546.52 - delta), " — Maharashtra State Board, completed", fontsize=9.0, fontname="helv", color=c_dark)
    draw_line(p1, table_left, 553.12 - delta, table_right, stroke_w=0.45)
    
    add_footer(p1, "1")
    
    # ==========================================
    # PAGE 2
    # ==========================================
    p2 = doc.new_page(width=width, height=height)
    
    # 1. Header
    p2.insert_text(pymupdf.Point(57.02, 66.52), "ADDITIONAL INFORMATION", fontsize=18.0, fontname="hebo", color=c_dark)
    p2.insert_text(pymupdf.Point(57.02, 84.52), "Relevant strengths and career direction", fontsize=10.0, fontname="helv", color=c_grey)
    
    # 2. CORE STRENGTHS
    p2.insert_text(pymupdf.Point(57.02, 106.82), "CORE STRENGTHS", fontsize=10.3, fontname="hebo", color=c_dark)
    draw_line(p2, 57.02, 115.17, 538.25, stroke_w=0.65)
    
    strengths = [
        ("Problem solving", "Logical approach to tasks and practical problem-solving.", 135.67, 136.17, 143.77),
        ("Learning mindset", "Willingness to learn tools, workflows and new technologies.", 159.27, 159.77, 167.37),
        ("Teamwork", "Ready to collaborate, communicate and contribute to shared work.", 182.87, 183.37, 190.97),
        ("Creativity", "Visual creativity through interface design and media editing.", 206.47, 206.97, 214.57),
        ("Time management", "Organising tasks and working toward deadlines.", 230.07, 230.57, 238.17),
        ("Attention to detail", "Focus on clear layouts, usability and accurate execution.", 253.67, 254.17, 261.77)
    ]
    for label, val, y_lbl, y_val, y_line in strengths:
        p2.insert_text(pymupdf.Point(table_left, y_lbl), label, fontsize=8.5, fontname="hebo", color=c_dark)
        p2.insert_text(pymupdf.Point(189.92, y_val), val, fontsize=9.0, fontname="helv", color=c_dark)
        draw_line(p2, table_left, y_line, table_right, stroke_w=0.45)
        
    # 3. LANGUAGES
    p2.insert_text(pymupdf.Point(57.02, 287.07), "LANGUAGES", fontsize=10.3, fontname="hebo", color=c_dark)
    draw_line(p2, 57.02, 295.42, 538.25, stroke_w=0.65)
    p2.insert_text(pymupdf.Point(57.02, 309.42), "English • Hindi • Marathi", fontsize=9.0, fontname="helv", color=c_dark)
    
    # 4. CAREER INTERESTS
    p2.insert_text(pymupdf.Point(57.02, 330.32), "CAREER INTERESTS", fontsize=10.3, fontname="hebo", color=c_dark)
    draw_line(p2, 57.02, 338.67, 538.25, stroke_w=0.65)
    p2.insert_text(pymupdf.Point(57.02, 352.67), "Frontend Development • Web Development • Software Development • Application Development • IT Internship", fontsize=9.0, fontname="helv", color=c_dark)
    
    # 5. INTERNSHIP OBJECTIVE
    p2.insert_text(pymupdf.Point(57.02, 373.57), "INTERNSHIP OBJECTIVE", fontsize=10.3, fontname="hebo", color=c_dark)
    draw_line(p2, 57.02, 381.92, 538.25, stroke_w=0.65)
    p2.insert_text(pymupdf.Point(57.02, 395.92), "Looking for an opportunity to strengthen practical development skills, contribute to real-world tasks, and learn", fontsize=9.0, fontname="helv", color=c_dark)
    p2.insert_text(pymupdf.Point(57.02, 408.52), "professional coding and collaboration practices. Open to feedback and committed to improving through hands-on", fontsize=9.0, fontname="helv", color=c_dark)
    p2.insert_text(pymupdf.Point(57.02, 421.12), "experience.", fontsize=9.0, fontname="helv", color=c_dark)
    
    # 6. PROJECT LINK
    p2.insert_text(pymupdf.Point(57.02, 453.02), "PROJECT LINK", fontsize=10.3, fontname="hebo", color=c_dark)
    draw_line(p2, 57.02, 461.37, 538.25, stroke_w=0.65)
    p2.insert_text(pymupdf.Point(57.02, 474.87), "Shashikant Turf — live project", fontsize=8.5, fontname="hebo", color=c_dark)
    
    p2.insert_text(pymupdf.Point(57.02, 485.77), link_url, fontsize=8.4, fontname="helv", color=c_blue)
    add_link(p2, 57.02, 485.77, link_url, link_url, font_reg, 8.4)
    
    add_footer(p2, "2")
    
    # Save outputs
    out_dir = r"c:\Users\Sharvari\OneDrive\Desktop\ShashikantTurf\resume"
    out_pdf = os.path.join(out_dir, "Sharvari_Pore_Resume.pdf")
    root_pdf = r"c:\Users\Sharvari\OneDrive\Desktop\ShashikantTurf\Sharvari_Pore_Resume.pdf"
    
    doc.save(out_pdf)
    doc.save(root_pdf)
    print(f"Generated PDF saved successfully to:\n  1. {out_pdf}\n  2. {root_pdf}")
    
    # Render preview images
    for idx, page in enumerate(doc):
        pix = page.get_pixmap(dpi=200)
        img_p = os.path.join(out_dir, f"sharvari_page_{idx+1}.png")
        pix.save(img_p)
        print(f"Preview image saved: {img_p}")

if __name__ == "__main__":
    generate_perfect_resume()

