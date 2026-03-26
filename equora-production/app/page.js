'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

const S = {
  nav: { display:'flex', alignItems:'center', padding:'0 24px', height:60, borderBottom:'1px solid #0f1c30', position:'sticky', top:0, background:'rgba(5,8,15,0.95)', backdropFilter:'blur(12px)', zIndex:100 },
  logo: { display:'flex', alignItems:'baseline', gap:7, marginRight:'auto' },
  logoText: { fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:'#f1f5f9', letterSpacing:-0.5 },
  badge: { fontFamily:"'DM Mono',monospace", fontSize:9, color:'#8b5cf6', background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.25)', padding:'2px 8px', borderRadius:3, letterSpacing:1 },
}

export default function Landing() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(session.user)
    })
  }, [])

  const features = [
    { icon:'📊', title:'Portfolio Upload', desc:'Upload CSV from any Indian broker — Zerodha, Groww, Upstox, Angel One. Instant AI analysis.' },
    { icon:'🔍', title:'Stock Research', desc:'Ask about any stock, get 5-year history, fundamentals, and a clear Invest / Avoid verdict.' },
    { icon:'🏥', title:'Health Score', desc:'Your portfolio gets a grade and score /100 — like a credit score for your investments.' },
    { icon:'🔒', title:'Secure & Private', desc:'Your data is protected by Supabase. Analysis via encrypted API. No data sold ever.' },
    { icon:'⚖️', title:'Rebalancing Plans', desc:'AI spots overweight sectors and tells you exactly what to buy, hold, or trim.' },
    { icon:'⭐', title:'Free to Start', desc:'5 portfolio analyses free. No credit card needed to get started.' },
  ]

  const steps = [
    { n:'01', t:'Create account', d:'Sign up free in 30 seconds.' },
    { n:'02', t:'Export from broker', d:'Download holdings CSV from any app.' },
    { n:'03', t:'Upload to Equora', d:'Drag & drop — we read any format.' },
    { n:'04', t:'Get AI analysis', d:'Full portfolio report in seconds.' },
  ]

  const socialProof = [
    { label: 'Investors onboarded', value: '1,200+' },
    { label: 'Portfolios analyzed', value: '18,000+' },
    { label: 'Average report time', value: '< 20 sec' },
  ]

  const btn = (label, href, primary=false) => (
    <Link href={href} style={{ padding: primary ? '13px 28px' : '13px 24px', borderRadius:8, background: primary ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'transparent', border: primary ? 'none' : '1px solid #1e2d45', color: primary ? '#fff' : '#94a3b8', fontSize:14, fontWeight: primary ? 600 : 500, boxShadow: primary ? '0 4px 20px rgba(124,58,237,0.4)' : 'none', display:'inline-block', textAlign:'center', transition:'all .2s' }}>
      {label}
    </Link>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#05080f', color:'#cbd5e1', position:'relative' }}>
      <div className="hero-bg">
        <div className="hero-glow" style={{ width:360, height:360, background:'#7c3aed', top:-120, left:-80 }} />
        <div className="hero-glow" style={{ width:320, height:320, background:'#2563eb', top:120, right:-80 }} />
      </div>
      {/* Nav */}
      <nav style={S.nav}>
        <div style={S.logo}>
          <span style={S.logoText}>equora</span>
          <span style={S.badge}>PRO</span>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {user ? btn('Go to Dashboard', '/dashboard', true) : (<>{btn('Log in', '/auth')}{btn('Get started free', '/auth?mode=register', true)}</>)}
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth:900, margin:'0 auto', padding:'80px 24px 60px', textAlign:'center' }}>
        <div className="fade-up" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 14px', background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.2)', borderRadius:20, marginBottom:24, fontFamily:"'DM Mono',monospace", fontSize:11, color:'#a78bfa', letterSpacing:1 }}>
          ✦ AI-POWERED PORTFOLIO INTELLIGENCE FOR INDIA
        </div>
        <h1 className="fade-up" style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(36px,7vw,58px)', fontWeight:800, color:'#f1f5f9', lineHeight:1.08, letterSpacing:-2, marginBottom:20 }}>
          Your portfolio.<br/>
          <span style={{ background:'linear-gradient(90deg,#8b5cf6,#3b82f6,#10b981)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Understood by AI.</span>
        </h1>
        <p className="fade-up" style={{ fontSize:16, color:'#475569', lineHeight:1.8, maxWidth:500, margin:'0 auto 36px' }}>
          Upload your holdings from any broker. Get a health score, stock-by-stock verdicts, sector analysis, and rebalancing suggestions — instantly.
        </p>
        <div className="fade-up" style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/auth?mode=register" style={{ padding:'14px 32px', borderRadius:8, background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', fontSize:15, fontWeight:600, boxShadow:'0 4px 20px rgba(124,58,237,0.4)', display:'inline-block' }}>
            Start for free →
          </Link>
          <Link href="/auth" style={{ padding:'14px 24px', borderRadius:8, background:'transparent', border:'1px solid #1e2d45', color:'#94a3b8', fontSize:15, display:'inline-block' }}>
            Log in
          </Link>
        </div>
        <div style={{ marginTop:14, fontSize:12, color:'#1e3a5f', fontFamily:"'DM Mono',monospace" }}>
          No credit card · Works with Zerodha, Groww, Upstox, Angel One & all brokers
        </div>
        <div className="fade-up" style={{ marginTop:28, display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:10 }}>
          {socialProof.map((item) => (
            <div key={item.label} style={{ padding:'12px 14px', background:'rgba(10,17,32,0.8)', border:'1px solid #1a2540', borderRadius:10 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:'#f1f5f9' }}>{item.value}</div>
              <div style={{ fontSize:11, color:'#475569', fontFamily:"'DM Mono',monospace", letterSpacing:1 }}>{item.label.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth:960, margin:'0 auto', padding:'0 24px 80px' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'#334155', letterSpacing:2, marginBottom:12, textTransform:'uppercase' }}>Everything you need</div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:800, color:'#f1f5f9', letterSpacing:-1 }}>Built for serious investors</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:14 }}>
          {features.map((f,i) => (
            <div key={i} className="fade-up" style={{ padding:20, background:'#0a1120', border:'1px solid #1a2540', borderRadius:10 }}>
              <div style={{ fontSize:24, marginBottom:12 }}>{f.icon}</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:'#f1f5f9', marginBottom:6 }}>{f.title}</div>
              <div style={{ fontSize:13, color:'#475569', lineHeight:1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ maxWidth:800, margin:'0 auto', padding:'0 24px 80px' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:800, color:'#f1f5f9', letterSpacing:-1 }}>Four steps to clarity</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:12 }}>
          {steps.map((s,i) => (
            <div key={i} style={{ padding:'18px 20px', background:'#0a1120', border:'1px solid #1a2540', borderRadius:10 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:'#1e2d45', marginBottom:8 }}>{s.n}</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:'#f1f5f9', marginBottom:4 }}>{s.t}</div>
              <div style={{ fontSize:13, color:'#475569', lineHeight:1.6 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div style={{ maxWidth:700, margin:'0 auto', padding:'0 24px 80px' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:800, color:'#f1f5f9', letterSpacing:-1 }}>Simple pricing</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))', gap:14 }}>
          {[
            { name:'Free', price:'₹0/mo', features:['5 portfolio analyses','20 research queries','Basic health score','Email support'], cta:'Get started', href:'/auth?mode=register', primary:false },
            { name:'Pro', price:'₹499/mo', features:['Unlimited analyses','Unlimited research','Advanced rebalancing','Priority support','CSV export'], cta:'Upgrade to Pro', href:'/pricing', primary:true },
          ].map((p,i) => (
            <div key={i} style={{ padding:24, background:'#0a1120', border:`1px solid ${i===1?'rgba(139,92,246,0.4)':'#1a2540'}`, borderRadius:12, display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:'#f1f5f9', marginBottom:4 }}>{p.name}</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:22, color: i===1 ? '#8b5cf6':'#94a3b8' }}>{p.price}</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:6, flex:1 }}>
                {p.features.map((f,j) => (
                  <div key={j} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'#94a3b8' }}>
                    <span style={{ color:'#10b981' }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <Link href={p.href} style={{ padding:'11px', borderRadius:8, background: p.primary ? 'linear-gradient(135deg,#7c3aed,#4f46e5)':'transparent', border: p.primary ? 'none':'1px solid #1e2d45', color: p.primary ? '#fff':'#94a3b8', fontSize:13, fontWeight:600, textAlign:'center', display:'block' }}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ maxWidth:900, margin:'0 auto', padding:'0 24px 80px' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:30, fontWeight:800, color:'#f1f5f9', letterSpacing:-1 }}>Loved by self-directed investors</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))', gap:12 }}>
          {[
            ['"Finally I can spot overexposure in seconds."', 'Priya K., Bengaluru'],
            ['"The stock verdicts save me hours every week."', 'Arjun M., Mumbai'],
            ['"Clean dashboard, actionable analysis, no fluff."', 'Rohit S., Pune'],
          ].map(([quote, author]) => (
            <div key={author} style={{ padding:18, background:'#0a1120', border:'1px solid #1a2540', borderRadius:10 }}>
              <div style={{ fontSize:14, color:'#cbd5e1', lineHeight:1.7, marginBottom:10 }}>{quote}</div>
              <div style={{ fontSize:12, color:'#475569', fontFamily:"'DM Mono',monospace" }}>{author}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop:'1px solid #0f1c30', padding:'24px', textAlign:'center' }}>
        <div style={{ display:'flex', justifyContent:'center', gap:24, marginBottom:16, flexWrap:'wrap' }}>
          {[['Terms', '/terms'], ['Privacy', '/privacy'], ['Pricing', '/pricing']].map(([l,h]) => (
            <Link key={l} href={h} style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'#334155', letterSpacing:1 }}>{l.toUpperCase()}</Link>
          ))}
        </div>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'#1e2d45', letterSpacing:1 }}>
          © 2025 EQUORA · FOR INFORMATIONAL PURPOSES ONLY · NOT SEBI-REGISTERED FINANCIAL ADVICE
        </div>
      </footer>
    </div>
  )
}
