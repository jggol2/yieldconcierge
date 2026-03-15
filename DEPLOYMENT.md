# Yield Concierge — Deployment Guide
## From this folder to yieldconcierge.com, step by step

---

## PART 1 — GITHUB (5 minutes)

You need a free GitHub account to deploy to Vercel.
If you don't have one: go to github.com → Sign up.

Once you have an account:

1. Go to github.com/new
2. Repository name: yieldconcierge
3. Set to Private
4. Click "Create repository"
5. On the next screen, click "uploading an existing file"
6. Drag the entire contents of this folder into the upload area
   (everything: pages/, components/, styles/, public/, package.json, next.config.js)
7. Click "Commit changes"

---

## PART 2 — VERCEL DEPLOY (5 minutes)

Vercel is where your site will actually run. It's free for this use case.

1. Go to vercel.com → Sign up with your GitHub account
2. Click "Add New Project"
3. Find and select your "yieldconcierge" repository → click "Import"
4. Framework Preset: Next.js (should auto-detect)
5. Leave all other settings as default
6. Click "Deploy"

Vercel will build and deploy your site. After ~2 minutes you'll get a URL like:
  yieldconcierge.vercel.app

Open that URL and test everything — home page, about page, quiz — before touching your domain.

---

## PART 3 — ADD YOUR DOMAIN IN VERCEL (2 minutes)

1. In Vercel, open your project dashboard
2. Go to Settings → Domains
3. Type: yieldconcierge.com → click "Add"
4. Also add: www.yieldconcierge.com → click "Add"
5. Vercel will show you DNS records to set. You'll need these in Part 4.

Vercel will show two records:
  Type A    —  @    →  76.76.21.21
  Type CNAME —  www  →  cname.vercel-dns.com

Keep this tab open.

---

## PART 4 — UPDATE DNS IN WORDPRESS.COM (10 minutes + propagation)

Since your domain is registered through WordPress.com, here's exactly where to go:

1. Log in to WordPress.com
2. In the left sidebar, go to: Upgrades → Domains
   (or go directly to: wordpress.com/domains/manage)
3. Click on "yieldconcierge.com"
4. Click "DNS Records" or "Name Servers" in the domain settings

### Option A — Update DNS Records (recommended, keeps WordPress.com as registrar)

Look for an existing A record pointing to your WordPress host.
Delete it (or edit it) and replace with:

  Type: A
  Name: @ (or leave blank — means root domain)
  Value: 76.76.21.21
  TTL: 3600 (or "Automatic")

Then add (or update) the www CNAME:
  Type: CNAME
  Name: www
  Value: cname.vercel-dns.com
  TTL: 3600

Click Save.

### Option B — Change Name Servers (simpler if you see a "Name Servers" option)

If WordPress.com shows a "Name Servers" panel, you can point the whole domain to Vercel:
  ns1.vercel-dns.com
  ns2.vercel-dns.com

This hands full DNS control to Vercel. Clean and simple.

---

## PART 5 — WAIT FOR PROPAGATION

DNS changes take between 15 minutes and 48 hours to fully propagate worldwide.
Most users see it working within 30–60 minutes.

You can check propagation status at: dnschecker.org
Search for: yieldconcierge.com

Once it shows the new IP (76.76.21.21), your site is live at yieldconcierge.com.

Vercel automatically provisions an SSL certificate (the https:// padlock) — this happens
within a few minutes of DNS pointing to Vercel.

---

## WHAT TO DO WITH WORDPRESS

Once your domain is pointed to Vercel, your WordPress site will no longer be accessible
via yieldconcierge.com. You have two options:

1. KEEP the WordPress hosting — it still exists, just not attached to your domain.
   You can access it via the WordPress.com dashboard if you ever need it.

2. CANCEL the WordPress hosting plan — saves money. Do this only after confirming
   the new site is fully live and working.

Your domain registration is SEPARATE from your hosting plan — canceling hosting
does not lose your domain. The domain remains yours as long as you keep renewing it
through WordPress.com.

---

## UPDATING RATES IN THE FUTURE

Bank rate data lives in: components/HYSAQuiz.jsx

The BANKS array (line ~3) and TIERS array (line ~67) are where all rates live.
To update:
1. Edit the file locally
2. Commit the change to GitHub
3. Vercel auto-deploys within ~60 seconds

---

## NEED HELP?

If you get stuck on any step, the most common issues are:
- DNS not propagating: wait longer, check dnschecker.org
- Build failing on Vercel: check the build logs — usually a missing dependency
- Domain not showing in Vercel: make sure you added BOTH yieldconcierge.com and www.yieldconcierge.com
