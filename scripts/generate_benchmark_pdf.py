#!/usr/bin/env python3
"""Generate PDF from benchmark report content."""

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


def main():
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_path = os.path.join(base, "docs", "BENCHMARK_REPORT.pdf")

    doc = SimpleDocTemplate(
        out_path, pagesize=letter,
        rightMargin=0.65 * inch, leftMargin=0.65 * inch,
        topMargin=0.65 * inch, bottomMargin=0.65 * inch,
    )
    styles = getSampleStyleSheet()
    story = []

    title_style = ParagraphStyle("Title", fontName="Helvetica-Bold", fontSize=18, spaceAfter=4)
    h1_style = ParagraphStyle("H1", fontName="Helvetica-Bold", fontSize=13, spaceBefore=14, spaceAfter=4, textColor=ACCENT)
    h2_style = ParagraphStyle("H2", fontName="Helvetica-Bold", fontSize=11, spaceBefore=10, spaceAfter=4)
    body = styles["Normal"]
    body.fontSize = 9
    body.leading = 12
    bullet_style = ParagraphStyle("Bullet", parent=body, leftIndent=14, bulletIndent=0, spaceBefore=2)

    def h1(text): return Paragraph(text, h1_style)
    def h2(text): return Paragraph(text, h2_style)
    def p(text): return Paragraph(text, body)
    def b(text): return Paragraph(text, bullet_style)
    def sp(h=0.15): return Spacer(1, h * inch)

    def tbl(data, col_widths=None):
        if col_widths is None:
            col_widths = [1.4 * inch, 4.6 * inch]
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

    # === TITLE ===
    story.append(Paragraph("Dad Protein — Competitive Benchmark Report", title_style))
    story.append(p("Date: February 2026"))
    story.append(p("Purpose: Product positioning, pricing, sizing, and nutrition benchmarks for a dad-focused protein supplement."))
    story.append(sp(0.25))

    # === 1. DAD FUEL ===
    story.append(h1("1. Dad Fuel (Existing Competitor — Same Audience)"))
    story.append(p("<b>Brand:</b> DADFUEL (dadfuel.com) — 'The All-In-One Nutrition Solution Built for Busy Men'"))
    story.append(p("<b>Product Type:</b> Meal replacement / superblend (not pure protein)"))
    story.append(sp(0.05))
    story.append(tbl([
        ["Attribute", "Details"],
        ["Positioning", "Replaces supplement cabinet; 70+ nutrients; meal supplement for busy dads"],
        ["Protein Source", "Whey isolate + micellar casein"],
        ["Protein", "~20-25g per serving"],
        ["Calories", "200 per serving (2 scoops)"],
        ["Fat / Carbs", "Low net carbs; includes MCT oil, fiber (psyllium), healthy fats"],
        ["Servings", "15 per bag"],
        ["Price (one-time)", "$79/bag"],
        ["Price (subscription)", "$65 > $56 > $53 > $50/bag (drops with each order)"],
        ["Price per serving", "$5.26 (one-time) / $3.69-4.33 (subscription)"],
        ["Bundles", "2-bag subscription: 30% off + free shaker"],
        ["Flavors", "Chocolate, Vanilla, Coffee"],
        ["Extras", "Free shaker with subscription; 60-day money-back guarantee"],
    ]))
    story.append(sp(0.1))
    story.append(p("<b>Differentiation:</b> All-in-one (protein + vitamins + adaptogens + greens). Different product category from pure protein."))

    # === 2. NAKED NUTRITION ===
    story.append(h1("2. Naked Nutrition (Clean Protein — Adjacent)"))
    story.append(p("<b>Product Type:</b> Pure grass-fed whey protein"))
    story.append(sp(0.05))
    story.append(tbl([
        ["Attribute", "Details"],
        ["Positioning", "Clean, transparent; 1-3 ingredients; grass-fed; no additives"],
        ["Protein", "25g per serving"],
        ["Calories", "~120 per serving (unflavored)"],
        ["Fat / Carbs", "~3g carbs, ~2g sugar; minimal fat"],
        ["Servings", "15 (1lb) / 30 (2lb) / 76 (5lb)"],
        ["Price (1lb/2lb/5lb)", "~$27 / ~$50-55 / $99.99 one-time ($79.99 autoship)"],
        ["Price per serving", "$1.31 (5lb) / $1.05 (autoship) / $1.80 (1lb)"],
        ["Sizes", "1lb, 2lb, 5lb"],
        ["Flavors", "Unflavored, Chocolate, Vanilla, Strawberry, Chocolate PB"],
    ]))
    story.append(sp(0.1))
    story.append(p("<b>Differentiation:</b> Broad audience; no dad-specific or daily-use messaging; post-workout positioning."))

    # === 3. GRAMMS ===
    story.append(h1("3. Gramms (Daily Protein — Adjacent)"))
    story.append(p("<b>Product Type:</b> Clear whey isolate (juice-style, not thick shake)"))
    story.append(sp(0.05))
    story.append(tbl([
        ["Attribute", "Details"],
        ["Positioning", "'Meet your new daily protein'; light, drinkable; non-bloating; targets women"],
        ["Protein", "20g per serving"],
        ["Calories", "80 per serving"],
        ["Fat / Sugar", "0g fat, 0g sugar"],
        ["Servings", "10 (travel pack) / 18 (bulk bag)"],
        ["Price", "$41 (travel) / $57 (bulk)"],
        ["Price per serving", "$4.10 (travel) / $3.17 (bulk)"],
        ["Bundles", "Intro bundle: $59 > $41.30 (30% off) with variety pack + shaker"],
        ["Flavors", "Lemonade, Peach Tea, Strawberry Acai, Tropical Punch"],
    ]))
    story.append(sp(0.1))
    story.append(p("<b>Differentiation:</b> Women-focused; clear/juice format. Not parent-specific."))

    story.append(PageBreak())

    # === 4. FIT FATHER ===
    story.append(h1("4. Fit Father Superfuel (Men 40+ — Adjacent)"))
    story.append(p("<b>Product Type:</b> Protein + superfood blend (meal supplement)"))
    story.append(sp(0.05))
    story.append(tbl([
        ["Attribute", "Details"],
        ["Positioning", "Doctor-formulated for men 40+; protein + organic superfoods + vitamins"],
        ["Protein", "20g per serving"],
        ["Price (one-time)", "$64.95"],
        ["Price (subscription)", "$59.45 (30-day auto-ship)"],
        ["Flavors", "Vanilla, Chocolate Whey, Vegan Chocolate"],
    ]))
    story.append(sp(0.1))
    story.append(p("<b>Differentiation:</b> Targets men 40+, medical authority angle. 'Aging man' positioning, not 'busy parent.'"))

    # === 5. DADBOD 2.0 ===
    story.append(h1("5. DadBod 2.0 (Dad-Themed Supplement Line)"))
    story.append(p("<b>Product Type:</b> Standard supplement line (whey, BCAAs, creatine, test booster)"))
    story.append(sp(0.05))
    story.append(tbl([
        ["Attribute", "Details"],
        ["Positioning", "Standard gym supplement line; dad name is branding, not a unique product angle"],
        ["Protein (Whey Armor)", "Standard whey powder, 2lb tub"],
        ["Price", "$49.97 (on sale from $59.97)"],
        ["Product line", "Whey protein, BCAAs, glutamine, creatine, test booster"],
    ]))
    story.append(sp(0.1))
    story.append(p("<b>Differentiation:</b> Name is dad-themed but products are generic gym supplements. No daily-use or parent lifestyle angle."))

    # === 6. ALPHA LION ===
    story.append(h1("6. Alpha Lion 'Dad Bod Destroyer' Stack"))
    story.append(p("<b>Product Type:</b> Fat-burning stack (NOT protein)"))
    story.append(sp(0.05))
    story.append(tbl([
        ["Attribute", "Details"],
        ["Positioning", "Lose 10-25 lbs; appetite suppression + fat-burning pre-workout + sleep"],
        ["Price", "~$141 on sale (from ~$410 MSRP)"],
        ["Contains protein?", "No - appetite suppressant, fat burner, sleep formula"],
    ]))
    story.append(sp(0.1))
    story.append(p("<b>Differentiation:</b> 'Dad' is a marketing hook, not a dedicated brand. No protein product. Gym-bro positioning."))

    # === 7. FATHER FUEL ===
    story.append(h1("7. Father Fuel (Australia — Energy, Not Protein)"))
    story.append(tbl([
        ["Attribute", "Details"],
        ["Product Type", "Caffeinated energy supplement (NOT protein)"],
        ["Price", "$69 AUD/pouch (30-day supply)"],
        ["Key ingredients", "Caffeine 140mg, L-Theanine, Siberian Ginseng, CoQ10"],
    ]))
    story.append(sp(0.1))
    story.append(p("<b>Differentiation:</b> Energy-only, no protein. Australia-only. Shows demand for dad-specific supplements."))

    # === 8. PURE GENIUS ===
    story.append(h1("8. Pure Genius Protein (Convenience Shots)"))
    story.append(p("<b>Product Type:</b> Ready-to-drink protein shots (3.38 fl oz). Co-founded by Mel Robbins (Jan 2026)."))
    story.append(sp(0.05))
    story.append(tbl([
        ["Attribute", "Details"],
        ["Protein", "23g per shot"],
        ["Calories", "100"],
        ["Fat / Carbs / Sugar", "0g / 0g / 0g"],
        ["Price", "$48/12-pack ($4.00/shot)"],
        ["Flavors", "Blueberry Lemonade, Strawberry Guava, Pineapple"],
    ]))
    story.append(sp(0.1))
    story.append(p("<b>Differentiation:</b> Ultimate convenience (shots, not powder). Broad audience, not parent-specific. Celebrity-backed."))

    story.append(PageBreak())

    # === 9. MAINSTREAM ===
    story.append(h1("9. Mainstream Protein & Meal Replacements"))
    cw5 = [1.2 * inch, 1 * inch, 0.8 * inch, 1.1 * inch, 2.4 * inch]
    story.append(tbl([
        ["Brand", "Protein", "Calories", "Price/Serving", "Notes"],
        ["ON Gold Standard", "24g", "120", "$1.42-1.72", "Conventional whey; not grass-fed"],
        ["Naked Whey", "25g", "120", "$1.05-1.80", "Clean, grass-fed benchmark"],
        ["Huel", "29-30g", "400", "$1.95-3.50", "Meal replacement; general audience"],
        ["Ka'Chava", "25g", "240", "$2.80-4.50", "Superfood shake; health-conscious"],
    ], col_widths=cw5))

    # === 10. LANDSCAPE MAP ===
    story.append(h1("10. Full Competitive Landscape Map"))
    cw6 = [1.15 * inch, 1.1 * inch, 0.7 * inch, 0.85 * inch, 0.75 * inch, 0.75 * inch]
    story.append(tbl([
        ["Brand", "Type", "Protein", "$/Serving", "Dad?", "Daily?"],
        ["Dad Fuel", "Meal replacement", "~20-25g", "$3.69-5.26", "Yes", "Yes"],
        ["Fit Father", "Protein + superfoods", "20g", "~$4.00", "Men 40+", "Yes"],
        ["DadBod 2.0", "Generic whey", "Standard", "~$1.67", "Name only", "No"],
        ["Alpha Lion", "Fat-burn stack", "None", "~$47/ea", "Name only", "No"],
        ["Father Fuel", "Energy (no protein)", "0g", "~$2.30", "Yes", "Yes"],
        ["Pure Genius", "Protein shot", "23g", "$4.00", "No", "Yes"],
        ["Naked", "Clean whey", "25g", "$1.05-1.80", "No", "No"],
        ["Gramms", "Clear whey", "20g", "$3.17-4.10", "No", "Yes"],
        ["Huel", "Meal replacement", "29-30g", "$1.95-3.50", "No", "Yes"],
        ["ON Gold Std", "Mainstream whey", "24g", "$1.42-1.72", "No", "No"],
    ], col_widths=cw6))

    story.append(PageBreak())

    # === 11. MARKET OPPORTUNITY ===
    story.append(h1("11. Market Opportunity & Insights"))

    story.append(h2("The Gap"))
    story.append(p("No brand currently owns this position: <b>pure protein, specifically for parents, positioned for daily use (not just post-workout).</b>"))
    story.append(b("Dad Fuel is the closest but is a meal replacement superblend ($5+/serving, 70+ ingredients). Different category."))
    story.append(b("DadBod 2.0 and Alpha Lion use 'dad' as a gimmick — generic gym products with dad-themed names."))
    story.append(b("Gramms nails 'daily protein' but targets women and doesn't address the parent lifestyle."))
    story.append(b("Pure Genius nails convenience but is broad (not parent-specific)."))

    story.append(h2("Industry Data"))
    story.append(b("55% of US households now consider high protein important when grocery shopping."))
    story.append(b("Protein powder purchases increased 20% from 2022 to 2023 — mainstream adoption beyond athletes."))
    story.append(b("23% of active nutrition consumers are 'Moderate Movers' focused on wellness, not gym performance."))
    story.append(b("Nearly 25% of EU households have at least one child — massive untapped segment for protein brands."))
    story.append(b("Industry research calls active parenting 'an untapped opportunity for nutrition brands.'"))

    story.append(h2("The Dude Wipes Playbook"))
    story.append(p("Dude Wipes built $200M+ revenue (1,180% growth over 5 years) by:"))
    story.append(b("1. Identifying an obvious gap — men were using baby wipes but no product existed for them."))
    story.append(b("2. Branding a commodity — the product isn't functionally revolutionary; the branding is."))
    story.append(b("3. Humor and personality — bold, unapologetic, relatable. Not corporate."))
    story.append(b("4. Starting DTC, then retail — test online, prove demand, then go to Walmart/Target."))
    story.append(b("5. Owning a niche identity — 'for dudes' isn't exclusionary, it's a magnet."))
    story.append(sp(0.1))
    story.append(p("<b>Dad Protein's version:</b> Parents drink protein but no brand speaks to them. The product doesn't need to be radically different — the branding, messaging, and identity do. 'You still need protein' is the insight. The brand should feel like it gets you."))

    # === 12. RECOMMENDATIONS ===
    story.append(h1("12. Recommendations for Dad Protein"))

    story.append(h2("Positioning"))
    story.append(b("Pure protein for parents — daily use, no workout required, no guilt, no stigma."))
    story.append(b("NOT a meal replacement (that's Dad Fuel's lane)."))
    story.append(b("NOT generic gym protein with a dad label (that's DadBod 2.0's lane)."))
    story.append(b("The 'Dude Wipes of protein' — same category, radically better branding for a specific audience."))

    story.append(h2("Product Specs (TBD)"))
    story.append(b("Protein: 20-28g per serving (industry range; to be defined)"))
    story.append(b("Fat / Carbs / Sugar: TBD based on formulation"))
    story.append(b("Source: Grass-fed or similar (aligns with clean positioning)"))
    story.append(b("Format: Traditional powder, clear protein, or shots — to be decided"))

    story.append(h2("Pricing Strategy"))
    story.append(b("Premium pure protein: $2.50-3.50/serving (between Naked and Gramms)"))
    story.append(b("Bundle: Founding member / intro pack (15-20% off first order)"))
    story.append(b("Sizes: 15 servings (trial), 30 servings (standard), optional bulk"))

    story.append(h2("Bundle Ideas"))
    story.append(b("Intro bundle: 1 bag + shaker (like Gramms, Dad Fuel)"))
    story.append(b("2-bag subscription: Founding member discount"))
    story.append(b("Gift option: 'Gift a founding membership'"))

    story.append(h2("Name"))
    story.append(b("Dad Fuel is taken (dadfuel.com). DadBod 2.0 is taken (dadbod2.fit)."))
    story.append(b("Dad Protein or a fresh name needed — something with personality, not generic."))

    doc.build(story)
    print(f"PDF created: {out_path}")


if __name__ == "__main__":
    main()
