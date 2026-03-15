import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#09090f" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="description" content="The unbiased HYSA recommender. We calculate your real qualifying rate across curated banks, verify every APY live, then help you choose — with no ads, no paid rankings." />
        <meta property="og:title" content="Yield Concierge" />
        <meta property="og:description" content="The unbiased high-yield savings advisor. Live rate verification. No paid rankings." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yieldconcierge.com" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
