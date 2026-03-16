import Head from 'next/head';
import { useState, useMemo } from 'react';
import Layout from '../components/Layout';

// ─── MATH ─────────────────────────────────────────────────────────────────────
function calcGrowth(startBalance, apy, monthlyAddition, months) {
  const r = apy / 100 / 12;
  let balance = startBalance;
  let principal = startBalance;
  for (let m = 0; m < months; m++) {
    balance = balance * (1 + r) + monthlyAddition;
    principal += monthlyAddition;
  }
  return { balance, principal, interest: balance - principal };
}

function calcAPY(nominalRate, compoundsPerYear) {
  if (compoundsPerYear === Infinity) {
    return (Math.exp(nominalRate / 100) - 1) * 100;
  }
  return (Math.pow(1 + nominalRate / 100 / compoundsPerYear, compoundsPerYear) - 1) * 100;
}

const PERIODS = [
  { label: '3 mo',  months: 3 },
  { label: '1 yr',  months: 12 },
  { label: '2 yr',  months: 24 },
  { label: '3 yr',  months: 36 },
  { label: '5 yr',  months: 60 },
  { label: '10 yr', months: 120 },
];

const COMPOUND_OPTIONS = [
  { label: 'Daily',         value: 365 },
  { label: 'Monthly',       value: 12 },
  { label: 'Quarterly',     value: 4 },
  { label: 'Semi-annually', value: 2 },
  { label: 'Annually',      value: 1 },
  { label: 'Continuously',  value: Infinity },
];

function fmt(n) {
  return n >= 1000000
    ? '$' + (n / 1000000).toFixed(2) + 'M'
    : '$' + Math.round(n).toLocaleString();
}

// ─── SVG GROWTH CHART ─────────────────────────────────────────────────────────
function GrowthChart({ data }) {
  const W = 600, H = 280, PL = 72, PR = 20, PT = 16, PB = 44;
  const chartW = W - PL - PR;
  const chartH = H - PT - PB;

  const maxVal = Math.max(...data.map(d => d.balance), 1);
  const minVal = 0;
  const range  = maxVal - minVal;

  const toX = i => PL + (i / (data.length - 1)) * chartW;
  const toY = v => PT + chartH - ((v - minVal) / range) * chartH;

  const balancePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(d.balance)}`).join(' ');
  const principalPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(d.principal)}`).join(' ');

  // Fill area under balance line
  const areaPath = `${balancePath} L${toX(data.length - 1)},${PT + chartH} L${toX(0)},${PT + chartH} Z`;
  // Fill area under principal line
  const principalArea = `${principalPath} L${toX(data.length - 1)},${PT + chartH} L${toX(0)},${PT + chartH} Z`;

  // Y-axis ticks
  const yTicks = 4;
  const yTickVals = Array.from({ length: yTicks + 1 }, (_, i) => minVal + (range * i) / yTicks);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8a96e" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#c8a96e" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="prinGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a5265" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#4a5265" stopOpacity="0.04" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yTickVals.map((v, i) => (
        <g key={i}>
          <line
            x1={PL} y1={toY(v)} x2={PL + chartW} y2={toY(v)}
            stroke="#1e2535" strokeWidth="1"
          />
          <text
            x={PL - 8} y={toY(v) + 4}
            fill="#4a5265" fontSize="9" textAnchor="end"
            fontFamily="DM Mono, monospace"
          >
            {v >= 1000000 ? (v / 1000000).toFixed(1) + 'M' : v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v.toFixed(0)}
          </text>
        </g>
      ))}

      {/* Principal fill */}
      <path d={principalArea} fill="url(#prinGrad)" />
      {/* Balance fill */}
      <path d={areaPath} fill="url(#balGrad)" />
      {/* Principal line */}
      <path d={principalPath} fill="none" stroke="#4a5265" strokeWidth="1.5" strokeDasharray="4 3" />
      {/* Balance line */}
      <path d={balancePath} fill="none" stroke="#c8a96e" strokeWidth="2" />

      {/* X-axis labels + dots */}
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={toX(i)} cy={toY(d.balance)} r="3" fill="#c8a96e" />
          <text
            x={toX(i)} y={H - 10}
            fill="#5a6070" fontSize="9" textAnchor="middle"
            fontFamily="DM Mono, monospace"
          >
            {d.label}
          </text>
        </g>
      ))}

      {/* Axes */}
      <line x1={PL} y1={PT} x2={PL} y2={PT + chartH} stroke="#1e2535" strokeWidth="1" />
      <line x1={PL} y1={PT + chartH} x2={PL + chartW} y2={PT + chartH} stroke="#1e2535" strokeWidth="1" />
    </svg>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  .calc-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(200,169,110,.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(200,169,110,.025) 1px, transparent 1px);
    background-size: 56px 56px;
  }
  .calc-page { position: relative; z-index: 1; }

  .calc-hero {
    padding: 80px 40px 56px;
    max-width: 960px; margin: 0 auto;
    border-bottom: 1px solid #1a2030;
  }
  .calc-eyebrow {
    font-family: 'DM Mono', monospace; font-size: 9px;
    letter-spacing: 3px; text-transform: uppercase; color: #c8a96e;
    margin-bottom: 16px; display: flex; align-items: center; gap: 14px;
  }
  .calc-eyebrow::after { content: ''; width: 40px; height: 1px; background: #1e2535; }
  .calc-h {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(36px, 5vw, 52px); font-weight: 500;
    line-height: 1.08; color: #f0ece2; margin-bottom: 12px;
  }
  .calc-h em { font-style: italic; color: #c8a96e; }
  .calc-lead { font-size: 15px; color: #8a8680; line-height: 1.7; max-width: 560px; }

  /* ── CALCULATOR CONTAINERS ── */
  .calc-body { max-width: 960px; margin: 0 auto; padding: 0 40px 80px; }

  .calc-section {
    padding: 64px 0;
    border-bottom: 1px solid #1a2030;
  }
  .calc-section:last-child { border-bottom: none; }

  .calc-section-label {
    font-family: 'DM Mono', monospace; font-size: 9px;
    letter-spacing: 3px; text-transform: uppercase; color: #4a5265;
    margin-bottom: 12px;
  }
  .calc-section-h {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(24px, 3vw, 34px); font-weight: 500;
    color: #f0ece2; margin-bottom: 8px; line-height: 1.2;
  }
  .calc-section-sub {
    font-size: 13px; color: #6a6660; margin-bottom: 36px; line-height: 1.55;
  }

  /* ── INPUTS ── */
  .input-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
    margin-bottom: 36px;
  }
  .input-group { display: flex; flex-direction: column; gap: 8px; }
  .input-label {
    font-family: 'DM Mono', monospace; font-size: 9px;
    letter-spacing: 1.5px; text-transform: uppercase; color: #5a6070;
  }
  .input-wrap { position: relative; }
  .input-prefix, .input-suffix {
    position: absolute; top: 50%; transform: translateY(-50%);
    font-family: 'DM Mono', monospace; font-size: 13px; color: #5a6070;
    pointer-events: none;
  }
  .input-prefix { left: 12px; }
  .input-suffix { right: 12px; }
  .calc-input {
    width: 100%; background: #0d1020; border: 1px solid #1e2535;
    color: #f0ece2; font-family: 'DM Mono', monospace; font-size: 14px;
    padding: 12px 14px; outline: none; transition: border-color .15s;
    appearance: none; -webkit-appearance: none;
  }
  .calc-input.has-prefix { padding-left: 26px; }
  .calc-input.has-suffix { padding-right: 30px; }
  .calc-input:focus { border-color: rgba(200,169,110,.4); }
  .calc-input::placeholder { color: #3a4050; }

  select.calc-input {
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%235a6070' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 32px;
  }

  /* ── RESULTS ROW ── */
  .results-row {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px;
    margin-bottom: 32px;
  }
  .result-card { background: #0d1020; border: 1px solid #1a2030; padding: 20px 22px; }
  .result-card.highlight { border-color: rgba(200,169,110,.25); }
  .result-card.highlight::before {
    content: ''; display: block; height: 1px; margin: -20px -22px 16px;
    background: linear-gradient(90deg, transparent, #c8a96e, transparent);
  }
  .result-label {
    font-family: 'DM Mono', monospace; font-size: 9px;
    letter-spacing: 1.5px; text-transform: uppercase; color: #4a5265;
    margin-bottom: 8px;
  }
  .result-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px; font-weight: 500; color: #f0ece2; line-height: 1;
  }
  .result-card.highlight .result-value { color: #c8a96e; }
  .result-sub {
    font-family: 'DM Mono', monospace; font-size: 10px;
    color: #4a5265; margin-top: 6px;
  }

  /* ── CHART ── */
  .chart-wrap {
    background: #0d1020; border: 1px solid #1a2030;
    padding: 24px 20px 16px; margin-bottom: 12px;
  }
  .chart-legend {
    display: flex; gap: 24px; padding: 0 4px;
  }
  .legend-item { display: flex; align-items: center; gap: 8px; font-family: 'DM Mono', monospace; font-size: 10px; color: #5a6070; }
  .legend-line { width: 20px; height: 2px; }
  .legend-line.solid { background: #c8a96e; }
  .legend-line.dashed { background: none; border-top: 1.5px dashed #4a5265; }

  /* ── PERIOD TABLE ── */
  .period-table { width: 100%; border-collapse: collapse; margin-top: 24px; }
  .period-table th {
    text-align: left; font-family: 'DM Mono', monospace; font-size: 9px;
    letter-spacing: 1.5px; text-transform: uppercase; color: #4a5265;
    padding: 9px 14px; border-bottom: 1px solid #1a2030;
  }
  .period-table td {
    padding: 11px 14px; font-size: 13px; color: #8a8680;
    border-bottom: 1px solid #0e1220; font-family: 'DM Mono', monospace;
  }
  .period-table tr:first-child td { color: #c8a96e; }
  .period-table td.highlight-val { color: #4a9e6a; }
  .period-table td.muted { color: #3a4050; }

  /* ── APY RESULT ── */
  .apy-result-wrap {
    display: grid; grid-template-columns: 1fr 1fr; gap: 2px; margin-top: 32px;
  }
  .apy-big-card {
    background: #0d1020; border: 1px solid rgba(200,169,110,.2);
    padding: 36px 32px; position: relative; overflow: hidden;
  }
  .apy-big-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, #c8a96e, transparent);
  }
  .apy-big-label {
    font-family: 'DM Mono', monospace; font-size: 9px;
    letter-spacing: 2px; text-transform: uppercase; color: #4a5265;
    margin-bottom: 16px;
  }
  .apy-big-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 64px; font-weight: 500; color: #c8a96e; line-height: 1;
    margin-bottom: 4px;
  }
  .apy-big-pct { font-size: 22px; color: #c8a96e; }
  .apy-big-note { font-size: 12px; color: #4a5265; margin-top: 8px; font-family: 'DM Mono', monospace; }

  .apy-detail-card {
    background: #090c18; border: 1px solid #1a2030;
    padding: 28px 28px; display: flex; flex-direction: column; gap: 16px;
    justify-content: center;
  }
  .apy-detail-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 0; border-bottom: 1px solid #1a2030;
    font-size: 13px;
  }
  .apy-detail-row:last-child { border-bottom: none; }
  .apy-detail-key { font-family: 'DM Mono', monospace; color: #4a5265; font-size: 10px; letter-spacing: .5px; }
  .apy-detail-val { font-family: 'DM Mono', monospace; color: #a8a49c; font-size: 13px; }
  .apy-gain { color: #4a9e6a !important; }

  @media (max-width: 680px) {
    .calc-hero { padding: 60px 20px 44px; }
    .calc-body { padding: 0 20px 60px; }
    .input-grid { grid-template-columns: 1fr; }
    .results-row { grid-template-columns: 1fr; }
    .apy-result-wrap { grid-template-columns: 1fr; }
  }
`;

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function Calculators() {
  // ── Savings Growth state ──
  const [startBal,   setStartBal]   = useState('10000');
  const [apy,        setApy]        = useState('4.09');
  const [monthly,    setMonthly]    = useState('500');

  // ── APY Calculator state ──
  const [nomRate,    setNomRate]    = useState('4.00');
  const [compounds,  setCompounds]  = useState('365');

  // ── Savings Growth calculations ──
  const growthData = useMemo(() => {
    const bal  = parseFloat(startBal)  || 0;
    const rate = parseFloat(apy)       || 0;
    const add  = parseFloat(monthly)   || 0;
    return PERIODS.map(p => {
      const r = calcGrowth(bal, rate, add, p.months);
      return { ...p, ...r };
    });
  }, [startBal, apy, monthly]);

  const finalData   = growthData[growthData.length - 1];
  const totalAdded  = (parseFloat(monthly) || 0) * 120;

  // ── APY calculations ──
  const apyResult = useMemo(() => {
    const rate = parseFloat(nomRate) || 0;
    const n    = compounds === 'Infinity' ? Infinity : parseInt(compounds);
    const result = calcAPY(rate, n);
    const gain = result - rate;
    const label = COMPOUND_OPTIONS.find(o => String(o.value) === compounds)?.label || '';
    // $10,000 illustration
    const endBal = 10000 * (1 + result / 100);
    return { apy: result, gain, label, endBal };
  }, [nomRate, compounds]);

  return (
    <Layout>
      <Head>
        <title>Calculators — Yield Concierge</title>
        <meta name="description" content="Free savings calculators. Project your savings growth over time and calculate the true APY from any nominal interest rate." />
      </Head>
      <style>{css}</style>
      <div className="calc-bg" />

      <div className="calc-page">
        <div className="calc-hero">
          <div className="calc-eyebrow">Tools</div>
          <h1 className="calc-h">Savings <em>Calculators</em></h1>
          <p className="calc-lead">
            Project your savings growth over time, or calculate the true annual percentage yield from any nominal rate and compounding frequency.
          </p>
        </div>

        <div className="calc-body">

          {/* ── SAVINGS GROWTH CALCULATOR ── */}
          <div className="calc-section">
            <div className="calc-section-label">Calculator 01</div>
            <h2 className="calc-section-h">Savings Growth</h2>
            <p className="calc-section-sub">
              Enter your starting balance, APY, and monthly additions to see how your savings compound over time.
            </p>

            {/* Inputs */}
            <div className="input-grid">
              <div className="input-group">
                <label className="input-label">Starting Balance</label>
                <div className="input-wrap">
                  <span className="input-prefix">$</span>
                  <input
                    className="calc-input has-prefix"
                    type="number" min="0" step="100"
                    value={startBal}
                    onChange={e => setStartBal(e.target.value)}
                    placeholder="10,000"
                  />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Annual APY</label>
                <div className="input-wrap">
                  <input
                    className="calc-input has-suffix"
                    type="number" min="0" max="20" step="0.01"
                    value={apy}
                    onChange={e => setApy(e.target.value)}
                    placeholder="4.09"
                  />
                  <span className="input-suffix">%</span>
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Monthly Addition</label>
                <div className="input-wrap">
                  <span className="input-prefix">$</span>
                  <input
                    className="calc-input has-prefix"
                    type="number" min="0" step="50"
                    value={monthly}
                    onChange={e => setMonthly(e.target.value)}
                    placeholder="500"
                  />
                </div>
              </div>
            </div>

            {/* 10-year summary */}
            <div className="results-row">
              <div className="result-card highlight">
                <div className="result-label">Balance after 10 years</div>
                <div className="result-value">{fmt(finalData.balance)}</div>
                <div className="result-sub">total account value</div>
              </div>
              <div className="result-card">
                <div className="result-label">Total deposited</div>
                <div className="result-value">{fmt((parseFloat(startBal) || 0) + totalAdded)}</div>
                <div className="result-sub">starting balance + additions</div>
              </div>
              <div className="result-card">
                <div className="result-label">Interest earned</div>
                <div className="result-value" style={{ color: '#4a9e6a' }}>{fmt(finalData.interest)}</div>
                <div className="result-sub">compounded monthly</div>
              </div>
            </div>

            {/* Chart */}
            <div className="chart-wrap">
              <GrowthChart data={growthData} />
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-line solid" />
                Total balance
              </div>
              <div className="legend-item">
                <div className="legend-line dashed" />
                Principal only
              </div>
            </div>

            {/* Period breakdown table */}
            <table className="period-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Total Balance</th>
                  <th>Principal</th>
                  <th>Interest Earned</th>
                  <th>Interest %</th>
                </tr>
              </thead>
              <tbody>
                {growthData.map((d, i) => (
                  <tr key={d.label}>
                    <td>{d.label}</td>
                    <td style={{ color: i === growthData.length - 1 ? '#c8a96e' : undefined }}>
                      {fmt(d.balance)}
                    </td>
                    <td className="muted">{fmt(d.principal)}</td>
                    <td className="highlight-val">{fmt(d.interest)}</td>
                    <td className="muted">
                      {d.balance > 0 ? ((d.interest / d.balance) * 100).toFixed(1) + '%' : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── APY CALCULATOR ── */}
          <div className="calc-section">
            <div className="calc-section-label">Calculator 02</div>
            <h2 className="calc-section-h">APY Calculator</h2>
            <p className="calc-section-sub">
              Convert a nominal interest rate to its true Annual Percentage Yield based on compounding frequency. A higher compounding frequency means slightly more interest earned.
            </p>

            {/* Inputs */}
            <div className="input-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="input-group">
                <label className="input-label">Nominal Interest Rate</label>
                <div className="input-wrap">
                  <input
                    className="calc-input has-suffix"
                    type="number" min="0" max="30" step="0.01"
                    value={nomRate}
                    onChange={e => setNomRate(e.target.value)}
                    placeholder="4.00"
                  />
                  <span className="input-suffix">%</span>
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Compounding Frequency</label>
                <div className="input-wrap">
                  <select
                    className="calc-input"
                    value={compounds}
                    onChange={e => setCompounds(e.target.value)}
                  >
                    {COMPOUND_OPTIONS.map(o => (
                      <option key={o.label} value={String(o.value)}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* APY Result */}
            <div className="apy-result-wrap">
              <div className="apy-big-card">
                <div className="apy-big-label">True APY</div>
                <div>
                  <span className="apy-big-value">{apyResult.apy.toFixed(4)}</span>
                  <span className="apy-big-pct">%</span>
                </div>
                <div className="apy-big-note">
                  +{apyResult.gain.toFixed(4)}% above nominal rate
                </div>
              </div>
              <div className="apy-detail-card">
                <div className="apy-detail-row">
                  <span className="apy-detail-key">Nominal rate</span>
                  <span className="apy-detail-val">{parseFloat(nomRate).toFixed(2) || '0.00'}%</span>
                </div>
                <div className="apy-detail-row">
                  <span className="apy-detail-key">Compounding</span>
                  <span className="apy-detail-val">{apyResult.label}</span>
                </div>
                <div className="apy-detail-row">
                  <span className="apy-detail-key">True APY</span>
                  <span className="apy-detail-val apy-gain">{apyResult.apy.toFixed(4)}%</span>
                </div>
                <div className="apy-detail-row">
                  <span className="apy-detail-key">$10,000 after 1 year</span>
                  <span className="apy-detail-val">{fmt(apyResult.endBal)}</span>
                </div>
                <div className="apy-detail-row">
                  <span className="apy-detail-key">Interest on $10,000</span>
                  <span className="apy-detail-val apy-gain">{fmt(apyResult.endBal - 10000)}</span>
                </div>
              </div>
            </div>

            {/* Formula note */}
            <p style={{ fontSize: 12, color: '#3a4050', fontFamily: 'DM Mono, monospace', marginTop: 20, lineHeight: 1.7 }}>
              APY = (1 + r/n)ⁿ − 1 &nbsp;|&nbsp; where r = nominal rate, n = compounding periods per year.
              Continuous compounding uses APY = eʳ − 1.
            </p>
          </div>

        </div>
      </div>
    </Layout>
  );
}
