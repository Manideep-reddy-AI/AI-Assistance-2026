import Link from 'next/link'

export const metadata = { title: 'Terms of Service — Equora' }

export default function Terms() {
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
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 34, fontWeight: 800, color: '#f1f5f9', marginBottom: 8, letterSpacing: -1 }}>Terms of Service</h1>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: '#334155', marginBottom: 36, letterSpacing: 1 }}>LAST UPDATED: JANUARY 2025</div>

        <h2 style={s.h2}>1. Acceptance of Terms</h2>
        <p style={s.p}>By accessing or using Equora ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>

        <h2 style={s.h2}>2. Description of Service</h2>
        <p style={s.p}>Equora is an AI-powered portfolio analysis and stock research tool. The Service provides educational and informational analysis based on historical data and AI processing. Equora is NOT a SEBI-registered investment advisor.</p>

        <h2 style={s.h2}>3. Not Financial Advice</h2>
        <p style={s.p}>All content, analysis, verdicts, and suggestions provided by Equora are for <strong style={{ color: '#e2e8f0' }}>informational and educational purposes only</strong>. They do not constitute investment advice, financial advice, or recommendations to buy or sell any securities.</p>
        <p style={s.p}>Always consult a SEBI-registered investment advisor before making any investment decisions. Past performance is not indicative of future results.</p>

        <h2 style={s.h2}>4. User Accounts</h2>
        <ul style={{ paddingLeft: 20 }}>
          {['You must provide accurate information when creating an account.', 'You are responsible for maintaining the security of your account credentials.', 'You must be at least 18 years old to use the Service.', 'One account per person. Sharing accounts is not permitted.'].map((t, i) => <li key={i} style={s.li}>{t}</li>)}
        </ul>

        <h2 style={s.h2}>5. Subscription and Payments</h2>
        <p style={s.p}>Pro subscriptions are billed monthly at ₹499/month. Payments are processed securely by Razorpay. You can cancel at any time from your Settings page. Refunds are provided within 7 days of payment if you have not used any Pro features.</p>

        <h2 style={s.h2}>6. Data and Privacy</h2>
        <p style={s.p}>Your portfolio data is processed by Anthropic's Claude AI for analysis purposes. We store analysis results and account information securely. We do not sell your data to third parties. See our <Link href="/privacy" style={{ color: '#8b5cf6' }}>Privacy Policy</Link> for full details.</p>

        <h2 style={s.h2}>7. Prohibited Uses</h2>
        <ul style={{ paddingLeft: 20 }}>
          {['Using the Service for illegal activities', 'Attempting to reverse-engineer or scrape the Service', 'Sharing your account with others', 'Using the Service to manipulate markets', 'Automated or bot access to the Service'].map((t, i) => <li key={i} style={s.li}>{t}</li>)}
        </ul>

        <h2 style={s.h2}>8. Limitation of Liability</h2>
        <p style={s.p}>Equora shall not be liable for any financial losses arising from investment decisions made based on our analysis. The Service is provided "as is" without warranties of any kind. Our total liability is limited to the amount you paid for the Service in the past 30 days.</p>

        <h2 style={s.h2}>9. Changes to Terms</h2>
        <p style={s.p}>We may update these terms from time to time. Continued use of the Service after changes constitutes acceptance of the new terms.</p>

        <h2 style={s.h2}>10. Contact</h2>
        <p style={s.p}>For questions about these terms, contact us at: <span style={{ color: '#8b5cf6' }}>support@equora.in</span></p>

        <div style={{ marginTop: 40, padding: '16px', background: '#0a1120', border: '1px solid #1a2540', borderRadius: 9, fontFamily: "'DM Mono',monospace", fontSize: 11, color: '#334155', lineHeight: 1.8 }}>
          EQUORA IS NOT SEBI-REGISTERED · FOR EDUCATIONAL PURPOSES ONLY · ALWAYS DO YOUR OWN RESEARCH
        </div>
      </div>
    </div>
  )
}
