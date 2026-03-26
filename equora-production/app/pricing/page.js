'use client'
import { useState, useEffect } from 'react'
import AppShell from '../../components/AppShell'
import { supabase } from '../../lib/supabase'
import { getProfile } from '../../lib/auth'
import { useRouter } from 'next/navigation'
import Script from 'next/script'

export default function Pricing() {
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [token, setToken] = useState(null)
  const [paying, setPaying] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      setToken(session.access_token)
      const { data } = await getProfile(session.user.id)
      setProfile(data)
    }
    load()
  }, [])

  const handleUpgrade = async () => {
    if (!token || paying) return
    setPaying(true)
    try {
      // Create Razorpay order
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      })
      const order = await orderRes.json()
      if (order.error) { alert(order.error); setPaying(false); return }

      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Equora',
        description: 'Equora Pro — Monthly Subscription',
        order_id: order.orderId,
        handler: async (response) => {
          // Verify payment
          const verRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(response),
          })
          const ver = await verRes.json()
          if (ver.success) {
            setSuccess(true)
            setProfile(p => ({ ...p, plan: 'pro' }))
            setTimeout(() => router.push('/dashboard'), 2000)
          } else {
            alert('Payment verification failed. Contact support.')
          }
          setPaying(false)
        },
        prefill: { name: profile?.name, email: profile?.email },
        theme: { color: '#7c3aed' },
        modal: { ondismiss: () => setPaying(false) },
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (e) {
      console.error(e)
      alert('Something went wrong. Please retry.')
      setPaying(false)
    }
  }

  const features = {
    free: ['5 portfolio analyses / month', '20 research queries / month', 'Basic health score & grade', 'Sector allocation chart', 'Stock-by-stock verdict', 'Comparable stocks'],
    pro: ['Unlimited portfolio analyses', 'Unlimited research queries', 'Advanced rebalancing plans', 'Full bull/bear thesis', 'Price level targets', 'Priority AI processing', 'Save unlimited portfolios', 'Priority support'],
  }

  if (success) return (
    <AppShell>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 56 }}>🎉</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: '#10b981' }}>Welcome to Equora Pro!</div>
        <div style={{ fontSize: 14, color: '#475569' }}>Your account has been upgraded. Redirecting to dashboard...</div>
        <div style={{ width: 40, height: 40, border: '3px solid #1a2540', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin .9s linear infinite' }} />
      </div>
    </AppShell>
  )

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <AppShell>
        <div style={{ padding: '28px', maxWidth: 760, margin: '0 auto' }}>
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 30, fontWeight: 800, color: '#f1f5f9', marginBottom: 8, letterSpacing: -0.5 }}>Choose your plan</h2>
            <div style={{ fontSize: 14, color: '#475569' }}>Start free, upgrade when you're ready</div>
          </div>

          {profile?.plan === 'pro' && (
            <div className="fade-up" style={{ marginBottom: 24, padding: '14px 18px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 9, textAlign: 'center' }}>
              <span style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>✓ You're already on Equora Pro — enjoy unlimited access!</span>
            </div>
          )}

          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Free */}
            <div style={{ padding: 24, background: '#0a1120', border: '1px solid #1a2540', borderRadius: 12, display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>Free</div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 28, fontWeight: 500, color: '#8b5cf6', marginBottom: 4 }}>₹0</div>
                <div style={{ fontSize: 12, color: '#334155' }}>Forever free · No credit card</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, marginBottom: 20 }}>
                {features.free.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#94a3b8' }}>
                    <span style={{ color: '#8b5cf6', flexShrink: 0, marginTop: 1 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <div style={{ padding: '10px', borderRadius: 8, background: '#060c18', border: '1px solid #1a2540', color: '#334155', fontSize: 13, textAlign: 'center' }}>
                {profile?.plan === 'pro' ? 'Your previous plan' : 'Current plan'}
              </div>
            </div>

            {/* Pro */}
            <div style={{ padding: 24, background: 'linear-gradient(135deg,rgba(124,58,237,0.08),rgba(79,70,229,0.04))', border: '1px solid rgba(124,58,237,0.35)', borderRadius: 12, display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', fontFamily: "'DM Mono',monospace", fontSize: 10, color: '#fff', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', padding: '4px 14px', borderRadius: 20, letterSpacing: 1, whiteSpace: 'nowrap' }}>
                MOST POPULAR
              </div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>Pro</div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 28, fontWeight: 500, color: '#a78bfa', marginBottom: 4 }}>₹499 <span style={{ fontSize: 14, color: '#334155' }}>/ month</span></div>
                <div style={{ fontSize: 12, color: '#334155' }}>Cancel anytime · Instant access</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, marginBottom: 20 }}>
                {features.pro.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#c4b5fd' }}>
                    <span style={{ color: '#a78bfa', flexShrink: 0, marginTop: 1 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              {profile?.plan === 'pro' ? (
                <div style={{ padding: '12px', borderRadius: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
                  ✓ Active — You're on Pro
                </div>
              ) : (
                <button onClick={handleUpgrade} disabled={paying}
                  style={{ padding: '13px', borderRadius: 8, background: paying ? '#1e2d45' : 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', color: paying ? '#475569' : '#fff', fontSize: 14, fontWeight: 600, cursor: paying ? 'not-allowed' : 'pointer', boxShadow: paying ? 'none' : '0 4px 20px rgba(124,58,237,0.4)', transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {paying ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />Processing...</> : 'Upgrade to Pro →'}
                </button>
              )}
            </div>
          </div>

          {/* FAQs */}
          <div className="fade-up" style={{ marginTop: 40 }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: '#334155', letterSpacing: 2, marginBottom: 16, textTransform: 'uppercase' }}>Frequently Asked</div>
            {[
              ['Is my payment secure?', 'Yes. Payments are processed by Razorpay — India\'s leading payment gateway. We never see or store your card details.'],
              ['Can I cancel anytime?', 'Yes. Cancel from Settings → Plan at any time. You keep Pro access until the end of your billing period.'],
              ['What payment methods are accepted?', 'UPI, Credit/Debit cards, Net banking, Wallets — all major Indian payment methods via Razorpay.'],
              ['Is this SEBI-registered financial advice?', 'No. Equora provides AI-powered analysis for informational purposes only. Always consult a SEBI-registered advisor before investing.'],
            ].map(([q, a], i) => (
              <div key={i} style={{ padding: '16px', background: '#0a1120', border: '1px solid #1a2540', borderRadius: 9, marginBottom: 10 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 6 }}>{q}</div>
                <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.65 }}>{a}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, textAlign: 'center', fontFamily: "'DM Mono',monospace", fontSize: 10, color: '#1e2d45', letterSpacing: 1 }}>
            FOR INFORMATIONAL PURPOSES · NOT SEBI-REGISTERED FINANCIAL ADVICE
          </div>
        </div>
      </AppShell>
    </>
  )
}
