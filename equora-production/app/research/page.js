'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import AppShell from '../../components/AppShell'
import { supabase } from '../../lib/supabase'

const SUGGESTIONS = [
  'Should I invest in Reliance Industries?',
  'Analyse TCS — 5-year history and outlook',
  'NVIDIA vs AMD — which is better for AI boom?',
  'HDFC vs ICICI vs Kotak — best bank stock?',
  'Top 5 Indian mid-cap stocks for 2025',
  'Is Bitcoin a good investment right now?',
  'Analyse Infosys — buy or hold?',
  'Best pharma stocks in India 2025',
]

export default function Research() {
  const [msgs, setMsgs] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [token, setToken] = useState(null)
  const chatRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { if (session) setToken(session.access_token) })
  }, [])

  useEffect(() => { chatRef.current?.scrollTo(0, chatRef.current.scrollHeight) }, [msgs, busy])

  const ask = useCallback(async (text) => {
    const q = (text || input).trim()
    if (!q || busy) return
    setInput('')
    const history = [...msgs, { role: 'user', content: q }]
    setMsgs(history)
    setBusy(true)
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ messages: history.map(m => ({ role: m.role, content: m.content })) }),
      })
      const data = await res.json()
      if (data.error) {
        setMsgs(p => [...p, { role: 'assistant', content: `<div class="pa"><p style="color:#ef4444;font-family:'DM Mono',monospace;font-size:13px">⚠ ${data.error}</p></div>` }])
      } else {
        setMsgs(p => [...p, { role: 'assistant', content: data.reply }])
      }
    } catch {
      setMsgs(p => [...p, { role: 'assistant', content: '<div class="pa"><p style="color:#ef4444">Network error. Please retry.</p></div>' }])
    }
    setBusy(false)
    setTimeout(() => inputRef.current?.focus(), 80)
  }, [input, msgs, busy, token])

  const handleClick = useCallback(e => {
    const el = e.target.closest?.('.comp,.am-chip')
    const q = el?.dataset?.q
    if (q) ask(q)
  }, [ask])

  return (
    <AppShell>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {msgs.length === 0 && (
            <div className="fade-up" style={{ maxWidth: 680, margin: 'auto', width: '100%' }}>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 8, letterSpacing: -0.5 }}>Research any stock</div>
                <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.7 }}>
                  Get historical returns, fundamentals, bull/bear thesis, and a clear invest/avoid verdict.<br />
                  Click any comparable stock in a result to instantly analyse it.
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} onClick={() => ask(s)} className="fade-up"
                    style={{ padding: '13px 16px', background: '#0a1120', border: '1px solid #1a2540', borderRadius: 9, textAlign: 'left', fontSize: 13, color: '#64748b', cursor: 'pointer', transition: 'all .2s', animationDelay: `${i * 0.05}s`, display: 'block', width: '100%' }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = '#2d4a6e'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = '#0d1830' }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = '#1a2540'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = '#0a1120' }}>
                    → {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {msgs.map((m, i) => (
            <div key={i} className="fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {m.role === 'user' ? (
                <div style={{ background: 'linear-gradient(135deg,#0f2a4a,#0a1f38)', border: '1px solid #1e3a5f', borderRadius: '12px 12px 3px 12px', padding: '11px 16px', fontSize: 14, color: '#e2e8f0', maxWidth: '70%', lineHeight: 1.6 }}>
                  {m.content}
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#059669,#0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0, boxShadow: '0 0 12px rgba(16,185,129,0.25)' }}>E</div>
                  <div style={{ flex: 1, background: '#0a1120', border: '1px solid #1a2540', borderRadius: '3px 12px 12px 12px', padding: '16px 20px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
                    onClick={handleClick}
                    dangerouslySetInnerHTML={{ __html: m.content }} />
                </div>
              )}
            </div>
          ))}

          {busy && (
            <div className="fade-up" style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#059669,#0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0 }}>E</div>
              <div style={{ background: '#0a1120', border: '1px solid #1a2540', borderRadius: '3px 12px 12px 12px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 14, height: 14, border: '1.5px solid #1e2d45', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: '#1e3a5f', letterSpacing: 1 }}>RESEARCHING...</span>
              </div>
            </div>
          )}
        </div>

        <div style={{ borderTop: '1px solid #0f1c30', padding: '12px 24px', background: '#05080f', flexShrink: 0, display: 'flex', gap: 10 }}>
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && ask()} disabled={busy}
            placeholder="Ask about any stock, ETF, sector, or market..."
            style={{ flex: 1, background: '#0a1120', border: '1px solid #1a2540', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#e2e8f0', outline: 'none', transition: 'border-color .2s' }}
            onFocus={e => e.target.style.borderColor = '#10b981'}
            onBlur={e => e.target.style.borderColor = '#1a2540'} />
          <button onClick={() => ask()} disabled={busy || !input.trim()}
            style={{ padding: '10px 20px', borderRadius: 8, background: busy || !input.trim() ? '#0d1525' : 'linear-gradient(135deg,#059669,#0d9488)', color: busy || !input.trim() ? '#1e2d45' : '#fff', fontFamily: "'DM Mono',monospace", fontSize: 12, fontWeight: 500, letterSpacing: 1, border: 'none', cursor: busy || !input.trim() ? 'not-allowed' : 'pointer', transition: 'all .2s', boxShadow: busy || !input.trim() ? 'none' : '0 4px 14px rgba(16,185,129,0.25)' }}>
            {busy ? '···' : 'RESEARCH →'}
          </button>
        </div>
      </div>
    </AppShell>
  )
}
