import axios from 'axios'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!
const PAYSTACK_BASE_URL = 'https://api.paystack.co'

export interface InitializePaymentParams {
  email: string
  amount: number // in kobo (NGN * 100)
  reference: string
  metadata?: Record<string, any>
  callback_url?: string
}

export interface InitializePaymentResponse {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

export interface VerifyPaymentResponse {
  status: boolean
  message: string
  data: {
    id: number
    status: 'success' | 'failed' | 'abandoned'
    reference: string
    amount: number
    gateway_response: string
    paid_at: string
    created_at: string
    channel: string
    currency: string
    metadata: Record<string, any>
    customer: {
      id: number
      email: string
    }
  }
}

export async function initializePayment(
  params: InitializePaymentParams
): Promise<InitializePaymentResponse> {
  try {
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      params,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Payment initialization failed')
  }
}

export async function verifyPayment(
  reference: string
): Promise<VerifyPaymentResponse> {
  try {
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    )
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Payment verification failed')
  }
}
