import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

const css = `
  /* ── BG ── */
  .home-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(200,169,110,.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(200,169,110,.025) 1px, transparent 1px);
    background-size: 56px 56px;
  }
  .home-glow {
    position: fixed; top: -300px; left: 50%; transform: translateX(-50%);
    width: 900px; height: 700px; pointer-events: none; z-index: 0;
    background: radial-gradient(ellipse, rgba(200,169,110,.07) 0%, transparent 60%);
  }

  .page { position: relative; z-index: 1; }

  /* ── HERO ── */
  .hero {
    min-height: calc(100vh - 64px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 80px 24px 100px;
  }
  .hero-tag {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 2px;
    color: #c8a96e; border: 1px solid rgba(200,169,110,.2);
    padding: 6px 16px; margin-bottom: 32px;
  }
  .hero-tag-dot {
    width: 5px; height: 5px; border-radius: 50%; background: #c8a96e;
    animation: pulse 2s ease infinite;
  }
  .hero-h {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(52px, 8vw, 88px);
    font-weight: 500; line-height: 1.0; letter-spacing: -1px;
    color: #f0ece2; margin-bottom: 10px;
  }
  .hero-h em { font-style: italic; color: #c8a96e; }
  .hero-h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(24px, 4vw, 38px);
    font-weight: 400; font-style: italic;
    color: #706c66; margin-bottom: 28px; line-height: 1.2;
  }
  .hero-p {
    font-size: 16px; color: #8a8680; line-height: 1.75;
    max-width: 520px; margin: 0 auto 44px;
  }
  .hero-cta-row {
    display: flex; align-items: center; gap: 16px; flex-wrap: wrap; justify-content: center;
    margin-bottom: 56px;
  }
  .btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    background: #c8a96e; color: #09090f;
    font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 15px;
    padding: 15px 36px; border: none; cursor: pointer;
    transition: all .2s; letter-spacing: .3px; text-decoration: none;
  }
  .btn-primary:hover { background: #d4b87a; transform: translateY(-1px); box-shadow: 0 10px 28px rgba(200,169,110,.18); }
  .btn-secondary {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: #706c66;
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    padding: 15px 24px; border: 1px solid #1e2535;
    cursor: pointer; transition: all .2s; text-decoration: none;
  }
  .btn-secondary:hover { border-color: #3a4255; color: #a8a49c; }

  .hero-stats {
    display: flex; align-items: center; gap: 32px; flex-wrap: wrap; justify-content: center;
  }
  .stat {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
  }
  .stat-n {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px; font-weight: 500; color: #c8a96e; line-height: 1;
  }
  .stat-l {
    font-family: 'DM Mono', monospace; font-size: 9px;
    letter-spacing: 1.5px; text-transform: uppercase; color: #4a5265;
  }
  .stat-divider { width: 1px; height: 36px; background: #1e2535; }

  /* ── FEATURES ── */
  .features {
    padding: 100px 40px;
    max-width: 1100px; margin: 0 auto;
  }
  .section-eyebrow {
    font-family: 'DM Mono', monospace; font-size: 9px;
    letter-spacing: 3px; text-transform: uppercase; color: #c8a96e;
    margin-bottom: 16px;
    display: flex; align-items: center; gap: 14px;
  }
  .section-eyebrow::after { content: ''; flex: 1; height: 1px; background: #1e2535; max-width: 64px; }
  .features-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(32px, 4vw, 48px); font-weight: 500; line-height: 1.15;
    color: #f0ece2; margin-bottom: 64px; max-width: 540px;
  }
  .features-title em { font-style: italic; color: #c8a96e; }
  .features-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px;
  }
  .feature-card {
    background: #0d1020; padding: 36px 32px;
    border: 1px solid #1a2030;
    transition: border-color .2s;
  }
  .feature-card:hover { border-color: rgba(200,169,110,.2); }
  .feature-num {
    font-family: 'DM Mono', monospace; font-size: 10px;
    letter-spacing: 1px; color: #c8a96e; margin-bottom: 20px;
  }
  .feature-icon {
    font-size: 22px; margin-bottom: 16px; color: #c8a96e;
  }
  .feature-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 500; color: #ddd8ce;
    margin-bottom: 12px; line-height: 1.2;
  }
  .feature-body {
    font-size: 13.5px; color: #706c66; line-height: 1.72;
  }

  /* ── HOW IT WORKS ── */
  .how {
    padding: 100px 40px;
    max-width: 1100px; margin: 0 auto;
    border-top: 1px solid #1a2030;
  }
  .how-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center;
  }
  .how-steps {
    display: flex; flex-direction: column; gap: 0;
  }
  .how-step {
    display: flex; gap: 24px;
    padding: 28px 0;
    border-bottom: 1px solid #1a2030;
  }
  .how-step:first-child { padding-top: 0; }
  .how-step:last-child { border-bottom: none; }
  .step-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 40px; font-weight: 500;
    color: rgba(200,169,110,.2); line-height: 1;
    flex-shrink: 0; width: 44px;
  }
  .step-content {}
  .step-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 500;
    color: #ddd8ce; margin-bottom: 8px;
  }
  .step-body {
    font-size: 13.5px; color: #706c66; line-height: 1.7;
  }

  .how-aside {
    background: #0d1020; border: 1px solid rgba(200,169,110,.15);
    padding: 40px 36px; position: relative; overflow: hidden;
  }
  .how-aside::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, #c8a96e, transparent);
  }
  .aside-label {
    font-family: 'DM Mono', monospace; font-size: 9px;
    letter-spacing: 2px; text-transform: uppercase; color: #4a5265;
    margin-bottom: 24px;
  }
  .aside-quote {
    font-family: 'Cormorant Garamond', serif;
    font-size: 21px; font-style: italic; font-weight: 400;
    color: #c8c4bc; line-height: 1.55; margin-bottom: 28px;
  }
  .aside-points {
    display: flex; flex-direction: column; gap: 12px;
  }
  .aside-point {
    display: flex; gap: 10px; font-size: 13px; color: #8a8680; line-height: 1.5;
  }
  .aside-point-ico { color: #c8a96e; flex-shrink: 0; font-size: 10px; margin-top: 2px; }

  /* ── DIFFERENTIATOR ── */
  .diff {
    padding: 100px 40px;
    max-width: 1100px; margin: 0 auto;
    border-top: 1px solid #1a2030;
  }
  .diff-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 2px; margin-top: 48px;
  }
  .diff-card {
    padding: 32px; border: 1px solid #1a2030; background: #090c18;
  }
  .diff-card.them .diff-card-label { color: #5a6070; }
  .diff-card.us   .diff-card-label { color: #c8a96e; }
  .diff-card-label {
    font-family: 'DM Mono', monospace; font-size: 9px;
    letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px;
  }
  .diff-row {
    display: flex; gap: 12px; align-items: flex-start;
    padding: 10px 0; border-bottom: 1px solid #1a2030;
    font-size: 13.5px; line-height: 1.5;
  }
  .diff-row:last-child { border-bottom: none; padding-bottom: 0; }
  .diff-card.them .diff-row { color: #4a5265; }
  .diff-card.us   .diff-row { color: #9a9690; }
  .diff-ico-bad  { color: #5a4040; flex-shrink: 0; margin-top: 1px; }
  .diff-ico-good { color: #c8a96e; flex-shrink: 0; margin-top: 1px; }

  /* ── BOTTOM CTA ── */
  .bottom-cta {
    text-align: center;
    padding: 120px 40px;
    border-top: 1px solid #1a2030;
    background: linear-gradient(to bottom, transparent, rgba(200,169,110,.025), transparent);
  }
  .bottom-cta-pre {
    font-family: 'DM Mono', monospace; font-size: 9px;
    letter-spacing: 3px; text-transform: uppercase; color: #4a5265;
    margin-bottom: 20px;
  }
  .bottom-cta-h {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(36px, 5vw, 56px); font-weight: 500; line-height: 1.1;
    color: #f0ece2; margin-bottom: 16px;
  }
  .bottom-cta-h em { font-style: italic; color: #c8a96e; }
  .bottom-cta-p {
    font-size: 15px; color: #706c66; margin-bottom: 40px; max-width: 400px;
    margin-left: auto; margin-right: auto; line-height: 1.65;
  }

  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:.4;} }

  @media (max-width: 900px) {
    .features-grid { grid-template-columns: 1fr 1fr; }
    .how-grid { grid-template-columns: 1fr; gap: 48px; }
    .diff-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 600px) {
    .features { padding: 64px 20px; }
    .features-grid { grid-template-columns: 1fr; }
    .how { padding: 64px 20px; }
    .diff { padding: 64px 20px; }
    .bottom-cta { padding: 80px 20px; }
    .hero { padding: 60px 20px 80px; }
    .stat-divider { display: none; }
  }
`;

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Yield Concierge — Find Your Best High-Yield Savings Rate</title>
      </Head>
      <style>{css}</style>
      <div className="home-bg" />
      <div className="home-glow" />

      <div className="page">
        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-tag">
            <span className="hero-tag-dot" />
            Live savings rate analysis · March 2026
          </div>
          <h1 className="hero-h">Yield</h1>
          <h1 className="hero-h"><em>Concierge</em></h1>
          <h2 className="hero-h2">Your money deserves a better rate</h2>
          <p className="hero-p">
            We calculate your real qualifying APY across a curated set of banks, verify every rate live, then recommend the one account that pays you the most — based on how you actually bank.
          </p>
          <div className="hero-cta-row">
            <Link href="/find" className="btn-primary">
              Find my best rate
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M3 7.5h9M8.5 4l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/about" className="btn-secondary">
              How it works →
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-n">20+</span>
              <span className="stat-l">Banks tracked</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-n">Live</span>
              <span className="stat-l">Rate verification</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-n">$0</span>
              <span className="stat-l">Paid placements</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-n">10</span>
              <span className="stat-l">Questions</span>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="features">
          <div className="section-eyebrow">What we do</div>
          <h2 className="features-title">
            Not a comparison site.<br />A <em>concierge</em>.
          </h2>
          <div className="features-grid">
            {[
              {
                num: "01",
                icon: "◆",
                title: "Your actual qualifying rate",
                body: "We don't show you a bank's headline APY. We calculate the rate you would personally earn — based on your balance, direct deposit setup, new-customer status, and conditions you're willing to meet."
              },
              {
                num: "02",
                icon: "◈",
                title: "Live rate verification",
                body: "Before recommending anything, we scan official bank websites and trusted aggregators in real time. If a rate has changed since our last update, we catch it and flag it before it affects your decision."
              },
              {
                num: "03",
                icon: "◉",
                title: "Ask anything, refine anything",
                body: "After your recommendation, a concierge chat opens with full context on your profile and every verified rate. Ask what happens if you can't do direct deposit. Compare two banks in detail. Get exactly the answer you need."
              }
            ].map((f) => (
              <div key={f.num} className="feature-card">
                <div className="feature-num">{f.num}</div>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-body">{f.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="how">
          <div className="section-eyebrow">The process</div>
          <div className="how-grid">
            <div className="how-steps">
              {[
                {
                  n: "1",
                  title: "Answer 10 questions",
                  body: "Your balance, purpose, direct deposit situation, access needs, and account preferences. Takes about 2 minutes."
                },
                {
                  n: "2",
                  title: "We verify rates live",
                  body: "While you wait, we search official bank websites and trusted sources to confirm every APY for your top qualifying options."
                },
                {
                  n: "3",
                  title: "Get your recommendation",
                  body: "One bank, with the exact APY you'd earn, why it was chosen, and honest caveats — plus your full qualifying rate table."
                },
                {
                  n: "4",
                  title: "Refine with the concierge",
                  body: "Ask follow-up questions in plain English. Change an assumption, compare two options, or get the exact steps to open your account."
                }
              ].map((s) => (
                <div key={s.n} className="how-step">
                  <div className="step-num">{s.n}</div>
                  <div className="step-content">
                    <div className="step-title">{s.title}</div>
                    <div className="step-body">{s.body}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="how-aside">
              <div className="aside-label">Why this is different</div>
              <div className="aside-quote">
                "Most comparison sites show you the highest advertised rate. We show you the rate you'd actually earn — then let you ask questions until you're sure."
              </div>
              <div className="aside-points">
                {[
                  "No bank pays for placement or recommendation",
                  "Rates verified at the time of your session",
                  "Promo expiry dates and conditions surfaced automatically",
                  "Existing-customer status strips promotions you don't qualify for"
                ].map((p, i) => (
                  <div key={i} className="aside-point">
                    <span className="aside-point-ico">◆</span>
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── DIFFERENTIATOR ── */}
        <section className="diff">
          <div className="section-eyebrow">The difference</div>
          <h2 className="features-title">
            Why not just use<br /><em>Bankrate or NerdWallet?</em>
          </h2>
          <div className="diff-grid">
            <div className="diff-card them">
              <div className="diff-card-label">Comparison sites</div>
              {[
                "Show rates paid for by banks",
                "Display headline APY, not your qualifying rate",
                "No verification — rates may be weeks old",
                "Can't account for your direct deposit or balance tier",
                "No follow-up — you're on your own after the list"
              ].map((t, i) => (
                <div key={i} className="diff-row">
                  <span className="diff-ico-bad">✕</span>{t}
                </div>
              ))}
            </div>
            <div className="diff-card us">
              <div className="diff-card-label">Yield Concierge</div>
              {[
                "Zero paid placements — independence guaranteed",
                "Calculates your personal qualifying APY per bank",
                "Scans live sources before every recommendation",
                "Accounts for DD amount, balance, promo eligibility",
                "Concierge chat to answer every follow-up question"
              ].map((t, i) => (
                <div key={i} className="diff-row">
                  <span className="diff-ico-good">◆</span>{t}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="bottom-cta">
          <div className="bottom-cta-pre">Ready?</div>
          <h2 className="bottom-cta-h">
            Find your <em>best rate</em><br />in under 3 minutes
          </h2>
          <p className="bottom-cta-p">
            No sign-up. No email. No ads. Just your recommendation.
          </p>
          <Link href="/find" className="btn-primary">
            Begin your analysis →
          </Link>
        </section>
      </div>
    </Layout>
  );
}
