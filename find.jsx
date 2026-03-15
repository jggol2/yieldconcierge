import Head from 'next/head';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';

// Dynamic import with SSR disabled — the quiz uses browser APIs (fetch, AbortController)
// and localStorage-style patterns that can't run on the server
const HYSAQuiz = dynamic(() => import('../components/HYSAQuiz'), {
  ssr: false,
  loading: () => (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Mono', monospace",
      fontSize: '11px',
      letterSpacing: '2px',
      color: '#4a5265',
    }}>
      Loading…
    </div>
  ),
});

export default function Find() {
  return (
    <Layout>
      <Head>
        <title>Find My Rate — Yield Concierge</title>
        <meta name="description" content="Answer 10 questions and get your personalized high-yield savings account recommendation — with live rate verification and a concierge chat to refine your result." />
      </Head>
      <HYSAQuiz />
    </Layout>
  );
}
