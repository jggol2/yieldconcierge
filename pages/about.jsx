import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

const css = `
  .about-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(200,169,110,.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(200,169,110,.025) 1px, transparent 1px);
    background-size: 56px 56px;
  }
  .about-page { position: relative; z-index: 1; }

  /* ── HERO ── */
  .about-hero {
    padding: 96px 40px 80px;
    max-width: 860px; margin: 0 auto;
    border-bottom: 1px solid #1a2030;
  }
  .about-eyebrow {
    font-family: 'DM Mono', monospace; font-size: 9px;
    letter-spacing: 3px; text-transform: uppercase; color: #c8a96e;
    margin-bottom: 20px; display: flex; align-items: center; gap: 14px;
  }
  .about-eyebrow::after { content: ''; width: 40px; height: 1px; background: #1e2535; }
  .about-h {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(40px, 6vw, 64px); font-weight: 500;
    line-height: 1.06; letter-spacing: -.5px;
    color: #f0ece2; margin-bottom: 28px;
  }
  .about-h em { font-style: italic; color: #c8a96e; }
  .about-lead {
    font-size: 17px; color: #9a9690; line-height: 1.75;
    max-width: 640px;
  }

  /* ── BODY ── */
  .about-body {
    max-width: 860px; margin: 0 auto;
    padding: 0 40px;
  }
  .about-section {
    padding: 72px 0;
    border-bottom: 1px solid #1a2030;
  }
  .about-section:last-child { border-bottom: none; }
  .about-section-label {
    font-family: 'DM Mono', monospace; font-size: 9px;
    letter-spacing: 3px; text-transform: uppercase; color: #4a5265;
    margin-bottom: 20px;
  }
  .about-section-h {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(26px, 3.5vw, 36px); font-weight: 500;
    color: #f0ece2; margin-bottom: 20px; line-height: 1.2;
  }
  .about-section-h em { font-style: italic; color: #c8a96e; }
  .about-p {
    font-size: 15px; color: #8a8680; line-height: 1.8; margin-bottom: 18px;
    max-width: 680px;
  }
  .about-p:last-child { margin-bottom: 0; }
  .about-p strong { color: #b0aca4; font-weight: 500; }

  /* ── METHODOLOGY GRID ── */
  .method-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 2px;
    margin-top: 36px;
  }
  .method-card {
    background: #0d1020; border: 1px solid #1a2030;
    padding: 28px 26px;
  }
  .method-n {
    font-family: 'DM Mono', monospace; font-size: 10px;
    letter-spacing: 1px; color: #c8a96e; margin-bottom: 12px;
  }
  .method-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px; font-weight: 500; color: #ddd8ce;
    margin-bottom: 10px;
  }
  .method-body {
    font-size: 13px; color: #706c66; line-height: 1.7;
  }

  /* ── BANKS LIST ── */
  .banks-note {
    background: #0d1020; border: 1px solid #1a2030;
    padding: 28px 32px; margin-top: 32px;
  }
  .banks-note-label {
    font-family: 'DM Mono', monospace; font-size: 9px;
    letter-spacing: 2px; text-transform: uppercase; color: #4a5265;
    margin-bottom: 16px;
  }
  .banks-grid {
    display: flex; flex-wrap: wrap; gap: 8px;
  }
  .bank-tag {
    font-family: 'DM Mono', monospace; font-size: 10px;
    letter-spacing: .5px; color: #8a8680;
    border: 1px solid #1e2535; padding: 5px 11px;
  }

  /* ── PRINCIPLES ── */
  .principles {
    display: flex; flex-direction: column; gap: 0; margin-top: 32px;
  }
  .principle {
    display: flex; gap: 20px; align-items: flex-start;
    padding: 20px 0; border-bottom: 1px solid #1a2030;
  }
  .principle:last-child { border-bottom: none; }
  .principle-ico { color: #c8a96e; font-size: 11px; flex-shrink: 0; margin-top: 3px; }
  .principle-title {
    font-size: 14px; font-weight: 500; color: #c8c4bc;
    margin-bottom: 4px;
  }
  .principle-body { font-size: 13px; color: #706c66; line-height: 1.65; }

  /* ── CTA ── */
  .about-cta {
    text-align: center; padding: 80px 40px;
    background: #0d1020; border-top: 1px solid #1a2030;
    margin-top: 0;
  }
  .about-cta-h {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 4vw, 40px); font-weight: 500;
    color: #f0ece2; margin-bottom: 14px;
  }
  .about-cta-h em { font-style: italic; color: #c8a96e; }
  .about-cta-p {
    font-size: 14px; color: #706c66; margin-bottom: 32px;
    max-width: 380px; margin-left: auto; margin-right: auto; line-height: 1.65;
  }
  .btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    background: #c8a96e; color: #09090f;
    font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 15px;
    padding: 14px 32px; border: none; cursor: pointer;
    transition: all .2s; text-decoration: none;
  }
  .btn-primary:hover { background: #d4b87a; transform: translateY(-1px); }

  @media (max-width: 640px) {
    .about-hero { padding: 64px 20px 56px; }
    .about-body { padding: 0 20px; }
    .method-grid { grid-template-columns: 1fr; }
    .about-cta { padding: 60px 20px; }
  }
`;

const BANKS = [
  "SoFi","Wealthfront","Marcus by Goldman Sachs","Betterment","Axos Bank",
  "Openbank","Bread Savings","EverBank","PNC Bank","Capital One",
  "Ally Bank","CIT Bank","HSBC","American Express","Barclays",
  "E*TRADE","Popular Direct","Bask Bank","Truist","Chase"
];

export default function About() {
  return (
    <Layout>
      <Head>
        <title>About — Yield Concierge</title>
        <meta name="description" content="Yield Concierge is an independent, unbiased HYSA advisor. No paid placements. Live rate verification. A concierge experience built to help you find the savings account that actually pays you the most." />
      </Head>
      <style>{css}</style>
      <div className="about-bg" />

      <div className="about-page">
        <div className="about-hero">
          <div className="about-eyebrow">About</div>
          <h1 className="about-h">
            Built for the saver who<br />wants the <em>real</em> answer
          </h1>
          <p className="about-lead">
            Yield Concierge is an independent savings rate advisor. We don't display ads and we don't show you a ranked list of whoever paid the most. We tell you the rate you'd actually earn — and why.
          </p>
        </div>

        <div className="about-body">

          {/* ── MISSION ── */}
          <div className="about-section">
            <div className="about-section-label">Our mission</div>
            <h2 className="about-section-h">Why we built this</h2>
            <p className="about-p">
              High-yield savings accounts are one of the simplest ways to earn meaningfully more on money you already have. But the tools most people use to find them — such as comparison sites — are pay-to-play platforms. Banks bid for top placement. The "recommended" account isn't the best one for you; it's the one that paid the highest referral fee.
            </p>
            <p className="about-p">
              The problem runs deeper than just rankings. Most comparison sites show a bank's <strong>headline APY</strong> — the maximum rate achievable under the best possible conditions. But that's rarely what you'd actually earn. Many top-rate accounts require specific direct deposit amounts, minimum balances, debit card usage, or are only available to new customers. If you don't meet those conditions, the real rate can be dramatically lower.
            </p>
            <p className="about-p">
              Yield Concierge was built to solve both problems. We calculate the rate you personally qualify for at every bank — then verify it live before we say a word.
            </p>
          </div>

          {/* ── METHODOLOGY ── */}
          <div className="about-section">
            <div className="about-section-label">How it works</div>
            <h2 className="about-section-h">The <em>methodology</em></h2>
            <p className="about-p">
              Every recommendation runs through a four-stage process designed to give you a number you can actually act on.
            </p>
            <div className="method-grid">
              {[
                {
                  n: "Stage 01",
                  title: "Profile assessment",
                  body: "10 questions capture your balance, purpose, direct deposit setup, access speed requirements, existing bank relationships, conditions tolerance, and feature needs."
                },
                {
                  n: "Stage 02",
                  title: "Qualifying APY calculation",
                  body: "We walk every bank's rate tier structure against your profile — checking balance thresholds, DD requirements, new-money rules, and new-customer eligibility — to find the rate you'd actually earn."
                },
                {
                  n: "Stage 03",
                  title: "Live rate verification",
                  body: "Before surfacing any recommendation, we search official bank websites and trusted aggregators in real time to confirm current APYs, flag rate changes, and surface promo expiry dates."
                },
                {
                  n: "Stage 04",
                  title: "Concierge recommendation",
                  body: "A single recommendation with full context: the verified APY, the qualifying tier, key perks, an honest caveat, your runner-up, and a live chat to answer any follow-up question."
                }
              ].map((m) => (
                <div key={m.n} className="method-card">
                  <div className="method-n">{m.n}</div>
                  <div className="method-title">{m.title}</div>
                  <div className="method-body">{m.body}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── BANKS ── */}
          <div className="about-section">
            <div className="about-section-label">Coverage</div>
            <h2 className="about-section-h">Banks we track</h2>
            <p className="about-p">
              Our database covers 20 curated institutions — a mix of online-only fintechs, digital bank subsidiaries, investment platforms with cash accounts, and select traditional banks included for users who specifically need branch access. Banks are chosen for relevance and rate competitiveness, not for any commercial relationship.
            </p>
            <p className="about-p">
              Each bank's tier structure is maintained manually, with the full rate sheet updated after every Federal Reserve meeting and whenever a significant rate change is detected. Promotional rates include expiry dates so nothing is recommended past its window.
            </p>
            <div className="banks-note">
              <div className="banks-note-label">Currently tracked</div>
              <div className="banks-grid">
                {BANKS.map(b => (
                  <span key={b} className="bank-tag">{b}</span>
                ))}
              </div>
            </div>
          </div>

          {/* ── PRINCIPLES ── */}
          <div className="about-section">
            <div className="about-section-label">Our principles</div>
            <h2 className="about-section-h">What we stand for</h2>
            <div className="principles">
              {[
                {
                  title: "No paid placements, ever",
                  body: "No bank pays to appear in Yield Concierge, pays for a higher ranking, or pays for a recommendation. The only thing that determines who we recommend is your profile and the math."
                },
                {
                  title: "Verified at session time, not last month",
                  body: "Rate data has a shelf life. We maintain a curated database as our baseline, but every recommendation triggers a live verification scan before we show you a number."
                },
                {
                  title: "Your qualifying rate, not the headline rate",
                  body: "We factor in your direct deposit amount, balance, existing customer status, conditions comfort, and access needs. A 4.21% rate that requires $1,500/month DD is shown as 1.00% to someone who can't meet that condition."
                },
                {
                  title: "Transparency about limitations",
                  body: "Every recommendation includes a genuine caveat — something to watch out for. Promo expirations are flagged. Rate confidence levels are shown. We'd rather you know the full picture than feel misled."
                },
                {
                  title: "No pressure, no upsells",
                  body: "There is no email capture, no account required, and nothing to buy. You come, you get your recommendation, you go open the account. That's it."
                }
              ].map((p) => (
                <div key={p.title} className="principle">
                  <span className="principle-ico">◆</span>
                  <div>
                    <div className="principle-title">{p.title}</div>
                    <div className="principle-body">{p.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── DISCLAIMER ── */}
          <div className="about-section">
            <div className="about-section-label">Disclaimer</div>
            <h2 className="about-section-h">A note on accuracy</h2>
            <p className="about-p">
              APYs are variable and change frequently. While we verify rates at the time of each session, we cannot guarantee that a rate hasn't changed between your session and when you go to open an account. Always confirm the current APY directly on the bank's official website before making any financial decision.
            </p>
            <p className="about-p">
              Yield Concierge does not provide financial advice. Our recommendations are informational and based on the profile you provide. Your actual qualifying rate, account features, and eligibility may differ from what is shown. We are not responsible for decisions made based on information provided through this tool.
            </p>
            <p className="about-p">
              This tool is independent. We have no commercial relationship with any of the banks in our database.
            </p>
          </div>

        </div>

        <div className="about-cta">
          <h2 className="about-cta-h">Ready to find your <em>best rate?</em></h2>
          <p className="about-cta-p">Takes about 2 minutes. No sign-up required.</p>
          <Link href="/find" className="btn-primary">
            Begin your analysis →
          </Link>
        </div>
      </div>
    </Layout>
  );
}
