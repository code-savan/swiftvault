// Note: Install twilio package separately if needed
// This is a wrapper for Twilio API calls

export const TWILIO_CONFIG = {
  accountSid: process.env.TWILIO_ACCOUNT_SID!,
  authToken: process.env.TWILIO_AUTH_TOKEN!,
  phoneNumber: process.env.TWILIO_PHONE_NUMBER!,
}

export interface ProvisionNumberParams {
  country: string
  smsUrl: string
}

export interface TwilioNumber {
  sid: string
  phoneNumber: string
  friendlyName: string
}

// Twilio integration (using fetch instead of SDK for simplicity)
export async function provisionTwilioNumber(
  params: ProvisionNumberParams
): Promise<TwilioNumber> {
  const { country } = params

  try {
    // Search for available phone numbers
    const searchUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_CONFIG.accountSid}/AvailablePhoneNumbers/${country}/Local.json`

    const searchResponse = await fetch(searchUrl, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${TWILIO_CONFIG.accountSid}:${TWILIO_CONFIG.authToken}`
        ).toString('base64')}`,
      },
    })

    if (!searchResponse.ok) {
      throw new Error('No available numbers found')
    }

    const searchData = await searchResponse.json()
    const availableNumber = searchData.available_phone_numbers?.[0]

    if (!availableNumber) {
      throw new Error('No available numbers in this country')
    }

    // Purchase the number
    const purchaseUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_CONFIG.accountSid}/IncomingPhoneNumbers.json`

    const formData = new URLSearchParams()
    formData.append('PhoneNumber', availableNumber.phone_number)
    formData.append('SmsUrl', params.smsUrl)
    formData.append('SmsMethod', 'POST')

    const purchaseResponse = await fetch(purchaseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${TWILIO_CONFIG.accountSid}:${TWILIO_CONFIG.authToken}`
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    })

    if (!purchaseResponse.ok) {
      throw new Error('Failed to purchase number')
    }

    const purchaseData = await purchaseResponse.json()

    return {
      sid: purchaseData.sid,
      phoneNumber: purchaseData.phone_number,
      friendlyName: purchaseData.friendly_name,
    }
  } catch (error: any) {
    throw new Error(error.message || 'Failed to provision Twilio number')
  }
}

export async function releaseTwilioNumber(sid: string): Promise<void> {
  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_CONFIG.accountSid}/IncomingPhoneNumbers/${sid}.json`

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${TWILIO_CONFIG.accountSid}:${TWILIO_CONFIG.authToken}`
        ).toString('base64')}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to release number')
    }
  } catch (error: any) {
    throw new Error(error.message || 'Failed to release Twilio number')
  }
}

export function getEchoCost(country: string): number {
  // Monthly costs in NGN based on country
  const costs: Record<string, number> = {
    US: 15000,
    GB: 12000,
    CA: 10000,
    NG: 5000,
    IN: 8000,
  }
  return costs[country] || 10000
}
