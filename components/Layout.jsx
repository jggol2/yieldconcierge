import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const css = `
  .layout-root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #09090f;
  }

  /* ── HEADER ── */
  .header {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    height: 64px;
    background: rgba(9, 9, 15, 0.88);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(200, 169, 110, 0.08);
  }

  .header-logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    cursor: pointer;
  }

  .header-nav {
    display: flex;
    align-items: center;
    gap: 32px;
  }
  .nav-link {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #706c66;
    text-decoration: none;
    transition: color 0.15s;
    padding: 4px 0;
    border-bottom: 1px solid transparent;
  }
  .nav-link:hover {
    color: #a8a49c;
  }
  .nav-link.active {
    color: #c8a96e;
    border-bottom-color: rgba(200, 169, 110, 0.4);
  }
  .nav-cta {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.3px;
    color: #09090f;
    background: #c8a96e;
    padding: 8px 20px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.15s;
    display: inline-flex;
    align-items: center;
  }
  .nav-cta:hover {
    background: #d4b87a;
  }

  .header-mobile-menu {
    display: none;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
    padding: 4px;
    background: none;
    border: none;
  }
  .hamburger-line {
    width: 22px;
    height: 1.5px;
    background: #a8a49c;
    transition: all 0.2s;
  }

  /* ── MAIN ── */
  .layout-main {
    flex: 1;
    padding-top: 64px;
  }

  /* ── FOOTER ── */
  .footer {
    border-top: 1px solid #1a2030;
    padding: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
  }
  .footer-left {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .footer-logo {
    display: flex;
    align-items: center;
    opacity: 0.55;
  }
  .footer-disc {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.3px;
    color: #3a4255;
    max-width: 480px;
    line-height: 1.7;
  }
  .footer-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
  }
  .footer-links {
    display: flex;
    gap: 24px;
  }
  .footer-link {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #4a5265;
    text-decoration: none;
    transition: color 0.15s;
  }
  .footer-link:hover { color: #706c66; }
  .footer-copy {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    color: #2e3545;
    letter-spacing: 0.3px;
  }

  @media (max-width: 640px) {
    .header { padding: 0 20px; }
    .header-nav { display: none; }
    .header-mobile-menu { display: flex; }
    .footer { padding: 32px 20px; flex-direction: column; align-items: flex-start; }
    .footer-right { align-items: flex-start; }
  }
`;

export default function Layout({ children }) {
  const router = useRouter();
  const isActive = (path) => router.pathname === path;

  return (
    <>
      <Head>
        <title>Yield Concierge — Find Your Best HYSA Rate</title>
        <meta name="description" content="Answer 10 questions and get a personalized high-yield savings account recommendation with live rate verification." />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#09090f" />

        {/* Open Graph */}
        <meta property="og:title" content="Yield Concierge" />
        <meta property="og:description" content="Personalized high-yield savings recommendations with live rate verification." />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yieldconcierge.com" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </Head>

      <style>{css}</style>

      <div className="layout-root">
        <header className="header">
          <Link href="/" className="header-logo">
            {/* Inline SVG — no external file needed, inherits page fonts */}
            <svg width="210" height="40" viewBox="0 0 210 40" xmlns="http://www.w3.org/2000/svg" aria-label="Yield Concierge">
              {/* Mark: square frame */}
              <rect x="1" y="1" width="38" height="38" fill="none" stroke="#c8a96e" strokeWidth="1" rx="1"/>
              <circle cx="1"  cy="1"  r="1.5" fill="#c8a96e"/>
              <circle cx="39" cy="1"  r="1.5" fill="#c8a96e"/>
              <circle cx="1"  cy="39" r="1.5" fill="#c8a96e"/>
              <circle cx="39" cy="39" r="1.5" fill="#c8a96e"/>
              {/* Axis guides */}
              <line x1="7" y1="33" x2="34" y2="33" stroke="#c8a96e" strokeWidth="0.5" opacity="0.25"/>
              <line x1="7" y1="7"  x2="7"  y2="33" stroke="#c8a96e" strokeWidth="0.5" opacity="0.25"/>
              {/* Yield curve */}
              <path d="M 7 30 C 11 20 22 11 34 8" fill="none" stroke="#c8a96e" strokeWidth="2" strokeLinecap="round"/>
              {/* Start dot */}
              <circle cx="7"  cy="30" r="1.5" fill="none" stroke="#c8a96e" strokeWidth="1" opacity="0.5"/>
              {/* Peak dot */}
              <circle cx="34" cy="8"  r="3.5" fill="#c8a96e"/>
              {/* Divider */}
              <line x1="52" y1="6" x2="52" y2="34" stroke="#c8a96e" strokeWidth="0.75" opacity="0.3"/>
              {/* "Yield" — uses Cormorant Garamond already loaded by Head */}
              <text x="62" y="30"
                fontFamily="'Cormorant Garamond', Georgia, serif"
                fontStyle="italic"
                fontWeight="400"
                fontSize="26"
                fill="#ddd8ce"
                letterSpacing="-0.3">Yield</text>
              {/* "CONCIERGE" */}
              <text x="65" y="39"
                fontFamily="'DM Mono', 'Courier New', monospace"
                fontSize="7.5"
                fill="#c8a96e"
                letterSpacing="3.5">CONCIERGE</text>
            </svg>
          </Link>

          <nav className="header-nav">
            <Link href="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
            <Link href="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
            <Link href="/calculators" className={`nav-link ${isActive('/calculators') ? 'active' : ''}`}>Calculators</Link>
            <Link href="/find" className="nav-cta">Find my rate →</Link>
          </nav>

          <button className="header-mobile-menu" aria-label="Menu">
            <div className="hamburger-line" />
            <div className="hamburger-line" />
            <div className="hamburger-line" />
          </button>
        </header>

        <main className="layout-main">
          {children}
        </main>

        <footer className="footer">
          <div className="footer-left">
            <div className="footer-logo">
              <svg width="130" height="48" viewBox="0 0 130 48" xmlns="http://www.w3.org/2000/svg" aria-label="Yield Concierge">
                {/* Mark */}
                <rect x="1" y="1" width="32" height="32" fill="none" stroke="#c8a96e" strokeWidth="1" rx="1"/>
                <circle cx="1"  cy="1"  r="1.5" fill="#c8a96e"/>
                <circle cx="33" cy="1"  r="1.5" fill="#c8a96e"/>
                <circle cx="1"  cy="33" r="1.5" fill="#c8a96e"/>
                <circle cx="33" cy="33" r="1.5" fill="#c8a96e"/>
                <line x1="6" y1="28" x2="28" y2="28" stroke="#c8a96e" strokeWidth="0.5" opacity="0.25"/>
                <line x1="6" y1="6"  x2="6"  y2="28" stroke="#c8a96e" strokeWidth="0.5" opacity="0.25"/>
                <path d="M 6 25 C 9 17 18 9 28 6" fill="none" stroke="#c8a96e" strokeWidth="1.75" strokeLinecap="round"/>
                <circle cx="6"  cy="25" r="1.5" fill="none" stroke="#c8a96e" strokeWidth="1" opacity="0.5"/>
                <circle cx="28" cy="6"  r="3"   fill="#c8a96e"/>
                {/* Text */}
                <text x="42" y="24"
                  fontFamily="'Cormorant Garamond', Georgia, serif"
                  fontStyle="italic"
                  fontWeight="400"
                  fontSize="22"
                  fill="#ddd8ce"
                  letterSpacing="-0.3">Yield</text>
                <text x="44" y="34"
                  fontFamily="'DM Mono', 'Courier New', monospace"
                  fontSize="6.5"
                  fill="#c8a96e"
                  letterSpacing="3">CONCIERGE</text>
              </svg>
            </div>
            <div className="footer-disc">
              Rates verified periodically from official bank websites and reputable aggregators.
              APYs are variable and subject to change. Always verify directly with each institution
              before opening an account. Yield Concierge is independent — banks do not pay for
              placement or influence our recommendations. We may earn a referral commission if you
              open an account through our links, at no cost to you.
            </div>
          </div>
          <div className="footer-right">
            <div className="footer-links">
              <Link href="/" className="footer-link">Home</Link>
              <Link href="/find" className="footer-link">Find My Rate</Link>
              <Link href="/calculators" className="footer-link">Calculators</Link>
              <Link href="/about" className="footer-link">About</Link>
            </div>
            <div className="footer-copy">© {new Date().getFullYear()} Yield Concierge. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </>
  );
}
