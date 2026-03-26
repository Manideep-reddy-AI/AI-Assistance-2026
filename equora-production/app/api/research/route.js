import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { RESEARCH_SYSTEM } from '../../../lib/prompts'
import { getAnthropicKey, getSupabaseEnv, getSupabaseServiceRoleKey } from '../../../lib/env'

export async function POST(req) {
  try {
    const { url, anonKey } = getSupabaseEnv()
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createClient(url, anonKey)
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = createClient(url, getSupabaseServiceRoleKey())
    const { data: profile } = await admin.from('profiles').select('*').eq('id', user.id).single()

    if (profile?.plan === 'free' && (profile?.research_used || 0) >= 20) {
      return NextResponse.json({ error: 'Free research limit reached. Upgrade to Pro.' }, { status: 403 })
    }

    const { messages } = await req.json()

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
        system: RESEARCH_SYSTEM,
        messages,
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      return NextResponse.json({ error: data?.error?.message || 'Research service unavailable' }, { status: 502 })
    }
    const reply = data?.content?.[0]?.text
    if (!reply) return NextResponse.json({ error: 'Research failed' }, { status: 500 })

    await admin.from('profiles').update({
      research_used: (profile?.research_used || 0) + 1,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id)

    return NextResponse.json({ reply })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
