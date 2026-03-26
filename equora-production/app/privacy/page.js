import Link from 'next/link'

export const metadata = { title: 'Privacy Policy — Equora' }

export default function Privacy() {
  const s = { h2: { fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 10, marginTop: 28 }, p: { fontSize: 14, color: '#64748b', lineHeight: 1.8, marginBottom: 12 }, li: { fontSize: 14, color: '#64748b', lineHeight: 1.8, marginBottom: 6 } }
  return (
    <div style={{ minHeight: '100vh', background: '#05080f', color: '#cbd5e1' }}>
      <nav style={{ display: 'flex', alignItems: 'center', padding: '0 24px', height: 56, borderBottom: '1px solid #0f1c30' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>equora</span>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: '#8b5cf6', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', padding: '2px 8px', borderRadius: 3, letterSpacing: 1 }}>PRO</span>
        </Link>
        <div style={{ flex: 1 }} />
        <Link href="/" style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: '#334155', letterSpacing: 1 }}>← BACK</Link>
      </nav>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 34, fontWeight: 800, color: '#f1f5f9', marginBottom: 8, letterSpacing: -1 }}>Privacy Policy</h1>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: '#334155', marginBottom: 36, letterSpacing: 1 }}>LAST UPDATED: JANUARY 2025</div>

        <h2 style={s.h2}>1. Information We Collect</h2>
        <p style={s.p}>We collect the following information when you use Equora:</p>
        <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
          {['Account information: name and email address', 'Portfolio data: stock holdings you upload (processed for analysis, not permanently stored in raw form)', 'Usage data: number of analyses and research queries used', 'Payment information: handled entirely by Razorpay — we never see your card details', 'Technical data: browser type, IP address (for security purposes)'].map((t, i) => <li key={i} style={s.li}>{t}</li>)}
        </ul>

        <h2 style={s.h2}>2. How We Use Your Information</h2>
        <ul style={{ paddingLeft: 20 }}>
          {['To provide and improve the Equora service', 'To process your portfolio through Anthropic\'s Claude AI for analysis', 'To manage your subscription and process payments', 'To send transactional emails (receipts, password resets)', 'To enforce our Terms of Service and prevent fraud'].map((t, i) => <li key={i} style={s.li}>{t}</li>)}
        </ul>

        <h2 style={s.h2}>3. AI Processing</h2>
        <p style={s.p}>Your portfolio holdings are sent to <strong style={{ color: '#e2e8f0' }}>Anthropic's Claude API</strong> over encrypted HTTPS for AI analysis. Anthropic's own <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener" style={{ color: '#8b5cf6' }}>privacy policy</a> governs how they handle this data. We do not share identifying information alongside portfolio data sent for analysis.</p>

        <h2 style={s.h2}>4. Data Storage</h2>
        <p style={s.p}>Your account data and analysis results are stored securely in <strong style={{ color: '#e2e8f0' }}>Supabase</strong> — a SOC 2 Type II compliant database platform hosted on AWS. Your data is encrypted at rest and in transit.</p>

        <h2 style={s.h2}>5. Data Sharing</h2>
        <p style={s.p}>We do <strong style={{ color: '#ef4444' }}>NOT</strong> sell, rent, or share your personal information with third parties for marketing purposes. We only share data with:</p>
        <ul style={{ paddingLeft: 20 }}>
          {['Anthropic (for AI analysis processing)', 'Razorpay (for payment processing)', 'Supabase (for data storage)', 'Legal authorities when required by law'].map((t, i) => <li key={i} style={s.li}>{t}</li>)}
        </ul>

        <h2 style={s.h2}>6. Your Rights</h2>
        <p style={s.p}>You have the right to:</p>
        <ul style={{ paddingLeft: 20 }}>
          {['Access all data we hold about you', 'Request correction of inaccurate data', 'Request deletion of your account and data', 'Export your data in a portable format', 'Opt out of non-essential communications'].map((t, i) => <li key={i} style={s.li}>{t}</li>)}
        </ul>
        <p style={s.p}>To exercise these rights, email us at <span style={{ color: '#8b5cf6' }}>privacy@equora.in</span></p>

        <h2 style={s.h2}>7. Cookies</h2>
        <p style={s.p}>We use essential cookies only — for authentication sessions. We do not use tracking, advertising, or analytics cookies. We do not use Google Analytics or any third-party tracking.</p>

        <h2 style={s.h2}>8. Data Retention</h2>
        <p style={s.p}>We retain your account data for as long as your account is active. Portfolio analysis results are kept for 90 days. You can request immediate deletion at any time. Raw CSV upload data is never permanently stored.</p>

        <h2 style={s.h2}>9. Security</h2>
        <p style={s.p}>We implement industry-standard security measures including bcrypt password hashing, HTTPS encryption, Row Level Security (RLS) in Supabase, and server-side API key management. Our AI API keys are never exposed to the browser.</p>

        <h2 style={s.h2}>10. Children's Privacy</h2>
        <p style={s.p}>The Service is not directed to individuals under 18. We do not knowingly collect personal information from children.</p>

        <h2 style={s.h2}>11. Contact Us</h2>
        <p style={s.p}>For privacy questions or data requests, contact: <span style={{ color: '#8b5cf6' }}>privacy@equora.in</span></p>

        <div style={{ marginTop: 40, padding: '16px', background: '#0a1120', border: '1px solid #1a2540', borderRadius: 9, fontFamily: "'DM Mono',monospace", fontSize: 11, color: '#334155', lineHeight: 1.8 }}>
          YOUR PRIVACY IS IMPORTANT TO US · WE NEVER SELL YOUR DATA · ENCRYPTED AT REST AND IN TRANSIT
        </div>
      </div>
    </div>
  )
}
