'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import { signOut, getProfile } from '../lib/auth'

const NAV = [
  { href:'/dashboard', label:'Dashboard', icon:'🏠' },
  { href:'/portfolio', label:'Portfolio', icon:'📂' },
  { href:'/research', label:'Research', icon:'🔍' },
  { href:'/pricing', label:'Upgrade', icon:'⭐' },
  { href:'/settings', label:'Settings', icon:'⚙️' },
]

export default function AppShell({ children }) {
  const router = useRouter()
  const path = usePathname()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [mobile, setMobile] = useState(false)
  const [sideOpen, setSideOpen] = useState(false)

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/auth'); return }
      setUser(session.user)
      const { data } = await getProfile(session.user.id)
      setProfile(data)
    }
    check()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') router.push('/auth')
    })
    const handleResize = () => setMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => { subscription.unsubscribe(); window.removeEventListener('resize', handleResize) }
  }, [])

  const handleLogout = async () => { await signOut(); router.push('/auth') }
  const initials = profile?.name ? profile.name[0].toUpperCase() : '?'

  const sidebar = (
    <div style={{ width:220, flexShrink:0, borderRight:'1px solid #0f1c30', background:'#060c18', display:'flex', flexDirection:'column', height:'100%' }}>
      <div style={{ padding:'18px 20px', borderBottom:'1px solid #0f1c30' }}>
        <Link href="/dashboard" style={{ display:'flex', alignItems:'baseline', gap:7 }}>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:'#f1f5f9' }}>equora</span>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'#8b5cf6', background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.25)', padding:'2px 7px', borderRadius:3, letterSpacing:1 }}>PRO</span>
        </Link>
      </div>
      <nav style={{ flex:1, padding:'12px 10px', display:'flex', flexDirection:'column', gap:2, overflowY:'auto' }}>
        {NAV.map(n => {
          const active = path === n.href
          return (
            <Link key={n.href} href={n.href} onClick={() => mobile && setSideOpen(false)}
              style={{ display:'flex', alignItems:'center', gap:11, padding:'10px 12px', borderRadius:8, background: active ? 'rgba(124,58,237,0.12)':'transparent', border:`1px solid ${active?'rgba(124,58,237,0.25)':'transparent'}`, color: active ? '#a78bfa':'#475569', fontSize:13, fontWeight: active ? 600:400, transition:'all .15s' }}>
              <span style={{ fontSize:16 }}>{n.icon}</span>{n.label}
              {n.label === 'Upgrade' && profile?.plan !== 'pro' && (
                <span style={{ marginLeft:'auto', fontFamily:"'DM Mono',monospace", fontSize:9, background:'rgba(245,158,11,0.15)', color:'#f59e0b', padding:'1px 6px', borderRadius:3 }}>FREE</span>
              )}
              {n.label === 'Upgrade' && profile?.plan === 'pro' && (
                <span style={{ marginLeft:'auto', fontFamily:"'DM Mono',monospace", fontSize:9, background:'rgba(16,185,129,0.15)', color:'#10b981', padding:'1px 6px', borderRadius:3 }}>PRO</span>
              )}
            </Link>
          )
        })}
      </nav>
      <div style={{ padding:'14px', borderTop:'1px solid #0f1c30' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
          <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, color:'#fff', flexShrink:0 }}>{initials}</div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:600, color:'#e2e8f0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{profile?.name || '...'}</div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color: profile?.plan==='pro'?'#10b981':'#334155', letterSpacing:1 }}>{profile?.plan?.toUpperCase() || 'FREE'} PLAN</div>
          </div>
        </div>
        <button onClick={handleLogout} style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'8px 10px', borderRadius:7, background:'transparent', border:'1px solid #1e2d45', color:'#334155', fontSize:12, cursor:'pointer', transition:'all .15s' }}
          onMouseOver={e=>{e.currentTarget.style.borderColor='#ef4444';e.currentTarget.style.color='#ef4444'}}
          onMouseOut={e=>{e.currentTarget.style.borderColor='#1e2d45';e.currentTarget.style.color='#334155'}}>
          🚪 Sign out
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ display:'flex', height:'100vh', background:'#05080f', overflow:'hidden' }}>
      {/* Desktop sidebar */}
      {!mobile && sidebar}

      {/* Mobile overlay sidebar */}
      {mobile && sideOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex' }}>
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)' }} onClick={() => setSideOpen(false)} />
          <div style={{ position:'relative', zIndex:51, height:'100%' }}>{sidebar}</div>
        </div>
      )}

      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
        {/* Top bar */}
        <div style={{ height:52, borderBottom:'1px solid #0f1c30', display:'flex', alignItems:'center', padding:'0 20px', gap:12, flexShrink:0 }}>
          {mobile && (
            <button onClick={() => setSideOpen(true)} style={{ background:'transparent', border:'1px solid #1e2d45', borderRadius:6, padding:'6px 10px', color:'#475569', cursor:'pointer', fontSize:16 }}>☰</button>
          )}
          <div style={{ flex:1, fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:'#f1f5f9' }}>
            {NAV.find(n => n.path === path)?.label || NAV.find(n => path.startsWith(n.href))?.label || 'Equora'}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 10px', borderRadius:5, border:'1px solid rgba(16,185,129,0.2)', background:'rgba(16,185,129,0.06)' }}>
            <div style={{ width:5, height:5, borderRadius:'50%', background:'#10b981', animation:'pulse 2s infinite' }}/>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'#10b981', letterSpacing:1 }}>AI LIVE</span>
          </div>
        </div>
        <div style={{ flex:1, overflow:'auto' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
