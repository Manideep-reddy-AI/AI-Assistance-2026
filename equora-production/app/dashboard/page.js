'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AppShell from '../../components/AppShell'
import { supabase } from '../../lib/supabase'
import { getProfile, FREE_LIMITS } from '../../lib/auth'

export default function Dashboard() {
  const [profile, setProfile] = useState(null)
  const [portfolios, setPortfolios] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const { data: p } = await getProfile(session.user.id)
      setProfile(p)
      const { data: ports } = await supabase.from('portfolios').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(5)
      setPortfolios(ports || [])
      setLoading(false)
    }
    load()
  }, [])

  const stat = (label, value, color='#f1f5f9') => (
    <div style={{ background:'#0a1120', border:'1px solid #1a2540', borderRadius:10, padding:'16px 18px' }}>
      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'#334155', letterSpacing:1, textTransform:'uppercase', marginBottom:8 }}>{label}</div>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color }}>{loading ? '...' : value}</div>
    </div>
  )

  const joined = profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { month:'long', year:'numeric' }) : '...'
  const analysesLeft = profile ? (profile.plan === 'pro' ? '∞' : Math.max(0, FREE_LIMITS.analyses - (profile.analyses_used || 0))) : '...'
  const researchLeft = profile ? (profile.plan === 'pro' ? '∞' : Math.max(0, FREE_LIMITS.research - (profile.research_used || 0))) : '...'

  return (
    <AppShell>
      <div style={{ padding:'28px', maxWidth:900 }}>
        <div className="fade-up" style={{ marginBottom:28 }}>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:'#f1f5f9', marginBottom:4 }}>
            Good day, {profile?.name?.split(' ')[0] || '...'} 👋
          </h2>
          <div style={{ fontSize:13, color:'#334155' }}>Here's your Equora overview</div>
        </div>

        <div className="fade-up" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:12, marginBottom:28 }}>
          {stat('Analyses Left', analysesLeft, analysesLeft === 0 ? '#ef4444' : '#f1f5f9')}
          {stat('Research Left', researchLeft)}
          {stat('Plan', profile?.plan?.toUpperCase() || 'FREE', profile?.plan === 'pro' ? '#10b981' : '#f59e0b')}
          {stat('Member Since', joined)}
        </div>

        {profile?.plan === 'free' && (analysesLeft === 0 || analysesLeft <= 2) && (
          <div className="fade-up" style={{ marginBottom:20, padding:'14px 18px', background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:'#f1f5f9', marginBottom:2 }}>
                {analysesLeft === 0 ? "You've used all free analyses" : `Only ${analysesLeft} free ${analysesLeft === 1 ? 'analysis' : 'analyses'} left`}
              </div>
              <div style={{ fontSize:12, color:'#64748b' }}>Upgrade to Pro for unlimited portfolio analyses — ₹499/mo</div>
            </div>
            <Link href="/pricing" style={{ padding:'8px 18px', borderRadius:7, background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', fontSize:13, fontWeight:600, flexShrink:0 }}>
              Upgrade →
            </Link>
          </div>
        )}

        <div className="fade-up" style={{ marginBottom:28 }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'#334155', letterSpacing:2, marginBottom:14, textTransform:'uppercase' }}>Quick Actions</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:12 }}>
            {[
              { label:'Upload Portfolio', desc:'Analyse holdings from any broker', icon:'📂', href:'/portfolio' },
              { label:'Research a Stock', desc:'Invest / Avoid verdict on any stock', icon:'🔍', href:'/research' },
              { label:'Account Settings', desc:'Update profile and preferences', icon:'⚙️', href:'/settings' },
            ].map((a,i) => (
              <Link key={i} href={a.href} style={{ padding:'18px', background:'#0a1120', border:'1px solid #1a2540', borderRadius:10, display:'block', transition:'all .2s' }}
                onMouseOver={e=>{e.currentTarget.style.borderColor='#2d3f58';e.currentTarget.style.transform='translateY(-1px)'}}
                onMouseOut={e=>{e.currentTarget.style.borderColor='#1a2540';e.currentTarget.style.transform='none'}}>
                <div style={{ fontSize:24, marginBottom:10 }}>{a.icon}</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:'#f1f5f9', marginBottom:4 }}>{a.label}</div>
                <div style={{ fontSize:12, color:'#475569', lineHeight:1.5 }}>{a.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="fade-up">
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'#334155', letterSpacing:2, marginBottom:14, textTransform:'uppercase' }}>Recent Portfolios</div>
          {portfolios.length > 0 ? portfolios.map((p,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 16px', background:'#0a1120', border:'1px solid #1a2540', borderRadius:9, marginBottom:8 }}>
              <div style={{ width:34, height:34, borderRadius:'50%', background:'rgba(139,92,246,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>📂</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'#e2e8f0' }}>{p.name}</div>
                <div style={{ fontSize:11, color:'#334155', fontFamily:"'DM Mono',monospace" }}>{p.stocks_count} stocks · {new Date(p.created_at).toLocaleDateString('en-IN')}</div>
              </div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color: p.pl_percent >= 0 ? '#10b981':'#ef4444' }}>
                {p.pl_percent >= 0 ? '+' : ''}{p.pl_percent?.toFixed(1)}%
              </div>
            </div>
          )) : (
            <div style={{ padding:36, textAlign:'center', background:'#0a1120', border:'1px dashed #1a2540', borderRadius:12 }}>
              <div style={{ fontSize:28, marginBottom:12 }}>📂</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, color:'#f1f5f9', marginBottom:6 }}>No portfolios yet</div>
              <div style={{ fontSize:13, color:'#475569', marginBottom:16 }}>Upload your first holdings CSV to get started</div>
              <Link href="/portfolio" style={{ padding:'9px 22px', borderRadius:7, background:'rgba(139,92,246,0.12)', border:'1px solid rgba(139,92,246,0.3)', color:'#a78bfa', fontSize:13, fontWeight:500 }}>
                Upload Portfolio →
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
