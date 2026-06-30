const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!
const PAYSTACK_API = 'https://api.paystack.co'

export async function initializeTransaction(params: {
  email: string
  amount: number // in kobo (₦1 = 100 kobo)
  metadata?: Record<string, unknown>
  callbackUrl?: string
}) {
  const response = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amount,
      metadata: params.metadata,
      callback_url: params.callbackUrl,
    }),
  })

  const data = await response.json()

  if (!data.status) {
    throw new Error(data.message || 'Failed to initialize Paystack transaction')
  }

  return {
    authorizationUrl: data.data.authorization_url,
    accessCode: data.data.access_code,
    reference: data.data.reference,
  }
}

export async function verifyTransaction(reference: string) {
  const response = await fetch(
    `${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    }
  )

  const data = await response.json()

  if (!data.status) {
    return { verified: false, message: data.message || 'Verification failed' }
  }

  return {
    verified: data.data.status === 'success',
    amount: data.data.amount,
    currency: data.data.currency,
    email: data.data.customer.email,
    metadata: data.data.metadata,
    reference: data.data.reference,
    paidAt: data.data.paid_at,
  }
}
