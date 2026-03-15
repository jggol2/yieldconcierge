import { useState, useEffect, useRef, useCallback } from "react";

// ─── BANK DATA (March 7, 2026) ────────────────────────────────────────────────
const BANKS = [
  { id:"sofi",        name:"SoFi",                   account:"Checking & Savings",          baseApy:1.00, branch:false, debit:true,  investing:true,  fee:0, feeWaivable:false, minOpen:0,   slowTransfer:false, notes:"Best all-in-one app. DD unlocks 3.30%. SoFi Plus promo 4.00% for new customers (6 months, limited time). Strong debit + investing. Instant transfers between SoFi accounts." },
  { id:"wealthfront", name:"Wealthfront",             account:"Cash Account",                baseApy:3.30, branch:false, debit:true,  investing:true,  fee:0, feeWaivable:false, minOpen:1,   slowTransfer:false, notes:"Flat 3.30% standard, no conditions. Welcome Offer 3.95% for new accounts: new money only, first 3 months, up to $150k (requires opening new Wealthfront brokerage account). $8M FDIC via partners." },
  { id:"marcus",      name:"Marcus by Goldman Sachs", account:"Online Savings Account",      baseApy:3.65, branch:false, debit:false, investing:false, fee:0, feeWaivable:false, minOpen:0,   slowTransfer:false, notes:"No conditions, no fees, no debit. Flat 3.65% from Goldman Sachs. Trusted brand. Transfers typically 1 business day to linked accounts. Best for pure savers who want simplicity." },
  { id:"betterment",  name:"Betterment",              account:"Cash Reserve",                baseApy:3.25, branch:false, debit:false, investing:true,  fee:0, feeWaivable:false, minOpen:10,  slowTransfer:false, notes:"Flat 3.25% standard. New customer boost: 3.90% for first 3 months (0.65% boost). Best-in-class robo-advisor. No debit card on cash reserve. $10 min to open." },
  { id:"axos",        name:"Axos Bank",               account:"ONE Savings (bundle)",        baseApy:1.00, branch:false, debit:true,  investing:false, fee:0, feeWaivable:false, minOpen:0,   slowTransfer:false, notes:"Highest conditional rate (4.21%) for users meeting DD + balance mins. Requires Axos ONE Checking bundle. 95,000+ fee-free ATMs. No investing. Base rate is only 1% without conditions." },
  { id:"openbank",    name:"Openbank",                account:"High Yield Savings",          baseApy:4.09, branch:false, debit:false, investing:false, fee:0, feeWaivable:false, minOpen:500, slowTransfer:false, notes:"Digital subsidiary of Santander. No conditions for 4.09% — highest unconditional flat rate. $500 min to open. Online/app only. No debit. Transfers typically 1-2 days." },
  { id:"bread",       name:"Bread Savings",           account:"High Yield Savings",          baseApy:4.00, branch:false, debit:false, investing:false, fee:0, feeWaivable:false, minOpen:100, slowTransfer:true,  notes:"Flat 4.00% APY, $100 min to open, no monthly fees. No debit or checking. Online only. Paper statements $5. ACH transfers can take 1-3 business days. Not ideal if you need fast access." },
  { id:"everbank",    name:"EverBank",                account:"Performance Savings",         baseApy:3.90, branch:true,  debit:true,  investing:false, fee:0, feeWaivable:false, minOpen:0,   slowTransfer:false, notes:"No minimum, no fee, flat 3.90%. Branches in FL, CA, and NY only. EverBank checking + debit available. Best for Southeast/coastal users wanting branch + competitive rate." },
  { id:"pnc",         name:"PNC Bank",                account:"Premiere Money Market",       baseApy:0.02, branch:true,  debit:true,  investing:false, fee:0, feeWaivable:true,  minOpen:0,   slowTransfer:false, notes:"Promotional 3.25% ONLY for new clients with address outside PNC branch footprint, $25k+ balance, existing PNC checking. Not available to existing PNC savings holders. Everyone else: ~0.02%." },
  { id:"capital_one", name:"Capital One",             account:"360 Performance Savings",     baseApy:3.30, branch:true,  debit:false, investing:false, fee:0, feeWaivable:false, minOpen:0,   slowTransfer:false, notes:"Flat 3.30%, no conditions, no fees. 200+ branches + Capital One Cafes (mostly East Coast). No debit on savings — transfers only. Fast ACH. Excellent brand trust and mobile app." },
  { id:"ally",        name:"Ally Bank",               account:"Online Savings Account",      baseApy:3.20, branch:false, debit:false, investing:false, fee:0, feeWaivable:false, minOpen:0,   slowTransfer:false, notes:"Flat 3.20%. Savings buckets, round-ups, best-in-class UX and app. No debit on savings. Fast transfers (often 1 business day). Reliable but rate trails top fintechs." },
  { id:"cit",         name:"CIT Bank",                account:"Platinum Savings",            baseApy:0.25, branch:false, debit:false, investing:false, fee:0, feeWaivable:false, minOpen:100, slowTransfer:false, notes:"3.75% for $5,000+ balances. Only 0.25% below that threshold. No debit. $100 min to open. Good for disciplined savers keeping higher balances." },
  { id:"hsbc",        name:"HSBC",                    account:"Premier Relationship Savings", baseApy:0.05, branch:true, debit:false, investing:false, fee:0, feeWaivable:false, minOpen:0,   slowTransfer:false, notes:"Standard rate 0.05% (near zero). Relationship rate 3.20% requires HSBC Premier checking + monthly activity: $500 debit spend OR $500 credit payments OR $5,000 DD. Complex conditions. Select major city branches." },
  { id:"truist",      name:"Truist",                  account:"One Savings",                 baseApy:0.01, branch:true,  debit:true,  investing:false, fee:5, feeWaivable:true,  minOpen:0,   slowTransfer:false, notes:"Not a HYSA — 0.01% APY. Only for users needing full-service traditional banking in SE/Mid-Atlantic. Large branch network." },
  { id:"amex",        name:"American Express",        account:"High Yield Savings",          baseApy:3.30, branch:false, debit:false, investing:false, fee:0, feeWaivable:false, minOpen:0,   slowTransfer:false, notes:"Flat 3.30%, no minimums, no debit. Transfers 1-3 days. Great trust brand; seamless for existing Amex cardholders. No checking account needed." },
  { id:"chase",       name:"Chase",                   account:"Savings Account",             baseApy:0.01, branch:true,  debit:true,  investing:true,  fee:5, feeWaivable:true,  minOpen:0,   slowTransfer:false, notes:"Not a HYSA — 0.01% APY. Largest US bank. Only relevant for users deeply in Chase ecosystem. Strong investing via J.P. Morgan. Fast transfers within Chase." },
  { id:"barclays",    name:"Barclays",                account:"Tiered Savings Account",      baseApy:3.70, branch:false, debit:false, investing:false, fee:0, feeWaivable:false, minOpen:0,   slowTransfer:true,  notes:"3.70% flat, 3.85% at $250k+. $200 sign-up bonus for $30k+ held 120 days. No debit. ACH transfers typically 2-3 business days — not suitable for urgent access needs." },
  { id:"etrade",      name:"E*TRADE",                 account:"Premium Savings",             baseApy:3.35, branch:false, debit:false, investing:true,  fee:0, feeWaivable:false, minOpen:0,   slowTransfer:false, notes:"Backed by Morgan Stanley. Standard 3.35%. Promo 3.75% for 6 months on new money (code SAVE26) + cash bonus up to $2,000. Seamless brokerage integration." },
  { id:"popular",     name:"Popular Direct",          account:"Exclusive Savings",           baseApy:3.90, branch:false, debit:false, investing:false, fee:0, feeWaivable:false, minOpen:100, slowTransfer:true,  notes:"Online division of Popular Bank. Flat 3.90% APY. $100 min. $25 early closure fee within 180 days. ACH can take 2-3 days. Not ideal for urgent withdrawal needs." },
  { id:"bask",        name:"Bask Bank",               account:"Interest Savings",            baseApy:3.75, branch:false, debit:false, investing:false, fee:0, feeWaivable:false, minOpen:0,   slowTransfer:false, notes:"Division of Texas Capital Bank. Flat 3.75%. Promo 4.00% for new accounts with $10k+ avg monthly balance through May 31, 2026 (open by Mar 31, 2026). Also offers American Airlines miles variant." },
];

// ─── TIERS (newCustomerOnly flag added) ───────────────────────────────────────
const TIERS = [
  { bank:"sofi",        label:"SoFi Plus Promo (new customers only)",              apy:4.00, minBal:0,      reqDD:true,  minDD:0,    newMoney:false, newCustomerOnly:true,  sort:1 },
  { bank:"sofi",        label:"Standard with Direct Deposit",                      apy:3.30, minBal:0,      reqDD:true,  minDD:0,    newMoney:false, newCustomerOnly:false, sort:2 },
  { bank:"sofi",        label:"Base Rate (no DD)",                                 apy:1.00, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:3 },
  { bank:"wealthfront", label:"Welcome Offer (new money + new brokerage, 3 mo)",  apy:3.95, minBal:0,      reqDD:false, minDD:0,    newMoney:true,  newCustomerOnly:true,  sort:1 },
  { bank:"wealthfront", label:"Standard Rate (no conditions)",                     apy:3.30, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:2 },
  { bank:"marcus",      label:"Standard Rate (no conditions)",                     apy:3.65, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:1 },
  { bank:"betterment",  label:"New Customer Boost — first 3 months",              apy:3.90, minBal:10,     reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:true,  sort:1 },
  { bank:"betterment",  label:"Standard Rate (no conditions)",                     apy:3.25, minBal:10,     reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:2 },
  { bank:"axos",        label:"4.21% — Option 1 ($1,500/mo DD + $1,500 bal)",    apy:4.21, minBal:1500,   reqDD:true,  minDD:1500, newMoney:false, newCustomerOnly:false, sort:1 },
  { bank:"axos",        label:"4.21% — Option 2 ($5,000/mo DD + $5,000 bal)",    apy:4.21, minBal:5000,   reqDD:true,  minDD:5000, newMoney:false, newCustomerOnly:false, sort:2 },
  { bank:"axos",        label:"Base Rate (no requirements met)",                   apy:1.00, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:3 },
  { bank:"openbank",    label:"Standard Rate ($500 min to open)",                  apy:4.09, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:1 },
  { bank:"bread",       label:"Standard Rate ($100 min to open)",                  apy:4.00, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:1 },
  { bank:"everbank",    label:"Standard Rate (no conditions)",                     apy:3.90, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:1 },
  { bank:"pnc",         label:"Premiere Rate (new clients, outside footprint, $25k+)", apy:3.25, minBal:25000, reqDD:false, minDD:0, newMoney:true,  newCustomerOnly:true,  sort:1 },
  { bank:"pnc",         label:"Standard Rate (all other customers)",               apy:0.02, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:2 },
  { bank:"capital_one", label:"Standard Rate (no conditions)",                     apy:3.30, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:1 },
  { bank:"ally",        label:"Standard Rate (no conditions)",                     apy:3.20, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:1 },
  { bank:"cit",         label:"Platinum Rate ($5,000+ balance)",                   apy:3.75, minBal:5000,   reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:1 },
  { bank:"cit",         label:"Base Rate (under $5,000)",                          apy:0.25, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:2 },
  { bank:"hsbc",        label:"Relationship APY (Premier checking + activity)",    apy:3.20, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:1 },
  { bank:"hsbc",        label:"Standard APY (no conditions met)",                  apy:0.05, minBal:1,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:2 },
  { bank:"truist",      label:"Standard Rate (all balances)",                      apy:0.01, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:1 },
  { bank:"amex",        label:"Standard Rate (no conditions)",                     apy:3.30, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:1 },
  { bank:"chase",       label:"Standard Rate (all balances)",                      apy:0.01, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:1 },
  { bank:"barclays",    label:"Top Tier ($250,000+ balance)",                      apy:3.85, minBal:250000, reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:1 },
  { bank:"barclays",    label:"Standard Rate (under $250,000)",                    apy:3.70, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:2 },
  { bank:"etrade",      label:"Promo 3.75% — New Money, 6 Months (code SAVE26)", apy:3.75, minBal:0,      reqDD:false, minDD:0,    newMoney:true,  newCustomerOnly:false, sort:1 },
  { bank:"etrade",      label:"Standard Rate (no conditions)",                     apy:3.35, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:2 },
  { bank:"popular",     label:"Standard Rate ($100 min opening deposit)",          apy:3.90, minBal:100,    reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:1 },
  { bank:"bask",        label:"Promo 4.00% (new accounts, $10k+ bal, ≤May 2026)", apy:4.00, minBal:10000,  reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:true,  sort:1 },
  { bank:"bask",        label:"Standard Rate (no conditions)",                     apy:3.75, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:2 },
];

// ─── QUESTIONS (11 total) ─────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: "balance",
    question: "How much are you planning to maintain in your account?",
    subtext: "This determines which rate tiers you qualify for.",
    type: "single",
    options: [
      { value:"under_500",  label:"Under $500",        est:250 },
      { value:"500_1500",   label:"$500 – $1,500",     est:1000 },
      { value:"1500_5000",  label:"$1,500 – $5,000",   est:3000 },
      { value:"5k_10k",     label:"$5,000 – $10,000",  est:7500 },
      { value:"10k_25k",    label:"$10,000 – $25,000", est:17500 },
      { value:"25k_plus",   label:"$25,000+",           est:50000 },
    ]
  },
  {
    id: "purpose",
    question: "What is this account primarily for?",
    subtext: "Shapes how we weigh liquidity, stability, and rate maximization.",
    type: "single",
    options: [
      { value:"emergency", label:"Emergency fund — I may need it on short notice" },
      { value:"goal",      label:"Specific goal — house, car, vacation, etc." },
      { value:"general",   label:"General savings — just growing my money" },
      { value:"business",  label:"Business or side income" },
    ]
  },
  {
    id: "direct_deposit",
    question: "Can you set up direct deposit into this account?",
    subtext: "Some of the highest rates require paycheck or income deposits.",
    type: "single",
    options: [
      { value:"yes_large", label:"Yes — $1,500+ per month",     ddAmt:1500 },
      { value:"yes_any",   label:"Yes — some amount each month", ddAmt:1 },
      { value:"no",        label:"No — I'll transfer manually",  ddAmt:0 },
    ]
  },
  {
    id: "existing_customer",
    question: "Are you already a customer at any of these banks?",
    subtext: "New-customer promotions won't apply to you. Select all that apply.",
    type: "multi",
    options: [
      { value:"sofi",        label:"SoFi" },
      { value:"wealthfront", label:"Wealthfront" },
      { value:"betterment",  label:"Betterment" },
      { value:"etrade",      label:"E*TRADE" },
      { value:"bask",        label:"Bask Bank" },
      { value:"pnc",         label:"PNC Bank" },
      { value:"none",        label:"None of these", exclusive:true },
    ]
  },
  {
    id: "access_speed",
    question: "How quickly might you need to withdraw this money?",
    subtext: "Some banks take 2–3 business days to transfer funds out.",
    type: "single",
    options: [
      { value:"urgent",   label:"Same day or next day — I may need it fast" },
      { value:"few_days", label:"1–3 business days is fine" },
      { value:"flexible", label:"Flexible — this money sits for weeks at a time" },
    ]
  },
  {
    id: "conditions_comfort",
    question: "Are you willing to meet conditions for a better rate?",
    subtext: "Things like specific deposit amounts, minimum balances, or monthly activity.",
    type: "single",
    options: [
      { value:"no",   label:"No — give me the best no-strings rate" },
      { value:"some", label:"Some — I'll do a couple things but keep it simple" },
      { value:"yes",  label:"Yes — I'll jump through hoops if the rate is worth it" },
    ]
  },
  {
    id: "branch",
    question: "Do you need access to a physical branch?",
    subtext: "Most top-rate accounts are online-only.",
    type: "single",
    options: [
      { value:"required", label:"Yes — branch access is essential" },
      { value:"nice",     label:"Nice to have, but not required" },
      { value:"no",       label:"No — fully online is fine" },
    ]
  },
  {
    id: "debit",
    question: "Do you want a debit card on this account?",
    subtext: "Useful for ATM withdrawals or spending directly from savings.",
    type: "single",
    options: [
      { value:"yes", label:"Yes — I want a debit or ATM card" },
      { value:"no",  label:"No — bank transfers are enough" },
    ]
  },
  {
    id: "investing",
    question: "Do you want investing alongside your savings?",
    subtext: "Some platforms offer brokerage or robo-advisor accounts in the same app.",
    type: "single",
    options: [
      { value:"yes", label:"Yes — I want investing in the same place" },
      { value:"no",  label:"No — savings only for now" },
    ]
  },
  {
    id: "fees",
    question: "How do you feel about monthly maintenance fees?",
    subtext: "Some banks charge fees that can be waived by meeting conditions.",
    type: "single",
    options: [
      { value:"zero",     label:"Zero tolerance — no fees under any circumstances" },
      { value:"waivable", label:"Fine if they're waivable by meeting requirements" },
    ]
  },
];

// ─── APY QUALIFIER ────────────────────────────────────────────────────────────
function getQualifyingAPY(bank, answers) {
  const balEst = QUESTIONS[0].options.find(o => o.value === answers.balance)?.est ?? 0;
  const ddAmt  = QUESTIONS[2].options.find(o => o.value === answers.direct_deposit)?.ddAmt ?? 0;
  const hasDD  = ddAmt > 0;
  const existingAt = Array.isArray(answers.existing_customer) ? answers.existing_customer : [];
  const isExisting = existingAt.includes(bank.id);
  // If user is not an existing customer at this bank, their funds are new money by definition
  const isNew  = !isExisting;
  const condComfort = answers.conditions_comfort || "some";
  const skipActiveConds = condComfort === "no";

  // Hard exclusions
  if (answers.branch === "required" && !bank.branch)           return null;
  if (answers.debit === "yes" && !bank.debit)                  return null;
  if (answers.investing === "yes" && !bank.investing)          return null;
  if (answers.fees === "zero" && bank.fee > 0 && !bank.feeWaivable) return null;
  if (balEst < bank.minOpen)                                   return null;
  // Slow-transfer exclusion for urgent access needs
  if (answers.access_speed === "urgent" && bank.slowTransfer)  return null;

  const bankTiers = TIERS
    .filter(t => t.bank === bank.id)
    .sort((a, b) => a.sort - b.sort);

  for (const tier of bankTiers) {
    if (balEst < tier.minBal)                                              continue;
    if (tier.newCustomerOnly && isExisting)                                continue; // no promo for existing customers
    if (tier.newMoney && !isNew)                                           continue;
    if (tier.reqDD && (skipActiveConds || !hasDD))                         continue; // skip DD tiers if no conditions
    if (tier.reqDD && tier.minDD > 0 && ddAmt < tier.minDD)               continue;
    return { apy: tier.apy, tierLabel: tier.label };
  }

  return { apy: bank.baseApy, tierLabel: "Base Rate" };
}

// ─── FETCH WITH TIMEOUT ──────────────────────────────────────────────────────
async function fetchWithTimeout(url, options, timeoutMs = 90000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(url, { ...options, signal: controller.signal });
    return resp;
  } catch (err) {
    if (err.name === "AbortError") throw new Error("Request timed out after 90 seconds. Please try again.");
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

// ─── AGENTIC WEB SEARCH ───────────────────────────────────────────────────────
// web_search_20250305 is server-side: Anthropic executes all searches internally
// within a single API call and returns end_turn. We loop only to handle the rare
// case where the model emits tool_use with stop_reason="tool_use" (client-side
// tool interop mode), providing real tool_result responses each time.
async function runAgenticSearch(prompt, onSearch) {
  const tools = [{ type: "web_search_20250305", name: "web_search" }];
  let messages = [{ role: "user", content: prompt }];

  for (let i = 0; i < 6; i++) {
    const resp = await fetchWithTimeout(
      "/api/messages",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 6000,
          tools,
          messages,
        }),
      }
    );

    if (!resp.ok) {
      const errBody = await resp.text().catch(() => "");
      throw new Error(`API error ${resp.status}: ${errBody.slice(0, 200)}`);
    }

    const data = await resp.json();
    const content = data.content || [];

    // Surface search queries to the UI
    content
      .filter(b => b.type === "tool_use" && b.name === "web_search")
      .forEach(b => b.input?.query && onSearch(b.input.query));

    // Also capture server-side search result queries from web_search_result blocks
    content
      .filter(b => b.type === "web_search_tool_result" || (b.type === "tool_result" && b.name === "web_search"))
      .forEach(b => {
        // queries already surfaced above via tool_use blocks
      });

    const textContent = content.filter(b => b.type === "text").map(b => b.text).join("\n");

    if (data.stop_reason === "end_turn") {
      return textContent;
    }

    if (data.stop_reason === "tool_use") {
      // Push assistant turn
      messages.push({ role: "assistant", content });

      // Find any tool_use blocks that don't yet have a tool_result in this content array
      const pendingToolUse = content.filter(
        b => b.type === "tool_use" &&
             !content.find(x => x.type === "tool_result" && x.tool_use_id === b.id)
      );

      if (pendingToolUse.length > 0) {
        // Provide tool_result for each pending tool_use
        messages.push({
          role: "user",
          content: pendingToolUse.map(b => ({
            type: "tool_result",
            tool_use_id: b.id,
            content: "Search completed. Please continue with your analysis.",
          })),
        });
      } else {
        // All tool_use blocks already have results — just continue
        // (server-side tool already handled everything)
        messages.push({ role: "user", content: "Please continue with your analysis and provide the JSON response." });
      }
      continue;
    }

    // max_tokens or other stop reason — return whatever text we have
    if (textContent) return textContent;
    throw new Error(`Unexpected stop reason: ${data.stop_reason}`);
  }

  throw new Error("Search loop exceeded maximum iterations.");
}

// ─── CHAT HELPERS ─────────────────────────────────────────────────────────────
function buildSystemPrompt(answers, result) {
  const getLabel = (qId, val) => {
    const q = QUESTIONS.find(q => q.id === qId);
    if (!q) return val;
    if (Array.isArray(val)) return val.join(", ");
    return q.options.find(o => o.value === val)?.label || val;
  };
  const profileLines = QUESTIONS.map(q => `  ${q.question}: ${getLabel(q.id, answers[q.id] || "—")}`).join("\n");
  const rankedLines  = (result.allRanked || []).map(b => `  - ${b.name}: ${b.qualifyingApy.toFixed(2)}% APY (${b.tierLabel})`).join("\n");
  const verifiedLines = (result.verified_rates || []).map(v => `  - ${v.bank}: ${v.live_apy}% confirmed via ${v.source} (${v.source_date})`).join("\n");

  return `You are a sharp, concise HYSA (High-Yield Savings Account) concierge advisor. The user has completed a full profile assessment and received their recommendation. You have complete context on their situation.

RECOMMENDATION GIVEN:
  Bank: ${result.bank} — ${result.account}
  APY: ${result.apy}%
  Tier: ${result.tier_label}
  Summary: ${result.summary}
  Runner-up: ${result.runner_up} at ${result.runner_up_apy}%

USER PROFILE:
${profileLines}

ALL QUALIFYING BANKS FOR THIS USER (pre-calculated):
${rankedLines}

LIVE-VERIFIED RATES (from web search on ${new Date().toLocaleDateString()}):
${verifiedLines}

INSTRUCTIONS:
- Be direct, specific, and conversational — like a trusted financial advisor, not a chatbot
- Keep responses to 2–4 sentences unless a detailed comparison is explicitly requested
- Always tie your answer back to their specific profile (their balance, DD setup, purpose, etc.)
- If they describe a constraint that changes the recommendation, update it immediately
- If they ask about a bank not on the qualifying list, explain concisely why it didn't qualify for them
- If a rate may have changed, note that they should verify directly
- Never be generic. Every answer should feel like it's for this specific person.`;
}

function generateChips(result, answers) {
  const chips = [];
  if (result.runner_up) chips.push(`Compare ${result.runner_up} vs. ${result.bank} in detail`);
  if (answers.direct_deposit !== "no") chips.push("What if I lose or cancel direct deposit?");
  // Show promo chip if user is a new customer at the recommended bank (promo may apply)
  const existingAt = Array.isArray(answers.existing_customer) ? answers.existing_customer : [];
  const isNewAtRec = result.bank && !existingAt.some(id => result.bank.toLowerCase().includes(id));
  if (isNewAtRec) chips.push("What happens to my rate when the promo ends?");
  if (answers.purpose === "emergency") chips.push("How fast can I realistically get my money?");
  if (answers.purpose === "goal") chips.push("Will this rate stay competitive for the next year?");
  const balEst = QUESTIONS[0].options.find(o => o.value === answers.balance)?.est ?? 0;
  if (balEst >= 5000) chips.push("Am I maximizing returns for my balance size?");
  chips.push("Walk me through exactly how to open this account");
  chips.push("Any hidden fees or catches I should know about?");
  chips.push("What's the FDIC coverage situation?");
  if (answers.investing === "no") chips.push("Should I also open a brokerage account?");
  if (answers.conditions_comfort === "no") chips.push("What's the best truly no-strings rate right now?");
  return chips.slice(0, 6);
}

// ─── LOADING PHASES ───────────────────────────────────────────────────────────
const PHASES = [
  "Calculating your qualifying rates…",
  "Scanning official bank websites for current APYs…",
  "Verifying promotional conditions and expiry dates…",
  "Analyzing your profile against live data…",
  "Drafting your personalized recommendation…",
];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

.root{
  min-height:100vh;
  background:#09090f;
  font-family:'DM Sans',sans-serif;
  color:#ddd8ce;
  display:flex;flex-direction:column;align-items:center;
  padding:0 16px 120px;
  position:relative;overflow-x:hidden;
}

/* background */
.bg-lines{
  position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:
    linear-gradient(rgba(200,169,110,.03) 1px,transparent 1px),
    linear-gradient(90deg,rgba(200,169,110,.03) 1px,transparent 1px);
  background-size:56px 56px;
}
.bg-glow{
  position:fixed;top:-400px;left:50%;transform:translateX(-50%);
  width:1000px;height:700px;pointer-events:none;z-index:0;
  background:radial-gradient(ellipse,rgba(200,169,110,.06) 0%,transparent 60%);
}

.shell{position:relative;z-index:1;width:100%;max-width:660px;}

/* ── INTRO ── */
.intro{text-align:center;padding:72px 0 44px;animation:up .7s cubic-bezier(.22,1,.36,1) both;}
.intro-tag{
  display:inline-flex;align-items:center;gap:8px;
  font-family:'DM Mono',monospace;font-size:10px;letter-spacing:2px;
  color:#c8a96e;border:1px solid rgba(200,169,110,.2);
  padding:6px 14px;margin-bottom:28px;
}
.intro-tag-dot{width:5px;height:5px;border-radius:50%;background:#c8a96e;animation:pulse 2s ease infinite;}
.intro-h{
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(36px,6vw,56px);font-weight:500;line-height:1.08;
  color:#f0ece2;margin-bottom:18px;letter-spacing:-.5px;
}
.intro-h em{font-style:italic;color:#c8a96e;}
.intro-p{font-size:15px;color:#9a9690;line-height:1.7;max-width:480px;margin:0 auto 36px;}
.trust-row{
  display:flex;justify-content:center;gap:24px;flex-wrap:wrap;
  margin-bottom:36px;
}
.trust-item{font-size:11px;color:#706c66;letter-spacing:.5px;display:flex;align-items:center;gap:6px;}
.trust-pip{width:3px;height:3px;border-radius:50%;background:#c8a96e55;}
.cta{
  display:inline-flex;align-items:center;gap:12px;
  background:#c8a96e;color:#09090f;
  font-family:'DM Sans',sans-serif;font-weight:600;font-size:15px;
  padding:16px 40px;border:none;cursor:pointer;
  transition:all .2s;letter-spacing:.3px;
}
.cta:hover{background:#d4b87a;transform:translateY(-2px);box-shadow:0 12px 32px rgba(200,169,110,.18);}

/* ── PROGRESS ── */
.prog-wrap{padding:48px 0 44px;}
.prog-bar{height:1px;background:#1e2535;position:relative;}
.prog-fill{position:absolute;top:0;left:0;height:100%;background:linear-gradient(90deg,#c8a96e,#d4c090);transition:width .5s cubic-bezier(.22,1,.36,1);}
.prog-nums{display:flex;justify-content:space-between;margin-top:10px;}
.prog-n{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:1px;color:#3e4455;}
.prog-n.active{color:#c8a96e;}

/* ── QUESTION ── */
.q-wrap{animation:up .4s cubic-bezier(.22,1,.36,1) both;}
.q-num{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:2px;color:#c8a96e;margin-bottom:10px;}
.q-title{
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(22px,4vw,32px);font-weight:500;line-height:1.2;
  color:#f0ece2;margin-bottom:8px;
}
.q-sub{font-size:13px;color:#8a8680;margin-bottom:28px;line-height:1.55;}

.opts{display:flex;flex-direction:column;gap:8px;margin-bottom:28px;}
.opt{
  display:flex;align-items:center;gap:14px;
  padding:14px 18px;
  border:1px solid #1e2535;background:#0d1020;
  cursor:pointer;transition:all .15s;
  color:#c0bcb4;font-size:14px;
}
.opt:hover{border-color:rgba(200,169,110,.3);background:#101524;color:#ddd8ce;}
.opt.active{border-color:#c8a96e;background:#131828;color:#f0ece2;}
.opt.multi-exclusive{border-style:dashed;}
.radio{width:16px;height:16px;border-radius:50%;border:1.5px solid #2e3548;flex-shrink:0;transition:all .15s;display:flex;align-items:center;justify-content:center;}
.opt.active .radio{border-color:#c8a96e;background:#c8a96e;}
.radio-dot{width:6px;height:6px;border-radius:50%;background:#09090f;opacity:0;}
.opt.active .radio-dot{opacity:1;}
.checkbox{width:16px;height:16px;border:1.5px solid #2e3548;flex-shrink:0;transition:all .15s;display:flex;align-items:center;justify-content:center;font-size:10px;}
.opt.active .checkbox{border-color:#c8a96e;background:#c8a96e;color:#09090f;}

.multi-hint{font-size:11px;color:#6a7080;margin-bottom:10px;font-family:'DM Mono',monospace;letter-spacing:.5px;}

.nav{display:flex;gap:10px;}
.btn-next{
  flex:1;padding:14px;
  background:#c8a96e;color:#09090f;
  font-family:'DM Sans',sans-serif;font-weight:600;font-size:14px;
  border:none;cursor:pointer;transition:all .18s;
}
.btn-next:hover:not(:disabled){background:#d4b87a;}
.btn-next:disabled{background:#1a2030;color:#3a404e;cursor:not-allowed;}
.btn-back{
  padding:14px 18px;background:transparent;
  border:1px solid #1e2535;color:#706c66;font-family:'DM Sans',sans-serif;font-size:14px;
  cursor:pointer;transition:all .18s;
}
.btn-back:hover{border-color:#3a4255;color:#a8a49c;}

/* ── LOADING ── */
.loading{padding:88px 0;text-align:center;animation:up .5s cubic-bezier(.22,1,.36,1) both;}
.spin-outer{width:52px;height:52px;margin:0 auto 32px;position:relative;}
.spin-ring{
  width:100%;height:100%;border-radius:50%;
  border:1px solid #1e2535;border-top-color:#c8a96e;
  animation:spin .9s linear infinite;
}
.spin-inner{
  position:absolute;top:6px;left:6px;right:6px;bottom:6px;border-radius:50%;
  border:1px solid #0d1020;border-bottom-color:rgba(200,169,110,.35);
  animation:spin 1.4s linear infinite reverse;
}
.load-phase{font-family:'Cormorant Garamond',serif;font-size:22px;color:#f0ece2;margin-bottom:6px;min-height:34px;}
.load-eta{font-family:'DM Mono',monospace;font-size:10px;color:#5a6070;letter-spacing:1px;margin-bottom:32px;}
.search-log{max-width:440px;margin:0 auto;text-align:left;}
.search-log-hdr{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:2px;color:#4a5265;margin-bottom:10px;text-transform:uppercase;}
.search-item{
  display:flex;gap:10px;font-family:'DM Mono',monospace;font-size:11px;color:#6a7280;
  padding:7px 0;border-bottom:1px solid #141820;line-height:1.4;
  animation:up .3s ease both;
}
.search-tick{color:#c8a96e88;flex-shrink:0;}

/* ── RESULT ── */
.result{animation:up .6s cubic-bezier(.22,1,.36,1) both;padding-top:48px;}

.section-hdr{
  display:flex;align-items:center;gap:14px;
  font-family:'DM Mono',monospace;font-size:9px;letter-spacing:2.5px;text-transform:uppercase;
  color:#c8a96e;margin-bottom:16px;
}
.section-hdr::after{content:'';flex:1;height:1px;background:#1e2535;}

/* verify panel */
.verify-grid{display:flex;flex-direction:column;gap:6px;margin-bottom:32px;}
.v-row{
  display:flex;align-items:flex-start;gap:12px;
  padding:11px 14px;background:#0c0f1c;border:1px solid #1a2030;
}
.v-name{font-size:13px;color:#a8a49c;font-weight:500;flex:1;min-width:120px;}
.v-meta{flex:2;}
.v-cond{font-size:11px;color:#7a7670;line-height:1.5;margin-top:2px;}
.v-expiry{font-size:11px;color:#a07840;margin-top:2px;}
.v-apy-col{text-align:right;min-width:76px;}
.v-apy{font-family:'DM Mono',monospace;font-size:15px;font-weight:500;}
.v-src{font-family:'DM Mono',monospace;font-size:9px;color:#5a6070;margin-top:2px;}
.v-badge{
  font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.5px;
  padding:3px 7px;flex-shrink:0;align-self:flex-start;
}
.v-conf{color:#4a9e6a;background:rgba(74,158,106,.12);}
.v-up  {color:#c8a96e;background:rgba(200,169,110,.12);}
.v-dn  {color:#c07070;background:rgba(192,112,112,.12);}
.v-same{color:#7a9ab8;background:rgba(122,154,184,.12);}
.v-green{color:#4a9e6a;}
.v-gold {color:#c8a96e;}
.v-red  {color:#c07070;}
.v-blue {color:#7a9ab8;}

/* rec card */
.rec-card{
  background:#0d1020;border:1px solid rgba(200,169,110,.2);
  padding:32px 30px 28px;position:relative;overflow:hidden;
  margin-bottom:10px;
}
.rec-card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,#c8a96e,#d4c090,#c8a96e,transparent);
}
.rec-top-row{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:4px;}
.rec-bankname{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#c8a96e;}
.rec-conf{
  font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.5px;
  padding:3px 8px;flex-shrink:0;
}
.conf-ok    {background:rgba(74,158,106,.12); color:#4a9e6a;}
.conf-approx{background:rgba(122,154,184,.12);color:#7a9ab8;}
.conf-warn  {background:rgba(192,112,112,.12);color:#c07070;}
.rec-acct{font-size:12px;color:#7a7670;margin-bottom:20px;}
.apy-row{display:flex;align-items:baseline;gap:6px;margin-bottom:4px;}
.apy-n{font-family:'Cormorant Garamond',serif;font-size:64px;font-weight:500;color:#f0ece2;line-height:1;}
.apy-pct{font-size:22px;color:#c8a96e;font-weight:600;font-family:'DM Sans',sans-serif;}
.tier-lbl{font-family:'DM Mono',monospace;font-size:10px;color:#5a6070;margin-bottom:6px;}
.v-note-inline{font-size:12px;color:#8a8680;line-height:1.55;margin-bottom:20px;}
.rec-hl{
  font-family:'Cormorant Garamond',serif;font-size:19px;font-style:italic;
  color:#ddd8d0;line-height:1.4;margin-bottom:14px;
}
.rec-summary{font-size:14px;color:#a8a49c;line-height:1.75;margin-bottom:24px;}
.perks{display:flex;flex-direction:column;gap:9px;margin-bottom:20px;}
.perk{display:flex;gap:10px;font-size:13.5px;color:#b0aca4;line-height:1.5;}
.perk-ico{color:#c8a96e;flex-shrink:0;font-size:10px;margin-top:3px;}
.watchout{
  background:#080a15;border-left:2px solid rgba(200,169,110,.25);
  padding:12px 16px;font-size:13px;color:#8a8680;line-height:1.6;
}
.watchout b{color:#c8a96e;}

/* runner-up / others */
.sub-card{background:#090c18;border:1px solid #1a2030;padding:18px 22px;margin-bottom:8px;}
.sub-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;}
.sub-lbl{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#4a5265;margin-bottom:4px;}
.sub-name{font-size:16px;color:#c8c4bc;font-weight:500;}
.sub-apy{font-family:'DM Mono',monospace;font-size:18px;color:#9a9690;}.sub-apy span{font-size:11px;color:#6a6660;}
.sub-reason{font-size:13px;color:#8a8680;line-height:1.55;}

/* all rates */
.rates-toggle{
  width:100%;padding:13px 18px;background:transparent;
  border:1px solid #1a2030;color:#7a7670;
  font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.5px;
  cursor:pointer;text-align:left;display:flex;justify-content:space-between;
  align-items:center;transition:all .18s;margin-bottom:8px;
}
.rates-toggle:hover{border-color:#3a4255;color:#a8a49c;}
.rates-tbl{width:100%;border-collapse:collapse;margin-bottom:12px;}
.rates-tbl th{
  text-align:left;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;
  color:#4a5265;padding:9px 12px;border-bottom:1px solid #1a2030;
}
.rates-tbl td{padding:10px 12px;font-size:12.5px;color:#8a8680;border-bottom:1px solid #0e1220;}
.rates-tbl tr:first-child td{color:#c8a96e;}
.td-apy{font-family:'DM Mono',monospace;font-size:14px;font-weight:500;}

/* ── CHAT ── */
.chat-section{margin-top:40px;}
.chat-intro{
  font-family:'Cormorant Garamond',serif;font-style:italic;
  font-size:19px;color:#9a9690;line-height:1.5;margin-bottom:24px;
  padding-bottom:24px;border-bottom:1px solid #1a2030;
}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px;}
.chip{
  font-size:12px;color:#8a8680;border:1px solid #1e2535;background:#0c0f1c;
  padding:8px 14px;cursor:pointer;transition:all .15s;
  font-family:'DM Sans',sans-serif;line-height:1.3;
}
.chip:hover{border-color:rgba(200,169,110,.35);color:#c0bcb4;background:#0f1220;}

.chat-thread{
  display:flex;flex-direction:column;gap:16px;margin-bottom:20px;
  max-height:500px;overflow-y:auto;padding-right:4px;
}
.chat-thread::-webkit-scrollbar{width:3px;}
.chat-thread::-webkit-scrollbar-track{background:#09090f;}
.chat-thread::-webkit-scrollbar-thumb{background:#2a3040;}
.msg-user{
  align-self:flex-end;max-width:80%;
  background:#131828;border:1px solid rgba(200,169,110,.22);
  padding:12px 16px;font-size:14px;color:#ddd8ce;line-height:1.55;
}
.msg-assistant{
  align-self:flex-start;max-width:88%;
  background:#0c0f1c;border:1px solid #1a2030;
  padding:14px 18px;font-size:14px;color:#b0aca4;line-height:1.7;
}
.msg-assistant p{margin-bottom:8px;}
.msg-assistant p:last-child{margin-bottom:0;}
.msg-thinking{
  align-self:flex-start;padding:12px 18px;
  background:#0c0f1c;border:1px solid #1a2030;
  font-family:'DM Mono',monospace;font-size:11px;color:#6a7080;
}
.dots span{animation:blink 1.4s ease infinite;}
.dots span:nth-child(2){animation-delay:.2s;}
.dots span:nth-child(3){animation-delay:.4s;}

.chat-input-row{display:flex;gap:8px;}
.chat-input{
  flex:1;background:#0c0f1c;border:1px solid #1e2535;color:#ddd8ce;
  font-family:'DM Sans',sans-serif;font-size:14px;
  padding:13px 16px;outline:none;resize:none;
  transition:border-color .15s;min-height:48px;max-height:120px;
}
.chat-input:focus{border-color:rgba(200,169,110,.4);}
.chat-input::placeholder{color:#4a5265;}
.chat-send{
  background:#c8a96e;color:#09090f;border:none;
  padding:13px 20px;cursor:pointer;transition:all .18s;
  font-family:'DM Sans',sans-serif;font-weight:600;font-size:13px;
  flex-shrink:0;align-self:flex-start;
}
.chat-send:hover:not(:disabled){background:#d4b87a;}
.chat-send:disabled{background:#1a2030;color:#3a404e;cursor:not-allowed;}

/* restart / disclaimer */
.restart{
  width:100%;padding:13px;background:transparent;
  border:1px solid #1a2030;color:#6a6660;
  font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.5px;
  cursor:pointer;transition:all .18s;margin-top:8px;
}
.restart:hover{border-color:#3a4255;color:#a8a49c;}
.disc{
  font-family:'DM Mono',monospace;font-size:10px;color:#4a5265;letter-spacing:.3px;
  text-align:center;line-height:1.8;margin-top:32px;padding-top:24px;
  border-top:1px solid #141820;
}

/* err */
.err{background:#0e0808;border:1px solid #4a2020;padding:28px;text-align:center;margin:40px 0;}
.err-msg{color:#e07070;font-size:14px;margin-bottom:16px;}

@keyframes up{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
@keyframes blink{0%,100%{opacity:.2;}50%{opacity:1;}}
`;

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function HYSAQuiz() {
  const [step, setStep]             = useState(0);
  const [answers, setAnswers]       = useState({});
  const [selected, setSelected]     = useState(null); // string or array for multi
  const [result, setResult]         = useState(null);
  const [loading, setLoading]       = useState(false);
  const [phase, setPhase]           = useState(0);
  const [searches, setSearches]     = useState([]);
  const [error, setError]           = useState(null);
  const [showAll, setShowAll]       = useState(false);
  const [animKey, setAnimKey]       = useState(0);
  const [chatMsgs, setChatMsgs]     = useState([]);
  const [chatInput, setChatInput]   = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [usedChips, setUsedChips]   = useState(new Set());
  const resultRef  = useRef(null);
  const chatEndRef = useRef(null);
  const phaseRef   = useRef(null);
  const inputRef   = useRef(null);

  const totalQ  = QUESTIONS.length;
  const currentQ = step >= 1 && step <= totalQ ? QUESTIONS[step - 1] : null;
  const isMulti  = currentQ?.type === "multi";

  // Restore selection on step change
  useEffect(() => {
    setAnimKey(k => k + 1);
    if (currentQ) {
      const saved = answers[currentQ.id];
      setSelected(isMulti ? (Array.isArray(saved) ? saved : []) : (saved ?? null));
    } else {
      setSelected(null);
    }
  }, [step]);

  // Scroll result into view
  useEffect(() => {
    if (result && resultRef.current) {
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 150);
    }
  }, [result]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [chatMsgs, chatLoading]);

  // Phase cycling
  useEffect(() => {
    if (!loading) { clearInterval(phaseRef.current); return; }
    setPhase(0);
    let i = 0;
    phaseRef.current = setInterval(() => { i = Math.min(i + 1, PHASES.length - 1); setPhase(i); }, 2600);
    return () => clearInterval(phaseRef.current);
  }, [loading]);

  // ── SELECTION HANDLERS ──────────────────────────────────────────────────────
  function handleSingle(value) { setSelected(value); }

  function handleMulti(value, exclusive) {
    setSelected(prev => {
      const arr = Array.isArray(prev) ? prev : [];
      if (exclusive) return [value];
      const withoutExcl = arr.filter(v => {
        const opt = currentQ.options.find(o => o.value === v);
        return !opt?.exclusive;
      });
      return withoutExcl.includes(value)
        ? withoutExcl.filter(v => v !== value)
        : [...withoutExcl, value];
    });
  }

  const canAdvance = isMulti
    ? (Array.isArray(selected) && selected.length > 0)
    : selected !== null;

  // ── NAVIGATION ──────────────────────────────────────────────────────────────
  function handleNext() {
    if (!canAdvance) return;
    const qId   = currentQ.id;
    const value = isMulti ? selected : selected;
    const next  = { ...answers, [qId]: value };
    setAnswers(next);
    if (step < totalQ) setStep(s => s + 1);
    else               runRecommendation(next);
  }

  function handleBack() {
    if (step > 1) setStep(s => s - 1);
    else          setStep(0);
  }

  function restart() {
    setStep(0); setAnswers({}); setSelected(null);
    setResult(null); setError(null); setSearches([]);
    setShowAll(false); setChatMsgs([]); setChatInput(""); setUsedChips(new Set());
  }

  // ── RECOMMENDATION ENGINE ───────────────────────────────────────────────────
  async function runRecommendation(ans) {
    setStep(totalQ + 1);
    setLoading(true);
    setError(null);
    setSearches([]);

    const ranked = BANKS
      .map(b => { const q = getQualifyingAPY(b, ans); return q ? { ...b, qualifyingApy:q.apy, tierLabel:q.tierLabel } : null; })
      .filter(Boolean)
      .sort((a, b) => b.qualifyingApy - a.qualifyingApy);

    const eliminated = BANKS.filter(b => !ranked.find(r => r.id === b.id)).map(b => b.name);
    const top7 = ranked.slice(0, 7);

    const getLabel = (qId, val) => {
      const q = QUESTIONS.find(q => q.id === qId);
      if (!q) return String(val);
      if (Array.isArray(val)) return val.map(v => q.options.find(o => o.value === v)?.label || v).join(", ");
      return q.options.find(o => o.value === val)?.label || String(val);
    };

    const profileStr = QUESTIONS.map(q => `  ${q.question}: ${getLabel(q.id, ans[q.id] || "—")}`).join("\n");

    const prompt = `You are an unbiased HYSA expert. A user has completed a detailed savings account profile. Your job: (1) verify current rates via web search, then (2) provide a tailored recommendation.

STEP 1 — WEB VERIFICATION
Search the official website and/or reputable aggregators (NerdWallet, Bankrate, CNBC Select, Motley Fool) for each bank below. Prioritize recency — use March 2026 sources where available.
For each bank search: "[bank name] high yield savings APY 2026" or "[bank name] savings rate March 2026".
Verify conditions, any recent rate changes, and promo expiry dates for the top 5-6 banks.

BANKS TO VERIFY (qualifying APYs pre-calculated for this user's profile):
${top7.map((b,i) => `  ${i+1}. ${b.name} — stored APY: ${b.qualifyingApy.toFixed(2)}% | Tier: ${b.tierLabel} | Branch:${b.branch?'Y':'N'} Debit:${b.debit?'Y':'N'} Invest:${b.investing?'Y':'N'}`).join('\n')}

ELIMINATED BANKS: ${eliminated.join(', ')}

USER PROFILE:
${profileStr}

STEP 2 — RESPOND WITH JSON ONLY (no markdown, no backticks, no preamble):
{
  "verified_rates": [
    {
      "bank": "name",
      "our_apy": number,
      "live_apy": number,
      "changed": boolean,
      "direction": "up"|"down"|"same",
      "source": "source name",
      "source_date": "e.g. March 2026",
      "conditions_note": "brief note on key conditions or anything that changed",
      "promo_expiry": "expiry info or null"
    }
  ],
  "bank": "recommended bank name",
  "account": "account name",
  "apy": number,
  "tier_label": "qualifying tier",
  "rate_confidence": "confirmed"|"likely current"|"unverified",
  "verification_note": "one sentence: what you found when you looked this up today",
  "headline": "max 12 words — punchy, specific to this user's situation",
  "summary": "2-3 sentences, plain English, directly tied to their profile — purpose, balance, DD setup, etc.",
  "top_perks": ["perk 1", "perk 2", "perk 3"],
  "watch_out": "one genuine caveat specific to this user",
  "runner_up": "second bank name",
  "runner_up_apy": number,
  "runner_up_reason": "one sentence why it's a strong second for THIS user",
  "why_not_others": "one sentence on why other top options were passed over for this user"
}`;

    try {
      const raw = await runAgenticSearch(prompt, q => setSearches(p => [...p, q]));
      const json = raw.match(/\{[\s\S]*\}/)?.[0];
      if (!json) throw new Error("No JSON");
      const parsed = JSON.parse(json);
      setResult({ ...parsed, allRanked: ranked });
    } catch (e) {
      console.error(e);
      const msg = e.message?.includes("timed out")
        ? "The rate scan timed out. Please try again — it sometimes takes a moment to connect."
        : e.message?.includes("API error")
        ? `Connection error (${e.message}). Please try again.`
        : "Something went wrong during the rate scan. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  // ── CHAT ────────────────────────────────────────────────────────────────────
  async function sendChat(text) {
    const msg = text.trim();
    if (!msg || chatLoading || !result) return;

    const newHistory = [...chatMsgs, { role:"user", content:msg }];
    setChatMsgs(newHistory);
    setChatInput("");
    setChatLoading(true);

    try {
      const resp = await fetchWithTimeout(
        "/api/messages",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: buildSystemPrompt(answers, result),
            messages: newHistory.map(m => ({ role: m.role, content: m.content })),
          }),
        },
        30000
      );
      if (!resp.ok) throw new Error(`API error ${resp.status}`);
      const data = await resp.json();
      const reply = data.content?.find(b => b.type === "text")?.text || "I couldn't generate a response. Please try again.";
      setChatMsgs(p => [...p, { role: "assistant", content: reply }]);
    } catch (err) {
      setChatMsgs(p => [...p, { role: "assistant", content: err.message?.includes("timed out") ? "Request timed out — please try again." : "Something went wrong. Please try again." }]);
    } finally {
      setChatLoading(false);
    }
  }

  function handleChip(chip) {
    setUsedChips(p => new Set([...p, chip]));
    sendChat(chip);
  }

  function handleInputKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(chatInput); }
  }

  // ── RENDER ──────────────────────────────────────────────────────────────────
  const progress = step >= 1 && step <= totalQ ? (step / totalQ) * 100 : step > totalQ ? 100 : 0;
  const chips = result ? generateChips(result, answers).filter(c => !usedChips.has(c)) : [];

  return (
    <>
      <style>{CSS}</style>
      <div className="root">
        <div className="bg-lines" /><div className="bg-glow" />
        <div className="shell">

          {/* ── INTRO ── */}
          {step === 0 && (
            <div className="intro">
              <div className="intro-tag">
                <span className="intro-tag-dot" />
                Live savings rate analysis · March 2026
              </div>
              <h1 className="intro-h">Yield<br/><em>Concierge</em></h1>
              <p className="intro-p">
                11 questions. We calculate your real qualifying rate across a set of curated banks, scan live sources to verify every APY, then let you refine the recommendation through a private conversation.
              </p>
              <div className="trust-row">
                {["Live rate verification","No ads or paid rankings","Curated banks analyzed","Ask follow-up questions"].map((t,i) => (
                  <span key={i} className="trust-item"><span className="trust-pip"/>{t}</span>
                ))}
              </div>
              <button className="cta" onClick={() => setStep(1)}>
                Begin your analysis
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M3 7.5h9M8.5 4l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}

          {/* ── QUESTIONS ── */}
          {step >= 1 && step <= totalQ && currentQ && (
            <>
              <div className="prog-wrap">
                <div className="prog-bar"><div className="prog-fill" style={{ width:`${progress}%` }} /></div>
                <div className="prog-nums">
                  {QUESTIONS.map((q, i) => (
                    <span key={q.id} className={`prog-n ${i + 1 === step ? "active" : ""}`}>{String(i+1).padStart(2,"0")}</span>
                  ))}
                </div>
              </div>

              <div className="q-wrap" key={`q-${animKey}`}>
                <div className="q-num">Question {step} of {totalQ}</div>
                <div className="q-title">{currentQ.question}</div>
                <div className="q-sub">{currentQ.subtext}</div>

                {isMulti && <div className="multi-hint">Select all that apply ·</div>}

                <div className="opts">
                  {currentQ.options.map(opt => {
                    const arr = Array.isArray(selected) ? selected : [];
                    const isActive = isMulti ? arr.includes(opt.value) : selected === opt.value;
                    return (
                      <div
                        key={opt.value}
                        className={`opt ${isActive ? "active" : ""} ${isMulti && opt.exclusive ? "multi-exclusive" : ""}`}
                        onClick={() => isMulti ? handleMulti(opt.value, opt.exclusive) : handleSingle(opt.value)}
                      >
                        {isMulti
                          ? <div className="checkbox">{isActive ? "✓" : ""}</div>
                          : <div className="radio"><div className="radio-dot" /></div>
                        }
                        {opt.label}
                      </div>
                    );
                  })}
                </div>

                <div className="nav">
                  <button className="btn-back" onClick={handleBack}>← Back</button>
                  <button className="btn-next" disabled={!canAdvance} onClick={handleNext}>
                    {step === totalQ ? "Verify rates & recommend →" : "Continue →"}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── LOADING ── */}
          {loading && (
            <div className="loading">
              <div className="spin-outer">
                <div className="spin-ring" />
                <div className="spin-inner" />
              </div>
              <div className="load-phase">{PHASES[phase]}</div>
              <div className="load-eta">Estimated 20–30 seconds</div>
              {searches.length > 0 && (
                <div className="search-log">
                  <div className="search-log-hdr">Live searches</div>
                  {searches.map((q, i) => (
                    <div key={i} className="search-item">
                      <span className="search-tick">◆</span>
                      <span>"{q}"</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── ERROR ── */}
          {error && !loading && (
            <div className="err">
              <div className="err-msg">{error}</div>
              <button className="restart" onClick={restart}>Try again</button>
            </div>
          )}

          {/* ── RESULT + CHAT ── */}
          {result && !loading && (
            <div className="result" ref={resultRef}>

              {/* Verification Panel */}
              {result.verified_rates?.length > 0 && (
                <>
                  <div className="section-hdr">Live rate verification</div>
                  <div className="verify-grid">
                    {result.verified_rates.map((vr, i) => {
                      const d = vr.direction;
                      const apyCls   = d==="up" ? "v-gold" : d==="down" ? "v-red" : "v-green";
                      const badgeCls = d==="up" ? "v-badge v-up" : d==="down" ? "v-badge v-dn" : d==="same" ? "v-badge v-same" : "v-badge v-conf";
                      const badgeTxt = d==="up" ? "↑ RATE UP" : d==="down" ? "↓ RATE DOWN" : "✓ CONFIRMED";
                      return (
                        <div key={i} className="v-row">
                          <div className="v-meta">
                            <div className="v-name">{vr.bank}</div>
                            {vr.conditions_note && <div className="v-cond">{vr.conditions_note}</div>}
                            {vr.promo_expiry    && <div className="v-expiry">⏱ {vr.promo_expiry}</div>}
                          </div>
                          <div className="v-apy-col">
                            <div className={`v-apy ${apyCls}`}>{Number(vr.live_apy).toFixed(2)}%</div>
                            <div className="v-src">{vr.source_date || vr.source}</div>
                          </div>
                          <div className={badgeCls}>{badgeTxt}</div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Recommendation Card */}
              <div className="section-hdr">Your recommendation</div>
              <div className="rec-card">
                <div className="rec-top-row">
                  <div className="rec-bankname">{result.bank}</div>
                  {result.rate_confidence && (
                    <div className={`rec-conf ${result.rate_confidence==="confirmed" ? "conf-ok" : result.rate_confidence==="likely current" ? "conf-approx" : "conf-warn"}`}>
                      {result.rate_confidence==="confirmed" ? "✓ Rate confirmed" : result.rate_confidence==="likely current" ? "≈ Likely current" : "⚠ Verify rate"}
                    </div>
                  )}
                </div>
                <div className="rec-acct">{result.account}</div>
                <div className="apy-row">
                  <div className="apy-n">{Number(result.apy).toFixed(2)}</div>
                  <div className="apy-pct">% APY</div>
                </div>
                <div className="tier-lbl">{result.tier_label}</div>
                {result.verification_note && (
                  <div className="v-note-inline">{result.verification_note}</div>
                )}
                <div className="rec-hl">"{result.headline}"</div>
                <div className="rec-summary">{result.summary}</div>
                <div className="perks">
                  {result.top_perks?.map((p, i) => (
                    <div key={i} className="perk"><span className="perk-ico">◆</span>{p}</div>
                  ))}
                </div>
                <div className="watchout"><b>Watch out — </b>{result.watch_out}</div>
              </div>

              {/* Runner-up */}
              {result.runner_up && (
                <div className="sub-card">
                  <div className="sub-top">
                    <div>
                      <div className="sub-lbl">Runner-up</div>
                      <div className="sub-name">{result.runner_up}</div>
                    </div>
                    <div className="sub-apy">{Number(result.runner_up_apy).toFixed(2)}<span>% APY</span></div>
                  </div>
                  <div className="sub-reason">{result.runner_up_reason}</div>
                </div>
              )}

              {/* Why not others */}
              {result.why_not_others && (
                <div className="sub-card" style={{ borderStyle:"dashed" }}>
                  <div className="sub-lbl" style={{ marginBottom:6 }}>On the others</div>
                  <div className="sub-reason">{result.why_not_others}</div>
                </div>
              )}

              {/* All qualifying rates */}
              <button className="rates-toggle" onClick={() => setShowAll(v => !v)}>
                <span>All {result.allRanked?.length} qualifying rates for your profile</span>
                <span>{showAll ? "▲" : "▼"}</span>
              </button>
              {showAll && (
                <table className="rates-tbl">
                  <thead>
                    <tr><th>Bank</th><th>Your APY</th><th>Qualifying Tier</th></tr>
                  </thead>
                  <tbody>
                    {result.allRanked.map((b, i) => (
                      <tr key={b.id}>
                        <td>{b.name}</td>
                        <td className="td-apy" style={{ color: i===0 ? "#c8a96e" : undefined }}>
                          {b.qualifyingApy.toFixed(2)}%
                        </td>
                        <td style={{ fontSize:11, color:"#5a6070" }}>{b.tierLabel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* ── CONCIERGE CHAT ── */}
              <div className="chat-section">
                <div className="section-hdr">Refine your recommendation</div>
                <div className="chat-intro">
                  Have questions? Want to explore a different scenario? Ask anything — I have your full profile and live rate data.
                </div>

                {/* Quick chips */}
                {chips.length > 0 && (
                  <div className="chips">
                    {chips.map((chip, i) => (
                      <button key={i} className="chip" onClick={() => handleChip(chip)}>
                        {chip}
                      </button>
                    ))}
                  </div>
                )}

                {/* Chat thread */}
                {chatMsgs.length > 0 && (
                  <div className="chat-thread">
                    {chatMsgs.map((m, i) => (
                      <div key={i} className={m.role === "user" ? "msg-user" : "msg-assistant"}>
                        {m.content.split('\n').filter(Boolean).map((line, j) => (
                          <p key={j}>{line}</p>
                        ))}
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="msg-thinking">
                        <span className="dots">
                          <span>●</span><span>●</span><span>●</span>
                        </span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                )}

                {/* Input */}
                <div className="chat-input-row">
                  <textarea
                    ref={inputRef}
                    className="chat-input"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={handleInputKey}
                    placeholder="Ask anything — 'what if I can't do direct deposit?', 'compare the top two', …"
                    rows={2}
                    disabled={chatLoading}
                  />
                  <button
                    className="chat-send"
                    onClick={() => sendChat(chatInput)}
                    disabled={!chatInput.trim() || chatLoading}
                  >
                    Send
                  </button>
                </div>
              </div>

              <button className="restart" onClick={restart} style={{ marginTop:32 }}>
                ↺ Start over with different answers
              </button>

              <div className="disc">
                Rate verification performed {new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}.
                APYs are variable — verify directly with each institution before opening an account.
                This tool is independent. No banks pay for placement or recommendations.
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
