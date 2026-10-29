import os
import base64
import subprocess
import pymupdf

def get_base64_img(rel_path):
    full_path = os.path.join(os.path.dirname(__file__), rel_path)
    if not os.path.exists(full_path):
        print(f"Warning: {full_path} not found!")
        return ""
    with open(full_path, "rb") as f:
        data = f.read()
    ext = os.path.splitext(full_path)[1].replace('.', '')
    if ext == 'jpg': ext = 'jpeg'
    return f"data:image/{ext};base64,{base64.b64encode(data).decode('utf-8')}"

os.makedirs('report', exist_ok=True)

gpm_logo = get_base64_img('report_assets/gpm_logo.png')
waterfall_img = get_base64_img('report_assets/waterfall_3.png')
fig8_1 = get_base64_img('report_assets/fig8_1_flowchart.png')
fig8_2 = get_base64_img('report_assets/fig8_2_flowchart.png')
fig9_1 = get_base64_img('report_assets/fig9_1_explorer.png')
fig9_2 = get_base64_img('report_assets/fig9_2_home.png')
fig9_3 = get_base64_img('report_assets/fig9_3_booking.png')
fig9_4 = get_base64_img('report_assets/fig9_4_admin.png')

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Shashikant Turf Website - Project Report</title>
<style>
  @page {{
    size: A4 portrait;
    margin: 0;
  }}
  * {{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }}
  body {{
    background-color: #e2e8f0;
    font-family: 'Times New Roman', Times, serif;
    color: #000000;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }}
  .page {{
    width: 210mm;
    height: 297mm;
    margin: 20px auto;
    background: #ffffff;
    padding: 14mm 16mm;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    box-sizing: border-box;
    page-break-after: always;
    break-after: page;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }}
  .page-border {{
    border: 1.5px solid #000000;
    width: 100%;
    height: 100%;
    padding: 36px 42px;
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: column;
  }}
  .page-num {{
    position: absolute;
    bottom: 22px;
    right: 32px;
    font-size: 11pt;
    font-weight: normal;
  }}
  h1.doc-title {{
    font-size: 20pt;
    text-align: center;
    font-weight: bold;
    letter-spacing: 0.5px;
    margin-top: 35px;
    margin-bottom: 12px;
  }}
  h2.sub-title {{
    font-size: 13pt;
    text-align: center;
    font-weight: bold;
    margin-bottom: 25px;
  }}
  p.award-text {{
    text-align: center;
    font-size: 11.5pt;
    line-height: 1.5;
    margin-bottom: 40px;
  }}
  .center-logo {{
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 30px 0;
  }}
  .center-logo img {{
    max-width: 140px;
    height: auto;
  }}
  .author-block {{
    margin-top: auto;
    margin-bottom: 35px;
    text-align: center;
  }}
  .author-block p {{
    font-size: 11.5pt;
    line-height: 1.6;
  }}
  .author-block strong {{
    font-size: 12pt;
  }}
  .inst-block {{
    text-align: center;
    margin-bottom: 15px;
  }}
  .inst-block p {{
    font-size: 11.5pt;
    line-height: 1.5;
  }}
  .inst-block strong {{
    font-size: 12pt;
    letter-spacing: 0.5px;
  }}

  /* Headings for chapters */
  h2.chapter-heading {{
    font-size: 15pt;
    text-align: center;
    font-weight: bold;
    text-decoration: underline;
    letter-spacing: 0.5px;
    margin-top: 15px;
    margin-bottom: 30px;
  }}
  h3.section-heading {{
    font-size: 12pt;
    font-weight: bold;
    text-decoration: underline;
    margin-top: 18px;
    margin-bottom: 10px;
  }}
  p.body-text {{
    font-size: 11pt;
    line-height: 1.55;
    text-align: justify;
    margin-bottom: 12px;
    text-justify: inter-word;
  }}
  ul.bullet-list {{
    margin-left: 20px;
    margin-bottom: 12px;
  }}
  ul.bullet-list li {{
    font-size: 11pt;
    line-height: 1.5;
    text-align: justify;
    margin-bottom: 8px;
  }}
  ul.bullet-list li strong {{
    color: #000;
  }}

  /* Table styling */
  table.report-table {{
    width: 100%;
    border-collapse: collapse;
    margin: 15px 0;
    font-size: 10pt;
  }}
  table.report-table th, table.report-table td {{
    border: 1px solid #000000;
    padding: 7px 10px;
    text-align: left;
    vertical-align: middle;
  }}
  table.report-table th {{
    font-weight: bold;
    background-color: #f8fafc;
  }}
  table.planning-table th {{
    background-color: #1e3a8a;
    color: #ffffff;
    font-weight: bold;
  }}

  /* Diagrams & Snapshots */
  .diagram-frame {{
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 8px;
    background: #ffffff;
    text-align: center;
    margin: 18px auto 8px auto;
    max-width: 95%;
  }}
  .diagram-frame img {{
    max-width: 100%;
    max-height: 380px;
    object-fit: contain;
    display: block;
    margin: 0 auto;
  }}
  .diagram-caption {{
    text-align: center;
    font-size: 10pt;
    font-style: italic;
    color: #334155;
    margin-top: 8px;
  }}

  /* Pre tag for directory structure */
  pre.folder-tree {{
    background: #fdfdfd;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    padding: 12px 16px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 8.5pt;
    line-height: 1.35;
    color: #1f2937;
    white-space: pre;
    overflow: hidden;
    margin: 12px 0;
  }}

  /* Print Media Query */
  @media print {{
    body {{
      background: transparent;
    }}
    .page {{
      margin: 0;
      box-shadow: none;
      width: 210mm;
      height: 297mm;
      page-break-after: always;
      break-after: page;
    }}
  }}
</style>
</head>
<body>

  <!-- ==================== PAGE 1: TITLE PAGE ==================== -->
  <div class="page">
    <div class="page-border">
      <h1 class="doc-title">SHASHIKANT TURF WEBSITE</h1>
      <h2 class="sub-title">A PROJECT REPORT</h2>
      <p class="award-text">
        In the partial fulfilment for the award of<br>
        <strong>DIPLOMA IN</strong><br>
        <strong>INFORMATION TECHNOLOGY</strong>
      </p>

      <div class="center-logo">
        <img src="{gpm_logo}" alt="GPM Logo">
      </div>

      <div class="author-block">
        <p style="margin-bottom:12px;">Submitted By-</p>
        <p><strong>Sharvari Pore (FS24IF048)</strong></p>
      </div>

      <div class="inst-block">
        <p>Department of Information Technology</p>
        <p><strong>GOVERNMENT POLYTECHNIC MUMBAI</strong></p>
      </div>
    </div>
  </div>

  <!-- ==================== PAGE 2: CERTIFICATE ==================== -->
  <div class="page">
    <div class="page-border">
      <div class="center-logo" style="margin: 10px 0 15px 0;">
        <img src="{gpm_logo}" alt="GPM Logo" style="max-width: 100px;">
      </div>

      <div style="text-align:center; margin-bottom: 20px;">
        <p style="font-size:12pt; font-weight:bold; letter-spacing:0.5px;">DEPARTMENT OF INFORMATION TECHNOLOGY</p>
        <p style="font-size:12pt; font-weight:bold; letter-spacing:0.5px;">GOVERNMENT POLYTECHNIC MUMBAI</p>
        <p style="font-size:10.5pt; margin-top:2px;">MUMBAI-400051</p>
      </div>

      <h2 class="sub-title" style="margin-bottom: 25px; letter-spacing: 1px;">CERTIFICATE</h2>

      <p class="body-text" style="font-size: 11pt; line-height: 1.7; margin-bottom: 30px;">
        This is to certify that the following students have successfully and satisfactorily completed the project on <strong>SHASHIKANT TURF WEBSITE</strong> and presented their report in partial fulfilment of the requirement for a <strong>Diploma in Information Technology</strong> from Government Polytechnic, Mumbai under the guidance of <strong>Aryan Jagtap</strong> in the academic year <strong>2026-2027</strong>.
      </p>

      <div style="text-align:center; margin-bottom: 60px;">
        <p style="font-size:11.5pt; font-weight:bold;">Sharvari Pore (FS24IF048)</p>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: auto; margin-bottom: 20px;">
        <div style="text-align:center;">
          <div style="border-top:1px solid #000; width:190px; margin:0 auto 6px auto;"></div>
          <p style="font-size:10.5pt; font-weight:bold;">Head of Department</p>
          <p style="font-size:10pt; margin-top:2px;">( Dr. Bhagoji B. Sul )</p>
        </div>
        <div style="text-align:center;">
          <div style="border-top:1px solid #000; width:190px; margin:0 auto 6px auto;"></div>
          <p style="font-size:10.5pt; font-weight:bold;">Principal</p>
          <p style="font-size:10pt; margin-top:2px;">( Dr. Nitiket N Mhala )</p>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 15px;">
        <div style="text-align:center;">
          <div style="border-top:1px solid #000; width:190px; margin:0 auto 6px auto;"></div>
          <p style="font-size:10.5pt; font-weight:bold;">Project Guide</p>
          <p style="font-size:10pt; margin-top:2px;">( Aryan Jagtap )</p>
        </div>
        <div style="text-align:center;">
          <div style="border-top:1px solid #000; width:190px; margin:0 auto 6px auto;"></div>
          <p style="font-size:10.5pt; font-weight:bold;">External examiner</p>
        </div>
      </div>

    </div>
  </div>

  <!-- ==================== PAGE 3: DECLARATION ==================== -->
  <div class="page">
    <div class="page-border">
      <h2 class="sub-title" style="margin-top: 30px; margin-bottom: 35px; letter-spacing: 1px;">DECLARATION</h2>

      <p class="body-text" style="font-size: 11pt; line-height: 1.7; margin-bottom: 24px;">
        We, the undersigned students of the Diploma in Information Technology at Government Polytechnic Mumbai, hereby declare that the report titled <strong>"SHASHIKANT TURF WEBSITE"</strong>, submitted in partial fulfillment of the requirements for the completion of our diploma, is our original work. We further declare that this work has not been previously submitted elsewhere for any academic evaluation, and all sources of information used in this report have been duly acknowledged. We have sincerely worked on the design, development, and implementation of this project.
      </p>

      <p class="body-text" style="font-size: 11pt; line-height: 1.7; margin-bottom: 50px;">
        We take full responsibility for the authenticity and originality of the contents presented in this report.
      </p>

      <div style="margin-bottom: 60px;">
        <p style="font-size: 11pt; font-weight: bold; margin-bottom: 8px;">DATE: ____________________</p>
        <p style="font-size: 11pt; font-weight: bold;">PLACE: Mumbai</p>
      </div>

      <table class="report-table" style="margin-top: 20px;">
        <thead>
          <tr>
            <th style="width: 40%; font-size:10.5pt;">Name of Students</th>
            <th style="width: 30%; font-size:10.5pt;">Enrollment No.</th>
            <th style="width: 30%; font-size:10.5pt;">Signature</th>
          </tr>
        </thead>
        <tbody>
          <tr style="height: 48px;">
            <td><strong>Sharvari Pore</strong></td>
            <td>FS24IF048</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- ==================== PAGE 4: ACKNOWLEDGEMENT ==================== -->
  <div class="page">
    <div class="page-border">
      <h2 class="sub-title" style="margin-top: 30px; margin-bottom: 35px; letter-spacing: 1px;">ACKNOWLEDGEMENT</h2>

      <p class="body-text" style="line-height: 1.65; margin-bottom: 22px;">
        We take this opportunity to express our sincere gratitude to all those who have guided and supported us in completing our project entitled <strong>"Shashikant Turf Website."</strong>
      </p>

      <p class="body-text" style="line-height: 1.65; margin-bottom: 22px;">
        We express our profound gratitude and heartfelt regards to our respected project guide, <strong>Aryan Jagtap</strong>, for his valuable guidance, continuous encouragement, and constructive suggestions throughout the conceptualization, design, and development of this project.
      </p>

      <p class="body-text" style="line-height: 1.65; margin-bottom: 22px;">
        We also express our sincere gratitude to <strong>Dr. Bhagoji B. Sul</strong>, Head of the Department of Information Technology, Government Polytechnic Mumbai, for providing us with all the necessary facilities, computing lab resources, and academic support to successfully complete this project.
      </p>

      <p class="body-text" style="line-height: 1.65; margin-bottom: 22px;">
        We extend our sincere thanks to all the teaching and non-teaching staff members of the Department of Information Technology for their generous cooperation, advice, and assistance during the entire course of this project.
      </p>

      <p class="body-text" style="line-height: 1.65; margin-bottom: 35px;">
        Finally, we express our deep love and gratitude to our parents and friends for their continuous motivation, moral support, and unconditional encouragement that helped us in successfully completing this project.
      </p>

      <p style="font-size: 11.5pt; font-weight: bold; margin-bottom: 45px;">THANK YOU!</p>

      <div style="text-align: right; margin-top: auto; margin-bottom: 25px;">
        <p style="font-size: 11pt; font-weight: bold;">Sharvari Pore (FS24IF048)</p>
      </div>
    </div>
  </div>

  <!-- ==================== PAGE 5: ABSTRACT ==================== -->
  <div class="page">
    <div class="page-border">
      <h2 class="sub-title" style="margin-top: 30px; margin-bottom: 35px; letter-spacing: 1px;">ABSTRACT</h2>

      <p class="body-text" style="line-height: 1.65; margin-bottom: 20px;">
        The <strong>Shashikant Turf Website</strong> is a comprehensive, web-based sports arena slot reservation and management platform engineered to solve the operational bottlenecks and scheduling conflicts of sports facilities in metropolitan cities. Urban sports venues (catering to box cricket, 5v5/7v7 artificial turf football, and multi-sport tournaments) traditionally depend on chaotic phone calls and manual paper logbooks, leading to frequent double bookings, customer frustration, and revenue leakages.
      </p>

      <p class="body-text" style="line-height: 1.65; margin-bottom: 20px;">
        The website allows players and sports enthusiasts to explore multiple arenas across Mumbai (e.g., Andheri West, Bandra West, Powai, Kandivali East), inspect pitch dimensions, synthetic turf specifications, floodlighting, and amenities. It integrates an intuitive 7-day dynamic date ribbon and hourly time-slot selector across Morning, Evening, and Floodlit Night sessions with automated transparent pricing (including 18% GST and platform fees) and simulated digital checkout with instant downloadable passes.
      </p>

      <p class="body-text" style="line-height: 1.65; margin-bottom: 20px;">
        Simultaneously, the platform incorporates an <strong>Admin Operations Command Center</strong> that equips turf owners and facility managers with live revenue analytics, daily booking statistics, arena addition/deletion controls, and a dedicated Slot Availability Calendar to block maintenance hours or accommodate telephone reservations without schedule conflicts.
      </p>

      <p class="body-text" style="line-height: 1.65; margin-bottom: 20px;">
        Overall, the Shashikant Turf Website serves as an end-to-end, high-performance web solution built on HTML5, modern CSS3 dark sports glassmorphism, and Vanilla JavaScript (ES6+). By leveraging browser-native LocalStorage for zero-latency cross-tab data synchronization, it eliminates expensive cloud subscription costs while establishing seamless operational harmony between sports players and arena administrators.
      </p>
    </div>
  </div>

  <!-- ==================== PAGE 6: TABLE OF CONTENTS ==================== -->
  <div class="page">
    <div class="page-border">
      <div style="text-align:center; margin-top: 15px; margin-bottom: 25px;">
        <h2 style="font-size: 15pt; font-weight: bold; margin-bottom: 8px;">SHASHIKANT TURF WEBSITE</h2>
        <p style="font-size: 12.5pt; font-weight: bold;">Table of Contents</p>
      </div>

      <table class="report-table" style="margin-top: 15px;">
        <thead>
          <tr>
            <th style="width: 15%; text-align: center; font-size: 10.5pt;">Sr. No.</th>
            <th style="width: 65%; font-size: 10.5pt;">Chapter / Topic</th>
            <th style="width: 20%; text-align: center; font-size: 10.5pt;">Page No.</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align: center;">1</td>
            <td><strong>Chapter 1: Introduction</strong></td>
            <td style="text-align: center;">7</td>
          </tr>
          <tr>
            <td style="text-align: center;">2</td>
            <td><strong>Chapter 2: Literature Review</strong></td>
            <td style="text-align: center;">10</td>
          </tr>
          <tr>
            <td style="text-align: center;">3</td>
            <td><strong>Chapter 3: Technical Specifications</strong></td>
            <td style="text-align: center;">12</td>
          </tr>
          <tr>
            <td style="text-align: center;">4</td>
            <td><strong>Chapter 4: Development Process</strong></td>
            <td style="text-align: center;">16</td>
          </tr>
          <tr>
            <td style="text-align: center;">5</td>
            <td><strong>Chapter 5: Planning Phase</strong></td>
            <td style="text-align: center;">20</td>
          </tr>
          <tr>
            <td style="text-align: center;">6</td>
            <td><strong>Chapter 6: System Design</strong></td>
            <td style="text-align: center;">22</td>
          </tr>
          <tr>
            <td style="text-align: center;">7</td>
            <td><strong>Chapter 7: Testing</strong></td>
            <td style="text-align: center;">25</td>
          </tr>
          <tr>
            <td style="text-align: center;">8</td>
            <td><strong>Chapter 8: Diagrams</strong></td>
            <td style="text-align: center;">28</td>
          </tr>
          <tr>
            <td style="text-align: center;">9</td>
            <td><strong>Chapter 9: User Interface and System Screens</strong></td>
            <td style="text-align: center;">30</td>
          </tr>
          <tr>
            <td style="text-align: center;">10</td>
            <td><strong>Chapter 10: Conclusion and Future Scope</strong></td>
            <td style="text-align: center;">34</td>
          </tr>
          <tr>
            <td style="text-align: center;">11</td>
            <td><strong>References</strong></td>
            <td style="text-align: center;">35</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- ==================== PAGE 7: CHAPTER 1: INTRODUCTION ==================== -->
  <div class="page">
    <div class="page-border">
      <h2 class="chapter-heading">CHAPTER 1: INTRODUCTION</h2>

      <h3 class="section-heading">1.1| INTRODUCTION:</h3>
      <p class="body-text">
        In today's urban recreational landscape, sports turf culture has experienced unprecedented growth across metropolitan hubs like Mumbai. Due to the scarcity of open public grounds and the surging enthusiasm for recreational athletics, thousands of working professionals, students, and amateur clubs participate daily in box cricket matches, 5-a-side and 7-a-side football, and corporate tournament leagues. Sports turf facilities operate around the clock, hosting back-to-back hour-long matches under high-intensity LED floodlights.
      </p>

      <p class="body-text">
        However, the vast majority of sports turfs continue to operate through obsolete paper registers and uncoordinated telephone phone calls. Turf managers attempt to log reservations in handwritten diaries while simultaneously answering phone inquiries during live games. These traditional methods result in serious operational blind spots: conflicting double-booked slots, lack of price transparency, disputes over advance payments, and customer drop-offs due to busy phone lines during peak weekend hours.
      </p>

      <p class="body-text">
        <strong>Shashikant Turf</strong> has been engineered as an end-to-end, unified digital sports arena slot reservation and management platform. Tailored for urban sports complexes across Mumbai (such as <em>KickOff Grand Arena, Skyline Rooftop Turf, Striker's Hub Multisport, and Apex International Arena</em>), Shashikant Turf integrates distinct user personas into one synchronized system:
      </p>

      <ul class="bullet-list">
        <li>
          <strong>Player Self-Service Booking Portal:</strong> Enables sports players to discover premium venues, inspect pitch sizes (5v5, 7v7, 8v8 FIFA artificial turf) and amenities, select playing dates via a 7-day ribbon, reserve available slots across Morning, Evening, and Floodlit Night hours, calculate automated 18% GST breakdowns, and generate instant digital passes.
        </li>
        <li>
          <strong>Arena Operations Command Center:</strong> An executive desk for turf owners and managers featuring live KPI stat cards (Gross Revenue, Total Bookings, Today's Occupancy, Active Turfs), a real-time reservation ledger with cancellation controls, turf venue addition/deletion tools, and an interactive Slot Availability Calendar.
        </li>
      </ul>

      <div class="page-num">7</div>
    </div>
  </div>

  <!-- ==================== PAGE 8: 1.2 NEED / MOTIVATION ==================== -->
  <div class="page">
    <div class="page-border">
      <h3 class="section-heading">1.2| NEED / MOTIVATION:</h3>
      <p class="body-text">
        In today's fast-paced digital era, sports venues require an automated operating platform to ensure real-time scheduling accuracy, revenue transparency, and smooth customer experiences. Turf facility owners face constant operational challenges that demand modern software solutions:
      </p>

      <ul class="bullet-list">
        <li>
          <strong>1. Scheduling Conflicts and Double Bookings:</strong> Handwritten registers and voice-call bookings are highly vulnerable to human error. Two groups frequently arrive at the venue simultaneously claiming the same evening 8:00 PM slot, resulting in unpleasant disputes and brand erosion.
        </li>
        <li>
          <strong>2. Absence of Live Slot Availability Visibility:</strong> Players waste 15 to 20 minutes calling multiple turf managers across the city just to ask if a weekend floodlight slot is free. The lack of an instant visual calendar causes friction and lost bookings.
        </li>
        <li>
          <strong>3. Revenue Leakage and Unorganized Accounting:</strong> Arena managers manage irregular cash advances, Google Pay transfers to personal accounts, and unrecorded offline discounts without automated daily turnover totals or tax compliance calculations.
        </li>
        <li>
          <strong>4. Inflexible Booking Cancellation & Slot Reallocation:</strong> When a team cancels their reservation due to rain or player emergencies, turf managers have no streamlined mechanism to instantly free up the slot for other waiting players.
        </li>
      </ul>

      <p class="body-text">
        The motivation behind this project stems from the desire to combine modern web technology with accessible community sports infrastructure. By building a high-performance, responsive platform, Shashikant Turf eliminates paper registers, prevents double-booking errors, and provides complete operational clarity for both players and arena administrators.
      </p>

      <div class="page-num">8</div>
    </div>
  </div>

  <!-- ==================== PAGE 9: 1.3 OBJECTIVES ==================== -->
  <div class="page">
    <div class="page-border">
      <h3 class="section-heading">1.3| OBJECTIVES:</h3>
      <p class="body-text">
        The project focuses on achieving the following specific engineering and operational objectives:
      </p>

      <ul class="bullet-list">
        <li>
          <strong>1. Interactive Slot Reservation Engine:</strong> To provide a streamlined, responsive web interface enabling players to book sports slots in under 30 seconds.
        </li>
        <li>
          <strong>2. Dynamic 7-Day Date Ribbon:</strong> To implement an intuitive horizontal calendar ribbon displaying current and upcoming dates with active date filtering.
        </li>
        <li>
          <strong>3. Multi-Tier Slot Categorization:</strong> To systematically categorize hourly playing slots into Morning, Evening, and Floodlit Night blocks with visual occupancy chips.
        </li>
        <li>
          <strong>4. Automated Price & Tax Computation:</strong> To dynamically compute base slot rates, 18% GST government tax, and platform convenience charges with live cart updates.
        </li>
        <li>
          <strong>5. Multi-Venue & Sport Catalog Filtering:</strong> To build a searchable arena directory filterable by sport (Football, Cricket, Multisport), location, and pitch size (5v5, 7v7, 8v8).
        </li>
        <li>
          <strong>6. Executive Admin KPI Dashboard:</strong> To deliver real-time metric cards summarizing Total Gross Revenue, Total Bookings, Today's Reservations, and Active Arenas.
        </li>
        <li>
          <strong>7. Visual Turf Slot Availability Calendar:</strong> To provide facility managers with a calendar view to monitor slot statuses and block hours for offline bookings or pitch maintenance.
        </li>
        <li>
          <strong>8. Player Booking Ledger & Digital Receipt:</strong> To allow users to view their reservation history, print formatted payment slips, and execute instant slot cancellations.
        </li>
        <li>
          <strong>9. Dual-Role Authentication System:</strong> To implement role-based access control separating customer reservation privileges from administrative arena controls.
        </li>
        <li>
          <strong>10. Zero Cloud Lag / Local-First Storage:</strong> To guarantee persistent cross-tab data synchronization via HTML5 LocalStorage without recurring cloud subscription costs.
        </li>
      </ul>

      <div class="page-num">9</div>
    </div>
  </div>

  <!-- ==================== PAGE 10: CHAPTER 2: LITERATURE REVIEW ==================== -->
  <div class="page">
    <div class="page-border">
      <h2 class="chapter-heading">CHAPTER 2: LITERATURE REVIEW</h2>

      <h3 class="section-heading">2.1| OVERVIEW OF TURF BOOKING SYSTEMS:</h3>
      <p class="body-text">
        In the modern digital landscape, automated web platforms play a vital role in organizing sports recreation and leisure facility operations. For independent sports arenas catering to local leagues, youth academies, and corporate matches, establishing a web-based reservation portal is not merely a convenience but an operational necessity.
      </p>

      <p class="body-text">
        Historically, sports turf owners relied either on manual paper logbooks or on third-party mobile aggregator applications (such as <em>Playo, Hudle, or TurfTown</em>). While commercial aggregators provide broad directory listings, they exhibit significant commercial and operational disadvantages:
      </p>

      <ul class="bullet-list">
        <li>
          <strong>High Commission Deductions:</strong> Aggregators charge substantial 15% to 20% commission fees on every completed reservation, severely cutting into the operating margins of turf entrepreneurs.
        </li>
        <li>
          <strong>Aggressive Competitor Advertising:</strong> Aggregator apps actively promote competing turfs within the vicinity directly to customers on the app home screen.
        </li>
        <li>
          <strong>Platform Lock-In & Delayed Payouts:</strong> Turf managers face delayed revenue disbursements and lack direct ownership of customer booking data.
        </li>
      </ul>

      <p class="body-text">
        Consequently, independent, lightweight, self-hosted web platforms tailored specifically to individual turf complexes have emerged as the preferred industry standard.
      </p>

      <h3 class="section-heading">2.2| MODERN WEB STACK JUSTIFICATION:</h3>
      <p class="body-text">
        Recent software engineering studies confirm that lightweight web technologies—such as semantic HTML5, modern CSS3 with custom properties, and Vanilla JavaScript (ES6+)—provide superior runtime efficiency and sub-second rendering compared to heavy frontend frameworks. By leveraging browser-native LocalStorage for multi-window synchronization, Shashikant Turf delivers instant real-time responsiveness without server latency or framework overhead.
      </p>

      <div class="page-num">10</div>
    </div>
  </div>

  <!-- ==================== PAGE 11: 2.3 COMPARATIVE ANALYSIS ==================== -->
  <div class="page">
    <div class="page-border">
      <h3 class="section-heading">2.3| COMPARATIVE ANALYSIS:</h3>
      <p class="body-text">
        To evaluate the architectural and operational superiority of the Shashikant Turf platform, a systematic comparison was conducted against traditional paper registers and commercial aggregator platforms:
      </p>

      <table class="report-table" style="margin-top: 20px;">
        <thead>
          <tr>
            <th style="width: 25%;">Parameter / Feature</th>
            <th style="width: 25%;">Manual Paper & Phone Registers</th>
            <th style="width: 25%;">Commercial Apps (Playo / Hudle)</th>
            <th style="width: 25%;">Shashikant Turf Platform</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Setup & Running Cost</strong></td>
            <td>Low initial, high ongoing manual overhead</td>
            <td>High monthly fee / 15%–20% commission</td>
            <td><strong>Zero recurring cost (Free static hosting)</strong></td>
          </tr>
          <tr>
            <td><strong>Slot Booking Speed</strong></td>
            <td>Slow (5–10 minutes via phone call)</td>
            <td>Moderate (Heavy app download & lag)</td>
            <td><strong>Instant (&lt; 30 seconds online)</strong></td>
          </tr>
          <tr>
            <td><strong>Double Booking Risk</strong></td>
            <td>Very High (Unsynchronized phone entries)</td>
            <td>Moderate (API server sync delay)</td>
            <td><strong>Zero (Instant slot locking & calendar)</strong></td>
          </tr>
          <tr>
            <td><strong>Data Privacy & Ads</strong></td>
            <td>Customer phone numbers exposed</td>
            <td>Commercial data tracking & competitor ads</td>
            <td><strong>100% Private, zero ads, local data store</strong></td>
          </tr>
          <tr>
            <td><strong>Device Accessibility</strong></td>
            <td>Phone call dependent only</td>
            <td>Requires heavy mobile app installation</td>
            <td><strong>Universal web access (PC, Tablet, Mobile)</strong></td>
          </tr>
          <tr>
            <td><strong>Revenue & Slot Analytics</strong></td>
            <td>Disorganized paper ledgers</td>
            <td>Aggregator portal lock-in</td>
            <td><strong>Live executive dashboard with full turnover</strong></td>
          </tr>
        </tbody>
      </table>

      <div class="page-num">11</div>
    </div>
  </div>

  <!-- ==================== PAGE 12: CHAPTER 3: TECHNICAL SPECIFICATIONS ==================== -->
  <div class="page">
    <div class="page-border">
      <h2 class="chapter-heading">CHAPTER 3: TECHNICAL SPECIFICATIONS</h2>

      <h3 class="section-heading">3.1| TECHNOLOGIES USED:</h3>
      <p class="body-text">
        In the development of the Shashikant Turf platform, a combination of modern front-end and browser-native web technologies has been used to ensure high computational efficiency, responsive presentation, and sub-second interaction speeds. The choice of technologies was made to achieve an intuitive user interface, rapid data processing, and secure state synchronization:
      </p>

      <p class="body-text">
        <strong>1. HTML5 (HyperText Markup Language 5):</strong><br>
        HTML5 is the standard markup language used for creating and structuring the web pages. It provides the basic structural foundation of the Shashikant Turf platform, defining the layout for the Customer Discovery Portal, Slot Booking Engine, Checkout Module, and Admin Operations Dashboard. Semantic elements (<code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;section&gt;</code>, <code>&lt;aside&gt;</code>, <code>&lt;table&gt;</code>) ensure clean DOM tree hierarchy, accessibility, and modern search engine optimization.
      </p>

      <p class="body-text">
        <strong>2. CSS3 (Cascading Style Sheets 3):</strong><br>
        CSS3 is used to design and enhance the visual presentation of the platform. It controls page layouts, typography, sports color palettes, and component responsiveness. Custom CSS variables (such as <code>--bg-dark: #0a0f1d</code>, <code>--primary: #10b981</code>, <code>--accent: #00f076</code>, and <code>--bg-surface: #182234</code>) and glassmorphism styling create an executive dark athletic mode suitable for 24/7 sports arenas. Modern CSS Grid and Flexbox layouts guarantee fluid adaptation across mobile viewports, tablet screens, and desktop terminals.
      </p>

      <div class="page-num">12</div>
    </div>
  </div>

  <!-- ==================== PAGE 13: 3.1 TECHNOLOGIES USED (CONTINUED) ==================== -->
  <div class="page">
    <div class="page-border">
      <p class="body-text">
        <strong>3. Vanilla JavaScript (ECMAScript 2023 / ES6+):</strong><br>
        JavaScript is the client-side scripting language that adds interactivity, real-time calculations, and dynamic behavior to the web pages. Pure Vanilla JavaScript (without heavy external library bloat) is used in Shashikant Turf to implement core features such as the 7-day date ribbon generator, dynamic slot occupancy renderers, automated 18% GST cost calculators, modal booking pass dialogs, catalog search filtering, and calendar slot management routines.
      </p>

      <p class="body-text">
        <strong>4. Web Storage API (LocalStorage Database):</strong><br>
        The Web Storage API provides browser-native mechanisms by which web applications can store structured key/value pairs locally with persistence across sessions. Shashikant Turf utilizes LocalStorage to maintain persistent JSON records for:
      </p>

      <ul class="bullet-list">
        <li><code>SHASHIKANT_TURFS</code>: Master catalog of sports venues, locations, pitch sizes, hourly tariffs, amenities, and photos.</li>
        <li><code>SHASHIKANT_BOOKINGS</code>: Master ledger of confirmed and cancelled player reservations, dates, slots, and revenue amounts.</li>
        <li><code>SHASHIKANT_USER</code>: Active authenticated user session and role privileges.</li>
      </ul>

      <p class="body-text">
        Cross-window storage event listeners ensure that when a player completes a reservation on the user portal, the admin operations command desk updates its KPI counters and bookings table instantaneously.
      </p>

      <p class="body-text">
        <strong>5. SessionStorage API:</strong><br>
        Employed for temporary state serialization (<code>current_checkout</code>), securely handing off chosen venue details, selected date, and time slot from the booking details screen to the payment checkout flow.
      </p>

      <div class="page-num">13</div>
    </div>
  </div>

  <!-- ==================== PAGE 14: 3.2 HARDWARE REQUIREMENTS ==================== -->
  <div class="page">
    <div class="page-border">
      <h3 class="section-heading">3.2| HARDWARE REQUIREMENTS:</h3>
      <p class="body-text">
        To develop, test, and deploy the Shashikant Turf platform efficiently, the following minimum and recommended hardware specifications are required:
      </p>

      <table class="report-table" style="margin-top: 25px;">
        <thead>
          <tr>
            <th style="width: 25%;">Component</th>
            <th style="width: 35%;">Minimum Requirement</th>
            <th style="width: 40%;">Recommended Requirement</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Processor</strong></td>
            <td>Intel Core i3 or equivalent / AMD Ryzen 3</td>
            <td>Intel Core i5 / i7 or AMD Ryzen 5 / 7</td>
          </tr>
          <tr>
            <td><strong>RAM</strong></td>
            <td>4 GB DDR4</td>
            <td>8 GB DDR4 or higher</td>
          </tr>
          <tr>
            <td><strong>Storage</strong></td>
            <td>128 GB HDD / SSD</td>
            <td>256 GB NVMe SSD</td>
          </tr>
          <tr>
            <td><strong>Monitor</strong></td>
            <td>14" HD Display (1366 x 768)</td>
            <td>19" Full HD LED Display / Laptop (1920 x 1080)</td>
          </tr>
          <tr>
            <td><strong>Network</strong></td>
            <td>Internet Connection (512 Kbps)</td>
            <td>Broadband / High-Speed Wi-Fi Connection</td>
          </tr>
          <tr>
            <td><strong>Power Backup</strong></td>
            <td>Standard Laptop Battery Backup</td>
            <td>Dedicated UPS for uninterrupted turf desk terminal</td>
          </tr>
        </tbody>
      </table>

      <div class="page-num">14</div>
    </div>
  </div>

  <!-- ==================== PAGE 15: 3.3 SOFTWARE REQUIREMENTS ==================== -->
  <div class="page">
    <div class="page-border">
      <h3 class="section-heading">3.3| SOFTWARE REQUIREMENTS:</h3>
      <p class="body-text">
        The software tools and runtime environments utilized for developing and testing the project are summarized below:
      </p>

      <table class="report-table" style="margin-top: 25px;">
        <thead>
          <tr>
            <th style="width: 25%;">Category</th>
            <th style="width: 35%;">Software / Tool Used</th>
            <th style="width: 40%;">Purpose / Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Operating System</strong></td>
            <td>Windows 10 / 11 or Linux (Ubuntu)</td>
            <td>Platform for software development, debugging, and runtime testing</td>
          </tr>
          <tr>
            <td><strong>Frontend Technologies</strong></td>
            <td>HTML5, CSS3, Vanilla JavaScript (ES6+)</td>
            <td>Core web languages for layout structuring, styling, and slot interactivity</td>
          </tr>
          <tr>
            <td><strong>Database / Storage</strong></td>
            <td>HTML5 LocalStorage & SessionStorage</td>
            <td>Browser-native client-side data persistence for turfs, bookings, and users</td>
          </tr>
          <tr>
            <td><strong>Text Editor / IDE</strong></td>
            <td>Visual Studio Code</td>
            <td>Environment for authoring, formatting, linting, and debugging source code</td>
          </tr>
          <tr>
            <td><strong>Web Browser</strong></td>
            <td>Google Chrome / Microsoft Edge</td>
            <td>Execution runtime for rendering web pages, testing responsive layouts, DevTools</td>
          </tr>
          <tr>
            <td><strong>Version Control</strong></td>
            <td>Git and GitHub</td>
            <td>For source code repository hosting, commit versioning, and tracking changes</td>
          </tr>
        </tbody>
      </table>

      <div class="page-num">15</div>
    </div>
  </div>

  <!-- ==================== PAGE 16: CHAPTER 4: DEVELOPMENT PROCESS ==================== -->
  <div class="page">
    <div class="page-border">
      <h2 class="chapter-heading">CHAPTER 4: DEVELOPMENT PROCESS</h2>

      <h3 class="section-heading">4.1| SOFTWARE DEVELOPMENT:</h3>
      <p class="body-text">
        The Software Development Process is a systematic engineering methodology used to design, develop, test, and deploy software applications. It ensures that development is carried out in an organized, efficient, and disciplined manner, meeting user requirements while maintaining high software quality and operational reliability.
      </p>

      <p class="body-text">
        This process divides development into multiple well-defined phases—such as requirement analysis, system design, coding, testing, deployment, and ongoing maintenance. Following a structured software process minimizes coding defects, prevents project scope creep, saves development time, and guarantees that the final web application fulfills user expectations.
      </p>

      <h3 class="section-heading">4.2| WATERFALL MODEL:</h3>
      <p class="body-text">
        The Waterfall Model is one of the earliest and most widely established software development life cycle (SDLC) models. It is a linear sequential model where development progresses systematically downward through discrete phases like a cascading waterfall. Each phase must be completed and validated before the subsequent phase commences, ensuring rigorous documentation, architectural clarity, and precise milestone tracking.
      </p>

      <p class="body-text">
        For the <strong>Shashikant Turf Website</strong>, the Waterfall Model was chosen because the functional requirements (such as hourly slot scheduling, price calculations, and admin oversight) were clear, well-scoped, and stable from the outset.
      </p>

      <div class="page-num">16</div>
    </div>
  </div>

  <!-- ==================== PAGE 17: PHASES OF WATERFALL MODEL ==================== -->
  <div class="page">
    <div class="page-border">
      <h3 class="section-heading">PHASES OF THE WATERFALL MODEL:</h3>

      <ul class="bullet-list" style="margin-top: 15px;">
        <li>
          <strong>1. Requirement Analysis:</strong> In this phase, all functional and business requirements are gathered from sports facility managers and players. The goal is to comprehensively understand system inputs, slot scheduling constraints, and expected deliverables.
        </li>
        <li>
          <strong>2. System Design:</strong> Based on the documented requirements, system architecture, database structures, and UI wireframes are established. This phase specifies component decomposition across customer and administrative portals.
        </li>
        <li>
          <strong>3. Implementation (Coding):</strong> Software engineers write the actual source code according to the design specifications. Each module (catalog discovery, slot booking engine, checkout, admin analytics) is developed and unit-tested individually.
        </li>
        <li>
          <strong>4. Integration and Testing:</strong> After coding, all separate modules are integrated into a single cohesive platform and tested rigorously to detect and fix any logic errors, double-booking anomalies, or responsive rendering defects.
        </li>
        <li>
          <strong>5. Deployment:</strong> The fully tested web platform is deployed to the production environment or hosted statically on GitHub Pages for real-world access across computers and mobile phones.
        </li>
        <li>
          <strong>6. Maintenance:</strong> Following deployment, the system is monitored, refactored, and updated based on user feedback, browser engine updates, or changing facility management rules.
        </li>
      </ul>

      <p class="body-text" style="margin-top: 25px;">
        The Waterfall Model is ideal for projects where project specifications are clearly understood and unlikely to experience major volatile changes during development—such as sports turf reservation and arena operations portals.
      </p>

      <div class="page-num">17</div>
    </div>
  </div>

  <!-- ==================== PAGE 18: DIAGRAM OF WATERFALL MODEL ==================== -->
  <div class="page">
    <div class="page-border">
      <h3 class="section-heading">DIAGRAM OF WATERFALL MODEL:</h3>
      <p class="body-text">
        The following figure illustrates the sequential phases executed during the design and development of the Shashikant Turf platform:
      </p>

      <div class="diagram-frame" style="margin-top: 35px; margin-bottom: 25px;">
        <img src="{waterfall_img}" alt="Waterfall SDLC Model Diagram" style="max-height: 420px;">
      </div>

      <p class="diagram-caption">Figure 4.1: Waterfall Software Development Life Cycle (SDLC) Model</p>

      <div class="page-num">18</div>
    </div>
  </div>

  <!-- ==================== PAGE 19: 4.3 IMPLEMENTATION OF WATERFALL MODEL ==================== -->
  <div class="page">
    <div class="page-border">
      <h3 class="section-heading">4.3| IMPLEMENTATION OF WATERFALL MODEL IN PROJECT:</h3>
      <p class="body-text">
        The Waterfall Model was applied to the development of the Shashikant Turf Website in a step-by-step manner. Each phase was executed sequentially, ensuring that the outputs of one phase became the verified inputs for the next:
      </p>

      <ul class="bullet-list">
        <li>
          <strong>Phase 1: Requirement Analysis -</strong> Gathered operational details of urban sports turfs across Mumbai, including 60-minute match conventions, morning/evening/floodlit slot timing tiers, 18% GST calculation, customer checkout fields, and admin cancellation policies.
        </li>
        <li>
          <strong>Phase 2: System Design -</strong> Planned modern athletic dark-mode UI wireframes, established CSS custom color variables, and defined LocalStorage JSON schemas (<code>SHASHIKANT_TURFS</code>, <code>SHASHIKANT_BOOKINGS</code>, <code>SHASHIKANT_USER</code>).
        </li>
        <li>
          <strong>Phase 3: Implementation (Coding) -</strong> Coded modular HTML5 markup, responsive CSS3 stylesheets, and ES6 JavaScript controllers for dynamic date ribbon generation, slot filtering, and admin KPI calculations.
        </li>
        <li>
          <strong>Phase 4: Testing -</strong> Tested all forms, date ribbon switching, double-booking prevention routines, printable receipt dialogs, and cross-browser viewport responsiveness.
        </li>
        <li>
          <strong>Phase 5: Deployment -</strong> Versioned with Git and hosted statically for instant offline-capable access on laptops, tablets, and mobile devices.
        </li>
        <li>
          <strong>Phase 6: Maintenance -</strong> Refactored styles, modularized JavaScript functions, and optimized slot rendering speeds for low-bandwidth mobile connections.
        </li>
      </ul>

      <div class="page-num">19</div>
    </div>
  </div>

  <!-- ==================== PAGE 20: CHAPTER 5: PLANNING PHASE ==================== -->
  <div class="page">
    <div class="page-border">
      <h2 class="chapter-heading">CHAPTER 5: PLANNING PHASE</h2>

      <h3 class="section-heading">5.1| PURPOSE OF THE PLANNING PHASE:</h3>
      <p class="body-text">
        The Planning Phase is the foundational bedrock of the Software Development Life Cycle (SDLC). It defines the strategic goals, project scope, timeline, and resources required for successful project execution. In the context of the Shashikant Turf Website, this phase focused on analyzing operational turf bottlenecks, prioritizing core features, finalizing the software stack, and establishing a development roadmap.
      </p>

      <p class="body-text">This phase aimed to answer essential questions such as:</p>
      <ul class="bullet-list">
        <li>What is the primary objective of the sports booking platform?</li>
        <li>Who are the target user groups? (Players, Teams, Arena Managers, Facility Staff)</li>
        <li>What web technologies and architectural resources are needed?</li>
        <li>What are the operational and scheduling risks involved in slot allocations?</li>
      </ul>

      <h3 class="section-heading">5.2| REQUIREMENT GATHERING AND ANALYSIS:</h3>
      <p class="body-text">
        During this stage, field observations and workflow discussions were conducted regarding recreational turf complex management. The main requirements included:
      </p>

      <ul class="bullet-list">
        <li>A Customer Turf Discovery Portal with instant keyword search and sport filtering.</li>
        <li>A Dynamic Slot Reservation Engine with a 7-day date ribbon and real-time availability chips.</li>
        <li>An Automated Cost Estimator calculating hourly rent, 18% GST, and convenience fees.</li>
        <li>An Admin Operations Command Center featuring live revenue stats, booking ledgers, and a slot management calendar.</li>
      </ul>

      <div class="page-num">20</div>
    </div>
  </div>

  <!-- ==================== PAGE 21: 5.3 FEASIBILITY & 5.4 OUTCOME ==================== -->
  <div class="page">
    <div class="page-border">
      <h3 class="section-heading">5.3| FEASIBILITY STUDY:</h3>
      <p class="body-text">
        A comprehensive feasibility study was carried out to ensure that the project could be implemented effectively within available time and computing resources:
      </p>

      <ul class="bullet-list">
        <li>
          <strong>Technical Feasibility:</strong> The engineering team confirmed that client-side web technologies—specifically HTML5, CSS3, ES6 JavaScript, and LocalStorage—are fully capable of delivering high-speed slot selection and state management without requiring expensive server databases.
        </li>
        <li>
          <strong>Economic Feasibility:</strong> Utilizing open-source development tools (VS Code, Git) and static web hosting made the project completely cost-effective (₹0 recurring software costs).
        </li>
        <li>
          <strong>Operational Feasibility:</strong> The website's intuitive high-contrast dark interface ensures high usability for both mobile-first sports players and arena managers at desk terminals.
        </li>
      </ul>

      <h3 class="section-heading">5.4| OUTCOME OF PLANNING PHASE:</h3>
      <p class="body-text">
        The planning phase established a clear roadmap for the development of the Shashikant Turf website:
      </p>

      <table class="report-table planning-table" style="margin-top: 15px;">
        <thead>
          <tr>
            <th style="width: 35%;">PLANNING AREA</th>
            <th style="width: 65%;">OUTCOME</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Project Goals</strong></td>
            <td>Goals and objectives for turf reservation were clearly defined.</td>
          </tr>
          <tr>
            <td><strong>Requirements</strong></td>
            <td>Functional requirements for player and admin roles were finalised.</td>
          </tr>
          <tr>
            <td><strong>Technology</strong></td>
            <td>Suitable client-side web technologies (HTML5, CSS3, JS) were selected.</td>
          </tr>
          <tr>
            <td><strong>Timeline</strong></td>
            <td>A clear milestone-based sprint timeline was prepared.</td>
          </tr>
          <tr>
            <td><strong>Next Phase</strong></td>
            <td>A strong architectural foundation was created for System Design.</td>
          </tr>
        </tbody>
      </table>

      <div class="page-num">21</div>
    </div>
  </div>

  <!-- ==================== PAGE 22: CHAPTER 6: SYSTEM DESIGN ==================== -->
  <div class="page">
    <div class="page-border">
      <h2 class="chapter-heading">CHAPTER 6: SYSTEM DESIGN</h2>

      <h3 class="section-heading">6.1| WHAT IS SYSTEM DESIGN:</h3>
      <p class="body-text">
        System Design is the process of defining the overall architecture, software components, modules, interfaces, and data schemas of a system to satisfy specific operational requirements. It acts as a comprehensive blueprint for building the project, showing how individual modules interact both functionally and technically.
      </p>

      <p class="body-text">The general tasks involved in the system design process include:</p>
      <ul class="bullet-list">
        <li>1. Designing architectural blocks for overall system processes and user navigation.</li>
        <li>2. Designing smaller, compact, and workable modular components for each subsystem.</li>
        <li>3. Designing client-side database schemas and persistent storage structures.</li>
        <li>4. Specifying detailed algorithmic functions to achieve accurate pricing and slot availability.</li>
        <li>5. Designing the form of inputs, interactive UI dialogs, and outputs of the system.</li>
        <li>6. Performing formal documentation of design specifications.</li>
        <li>7. Conducting system reviews and user experience optimizations.</li>
      </ul>

      <div class="page-num">22</div>
    </div>
  </div>

  <!-- ==================== PAGE 23: 6.2 MODULES OF WEBSITE ==================== -->
  <div class="page">
    <div class="page-border">
      <h3 class="section-heading">6.2| MODULES OF WEBSITE:</h3>
      <p class="body-text">
        The Shashikant Turf platform is structured into six core workable modules:
      </p>

      <p class="body-text">
        <strong>1. Central Authentication & Role Hub (login.html, register.html, auth.js):</strong><br>
        • Interactive tabbed role switcher allowing access as Customer Player or Admin Manager.<br>
        • Dynamic validation, session serialization, and fast redirection to designated dashboards.
      </p>

      <p class="body-text">
        <strong>2. Turf Discovery & Catalog Portal (index.html, turfs.html, turfs.js):</strong><br>
        • Search filter by turf name, location, and sport category (Football, Cricket, Multisport).<br>
        • Interactive turf cards showcasing pitch dimensions, hourly pricing, ratings, and amenities.
      </p>

      <p class="body-text">
        <strong>3. Dynamic Slot Reservation Engine (turf-details.html, booking.js):</strong><br>
        • Dynamic 7-day horizontal date ribbon displaying active day, date, and month.<br>
        • Multi-category time slots (Morning, Evening, Floodlit Night) with real-time occupancy status.<br>
        • Automated price breakdown calculating base slot rental, 18% GST, and platform fee.
      </p>

      <p class="body-text">
        <strong>4. Checkout & Pass Generator (checkout.html):</strong><br>
        • Capture player contact info and simulate payment modes (UPI, Card, Net Banking, Pay at Venue).<br>
        • Generates formal booking confirmation modal with unique Booking ID.
      </p>

      <p class="body-text">
        <strong>5. Player Booking Ledger (my-bookings.html, user.js):</strong><br>
        • Real-time history of user bookings with Confirmed/Cancelled status badges.<br>
        • Printable payment receipt slips and self-service cancellation with refund simulation.
      </p>

      <p class="body-text">
        <strong>6. Admin Operations Command Center (dashboard.html, calender.html, manage-turfs.html, admin.js):</strong><br>
        • Executive KPI stat cards: Total Gross Revenue, Total Bookings, Today's Count, Active Turfs.<br>
        • Turf venue CRUD operations and interactive visual calendar to block slots for maintenance.
      </p>

      <div class="page-num">23</div>
    </div>
  </div>

  <!-- ==================== PAGE 24: 6.3 FOLDER STRUCTURE ==================== -->
  <div class="page">
    <div class="page-border">
      <h3 class="section-heading">6.3| FOLDER STRUCTURE OF WEBSITE:</h3>
      <p class="body-text">
        The project repository is organized in a clean, modular structure allowing easy code maintenance, separation of concerns, and instant static web deployment:
      </p>

      <pre class="folder-tree">
ShashikantTurf/
├── Admin/
│   ├── calender.html               [Turf Slot Availability & Block Calendar]
│   ├── dashboard.html              [Executive Operations & Revenue Dashboard]
│   ├── manage-turfs.html           [Turf Inventory Addition & Deletion Desk]
│   ├── css/
│   │   ├── admin.css               [Admin Layout, Stat Cards & Table Styles]
│   │   ├── auth.css                [Login & Registration Form Styles]
│   │   ├── booking.css             [Slot Ribbon, Grid & Pill Button Styles]
│   │   └── style.css               [Global Dark Neon-Green Theme System]
│   └── js/
│       ├── admin.js                [Admin Operations, CRUD & Slot Blocking]
│       ├── auth.js                 [Dual-Role Authentication Controller]
│       ├── booking.js              [Dynamic Slot Selection & GST Calculator]
│       ├── main.js                 [Core LocalStorage Database & State Engine]
│       ├── turfs.js                [Turf Catalog Filter & Search Controller]
│       ├── user.js                 [Player Reservation History & Cancellation]
│       └── root project/
│           ├── checkout.html       [Payment Gateway Simulation & Pass]
│           ├── index.html          [Customer Landing & Search Hub]
│           ├── login.html          [User & Admin Access Login Portal]
│           ├── my-bookings.html    [Player Booking Ledger & Print Slip]
│           ├── register.html       [Player Registration Portal]
│           ├── turf-details.html   [Turf Slot Booking & Cost Estimator]
│           └── turfs.html          [Full Arena Catalog with Filters]
├── report/
│   └── Shashikant_Turf_Blackbook_Done.pdf [Project Report & Black Book]
└── readme.md                       [Project Documentation & Overview]
      </pre>

      <div class="page-num">24</div>
    </div>
  </div>

  <!-- ==================== PAGE 25: CHAPTER 7: TESTING ==================== -->
  <div class="page">
    <div class="page-border">
      <h2 class="chapter-heading">CHAPTER 7: TESTING</h2>

      <h3 class="section-heading">7.1| WHAT IS TESTING:</h3>
      <p class="body-text">
        Software Testing is the process of evaluating a software application to ensure that it works correctly, meets specified requirements, and is free of defects or operational errors. The main goal of testing is to identify any bugs or inconsistencies in the system before it is deployed to end-users.
      </p>

      <p class="body-text">
        Testing helps verify that the developed software performs as expected in different scenarios and delivers the desired outputs with high reliability, precision, and efficiency.
      </p>

      <h3 class="section-heading">OBJECTIVES OF SOFTWARE TESTING:</h3>
      <ul class="bullet-list">
        <li>1. To detect logic defects, layout anomalies, and calculation errors before deployment.</li>
        <li>2. To ensure that the platform satisfies all user functional requirements and sports arena workflows.</li>
        <li>3. To improve system responsiveness, pricing accuracy, and data consistency.</li>
        <li>4. To verify and validate dual-role workflows across Player and Admin portals.</li>
        <li>5. To reduce post-deployment maintenance efforts by fixing edge cases early.</li>
      </ul>

      <h3 class="section-heading">TYPES OF SOFTWARE TESTING PERFORMED:</h3>
      <ul class="bullet-list">
        <li>
          <strong>Manual Testing:</strong> Executed by testers without automation scripts to inspect button clicks, date ribbon switching, modal popups, and layout responsiveness.
        </li>
        <li>
          <strong>Functional Testing:</strong> Tested each specific feature (slot selection, double-booking prevention, 18% GST calculation, receipt printing) individually.
        </li>
        <li>
          <strong>Integration Testing:</strong> Verified real-time data persistence and synchronization between Customer booking screens and the Admin dashboard via LocalStorage.
        </li>
      </ul>

      <div class="page-num">25</div>
    </div>
  </div>

  <!-- ==================== PAGE 26: 7.3 TEST CASES MATRIX (TC01 TO TC08) ==================== -->
  <div class="page">
    <div class="page-border">
      <h3 class="section-heading">7.3| TEST CASES MATRIX (TC01 TO TC08):</h3>

      <table class="report-table" style="margin-top: 15px; font-size: 8.8pt;">
        <thead>
          <tr>
            <th style="width: 8%;">Test Case ID</th>
            <th style="width: 18%;">Test Case Description</th>
            <th style="width: 24%;">Test Steps</th>
            <th style="width: 18%;">Test Data</th>
            <th style="width: 24%;">Expected Result</th>
            <th style="width: 8%;">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>TC01</strong></td>
            <td>Player Account Registration</td>
            <td>Enter valid name, email, phone & password; submit form</td>
            <td>Rohan, rohan@gmail.com, 9820011223</td>
            <td>Account saved in LocalStorage; redirected to portal</td>
            <td style="color:green; font-weight:bold;">Pass</td>
          </tr>
          <tr>
            <td><strong>TC02</strong></td>
            <td>Dual Role Login Switch</td>
            <td>Select 'Admin' tab, enter admin credentials</td>
            <td>admin@turf.com, Admin123</td>
            <td>Authenticated as Admin; redirected to admin/dashboard.html</td>
            <td style="color:green; font-weight:bold;">Pass</td>
          </tr>
          <tr>
            <td><strong>TC03</strong></td>
            <td>Turf Catalog Sport Filter</td>
            <td>Select 'Football' from sport dropdown filter</td>
            <td>Sport: 'Football'</td>
            <td>Grid updates displaying only Football turfs (KickOff, Apex)</td>
            <td style="color:green; font-weight:bold;">Pass</td>
          </tr>
          <tr>
            <td><strong>TC04</strong></td>
            <td>Live Keyword Location Search</td>
            <td>Type location keyword in search bar</td>
            <td>Query: 'Bandra'</td>
            <td>Dynamically displays 'Skyline Rooftop Turf' matching query</td>
            <td style="color:green; font-weight:bold;">Pass</td>
          </tr>
          <tr>
            <td><strong>TC05</strong></td>
            <td>7-Day Date Ribbon Switching</td>
            <td>Click on future date pill (e.g. +2 days)</td>
            <td>Date: Tomorrow</td>
            <td>Pill highlights in green; slot grid refreshes for that date</td>
            <td style="color:green; font-weight:bold;">Pass</td>
          </tr>
          <tr>
            <td><strong>TC06</strong></td>
            <td>Time Slot Selection & Cost Calc</td>
            <td>Click available slot chip (07:00 PM - 08:00 PM)</td>
            <td>Slot: 07:00 PM, Base: ₹1,200</td>
            <td>Slot highlights; Total updates Base + 18% GST (₹216) + Fee</td>
            <td style="color:green; font-weight:bold;">Pass</td>
          </tr>
          <tr>
            <td><strong>TC07</strong></td>
            <td>Checkout & Payment Simulation</td>
            <td>Select UPI mode, click 'Confirm Booking'</td>
            <td>UPI ID: rohan@okhdfc</td>
            <td>Success modal displays Booking ID; saved to storage</td>
            <td style="color:green; font-weight:bold;">Pass</td>
          </tr>
          <tr>
            <td><strong>TC08</strong></td>
            <td>Double Booking Prevention</td>
            <td>Attempt to select an already reserved time slot</td>
            <td>Slot: 07:00 PM (Booked)</td>
            <td>Slot rendered disabled in red; selection blocked</td>
            <td style="color:green; font-weight:bold;">Pass</td>
          </tr>
        </tbody>
      </table>

      <div class="page-num">26</div>
    </div>
  </div>

  <!-- ==================== PAGE 27: 7.3 TEST CASES MATRIX (CONTINUED) ==================== -->
  <div class="page">
    <div class="page-border">
      <h3 class="section-heading">7.3| TEST CASES MATRIX (CONTINUED - TC09 TO TC15):</h3>

      <table class="report-table" style="margin-top: 15px; font-size: 8.8pt;">
        <thead>
          <tr>
            <th style="width: 8%;">Test Case ID</th>
            <th style="width: 18%;">Test Case Description</th>
            <th style="width: 24%;">Test Steps</th>
            <th style="width: 18%;">Test Data</th>
            <th style="width: 24%;">Expected Result</th>
            <th style="width: 8%;">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>TC09</strong></td>
            <td>My Bookings Ledger Display</td>
            <td>Navigate to 'My Bookings' page after reservation</td>
            <td>Active user session</td>
            <td>Reservation card appears with 'Confirmed' badge & date</td>
            <td style="color:green; font-weight:bold;">Pass</td>
          </tr>
          <tr>
            <td><strong>TC10</strong></td>
            <td>Player Slot Cancellation</td>
            <td>Click 'Cancel Slot' on active booking card</td>
            <td>Booking ID: #BK-8291</td>
            <td>Confirmation prompt shown; badge toggles to Cancelled</td>
            <td style="color:green; font-weight:bold;">Pass</td>
          </tr>
          <tr>
            <td><strong>TC11</strong></td>
            <td>Admin Revenue KPI Metrics</td>
            <td>Open Admin Dashboard after new reservation</td>
            <td>Ledger verification</td>
            <td>Total Gross Revenue and Total Bookings counters update</td>
            <td style="color:green; font-weight:bold;">Pass</td>
          </tr>
          <tr>
            <td><strong>TC12</strong></td>
            <td>Admin Add New Turf Venue</td>
            <td>Submit Add Turf modal form with arena data</td>
            <td>Turf: 'Metro Arena', ₹1,400/hr</td>
            <td>New venue saved to catalog; appears in admin table</td>
            <td style="color:green; font-weight:bold;">Pass</td>
          </tr>
          <tr>
            <td><strong>TC13</strong></td>
            <td>Admin Turf Venue Deletion</td>
            <td>Click 'Delete' on turf row in manage-turfs.html</td>
            <td>Turf ID: TRF-103</td>
            <td>Turf removed from database; table row deleted</td>
            <td style="color:green; font-weight:bold;">Pass</td>
          </tr>
          <tr>
            <td><strong>TC14</strong></td>
            <td>Admin Calendar Slot Block</td>
            <td>Select venue and date; click 'Block Slot'</td>
            <td>KickOff, Today, 08:00 AM</td>
            <td>Slot state toggles to 'Booked / Locked'; saved to storage</td>
            <td style="color:green; font-weight:bold;">Pass</td>
          </tr>
          <tr>
            <td><strong>TC15</strong></td>
            <td>Responsive Mobile Viewport</td>
            <td>Resize browser window to mobile width (375px)</td>
            <td>Viewport: 375px</td>
            <td>Layout stacks cleanly; date ribbon scrolls horizontally</td>
            <td style="color:green; font-weight:bold;">Pass</td>
          </tr>
        </tbody>
      </table>

      <div class="page-num">27</div>
    </div>
  </div>

  <!-- ==================== PAGE 28: CHAPTER 8: DIAGRAMS (FIG 8.1) ==================== -->
  <div class="page">
    <div class="page-border">
      <h2 class="chapter-heading">CHAPTER 8: DIAGRAMS</h2>

      <h3 class="section-heading">8.1| FLOWCHART OF MAIN WEBSITE:</h3>
      <p class="body-text">
        The following diagram illustrates the functional workflow connecting the customer reservation portal, dynamic slot booking engine, and the administrative arena command center:
      </p>

      <div class="diagram-frame" style="margin-top: 30px; margin-bottom: 25px;">
        <img src="{fig8_1}" alt="Functional Flowchart of Shashikant Turf" style="max-height: 400px;">
      </div>

      <p class="diagram-caption">Figure 8.1: Functional Flowchart of Shashikant Turf Platform</p>

      <div class="page-num">28</div>
    </div>
  </div>

  <!-- ==================== PAGE 29: FIG 8.2 FLOWCHART ==================== -->
  <div class="page">
    <div class="page-border">
      <h3 class="section-heading">8.2| FLOWCHART OF SLOT RESERVATION & BOOKING ENGINE:</h3>
      <p class="body-text">
        The slot reservation engine operates on a real-time validation track ensuring immediate slot status updates, automated 18% GST calculation, and double-booking prevention:
      </p>

      <div class="diagram-frame" style="margin-top: 35px; margin-bottom: 25px;">
        <img src="{fig8_2}" alt="Slot Reservation Logic Flowchart" style="max-height: 400px;">
      </div>

      <p class="diagram-caption">Figure 8.2: Dynamic Slot Reservation & Booking Engine Logic Flow</p>

      <div class="page-num">29</div>
    </div>
  </div>

  <!-- ==================== PAGE 30: CHAPTER 9: SNAPSHOTS (FIG 9.1) ==================== -->
  <div class="page">
    <div class="page-border">
      <h2 class="chapter-heading">CHAPTER 9: SNAPSHOTS</h2>

      <h3 class="section-heading">9.1| PROJECT EXPLORER & ARCHITECTURE STRUCTURE:</h3>
      <p class="body-text">
        The following screenshot displays the complete project workspace hierarchy within Visual Studio Code, showcasing the clean modular decomposition across styles, JavaScript controllers, and dashboard markup:
      </p>

      <div class="diagram-frame" style="margin-top: 20px; margin-bottom: 15px;">
        <img src="{fig9_1}" alt="VS Code Workspace Project Explorer" style="max-height: 440px;">
      </div>

      <p class="diagram-caption">Figure 9.1: Shashikant Turf Workspace Project Explorer in Visual Studio Code</p>

      <div class="page-num">30</div>
    </div>
  </div>

  <!-- ==================== PAGE 31: FIG 9.2 SNAPSHOT ==================== -->
  <div class="page">
    <div class="page-border">
      <h3 class="section-heading">9.2| CUSTOMER HOME & TURF DISCOVERY PORTAL:</h3>
      <p class="body-text">
        The customer landing interface featuring the live search widget, sport filtering options, and featured sports arenas across Mumbai (KickOff Grand Arena, Skyline Rooftop Turf, Striker's Hub Multisport, and Apex International Arena):
      </p>

      <div class="diagram-frame" style="margin-top: 30px; margin-bottom: 20px;">
        <img src="{fig9_2}" alt="Customer Home Portal" style="max-height: 400px;">
      </div>

      <p class="diagram-caption">Figure 9.2: Customer Home Landing & Turf Discovery Portal</p>

      <div class="page-num">31</div>
    </div>
  </div>

  <!-- ==================== PAGE 32: FIG 9.3 SNAPSHOT ==================== -->
  <div class="page">
    <div class="page-border">
      <h3 class="section-heading">9.3| DYNAMIC DATE RIBBON & SLOT BOOKING INTERFACE:</h3>
      <p class="body-text">
        The interactive slot reservation screen deployed at <code>turf-details.html</code>, featuring the 7-day date ribbon, multi-tier slot layout (Morning, Evening, Floodlit Night), and live pricing summary card with 18% GST tax computation:
      </p>

      <div class="diagram-frame" style="margin-top: 30px; margin-bottom: 20px;">
        <img src="{fig9_3}" alt="Slot Booking Interface" style="max-height: 400px;">
      </div>

      <p class="diagram-caption">Figure 9.3: Dynamic Date Ribbon & Slot Booking Interface with Live Cost Calculation</p>

      <div class="page-num">32</div>
    </div>
  </div>

  <!-- ==================== PAGE 33: FIG 9.4 SNAPSHOT ==================== -->
  <div class="page">
    <div class="page-border">
      <h3 class="section-heading">9.4| ADMIN OPERATIONS COMMAND CENTER & REVENUE DASHBOARD:</h3>
      <p class="body-text">
        The executive arena management dashboard utilized by turf managers, highlighting real-time KPI stat cards (Total Gross Revenue, Total Bookings, Today's Bookings, Active Turfs) and the recent reservation table with admin cancellation controls:
      </p>

      <div class="diagram-frame" style="margin-top: 30px; margin-bottom: 20px;">
        <img src="{fig9_4}" alt="Admin Operations Dashboard" style="max-height: 400px;">
      </div>

      <p class="diagram-caption">Figure 9.4: Admin Operations Command Center & Revenue Analytics Dashboard</p>

      <div class="page-num">33</div>
    </div>
  </div>

  <!-- ==================== PAGE 34: CHAPTER 10: CONCLUSION ==================== -->
  <div class="page">
    <div class="page-border">
      <h2 class="chapter-heading">CHAPTER 10: CONCLUSION</h2>

      <h3 class="section-heading">10.1| CONCLUSION:</h3>
      <p class="body-text">
        The development of the <strong>Shashikant Turf Website</strong> has been a significant milestone toward digitalizing sports facility operations and bridging communication between sports players and arena administrators. The platform successfully delivers an intuitive online reservation medium where players can discover athletic turfs, inspect pitch dimensions, reserve hourly slots with transparent GST pricing, and manage booking receipts effortlessly.
      </p>

      <p class="body-text">
        Through this project, the development team gained invaluable practical experience in modern front-end engineering using technologies such as semantic HTML5, modern CSS3 glassmorphism, Vanilla JavaScript (ES6+), and the HTML5 LocalStorage API. The project strengthened practical understanding of responsive UI grid design, client-side relational data persistence, event-driven state updates, and modular software architecture.
      </p>

      <p class="body-text">
        The website's design prioritizes speed, operational simplicity, accessibility, and high performance. By eliminating archaic paper logbooks and unorganized telephone calls, the platform prevents double-booking disputes, maximizes arena occupancy rates, and provides complete financial transparency for turf owners through real-time turnover analytics.
      </p>

      <p class="body-text">
        In conclusion, the Shashikant Turf Website fulfills all its intended functional and technical objectives, providing a professional, user-friendly, and dependable digital platform for recreational sports complexes. It establishes a strong technological foundation for future commercial enhancements and smart arena innovations.
      </p>

      <div class="page-num">34</div>
    </div>
  </div>

  <!-- ==================== PAGE 35: 10.2 FUTURE SCOPE & 10.3 REFERENCES ==================== -->
  <div class="page">
    <div class="page-border">
      <h3 class="section-heading">10.2| FUTURE SCOPE:</h3>
      <p class="body-text">
        The Shashikant Turf platform has been developed with the core goal of providing a robust digital booking system for sports arenas. However, web technology and sports infrastructure are constantly evolving, and there is significant opportunity to expand the system's capabilities through emerging technologies:
      </p>

      <ul class="bullet-list">
        <li>
          <strong>1. Live Payment Gateway Integration:</strong> Implement production payment webhooks (such as Razorpay, UPI Intent, PayTM, and Net Banking) to collect online deposits seamlessly.
        </li>
        <li>
          <strong>2. Automated WhatsApp Cloud API Alerts:</strong> Dispatch real-time booking confirmation passes with entry QR codes directly to players' WhatsApp accounts.
        </li>
        <li>
          <strong>3. IoT Smart Floodlight Automation:</strong> Connect turf lighting relays and electronic gate barriers via IoT microcontrollers to automatically power floodlights during booked hours only.
        </li>
        <li>
          <strong>4. AI-Driven Dynamic Surge Pricing:</strong> Leverage machine learning algorithms to optimize hourly pricing based on weekend demand, rain forecasts, and historical occupancy.
        </li>
        <li>
          <strong>5. Native Mobile Applications:</strong> Extend the platform's functionality into native Android and iOS mobile applications using cross-platform frameworks like Flutter or React Native.
        </li>
      </ul>

      <h3 class="section-heading" style="margin-top: 25px;">10.3| REFERENCES:</h3>
      <ul class="bullet-list">
        <li>➤ <strong>For Code Versioning & Storage:</strong> https://github.com/</li>
        <li>➤ <strong>For Web Standards & Documentation:</strong> https://developer.mozilla.org/</li>
        <li>➤ <strong>For Modern CSS Layouts & Flexbox:</strong> https://www.w3.org/</li>
        <li>➤ <strong>For Development Environment (VS Code):</strong> https://code.visualstudio.com/</li>
        <li>➤ <strong>For Project Guidelines:</strong> Department of Information Technology, Government Polytechnic Mumbai</li>
      </ul>

      <div class="page-num">35</div>
    </div>
  </div>

</body>
</html>
"""

report_html_path = r'c:\Users\Sharvari\OneDrive\Desktop\ShashikantTurf\report\Shashikant_Turf_Project_Report.html'
with open(report_html_path, 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f"HTML Report generated at: {report_html_path}")

# Now render to PDF using Edge Headless
report_pdf_path = r'c:\Users\Sharvari\OneDrive\Desktop\ShashikantTurf\report\Shashikant_Turf_Blackbook_Done.pdf'
edge_exe = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

cmd = [
    edge_exe,
    '--headless',
    '--disable-gpu',
    '--no-pdf-header-footer',
    f'--print-to-pdf={report_pdf_path}',
    report_html_path
]

print("Converting HTML to PDF via Edge headless...")
res = subprocess.run(cmd, capture_output=True, text=True)
print("Return code:", res.returncode)

if os.path.exists(report_pdf_path):
    doc = pymupdf.open(report_pdf_path)
    print(f"SUCCESS! PDF created with {len(doc)} pages! File size: {os.path.getsize(report_pdf_path)} bytes")
else:
    print("PDF generation failed. Stderr:", res.stderr)
