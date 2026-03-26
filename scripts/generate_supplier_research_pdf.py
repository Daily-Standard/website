#!/usr/bin/env python3
"""Generate Daily Standard Supplier Research PDF."""

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

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

title_style = ParagraphStyle("Title", fontName="Helvetica-Bold", fontSize=20, spaceAfter=2, textColor=DARK)
subtitle_style = ParagraphStyle("Subtitle", fontName="Helvetica", fontSize=10, textColor=WARM_GRAY, spaceAfter=12)
h1 = ParagraphStyle("H1", fontName="Helvetica-Bold", fontSize=14, spaceBefore=18, spaceAfter=6, textColor=OLIVE)
body = ParagraphStyle("Body", fontName="Helvetica", fontSize=8, leading=10, textColor=DARK)
body_small = ParagraphStyle("BodySmall", fontName="Helvetica", fontSize=7, leading=9, textColor=DARK)

def sp(h=0.1): return Spacer(1, h * inch)
def hr(): return HRFlowable(width="100%", thickness=0.5, color=LIGHT_WARM, spaceBefore=6, spaceAfter=6)

def supplier_table(headers, rows):
    col_widths = [0.4*inch, 1.1*inch, 1.0*inch, 1.2*inch, 0.9*inch, 0.9*inch, 1.5*inch]
    data = [headers] + rows
    wrapped = []
    for row in data:
        wrapped.append([Paragraph(str(c).replace("&", "&amp;"), body_small) for c in row])
    t = Table(wrapped, colWidths=col_widths)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), DARK),
        ("TEXTCOLOR", (0, 0), (-1, 0), CREAM),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 1), (-1, -1), 3),
        ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#FAFAF7")),
        ("GRID", (0, 0), (-1, -1), 0.3, LIGHT_WARM),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return t


def main():
    out = os.path.join(BASE, "docs", "SUPPLIER_RESEARCH.pdf")
    doc = SimpleDocTemplate(out, pagesize=letter, rightMargin=0.5*inch, leftMargin=0.5*inch,
                            topMargin=0.6*inch, bottomMargin=0.6*inch)
    s = []

    s.append(Paragraph("Daily Standard", title_style))
    s.append(Paragraph("Supplier Research", ParagraphStyle("T2", fontName="Helvetica",
                        fontSize=14, textColor=WARM_GRAY, spaceAfter=4)))
    s.append(Paragraph("Clear whey protein isolate — 30 potential manufacturers | March 2026", subtitle_style))
    s.append(hr())

    # US
    s.append(Paragraph("United States (10 Suppliers)", h1))
    s.append(supplier_table(
        ["#", "Company", "Location", "Email", "Website", "Phone", "Notes"],
        [
            ["1", "Bactolac Pharmaceutical", "Hauppauge, NY", "info@bactolac.com", "bactolac.com", "(631) 951-4908", "Clear protein, 25+ yrs, cGMP"],
            ["2", "Nutricraft Labs", "Toronto (US partners)", "Contact form", "nutricraftlabs.com", "—", "Low MOQ 1,000, intermediary"],
            ["3", "Daily Manufacturing", "US", "info@dlymfg.com", "dlymfg.com", "888-222-1575", "500-2,500 MOQ, custom formulation"],
            ["4", "Steuart Nutrition", "Le Roy, MN", "timr@steuartnutrition.com", "steuartnutrition.com", "507-493-5534", "Powders, stick packs, R&D"],
            ["5", "JW Nutritional", "Allen/Plano, TX", "info@jwnutritional.com", "jwnutritional.com", "(214) 221-0404", "Protein focus, NSF"],
            ["6", "Makers Nutrition", "Hauppauge, NY", "Contact form", "makersnutrition.com", "844-625-3771", "Full-service"],
            ["7", "Proven Partners Group", "Elgin, IL", "Contact form", "provenpartnersgroup.com", "(847) 488-1230", "18+ yrs, NSF, pouches"],
            ["8", "Sawgrass Nutra Labs", "Jacksonville, FL", "sales@sawgrassnutralabs.com", "sawgrassnutralabs.com", "(904) 456-0959", "cGMP, 6-8 wk first run"],
            ["9", "ViaCore Nutrition", "Kingfisher, OK", "info@viacorenutrition.com", "viacorenutrition.com", "405-622-5123", "Low MOQ 24-1,000"],
            ["10", "Alpha Creations", "US", "Contact form", "alphacreations.co", "844-788-1144", "Low MOQ, cGMP/FDA"],
        ]
    ))
    s.append(PageBreak())

    # Europe
    s.append(Paragraph("Europe (10 Suppliers)", h1))
    s.append(supplier_table(
        ["#", "Company", "Location", "Email", "Website", "Phone", "Notes"],
        [
            ["1", "Supplement Factory UK", "Ashford, England", "info@supplementfactoryuk.com", "supplementfactoryuk.com", "0330 912 8312", "Clear whey specialist"],
            ["2", "MillMax", "Europe", "Contact form", "millmax.eu", "—", "GMP/HACCP, EU"],
            ["3", "NUTRISPARK", "Ashford, UK", "hello@nutrispark.com", "nutrispark.com", "+44 7766881110", "Protein, flavor expertise"],
            ["4", "Propack", "Lithuania", "info@propack.lt", "propack.lt", "+370 699 76001", "Low MOQ, sachet filling"],
            ["5", "Wheyco", "Hamburg, Germany", "Contact form", "wheyco.de", "—", "WPI, ingredient supplier"],
            ["6", "Nutraply", "Germany", "service@nutraply.com", "nutraply.com", "+49 6475 2009874", "WPI, 22 flavors"],
            ["7", "SG Nova Produktions", "Germany", "Europages", "europages.co.uk", "—", "Whey, private label"],
            ["8", "Qimondo / Noventra", "Tralee, Ireland", "info@qimondo.ie", "qimondo.eu", "+353 66 9130480", "HACCP, flexible batches"],
            ["9", "Irish Supplements", "Ballinasloe, Ireland", "sales@irishsupplements.com", "irishsupplements.com", "—", "30+ yrs, low MOQ"],
            ["10", "Trendful Italia", "Rome, Italy", "info@trendful.it", "trendful.it", "800 72 12 88", "30 yrs pharma, EU"],
        ]
    ))
    s.append(PageBreak())

    # Latin America
    s.append(Paragraph("Central/South America (10 Suppliers)", h1))
    s.append(supplier_table(
        ["#", "Company", "Location", "Email", "Website", "Phone", "Notes"],
        [
            ["1", "LACSA Laboratories", "Mexico", "Contact form", "lacsalaboratorios.com", "—", "10+ yrs, GMP/FDA"],
            ["2", "NutraLuna / Grupo MD", "Guadalajara, MX", "Contact form", "nutraluna.com", "—", "50+ yrs, ~40% savings"],
            ["3", "DiBAR Labs", "Morelia, MX", "QA@dibarlabs.com", "dibarlabs.com", "+1 (832) 499-9961", "3 plants, GMP"],
            ["4", "Costarica Pharma", "Costa Rica", "Site suspended", "costaricapharma.com", "—", "Verify site status"],
            ["5", "Botanic Supplements", "Costa Rica", "usa@botanichealthcare.net", "botanicsupplements.com", "+1 908-617-9152", "USFDA/TGA/EU"],
            ["6", "Laboratorio Soluna", "Colombia", "Contact form", "laboratoriosoluna.com", "+57 311 6303869", "INVIMA registered"],
            ["7", "Laboratorio IH", "Colombia", "Research needed", "—", "—", "63 brands, 1K tons/mo"],
            ["8", "CTC Dominican Rep.", "Dominican Rep.", "e.alvarez@ctc-group.com", "ctc-group.com", "—", "Nutraceuticals"],
            ["9", "GUPharma", "Dominican Rep.", "Contact form", "gupharma.net", "—", "CDMO, 20+ yrs"],
            ["10", "Pronutrition", "São Paulo, Brazil", "Contact form", "pronutrition.com.br", "—", "ANVISA, 10+ yrs export"],
        ]
    ))

    s.append(PageBreak())

    # Research Notes
    s.append(Paragraph("Research Notes", h1))
    s.append(Paragraph("Clear protein specialists: Bactolac (US) and Supplement Factory UK (Europe) explicitly offer clear whey. Others should be asked about acidified/clear formulation capability.", body))
    s.append(sp(0.05))
    s.append(Paragraph("Low MOQ leaders: Nutricraft Labs (1,000), Daily Manufacturing (500-2,500), ViaCore (24-1,000 on stock), Alpha Creations.", body))
    s.append(sp(0.05))
    s.append(Paragraph("Latin America: Colombia has fewer publicly listed contract manufacturers than Mexico. Laboratorio IH contact info was not found. Costarica Pharmaceuticals website was suspended at time of research.", body))
    s.append(sp(0.05))
    s.append(Paragraph("Verification: Contact details should be confirmed before outreach. Websites and emails may have changed.", body))

    s.append(sp(0.2))
    s.append(Paragraph("Next Steps", h1))
    s.append(Paragraph("1. Prioritize US and UK suppliers for clear protein capability.", body))
    s.append(Paragraph("2. Use outreach template in VENDOR_OUTREACH_EMAIL.md.", body))
    s.append(Paragraph("3. Track responses in a spreadsheet (company, date contacted, response status).", body))

    doc.build(s)
    print(f"PDF created: {out}")


if __name__ == "__main__":
    main()
