#!/usr/bin/env python3
"""Generate PDFs for all remaining docs: Formulation Spec, Vendor Outreach, Legal Checklist, Ad Test Plan."""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak,
    HRFlowable, Preformatted,
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors

DARK = colors.HexColor("#2C2C2C")
CREAM = colors.HexColor("#F5F2ED")
OLIVE = colors.HexColor("#4A6741")
WARM_GRAY = colors.HexColor("#6B6560")
LIGHT_WARM = colors.HexColor("#E8E4DC")
WHITE = colors.HexColor("#FFFFFF")

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

title_style = ParagraphStyle("Title", fontName="Helvetica-Bold", fontSize=20, spaceAfter=2, textColor=DARK)
subtitle_style = ParagraphStyle("Subtitle", fontName="Helvetica", fontSize=10, textColor=WARM_GRAY, spaceAfter=12)
h1_style = ParagraphStyle("H1", fontName="Helvetica-Bold", fontSize=14, spaceBefore=16, spaceAfter=6, textColor=OLIVE)
h2_style = ParagraphStyle("H2", fontName="Helvetica-Bold", fontSize=11, spaceBefore=10, spaceAfter=4, textColor=DARK)
body = ParagraphStyle("Body", fontName="Helvetica", fontSize=9.5, leading=13, textColor=DARK)
bold_body = ParagraphStyle("BoldBody", fontName="Helvetica-Bold", fontSize=9.5, leading=13, textColor=DARK)
bullet = ParagraphStyle("Bullet", parent=body, leftIndent=16, bulletIndent=0, spaceBefore=2)
check_style = ParagraphStyle("Check", parent=body, leftIndent=16, bulletIndent=0, spaceBefore=2)
pre_style = ParagraphStyle("Pre", fontName="Courier", fontSize=8, leading=11, textColor=DARK,
                            leftIndent=12, spaceBefore=4, spaceAfter=4)


def sp(h=0.1): return Spacer(1, h * inch)
def hr(): return HRFlowable(width="100%", thickness=0.5, color=LIGHT_WARM, spaceBefore=6, spaceAfter=6)

def tbl(data, col_widths=None):
    if col_widths is None:
        col_widths = [1.8 * inch, 4.2 * inch]
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


def build_formulation_spec():
    out = os.path.join(BASE, "docs", "FORMULATION_SPEC.pdf")
    doc = SimpleDocTemplate(out, pagesize=letter, rightMargin=0.7*inch, leftMargin=0.7*inch,
                            topMargin=0.7*inch, bottomMargin=0.7*inch)
    s = []

    s.append(Paragraph("Daily Standard", title_style))
    s.append(Paragraph("Product Formulation Spec (V1)", ParagraphStyle("T2", fontName="Helvetica",
                        fontSize=14, textColor=WARM_GRAY, spaceAfter=4)))
    s.append(Paragraph("February 2026 — Final spec for vendor outreach", subtitle_style))
    s.append(hr())

    s.append(Paragraph("Product Overview", h1_style))
    s.append(Paragraph("A clear, juice-like whey protein isolate designed for daily use. Not a thick shake. "
                        "Optimized for the highest protein-to-calorie ratio with zero junk.", body))
    s.append(sp())

    s.append(Paragraph("Target Formulation", h1_style))
    s.append(tbl([
        ["Attribute", "Spec"],
        ["Protein per serving", "20g"],
        ["Calories per serving", "~80"],
        ["Total fat", "0g"],
        ["Total carbohydrates", "0g"],
        ["Total sugars / Added sugars", "0g / 0g"],
        ["Sodium", "Under 100mg"],
        ["Lactose", "0g (lactose-free via triple filtration)"],
    ]))
    s.append(sp())

    s.append(Paragraph("Ingredients (5 Max)", h1_style))
    s.append(tbl([
        ["#", "Ingredient", "Purpose"],
        ["1", "Grass-fed whey protein isolate", "Primary protein. Triple-filtered. Non-GMO, hormone-free."],
        ["2", "Citric acid", "Tartness / flavor balance"],
        ["3", "Natural flavor", "Taste (natural only)"],
        ["4", "Stevia extract (Reb M preferred)", "Zero-calorie sweetener. Light, not candy."],
        ["5", "Natural color (turmeric / fruit juice)", "Visual appeal"],
    ], col_widths=[0.3*inch, 2.2*inch, 3.5*inch]))
    s.append(sp())

    s.append(Paragraph("Excluded Ingredients (Non-Negotiable)", h1_style))
    for item in ["No artificial sweeteners (sucralose, aspartame, acesulfame-K)",
                 "No gums (xanthan, guar, gellan, carrageenan)",
                 "No artificial flavors or colors",
                 "No fillers or bulking agents",
                 "No soy lecithin, no maltodextrin",
                 "No sugar alcohols (erythritol, sorbitol)"]:
        s.append(Paragraph(item, bullet))
    s.append(sp())

    s.append(Paragraph("Format & Packaging", h1_style))
    s.append(tbl([
        ["Attribute", "Spec"],
        ["Serving size", "~25-28g scoop (yields 20g protein)"],
        ["Servings per bag", "18-20"],
        ["Bag weight", "~450-560g (~1 lb)"],
        ["Package type", "Resealable stand-up pouch (matte finish)"],
        ["Scoop included", "Yes"],
    ]))
    s.append(sp())

    s.append(Paragraph("V1 Flavor", h1_style))
    s.append(Paragraph("<b>Launch:</b> Lightly Sweetened Vanilla — clean, light, drinkable. Not milkshake-sweet.", body))
    s.append(Paragraph("<b>V2 considerations:</b> Lemon/Citrus (juice-like) or Unflavored/Neutral.", body))
    s.append(sp())

    s.append(Paragraph("Quality & Testing", h1_style))
    for item in ["Grass-fed, hormone-free, non-GMO source certification",
                 "cGMP-certified, FDA-registered facility in USA",
                 "COA per batch: protein content, heavy metals, microbiology, label accuracy",
                 "Allergen: Contains Milk",
                 "Shelf life target: 18-24 months"]:
        s.append(Paragraph(item, bullet))
    s.append(sp())

    s.append(Paragraph("Production Requirements", h1_style))
    s.append(tbl([
        ["Attribute", "Target"],
        ["First run MOQ", "1,000-2,500 units"],
        ["Target cost per unit", "$8-15 (at MOQ)"],
        ["Lead time", "8-16 weeks"],
        ["Scalability", "5,000-10,000 units on subsequent runs"],
    ]))

    doc.build(s)
    print(f"  Created: {out}")


def build_vendor_outreach():
    out = os.path.join(BASE, "docs", "VENDOR_OUTREACH_EMAIL.pdf")
    doc = SimpleDocTemplate(out, pagesize=letter, rightMargin=0.7*inch, leftMargin=0.7*inch,
                            topMargin=0.7*inch, bottomMargin=0.7*inch)
    s = []

    s.append(Paragraph("Daily Standard", title_style))
    s.append(Paragraph("Vendor Outreach Templates", ParagraphStyle("T2", fontName="Helvetica",
                        fontSize=14, textColor=WARM_GRAY, spaceAfter=4)))
    s.append(Paragraph("February 2026", subtitle_style))
    s.append(hr())

    s.append(Paragraph("Email Template", h1_style))
    s.append(Paragraph("<b>Subject:</b> Clear Whey Protein Isolate — New Brand Inquiry (Low MOQ)", bold_body))
    s.append(sp(0.15))

    email_lines = [
        "Hi [Name / Team],",
        "",
        "I'm reaching out from Daily Standard, a new protein brand launching in 2026. We're developing a clear whey protein isolate product and are looking for a manufacturing partner for our first production run.",
        "",
        "<b>About the product:</b>",
    ]
    for line in email_lines:
        s.append(Paragraph(line if line else "&nbsp;", body))

    for item in [
        "Clear whey protein isolate (juice-like format, not a thick shake)",
        "20g protein per serving, ~80 calories",
        "5 ingredients max: grass-fed whey isolate, citric acid, natural flavor, stevia extract, natural color",
        "No artificial sweeteners, no gums, no fillers",
        "Grass-fed, non-GMO, lactose-free (triple-filtered)",
        "Resealable stand-up pouch, 18-20 servings per bag",
        "V1 flavor: Lightly Sweetened Vanilla",
    ]:
        s.append(Paragraph(item, bullet))

    s.append(sp(0.1))
    s.append(Paragraph("<b>What we need from a partner:</b>", body))
    for item in [
        "cGMP-certified, FDA-registered facility",
        "Formulation / R&D support (flavor development, stevia optimization)",
        "First run MOQ of 1,000-2,500 units",
        "Third-party lab testing (COA per batch)",
        "Fill and seal into our branded pouches (we provide label artwork)",
        "Lead time estimate",
    ]:
        s.append(Paragraph(item, bullet))

    s.append(sp(0.1))
    s.append(Paragraph("<b>Questions for you:</b>", body))
    for item in [
        "Can you produce a clear whey isolate with no gums and stevia-only sweetening?",
        "What is your MOQ and cost per unit at MOQ vs 5,000 units?",
        "Do you source the raw whey isolate, or do we need to supply it?",
        "What is your typical lead time from formulation approval to finished product?",
        "Do you handle packaging procurement (pouches), or do we supply them?",
        "Can you provide a sample or pilot run before committing to a full production order?",
    ]:
        s.append(Paragraph(item, bullet))

    s.append(sp(0.15))
    s.append(Paragraph("We're a small, founder-led brand. We value transparency, quality, and a partner "
                        "who can grow with us. Happy to jump on a call to discuss further.", body))
    s.append(sp(0.1))
    s.append(Paragraph("Thanks,<br/>[Your Name]<br/>Daily Standard<br/>[Email] | [Phone]", body))

    s.append(PageBreak())

    s.append(Paragraph("Vendors to Contact", h1_style))
    s.append(tbl([
        ["Company", "Contact", "Notes"],
        ["Bactolac Pharmaceutical", "(631) 951-4908 / info@bactolac.com", "NY. Offers clear protein formulations."],
        ["Nutricraft Labs", "nutricraftlabs.com", "Low MOQ (1,000 units). US & Canada."],
        ["Daily Manufacturing (DLY)", "dlymfg.com", "500-2,500 MOQ. Custom formulation."],
        ["Steuart Nutrition", "steuartnutrition.com", "In-house R&D, custom flavors."],
        ["JW Nutritional", "jwnutritional.com", "cGMP certified. Formulation assistance."],
    ], col_widths=[1.5*inch, 2*inch, 2.5*inch]))

    s.append(sp(0.2))
    s.append(Paragraph("Follow-Up Template (5 Business Days, No Response)", h1_style))
    s.append(Paragraph("<b>Subject:</b> Re: Clear Whey Protein Isolate — New Brand Inquiry", bold_body))
    s.append(sp(0.1))
    s.append(Paragraph("Hi [Name / Team],", body))
    s.append(sp(0.05))
    s.append(Paragraph("Just following up on my email from [date]. We're moving quickly on our first production run "
                        "and would love to include [Company] in our evaluation.", body))
    s.append(sp(0.05))
    s.append(Paragraph("Would you be available for a quick 15-minute call this week to discuss capabilities and pricing?", body))
    s.append(sp(0.05))
    s.append(Paragraph("Thanks,<br/>[Your Name]", body))

    doc.build(s)
    print(f"  Created: {out}")


def build_legal_checklist():
    out = os.path.join(BASE, "docs", "LEGAL_REGULATORY_CHECKLIST.pdf")
    doc = SimpleDocTemplate(out, pagesize=letter, rightMargin=0.7*inch, leftMargin=0.7*inch,
                            topMargin=0.7*inch, bottomMargin=0.7*inch)
    s = []

    s.append(Paragraph("Daily Standard", title_style))
    s.append(Paragraph("Legal, Regulatory & Compliance Checklist", ParagraphStyle("T2", fontName="Helvetica",
                        fontSize=14, textColor=WARM_GRAY, spaceAfter=4)))
    s.append(Paragraph("February 2026", subtitle_style))
    s.append(hr())

    # 1. LLC
    s.append(Paragraph("1. Business Formation", h1_style))
    for item in [
        "Choose state (Delaware for investors, or home state for simplicity)",
        "File Articles of Organization ($90-500)",
        "Get EIN from IRS (free, instant at irs.gov)",
        "Open business bank account (requires EIN + Articles)",
        "Draft Operating Agreement (critical with 2 founders — ownership, roles, exit terms)",
        "Register for state sales tax (home state + nexus states)",
        "File DBA if LLC name differs from brand name",
    ]:
        s.append(Paragraph(item, check_style))
    s.append(Paragraph("<b>Estimated cost: $150-600</b>", body))
    s.append(sp())

    # 2. Insurance
    s.append(Paragraph("2. Product Liability Insurance", h1_style))
    s.append(Paragraph("Required by retailers/marketplaces. Protein powder = low-risk category.", body))
    s.append(sp(0.05))
    s.append(tbl([
        ["Coverage", "Recommended"],
        ["Product liability", "$1M per occurrence / $2M aggregate"],
        ["General liability", "$1M per occurrence / $2M aggregate"],
    ]))
    s.append(sp(0.1))
    s.append(tbl([
        ["Provider", "Notes"],
        ["Insurance Canopy", "Supplement-specific, online quotes"],
        ["The Hartford", "Major carrier, dietary supplement coverage"],
        ["Castle Rock Agency", "Supplement/nutraceutical specialist"],
    ]))
    s.append(Paragraph("<b>Estimated cost: $2,800-5,800/year</b>", body))
    s.append(sp())

    # 3. FDA
    s.append(Paragraph("3. FDA Compliance", h1_style))
    s.append(Paragraph("Protein powder = dietary supplement under DSHEA. No FDA approval needed, but must comply:", body))
    s.append(sp(0.05))
    for item in [
        "<b>cGMP:</b> Co-packer must be certified (21 CFR Part 111)",
        "<b>FDA Facility Registration:</b> Co-packer + any warehouse must be registered (FURLS system)",
        "<b>Supplement Facts panel:</b> Required (not 'Nutrition Facts'). Serving size, servings, calories, protein, all ingredients.",
        "<b>Identity statement:</b> Label must say 'Dietary Supplement'",
        "<b>Structure/function claims:</b> File with FDA within 30 days + include disclaimer on label",
        "<b>NDI notification:</b> NOT required (all ingredients are pre-DSHEA)",
        "<b>Adverse event reporting:</b> Serious events reported to FDA within 15 business days",
    ]:
        s.append(Paragraph(item, check_style))

    s.append(PageBreak())

    # 4. Labeling
    s.append(Paragraph("4. Label Requirements", h1_style))
    s.append(tbl([
        ["Element", "Requirement"],
        ["Statement of identity", "'Dietary Supplement' or 'Protein Dietary Supplement'"],
        ["Net quantity", "Weight in grams and ounces"],
        ["Supplement Facts panel", "FDA-format with serving size, nutrients, % DV"],
        ["Ingredient list", "All ingredients, descending order by weight"],
        ["Allergen statement", "'Contains: Milk'"],
        ["Company info", "Name and place of business (city, state, zip)"],
        ["Lot number", "Batch identifier for traceability"],
        ["Best-by date", "Optional but recommended"],
        ["Structure/function disclaimer", "Required if making any health claims"],
    ]))
    s.append(sp())

    # 5. Lab Testing
    s.append(Paragraph("5. Third-Party Lab Testing", h1_style))
    s.append(Paragraph("<b>Minimum:</b> Certificate of Analysis (COA) per batch:", body))
    for item in ["Protein content verification", "Heavy metals (lead, arsenic, cadmium, mercury)",
                 "Microbiological (E. coli, salmonella, yeast, mold)", "Label accuracy"]:
        s.append(Paragraph(item, bullet))
    s.append(sp(0.05))
    s.append(Paragraph("<b>Recommended:</b> Post COA results on website.", body))
    s.append(Paragraph("<b>Optional (later):</b> NSF Certified for Sport or Informed Sport.", body))
    s.append(Paragraph("<b>Cost:</b> $500-1,500 per batch COA.", body))
    s.append(sp())

    # 6. Prop 65
    s.append(Paragraph("6. California Prop 65", h1_style))
    s.append(Paragraph("Review COA for heavy metal levels. Compare to Prop 65 thresholds (Lead: 0.5 mcg/day, "
                        "Cadmium: 4.1 mcg/day). If above, add warning to label and website.", body))
    s.append(sp())

    # 7. Trademark
    s.append(Paragraph("7. Trademark", h1_style))
    for item in [
        "Search USPTO for 'Daily Standard' in Class 5 (supplements) and Class 29 (protein)",
        "File trademark application ($250-350 per class via TEAS)",
        "Timeline: 8-12 months; can use TM symbol immediately upon filing",
    ]:
        s.append(Paragraph(item, check_style))
    s.append(sp())

    # 8. Launch checklist
    s.append(Paragraph("8. Before First Sale — Checklist", h1_style))
    for item in [
        "LLC formed and EIN obtained",
        "Business bank account opened",
        "Operating agreement signed (2 founders)",
        "Product liability insurance purchased",
        "Co-packer verified (cGMP, FDA-registered)",
        "Label reviewed for FDA compliance",
        "COA obtained for first batch",
        "Prop 65 status determined",
        "Structure/function claim filed (if applicable)",
        "Sales tax registration completed",
        "Trademark search completed",
    ]:
        s.append(Paragraph(item, check_style))

    doc.build(s)
    print(f"  Created: {out}")


def build_ad_test_plan():
    out = os.path.join(BASE, "docs", "AD_TEST_PLAN.pdf")
    doc = SimpleDocTemplate(out, pagesize=letter, rightMargin=0.7*inch, leftMargin=0.7*inch,
                            topMargin=0.7*inch, bottomMargin=0.7*inch)
    s = []

    s.append(Paragraph("Daily Standard", title_style))
    s.append(Paragraph("Meta Ad Test Plan", ParagraphStyle("T2", fontName="Helvetica",
                        fontSize=14, textColor=WARM_GRAY, spaceAfter=4)))
    s.append(Paragraph("February 2026 — $500-1,000 budget over 2-4 weeks", subtitle_style))
    s.append(hr())

    s.append(Paragraph("Campaign Setup", h1_style))
    s.append(tbl([
        ["Setting", "Value"],
        ["Objective", "Conversions (Lead / Form submission)"],
        ["Daily budget", "$25-35/day"],
        ["Duration", "14-28 days"],
        ["Placement", "Automatic (IG Feed, Stories, Reels + FB Feed, Stories)"],
        ["Bid strategy", "Lowest cost"],
    ]))
    s.append(sp())

    s.append(Paragraph("Audience Targeting", h1_style))
    s.append(Paragraph("<b>Primary (Interest-based):</b>", body))
    s.append(tbl([
        ["Parameter", "Value"],
        ["Age", "28-50"],
        ["Gender", "Men"],
        ["Location", "United States"],
        ["Interests", "Protein, Fitness, Health + Parenting, Fatherhood, Family"],
        ["Exclude", "Bodybuilding"],
    ]))
    s.append(sp())

    s.append(Paragraph("4 Ad Angles to Test", h1_style))
    s.append(sp(0.05))

    s.append(Paragraph("Ad 1: The Permission Angle", h2_style))
    s.append(Paragraph("<b>Hook:</b> You don't need a workout to need protein.", body))
    s.append(Paragraph("Daily Standard is clear grass-fed protein for the days you train — and the days you don't. "
                        "20g protein. 80 calories. 5 ingredients. No artificial sweeteners. No gums. "
                        "Just clean protein that drinks like juice.", body))
    s.append(sp(0.1))

    s.append(Paragraph("Ad 2: The Dad Reality Angle", h2_style))
    s.append(Paragraph("<b>Hook:</b> You used to work out 6 days a week.", body))
    s.append(Paragraph("Now it's 2 if the stars align. Being a dad changed everything — except the fact that you "
                        "still need protein. Clear grass-fed whey isolate. 20g protein. 80 calories. Zero junk. "
                        "Made by two dads who got tired of the same old protein.", body))
    s.append(sp(0.1))

    s.append(Paragraph("Ad 3: The Anti-Hype Angle", h2_style))
    s.append(Paragraph("<b>Hook:</b> Protein, not a personality.", body))
    s.append(Paragraph("No influencer told us to make this. Two dads built the protein they wanted: clear, clean, "
                        "5 ingredients, drinks like juice. 20g protein. 80 calories. No artificial sweeteners. No gums. No BS.", body))
    s.append(sp(0.1))

    s.append(Paragraph("Ad 4: The Product Angle", h2_style))
    s.append(Paragraph("<b>Hook:</b> 20g protein. 80 calories. 5 ingredients. Clear.", body))
    s.append(Paragraph("Daily Standard is grass-fed whey isolate that mixes clear like juice — not a thick chalk shake. "
                        "No artificial sweeteners. No gums. No fillers. Third-party tested. Made for dads who want to take "
                        "care of themselves without making it a whole thing.", body))

    s.append(PageBreak())

    s.append(Paragraph("Success Metrics", h1_style))
    s.append(tbl([
        ["Metric", "Target", "Red Flag"],
        ["Cost per lead (CPL)", "Under $3-5", "Over $8"],
        ["Click-through rate (CTR)", "Above 1.5%", "Below 0.8%"],
        ["Landing page conversion", "Above 20%", "Below 10%"],
        ["Total signups (2 weeks)", "100-200", "Under 50"],
        ["Total signups (4 weeks)", "200-500", "Under 100"],
    ], col_widths=[2*inch, 2*inch, 2*inch]))
    s.append(sp())

    s.append(Paragraph("Decision Framework", h1_style))
    s.append(tbl([
        ["Result", "Action"],
        ["CPL under $3 + 200+ signups", "Strong signal. Move to pre-orders or production."],
        ["CPL $3-5 + 100+ signups", "Good signal. Refine messaging, test new angles."],
        ["CPL $5-8", "Weak signal. Rethink targeting or creative."],
        ["CPL over $8", "Pause. Revisit positioning, audience, or offer."],
    ]))
    s.append(sp())

    s.append(Paragraph("Testing Schedule", h1_style))
    s.append(Paragraph("<b>Week 1-2:</b> Launch all 4 angles with equal budget. No changes for first 3-4 days.", body))
    s.append(Paragraph("<b>Week 2-3:</b> Kill underperformers. Shift budget to top 1-2. Test variations of winners.", body))
    s.append(Paragraph("<b>Week 3-4:</b> Increase budget on winners by 20-30%. Test Lookalike audience if 100+ signups.", body))
    s.append(sp())

    s.append(Paragraph("Pre-Launch Checklist", h1_style))
    for item in [
        "Meta Business Manager account created",
        "Ad account set up with payment method",
        "Meta Pixel installed on landing page",
        "Custom conversion event for form submission",
        "Email capture connected (Klaviyo / ConvertKit)",
        "4 ad creatives designed (1080x1080 + 1080x1920)",
        "Ad copy finalized (4 angles)",
        "Audiences saved in Ads Manager",
        "Pixel Helper verified",
    ]:
        s.append(Paragraph(item, check_style))

    doc.build(s)
    print(f"  Created: {out}")


if __name__ == "__main__":
    print("Generating PDFs...")
    build_formulation_spec()
    build_vendor_outreach()
    build_legal_checklist()
    build_ad_test_plan()
    print("Done.")
