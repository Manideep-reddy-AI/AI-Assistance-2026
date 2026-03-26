# 🚀 Equora — Complete Deployment Guide
# From zero to live site in ~2 hours

---

## STEP 1 — Set up Supabase (15 mins · Free)

1. Go to https://supabase.com → "Start your project"
2. Sign up → "New project" → Name it "equora" → Set a strong DB password → Choose region "ap-south-1" (Mumbai)
3. Wait ~2 mins for project to spin up
4. Go to **SQL Editor** → "New Query" → Paste entire contents of `supabase-schema.sql` → Click **Run**
5. Go to **Settings → API** → Copy:
   - `Project URL` → paste as `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → paste as `SUPABASE_SERVICE_ROLE_KEY`

---

## STEP 2 — Get Anthropic API Key (5 mins)

1. Go to https://console.anthropic.com
2. Sign up / log in → "API Keys" → "Create Key"
3. Copy the key → paste as `ANTHROPIC_API_KEY`
4. Add billing info (you'll pay ~₹0.20 per analysis)

---

## STEP 3 — Set up Razorpay (20 mins)

1. Go to https://dashboard.razorpay.com
2. Sign up with your business details (or personal for testing)
3. Complete KYC (required for live payments)
4. Go to **Settings → API Keys** → "Generate Test Key" first
5. Copy `Key ID` → paste as both `RAZORPAY_KEY_ID` and `NEXT_PUBLIC_RAZORPAY_KEY_ID`
6. Copy `Key Secret` → paste as `RAZORPAY_KEY_SECRET`

> 💡 For testing, use test keys first. Switch to live keys after KYC is complete.

---

## STEP 4 — Deploy to Vercel (10 mins · Free)

### Option A: GitHub (Recommended)

1. Create a GitHub account if you don't have one
2. Create a new repository: https://github.com/new → Name it "equora"
3. In your terminal:
   ```bash
   cd equora
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/equora.git
   git push -u origin main
   ```
4. Go to https://vercel.com → "Add New Project" → Import your GitHub repo
5. In **Environment Variables**, add ALL variables from `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   ANTHROPIC_API_KEY
   RAZORPAY_KEY_ID
   RAZORPAY_KEY_SECRET
   NEXT_PUBLIC_RAZORPAY_KEY_ID
   NEXT_PUBLIC_APP_URL  (set to your Vercel URL or custom domain)
   ```
6. Click **Deploy** → Wait ~3 mins → Your site is live!

### Option B: Direct Upload

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the equora folder
3. Follow prompts → Add env vars when asked

---

## STEP 5 — Add Custom Domain (10 mins · ~₹800/year)

1. Buy a domain:
   - **GoDaddy**: https://in.godaddy.com → search "equora.in"
   - **Namecheap**: https://namecheap.com
   - **BigRock** (Indian): https://bigrock.in

2. In Vercel → your project → **Domains** → "Add Domain" → type your domain
3. Vercel gives you DNS records → copy them
4. In your domain registrar → DNS settings → add the records Vercel gave you
5. Wait 5-30 mins → your domain is live with HTTPS automatically

6. Update `NEXT_PUBLIC_APP_URL` in Vercel env vars to your domain

---

## STEP 6 — Configure Supabase Auth for Production

1. In Supabase → **Authentication → URL Configuration**
2. Set **Site URL**: `https://your-domain.com`
3. Add **Redirect URLs**: `https://your-domain.com/**`
4. Save changes

---

## STEP 7 — Test Everything (30 mins)

Test this checklist:

- [ ] Landing page loads at your domain
- [ ] Register with a new email
- [ ] Login works
- [ ] Upload the sample CSV → analysis generates
- [ ] Ask follow-up questions in portfolio chat
- [ ] Research a stock in Research page
- [ ] Settings page saves name changes
- [ ] Pricing page loads
- [ ] Razorpay checkout opens (use test card: 4111 1111 1111 1111)
- [ ] After test payment, account shows Pro plan
- [ ] Terms and Privacy pages load
- [ ] Mobile view looks good
- [ ] Run production build locally: `npm run build && npm run start`
- [ ] Verify env vars are set in deployment platform
- [ ] Check pages `/robots.txt` and `/sitemap.xml` load correctly

---

## STEP 8 — Performance + SEO pass (15 mins)

1. Open Chrome DevTools → Lighthouse
2. Run audit on home page for **Mobile**
3. Aim for:
   - Performance > 80
   - Accessibility > 90
   - Best Practices > 90
   - SEO > 90
4. Ensure title/description render correctly on social preview tools

---

## STEP 9 — Switch to Live Payments

1. Complete Razorpay KYC at https://dashboard.razorpay.com
2. Once approved (1-2 business days), go to **Settings → API Keys**
3. Generate Live Keys
4. Update in Vercel env vars:
   - `RAZORPAY_KEY_ID` → live key ID
   - `RAZORPAY_KEY_SECRET` → live key secret
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID` → live key ID
5. Redeploy on Vercel

---

## COST BREAKDOWN

| Service | Cost |
|---------|------|
| Supabase | Free (up to 50,000 users) |
| Vercel | Free (up to 100GB bandwidth) |
| Domain (.in) | ~₹800/year |
| Anthropic API | ~₹0.20 per analysis |
| Razorpay | 2% per transaction |
| **Total to launch** | **~₹800** |

At 100 paying Pro users: Revenue ₹49,900/mo, Anthropic cost ~₹2,000/mo, Razorpay fee ~₹998/mo = **~₹47,000/mo profit**

---

## UPDATING YOUR SITE

Every time you make changes:
```bash
git add .
git commit -m "describe your change"
git push
```
Vercel auto-deploys in ~2 mins.

---

## SUPPORT

If you get stuck:
- Supabase docs: https://supabase.com/docs
- Vercel docs: https://vercel.com/docs
- Razorpay docs: https://razorpay.com/docs
- Next.js docs: https://nextjs.org/docs
