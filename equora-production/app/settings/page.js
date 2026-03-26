'use client'
import { useState, useEffect } from 'react'
import AppShell from '../../components/AppShell'
import { supabase } from '../../lib/supabase'
import { getProfile, updateProfile, FREE_LIMITS } from '../../lib/auth'
import Link from 'next/link'

export default function Settings() {
  const [profile, setProfile] = useState(null)
  const [tab, setTab] = useState('profile')
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState(null)
  const [notifs, setNotifs] = useState({ analysis: true, market: false, features: true, tips: false })

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      setUserId(session.user.id)
      const { data } = await getProfile(session.user.id)
      if (data) { setProfile(data); setName(data.name) }
    }
    load()
  }, [])

  const saveProfile = async () => {
    if (!userId || !name.trim()) return
    setSaving(true)
    await updateProfile(userId, { name: name.trim() })
    setProfile(p => ({ ...p, name: name.trim() }))
    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 2500)
  }

  const tabs = ['profile', 'plan', 'privacy', 'notifications']

  const inp = (label, value, onChange, disabled = false, type = 'text') => (
    <div>
      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: '#334155', letterSpacing: 1, marginBottom: 7, textTransform: 'uppercase' }}>{label}</div>
      <input value={value} onChange={onChange ? e => onChange(e.target.value) : undefined}
        disabled={disabled} type={type}
        style={{ width: '100%', background: disabled ? '#060c18' : '#0a1120', border: '1px solid #1a2540', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: disabled ? '#334155' : '#e2e8f0', outline: 'none', transition: 'border-color .2s' }}
        onFocus={e => !disabled && (e.target.style.borderColor = '#7c3aed')}
        onBlur={e => e.target.style.borderColor = '#1a2540'} />
    </div>
  )

  return (
    <AppShell>
      <div style={{ padding: '28px', maxWidth: 640 }}>
        <div className="fade-up" style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>Settings</h2>
          <div style={{ fontSize: 13, color: '#334155' }}>Manage your account and preferences</div>
        </div>

        {/* Tabs */}
        <div className="fade-up" style={{ display: 'flex', gap: 2, background: '#0a1120', borderRadius: 8, padding: 4, border: '1px solid #1a2540', marginBottom: 24, width: 'fit-content', flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '6px 16px', borderRadius: 6, background: tab === t ? '#1e2d45' : 'transparent', color: tab === t ? '#e2e8f0' : '#334155', border: 'none', fontSize: 13, fontWeight: tab === t ? 500 : 400, cursor: 'pointer', transition: 'all .15s', textTransform: 'capitalize' }}>
              {t}
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {tab === 'profile' && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20, background: '#0a1120', border: '1px solid #1a2540', borderRadius: 10, marginBottom: 8 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                {profile?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 700, color: '#f1f5f9' }}>{profile?.name || '...'}</div>
                <div style={{ fontSize: 13, color: '#475569' }}>{profile?.email || '...'}</div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: profile?.plan === 'pro' ? '#10b981' : '#8b5cf6', background: profile?.plan === 'pro' ? 'rgba(16,185,129,0.1)' : 'rgba(139,92,246,0.1)', border: `1px solid ${profile?.plan === 'pro' ? 'rgba(16,185,129,0.2)' : 'rgba(139,92,246,0.2)'}`, padding: '2px 9px', borderRadius: 3, display: 'inline-block', marginTop: 5, letterSpacing: 1 }}>
                  {profile?.plan?.toUpperCase() || 'FREE'} PLAN
                </div>
              </div>
            </div>
            {inp('Full Name', name, setName)}
            {inp('Email', profile?.email || '', null, true, 'email')}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: '#0a1120', border: '1px solid #1a2540', borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: '#334155', letterSpacing: 1, marginBottom: 4, textTransform: 'uppercase' }}>Analyses Used</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>{profile?.analyses_used || 0} / {profile?.plan === 'pro' ? '∞' : FREE_LIMITS.analyses}</div>
              </div>
              <div style={{ background: '#0a1120', border: '1px solid #1a2540', borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: '#334155', letterSpacing: 1, marginBottom: 4, textTransform: 'uppercase' }}>Research Used</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>{profile?.research_used || 0} / {profile?.plan === 'pro' ? '∞' : FREE_LIMITS.research}</div>
              </div>
            </div>
            <button onClick={saveProfile} disabled={saving}
              style={{ padding: '11px 24px', borderRadius: 8, background: saved ? 'rgba(16,185,129,0.12)' : 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: saved ? '1px solid rgba(16,185,129,0.3)' : 'none', color: saved ? '#10b981' : '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, width: 'fit-content', transition: 'all .2s' }}>
              {saving ? <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite' }} /> : null}
              {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        )}

        {/* Plan tab */}
        {tab === 'plan' && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { name: 'Free', price: '₹0 / month', color: '#8b5cf6', features: ['5 portfolio analyses per month', '20 research queries per month', 'Basic health score', 'Sector analysis', 'Email support'], current: profile?.plan !== 'pro' },
              { name: 'Pro', price: '₹499 / month', color: '#10b981', features: ['Unlimited portfolio analyses', 'Unlimited research queries', 'Advanced rebalancing suggestions', 'Full historical analysis', 'CSV export of analysis', 'Priority AI processing', 'Priority support'], current: profile?.plan === 'pro' },
            ].map((p, i) => (
              <div key={i} style={{ padding: 22, background: '#0a1120', border: `1px solid ${p.current ? `${p.color}66` : '#1a2540'}`, borderRadius: 12, position: 'relative' }}>
                {p.current && <div style={{ position: 'absolute', top: 14, right: 16, fontFamily: "'DM Mono',monospace", fontSize: 10, color: p.color, background: `${p.color}1a`, border: `1px solid ${p.color}4d`, padding: '2px 9px', borderRadius: 3, letterSpacing: 1 }}>CURRENT PLAN</div>}
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: '#f1f5f9', marginBottom: 3 }}>{p.name}</div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 20, color: p.color, marginBottom: 16 }}>{p.price}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 18 }}>
                  {p.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94a3b8' }}>
                      <span style={{ color: p.color, flexShrink: 0 }}>✓</span>{f}
                    </div>
                  ))}
                </div>
                {!p.current && (
                  <Link href="/pricing" style={{ display: 'inline-block', padding: '10px 22px', borderRadius: 8, background: `linear-gradient(135deg,${p.color},${p.color}cc)`, border: 'none', color: '#fff', fontSize: 13, fontWeight: 600 }}>
                    Upgrade to Pro →
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Privacy tab */}
        {tab === 'privacy' && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '🔒', title: 'Authentication', body: 'Your account is secured by Supabase — enterprise-grade authentication with bcrypt password hashing. We never store passwords in plain text.' },
              { icon: '🛡️', title: 'Portfolio Data', body: 'Your uploaded holdings are sent to Anthropic\'s Claude API over HTTPS for analysis only. We store the analysis result in Supabase for your history. Raw CSV data is never permanently stored.' },
              { icon: '🔑', title: 'API Security', body: 'All AI calls are made server-side through our API routes. Your Anthropic API key is never exposed to the browser. Users cannot abuse our API.' },
              { icon: '🚫', title: 'No Data Selling', body: 'We do not sell, share, or monetize your personal data or portfolio information. Your data is used only to provide the service.' },
              { icon: '📧', title: 'Communications', body: 'We only send transactional emails — receipts, password resets. No marketing emails unless you opt in. You can delete your account any time.' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '16px 18px', background: '#0a1120', border: '1px solid #1a2540', borderRadius: 9 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{item.title}</div>
                </div>
                <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>{item.body}</div>
              </div>
            ))}
            <div style={{ padding: '14px 16px', background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 9, fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
              Read our full <Link href="/privacy" style={{ color: '#8b5cf6' }}>Privacy Policy</Link> and <Link href="/terms" style={{ color: '#8b5cf6' }}>Terms of Service</Link> for complete details.
            </div>
          </div>
        )}

        {/* Notifications tab */}
        {tab === 'notifications' && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { key: 'analysis', label: 'Analysis Complete', desc: 'Get notified when your portfolio analysis is ready' },
              { key: 'market', label: 'Market Alerts', desc: 'Weekly market summary relevant to your holdings' },
              { key: 'features', label: 'New Features', desc: 'Be first to know about new Equora features' },
              { key: 'tips', label: 'Investment Tips', desc: 'Educational content and investing tips' },
            ].map(n => (
              <div key={n.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#0a1120', border: '1px solid #1a2540', borderRadius: 9 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#e2e8f0', marginBottom: 3 }}>{n.label}</div>
                  <div style={{ fontSize: 12, color: '#475569' }}>{n.desc}</div>
                </div>
                <button onClick={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key] }))}
                  style={{ width: 42, height: 24, borderRadius: 12, background: notifs[n.key] ? '#7c3aed' : '#1e2d45', border: 'none', position: 'relative', cursor: 'pointer', transition: 'background .2s', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', top: 3, left: notifs[n.key] ? 20 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .2s' }} />
                </button>
              </div>
            ))}
            <div style={{ fontSize: 12, color: '#334155', marginTop: 4, fontFamily: "'DM Mono',monospace" }}>
              NOTE: Email notifications require backend email service (Resend / SendGrid) — configure in your deployment.
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
