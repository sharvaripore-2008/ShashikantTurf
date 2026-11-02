import os
import pymupdf

def create_resume():
    doc = pymupdf.open()
    
    # Standard A4 size
    width, height = 595.2756, 841.8898
    
    # Colors
    c_dark = (32/255, 33/255, 36/255)    # #202124
    c_grey = (95/255, 99/255, 104/255)   # #5f6368
    c_blue = (26/255, 115/255, 232/255)  # #1a73e8
    c_line = (218/255, 220/255, 224/255) # #dadce0 (0.8549, 0.8627, 0.8784)
    
    left_m = 57.02
    right_m = 538.25
    table_left = 70.87
    table_right = 524.41
    
    # Helper to draw horizontal line
    def draw_line(page, x1, y, x2, stroke_w=0.65):
        shape = page.new_shape()
        shape.draw_line(pymupdf.Point(x1, y), pymupdf.Point(x2, y))
        shape.finish(color=c_line, width=stroke_w)
        shape.commit()

    # Helper for footer
    def add_footer(page, pno):
        draw_line(page, 51.02, 802.20, 544.25, stroke_w=0.60)
        page.insert_text(pymupdf.Point(51.02, 817.0), "SHARVARI PORE", fontsize=7.5, fontname="helv", color=c_grey)
        page.insert_text(pymupdf.Point(540.1, 817.0), str(pno), fontsize=7.5, fontname="helv", color=c_grey)

    # ==========================================
    # PAGE 1
    # ==========================================
    p1 = doc.new_page(width=width, height=height)
    
    # 1. Header Name
    p1.insert_text(pymupdf.Point(left_m, 72.0), "SHARVARI PORE", fontsize=25.0, fontname="hebo", color=c_dark)
    
    # 2. Subtitle
    p1.insert_text(pymupdf.Point(left_m, 90.0), "Diploma Student — Information Technology | Frontend Development", fontsize=10.0, fontname="helv", color=c_grey)
    
    # 3. Contacts
    p1.insert_text(pymupdf.Point(70.87, 111.0), "Mumbai, Maharashtra, India", fontsize=8.6, fontname="helv", color=c_dark)
    p1.insert_text(pymupdf.Point(212.0, 111.0), "9082798970", fontsize=8.6, fontname="helv", color=c_dark)
    p1.insert_text(pymupdf.Point(310.0, 111.0), "sharvaripore11@gmail.com", fontsize=8.6, fontname="helv", color=c_dark)
    
    # 4. PROFILE
    p1.insert_text(pymupdf.Point(left_m, 138.5), "PROFILE", fontsize=10.3, fontname="hebo", color=c_dark)
    draw_line(p1, left_m, 147.17, right_m, stroke_w=0.65)
    
    prof_lines = [
        "Information Technology diploma student with foundational knowledge of frontend development, programming, databases",
        "and version control. Built a turf booking web project using HTML, CSS and JavaScript. Seeking an IT internship",
        "to apply technical skills, learn from experienced developers and contribute to practical software projects."
    ]
    y = 160.0
    for pl in prof_lines:
        p1.insert_text(pymupdf.Point(left_m, y), pl, fontsize=9.0, fontname="helv", color=c_dark)
        y += 12.6
        
    # 5. TECHNICAL SKILLS
    y += 12.0
    p1.insert_text(pymupdf.Point(left_m, y), "TECHNICAL SKILLS", fontsize=10.3, fontname="hebo", color=c_dark)
    draw_line(p1, left_m, y + 8.5, right_m, stroke_w=0.65)
    
    # Table rows (Without 'Other' row)
    skills = [
        ("Web", "HTML5, CSS3, JavaScript, responsive web design"),
        ("Programming", "C, C++, Java, Python; object-oriented programming"),
        ("Database", "SQL, DBMS"),
        ("Computer Science", "Data structures, computer networks"),
        ("Developer Tools", "Visual Studio Code, Git, GitHub")
    ]
    
    row_y = y + 23.0
    for label, val in skills:
        p1.insert_text(pymupdf.Point(table_left, row_y), label, fontsize=8.5, fontname="hebo", color=c_dark)
        p1.insert_text(pymupdf.Point(175.7, row_y), val, fontsize=9.0, fontname="helv", color=c_dark)
        draw_line(p1, table_left, row_y + 5.5, table_right, stroke_w=0.45)
        row_y += 20.6
        
    # 6. PROJECT
    proj_y = row_y + 12.0
    p1.insert_text(pymupdf.Point(left_m, proj_y), "PROJECT", fontsize=10.3, fontname="hebo", color=c_dark)
    draw_line(p1, left_m, proj_y + 8.5, right_m, stroke_w=0.65)
    
    p1.insert_text(pymupdf.Point(left_m, proj_y + 24.0), "Shashikant Turf — Turf Booking Website", fontsize=12.0, fontname="hebo", color=c_dark)
    p1.insert_text(pymupdf.Point(left_m, proj_y + 36.5), "HTML • CSS • JavaScript", fontsize=8.2, fontname="helv", color=c_grey)
    
    # Link
    link_rect = pymupdf.Rect(left_m, proj_y + 40.0, left_m + 195.0, proj_y + 52.0)
    p1.insert_text(pymupdf.Point(left_m, proj_y + 49.0), "https://starlit-trifle-eb16db.netlify.app", fontsize=8.4, fontname="helv", color=c_blue)
    p1.insert_link({
        "kind": pymupdf.LINK_URI,
        "from": link_rect,
        "uri": "https://starlit-trifle-eb16db.netlify.app"
    })
    
    bullets = [
        "•  Created a web-based concept to simplify access to sports turf information and booking services.",
        "•  Designed a user-friendly interface for players and administrators with responsive layouts.",
        "•  Planned features for turf slot scheduling, day/night floodlight views, notices, and booking management.",
        "•  Focused on making routine sports ground booking activities easier to access online."
    ]
    by = proj_y + 64.0
    for b in bullets:
        p1.insert_text(pymupdf.Point(60.0, by), b, fontsize=8.8, fontname="helv", color=c_dark)
        by += 15.1
        
    # 7. EDUCATION
    edu_y = by + 14.0
    p1.insert_text(pymupdf.Point(left_m, edu_y), "EDUCATION", fontsize=10.3, fontname="hebo", color=c_dark)
    draw_line(p1, left_m, edu_y + 8.5, right_m, stroke_w=0.65)
    
    p1.insert_text(pymupdf.Point(table_left, edu_y + 24.0), "Diploma in Information Technology", fontsize=9.0, fontname="hebo", color=c_dark)
    p1.insert_text(pymupdf.Point(224.0, edu_y + 24.0), "— Currently pursuing", fontsize=9.0, fontname="helv", color=c_dark)
    draw_line(p1, table_left, edu_y + 30.0, table_right, stroke_w=0.45)
    
    p1.insert_text(pymupdf.Point(table_left, edu_y + 43.0), "SSC (10th)", fontsize=9.0, fontname="hebo", color=c_dark)
    p1.insert_text(pymupdf.Point(120.0, edu_y + 43.0), "— Maharashtra State Board, completed", fontsize=9.0, fontname="helv", color=c_dark)
    draw_line(p1, table_left, edu_y + 49.0, table_right, stroke_w=0.45)
    
    add_footer(p1, 1)
    
    # ==========================================
    # PAGE 2
    # ==========================================
    p2 = doc.new_page(width=width, height=height)
    
    # 1. Header
    p2.insert_text(pymupdf.Point(left_m, 68.0), "ADDITIONAL INFORMATION", fontsize=18.0, fontname="hebo", color=c_dark)
    p2.insert_text(pymupdf.Point(left_m, 84.0), "Relevant strengths and career direction", fontsize=10.0, fontname="helv", color=c_grey)
    
    # 2. CORE STRENGTHS
    p2.insert_text(pymupdf.Point(left_m, 106.0), "CORE STRENGTHS", fontsize=10.3, fontname="hebo", color=c_dark)
    draw_line(p2, left_m, 115.17, right_m, stroke_w=0.65)
    
    strengths = [
        ("Problem solving", "Logical approach to tasks and practical problem-solving."),
        ("Learning mindset", "Willingness to learn tools, workflows and new technologies."),
        ("Teamwork", "Ready to collaborate, communicate and contribute to shared work."),
        ("Creativity", "Visual creativity through interface design and media editing."),
        ("Time management", "Organising tasks and working toward deadlines."),
        ("Attention to detail", "Focus on clear layouts, usability and accurate execution.")
    ]
    
    sy = 134.5
    for label, val in strengths:
        p2.insert_text(pymupdf.Point(table_left, sy), label, fontsize=8.5, fontname="hebo", color=c_dark)
        p2.insert_text(pymupdf.Point(189.9, sy), val, fontsize=9.0, fontname="helv", color=c_dark)
        draw_line(p2, table_left, sy + 5.5, table_right, stroke_w=0.45)
        sy += 23.6
        
    # 3. LANGUAGES
    lang_y = sy + 14.0
    p2.insert_text(pymupdf.Point(left_m, lang_y), "LANGUAGES", fontsize=10.3, fontname="hebo", color=c_dark)
    draw_line(p2, left_m, lang_y + 8.5, right_m, stroke_w=0.65)
    p2.insert_text(pymupdf.Point(left_m, lang_y + 24.0), "English • Hindi • Marathi", fontsize=9.0, fontname="helv", color=c_dark)
    
    # 4. CAREER INTERESTS
    ci_y = lang_y + 42.0
    p2.insert_text(pymupdf.Point(left_m, ci_y), "CAREER INTERESTS", fontsize=10.3, fontname="hebo", color=c_dark)
    draw_line(p2, left_m, ci_y + 8.5, right_m, stroke_w=0.65)
    p2.insert_text(pymupdf.Point(left_m, ci_y + 24.0), "Frontend Development • Web Development • Software Development • Application Development • IT Internship", fontsize=9.0, fontname="helv", color=c_dark)
    
    # 5. INTERNSHIP OBJECTIVE
    io_y = ci_y + 42.0
    p2.insert_text(pymupdf.Point(left_m, io_y), "INTERNSHIP OBJECTIVE", fontsize=10.3, fontname="hebo", color=c_dark)
    draw_line(p2, left_m, io_y + 8.5, right_m, stroke_w=0.65)
    
    io_lines = [
        "Looking for an opportunity to strengthen practical development skills, contribute to real-world tasks, and learn",
        "professional coding and collaboration practices. Open to feedback and committed to improving through hands-on",
        "experience."
    ]
    iy = io_y + 24.0
    for iol in io_lines:
        p2.insert_text(pymupdf.Point(left_m, iy), iol, fontsize=9.0, fontname="helv", color=c_dark)
        iy += 12.6
        
    # 6. PROJECT LINK
    pl_y = iy + 14.0
    p2.insert_text(pymupdf.Point(left_m, pl_y), "PROJECT LINK", fontsize=10.3, fontname="hebo", color=c_dark)
    draw_line(p2, left_m, pl_y + 8.5, right_m, stroke_w=0.65)
    
    p2.insert_text(pymupdf.Point(left_m, pl_y + 23.5), "Shashikant Turf — live project", fontsize=8.5, fontname="hebo", color=c_dark)
    
    pl_rect = pymupdf.Rect(left_m, pl_y + 27.0, left_m + 195.0, pl_y + 39.0)
    p2.insert_text(pymupdf.Point(left_m, pl_y + 35.0), "https://starlit-trifle-eb16db.netlify.app", fontsize=8.4, fontname="helv", color=c_blue)
    p2.insert_link({
        "kind": pymupdf.LINK_URI,
        "from": pl_rect,
        "uri": "https://starlit-trifle-eb16db.netlify.app"
    })
    
    add_footer(p2, 2)
    
    # Save outputs
    out_dir = r"c:\Users\Sharvari\OneDrive\Desktop\ShashikantTurf\resume"
    out_pdf = os.path.join(out_dir, "Sharvari_Pore_Resume.pdf")
    root_pdf = r"c:\Users\Sharvari\OneDrive\Desktop\ShashikantTurf\Sharvari_Pore_Resume.pdf"
    
    doc.save(out_pdf)
    doc.save(root_pdf)
    print(f"Generated PDF saved to:\n  1. {out_pdf}\n  2. {root_pdf}")
    
    # Save render preview
    for idx, page in enumerate(doc):
        pix = page.get_pixmap(dpi=200)
        p_img = os.path.join(out_dir, f"exact_page_{idx+1}.png")
        pix.save(p_img)
        print(f"Preview page {idx+1} saved to {p_img}")

if __name__ == "__main__":
    create_resume()
