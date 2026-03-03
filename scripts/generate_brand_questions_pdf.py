#!/usr/bin/env python3
"""Generate Brand Strategy Questionnaire & Name Options PDF."""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

DARK = colors.HexColor("#4a4a4a")
LIGHT_BG = colors.HexColor("#f8f8f8")
ACCENT = colors.HexColor("#2d5ca6")
MUTED = colors.HexColor("#666666")


def main():
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_path = os.path.join(base, "docs", "BRAND_QUESTIONNAIRE.pdf")

    doc = SimpleDocTemplate(
        out_path, pagesize=letter,
        rightMargin=0.65 * inch, leftMargin=0.65 * inch,
        topMargin=0.65 * inch, bottomMargin=0.65 * inch,
    )
    styles = getSampleStyleSheet()
    story = []

    title_style = ParagraphStyle("Title", fontName="Helvetica-Bold", fontSize=18, spaceAfter=4)
    subtitle_style = ParagraphStyle("Subtitle", fontName="Helvetica", fontSize=10, textColor=MUTED, spaceAfter=12)
    h1_style = ParagraphStyle("H1", fontName="Helvetica-Bold", fontSize=14, spaceBefore=16, spaceAfter=6, textColor=ACCENT)
    h2_style = ParagraphStyle("H2", fontName="Helvetica-Bold", fontSize=11, spaceBefore=12, spaceAfter=4)
    body = ParagraphStyle("Body", fontName="Helvetica", fontSize=9, leading=12)
    q_style = ParagraphStyle("Question", fontName="Helvetica-Bold", fontSize=9, leading=12, spaceBefore=6, spaceAfter=2)
    bullet_style = ParagraphStyle("Bullet", parent=body, leftIndent=14, bulletIndent=0, spaceBefore=1)
    answer_style = ParagraphStyle("Answer", fontName="Helvetica", fontSize=9, leading=12, leftIndent=14,
                                   textColor=MUTED, spaceBefore=1, spaceAfter=4)

    def h1(text): return Paragraph(text, h1_style)
    def h2(text): return Paragraph(text, h2_style)
    def p(text): return Paragraph(text, body)
    def q(text): return Paragraph(text, q_style)
    def b(text): return Paragraph(text, bullet_style)
    def a(text): return Paragraph(text, answer_style)
    def sp(h=0.1): return Spacer(1, h * inch)

    def tbl(data, col_widths=None):
        if col_widths is None:
            col_widths = [1.8 * inch, 4.2 * inch]
        wrapped = []
        for row in data:
            wrapped.append([Paragraph(str(c), body) for c in row])
        t = Table(wrapped, colWidths=col_widths)
        t.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), DARK),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 6),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 1), (-1, -1), 4),
            ("BACKGROUND", (0, 1), (-1, -1), LIGHT_BG),
            ("GRID", (0, 0), (-1, -1), 0.4, colors.grey),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ]))
        return t

    # =====================================================================
    # PART 1: BRAND NAME OPTIONS
    # =====================================================================
    story.append(Paragraph("Dad Protein — Brand Name Options & Strategy Questionnaire", title_style))
    story.append(Paragraph("Working document for brand decisions. February 2026.", subtitle_style))
    story.append(sp(0.15))

    story.append(h1("Part 1: Brand Name Options"))
    story.append(p("Based on positioning: daily strength nutrition, masculine grounded, calm premium, long-term focused, not gym bro."))
    story.append(sp(0.1))

    # Long Game direction
    story.append(h2('"Long Game" Direction — Longevity / Consistency'))
    story.append(tbl([
        ["Name", "Notes"],
        ["Long Game", "Working name. Implies patience, daily commitment, playing for keeps. Risk: not obviously protein."],
        ["Long Game Nutrition", "Adds category clarity. Keeps the meaning."],
        ["The Long Game", "The article adds weight and intentionality. Feels like a philosophy."],
    ]))
    story.append(sp(0.1))

    # Daily direction
    story.append(h2('"Daily" Direction — Everyday Ritual / Routine'))
    story.append(tbl([
        ["Name", "Notes"],
        ["Daily Standard", "'This is my standard.' Implies non-negotiable quality. Clean, premium."],
        ["Standard Protein", "Simple, confident. 'This is what protein should be.' No hype."],
        ["Daily Strength", "Directly maps to your category name. Descriptive but maybe too literal."],
    ]))
    story.append(sp(0.1))

    # Built direction
    story.append(h2('"Built / Made" Direction — Craftsmanship / Intentional'))
    story.append(tbl([
        ["Name", "Notes"],
        ["Built Daily", "Strength is built daily, not in one workout. Action-oriented."],
        ["Made for Mornings", "Specific, evocative, captures routine. Could be limiting."],
        ["Ground Floor", "Foundation, starting point, basics done right."],
    ]))
    story.append(sp(0.1))

    # Dad Identity direction
    story.append(h2('"Dad Identity" Direction — Subtle, Not Gimmicky'))
    story.append(tbl([
        ["Name", "Notes"],
        ["Steady", "Calm, reliable, consistent. What a good dad is. What daily protein should be."],
        ["Steady State", "Scientific feel (steady-state metabolism) + emotional (calm, grounded)."],
        ["Cornerstone", "'Protein is the cornerstone.' Premium, foundational, architectural."],
    ]))
    story.append(sp(0.1))

    # Anti-Hype direction
    story.append(h2('"Anti-Hype" Direction — Contrast / Rejection'))
    story.append(tbl([
        ["Name", "Notes"],
        ["No Hype Nutrition", "Wears the differentiator as the name. Polarizing in a good way."],
        ["Baseline", "'This is your baseline.' Medical/athletic term for your foundation."],
        ["Unfussy", "British-sounding, premium. 'We don't overcomplicate things.'"],
    ]))

    story.append(PageBreak())

    # =====================================================================
    # TAGLINES
    # =====================================================================
    story.append(h1("Part 2: Tagline Options"))
    story.append(sp(0.05))

    story.append(h2("Permission / No Guilt"))
    story.append(b("Daily strength, not gym hype."))
    story.append(b("You don't need a workout to need protein."))
    story.append(b("Strength is daily."))
    story.append(b("For the days you train. And the days you don't."))
    story.append(b("No workout required."))
    story.append(sp(0.1))

    story.append(h2("Long-Term / Longevity"))
    story.append(b("Stay strong for the long game."))
    story.append(b("Built daily. Not in one session."))
    story.append(b("Play the long game."))
    story.append(b("Protein for the rest of your life."))
    story.append(b("Strength that compounds."))
    story.append(sp(0.1))

    story.append(h2("Calm Confidence / Anti-Hype"))
    story.append(b("Just protein. Done right."))
    story.append(b("Nothing extra. Nothing missing."))
    story.append(b("Clean protein for grown men."))
    story.append(b("Protein, not a personality."))
    story.append(b("Skip the hype. Keep the strength."))
    story.append(sp(0.1))

    story.append(h2("Identity / Who It's For"))
    story.append(b("For dads who give a damn."))
    story.append(b("Quiet strength, daily."))
    story.append(b("The protein that doesn't try too hard."))
    story.append(b("Strong and steady."))
    story.append(b("Fuel the man, not the ego."))
    story.append(sp(0.15))

    story.append(h2("Top 3 Recommended Pairings"))
    story.append(tbl([
        ["Name", "Tagline"],
        ["Long Game", "Strength is daily."],
        ["Steady", "Just protein. Done right."],
        ["Daily Standard", "For the days you train. And the days you don't."],
    ]))

    story.append(PageBreak())

    # =====================================================================
    # PART 3: QUESTIONNAIRE
    # =====================================================================
    story.append(h1("Part 3: Brand Strategy Questionnaire"))
    story.append(p("Answer what you can now. Skip what you're not ready for. Partial answers help."))
    story.append(sp(0.15))

    # Brand Name & Identity
    story.append(h2("Brand Name & Identity"))

    story.append(q('1. How do you feel about "Long Game" as the brand name?'))
    story.append(a("Strong contender / placeholder / exploring other directions? Other names?"))

    story.append(q("2. Tagline preference — which direction feels most like you?"))
    story.append(a("Pick from Part 2, or suggest your own."))

    story.append(q("3. Visual mood — any brands (outside supplements) whose visual identity you admire?"))
    story.append(a("e.g., Aesop, Patagonia, Tracksmith, Ridge Wallet, Yeti"))

    story.append(q("4. Color palette instinct?"))
    story.append(a("Dark and earthy (charcoal, olive, tan)? Light and clean (white, stone, sage)? Other?"))

    story.append(sp(0.15))

    # Product & Formulation
    story.append(h2("Product & Formulation"))

    story.append(q("5. Flavor for V1 — lightly sweetened vanilla only? Vanilla + unflavored? Other?"))
    story.append(a(""))

    story.append(q("6. Sweetener — if no artificial, what's the plan?"))
    story.append(a("Monk fruit? Stevia? Coconut sugar? Unsweetened entirely?"))

    story.append(q("7. Serving size — 20g protein locked? Or open to 25g?"))
    story.append(a(""))

    story.append(q("8. Bag size for V1 — how many servings per bag?"))
    story.append(a("15? 20? 30?"))

    story.append(q("9. Manufacturing — do you have a co-packer or formulator in mind?"))
    story.append(a(""))

    story.append(sp(0.15))

    # Pricing & Business Model
    story.append(h2("Pricing & Business Model"))

    story.append(q("10. Price point — gut instinct on where to launch?"))
    story.append(a("$49? $55? $59? Or test multiple on the landing page?"))

    story.append(q("11. Subscription discount — 10% or 15% off? Or tiered (gets cheaper over time)?"))
    story.append(a(""))

    story.append(q("12. Founding member offer — what's the incentive?"))
    story.append(a("X% off first order / locked-in price for life / free gift / early access?"))

    story.append(q("13. Gift angle — what does this look like?"))
    story.append(a("'Gift a bag to another dad'? 'Buy as a Father's Day gift'? Both?"))

    story.append(sp(0.15))

    # Go-to-Market & Founder Story
    story.append(h2("Go-to-Market & Founder Story"))

    story.append(q("14. Your story — why are you building this? What moment made you think 'this should exist'?"))
    story.append(a("2-3 sentences."))

    story.append(q("15. Founder-led means what? Your face on the page? Video? Written letter? Behind-the-scenes?"))
    story.append(a(""))

    story.append(q("16. Launch audience — existing audience (social, email, community) or building from zero?"))
    story.append(a(""))

    story.append(q("17. Paid ads at launch? Or organic / word of mouth first?"))
    story.append(a(""))

    story.append(q("18. Landing page goal — pure email capture (waitlist) or pre-orders?"))
    story.append(a(""))

    story.append(sp(0.15))

    # Tone & Voice
    story.append(h2("Tone & Voice"))

    story.append(q("19. If the brand were a person, who would it be?"))
    story.append(a("e.g., 'The dad at the BBQ who's in good shape but doesn't talk about CrossFit'"))

    story.append(q("20. What should the brand never sound like?"))
    story.append(a("e.g., never preachy, never bro-y, never clinical, never try-hard"))

    story.append(sp(0.15))

    # Open Strategic Questions
    story.append(h2("Open Strategic Questions"))

    story.append(q("21. Who's the buyer vs. the user? Always self-purchase, or do wives/partners buy too?"))
    story.append(a(""))

    story.append(q("22. Where does this sell long-term? DTC only? Eventually retail? Amazon?"))
    story.append(a(""))

    story.append(q("23. What does success look like in 90 days?"))
    story.append(a("Number of waitlist signups? Pre-orders? Something else?"))

    doc.build(story)
    print(f"PDF created: {out_path}")


if __name__ == "__main__":
    main()
