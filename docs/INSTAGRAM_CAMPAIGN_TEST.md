# Instagram / Meta Ads — 7-Day Validation Test ($350)

**Goal:** Measure whether enough dads click through, engage, and show purchase intent (checkout start + sold-out email capture) to justify manufacturing.

**Budget:** $350 total · **$50/day** · **7 consecutive days**

**Platform:** Meta Ads Manager (Instagram + Facebook placements — same campaign)

---

## 1. Campaign Structure

| Level | Setting |
|--------|---------|
| **Campaign objective** | **Sales** (or **Traffic** if pixel not ready — see below) |
| **Buying type** | Auction |
| **Campaign name** | `DS_Validation_Week1_2026` |

**If Meta Pixel / Conversions API is not installed yet:** Use **Traffic** objective with destination `dailystandardprotein.com/shop.html` (or your landing URL). You’ll optimize for **link clicks**. Add Pixel + Purchase/Lead events before the next test for better optimization.

**If Pixel is on the site:** Use **Sales** or **Leads** and optimize for **Complete registration** (email submit) or a custom event (e.g. `InitiateCheckout`).

---

## 2. Budget & Schedule

| Setting | Value |
|---------|--------|
| Daily budget | **$50.00 USD** |
| Lifetime budget | **$350.00** (or daily cap $50 × 7 days) |
| Run dates | **7 days** — set exact start/end in Ads Manager |
| Bid strategy | Lowest cost (default) — fine at this spend level |

**Why $50/day:** Enough to exit learning phase slowly for one small ad set; splitting $350 across fewer days with the same total would concentrate spend but not change total reach much.

---

## 3. Audience (Starting Point)

| Field | Recommendation |
|--------|------------------|
| **Locations** | United States |
| **Age** | 28–50 (aligns with Steve persona) |
| **Gender** | Men (test a broad or “all” duplicate later if you want data) |
| **Detailed targeting** | Interests: *Parenting*, *Fitness and wellness*, *Nutrition*, *Protein supplements* (pick 2–4; don’t over-narrow) |
| **Placements** | **Advantage+ placements** first, or **Manual:** Instagram Feed, Reels, Stories (where your creative is vertical-friendly) |

**Audience size:** Aim for **2M–20M** in the US; if too small, loosen interests or age slightly.

---

## 4. Creative (Ads)

- **3–5 ads** in one ad set (let Meta rotate). Use your **Honest Morning / dad chaos** concepts + product stills.
- **Primary text:** 2–3 variants testing hook (relatable dad vs. clear protein vs. no bloating).
- **Destination:** `https://dailystandardprotein.com/shop.html` (or homepage if you prefer story-first).
- **CTA button:** Shop now / Learn more

---

## 5. What to Measure (Success Criteria)

Track in **Ads Manager** + **site** (Pixel / events):

| Metric | Why it matters |
|--------|----------------|
| **Spend** | Stay near $350 total |
| **CTR (link)** | Creative resonance (rough benchmark: 0.8–2%+ for cold traffic varies widely) |
| **CPC (link)** | Cost to get someone on-site |
| **Landing page views** | Top-of-funnel interest |
| **Initiate checkout** (or **Shop page → Checkout start**) | Purchase intent |
| **Sold-out email submits** | Strong intent + list growth (via your checkout flow + Mailchimp) |

**Rough internal benchmarks (not guarantees):** At $50/day you might see on the order of **hundreds to a few thousand** impressions per day depending on CPM ($8–$25+ is common in competitive categories). **50–200+ link clicks** for the week is plausible; use *your* numbers as the baseline for the next test.

**Decision framing (example — adjust to your bar):**

- **Green light:** Healthy CTR, meaningful checkout starts, and **dozens+** of sold-out/waitlist emails at acceptable cost per email.
- **Yellow:** Good clicks but weak checkout — improve landing/shop page, creative, or audience.
- **Red:** Very high CPC, no checkout intent — pause, revise offer/creative before manufacturing spend.

---

## 6. Before You Launch Checklist

- [ ] **Shop URL** live: `/shop.html` → checkout flow works
- [ ] **Meta Pixel** installed (recommended) — base code + events: `PageView`, `InitiateCheckout`, `Lead` (or custom for sold-out submit)
- [ ] **UTM parameters** on ad links for reporting, e.g.  
  `?utm_source=meta&utm_medium=paid&utm_campaign=validation_week1`
- [ ] **Mailchimp** env vars set on Netlify; test sold-out email capture
- [ ] **Privacy policy** mentions email collection and preorder/interest flows (legal review if unsure)
- [ ] **Disclaimer** on checkout: no payment processed; interest list only (see site copy)

---

## 7. After the Test

- Export Ads Manager breakdown by ad (creative) and age/placement.
- Export Mailchimp segment for **checkout sold-out** tag (if you use tags).
- Document: total spend, clicks, checkout starts, emails captured — then decide on manufacturing.
