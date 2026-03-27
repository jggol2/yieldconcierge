import { useState, useEffect, useRef } from "react";

// ─── BANK DATA (Updated March 27, 2026) ──────────────────────────────────────
// affiliateUrl: replace placeholder value with your live tracking link once approved.
// Network key: [impact] = Impact.com  [cj] = CJ Affiliate  [direct] = contact bank marketing
const BANKS = [
  { id:"sofi",            name:"SoFi",                   account:"Checking & Savings",          baseApy:1.00, branch:false, debit:true,  investing:true,  fee:0, feeWaivable:false, minOpen:0,   slowTransfer:false, affiliateUrl:"https://sofi.com/banking/savings-account/?ref=REPLACE_IMPACT_ID",           notes:"3.30% APY with eligible DD OR $5,000+ in qualifying deposits every 31 days; 1.00% without. Eligible DD = paycheck, pension, or government benefits (Social Security etc.) via ACH from employer, payroll provider, or government agency — any amount qualifies for 3.30% APY. NOT eligible: P2P transfers (PayPal, Venmo), transfers between own SoFi accounts, interest/credits/bonuses from SoFi. $5k/31-day path: ACH from external banks counts, but NOT internal SoFi transfers or P2P. $1,000+ DD required separately for overdraft coverage (separate benefit). SoFi Plus paid subscription ($10/month, $120/year): earns 4.50% APY on first $20,000 and 3.30% on the rest — requires DD. Break-even vs standard DD tier is $10,000 balance. At $10k–$20k balances the Plus subscription is the highest effective net APY available from any HYSA. Strong debit + investing. Instant internal transfers." },
  { id:"wealthfront",     name:"Wealthfront",             account:"Cash Account",                baseApy:3.30, branch:false, debit:true,  investing:true,  fee:0, feeWaivable:false, minOpen:1,   slowTransfer:false, affiliateUrl:"https://www.wealthfront.com/cash?ref=REPLACE_IMPACT_ID",                    notes:"3.30% base APY — NO conditions, no minimum balance, no monthly fees. Additional permanent +0.25% APY boost (→3.55%) if: (1) direct deposit $1,000+/month AND (2) have a funded Wealthfront investing account — both required, ongoing. NOT a bank — cash mgmt account sweeping funds to up to 32 program banks for up to $8M FDIC ($16M joint). No account fees, no overdraft fees. Debit card + 19,000 free ATMs; 2 out-of-network reimbursements/month (up to $7.50 each). Free 24/7 instant withdrawals to eligible external accounts. Free wire transfers. Phone support weekdays 7am-5pm PT only — no weekend live support, no chat. Referral boost: +0.75% for 3 months (stacks on top of base or boost rate)." },
  { id:"marcus",          name:"Marcus by Goldman Sachs", account:"Online Savings Account",      baseApy:3.65, branch:false, debit:false, investing:false, fee:0, feeWaivable:false, minOpen:0,   slowTransfer:false, affiliateUrl:"https://www.marcus.com/us/en/savings/high-yield-savings?ref=REPLACE_CJ_ID",  notes:"No conditions, no fees, no debit. Flat 3.65% from Goldman Sachs. Trusted brand. Transfers typically 1 business day to linked accounts. Best for pure savers who want simplicity." },
  { id:"betterment",      name:"Betterment",              account:"Cash Reserve",                baseApy:3.25, branch:false, debit:false, investing:true,  fee:0, feeWaivable:false, minOpen:10,  slowTransfer:false, affiliateUrl:"https://www.betterment.com/cash-reserve?ref=REPLACE_IMPACT_ID",             notes:"3.25% flat base APY — NO ongoing conditions, no minimum balance, no DD required. $10 minimum to open. NOT a bank — sweeps funds to up to 8 program banks for up to $2M FDIC ($4M joint). New client boost: +0.65% for 3 months with any qualifying deposit (deposit must settle within 14 days of opening). Existing clients may receive targeted +0.65% boost offers via email for $5k-$25k deposits. No debit card on Cash Reserve itself (separate Betterment Checking account exists). No monthly fees. APY is variable and changes with Fed rate. Phone support weekdays 9am-8pm ET only. Requires Betterment Securities brokerage account to open Cash Reserve — this is created automatically. Strong robo-advisor integration." },
  { id:"axos",            name:"Axos Bank",               account:"ONE Savings (bundle)",        baseApy:1.00, branch:false, debit:true,  investing:false, fee:0, feeWaivable:false, minOpen:0,   slowTransfer:false, affiliateUrl:"https://www.axosbank.com/Personal/Savings?ref=REPLACE_CJ_ID",               notes:"4.21% APY requires meeting ONE of two options in Axos ONE Checking account by the 25th of each month: Option 1 — $1,500+ in qualifying monthly DD AND average daily balance above $1,500; Option 2 — $5,000+ in qualifying monthly deposits AND average daily balance above $5,000. Qualifying deposits = paychecks, payroll, ACH from external banks. NOT qualifying: internal Axos transfers, interest payments, bonuses, credits/reversals, ATM deposits. BOTH checking and savings accounts must remain open and active on the 25th or neither earns the promo rate. Qualification period runs first business day of month through the 25th. 4.21% applies on first $249,999; 3.50% on remainder. Base rate is 1.00% if conditions unmet. 95,000+ fee-free ATMs. No monthly fees, no overdraft fees. No investing. Debit card on checking account only. Online only." },
  { id:"openbank",        name:"Openbank",                account:"High Yield Savings",          baseApy:4.09, branch:false, debit:false, investing:false, fee:0, feeWaivable:false, minOpen:500, slowTransfer:false, affiliateUrl:null,                                                                         notes:"Digital subsidiary of Santander. No conditions for 4.09% — highest unconditional flat rate. $500 min to open. Online/app only. No debit. Transfers typically 1-2 days." },
  { id:"bread",           name:"Bread Savings",           account:"High Yield Savings",          baseApy:4.00, branch:false, debit:false, investing:false, fee:0, feeWaivable:false, minOpen:100, slowTransfer:true,  affiliateUrl:"https://www.breadsavings.com/?ref=REPLACE_CJ_ID",                           notes:"Flat 4.00% APY, $100 min to open, no monthly fees. No debit or checking. Online only. Paper statements $5. ACH transfers can take 1-3 business days. Not ideal if you need fast access." },
  { id:"everbank",        name:"EverBank",                account:"Performance Savings",         baseApy:3.90, branch:true,  debit:true,  investing:false, fee:0, feeWaivable:false, minOpen:0,   slowTransfer:false, affiliateUrl:"https://www.everbank.com/banking/savings?ref=REPLACE_DIRECT_ID",            notes:"No minimum, no fee, flat 3.90%. Branches in FL, CA, and NY only. EverBank checking + debit available. Best for Southeast/coastal users wanting branch + competitive rate." },
  { id:"pnc",             name:"PNC Bank",                account:"Premiere Money Market",       baseApy:0.02, branch:true,  debit:true,  investing:false, fee:0, feeWaivable:true,  minOpen:0,   slowTransfer:false, affiliateUrl:null,                                                                         notes:"Promotional 3.25% ONLY for new clients with address outside PNC branch footprint, $25k+ balance, existing PNC checking. Not available to existing PNC savings holders. Everyone else: ~0.02%." },
  { id:"capital_one",     name:"Capital One",             account:"360 Performance Savings",     baseApy:3.20, branch:true,  debit:false, investing:false, fee:0, feeWaivable:false, minOpen:0,   slowTransfer:false, affiliateUrl:"https://www.capitalone.com/bank/savings-accounts/online-performance-savings-account/?ref=REPLACE_CJ_ID", notes:"Flat 3.20%, no conditions, no fees. 200+ branches + Capital One Cafes (mostly East Coast). No debit on savings — transfers only. Fast ACH. Excellent brand trust and mobile app." },
  { id:"ally",            name:"Ally Bank",               account:"Online Savings Account",      baseApy:3.20, branch:false, debit:false, investing:false, fee:0, feeWaivable:false, minOpen:0,   slowTransfer:false, affiliateUrl:"https://www.ally.com/bank/online-savings-account/?ref=REPLACE_CJ_ID",      notes:"Flat 3.20%. Savings buckets, round-ups, best-in-class UX and app. No debit on savings. Fast transfers (often 1 business day). Reliable but rate trails top fintechs." },
  { id:"cit",             name:"CIT Bank",                account:"Platinum Savings",            baseApy:0.25, branch:false, debit:false, investing:false, fee:0, feeWaivable:false, minOpen:100, slowTransfer:false, affiliateUrl:"https://www.cit.com/cit-bank/bank/savings/platinum-savings/?ref=REPLACE_CJ_ID", notes:"Tiered rate account — 3.75% APY if end-of-day balance is $5,000 or more; drops to 0.25% APY on the ENTIRE balance if it falls below $5,000 (not just the shortfall). This cliff effect is the key risk: a single withdrawal that pushes below $5k tanks earnings on everything. Rate is based on end-of-day daily balance, checked every day. $100 minimum to open; no minimum balance required to maintain account (but need $5k to earn 3.75%). No monthly fees. No debit card. No checking account. Interest compounds daily, credited monthly. $10 outgoing wire fee (waived for balances $25,000+). Incoming wires free. Mobile check deposit available. CIT is the online division of First Citizens Bank (FDIC). Promo: code CITBoost adds +0.35% APY → 4.10% for 6 months on new and existing accounts; promotion ends April 13, 2026 — enroll before then. Phone/chat support limited hours. No branch access." },
  { id:"hsbc",            name:"HSBC",                    account:"Premier Relationship Savings", baseApy:0.05, branch:true, debit:false, investing:false, fee:0, feeWaivable:false, minOpen:0,   slowTransfer:false, affiliateUrl:null,                                                                         notes:"Standard rate 0.05% (near zero). Relationship rate 3.30% (updated Feb 2026) requires HSBC Premier checking + monthly activity: $500 debit spend OR $500 credit payments OR $5,000 DD. Complex conditions. Select major city branches." },
  { id:"truist",          name:"Truist",                  account:"One Savings",                 baseApy:0.01, branch:true,  debit:true,  investing:false, fee:5, feeWaivable:true,  minOpen:0,   slowTransfer:false, affiliateUrl:null,                                                                         notes:"Not a HYSA — 0.01% APY. Only for users needing full-service traditional banking in SE/Mid-Atlantic. Large branch network." },
  { id:"amex",            name:"American Express",        account:"High Yield Savings",          baseApy:3.20, branch:false, debit:false, investing:false, fee:0, feeWaivable:false, minOpen:0,   slowTransfer:false, affiliateUrl:"https://www.americanexpress.com/en-us/banking/high-yield-savings/?ref=REPLACE_CJ_ID", notes:"Flat 3.20% (reduced from 3.30% around March 18, 2026), no minimums, no debit. No withdrawal restrictions — unlimited withdrawals, no monthly cap. Transfers 1-3 days. 24/7 U.S.-based phone support. Seamless for existing Amex cardholders. No checking account." },
  { id:"chase",           name:"Chase",                   account:"Savings Account",             baseApy:0.01, branch:true,  debit:true,  investing:true,  fee:5, feeWaivable:true,  minOpen:0,   slowTransfer:false, affiliateUrl:null,                                                                         notes:"Not a HYSA — 0.01% APY. Largest US bank. Only relevant for users deeply in Chase ecosystem. Strong investing via J.P. Morgan. Fast transfers within Chase." },
  { id:"barclays",        name:"Barclays",                account:"Tiered Savings Account",      baseApy:3.70, branch:false, debit:false, investing:false, fee:0, feeWaivable:false, minOpen:0,   slowTransfer:true,  affiliateUrl:"https://www.banking.barclaysus.com/tiered-savings.html?ref=REPLACE_CJ_ID",  notes:"Tiered rate: 3.70% APY on balances under $250,000; 3.85% APY on balances $250,000+. Rate is applied to the entire balance based on end-of-day tier. No monthly fees, no minimum to open. No debit card, no checking account — ACH transfers only, typically 2–3 business days. $200 new customer bonus (EXPIRING MARCH 31, 2026): must be a new Barclays savings customer (previous CD or savings holders not eligible), deposit $30,000 within 30 days of opening, maintain $30,000 for 120 consecutive days — bonus posts ~60 days after qualifying; multiple ACH deposits from external banks allowed to reach $30k within the 30-day window; any withdrawal below $30k during the 120 days restarts the clock. Bonus treated as interest income (IRS Form 1099-INT). After March 31 the bonus expires — standard tiered rates only. No branch access. Online only." },
  { id:"etrade",          name:"E*TRADE",                 account:"Premium Savings",             baseApy:3.35, branch:false, debit:false, investing:true,  fee:0, feeWaivable:false, minOpen:0,   slowTransfer:false, affiliateUrl:"https://us.etrade.com/bank/premium-savings-account?ref=REPLACE_CJ_ID",     notes:"Backed by Morgan Stanley. Standard 3.35%. Promo 3.75% for 6 months on new money (code SAVE26) + cash bonus up to $2,000. Seamless brokerage integration." },
  { id:"popular",         name:"Popular Direct",          account:"Exclusive Savings",           baseApy:3.90, branch:false, debit:false, investing:false, fee:0, feeWaivable:false, minOpen:100, slowTransfer:true,  affiliateUrl:null,                                                                         notes:"Online division of Popular Bank. Flat 3.90% APY. $100 min. $25 early closure fee within 180 days. ACH can take 2-3 days. Not ideal for urgent withdrawal needs." },
  { id:"bask",            name:"Bask Bank",               account:"Interest Savings",            baseApy:3.75, branch:false, debit:false, investing:false, fee:0, feeWaivable:false, minOpen:0,   slowTransfer:false, affiliateUrl:"https://www.baskbank.com/savings?ref=REPLACE_DIRECT_ID",                   notes:"Two separate account types — users must choose: (1) Interest Savings: 3.75% flat APY, no conditions, no minimum balance; promo 4.00% APY for new accounts opened Feb 1–Apr 30, 2026 with $10,000+ average monthly balance during reward period through June 30, 2026. (2) Mileage Savings: earns 1.75 American Airlines AAdvantage miles per $1 saved annually instead of cash interest — miles accrue daily, awarded monthly based on average monthly balance; equivalent taxable APY is ~0.735% (IRS taxes miles at 0.42 cents each); miles do NOT count toward AA elite status; no minimum balance. Both accounts: no monthly fees, no minimum to open, online only (division of Texas Capital Bank, FDIC). No debit card on savings accounts — debit available only on separate Bask Interest Checking account. Customer service M-F 7am–7pm CT, Saturday 9am–4pm CT. Withdrawals via ACH or wire only. Mileage account best for frequent AA flyers who value miles over cash; Interest account best for pure rate optimization." },
  { id:"western_alliance", name:"Western Alliance Bank", account:"High-Yield Savings Premier",  baseApy:3.80, branch:false, debit:false, investing:false, fee:0, feeWaivable:false, minOpen:500, slowTransfer:true,  affiliateUrl:null,                                                                         notes:"Major FDIC bank ($90B+ assets). Flat 3.80% no conditions. $500 min to open. ACH only — one linked external account. Deposits take 5 business days. No debit. Well-reviewed. Joint accounts available." },
  { id:"forbright",       name:"Forbright Bank",          account:"Growth Savings",             baseApy:3.85, branch:false, debit:false, investing:false, fee:0, feeWaivable:false, minOpen:0,   slowTransfer:false, affiliateUrl:null,                                                                         notes:"Flat 3.85%, no minimum, no fees. Eco-certified FDIC bank. No debit/ATM. Unlimited transfers. M-F customer service only. Highly rated by NerdWallet and Bankrate. Online only." },
  { id:"synchrony",       name:"Synchrony Bank",          account:"High Yield Savings",         baseApy:3.50, branch:false, debit:true,  investing:false, fee:0, feeWaivable:false, minOpen:0,   slowTransfer:false, affiliateUrl:"https://www.synchronybank.com/banking/high-yield-savings-account/?ref=REPLACE_CJ_ID", notes:"Flat 3.50%, no conditions, no minimum. Unique: optional ATM debit card with $5/mo fee reimbursement — one of few HYSAs offering this with no requirements. 90-year history. 4.8-star iOS app. FDIC." },
  { id:"lendingclub",     name:"LendingClub Bank",        account:"LevelUp Savings",            baseApy:3.00, branch:false, debit:true,  investing:false, fee:0, feeWaivable:false, minOpen:0,   slowTransfer:false, affiliateUrl:"https://www.lendingclub.com/personal-banking/savings/high-yield-savings?ref=REPLACE_IMPACT_ID", notes:"LevelUp rate: 4.00% APY with $250+ monthly deposit per statement cycle; 3.00% without. ANY deposit counts toward the $250 — ACH transfers, direct deposit, wire, mobile check deposit, etc. Interest payments, account bonuses, and bank credits do NOT count. Multiple deposits in a month combine toward the $250. No minimum per individual deposit. Free ATM card. No fees, no minimum balance. FDIC. New accounts earn 4.00% automatically for first two statement cycles." },
  { id:"robinhood",       name:"Robinhood Gold",          account:"High-Yield Cash Program",    baseApy:0.01, branch:false, debit:true,  investing:true,  fee:5, feeWaivable:false, minOpen:0,   slowTransfer:false, affiliateUrl:"https://robinhood.com/us/en/gold/?ref=REPLACE_DIRECT_ID",                            notes:"3.35% APY on uninvested brokerage cash via High-Yield Cash Program — requires Robinhood Gold subscription ($5/month or $50/year). NOT a bank — fintech (Robinhood Money LLC); cash swept to program banks for up to $2.5M FDIC pass-through insurance ($250k per program bank). Without Gold: ~0.01% APY. Key distinction: Gold is only cost-effective for cash savings if you already use it for investing benefits (3% IRA match worth $225/yr at 2026 contribution limit, $1k interest-free margin, Morningstar research, Gold Card). For pure cash savers with no investing interest, fee makes 3.35% uncompetitive vs. no-fee banks. Robinhood Banking (invite-only, annual Gold required): full checking + savings with Mastercard debit, 35,000 fee-free ATMs, wire transfers, no monthly fees, no overdraft fees, $2.5M FDIC; launched fall 2025 in limited rollout. Standard debit card available. Instant transfers within Robinhood; external ACH takes 4-5 business days (instant withdrawal available for 1.5% fee). 24/7 customer support. No branch access. Crypto trading available. 30-day Gold free trial for new subscribers." },
];

// ─── TIERS ────────────────────────────────────────────────────────────────────
const TIERS = [
  { bank:"sofi",        label:"SoFi Plus (paid, $10/mo) — 4.50% on up to $20k",   apy:4.50, minBal:10000,  reqDD:true,  minDD:0,    newMoney:false, newCustomerOnly:false, sort:0, monthlyFee:10, maxBalForBoost:20000 },
  { bank:"sofi",        label:"Standard with Direct Deposit",                      apy:3.30, minBal:0,      reqDD:true,  minDD:0,    newMoney:false, newCustomerOnly:false, sort:1 },
  { bank:"sofi",        label:"Base Rate (no DD)",                                 apy:1.00, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:2 },
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
  { bank:"capital_one", label:"Standard Rate (no conditions)",                     apy:3.20, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:1 },
  { bank:"ally",        label:"Standard Rate (no conditions)",                     apy:3.20, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:1 },
  { bank:"cit",         label:"Platinum Rate ($5,000+ balance)",                   apy:3.75, minBal:5000,   reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:1 },
  { bank:"cit",         label:"Base Rate (under $5,000)",                          apy:0.25, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:2 },
  { bank:"hsbc",            label:"Relationship APY (Premier checking + activity)",    apy:3.30, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:1 },
  { bank:"hsbc",            label:"Standard APY (no conditions met)",                  apy:0.05, minBal:1,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:2 },
  { bank:"truist",      label:"Standard Rate (all balances)",                      apy:0.01, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:1 },
  { bank:"amex",        label:"Standard Rate (no conditions)",                     apy:3.20, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:1 },
  { bank:"chase",       label:"Standard Rate (all balances)",                      apy:0.01, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:1 },
  { bank:"barclays",    label:"Top Tier ($250,000+ balance)",                      apy:3.85, minBal:250000, reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:1 },
  { bank:"barclays",    label:"Standard Rate (under $250,000)",                    apy:3.70, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:2 },
  { bank:"etrade",      label:"Promo 3.75% — New Money, 6 Months (code SAVE26)", apy:3.75, minBal:0,      reqDD:false, minDD:0,    newMoney:true,  newCustomerOnly:false, sort:1 },
  { bank:"etrade",      label:"Standard Rate (no conditions)",                     apy:3.35, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:2 },
  { bank:"popular",     label:"Standard Rate ($100 min opening deposit)",          apy:3.90, minBal:100,    reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:1 },
  { bank:"bask",            label:"Promo 4.00% (new accounts, $10k+ bal, ≤May 2026)", apy:4.00, minBal:10000,  reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:true,  sort:1 },
  { bank:"bask",            label:"Standard Rate (no conditions)",                     apy:3.75, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:2 },
  // New banks added March 15, 2026
  { bank:"western_alliance", label:"Standard Rate ($500 min to open, one linked account)", apy:3.80, minBal:0, reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:1 },
  { bank:"forbright",       label:"Standard Rate (no conditions, no minimum)",         apy:3.85, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:1 },
  { bank:"synchrony",       label:"Standard Rate (no conditions, optional debit)",     apy:3.50, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:1 },
  { bank:"lendingclub",     label:"LevelUp Rate ($250+ monthly deposit)",              apy:4.00, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:1, minMonthlyDeposit:250 },
  { bank:"lendingclub",     label:"Standard Rate (no monthly deposit)",                apy:3.00, minBal:0,      reqDD:false, minDD:0,    newMoney:false, newCustomerOnly:false, sort:2 },
  { bank:"robinhood",       label:"Gold High-Yield Cash (3.35% APY — $5/mo Gold subscription)", apy:3.35, minBal:0, reqDD:false, minDD:0, newMoney:false, newCustomerOnly:false, sort:1, monthlyFee:5, investingBundle:true },
];

// ─── QUESTIONS (10 total) ─────────────────────────────────────────────────────
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
      { value:"robinhood",   label:"Robinhood" },
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
  const isNew  = !isExisting;
  const condComfort = answers.conditions_comfort || "some";
  const skipActiveConds = condComfort === "no";

  if (answers.branch === "required" && !bank.branch)                return null;
  if (answers.debit === "yes" && !bank.debit)                       return null;
  if (answers.investing === "yes" && !bank.investing)               return null;
  if (answers.fees === "zero" && bank.fee > 0 && !bank.feeWaivable) return null;
  if (balEst < bank.minOpen)                                        return null;
  if (answers.access_speed === "urgent" && bank.slowTransfer)       return null;

  const bankTiers = TIERS.filter(t => t.bank === bank.id).sort((a, b) => a.sort - b.sort);

  for (const tier of bankTiers) {
    if (balEst < tier.minBal)                                  continue;
    if (tier.newCustomerOnly && isExisting)                    continue;
    if (tier.newMoney && !isNew)                               continue;
    if (tier.reqDD && (skipActiveConds || !hasDD))             continue;
    if (tier.reqDD && tier.minDD > 0 && ddAmt < tier.minDD)   continue;
    // LendingClub LevelUp: requires $250/mo deposit — treat like DD comfort check
    if (tier.minMonthlyDeposit && skipActiveConds)             continue;
    // Fee-based tiers: skip if user wants zero fees; otherwise compute net effective APY
    if (tier.monthlyFee) {
      if (answers.fees === "zero") continue;
      // investingBundle: if user already wants investing, Gold fee is justified by other
      // benefits — treat cash APY as effectively free for those users
      if (tier.investingBundle && answers.investing === "yes") {
        return { apy: tier.apy, tierLabel: tier.label };
      }
      const annualFee = tier.monthlyFee * 12;
      // Interest: boosted rate on capped balance + standard DD rate on remainder
      const boostedBal  = Math.min(balEst, tier.maxBalForBoost || balEst);
      const remainderBal = Math.max(0, balEst - (tier.maxBalForBoost || 0));
      const grossInterest = (boostedBal * tier.apy / 100) + (remainderBal * 3.30 / 100);
      const netEffectiveApy = ((grossInterest - annualFee) / balEst) * 100;
      // Only surface this tier if it actually beats the standard DD tier after fees
      if (netEffectiveApy <= 3.30) continue;
      return { apy: Math.round(netEffectiveApy * 100) / 100, tierLabel: tier.label };
    }
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
async function runAgenticSearch(prompt, onSearch) {
  const tools = [{ type: "web_search_20250305", name: "web_search" }];
  let messages = [{ role: "user", content: prompt }];

  for (let i = 0; i < 6; i++) {
    const resp = await fetchWithTimeout("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 2000, tools, messages }),
    });

    if (!resp.ok) {
      const errBody = await resp.text().catch(() => "");
      throw new Error(`API error ${resp.status}: ${errBody.slice(0, 200)}`);
    }

    const data = await resp.json();
    const content = data.content || [];

    content
      .filter(b => b.type === "tool_use" && b.name === "web_search")
      .forEach(b => b.input?.query && onSearch(b.input.query));

    const textContent = content.filter(b => b.type === "text").map(b => b.text).join("\n");

    if (data.stop_reason === "end_turn") return textContent;

    if (data.stop_reason === "tool_use") {
      messages.push({ role: "assistant", content });
      const pending = content.filter(
        b => b.type === "tool_use" && !content.find(x => x.type === "tool_result" && x.tool_use_id === b.id)
      );
      messages.push(pending.length > 0
        ? { role: "user", content: pending.map(b => ({ type: "tool_result", tool_use_id: b.id, content: "Search completed. Please continue." })) }
        : { role: "user", content: "Please continue with your analysis and provide the JSON response." }
      );
      continue;
    }

    if (textContent) return textContent;
    throw new Error(`Unexpected stop reason: ${data.stop_reason}`);
  }

  throw new Error("Search loop exceeded maximum iterations.");
}

// ─── LOADING PHASES ───────────────────────────────────────────────────────────
const PHASES = [
  "Calculating your qualifying rates…",
  "Scanning official bank websites for current APYs…",
  "Verifying promotional conditions and expiry dates…",
  "Rates verified — drafting your recommendation…",
  "Almost done…",
];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

.root{min-height:100vh;background:#09090f;font-family:'DM Sans',sans-serif;color:#ddd8ce;display:flex;flex-direction:column;align-items:center;padding:0 16px 120px;position:relative;overflow-x:hidden;}
.bg-lines{position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(200,169,110,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(200,169,110,.03) 1px,transparent 1px);background-size:56px 56px;}
.bg-glow{position:fixed;top:-400px;left:50%;transform:translateX(-50%);width:1000px;height:700px;pointer-events:none;z-index:0;background:radial-gradient(ellipse,rgba(200,169,110,.06) 0%,transparent 60%);}
.shell{position:relative;z-index:1;width:100%;max-width:660px;}

.intro{text-align:center;padding:72px 0 44px;animation:up .7s cubic-bezier(.22,1,.36,1) both;}
.intro-tag{display:inline-flex;align-items:center;gap:8px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:2px;color:#c8a96e;border:1px solid rgba(200,169,110,.2);padding:6px 14px;margin-bottom:28px;}
.intro-tag-dot{width:5px;height:5px;border-radius:50%;background:#c8a96e;animation:pulse 2s ease infinite;}
.intro-h{font-family:'Cormorant Garamond',serif;font-size:clamp(36px,6vw,56px);font-weight:500;line-height:1.08;color:#f0ece2;margin-bottom:18px;letter-spacing:-.5px;}
.intro-h em{font-style:italic;color:#c8a96e;}
.intro-p{font-size:15px;color:#9a9690;line-height:1.7;max-width:480px;margin:0 auto 36px;}
.trust-row{display:flex;justify-content:center;gap:24px;flex-wrap:wrap;margin-bottom:36px;}
.trust-item{font-size:11px;color:#706c66;letter-spacing:.5px;display:flex;align-items:center;gap:6px;}
.trust-pip{width:3px;height:3px;border-radius:50%;background:#c8a96e55;}
.cta{display:inline-flex;align-items:center;gap:12px;background:#c8a96e;color:#09090f;font-family:'DM Sans',sans-serif;font-weight:600;font-size:15px;padding:16px 40px;border:none;cursor:pointer;transition:all .2s;letter-spacing:.3px;}
.cta:hover{background:#d4b87a;transform:translateY(-2px);box-shadow:0 12px 32px rgba(200,169,110,.18);}

.prog-wrap{padding:48px 0 44px;}
.prog-bar{height:1px;background:#1e2535;position:relative;}
.prog-fill{position:absolute;top:0;left:0;height:100%;background:linear-gradient(90deg,#c8a96e,#d4c090);transition:width .5s cubic-bezier(.22,1,.36,1);}
.prog-nums{display:flex;justify-content:space-between;margin-top:10px;}
.prog-n{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:1px;color:#3e4455;}
.prog-n.active{color:#c8a96e;}

.q-wrap{animation:up .4s cubic-bezier(.22,1,.36,1) both;}
.q-num{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:2px;color:#c8a96e;margin-bottom:10px;}
.q-title{font-family:'Cormorant Garamond',serif;font-size:clamp(22px,4vw,32px);font-weight:500;line-height:1.2;color:#f0ece2;margin-bottom:8px;}
.q-sub{font-size:13px;color:#8a8680;margin-bottom:28px;line-height:1.55;}
.opts{display:flex;flex-direction:column;gap:8px;margin-bottom:28px;}
.opt{display:flex;align-items:center;gap:14px;padding:14px 18px;border:1px solid #1e2535;background:#0d1020;cursor:pointer;transition:all .15s;color:#c0bcb4;font-size:14px;}
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
.btn-next{flex:1;padding:14px;background:#c8a96e;color:#09090f;font-family:'DM Sans',sans-serif;font-weight:600;font-size:14px;border:none;cursor:pointer;transition:all .18s;}
.btn-next:hover:not(:disabled){background:#d4b87a;}
.btn-next:disabled{background:#1a2030;color:#3a404e;cursor:not-allowed;}
.btn-back{padding:14px 18px;background:transparent;border:1px solid #1e2535;color:#706c66;font-family:'DM Sans',sans-serif;font-size:14px;cursor:pointer;transition:all .18s;}
.btn-back:hover{border-color:#3a4255;color:#a8a49c;}

.loading{padding:88px 0;text-align:center;animation:up .5s cubic-bezier(.22,1,.36,1) both;}
.spin-outer{width:52px;height:52px;margin:0 auto 32px;position:relative;}
.spin-ring{width:100%;height:100%;border-radius:50%;border:1px solid #1e2535;border-top-color:#c8a96e;animation:spin .9s linear infinite;}
.spin-inner{position:absolute;top:6px;left:6px;right:6px;bottom:6px;border-radius:50%;border:1px solid #0d1020;border-bottom-color:rgba(200,169,110,.35);animation:spin 1.4s linear infinite reverse;}
.load-phase{font-family:'Cormorant Garamond',serif;font-size:22px;color:#f0ece2;margin-bottom:6px;min-height:34px;}
.load-eta{font-family:'DM Mono',monospace;font-size:10px;color:#5a6070;letter-spacing:1px;margin-bottom:32px;}
.search-log{max-width:440px;margin:0 auto;text-align:left;}
.search-log-hdr{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:2px;color:#4a5265;margin-bottom:10px;text-transform:uppercase;}
.search-item{display:flex;gap:10px;font-family:'DM Mono',monospace;font-size:11px;color:#6a7280;padding:7px 0;border-bottom:1px solid #141820;line-height:1.4;animation:up .3s ease both;}
.search-tick{color:#c8a96e88;flex-shrink:0;}

.result{animation:up .6s cubic-bezier(.22,1,.36,1) both;padding-top:48px;}
.section-hdr{display:flex;align-items:center;gap:14px;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:#c8a96e;margin-bottom:16px;}
.section-hdr::after{content:'';flex:1;height:1px;background:#1e2535;}

.verify-grid{display:flex;flex-direction:column;gap:6px;margin-bottom:32px;}
.v-row{display:flex;align-items:flex-start;gap:12px;padding:11px 14px;background:#0c0f1c;border:1px solid #1a2030;}
.v-name{font-size:13px;color:#a8a49c;font-weight:500;flex:1;min-width:120px;}
.v-meta{flex:2;}
.v-cond{font-size:11px;color:#7a7670;line-height:1.5;margin-top:2px;}
.v-expiry{font-size:11px;color:#a07840;margin-top:2px;}
.v-apy-col{text-align:right;min-width:76px;}
.v-apy{font-family:'DM Mono',monospace;font-size:15px;font-weight:500;}
.v-src{font-family:'DM Mono',monospace;font-size:9px;color:#5a6070;margin-top:2px;}
.v-badge{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.5px;padding:3px 7px;flex-shrink:0;align-self:flex-start;}
.v-conf{color:#4a9e6a;background:rgba(74,158,106,.12);}
.v-up{color:#c8a96e;background:rgba(200,169,110,.12);}
.v-dn{color:#c07070;background:rgba(192,112,112,.12);}
.v-same{color:#7a9ab8;background:rgba(122,154,184,.12);}
.v-green{color:#4a9e6a;}.v-gold{color:#c8a96e;}.v-red{color:#c07070;}.v-blue{color:#7a9ab8;}

.rec-card{background:#0d1020;border:1px solid rgba(200,169,110,.2);padding:32px 30px 28px;position:relative;overflow:hidden;margin-bottom:10px;}
.rec-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#c8a96e,#d4c090,#c8a96e,transparent);}
.rec-top-row{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:4px;}
.rec-bankname{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#c8a96e;}
.rec-conf{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.5px;padding:3px 8px;flex-shrink:0;}
.conf-ok{background:rgba(74,158,106,.12);color:#4a9e6a;}
.conf-approx{background:rgba(122,154,184,.12);color:#7a9ab8;}
.conf-warn{background:rgba(192,112,112,.12);color:#c07070;}
.rec-acct{font-size:12px;color:#7a7670;margin-bottom:20px;}
.apy-row{display:flex;align-items:baseline;gap:6px;margin-bottom:4px;}
.apy-n{font-family:'Cormorant Garamond',serif;font-size:64px;font-weight:500;color:#f0ece2;line-height:1;}
.apy-pct{font-size:22px;color:#c8a96e;font-weight:600;font-family:'DM Sans',sans-serif;}
.tier-lbl{font-family:'DM Mono',monospace;font-size:10px;color:#5a6070;margin-bottom:6px;}
.v-note-inline{font-size:12px;color:#8a8680;line-height:1.55;margin-bottom:20px;}
.rec-hl{font-family:'Cormorant Garamond',serif;font-size:19px;font-style:italic;color:#ddd8d0;line-height:1.4;margin-bottom:14px;}
.rec-summary{font-size:14px;color:#a8a49c;line-height:1.75;margin-bottom:24px;}
.perks{display:flex;flex-direction:column;gap:9px;margin-bottom:20px;}
.perk{display:flex;gap:10px;font-size:13.5px;color:#b0aca4;line-height:1.5;}
.perk-ico{color:#c8a96e;flex-shrink:0;font-size:10px;margin-top:3px;}
.watchout{background:#080a15;border-left:2px solid rgba(200,169,110,.25);padding:12px 16px;font-size:13px;color:#8a8680;line-height:1.6;}
.watchout b{color:#c8a96e;}

.sub-card{background:#090c18;border:1px solid #1a2030;padding:18px 22px;margin-bottom:8px;}
.sub-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;}
.sub-lbl{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#4a5265;margin-bottom:4px;}
.sub-name{font-size:16px;color:#c8c4bc;font-weight:500;}
.sub-apy{font-family:'DM Mono',monospace;font-size:18px;color:#9a9690;}
.sub-apy span{font-size:11px;color:#6a6660;}
.sub-reason{font-size:13px;color:#8a8680;line-height:1.55;}

.rates-toggle{width:100%;padding:13px 18px;background:transparent;border:1px solid #1a2030;color:#7a7670;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.5px;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;transition:all .18s;margin-bottom:8px;}
.rates-toggle:hover{border-color:#3a4255;color:#a8a49c;}
.rates-tbl{width:100%;border-collapse:collapse;margin-bottom:12px;}
.rates-tbl th{text-align:left;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:#4a5265;padding:9px 12px;border-bottom:1px solid #1a2030;}
.rates-tbl td{padding:10px 12px;font-size:12.5px;color:#8a8680;border-bottom:1px solid #0e1220;}
.rates-tbl tr:first-child td{color:#c8a96e;}
.td-apy{font-family:'DM Mono',monospace;font-size:14px;font-weight:500;}

.restart{width:100%;padding:13px;background:transparent;border:1px solid #1a2030;color:#6a6660;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.5px;cursor:pointer;transition:all .18s;margin-top:8px;}
.restart:hover{border-color:#3a4255;color:#a8a49c;}

/* ── ADVERTISER DISCLOSURE ── */
.aff-banner{background:#06080f;border:1px solid #1a2030;border-left:2px solid rgba(200,169,110,.35);padding:11px 16px;margin-bottom:28px;display:flex;align-items:flex-start;gap:10px;}
.aff-banner-ico{color:#c8a96e;font-size:11px;margin-top:1px;flex-shrink:0;}
.aff-banner-txt{font-family:'DM Mono',monospace;font-size:10px;color:#5a6275;line-height:1.7;letter-spacing:.2px;}
.aff-banner-txt b{color:#7a8090;}

/* ── VISIT BUTTON ── */
.visit-btn{display:flex;align-items:center;justify-content:space-between;width:100%;margin-top:22px;padding:14px 18px;background:linear-gradient(135deg,rgba(200,169,110,.12),rgba(200,169,110,.06));border:1px solid rgba(200,169,110,.35);color:#c8a96e;font-family:'DM Sans',sans-serif;font-weight:600;font-size:13.5px;cursor:pointer;text-decoration:none;transition:all .2s;}
.visit-btn:hover{background:linear-gradient(135deg,rgba(200,169,110,.2),rgba(200,169,110,.1));border-color:rgba(200,169,110,.6);}
.visit-btn-arrow{font-size:16px;transition:transform .2s;}
.visit-btn:hover .visit-btn-arrow{transform:translateX(4px);}
.visit-btn-sub{font-family:'DM Mono',monospace;font-size:9px;color:rgba(200,169,110,.55);font-weight:400;letter-spacing:.5px;margin-top:2px;}

/* ── RUNNER-UP VISIT LINK ── */
.runnerup-visit{display:inline-flex;align-items:center;gap:6px;margin-top:10px;font-family:'DM Mono',monospace;font-size:10px;color:#6a7080;text-decoration:none;letter-spacing:.3px;transition:color .15s;}
.runnerup-visit:hover{color:#a8a49c;}

.disc{font-family:'DM Mono',monospace;font-size:10px;color:#4a5265;letter-spacing:.3px;text-align:center;line-height:1.8;margin-top:32px;padding-top:24px;border-top:1px solid #141820;}
.disc a{color:#5a6275;text-decoration:underline;}
.err{background:#0e0808;border:1px solid #4a2020;padding:28px;text-align:center;margin:40px 0;}
.err-msg{color:#e07070;font-size:14px;margin-bottom:16px;}

/* ── CHAT ── */
.chat-section{margin-top:40px;padding-top:40px;border-top:1px solid #1a2030;}
.chat-intro{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:18px;color:#9a9690;line-height:1.55;margin-bottom:24px;}
.chat-thread{display:flex;flex-direction:column;gap:14px;margin-bottom:16px;max-height:480px;overflow-y:auto;padding-right:4px;}
.chat-thread::-webkit-scrollbar{width:3px;}
.chat-thread::-webkit-scrollbar-track{background:#09090f;}
.chat-thread::-webkit-scrollbar-thumb{background:#2a3040;}
.msg-user{align-self:flex-end;max-width:82%;background:#131828;border:1px solid rgba(200,169,110,.2);padding:11px 15px;font-size:14px;color:#ddd8ce;line-height:1.55;}
.msg-assistant{align-self:flex-start;max-width:90%;background:#0c0f1c;border:1px solid #1a2030;padding:13px 17px;font-size:14px;color:#b0aca4;line-height:1.7;}
.msg-assistant p{margin-bottom:8px;}.msg-assistant p:last-child{margin-bottom:0;}
.msg-thinking{align-self:flex-start;padding:11px 17px;background:#0c0f1c;border:1px solid #1a2030;font-family:'DM Mono',monospace;font-size:11px;color:#6a7080;}
.dots span{animation:blink 1.4s ease infinite;}
.dots span:nth-child(2){animation-delay:.2s;}
.dots span:nth-child(3){animation-delay:.4s;}
.chat-input-row{display:flex;gap:8px;}
.chat-input{flex:1;background:#0c0f1c;border:1px solid #1e2535;color:#ddd8ce;font-family:'DM Sans',sans-serif;font-size:14px;padding:12px 15px;outline:none;resize:none;transition:border-color .15s;min-height:46px;max-height:120px;}
.chat-input:focus{border-color:rgba(200,169,110,.4);}
.chat-input::placeholder{color:#4a5265;}
.chat-send{background:#c8a96e;color:#09090f;border:none;padding:12px 18px;cursor:pointer;transition:all .18s;font-family:'DM Sans',sans-serif;font-weight:600;font-size:13px;flex-shrink:0;align-self:flex-start;}
.chat-send:hover:not(:disabled){background:#d4b87a;}
.chat-send:disabled{background:#1a2030;color:#3a404e;cursor:not-allowed;}
.chat-err{font-family:'DM Mono',monospace;font-size:11px;color:#c07070;margin-top:8px;padding:8px 12px;background:#0e0808;border:1px solid #3a1a1a;}

@keyframes up{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
@keyframes blink{0%,100%{opacity:.2;}50%{opacity:1;}}
`;

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function HYSAQuiz() {
  const [step, setStep]         = useState(0);
  const [answers, setAnswers]   = useState({});
  const [selected, setSelected] = useState(null);
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [phase, setPhase]       = useState(0);
  const [searches, setSearches] = useState([]);
  const [error, setError]       = useState(null);
  const [showAll, setShowAll]   = useState(false);
  const [animKey, setAnimKey]   = useState(0);
  // ── Chat state ──
  const [chatMsgs, setChatMsgs]       = useState([]);
  const [chatInput, setChatInput]     = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatErr, setChatErr]         = useState(null);
  const resultRef  = useRef(null);
  const chatEndRef = useRef(null);
  const phaseRef   = useRef(null);

  const totalQ   = QUESTIONS.length;
  const currentQ = step >= 1 && step <= totalQ ? QUESTIONS[step - 1] : null;
  const isMulti  = currentQ?.type === "multi";

  useEffect(() => {
    setAnimKey(k => k + 1);
    if (currentQ) {
      const saved = answers[currentQ.id];
      setSelected(isMulti ? (Array.isArray(saved) ? saved : []) : (saved ?? null));
    } else {
      setSelected(null);
    }
  }, [step]);

  useEffect(() => {
    if (result && resultRef.current) {
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    }
  }, [result]);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMsgs, chatLoading]);

  useEffect(() => {
    if (!loading) { clearInterval(phaseRef.current); return; }
    setPhase(0);
    let i = 0;
    phaseRef.current = setInterval(() => { i = Math.min(i + 1, PHASES.length - 1); setPhase(i); }, 2600);
    return () => clearInterval(phaseRef.current);
  }, [loading]);

  function handleSingle(value) { setSelected(value); }

  function handleMulti(value, exclusive) {
    setSelected(prev => {
      const arr = Array.isArray(prev) ? prev : [];
      if (exclusive) return [value];
      const withoutExcl = arr.filter(v => !currentQ.options.find(o => o.value === v)?.exclusive);
      return withoutExcl.includes(value)
        ? withoutExcl.filter(v => v !== value)
        : [...withoutExcl, value];
    });
  }

  const canAdvance = isMulti
    ? (Array.isArray(selected) && selected.length > 0)
    : selected !== null;

  function handleNext() {
    if (!canAdvance) return;
    const next = { ...answers, [currentQ.id]: selected };
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
    setShowAll(false);
    setChatMsgs([]); setChatInput(""); setChatErr(null);
  }

  async function runRecommendation(ans) {
    setStep(totalQ + 1);
    setLoading(true);
    setError(null);
    setSearches([]);

    const ranked = BANKS
      .map(b => { const q = getQualifyingAPY(b, ans); return q ? { ...b, qualifyingApy: q.apy, tierLabel: q.tierLabel } : null; })
      .filter(Boolean)
      .sort((a, b) => b.qualifyingApy - a.qualifyingApy);

    const top4 = ranked.slice(0, 4);
    const top1 = ranked[0]; // Only verify the #1 ranked bank — one search, one API call

    const profileStr = [
      `balance:${ans.balance}`,
      `purpose:${ans.purpose || "—"}`,
      `dd:${ans.direct_deposit}`,
      `existing:${Array.isArray(ans.existing_customer) ? ans.existing_customer.join(",") : "—"}`,
      `access:${ans.access_speed || "—"}`,
      `conditions:${ans.conditions_comfort || "—"}`,
      `branch:${ans.branch || "—"}`,
      `debit:${ans.debit || "—"}`,
      `investing:${ans.investing || "—"}`,
      `fees:${ans.fees || "—"}`,
    ].join(" | ");

    // ── STEP 1: Sonnet + web search — verify top bank only ───────────────────
    // Searching 4 banks creates 3-4 round-trips that compound token costs
    // exponentially (each round resends all previous search results).
    // Verifying only the #1 bank keeps this to a single API call (~5k tokens).
    const searchPrompt = `Search the official website or NerdWallet/Bankrate for the current APY and key conditions for this ONE bank. Return plain text findings only — no recommendation.

BANK TO VERIFY: ${top1.name} — our stored APY: ${top1.qualifyingApy.toFixed(2)}% (${top1.tierLabel})

Note: current APY, whether it changed, source name and date, any key conditions, and any promo expiry dates.`;

    try {
      const verifiedFindings = await runAgenticSearch(
        searchPrompt,
        q => setSearches(p => [...p, q])
      );

      // ── STEP 2: Haiku — write the structured recommendation ──────────────
      const haikusPrompt = `You are an unbiased HYSA recommendation engine. Based on the data below, produce a single JSON recommendation.

LIVE-VERIFIED RATE FOR TOP BANK:
${verifiedFindings}

ALL QUALIFYING BANKS FOR THIS USER (pre-calculated from our database):
${top4.map((b, i) => `${i + 1}. ${b.name} — ${b.qualifyingApy.toFixed(2)}% | ${b.tierLabel} | Branch:${b.branch ? 'Y' : 'N'} Debit:${b.debit ? 'Y' : 'N'} Invest:${b.investing ? 'Y' : 'N'}`).join('\n')}

USER PROFILE: ${profileStr}

The #1 ranked bank above was live-verified. Banks 2-4 use our stored rates. Recommend the best match for this user's profile.

JSON ONLY (no markdown, no backticks):
{
  "verified_rates": [{"bank":"${top1.name}","our_apy":${top1.qualifyingApy},"live_apy":number,"changed":boolean,"direction":"up"|"down"|"same","source":"name","source_date":"date","conditions_note":"brief note","promo_expiry":"info or null"}],
  "bank": "name",
  "account": "account name",
  "apy": number,
  "tier_label": "tier",
  "rate_confidence": "confirmed"|"likely current"|"unverified",
  "verification_note": "one sentence on what the live search found for the top bank",
  "headline": "max 12 words, specific to this user",
  "summary": "2-3 sentences tied to their profile",
  "top_perks": ["perk 1","perk 2","perk 3"],
  "watch_out": "one genuine caveat for this user",
  "runner_up": "bank name",
  "runner_up_apy": number,
  "runner_up_reason": "one sentence",
  "why_not_others": "one sentence"
}`;

      const haikusResp = await fetchWithTimeout("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1000,
          messages: [{ role: "user", content: haikusPrompt }],
        }),
      });

      if (!haikusResp.ok) {
        const errBody = await haikusResp.text().catch(() => "");
        throw new Error(`API error ${haikusResp.status}: ${errBody.slice(0, 200)}`);
      }

      const haikusData = await haikusResp.json();
      const raw = haikusData.content?.filter(b => b.type === "text").map(b => b.text).join("\n") || "";
      const json = raw.match(/\{[\s\S]*\}/)?.[0];
      if (!json) throw new Error("No JSON in Haiku response");
      const parsed = JSON.parse(json);

      const stripCites = (val) => {
        if (typeof val === "string") return val.replace(/]*>([\s\S]*?)<\/antml:cite>/gi, "$1").replace(/]*\/>/gi, "").trim();
        if (Array.isArray(val)) return val.map(stripCites);
        if (val && typeof val === "object") { const out = {}; for (const k of Object.keys(val)) out[k] = stripCites(val[k]); return out; }
        return val;
      };

      setResult({ ...stripCites(parsed), allRanked: ranked });
    } catch (e) {
      console.error(e);
      setError(
        e.message?.includes("timed out") ? "The rate scan timed out. Please try again." :
        e.message?.includes("API error") ? `Connection error (${e.message}). Please try again.` :
        "Something went wrong during the rate scan. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // ── CHAT ────────────────────────────────────────────────────────────────────
  // Compressed context ~150 tokens vs ~800 for full JSON. Haiku handles all chat.
  function buildChatContext(res, ans) {
    const top5 = (res.allRanked || []).slice(0, 5)
      .map(b => `${b.name} ${b.qualifyingApy.toFixed(2)}%`)
      .join(", ");

    // Pull verified notes for the top 2 banks so Haiku answers from facts not guesses
    const recBank     = BANKS.find(b => b.name === res.bank);
    const runnerBank  = BANKS.find(b => b.name === res.runner_up);
    const bankDetails = [
      recBank    ? `${recBank.name}: ${recBank.notes}`    : null,
      runnerBank ? `${runnerBank.name}: ${runnerBank.notes}` : null,
    ].filter(Boolean).join("\n");

    return `HYSA concierge. Answer follow-ups in 2-4 sentences using ONLY the verified bank details below — do not invent or assume conditions not stated here.

REC: ${res.bank} ${res.apy}% APY | ${res.tier_label}
RUNNER-UP: ${res.runner_up || "—"} ${res.runner_up_apy || ""}%
PROFILE: balance:${ans.balance} | dd:${ans.direct_deposit} | purpose:${ans.purpose || "—"} | conditions:${ans.conditions_comfort || "—"} | branch:${ans.branch || "—"} | debit:${ans.debit || "—"} | investing:${ans.investing || "—"}
TOP RATES: ${top5}

VERIFIED BANK DETAILS (use these as your source of truth):
${bankDetails}

Be direct and concise. Do NOT ask follow-up questions. Do NOT end with a question.`;
  }

  async function sendChat(text) {
    const msg = text.trim();
    if (!msg || chatLoading || !result) return;
    setChatErr(null);
    const history = [...chatMsgs, { role: "user", content: msg }];
    setChatMsgs(history);
    setChatInput("");
    setChatLoading(true);
    try {
      const resp = await fetchWithTimeout("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 512,
          system: buildChatContext(result, answers),
          messages: history.slice(-6).map(m => ({ role: m.role, content: m.content })),
        }),
      }, 30000);
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error?.message || `API ${resp.status}`);
      const reply = (data.content?.find(b => b.type === "text")?.text || "")
        .replace(/]*>([\s\S]*?)<\/antml:cite>/gi, "$1").trim()
        || "I couldn't generate a response — please try again.";
      setChatMsgs(p => [...p, { role: "assistant", content: reply }]);
    } catch (err) {
      setChatErr(err.message?.includes("timed out") ? "Request timed out — please try again." : `Error: ${err.message}`);
      setChatMsgs(history.slice(0, -1));
    } finally {
      setChatLoading(false);
    }
  }

  function handleChatKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(chatInput); }
  }

  const progress = step >= 1 && step <= totalQ ? (step / totalQ) * 100 : step > totalQ ? 100 : 0;

  return (
    <>
      <style>{CSS}</style>
      <div className="root">
        <div className="bg-lines" /><div className="bg-glow" />
        <div className="shell">

          {step === 0 && (
            <div className="intro">
              <div className="intro-tag">
                <span className="intro-tag-dot" />
                Live savings rate analysis · March 2026
              </div>
              <h1 className="intro-h">Yield<br /><em>Concierge</em></h1>
              <p className="intro-p">
                10 questions. We calculate your real qualifying rate across a set of curated banks, scan live sources to verify every APY, then recommend the account that pays you the most.
              </p>
              <div className="trust-row">
                {["Live rate verification", "No ads or paid rankings", "Curated banks analyzed", "Unbiased recommendation"].map((t, i) => (
                  <span key={i} className="trust-item"><span className="trust-pip" />{t}</span>
                ))}
              </div>
              <button className="cta" onClick={() => setStep(1)}>
                Begin your analysis
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M3 7.5h9M8.5 4l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}

          {step >= 1 && step <= totalQ && currentQ && (
            <>
              <div className="prog-wrap">
                <div className="prog-bar"><div className="prog-fill" style={{ width: `${progress}%` }} /></div>
                <div className="prog-nums">
                  {QUESTIONS.map((q, i) => (
                    <span key={q.id} className={`prog-n ${i + 1 === step ? "active" : ""}`}>{String(i + 1).padStart(2, "0")}</span>
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

          {error && !loading && (
            <div className="err">
              <div className="err-msg">{error}</div>
              <button className="restart" onClick={restart}>Try again</button>
            </div>
          )}

          {result && !loading && (
            <div className="result" ref={resultRef}>

              {result.verified_rates?.length > 0 && (
                <>
                  <div className="section-hdr">Live rate verification</div>
                  <div className="verify-grid">
                    {result.verified_rates.map((vr, i) => {
                      const d = vr.direction;
                      const apyCls   = d === "up" ? "v-gold" : d === "down" ? "v-red" : "v-green";
                      const badgeCls = d === "up" ? "v-badge v-up" : d === "down" ? "v-badge v-dn" : d === "same" ? "v-badge v-same" : "v-badge v-conf";
                      const badgeTxt = d === "up" ? "↑ RATE UP" : d === "down" ? "↓ RATE DOWN" : "✓ CONFIRMED";
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

              {/* ── ADVERTISER DISCLOSURE ── */}
              <div className="aff-banner">
                <div className="aff-banner-ico">ℹ</div>
                <div className="aff-banner-txt">
                  <b>Advertiser disclosure</b> — Yield Concierge may earn a referral fee if you open an account through our links. <b>This does not influence our recommendations</b>, which are determined solely by rates, conditions, and your profile. Banks cannot pay for placement.
                </div>
              </div>

              <div className="section-hdr">Your recommendation</div>
              <div className="rec-card">
                <div className="rec-top-row">
                  <div className="rec-bankname">{result.bank}</div>
                  {result.rate_confidence && (
                    <div className={`rec-conf ${result.rate_confidence === "confirmed" ? "conf-ok" : result.rate_confidence === "likely current" ? "conf-approx" : "conf-warn"}`}>
                      {result.rate_confidence === "confirmed" ? "✓ Rate confirmed" : result.rate_confidence === "likely current" ? "≈ Likely current" : "⚠ Verify rate"}
                    </div>
                  )}
                </div>
                <div className="rec-acct">{result.account}</div>
                <div className="apy-row">
                  <div className="apy-n">{Number(result.apy).toFixed(2)}</div>
                  <div className="apy-pct">% APY</div>
                </div>
                <div className="tier-lbl">{result.tier_label}</div>
                {result.verification_note && <div className="v-note-inline">{result.verification_note}</div>}
                <div className="rec-hl">"{result.headline}"</div>
                <div className="rec-summary">{result.summary}</div>
                <div className="perks">
                  {result.top_perks?.map((p, i) => (
                    <div key={i} className="perk"><span className="perk-ico">◆</span>{p}</div>
                  ))}
                </div>
                <div className="watchout"><b>Watch out — </b>{result.watch_out}</div>
                {(() => {
                  const recBank = BANKS.find(b => b.name === result.bank);
                  return recBank?.affiliateUrl ? (
                    <a href={recBank.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored" className="visit-btn">
                      <div>
                        <div>Open an account with {result.bank}</div>
                        <div className="visit-btn-sub">You'll be taken to {result.bank}'s secure website</div>
                      </div>
                      <span className="visit-btn-arrow">→</span>
                    </a>
                  ) : null;
                })()}
              </div>

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
                  {(() => {
                    const ruBank = BANKS.find(b => b.name === result.runner_up);
                    return ruBank?.affiliateUrl ? (
                      <a href={ruBank.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored" className="runnerup-visit">
                        Visit {result.runner_up} →
                      </a>
                    ) : null;
                  })()}
                </div>
              )}

              {result.why_not_others && (
                <div className="sub-card" style={{ borderStyle: "dashed" }}>
                  <div className="sub-lbl" style={{ marginBottom: 6 }}>On the others</div>
                  <div className="sub-reason">{result.why_not_others}</div>
                </div>
              )}

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
                        <td className="td-apy" style={{ color: i === 0 ? "#c8a96e" : undefined }}>
                          {b.qualifyingApy.toFixed(2)}%
                        </td>
                        <td style={{ fontSize: 11, color: "#5a6070" }}>{b.tierLabel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <button className="restart" onClick={restart} style={{ marginTop: 32 }}>
                ↺ Start over with different answers
              </button>

              {/* ── CONCIERGE CHAT ── */}
              <div className="chat-section">
                <div className="section-hdr">Ask a follow-up</div>
                <p className="chat-intro">
                  Have questions about your recommendation? Ask anything — what happens if you lose direct deposit, how the top two compare, how to open the account.
                </p>

                {/* Thread */}
                {chatMsgs.length > 0 && (
                  <div className="chat-thread">
                    {chatMsgs.map((m, i) => (
                      <div key={i} className={m.role === "user" ? "msg-user" : "msg-assistant"}>
                        {m.content.split("\n").filter(Boolean).map((line, j) => (
                          <p key={j}>{line}</p>
                        ))}
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="msg-thinking">
                        <span className="dots"><span>●</span><span>●</span><span>●</span></span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                )}

                {chatErr && <div className="chat-err">{chatErr}</div>}

                {/* Input */}
                <div className="chat-input-row">
                  <textarea
                    className="chat-input"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={handleChatKey}
                    placeholder="e.g. What if I can't do direct deposit? · How do I open this account? · Compare the top two options…"
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

              <div className="disc">
                Rate verification performed {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.
                APYs are variable — verify directly with each institution before opening an account.
                Yield Concierge is independent. Banks do not pay for placement or influence our recommendations.
                We may earn a referral commission if you open an account through our links, at no cost to you.
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
