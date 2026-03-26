import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PORTFOLIO_SYSTEM } from '../../../lib/prompts'
import { getAnthropicKey, getSupabaseEnv, getSupabaseServiceRoleKey } from '../../../lib/env'

export async function POST(req) {
  try {
    const { url, anonKey } = getSupabaseEnv()
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Verify user with Supabase
    const supabase = createClient(
      url,
      anonKey
    )
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Check usage limits
    const admin = createClient(url, getSupabaseServiceRoleKey())
    const { data: profile } = await admin.from('profiles').select('*').eq('id', user.id).single()

    if (profile?.plan === 'free' && (profile?.analyses_used || 0) >= 5) {
      return NextResponse.json({ error: 'Free limit reached. Upgrade to Pro for unlimited analyses.' }, { status: 403 })
    }

    const { prompt, portfolioData } = await req.json()

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': getAnthropicKey(),
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: PORTFOLIO_SYSTEM,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      return NextResponse.json({ error: data?.error?.message || 'Analysis service unavailable' }, { status: 502 })
    }
    const analysis = data?.content?.[0]?.text

    if (!analysis) return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })

    // Save portfolio + increment usage
    const totalInvested = portfolioData.reduce((s, r) => s + (r.avg * r.qty || 0), 0)
    const totalValue = portfolioData.reduce((s, r) => s + (r.cv || 0), 0)
    const plPct = totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested * 100) : 0

    await admin.from('portfolios').insert({
      user_id: user.id,
      name: `Portfolio — ${new Date().toLocaleDateString('en-IN')}`,
      stocks_count: portfolioData.length,
      total_invested: totalInvested,
      total_value: totalValue,
      pl_percent: parseFloat(plPct.toFixed(2)),
      analysis_html: analysis,
      raw_data: portfolioData,
    })

    await admin.from('profiles').update({
      analyses_used: (profile?.analyses_used || 0) + 1,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id)

    return NextResponse.json({ analysis })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
