'use client'
import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signIn, signUp } from '../../lib/auth'

function AuthContent() {
  const router = useRouter()
  const params = useSearchParams()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'' })
  const [showPass, setShowPass] = useState(false)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (params.get('mode') === 'register') setMode('register') }, [params])

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async () => {
    setErr('')
    if (mode === 'register') {
      if (!form.name.trim()) return setErr('Name is required')
      if (!form.email.includes('@')) return setErr('Enter a valid email')
      if (form.password.length < 6) return setErr('Password must be 6+ characters')
      if (form.password !== form.confirm) return setErr("Passwords don't match")
      setLoading(true)
      const { error } = await signUp(form.email, form.password, form.name)
      setLoading(false)
      if (error) return setErr(error.message)
      router.push('/dashboard')
    } else {
      if (!form.email || !form.password) return setErr('Fill in all fields')
      setLoading(true)
      const { error } = await signIn(form.email, form.password)
      setLoading(false)
      if (error) return setErr('Invalid email or password')
      router.push('/dashboard')
    }
  }

  const card = { background:'#0a1120', border:'1px solid #1a2540', borderRadius:14, padding:'36px 32px', boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }
  const inp = (name, placeholder, type='text') => (
    <div style={{ position:'relative' }}>
      <input name={name} value={form[name]} onChange={handle} placeholder={placeholder}
        type={type === 'password' ? (showPass ? 'text' : 'password') : type}
        onKeyDown={e => e.key === 'Enter' && submit()}
        style={{ width:'100%', background:'#060c18', border:'1px solid #1e2d45', borderRadius:8, padding:`12px ${type==='password'?44:16}px 12px 16px`, fontSize:14, color:'#e2e8f0', outline:'none', transition:'border-color .2s' }}
        onFocus={e => e.target.style.borderColor='#7c3aed'}
        onBlur={e => e.target.style.borderColor='#1e2d45'} />
      {type === 'password' && (
        <button onClick={() => setShowPass(p => !p)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#334155', cursor:'pointer', fontSize:14 }}>
          {showPass ? '🙈' : '👁'}
        </button>
      )}
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#05080f', display:'flex', flexDirection:'column' }}>
      <nav style={{ display:'flex', alignItems:'center', padding:'0 24px', height:56, borderBottom:'1px solid #0f1c30' }}>
        <Link href="/" style={{ display:'flex', alignItems:'baseline', gap:7 }}>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:'#f1f5f9' }}>equora</span>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'#8b5cf6', background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.25)', padding:'2px 8px', borderRadius:3, letterSpacing:1 }}>PRO</span>
        </Link>
      </nav>
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'32px 16px' }}>
        <div className="fade-up" style={{ width:'100%', maxWidth:420 }}>
          <div style={card}>
            <div style={{ textAlign:'center', marginBottom:28 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:'#f1f5f9', marginBottom:6 }}>
                {mode === 'register' ? 'Create your account' : 'Welcome back'}
              </div>
              <div style={{ fontSize:13, color:'#475569' }}>
                {mode === 'register' ? 'Start analysing your portfolio for free' : 'Log in to your Equora account'}
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {mode === 'register' && inp('name', 'Full name')}
              {inp('email', 'Email address', 'email')}
              {inp('password', 'Password', 'password')}
              {mode === 'register' && inp('confirm', 'Confirm password', 'password')}
            </div>
            {err && (
              <div style={{ marginTop:12, padding:'9px 13px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:7, fontSize:12, color:'#ef4444' }}>
                ⚠ {err}
              </div>
            )}
            <button onClick={submit} disabled={loading} style={{ width:'100%', marginTop:20, padding:13, borderRadius:8, background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              {loading && <div style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .7s linear infinite' }} />}
              {loading ? 'Please wait...' : mode === 'register' ? 'Create account' : 'Log in'}
            </button>
            <div style={{ textAlign:'center', marginTop:18, fontSize:13, color:'#334155' }}>
              {mode === 'register' ? 'Already have an account? ' : "Don't have an account? "}
              <button onClick={() => setMode(m => m==='login'?'register':'login')} style={{ background:'none', border:'none', color:'#8b5cf6', fontWeight:600, fontSize:13, cursor:'pointer' }}>
                {mode === 'register' ? 'Log in' : 'Sign up free'}
              </button>
            </div>
            <div style={{ marginTop:16, paddingTop:16, borderTop:'1px solid #1a2540', fontSize:11, color:'#1e3a5f', textAlign:'center', fontFamily:"'DM Mono',monospace", lineHeight:1.6 }}>
              By signing up, you agree to our{' '}
              <Link href="/terms" style={{ color:'#334155' }}>Terms of Service</Link> and{' '}
              <Link href="/privacy" style={{ color:'#334155' }}>Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Auth() {
  return (
    <Suspense fallback={<div style={{ minHeight:'100vh', background:'#05080f' }} />}>
      <AuthContent />
    </Suspense>
  )
}
