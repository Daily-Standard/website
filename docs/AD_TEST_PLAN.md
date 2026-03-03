# Daily Standard — Meta Ad Test Plan

**Date:** February 2026  
**Objective:** Validate demand and messaging by driving email waitlist signups at a sustainable cost.  
**Platform:** Meta (Instagram + Facebook)  
**Budget:** $500–1,000 over 2–4 weeks

---

## 1. Campaign Structure

### Campaign Objective

**Conversions** — optimize for email signup (landing page form submission)

If Meta pixel is not yet set up, start with **Traffic** objective optimized for landing page views, then switch to Conversions once pixel has enough data (50+ events).

### Campaign Setup

| Setting | Value |
|---------|-------|
| Campaign objective | Conversions (or Traffic for initial learning) |
| Optimization event | Lead / Form submission |
| Budget type | Daily budget |
| Daily budget | $25-35/day |
| Duration | 14-28 days |
| Placement | Automatic (Instagram Feed, Stories, Reels + Facebook Feed, Stories) |
| Bid strategy | Lowest cost (let Meta optimize) |

---

## 2. Audience Targeting

### Primary Audience (Cold — Interests)

| Parameter | Value |
|-----------|-------|
| **Age** | 28-50 |
| **Gender** | Men |
| **Location** | United States |
| **Interests** | Protein supplements, Whey protein, Fitness, Health and wellness, Nutrition, Weight training |
| **AND** | Parenting, Fatherhood, Family, Dad |
| **Exclusion** | Bodybuilding (exclude pure gym-bro audience) |
| **Estimated audience size** | 5-15M |

### Secondary Audience (Cold — Broader)

| Parameter | Value |
|-----------|-------|
| **Age** | 30-45 |
| **Gender** | Men |
| **Interests** | Healthy eating, Clean eating, Meal prep, Self improvement |
| **AND** | Parenting, Family |
| **Estimated audience size** | 8-20M |

### Lookalike (Phase 2 — after 100+ signups)

- 1% Lookalike from email list
- 1% Lookalike from landing page visitors (requires pixel data)

---

## 3. Ad Creative — 4 Angles to Test

Run 4 ad variations to test which message resonates. Each angle gets equal budget for the first 7 days, then shift budget to winners.

### Ad 1: "The Permission" Angle

**Hook:** You don't need a workout to need protein.

**Body:** Daily Standard is clear grass-fed protein for the days you train — and the days you don't. 20g protein. 80 calories. 5 ingredients. No artificial sweeteners. No gums. No gym-bro energy. Just clean protein that drinks like juice.

**CTA:** Join the founding members. Early access + founding member pricing.

**Visual:** Simple product shot (or text-on-cream background) with the headline. Clean, minimal.

---

### Ad 2: "The Dad Reality" Angle

**Hook:** You used to work out 6 days a week.

**Body:** Now it's 2 if the stars align. Being a dad changed everything — except the fact that you still need protein. Daily Standard: clear grass-fed whey isolate. 20g protein. 80 calories. Zero junk. Made by two dads who got tired of the same old protein.

**CTA:** Be first. Get founding member pricing.

**Visual:** Text-heavy on dark background. Bold headline. Stats underneath.

---

### Ad 3: "The Anti-Hype" Angle

**Hook:** Protein, not a personality.

**Body:** No influencer told us to make this. No lab-coat scientist formulated it for "optimal bioavailability." Two dads built the protein they wanted: clear, clean, 5 ingredients, drinks like juice. 20g protein. 80 calories. No artificial sweeteners. No gums. No BS.

**CTA:** Join the waitlist. Founding member pricing available.

**Visual:** Minimal text on cream background. "Daily Standard" wordmark prominent.

---

### Ad 4: "The Product" Angle

**Hook:** 20g protein. 80 calories. 5 ingredients. Clear.

**Body:** Daily Standard is grass-fed whey isolate that mixes clear like juice — not a thick chalk shake. No artificial sweeteners. No gums. No fillers. Third-party tested. Made for dads who want to take care of themselves without making it a whole thing.

**CTA:** Early access for founding members.

**Visual:** Product mockup or ingredient list graphic. Clean, informational.

---

## 4. Ad Formats

| Format | Platform | Notes |
|--------|----------|-------|
| **Single image** | Feed (IG + FB) | Primary format — clean, minimal, text-forward |
| **Stories (9:16)** | IG + FB Stories | Vertical format, bold headline, swipe-up CTA |
| **Reels (9:16)** | IG Reels | Optional — founder-led video (phone quality is fine) |

### Image Specs

- Feed: 1080 x 1080px (1:1 square)
- Stories/Reels: 1080 x 1920px (9:16 vertical)
- Keep text under 20% of image area
- Use brand colors: cream background (#F5F2ED), near-black text (#2C2C2C), olive accent (#4A6741)
- Font: DM Sans Bold for headlines

---

## 5. Landing Page Setup

### Meta Pixel

- [ ] Install Meta Pixel on landing page (add to `<head>` of `index.html`)
- [ ] Set up custom conversion event for form submission
- [ ] Verify pixel is firing correctly using Meta Pixel Helper (Chrome extension)

### Pixel Code (add to index.html `<head>`):

```html
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
<!-- End Meta Pixel Code -->
```

### Track Form Submission

Add to the form submission handler in `index.html`:

```javascript
// Fire after successful email submission
if (typeof fbq !== 'undefined') {
  fbq('track', 'Lead', { content_name: 'founding_member_signup' });
}
```

---

## 6. Success Metrics

| Metric | Target | Red Flag |
|--------|--------|----------|
| **Cost per lead (CPL)** | Under $3-5 | Over $8 |
| **Click-through rate (CTR)** | Above 1.5% | Below 0.8% |
| **Landing page conversion rate** | Above 20% | Below 10% |
| **Total signups (2-week test)** | 100-200 | Under 50 |
| **Total signups (4-week test)** | 200-500 | Under 100 |

### Decision Framework

| Result | Action |
|--------|--------|
| CPL under $3 + 200+ signups | Strong signal. Move to pre-orders or production. |
| CPL $3-5 + 100+ signups | Good signal. Refine messaging, test new angles. |
| CPL $5-8 | Weak signal. Rethink targeting or creative. |
| CPL over $8 | Pause. Revisit positioning, audience, or offer. |

---

## 7. Testing Schedule

### Week 1-2: Discovery

- Launch all 4 ad angles with equal budget ($6-8/day each)
- Let Meta optimize delivery
- Monitor daily: CPL, CTR, conversion rate
- Do NOT make changes for first 3-4 days (let pixel learn)

### Week 2-3: Optimize

- Kill underperforming ads (CPL 2x above best performer)
- Shift budget to top 1-2 performers
- Test 1-2 new creative variations of the winning angle
- Introduce secondary audience if primary is performing

### Week 3-4: Scale (if warranted)

- Increase daily budget on winners by 20-30%
- Test Lookalike audience (if 100+ signups collected)
- Consider Reels format with founder video

---

## 8. Pre-Launch Checklist

- [ ] Meta Business Manager account created
- [ ] Ad account set up with payment method
- [ ] Meta Pixel installed on landing page
- [ ] Custom conversion event set up (form submission)
- [ ] Email capture connected (Klaviyo, ConvertKit, or Mailchimp)
- [ ] 4 ad creatives designed (1080x1080 and 1080x1920)
- [ ] Ad copy written (4 angles above)
- [ ] Audiences saved in Ads Manager
- [ ] Daily budget set ($25-35/day)
- [ ] Pixel Helper verified (Chrome extension)
