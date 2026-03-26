import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { createClient } from '@supabase/supabase-js'
import { getRazorpayEnv, getSupabaseEnv, getSupabaseServiceRoleKey } from '../../../lib/env'

export async function POST(req) {
  try {
    const { keyId, keySecret } = getRazorpayEnv()
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })
    const { url, anonKey } = getSupabaseEnv()
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createClient(url, anonKey)
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const order = await razorpay.orders.create({
      amount: 49900, // ₹499 in paise
      currency: 'INR',
      receipt: `equora_${user.id}_${Date.now()}`,
    })

    // Save pending subscription
    const admin = createClient(url, getSupabaseServiceRoleKey())
    await admin.from('subscriptions').insert({
      user_id: user.id,
      razorpay_order_id: order.id,
      amount: 49900,
      status: 'pending',
      plan: 'pro',
    })

    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Could not create order' }, { status: 500 })
  }
}
