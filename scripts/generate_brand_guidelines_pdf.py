#!/usr/bin/env python3
"""Generate Daily Standard Brand Guidelines PDF — matches BRAND_GUIDELINES.md."""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak,
    HRFlowable,
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.graphics.shapes import Drawing, Rect, String

DARK = colors.HexColor("#2C2C2C")
CREAM = colors.HexColor("#F5F2ED")
OLIVE = colors.HexColor("#4A6741")
WARM_GRAY = colors.HexColor("#6B6560")
LIGHT_WARM = colors.HexColor("#E8E4DC")
STONE = colors.HexColor("#A8A29E")
WHITE = colors.HexColor("#FFFFFF")


def main():
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_path = os.path.join(base, "docs", "BRAND_GUIDELINES.pdf")

    doc = SimpleDocTemplate(
        out_path, pagesize=letter,
        rightMargin=0.7 * inch, leftMargin=0.7 * inch,
        topMargin=0.7 * inch, bottomMargin=0.7 * inch,
    )
    story = []

    title_style = ParagraphStyle("Title", fontName="Helvetica-Bold", fontSize=24, spaceAfter=2, textColor=DARK)
    subtitle_style = ParagraphStyle("Subtitle", fontName="Helvetica", fontSize=11, textColor=WARM_GRAY, spaceAfter=14)
    h1 = ParagraphStyle("H1", fontName="Helvetica-Bold", fontSize=15, spaceBefore=18, spaceAfter=6, textColor=OLIVE)
    h2 = ParagraphStyle("H2", fontName="Helvetica-Bold", fontSize=11, spaceBefore=12, spaceAfter=4, textColor=DARK)
    body = ParagraphStyle("Body", fontName="Helvetica", fontSize=9.5, leading=13, textColor=DARK)
    bullet = ParagraphStyle("Bullet", parent=body, leftIndent=16, bulletIndent=0, spaceBefore=2)
    quote = ParagraphStyle("Quote", fontName="Helvetica-Oblique", fontSize=10, leading=14,
                           textColor=DARK, spaceBefore=4, spaceAfter=4, leftIndent=20)

    def sp(h=0.12): return Spacer(1, h * inch)
    def hr(): return HRFlowable(width="100%", thickness=0.5, color=LIGHT_WARM, spaceBefore=6, spaceAfter=6)

    def tbl(data, col_widths=None):
        if col_widths is None:
            col_widths = [1.5 * inch, 4.5 * inch]
        wrapped = []
        for row in data:
            wrapped.append([Paragraph(str(c), body) for c in row])
        t = Table(wrapped, colWidths=col_widths)
        t.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), DARK),
            ("TEXTCOLOR", (0, 0), (-1, 0), CREAM),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 6),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 1), (-1, -1), 4),
            ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#FAFAF7")),
            ("GRID", (0, 0), (-1, -1), 0.3, LIGHT_WARM),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ]))
        return t

    def color_swatch_row():
        d = Drawing(470, 50)
        swatches = [
            (CREAM, "#F5F2ED", "Cream"),
            (DARK, "#2C2C2C", "Near Black"),
            (OLIVE, "#4A6741", "Olive"),
            (WARM_GRAY, "#6B6560", "Warm Gray"),
            (LIGHT_WARM, "#E8E4DC", "Light Warm"),
            (STONE, "#A8A29E", "Stone"),
        ]
        x = 0
        for color, hex_val, name in swatches:
            d.add(Rect(x, 15, 65, 35, fillColor=color, strokeColor=LIGHT_WARM, strokeWidth=0.5))
            text_color = CREAM if color in (DARK, OLIVE, WARM_GRAY) else DARK
            d.add(String(x + 32, 28, hex_val, fontSize=6, fillColor=text_color, textAnchor="middle",
                         fontName="Helvetica"))
            d.add(String(x + 32, 3, name, fontSize=7, fillColor=DARK, textAnchor="middle",
                         fontName="Helvetica"))
            x += 78
        return d

    # =========================================================================
    # TITLE PAGE
    # =========================================================================
    story.append(Paragraph("Daily Standard", title_style))
    story.append(Paragraph("Brand Guidelines v1.0", ParagraphStyle("T2", fontName="Helvetica",
                            fontSize=14, textColor=WARM_GRAY, spaceAfter=4)))
    story.append(Paragraph("February 2026", subtitle_style))
    story.append(hr())

    # =========================================================================
    # 1. BRAND OVERVIEW
    # =========================================================================
    story.append(Paragraph("1. Brand Overview", h1))
    story.append(Paragraph("<b>Name:</b> Daily Standard", body))
    story.append(Paragraph("<b>Category:</b> Daily Strength Nutrition", body))
    story.append(Paragraph("<b>Product:</b> Clear Grass-Fed Whey Protein Isolate", body))
    story.append(sp(0.05))
    story.append(Paragraph("<b>Tagline candidates</b> (select one for launch):", body))
    for t in ["Built Daily. Not in One Session.",
              "Protein, not a personality.",
              "Fuel the man, not the ego.",
              "Skip the hype. Keep the strength.",
              "Strength is Daily.",
              "For the days you train. And the days you don't."]:
        story.append(Paragraph(t, bullet))
    story.append(sp(0.1))
    story.append(Paragraph("<b>Brand promise:</b> Every day protein for a dad that does not have the time to "
                           "take care of themselves as much as they would like to.", body))
    story.append(Paragraph('"Being a dad is hard... at least get your protein in."', quote))
    story.append(Paragraph("<b>Core differentiator:</b> Daily protein, not workout fuel.", body))
    story.append(sp(0.05))
    story.append(Paragraph("<b>Product in one line:</b> Clear grass-fed whey isolate. 20g protein. 80 calories. "
                           "5 ingredients. No artificial sweeteners. No gums. Mixes clear like juice "
                           "\u2014 not a thick shake.", body))

    # =========================================================================
    # 1b. PERSONA: STEVE
    # =========================================================================
    story.append(Paragraph("Persona: Steve", h1))
    story.append(Paragraph("Steve is our customer. Every decision runs through him.", body))
    story.append(sp(0.05))
    for item in [
        "Hardworking dad, has a good job, loves his kids",
        "Works out 2\u20133 times a week, but used to work out 6 times a week",
        "Not looking for perfect \u2014 he wants to take care of himself",
        "Watches trending shows on Netflix, watches trash with his wife, enjoys sports",
        "Age 28\u201350, millennial",
        "Skeptical of flashy supplements. Willing to pay for quality and trust.",
    ]:
        story.append(Paragraph(item, bullet))
    story.append(sp(0.05))
    story.append(Paragraph("<b>Steve wants:</b> daily strength, metabolic stability, energy, clean ingredients", body))
    story.append(Paragraph("<b>Steve does NOT want:</b> gym bro branding, candy-sweet shakes, artificial sweeteners, "
                           "complicated stacks, 'mass gain' vibes", body))

    story.append(PageBreak())

    # =========================================================================
    # 2. LOGO
    # =========================================================================
    story.append(Paragraph("2. Logo", h1))
    story.append(Paragraph("<b>Primary mark:</b> 'Daily Standard' wordmark in DM Sans Bold, tracked at -0.03em.", body))
    story.append(Paragraph("No icon or symbol for V1. The name carries the brand.", body))
    story.append(sp(0.05))
    story.append(Paragraph("<b>Color variations:</b>", body))
    story.append(Paragraph("Dark on light: #2C2C2C on #F5F2ED", bullet))
    story.append(Paragraph("Light on dark: #F5F2ED on #2C2C2C", bullet))
    story.append(Paragraph("Light on olive: #F5F2ED on #4A6741", bullet))
    story.append(sp(0.05))
    story.append(Paragraph("<b>Rules:</b> Never stretch, rotate, add effects, or use colors outside the palette. "
                           "Minimum clear space: height of the 'D' on all sides.", body))

    # =========================================================================
    # 3. COLORS
    # =========================================================================
    story.append(Paragraph("3. Color Palette", h1))
    story.append(color_swatch_row())
    story.append(sp(0.1))
    story.append(tbl([
        ["Color", "Hex", "Usage"],
        ["Cream", "#F5F2ED", "Primary background, light surfaces (70%)"],
        ["Near Black", "#2C2C2C", "Headlines, body text, primary buttons (20%)"],
        ["Muted Olive", "#4A6741", "Accent, CTAs, highlights (10%)"],
        ["Warm Gray", "#6B6560", "Subheadings, supporting text"],
        ["Light Warm", "#E8E4DC", "Cards, dividers, subtle backgrounds"],
        ["Stone", "#A8A29E", "Captions, placeholders, muted text"],
    ], col_widths=[1.2 * inch, 1 * inch, 3.8 * inch]))
    story.append(sp(0.05))
    story.append(Paragraph("<b>Never use:</b> Neon, red, orange, gradients, or pure black (#000000).", body))

    # =========================================================================
    # 4. TYPOGRAPHY
    # =========================================================================
    story.append(Paragraph("4. Typography", h1))
    story.append(Paragraph("<b>Font family:</b> DM Sans (Google Fonts, free, open-source)", body))
    story.append(sp(0.05))
    story.append(tbl([
        ["Element", "Size", "Weight", "Line Height"],
        ["H1", "48px (32px mobile)", "Bold", "1.15"],
        ["H2", "36px (28px mobile)", "Bold", "1.15"],
        ["H3", "24px (20px mobile)", "Bold", "1.2"],
        ["Body", "17px (16px mobile)", "Regular", "1.6"],
        ["Small / Caption", "13px", "Medium", "1.4"],
        ["Label / Tag", "13px uppercase", "SemiBold", "1.4"],
    ], col_widths=[1.5 * inch, 1.5 * inch, 1.2 * inch, 1.8 * inch]))

    story.append(PageBreak())

    # =========================================================================
    # 5. TONE OF VOICE
    # =========================================================================
    story.append(Paragraph("5. Tone of Voice", h1))
    story.append(Paragraph("<b>We are:</b>", body))
    for item in [
        "<b>Irreverent</b> \u2014 we don't take ourselves too seriously",
        "<b>Funny</b> \u2014 but never forced. If a joke doesn't land, cut it.",
        "<b>Honest</b> \u2014 we say what we mean. No marketing fluff.",
        "<b>Grounded</b> \u2014 masculine without being aggressive. Calm without being soft.",
        "<b>Clearly uncool... in a cool way</b> \u2014 we're dads. We own it.",
        "<b>TASTE matters</b> \u2014 if it doesn't taste good, nothing else matters. Light, clean, drinkable every day.",
        "<b>If it feels like we are trying, we stop and try again.</b>",
    ]:
        story.append(Paragraph(item, bullet))
    story.append(sp(0.1))

    story.append(Paragraph("<b>We are NOT:</b>", body))
    for item in [
        'Gym bro ("crush it," "beast mode," "gains")',
        'Preachy ("you should be doing this")',
        'Clinical ("scientifically formulated for optimal bioavailability")',
        "Try-hard (if it feels like effort, start over)",
        'Corporate ("we leverage synergies to deliver value")',
    ]:
        story.append(Paragraph(item, bullet))
    story.append(sp(0.1))

    story.append(Paragraph("<b>Voice test:</b> Would Steve say this to a friend at a BBQ?", body))
    story.append(Paragraph("If yes: ship it. If it sounds like a billboard: rewrite. "
                           "If it sounds like a gym poster: delete.", bullet))
    story.append(sp(0.1))
    story.append(tbl([
        ["Instead of...", "We say..."],
        ["Maximize your protein intake for optimal performance", "Just get your protein in."],
        ["Scientifically formulated grass-fed whey isolate", "5 ingredients. All of them real."],
        ["Fuel your gains", "Fuel the man, not the ego."],
        ["Join our community of elite athletes", "For dads who give a damn."],
        ["LIMITED TIME OFFER!!!", "Be first. Get it for less."],
    ]))

    # =========================================================================
    # 6. PRODUCT POSITIONING
    # =========================================================================
    story.append(Paragraph("6. Product Positioning", h1))

    story.append(Paragraph("What Daily Standard IS:", h2))
    for item in [
        "<b>Clear protein</b> \u2014 mixes like juice, not a thick shake",
        "Grass-fed whey protein isolate, triple-filtered, lactose-free",
        "20g protein, ~80 calories, 0g sugar per serving",
        "5 ingredients max \u2014 no exceptions",
        "No artificial sweeteners, no gums, no fillers",
        "Adult palate \u2014 light, clean sweetness. Not candy.",
        "Designed for <b>daily use</b> \u2014 not just gym days",
    ]:
        story.append(Paragraph(item, bullet))

    story.append(sp(0.1))
    story.append(Paragraph("What Daily Standard is NOT:", h2))
    for item in [
        "Not a mass gainer",
        "Not a meal replacement",
        "Not a thick, milky shake",
        "Not a pre-workout or energy supplement",
        "Not for bodybuilders \u2014 it's for dads who want to take care of themselves",
    ]:
        story.append(Paragraph(item, bullet))

    story.append(sp(0.1))
    story.append(Paragraph("<b>Emotional tone:</b> Masculine grounded. Calm premium. Long-term focused. "
                           "Not aggressive. Not soft. Not jokey.", body))

    story.append(PageBreak())

    # =========================================================================
    # 7. PHOTOGRAPHY
    # =========================================================================
    story.append(Paragraph("7. Photography &amp; Imagery", h1))
    story.append(Paragraph("<b>Do:</b> Natural light, real environments (kitchen counter, car cup holder, desk, "
                           "backyard), real dads with real bodies, candid moments, clean product shots on "
                           "simple surfaces.", body))
    story.append(sp(0.05))
    story.append(Paragraph("<b>Never:</b> Stock photos of muscular men, gym interiors, shaker bottles "
                           "dripping with sweat, 'before and after' shots, neon/sports lighting.", body))

    # =========================================================================
    # 8. PACKAGING
    # =========================================================================
    story.append(Paragraph("8. Packaging Design", h1))
    story.append(Paragraph("<b>Format:</b> Matte-finish stand-up resealable pouch", body))
    story.append(Paragraph("<b>Color:</b> Cream (#F5F2ED) or Near Black (#2C2C2C)", body))
    story.append(Paragraph("<b>Layout:</b> Clean, generous whitespace, minimal design", body))
    story.append(sp(0.1))

    story.append(Paragraph("Front Panel:", h2))
    story.append(Paragraph("DAILY STANDARD / [Flavor Name] / Clear Protein / "
                           "20g Protein \u00B7 80 Calories \u00B7 Zero Sugar / "
                           "Grass-Fed Whey Isolate / No Artificial Sweeteners \u00B7 No Gums / [Net Weight]", bullet))
    story.append(sp(0.1))

    story.append(Paragraph("Back Panel:", h2))
    story.append(Paragraph("Supplement Facts panel (FDA-compliant) / Ingredients list / "
                           "Allergen: Contains Milk / Brand story (2\u20133 sentences) / "
                           "cGMP + third-party testing callout / Lot #, Best By, Barcode / "
                           "Daily Standard LLC address + website", bullet))

    # =========================================================================
    # 9. DIGITAL
    # =========================================================================
    story.append(Paragraph("9. Digital Design", h1))
    story.append(Paragraph("<b>Website:</b> Cream background, white cards with subtle shadow, "
                           "Near Black buttons (Olive on hover), fixed blurred navigation.", body))
    story.append(sp(0.05))
    story.append(Paragraph("<b>Email:</b> Clean, text-forward. Cream background. Single CTA per email. "
                           "Tone like a note from a friend.", body))
    story.append(sp(0.05))
    story.append(Paragraph("<b>Social:</b> Muted natural tones. Founder-led video. "
                           "Phone-quality is fine (authentic over polished).", body))

    # =========================================================================
    # 10. CHECKLIST
    # =========================================================================
    story.append(Paragraph("10. Brand Application Checklist", h1))
    story.append(Paragraph("Before publishing any brand asset, verify:", body))
    for item in [
        "Uses only palette colors (no rogue colors)",
        "Uses DM Sans (correct weights)",
        "Tone matches voice guidelines (Steve BBQ test)",
        "No gym-bro language or imagery",
        "Logo has proper clear space",
        'Passes the "are we trying too hard?" test',
    ]:
        story.append(Paragraph(item, bullet))

    doc.build(story)
    print(f"PDF created: {out_path}")


if __name__ == "__main__":
    main()
