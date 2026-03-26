function requiredEnv(name) {
  const value = process.env[name]
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export function getSupabaseEnv() {
  return {
    url: requiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: requiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  }
}

export function getSupabaseServiceRoleKey() {
  return requiredEnv('SUPABASE_SERVICE_ROLE_KEY')
}

export function getAnthropicKey() {
  return requiredEnv('ANTHROPIC_API_KEY')
}

export function getRazorpayEnv() {
  return {
    keyId: requiredEnv('RAZORPAY_KEY_ID'),
    keySecret: requiredEnv('RAZORPAY_KEY_SECRET'),
  }
}
