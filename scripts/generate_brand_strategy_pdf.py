#!/usr/bin/env python3
"""Generate Daily Standard Brand Strategy PDF — matches BRAND_STRATEGY.md."""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak,
    HRFlowable,
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors

DARK = colors.HexColor("#2C2C2C")
CREAM = colors.HexColor("#F5F2ED")
OLIVE = colors.HexColor("#4A6741")
WARM_GRAY = colors.HexColor("#6B6560")
LIGHT_WARM = colors.HexColor("#E8E4DC")


def main():
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_path = os.path.join(base, "docs", "BRAND_STRATEGY.pdf")

    doc = SimpleDocTemplate(
        out_path, pagesize=letter,
        rightMargin=0.7 * inch, leftMargin=0.7 * inch,
        topMargin=0.7 * inch, bottomMargin=0.7 * inch,
    )
    story = []

    title_style = ParagraphStyle("Title", fontName="Helvetica-Bold", fontSize=22, spaceAfter=2, textColor=DARK)
    subtitle_style = ParagraphStyle("Subtitle", fontName="Helvetica", fontSize=10, textColor=WARM_GRAY, spaceAfter=14)
    h1_style = ParagraphStyle("H1", fontName="Helvetica-Bold", fontSize=14, spaceBefore=18, spaceAfter=6,
                               textColor=OLIVE)
    h2_style = ParagraphStyle("H2", fontName="Helvetica-Bold", fontSize=11, spaceBefore=12, spaceAfter=4,
                               textColor=DARK)
    body = ParagraphStyle("Body", fontName="Helvetica", fontSize=9.5, leading=13, textColor=DARK)
    body_bold = ParagraphStyle("BodyBold", fontName="Helvetica-Bold", fontSize=9.5, leading=13, textColor=DARK)
    quote_style = ParagraphStyle("Quote", fontName="Helvetica-Oblique", fontSize=11, leading=14,
                                  textColor=DARK, spaceBefore=6, spaceAfter=6, leftIndent=20, rightIndent=20)
    bullet_style = ParagraphStyle("Bullet", parent=body, leftIndent=16, bulletIndent=0, spaceBefore=2)
    tagline_style = ParagraphStyle("Tagline", fontName="Helvetica", fontSize=10, leading=14,
                                    leftIndent=20, spaceBefore=3, spaceAfter=3, textColor=DARK)

    def h1(text): return Paragraph(text, h1_style)
    def h2(text): return Paragraph(text, h2_style)
    def p(text): return Paragraph(text, body)
    def pb(text): return Paragraph(text, body_bold)
    def bl(text): return Paragraph(text, bullet_style)
    def sp(h=0.12): return Spacer(1, h * inch)
    def hr(): return HRFlowable(width="100%", thickness=0.5, color=LIGHT_WARM, spaceBefore=8, spaceAfter=8)

    def tbl(data, col_widths=None):
        if col_widths is None:
            col_widths = [2 * inch, 4.3 * inch]
        wrapped = []
        for row in data:
            wrapped.append([Paragraph(str(c), body) for c in row])
        t = Table(wrapped, colWidths=col_widths)
        t.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), DARK),
            ("TEXTCOLOR", (0, 0), (-1, 0), CREAM),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 7),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 1), (-1, -1), 5),
            ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#FAFAF7")),
            ("GRID", (0, 0), (-1, -1), 0.4, LIGHT_WARM),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ]))
        return t

    # === TITLE ===
    story.append(Paragraph("Daily Standard", title_style))
    story.append(Paragraph("Brand Strategy", ParagraphStyle("T2", fontName="Helvetica", fontSize=16,
                                                              textColor=WARM_GRAY, spaceAfter=4)))
    story.append(Paragraph("February 2026 \u2014 Working Document", subtitle_style))
    story.append(hr())

    # === 1. BRAND NAME ===
    story.append(h1("1. Brand"))
    story.append(pb("Name: Daily Standard"))
    story.append(sp(0.05))

    # === 2. BRAND PROMISE ===
    story.append(h1("2. Brand Promise"))
    story.append(p("Every day protein for a dad that does not have the time to take care of themselves "
                    "as much as they would like to."))
    story.append(sp(0.08))
    story.append(Paragraph('"Being a dad is hard... at least get your protein in."', quote_style))

    # === 3. MARKET SIZING ===
    story.append(h1("3. Market Sizing"))
    story.append(tbl([
        ["Metric", "Value"],
        ["TAM", "34M dads with child under 15 in the house"],
        ["Price point", "$55"],
        ["Target penetration", "2% of TAM = 680,000 dads"],
        ["2% penetration x 2 purchases/year", "$74,800,000"],
        ["Profit goal", "$1,000,000"],
        ["Revenue needed (at 10% net profit)", "$10,000,000"],
        ["Units for $2M revenue goal", "181,818 units (at 50% margins = $1M profit)"],
        ["CAC", "TBD"],
    ]))

    story.append(PageBreak())

    # === 4. PERSONA ===
    story.append(h1("4. Persona: Steve"))
    for item in [
        "Hardworking dad, has a good job, loves his kids",
        "Works out 2\u20133 times a week, but used to work out 6 times a week",
        "He is not looking for perfect, but he wants to take care of himself",
        "Watches the latest trending shows on Netflix, watches trash with his wife, enjoys sports",
        "Loves his family",
        "Age 28\u201350, millennial",
    ]:
        story.append(bl(item))

    # === 5. WHO WE ARE ===
    story.append(h1("5. Who We Are"))
    for item in [
        "Focused specifically on dads",
        "Irreverent",
        "Funny",
        "TASTE matters",
        "We are clearly uncool... in a cool way",
        "If it feels like we are trying, we stop and try again",
    ]:
        story.append(bl(item))

    # === 6. TAGLINE CANDIDATES ===
    story.append(h1("6. Tagline Candidates"))
    for t in [
        "Built Daily. Not in One Session.",
        "Protein, not a personality.",
        "Fuel the man, not the ego.",
        "Skip the hype. Keep the strength.",
        "Strength is Daily.",
        "For the days you train. And the days you don't.",
    ]:
        story.append(Paragraph(t, tagline_style))

    # === 7. PRODUCT V1 ===
    story.append(h1("7. Product \u2014 V1"))
    story.append(pb("Format: Clear whey protein isolate (juice-like, not a thick shake)"))
    story.append(sp(0.08))
    story.append(tbl([
        ["Attribute", "Spec"],
        ["Protein per serving", "20g"],
        ["Calories per serving", "~80"],
        ["Fat / Carbs / Sugar", "0g / 0g / 0g"],
        ["Ingredients", "5 max (grass-fed whey isolate, citric acid, natural flavor, stevia, natural color)"],
        ["V1 Flavor", "Lightly Sweetened Vanilla"],
        ["Packaging", "Resealable stand-up pouch, 18\u201320 servings"],
    ]))
    story.append(sp(0.1))
    story.append(p("<b>Key attributes:</b>"))
    for item in [
        "Grass-fed whey protein isolate \u2014 triple-filtered, lactose-free",
        "No artificial sweeteners \u2014 ever",
        "No gums \u2014 ever",
        "Mixes clear like juice \u2014 not a thick shake",
        "Third-party tested (COA per batch)",
        "Transparent sourcing",
        "Designed for daily use, not just gym days",
        "No creatine in V1 (reduces friction; creatine becomes product #2)",
    ]:
        story.append(bl(item))
    story.append(sp(0.05))
    story.append(p("<b>Competitive reference:</b> Modeled after Gramms clear protein format. "
                    "Best bang for your buck on protein-to-calorie ratio."))

    story.append(PageBreak())

    # === 8. PRICING ===
    story.append(h1("8. Pricing Strategy"))
    story.append(tbl([
        ["Attribute", "Target"],
        ["Retail price", "$49\u2013$59 (targeting $55)"],
        ["Subscription discount", "10\u201315% off"],
        ["Bundle", "2-bag offer to push AOV above $90"],
    ]))

    # === 9. CORE DIFFERENTIATOR ===
    story.append(h1("9. Core Differentiator"))
    story.append(Paragraph("Daily protein, not workout fuel.", ParagraphStyle(
        "Diff", fontName="Helvetica-Bold", fontSize=13, textColor=DARK, spaceBefore=4, spaceAfter=8)))
    story.append(p("Supported by:"))
    for item in [
        "No artificial sweeteners. Ever.",
        "No gums. Ever.",
        "Adult palate. Not candy.",
        "Grass-fed whey isolate. Third-party tested.",
    ]:
        story.append(bl(item))

    # === 10. GO-TO-MARKET ===
    story.append(h1("10. Go-to-Market Strategy"))
    story.append(h2("Approach"))
    story.append(pb("Founder-led. Not influencer. Not anonymous."))
    story.append(sp(0.05))
    story.append(h2("Narrative"))
    story.append(Paragraph('"We built the protein we wanted as busy dads trying to stay strong long term."',
                            quote_style))
    story.append(h2("Landing Page Test"))
    story.append(p('Will test: "Daily strength, not gym hype."'))
    story.append(sp(0.05))
    story.append(h2("Ad Angles"))
    for item in [
        "Strength for the long game",
        "Protein is daily nutrition",
        "No artificial sweeteners",
        "Light, refined taste",
    ]:
        story.append(bl(item))

    # === 11. DECISIONS MADE ===
    story.append(h1("11. Decisions Made"))
    story.append(tbl([
        ["Question", "Decision"],
        ["Product format", "Clear whey protein isolate (juice-like)"],
        ["Flavor strategy (V1)", "Lightly Sweetened Vanilla"],
        ["Visual identity direction", "Masculine grounded, calm premium (Cream/Near Black/Olive, DM Sans)"],
        ["Formulation reference", "Modeled after Gramms \u2014 5 ingredients, clear, no gums"],
    ]))

    # === 12. OPEN QUESTIONS ===
    story.append(h1("12. Open Questions"))
    for item in [
        "1. Final tagline selection (6 candidates listed above)",
        "2. Price ceiling ($49 vs $55 vs $59)",
        "3. CAC targets",
        "4. V2 flavor (Lemon/Citrus or Unflavored)",
    ]:
        story.append(bl(item))

    doc.build(story)
    print(f"PDF created: {out_path}")


if __name__ == "__main__":
    main()
