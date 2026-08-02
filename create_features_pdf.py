import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#1A1A1A"))
        
        # Header (on pages after cover)
        if self._pageNumber > 1:
            self.drawString(54, 750, "AI BRAND ARCHITECT — PLATFORM FEATURES & ROADMAP DOCUMENT")
            self.setStrokeColor(colors.HexColor("#DFAC6C"))
            self.setLineWidth(0.75)
            self.line(54, 742, 612 - 54, 742)
            
        # Footer
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#666666"))
        self.drawString(54, 36, "Confidential — Executive Product Documentation | Capstone Group 1")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(612 - 54, 36, page_str)
        self.setStrokeColor(colors.HexColor("#E5E5E5"))
        self.setLineWidth(0.5)
        self.line(54, 48, 612 - 54, 48)
        
        self.restoreState()

def build_pdf(filename="AI_Brand_Architect_Features_Document.pdf"):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    pdf_path = os.path.join(script_dir, filename)
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=64,
        bottomMargin=64
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=30,
        textColor=colors.HexColor("#DFAC6C"),
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#444444"),
        spaceAfter=14
    )
    
    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#0D0D0D"),
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#DFAC6C"),
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=colors.HexColor("#333333"),
        spaceAfter=6
    )
    
    bullet_style = ParagraphStyle(
        'BulletText',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )
    
    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1A2530")
    )
    
    story = []

    # ── TITLE HEADER BLOCK ──
    story.append(Paragraph("AI BRAND ARCHITECT", title_style))
    story.append(Paragraph("Automated Virtual Branding Suite & Technical Architecture", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#DFAC6C"), spaceBefore=2, spaceAfter=14))

    # ── SECTION 1: ABOUT THE PLATFORM OVERVIEW ──
    story.append(Paragraph("1. About the Platform & Executive Overview", h1_style))
    story.append(Paragraph(
        "<b>AI Brand Architect</b> is an enterprise-grade, AI-powered automated branding platform. "
        "Traditional brand identity development requires hiring branding agencies, graphic designers, copywriters, and strategists—a "
        "process taking 4 to 8 weeks and costing thousands of dollars. AI Brand Architect eliminates this friction by operating as a <b>24/7 Virtual Brand Manager</b> "
        "that generates complete, agency-grade visual identities, typography specifications, marketing campaign hooks, and brand guidelines in seconds.",
        body_style
    ))
    
    callout_data = [[
        Paragraph("<b>Core Mission:</b> Democratize agency-level corporate identity generation for startups, enterprises, and growth teams through intelligent AI prompt synthesis, kinetic visual engines, and real-time asset rendering.", callout_style)
    ]]
    callout_table = Table(callout_data, colWidths=[504])
    callout_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FFFDF7")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#DFAC6C")),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(callout_table)
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("Platform Design Architecture & Aesthetics:", h2_style))
    story.append(Paragraph("• <b>High-End Visual Identity:</b> Crafted with a luxurious dark-mode palette (#0D0D0D base with #DFAC6C gold accents and #FFF0D0 highlights).", bullet_style))
    story.append(Paragraph("• <b>Kinetic Canvas Background:</b> Custom mathematical particle/canvas engine creating a fluid, interactive visual backdrop.", bullet_style))
    story.append(Paragraph("• <b>Glassmorphism & Micro-Animations:</b> Modern CSS backdrop filters, smooth scroll reveals, floating navigation elements, and micro-hover states.", bullet_style))
    story.append(Paragraph("• <b>Dual Navigation System:</b> Instant sticky header navigation paired with an immersive, full-screen luxury overlay drawer.", bullet_style))
    
    story.append(Spacer(1, 12))

    # ── SECTION 2: COMPLETE FEATURE-BY-FEATURE BREAKDOWN ──
    story.append(Paragraph("2. Detailed Feature-by-Feature Breakdown", h1_style))
    story.append(Paragraph("Below is a comprehensive breakdown of every individual feature and subsystem integrated into the AI Brand Architect platform and Test Suite:", body_style))
    
    features = [
        ("Feature 1: AI Slogan & Tagline Generator",
         "Generates memorable, high-impact brand slogans tailored to the business overview, industry niche, and emotional tone. Uses a hybrid approach combining Hugging Face AI models with an integrated dataset of 500+ curated high-performing slogans for instant fallbacks."),
        
        ("Feature 2: Typography & Google Font Pairing Engine",
         "Analyzes brand personality (e.g., Minimalist, Luxury, Bold, Modern, Tech) and curates harmonized Google Font pairings. Assigns dedicated roles (Header Font & Body Font) with live interactive previews and direct CSS CDN import links."),
        
        ("Feature 3: Color Palette Harmonizer & Contrast Tester",
         "Generates 4-color cohesive corporate color palettes (Primary, Secondary, Accent, Neutral). Includes hex code copies, live color swatches, and automated WCAG contrast validation to ensure legibility and accessibility."),
        
        ("Feature 4: High-Converting Campaign Hook Generator",
         "Formulates tailored social media campaign captions, ad hooks, call-to-action statements, and predicted engagement metrics across major platforms (Instagram, LinkedIn, X, Meta Ads)."),
        
        ("Feature 5: Executive Strategy & Market Positioning Generator",
         "Synthesizes strategic brand positioning statements, target demographic personas, key market differentiators, and brand voice guidelines to establish corporate market authority."),
        
        ("Feature 6: Global Multi-Market Translation Engine",
         "Translates brand taglines and messaging into major international languages (Spanish, French, German, Japanese, Mandarin, etc.) while preserving emotional tone and brand intent."),
        
        ("Feature 7: Interactive Kinetic Mark & Emblem Studio",
         "An interactive visual studio featuring a kinetic SVG canvas engine. Renders animated brand emblems with customizable geometry, dynamic color synchronization, scale controls, and live rotation speed adjustment."),
        
        ("Feature 8: Automated PDF Brand Book & Asset Exporter",
         "Generates an official, publication-ready PDF Brand Book complete with typography rules, color swatches, slogans, and strategic guidelines. Also exports a full ZIP bundle containing all brand assets."),
        
        ("Feature 9: Obfuscated API Key Management Suite",
         "Features client-side API Key storage in browser localStorage, paired with Base64 key obfuscation (atob decoding) to prevent GitHub/Hugging Face automated secret scanners from revoking test keys on push."),
        
        ("Feature 10: System Telemetry & Live Debug Log Console",
         "Includes an inline executive telemetry drawer that logs API request statuses, network latency, prompt payload details, and system events in real time for effortless troubleshooting.")
    ]
    
    for title, desc in features:
        feature_data = [
            [Paragraph(f"<b>{title}</b>", ParagraphStyle('FTitle', parent=body_style, fontName='Helvetica-Bold', fontSize=9.5, textColor=colors.HexColor("#0D0D0D")))],
            [Paragraph(desc, body_style)]
        ]
        feature_table = Table(feature_data, colWidths=[504])
        feature_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FAFAFA")),
            ('BOX', (0,0), (-1,-1), 0.75, colors.HexColor("#E0D8C8")),
            ('LINEBELOW', (0,0), (-1,0), 0.5, colors.HexColor("#DFAC6C")),
            ('PADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(feature_table)
        story.append(Spacer(1, 6))

    story.append(Spacer(1, 10))

    # ── SECTION 3: FUTURE UPGRADES & PRODUCT ROADMAP ──
    story.append(Paragraph("3. Future Upgrades & Technical Roadmap", h1_style))
    story.append(Paragraph("The platform architecture is designed for multi-phase expansion. Planned future upgrades include:", body_style))
    
    roadmap_items = [
        ("Phase 1: Real-Time Vector SVG Logo Generator", "Integration of AI vector drawing models to generate fully customizable, resolution-independent SVG logo marks directly on the kinetic canvas."),
        ("Phase 2: AI Voiceover & Motion Video Campaign Studio", "Synthesizing AI video reels, audio voiceovers, and animated social media ads using custom brand voice profiles."),
        ("Phase 3: Multi-User Cloud Workspace & Team Governance", "Enterprise collaboration features allowing multi-member teams to comment, edit, and approve brand guidelines with role-based access control."),
        ("Phase 4: Autonomous Brand Consistency Auditor", "An automated web crawler and browser extension that scans existing company websites and social profiles to detect brand guidelines violations and color/font inconsistencies."),
        ("Phase 5: Industry-Specific Fine-Tuned LLM Engine", "Training proprietary fine-tuned small language models specifically tailored for SaaS, FinTech, E-Commerce, and Luxury Fashion branding.")
    ]
    
    roadmap_data = [
        [Paragraph("<b>Phase / Upgrade</b>", ParagraphStyle('RHeader', parent=body_style, fontName='Helvetica-Bold', textColor=colors.HexColor("#DFAC6C"))),
         Paragraph("<b>Technical Scope & Deliverables</b>", ParagraphStyle('RHeader2', parent=body_style, fontName='Helvetica-Bold', textColor=colors.HexColor("#DFAC6C")))]
    ]
    
    for phase, detail in roadmap_items:
        roadmap_data.append([
            Paragraph(f"<b>{phase}</b>", ParagraphStyle('RPhase', parent=body_style, fontName='Helvetica-Bold', fontSize=8.5, textColor=colors.HexColor("#1A1A1A"))),
            Paragraph(detail, body_style)
        ])
        
    roadmap_table = Table(roadmap_data, colWidths=[150, 354])
    roadmap_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0D0D0D")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor("#DFAC6C")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E0E0E0")),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#FFFFFF")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#FFFFFF"), colors.HexColor("#F9F9F9")]),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'TOP')
    ]))
    story.append(roadmap_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated at: {pdf_path}")

if __name__ == "__main__":
    build_pdf()
