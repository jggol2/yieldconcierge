# Rate Refresh Playbook

This playbook captures the process for keeping the Yield Concierge bank database current and trustworthy. It's the result of lessons learned across multiple refresh cycles — especially the realization that aggregator sites consistently lag reality, and that a curated bank list is only as good as our process for keeping it accurate.

## Core principles

**1. Primary sources only.** The bank's own website is the final authority on its current APY, conditions, and product lineup. Aggregator sites (NerdWallet, Bankrate, Motley Fool, Fortune, etc.) consistently lag actual bank rates by weeks and frequently disagree with each other. Use them only as a starting signal that a rate may have changed — never as the basis for an update.

**2. Multi-product audits, not just rate checks.** Every bank refresh should ask "what HYSA-tier products does this bank currently offer?" — not "what's the current rate on the product I already have in the database?" The Axos Summit Savings miss happened because we were checking the latter. Banks frequently launch new products or rename existing ones, and a bank with a single conditional product in our database may have launched a no-conditions sibling we're missing.

**3. Existence and accessibility checks.** A competitive rate is meaningless if the bank isn't accepting applications. Discover Bank taught us this — it's still listed on aggregator best-of pages at competitive rates, but has been closed to new customers since the Capital One merger closed May 18, 2025. Newtek Bank is in a similar state (overwhelming demand pause). Every bank needs an "open to new customers, in the user's geography, today" check before being included or kept.

**4. Curated over comprehensive.** Twenty-five banks is roughly the limit of what we can keep genuinely current. Adding more would mean some entries are always stale. The concierge value proposition depends on every recommendation working when the user clicks through — so smaller, fully maintained beats larger and partially stale.

## Refresh workflow

Execute these steps in order. Each step gates the next.

### Step 1 — Macro context
Check the Federal Reserve's most recent decision and current market expectations.
- What rate did the FOMC announce at their most recent meeting?
- What does the dot plot show for end-of-year?
- What are markets pricing in for the next meeting?

This sets context for whether banks are likely to be moving up, down, or holding. After a Fed cut, expect downward drift across most banks within 1-3 weeks. After a hold with hawkish dot plot, expect rates to creep slightly upward or hold steady.

### Step 2 — Per-bank primary-source verification
For each of the 25 banks in the database, visit the bank's own savings product page. Confirm:
- Current APY (record the exact number and any "as of" date shown on the page)
- Account name (banks occasionally rename products)
- Any conditions for earning the headline rate
- Minimum to open and minimum to earn

The verification spreadsheet template (`hysa_verification_status_YYYY-MM-DD.xlsx`) provides direct URLs to each bank's rate page. Walk through the list, click each link, confirm or correct the rate in the spreadsheet.

Do NOT rely on third-party rate aggregators for this step, even if they're recent. The Bread Savings episode (aggregators showing 4.00% while the bank's own site showed 3.95%) is the cautionary example.

### Step 3 — Multi-product audit per bank
For each bank, ask: does this bank currently offer multiple savings products that should be modeled separately? Patterns to look for:

- **Conditional + unconditional siblings** (Axos: ONE Savings conditional + Summit Savings flat)
- **Tiered + flat** (Barclays: tiered savings; Marcus: flat)
- **Savings + Money Market with different rates** (Ally, EverBank, Synchrony, Capital One all run separate MMA products)
- **Promotional + standard rates for the same product** (E*TRADE, Bask, Wealthfront new-customer boosts)
- **Premier/Premium tiers for existing customers** (HSBC Premier, Bask Premier)

For each missing variant we find, decide whether to add it as a new tier under the existing bank entry, or as a separate bank entry. Tiers are right when it's the same account with different conditions (SoFi); separate entries are right when the products are fundamentally different (Bask Interest vs. Bask Mileage).

### Step 4 — Accessibility check
For each bank, verify it is actively accepting new customer applications. Quick disqualifiers:
- Merger/acquisition resulting in closed applications (Discover → Capital One)
- "Overwhelming demand" waitlist (Newtek)
- Geographic restrictions (Western Alliance Premier requires AZ/NV/CA in some configurations; EverBank branches only in FL/CA/NY)
- New-customer-only products being recommended to existing customers

If a bank fails the accessibility check, remove it from the database entirely or flag the affected tier with `newCustomerOnly: true`.

### Step 5 — Promo expiry sweep
Search the BANKS array `notes` fields for date references. Any promotion with an end date in the past 30 days should be removed. Any promotion ending in the next 30 days should be flagged for upcoming removal. Common patterns:
- Sign-up bonus expirations (Barclays $200, Bask 4.00% Feb-Apr 2026, Western Alliance GIFT code)
- Promo APY periods ending (E*TRADE SAVE26 6-month boost)
- Boost subscription deadlines (CIT CITBoost expired April 13, 2026)

### Step 6 — Tier consistency check
After updating bank `baseApy` values, verify that the corresponding entries in the TIERS array also reflect the new rates. The TIERS array is the source of truth for the recommendation engine — the BANKS `baseApy` is just metadata. Pay particular attention to:
- Tiered banks (CIT, Barclays) where both the headline and standard tier may need updating
- SoFi Plus fee math (`getQualifyingAPY` hardcodes 3.10 as the standard DD remainder rate — update if the standard DD tier moves)
- The verification spreadsheet generator extracts both arrays and presents them side-by-side

### Step 7 — Verification spreadsheet generation
Run the spreadsheet generator (`extract_banks.py` and `verify_spreadsheet.py` patterns) to produce a `hysa_verification_status_YYYY-MM-DD.xlsx` with:
- **Verification Status sheet** (banks color-coded: Verified / Aggregator-confirmed / Needs check / Stale-likely OK)
- **Banks sheet** (every field, side-by-side, scannable)
- **Rate Tiers sheet** (every tier grouped by bank)
- **Top Rates Summary sheet** (leaderboard with best APY per bank)

### Step 8 — User sign-off
Present the spreadsheet for review. The user clicks through any red ("Needs check") rows and either confirms or corrects each rate. User-verified rates take precedence over Claude-verified rates in case of conflict.

### Step 9 — Apply and deploy
With the user's verified spreadsheet returned, apply the corrections to both BANKS and TIERS arrays. Run the consistency check one more time. Update the `Updated [date]` comment at the top of the BANKS array. Push to GitHub for Vercel auto-deploy.

## Failure modes to watch for

- **Aggregator chorus effect** — multiple aggregators all citing the same stale number creates false confidence. Discount aggregator agreement entirely.
- **Cached snippets** — search engines often return cached snippets from months ago even when the URL itself has updated. Always click through to the live page.
- **Bot protection** — some bank sites (Bread, occasionally Capital One) block automated fetches with Incapsula or similar. When that happens, user verification is the fallback.
- **Product rename without rate change** — Axos has done this (account names shift). The TIERS labels should reflect current product names.
- **Promo timing creep** — a promo that "expires March 31" may quietly be extended on the bank's site without aggregator notice, and vice versa.

## When to do a full refresh

- After every Fed meeting (8 per year): banks typically adjust within 2 weeks
- Quarterly minimum, even with no Fed action, because banks adjust independently
- Whenever a user flags a discrepancy (treat as a canary for systemic staleness)
- Before any major marketing push or new traffic source

---

*Last updated: June 19, 2026 — captured after the verification process surfaced Bread (3.95 vs aggregator 4.00), Axos Summit (missing variant), and Discover (closed to new customers) issues.*
