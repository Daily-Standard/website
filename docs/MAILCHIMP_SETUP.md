# Mailchimp setup (Dad Gains site)

Waitlist, join forms, and the checkout “sold out” modal send emails to Mailchimp via **`/.netlify/functions/subscribe`** (`netlify/functions/subscribe.js`). Follow these steps to connect everything.

---

## 1. Create a Mailchimp Account

1. Go to [mailchimp.com](https://mailchimp.com) and sign up (free tier: ~500 contacts).
2. Complete account setup.

---

## 2. Create an Audience (List)

1. In Mailchimp, go to **Audience** → **All contacts**.
2. Click **Create Audience** (or use the default one).
3. Name it (e.g. "Daily Standard Waitlist").
4. Add your business details and save.

---

## 3. Get Your API Key

1. Click your profile icon (top right) → **Account & Billing**.
2. Go to **Extras** → **API keys**.
3. Click **Create A Key**.
4. Copy the key (format: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us21`).
5. Keep it private — do not commit it to Git.

---

## 4. Get Your Audience (List) ID

1. Go to **Audience** → **All contacts**.
2. Click **Settings** (under the audience name).
3. Under **Audience name and defaults**, find **Audience ID**.
4. Copy it (e.g. `a1b2c3d4e5`).

---

## 5. Set Environment Variables in Netlify

1. Log in to [app.netlify.com](https://app.netlify.com).
2. Open your **Dad Gains** (or linked) Netlify site.
3. Go to **Site configuration** → **Environment variables**.
4. Click **Add a variable** → **Add a single variable**.
5. Add:
   - **Key:** `MAILCHIMP_API_KEY`  
     **Value:** your API key (e.g. `xxxxxxxx-us21`)
6. Add another:
   - **Key:** `MAILCHIMP_LIST_ID`  
     **Value:** your Audience ID (e.g. `a1b2c3d4e5`)
7. Save.

---

## 6. Redeploy

After saving the environment variables:

1. Go to **Deploys**.
2. Click **Trigger deploy** → **Deploy site**.

Or run locally:

```bash
npm run deploy
```

---

## 7. Set Up Welcome Email (Optional)

1. In Mailchimp, go to **Automations**.
2. Click **Create** → **Email**.
3. Choose **Welcome new subscribers**.
4. Select your audience.
5. Design your thank-you email.
6. Turn the automation on.

---

## Checkout “sold out” signups (tag)

When someone completes the interest checkout flow, their email is sent with the tag **`checkout-soldout`**. In Mailchimp you can filter or segment by that tag to see high-intent leads from the fake checkout test.

Create the tag once in Mailchimp (Audience → Tags) or it may be created automatically when the API applies it.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Server configuration error" | Check that `MAILCHIMP_API_KEY` and `MAILCHIMP_LIST_ID` are set in Netlify and redeploy. |
| "Invalid API key" | Regenerate the API key in Mailchimp and update the env var. |
| "Audience not found" | Confirm the Audience ID matches the audience you’re using. |
| Form works locally but not on Netlify | Netlify Functions need a deploy; run `npm run deploy`. |

---

## Summary

| What | Where |
|------|-------|
| API Key | Mailchimp → Account → Extras → API keys |
| Audience ID | Mailchimp → Audience → Settings → Audience ID |
| Env vars | Netlify → Site configuration → Environment variables |
