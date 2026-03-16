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
    gap: 10px;
    text-decoration: none;
    cursor: pointer;
  }
  .logo-mark {
    width: 28px;
    height: 28px;
    border: 1.5px solid #c8a96e;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .logo-mark-inner {
    width: 8px;
    height: 8px;
    background: #c8a96e;
    border-radius: 50%;
  }
  .logo-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 500;
    color: #f0ece2;
    letter-spacing: 0.2px;
  }
  .logo-text span {
    color: #c8a96e;
    font-style: italic;
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
    font-family: 'Cormorant Garamond', serif;
    font-size: 15px;
    font-weight: 500;
    color: #706c66;
  }
  .footer-logo span { color: #c8a96e; font-style: italic; }
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
      <style>{css}</style>
      <div className="layout-root">
        <header className="header">
          <Link href="/" className="header-logo">
            <div className="logo-mark">
              <div className="logo-mark-inner" />
            </div>
            <div className="logo-text">Yield <span>Concierge</span></div>
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
            <div className="footer-logo">Yield <span>Concierge</span></div>
            <div className="footer-disc">
              Rates verified periodically from official bank websites and reputable aggregators.
              APYs are variable and subject to change. Always verify directly with each institution
              before opening an account. This tool is independent — no banks pay for placement or recommendations.
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
