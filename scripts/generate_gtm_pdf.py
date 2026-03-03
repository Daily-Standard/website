#!/usr/bin/env python3
"""Generate Daily Standard Go-to-Market Plan PDF."""

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
    out_path = os.path.join(base, "docs", "GO_TO_MARKET_PLAN.pdf")

    doc = SimpleDocTemplate(
        out_path, pagesize=letter,
        rightMargin=0.7 * inch, leftMargin=0.7 * inch,
        topMargin=0.7 * inch, bottomMargin=0.7 * inch,
    )
    s = []

    title_style = ParagraphStyle("Title", fontName="Helvetica-Bold", fontSize=22, spaceAfter=2, textColor=DARK)
    subtitle_style = ParagraphStyle("Subtitle", fontName="Helvetica", fontSize=10, textColor=WARM_GRAY, spaceAfter=14)
    h1 = ParagraphStyle("H1", fontName="Helvetica-Bold", fontSize=14, spaceBefore=18, spaceAfter=6, textColor=OLIVE)
    h2 = ParagraphStyle("H2", fontName="Helvetica-Bold", fontSize=11, spaceBefore=12, spaceAfter=4, textColor=DARK)
    body = ParagraphStyle("Body", fontName="Helvetica", fontSize=9.5, leading=13, textColor=DARK)
    bold_body = ParagraphStyle("BoldBody", fontName="Helvetica-Bold", fontSize=9.5, leading=13, textColor=DARK)
    bullet = ParagraphStyle("Bullet", parent=body, leftIndent=16, bulletIndent=0, spaceBefore=2)
    check = ParagraphStyle("Check", parent=body, leftIndent=16, bulletIndent=0, spaceBefore=2)
    quote = ParagraphStyle("Quote", fontName="Helvetica-Oblique", fontSize=10, leading=14,
                           textColor=DARK, spaceBefore=4, spaceAfter=4, leftIndent=20)

    def sp(h=0.1): return Spacer(1, h * inch)
    def hr(): return HRFlowable(width="100%", thickness=0.5, color=LIGHT_WARM, spaceBefore=6, spaceAfter=6)

    def tbl(data, col_widths=None):
        if col_widths is None:
            col_widths = [2 * inch, 4.2 * inch]
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

    def tbl3(data, col_widths=None):
        if col_widths is None:
            col_widths = [2 * inch, 2.1 * inch, 2.1 * inch]
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

    # =========================================================================
    # TITLE
    # =========================================================================
    s.append(Paragraph("Daily Standard", title_style))
    s.append(Paragraph("Go-to-Market Plan", ParagraphStyle("T2", fontName="Helvetica",
                        fontSize=16, textColor=WARM_GRAY, spaceAfter=4)))
    s.append(Paragraph("February 2026 \u2014 Pre-Launch", subtitle_style))
    s.append(hr())

    # =========================================================================
    # 1. OVERVIEW
    # =========================================================================
    s.append(Paragraph("1. Overview", h1))
    s.append(Paragraph("Daily Standard is a clear grass-fed whey protein isolate built for dads. "
                        "The GTM strategy is founder-led, direct-to-consumer, and designed to validate "
                        "demand before scaling.", body))
    s.append(sp())
    s.append(Paragraph("<b>Approach:</b> Founder-led. Not influencer. Not anonymous.", body))
    s.append(Paragraph("<b>Narrative:</b> We built the protein we wanted as busy dads trying to stay "
                        "strong long term.", body))

    # =========================================================================
    # 2. LAUNCH TIMELINE
    # =========================================================================
    s.append(Paragraph("2. Launch Timeline", h1))
    s.append(tbl3([
        ["Phase", "Timeline", "Focus"],
        ["Phase 1: Foundation", "Weeks 1\u20134", "LLC, insurance, vendor outreach, brand finalization"],
        ["Phase 2: Product", "Weeks 4\u201312", "Formulation, sampling, COA, packaging"],
        ["Phase 3: Pre-Launch", "Weeks 10\u201314", "Landing page, email capture, Pixel, ad creatives"],
        ["Phase 4: Demand Test", "Weeks 14\u201318", "$500\u2013$1,000 ad test, measure CPL and signups"],
        ["Phase 5: Decision", "Week 18+", "Evaluate results \u2192 proceed or pivot"],
    ]))

    # =========================================================================
    # 3. PHASE 1: FOUNDATION
    # =========================================================================
    s.append(Paragraph("3. Phase 1: Foundation (Weeks 1\u20134)", h1))

    s.append(Paragraph("Business Formation", h2))
    for item in [
        "Form LLC (Delaware or home state) \u2014 $150\u2013600",
        "Get EIN from IRS (free, instant)",
        "Open business bank account",
        "Draft Operating Agreement (ownership, roles, exit terms)",
        "Register for state sales tax",
    ]:
        s.append(Paragraph(item, check))

    s.append(Paragraph("Product Liability Insurance", h2))
    s.append(Paragraph("$1M per occurrence / $2M aggregate. Estimated: $2,800\u20135,800/year.", body))
    s.append(Paragraph("Providers: Insurance Canopy, The Hartford, Castle Rock Agency", bullet))

    s.append(Paragraph("Trademark", h2))
    s.append(Paragraph("Search USPTO for 'Daily Standard' in Class 5 + Class 29. "
                        "File application ($250\u2013350 per class).", bullet))

    s.append(Paragraph("Brand Finalization", h2))
    for item in [
        "Select final tagline from 6 candidates",
        "Lock price point ($49 vs $55 vs $59)",
        "Finalize V1 flavor profile",
    ]:
        s.append(Paragraph(item, check))

    s.append(PageBreak())

    # =========================================================================
    # 4. PHASE 2: PRODUCT
    # =========================================================================
    s.append(Paragraph("4. Phase 2: Product (Weeks 4\u201312)", h1))

    s.append(Paragraph("Formulation Spec", h2))
    s.append(tbl([
        ["Attribute", "Spec"],
        ["Format", "Clear whey protein isolate (juice-like)"],
        ["Protein", "20g per serving"],
        ["Calories", "~80"],
        ["Fat / Carbs / Sugar", "0g / 0g / 0g"],
        ["Ingredients", "5 max: whey isolate, citric acid, natural flavor, stevia, natural color"],
        ["V1 Flavor", "Lightly Sweetened Vanilla"],
        ["Packaging", "Resealable matte stand-up pouch, 18\u201320 servings"],
    ]))
    s.append(sp())

    s.append(Paragraph("Excluded Ingredients (Non-Negotiable)", h2))
    for item in [
        "No artificial sweeteners (sucralose, aspartame, acesulfame-K)",
        "No gums (xanthan, guar, gellan, carrageenan)",
        "No artificial flavors or colors",
        "No fillers, soy lecithin, maltodextrin, or sugar alcohols",
    ]:
        s.append(Paragraph(item, bullet))
    s.append(sp())

    s.append(Paragraph("Vendor Outreach", h2))
    s.append(Paragraph("Contact 5 co-packers (templates in VENDOR_OUTREACH_EMAIL.md):", body))
    s.append(Paragraph("Bactolac, Nutricraft Labs, Daily Manufacturing, Steuart Nutrition, JW Nutritional", bullet))
    s.append(Paragraph("Requirements: cGMP, FDA-registered, R&amp;D support, 1,000\u20132,500 MOQ", bullet))
    s.append(sp())

    s.append(Paragraph("Sampling &amp; Testing", h2))
    for item in [
        "Request samples from top 2\u20133 co-packers",
        "Evaluate taste, clarity, mixability, sweetness level",
        "Obtain COA: protein content, heavy metals, microbiology, label accuracy",
        "Cost: $500\u20131,500 per batch COA",
    ]:
        s.append(Paragraph(item, bullet))
    s.append(sp())

    s.append(Paragraph("Production Run", h2))
    s.append(tbl([
        ["Attribute", "Target"],
        ["First run MOQ", "1,000\u20132,500 units"],
        ["Target cost per unit", "$8\u201315"],
        ["Lead time", "8\u201316 weeks"],
        ["Scale target", "5,000\u201310,000 on subsequent runs"],
    ]))

    s.append(PageBreak())

    # =========================================================================
    # 5. PHASE 3: PRE-LAUNCH
    # =========================================================================
    s.append(Paragraph("5. Phase 3: Pre-Launch (Weeks 10\u201314)", h1))

    s.append(Paragraph("Landing Page", h2))
    for item in [
        "Static HTML/CSS deployed to Netlify or Vercel",
        "Hero: clear protein positioning, stats (20g / 80cal / 5 ingredients / 0g sugar)",
        "Email capture with founding member discount CTA",
        "Founder story section",
        "Connected to Klaviyo or ConvertKit",
    ]:
        s.append(Paragraph(item, bullet))
    s.append(sp())

    s.append(Paragraph("Email Capture Strategy", h2))
    s.append(Paragraph("<b>CTA:</b> 'Be first. Founding members get early access + a discount.'", body))
    s.append(Paragraph("<b>Goal:</b> 200\u2013500 signups during ad test", body))
    s.append(Paragraph("<b>Sequence:</b> 3 emails (welcome, founder story, product details)", body))
    s.append(sp())

    s.append(Paragraph("Analytics &amp; Tracking", h2))
    for item in [
        "Google Analytics or Plausible installed",
        "Meta Pixel installed and verified (Pixel Helper)",
        "Custom conversion event for form submission",
    ]:
        s.append(Paragraph(item, bullet))
    s.append(sp())

    s.append(Paragraph("Ad Creatives (4 Angles)", h2))
    s.append(Paragraph("Design 1080x1080 (feed) + 1080x1920 (stories) for each:", body))
    s.append(sp(0.05))
    s.append(Paragraph("<b>1. The Permission:</b> 'You don't need a workout to need protein.'", bullet))
    s.append(Paragraph("<b>2. The Dad Reality:</b> 'You used to work out 6 days a week.'", bullet))
    s.append(Paragraph("<b>3. The Anti-Hype:</b> 'Protein, not a personality.'", bullet))
    s.append(Paragraph("<b>4. The Product:</b> '20g protein. 80 calories. 5 ingredients. Clear.'", bullet))

    s.append(PageBreak())

    # =========================================================================
    # 6. PHASE 4: DEMAND TEST
    # =========================================================================
    s.append(Paragraph("6. Phase 4: Demand Test (Weeks 14\u201318)", h1))

    s.append(Paragraph("Campaign Setup", h2))
    s.append(tbl([
        ["Setting", "Value"],
        ["Platform", "Meta (Instagram + Facebook)"],
        ["Objective", "Conversions (Lead / Form submission)"],
        ["Daily budget", "$25\u201335/day"],
        ["Duration", "14\u201328 days"],
        ["Total budget", "$500\u2013$1,000"],
        ["Placement", "Automatic (IG + FB Feed, Stories, Reels)"],
        ["Bid strategy", "Lowest cost"],
    ]))
    s.append(sp())

    s.append(Paragraph("Audience Targeting", h2))
    s.append(tbl([
        ["Parameter", "Value"],
        ["Age", "28\u201350"],
        ["Gender", "Men"],
        ["Location", "United States"],
        ["Interests", "Protein, Fitness, Health + Parenting, Fatherhood, Family"],
        ["Exclude", "Bodybuilding"],
    ]))
    s.append(sp())

    s.append(Paragraph("Testing Schedule", h2))
    s.append(Paragraph("<b>Week 1\u20132:</b> Launch all 4 angles with equal budget. No changes for first 3\u20134 days.", body))
    s.append(Paragraph("<b>Week 2\u20133:</b> Kill underperformers. Shift budget to top 1\u20132. Test variations.", body))
    s.append(Paragraph("<b>Week 3\u20134:</b> Increase budget on winners by 20\u201330%. Test Lookalike audience.", body))
    s.append(sp())

    s.append(Paragraph("Success Metrics", h2))
    s.append(tbl3([
        ["Metric", "Target", "Red Flag"],
        ["Cost per lead (CPL)", "Under $3\u20135", "Over $8"],
        ["Click-through rate (CTR)", "Above 1.5%", "Below 0.8%"],
        ["Landing page conversion", "Above 20%", "Below 10%"],
        ["Total signups (2 weeks)", "100\u2013200", "Under 50"],
        ["Total signups (4 weeks)", "200\u2013500", "Under 100"],
    ]))

    # =========================================================================
    # 7. DECISION FRAMEWORK
    # =========================================================================
    s.append(Paragraph("7. Decision Framework", h1))
    s.append(tbl([
        ["Result", "Action"],
        ["CPL under $3 + 200+ signups", "Strong signal. Move to pre-orders or production."],
        ["CPL $3\u20135 + 100+ signups", "Good signal. Refine messaging, test new angles."],
        ["CPL $5\u20138", "Weak signal. Rethink targeting or creative."],
        ["CPL over $8", "Pause. Revisit positioning, audience, or offer."],
    ]))

    s.append(PageBreak())

    # =========================================================================
    # 8. PRICING & REVENUE
    # =========================================================================
    s.append(Paragraph("8. Pricing &amp; Revenue Model", h1))
    s.append(tbl([
        ["Attribute", "Target"],
        ["Retail price", "$49\u2013$59 (targeting $55)"],
        ["Subscription discount", "10\u201315% off"],
        ["Bundle", "2-bag offer to push AOV above $90"],
        ["Cost per unit (at MOQ)", "$8\u201315"],
        ["Gross margin target", "~50%"],
    ]))
    s.append(sp())
    s.append(Paragraph("Revenue Targets", h2))
    s.append(tbl([
        ["Metric", "Value"],
        ["TAM", "34M dads with child under 15"],
        ["Target penetration", "2% = 680,000 dads"],
        ["Revenue goal", "$10M (at 10% net profit = $1M profit)"],
    ]))

    # =========================================================================
    # 9. FULFILLMENT
    # =========================================================================
    s.append(Paragraph("9. Fulfillment Strategy", h1))

    s.append(Paragraph("Phase 1: Self-Fulfillment (0\u2013500 orders)", h2))
    for item in [
        "Ship from home/office",
        "ShipStation or Pirate Ship for label generation",
        "USPS Priority Mail for orders under 2 lbs",
    ]:
        s.append(Paragraph(item, bullet))

    s.append(Paragraph("Phase 2: 3PL (500+ orders/month)", h2))
    for item in [
        "Evaluate: ShipBob, ShipBots, Relentless Fulfillment",
        "Requirements: temperature-controlled, supplement experience",
        "Integration with Shopify or WooCommerce",
    ]:
        s.append(Paragraph(item, bullet))

    s.append(Paragraph("Shipping Strategy", h2))
    s.append(Paragraph("Free shipping on orders $75+ (incentivizes bundles). Flat rate $5.99 under $75. US only for V1.", body))

    # =========================================================================
    # 10. REGULATORY
    # =========================================================================
    s.append(Paragraph("10. Regulatory Compliance", h1))
    s.append(tbl([
        ["Requirement", "Status"],
        ["LLC formation", "To do"],
        ["EIN", "To do"],
        ["Product liability insurance", "To do ($2,800\u20135,800/yr)"],
        ["cGMP facility (co-packer)", "Vendor selection"],
        ["FDA facility registration", "Co-packer handles"],
        ["Supplement Facts panel", "Part of label design"],
        ["COA (third-party lab testing)", "Per batch ($500\u20131,500)"],
        ["California Prop 65 review", "After COA"],
        ["Trademark filing", "To do ($250\u2013350/class)"],
    ]))

    s.append(PageBreak())

    # =========================================================================
    # 11. PRE-LAUNCH CHECKLIST
    # =========================================================================
    s.append(Paragraph("11. Pre-Launch Checklist", h1))

    s.append(Paragraph("Business", h2))
    for item in [
        "LLC formed",
        "EIN obtained",
        "Business bank account opened",
        "Operating agreement signed",
        "Product liability insurance purchased",
        "Trademark search completed",
    ]:
        s.append(Paragraph(item, check))

    s.append(Paragraph("Product", h2))
    for item in [
        "Co-packer selected and contracted",
        "Formulation finalized and sampled",
        "COA obtained for first batch",
        "Label designed (FDA-compliant Supplement Facts)",
        "Packaging produced",
    ]:
        s.append(Paragraph(item, check))

    s.append(Paragraph("Digital", h2))
    for item in [
        "Landing page deployed",
        "Email capture connected (Klaviyo/ConvertKit)",
        "Meta Business Manager + Ad Account set up",
        "Meta Pixel installed and verified",
        "Google Analytics / Plausible installed",
        "4 ad creatives designed (feed + stories)",
        "Ad copy finalized",
    ]:
        s.append(Paragraph(item, check))

    s.append(Paragraph("Launch", h2))
    for item in [
        "Welcome email sequence written",
        "Shopify/WooCommerce store set up",
        "Fulfillment strategy decided (self vs 3PL)",
        "Shipping rates configured",
        "Sales tax registration completed",
    ]:
        s.append(Paragraph(item, check))

    doc.build(s)
    print(f"PDF created: {out_path}")


if __name__ == "__main__":
    main()
