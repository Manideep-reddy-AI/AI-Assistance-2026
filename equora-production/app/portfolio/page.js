'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import AppShell from '../../components/AppShell'
import { supabase } from '../../lib/supabase'
import { parseCSV, SAMPLE_CSV } from '../../lib/csv'

const BROKERS = [
  { name:'Zerodha', steps:['Open Kite app → Console','Portfolio → Holdings','Click Download (↓) icon','Upload CSV here'] },
  { name:'Groww', steps:['Open Groww app','Stocks → Portfolio','⋮ menu → Download Statement','Upload CSV here'] },
  { name:'Upstox', steps:['Open Upstox app','Portfolio → Holdings','Export → Holdings CSV','Upload CSV here'] },
  { name:'Angel One', steps:['Open Angel One','Portfolio → Holdings','Download Report','Upload CSV here'] },
]

async function callAPI(endpoint, body, token) {
  const res = await fetch(`/api/${endpoint}`, {
    method:'POST',
    headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${token}` },
    body: JSON.stringify(body),
  })
  return res.json()
}

export default function Portfolio() {
  const [stage, setStage] = useState('upload')
  const [portfolio, setPortfolio] = useState(null)
  const [msgs, setMsgs] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [err, setErr] = useState('')
  const [broker, setBroker] = useState(null)
  const [token, setToken] = useState(null)
  const fileRef = useRef(null)
  const chatRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { if (session) setToken(session.access_token) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => { if (session) setToken(session.access_token) })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => { chatRef.current?.scrollTo(0, chatRef.current.scrollHeight) }, [msgs, busy])

  const processFile = useCallback(async (text) => {
    setErr('')
    const rows = parseCSV(text)
    if (!rows) return setErr('Could not read CSV. Ensure it has stock name, quantity and price columns.')
    setPortfolio(rows)
    setStage('analyzing')
    const totalInv = rows.reduce((s,r) => s + r.avg*r.qty, 0)
    const totalVal = rows.reduce((s,r) => s + (r.cv||0), 0)
    const summary = rows.map(r => `${r.sym}: ${r.qty} shares @ avg ₹${r.avg}, current ₹${r.cv||'?'}, P&L ₹${r.pl||'?'}`).join('\n')
    const prompt = `Portfolio holdings:\n${summary}\n\nTotal stocks: ${rows.length}\nInvested: ₹${totalInv.toLocaleString('en-IN')}\nCurrent value: ₹${totalVal.toLocaleString('en-IN')}\n\nProvide complete portfolio intelligence analysis.`
    const data = await callAPI('analyze', { prompt, portfolioData: rows }, token)
    if (data.error) { setErr(data.error); setStage('upload'); return }
    setMsgs([{ role:'assistant', content: data.analysis }])
    setStage('result')
  }, [token])

  const askFollowUp = useCallback(async (text) => {
    const q = (text || input).trim()
    if (!q || busy) return
    setInput('')
    const ctx = portfolio ? `\nPortfolio: ${portfolio.map(r=>`${r.sym}(${r.qty}@₹${r.avg})`).join(', ')}` : ''
    const history = [...msgs, { role:'user', content: q }]
    setMsgs(history)
    setBusy(true)
    const data = await callAPI('research', { messages: history.map(m=>({ role:m.role, content: m.role==='user' ? m.content+ctx : m.content })) }, token)
    setMsgs(p => [...p, { role:'assistant', content: data.reply || '<div class="pa"><p style="color:#ef4444">Error. Retry.</p></div>' }])
    setBusy(false)
    setTimeout(() => inputRef.current?.focus(), 80)
  }, [input, msgs, busy, portfolio, token])

  const handleClick = useCallback(e => {
    const el = e.target.closest?.('.am-chip,.comp,.st-row')
    const q = el?.dataset?.q
    if (q) askFollowUp(q)
  }, [askFollowUp])

  const readFile = file => {
    const r = new FileReader()
    r.onload = e => processFile(e.target.result)
    r.readAsText(file)
  }

  const totalInv = portfolio?.reduce((s,r) => s + r.avg*r.qty, 0) || 0
  const totalVal = portfolio?.reduce((s,r) => s + (r.cv||0), 0) || 0
  const totalPL  = totalVal - totalInv
  const plPct    = totalInv > 0 ? (totalPL/totalInv*100).toFixed(1) : '0.0'

  if (stage === 'upload') return (
    <AppShell>
      <div style={{ padding:'28px', maxWidth:680, margin:'0 auto' }}>
        <div className="fade-up" style={{ marginBottom:24 }}>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:'#f1f5f9', marginBottom:4 }}>Upload Your Portfolio</h2>
          <div style={{ fontSize:13, color:'#334155' }}>Export holdings CSV from any broker and upload below</div>
        </div>
        {/* Broker guide */}
        <div className="fade-up" style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
          {BROKERS.map((b,i) => (
            <button key={i} onClick={() => setBroker(broker?.name===b.name?null:b)}
              style={{ padding:'6px 14px', borderRadius:6, background: broker?.name===b.name?'#0f1e38':'#0a1120', border:`1px solid ${broker?.name===b.name?'#7c3aed':'#1a2540'}`, color: broker?.name===b.name?'#a78bfa':'#64748b', fontSize:12, cursor:'pointer', transition:'all .15s' }}>
              {b.name}
            </button>
          ))}
        </div>
        {broker && (
          <div className="fade-up" style={{ marginBottom:20, padding:'14px 16px', background:'#0a1120', border:'1px solid #1a2540', borderRadius:8, display:'flex', gap:16, flexWrap:'wrap' }}>
            {broker.steps.map((s,i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, minWidth:140 }}>
                <div style={{ width:20, height:20, borderRadius:'50%', background:'rgba(139,92,246,0.15)', border:'1px solid rgba(139,92,246,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'DM Mono',monospace", fontSize:10, color:'#8b5cf6', flexShrink:0, marginTop:1 }}>{i+1}</div>
                <span style={{ fontSize:12, color:'#64748b', lineHeight:1.5 }}>{s}</span>
              </div>
            ))}
          </div>
        )}
        {/* Drop zone */}
        <div className="fade-up" onDragOver={e=>{e.preventDefault();setDragOver(true)}} onDragLeave={()=>setDragOver(false)}
          onDrop={e=>{e.preventDefault();setDragOver(false);const f=e.dataTransfer.files[0];if(f)readFile(f)}}
          onClick={() => fileRef.current?.click()}
          style={{ border:`2px dashed ${dragOver?'#8b5cf6':'#1e2d45'}`, borderRadius:12, padding:'44px 24px', textAlign:'center', cursor:'pointer', transition:'all .2s', background:dragOver?'rgba(139,92,246,0.05)':'transparent', marginBottom:16 }}>
          <input ref={fileRef} type="file" accept=".csv,.txt" style={{display:'none'}} onChange={e=>{const f=e.target.files[0];if(f)readFile(f)}} />
          <div style={{ fontSize:28, marginBottom:10 }}>📂</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:700, color:'#e2e8f0', marginBottom:6 }}>Drop CSV here or click to browse</div>
          <div style={{ fontSize:12, color:'#334155', marginBottom:16 }}>Works with any Indian broker CSV format</div>
          <div style={{ display:'inline-block', padding:'8px 18px', background:'rgba(139,92,246,0.12)', border:'1px solid rgba(139,92,246,0.3)', borderRadius:6, fontFamily:"'DM Mono',monospace", fontSize:12, color:'#a78bfa' }}>BROWSE FILES →</div>
        </div>
        {err && <div style={{ marginBottom:12, padding:'9px 13px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:7, fontSize:12, color:'#ef4444' }}>⚠ {err}</div>}
        <div style={{ textAlign:'center' }}>
          <button onClick={() => processFile(SAMPLE_CSV)} style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'#475569', background:'transparent', border:'1px solid #1e2d45', padding:'8px 18px', borderRadius:6, cursor:'pointer', letterSpacing:1 }}>
            TRY SAMPLE PORTFOLIO →
          </button>
          <div style={{ fontSize:11, color:'#1e2d45', marginTop:8, fontFamily:"'DM Mono',monospace" }}>8 stocks · Reliance, TCS, INFY, HDFC, Zomato, Wipro, BajFinance, DMart</div>
        </div>
      </div>
    </AppShell>
  )

  if (stage === 'analyzing') return (
    <AppShell>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:16, padding:24 }}>
        <div style={{ width:48, height:48, border:'2px solid #1a2540', borderTopColor:'#8b5cf6', borderRadius:'50%', animation:'spin .9s linear infinite' }}/>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:'#f1f5f9' }}>Analysing {portfolio?.length} stocks...</div>
        <div style={{ fontSize:13, color:'#334155' }}>Running AI portfolio intelligence report</div>
      </div>
    </AppShell>
  )

  return (
    <AppShell>
      <div style={{ display:'flex', height:'100%', overflow:'hidden' }}>
        {/* Holdings sidebar */}
        <div style={{ width:200, flexShrink:0, borderRight:'1px solid #0f1c30', overflowY:'auto', padding:'14px 12px', background:'#060c18', display:'flex', flexDirection:'column' }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'#1e2d45', letterSpacing:2, marginBottom:10, textTransform:'uppercase' }}>Your Holdings</div>
          <div style={{ flex:1 }}>
            {portfolio?.map((r,i) => (
              <div key={i} onClick={() => askFollowUp(`Deep dive: ${r.sym} — hold, buy more, or sell?`)}
                style={{ padding:'7px 9px', borderRadius:6, marginBottom:3, cursor:'pointer', transition:'all .15s' }}
                onMouseOver={e=>e.currentTarget.style.background='#0d1525'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:12, fontWeight:500, color:'#e2e8f0' }}>{r.sym}</span>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:r.pl>=0?'#10b981':'#ef4444' }}>{r.pl>=0?'+':''}{r.pl?Math.round(r.pl).toLocaleString('en-IN'):'—'}</span>
                </div>
                <div style={{ fontSize:11, color:'#334155' }}>{r.qty} × ₹{r.avg?.toLocaleString('en-IN')||'—'}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:12, padding:'10px', background:'#0a1120', border:'1px solid #1a2540', borderRadius:7 }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'#1e2d45', letterSpacing:1, marginBottom:4, textTransform:'uppercase' }}>Total</div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:14, fontWeight:500, color:totalPL>=0?'#10b981':'#ef4444' }}>{totalPL>=0?'+':''}{plPct}%</div>
          </div>
          <button onClick={() => { setStage('upload'); setPortfolio(null); setMsgs([]) }} style={{ width:'100%', marginTop:10, padding:7, background:'transparent', border:'1px solid #1e2d45', borderRadius:6, color:'#334155', fontSize:11, fontFamily:"'DM Mono',monospace", cursor:'pointer', letterSpacing:1 }}>
            NEW UPLOAD
          </button>
        </div>
        {/* Chat */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <div ref={chatRef} style={{ flex:1, overflowY:'auto', padding:'20px 24px', display:'flex', flexDirection:'column', gap:16 }}>
            {msgs.map((m,i) => (
              <div key={i} className="fade-up" style={{ display:'flex', flexDirection:'column', alignItems:m.role==='user'?'flex-end':'flex-start' }}>
                {m.role==='user' ? (
                  <div style={{ background:'linear-gradient(135deg,#0f2a4a,#0a1f38)', border:'1px solid #1e3a5f', borderRadius:'12px 12px 3px 12px', padding:'11px 16px', fontSize:14, color:'#e2e8f0', maxWidth:'70%', lineHeight:1.6 }}>{m.content}</div>
                ) : (
                  <div style={{ display:'flex', gap:10, width:'100%' }}>
                    <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:800, color:'#fff', flexShrink:0 }}>E</div>
                    <div style={{ flex:1, background:'#0a1120', border:'1px solid #1a2540', borderRadius:'3px 12px 12px 12px', padding:'16px 20px', boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }} onClick={handleClick} dangerouslySetInnerHTML={{__html:m.content}}/>
                  </div>
                )}
              </div>
            ))}
            {busy && (
              <div className="fade-up" style={{ display:'flex', gap:10 }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:800, color:'#fff', flexShrink:0 }}>E</div>
                <div style={{ background:'#0a1120', border:'1px solid #1a2540', borderRadius:'3px 12px 12px 12px', padding:'14px 20px', display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:14, height:14, border:'1.5px solid #1e2d45', borderTopColor:'#8b5cf6', borderRadius:'50%', animation:'spin .7s linear infinite' }}/>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'#1e3a5f', letterSpacing:1 }}>ANALYSING...</span>
                </div>
              </div>
            )}
          </div>
          <div style={{ borderTop:'1px solid #0f1c30', padding:'12px 20px', background:'#05080f', flexShrink:0, display:'flex', gap:10 }}>
            <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&askFollowUp()} disabled={busy}
              placeholder="Ask anything about your portfolio..."
              style={{ flex:1, background:'#0a1120', border:'1px solid #1a2540', borderRadius:8, padding:'10px 14px', fontSize:14, color:'#e2e8f0', outline:'none', transition:'border-color .2s' }}
              onFocus={e=>e.target.style.borderColor='#7c3aed'} onBlur={e=>e.target.style.borderColor='#1a2540'}/>
            <button onClick={()=>askFollowUp()} disabled={busy||!input.trim()} style={{ padding:'10px 18px', borderRadius:8, background:busy||!input.trim()?'#0d1525':'linear-gradient(135deg,#7c3aed,#4f46e5)', color:busy||!input.trim()?'#1e2d45':'#fff', fontFamily:"'DM Mono',monospace", fontSize:12, fontWeight:500, letterSpacing:1, border:'none', cursor:busy||!input.trim()?'not-allowed':'pointer', transition:'all .2s' }}>
              {busy?'···':'ASK →'}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
