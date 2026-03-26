import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { getRazorpayEnv, getSupabaseEnv, getSupabaseServiceRoleKey } from '../../../lib/env'

export async function POST(req) {
  try {
    const { keySecret } = getRazorpayEnv()
    const { url, anonKey } = getSupabaseEnv()
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createClient(url, anonKey)
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto.createHmac('sha256', keySecret).update(body).digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // Update subscription + profile to Pro
    const admin = createClient(url, getSupabaseServiceRoleKey())

    await admin.from('subscriptions').update({
      razorpay_payment_id,
      status: 'paid',
    }).eq('razorpay_order_id', razorpay_order_id)

    await admin.from('profiles').update({
      plan: 'pro',
      updated_at: new Date().toISOString(),
    }).eq('id', user.id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
