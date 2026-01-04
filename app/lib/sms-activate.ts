import axios from 'axios'

const SMS_ACTIVATE_API_KEY = process.env.SMS_ACTIVATE_API_KEY!
const SMS_ACTIVATE_BASE_URL = 'https://api.sms-activate.org/stubs/handler_api.php'

// Exchange rate: 1 USD = 1600 NGN (approximate)
const USD_TO_NGN = 1600

export interface Country {
  id: number
  rus: string
  eng: string
  chn: string
  visible: boolean
  retry: boolean
  rent: boolean
  multiService: boolean
}

export interface Service {
  id: string
  name: string
}

export interface ServicePrice {
  country: number
  service: string
  cost: number // in USD
  count: number // available numbers
}

export interface CountryOption {
  code: string
  name: string
}

export interface ServiceOption {
  code: string
  name: string
  price: number // in NGN
  available: boolean
}

export interface GetNumberResponse {
  activationId: string
  phoneNumber: string
}

export interface GetStatusResponse {
  status: 'WAITING' | 'RECEIVED' | 'CANCELLED' | 'TIMEOUT'
  code?: string
}

// Get available countries from SMS-Activate
export async function getCountries(): Promise<Record<string, Country>> {
  try {
    const response = await axios.get(SMS_ACTIVATE_BASE_URL, {
      params: {
        api_key: SMS_ACTIVATE_API_KEY,
        action: 'getCountries',
      },
    })
    return response.data
  } catch (error: any) {
    console.error('Failed to fetch countries:', error.message)
    // Return fallback countries
    return {
      '0': { id: 0, rus: 'Россия', eng: 'Russia', chn: '俄罗斯', visible: true, retry: true, rent: true, multiService: true },
      '12': { id: 12, rus: 'США', eng: 'USA', chn: '美国', visible: true, retry: true, rent: true, multiService: true },
      '16': { id: 16, rus: 'Великобритания', eng: 'United Kingdom', chn: '英国', visible: true, retry: true, rent: true, multiService: true },
      '36': { id: 36, rus: 'Канада', eng: 'Canada', chn: '加拿大', visible: true, retry: true, rent: true, multiService: true },
      '22': { id: 22, rus: 'Индия', eng: 'India', chn: '印度', visible: true, retry: true, rent: true, multiService: true },
    }
  }
}

// Get available services from SMS-Activate
export async function getServices(): Promise<Record<string, string>> {
  try {
    const response = await axios.get('https://api.sms-activate.org/stubs/handler_api.php', {
      params: {
        api_key: SMS_ACTIVATE_API_KEY,
        action: 'getServices',
      },
    })
    return response.data
  } catch (error: any) {
    console.error('Failed to fetch services:', error.message)
    // Return fallback services
    return {
      wa: 'WhatsApp',
      go: 'Google',
      fb: 'Facebook',
      ig: 'Instagram',
      am: 'Amazon',
      tg: 'Telegram',
      tw: 'Twitter',
      mm: 'Microsoft',
    }
  }
}

// Get prices for services by country
export async function getPrices(country?: string): Promise<Record<string, Record<string, any>>> {
  try {
    const params: any = {
      api_key: SMS_ACTIVATE_API_KEY,
      action: 'getPrices',
    }

    if (country) {
      params.country = country
    }

    const response = await axios.get(SMS_ACTIVATE_BASE_URL, { params })
    return response.data
  } catch (error: any) {
    console.error('Failed to fetch prices:', error.message)
    return {}
  }
}

// Get number availability (count) for services
export async function getNumbersStatus(country?: string): Promise<Record<string, any>> {
  try {
    const params: any = {
      api_key: SMS_ACTIVATE_API_KEY,
      action: 'getNumbersStatus',
    }

    if (country) {
      params.country = country
    }

    const response = await axios.get(SMS_ACTIVATE_BASE_URL, { params })
    return response.data
  } catch (error: any) {
    console.error('Failed to fetch numbers status:', error.message)
    return {}
  }
}

// Helper function to format countries for frontend
export async function getFormattedCountries(): Promise<CountryOption[]> {
  const countries = await getCountries()
  return Object.entries(countries)
    .filter(([_, country]) => country.visible)
    .map(([code, country]) => ({
      code,
      name: country.eng,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

// Helper function to format services with prices for a specific country
export async function getFormattedServices(countryCode: string): Promise<ServiceOption[]> {
  const [services, prices, status] = await Promise.all([
    getServices(),
    getPrices(countryCode),
    getNumbersStatus(countryCode),
  ])

  const countryPrices = prices[countryCode] || {}
  const countryStatus = status[countryCode] || {}

  return Object.entries(services)
    .map(([code, name]) => {
      const serviceData = countryPrices[code] || {}
      const cost = serviceData.cost || 0
      const count = countryStatus[code]?.count || 0

      return {
        code,
        name: typeof name === 'string' ? name : code,
        price: Math.ceil(cost * USD_TO_NGN), // Convert USD to NGN
        available: count > 0,
      }
    })
    .filter(service => service.price > 0) // Only show services with prices
    .sort((a, b) => a.name.localeCompare(b.name))
}

export async function getNumber(
  country: string,
  service: string
): Promise<GetNumberResponse> {
  try {
    const response = await axios.get(SMS_ACTIVATE_BASE_URL, {
      params: {
        api_key: SMS_ACTIVATE_API_KEY,
        action: 'getNumber',
        service,
        country,
      },
    })

    const data = response.data

    if (typeof data === 'string' && data.startsWith('ACCESS_NUMBER')) {
      const parts = data.split(':')
      return {
        activationId: parts[1],
        phoneNumber: parts[2],
      }
    }

    throw new Error(data || 'Failed to get number')
  } catch (error: any) {
    throw new Error(error.response?.data || error.message || 'Failed to get number from SMS-Activate')
  }
}

export async function getStatus(activationId: string): Promise<GetStatusResponse> {
  try {
    const response = await axios.get(SMS_ACTIVATE_BASE_URL, {
      params: {
        api_key: SMS_ACTIVATE_API_KEY,
        action: 'getStatus',
        id: activationId,
      },
    })

    const data = response.data

    if (typeof data === 'string') {
      if (data.startsWith('STATUS_OK')) {
        return {
          status: 'RECEIVED',
          code: data.split(':')[1],
        }
      }
      if (data === 'STATUS_WAIT_CODE') {
        return { status: 'WAITING' }
      }
      if (data === 'STATUS_CANCEL') {
        return { status: 'CANCELLED' }
      }
    }

    return { status: 'WAITING' }
  } catch (error: any) {
    throw new Error(error.response?.data || error.message || 'Failed to get status')
  }
}

export async function setStatus(
  activationId: string,
  status: 'COMPLETED' | 'CANCELLED'
): Promise<void> {
  try {
    await axios.get(SMS_ACTIVATE_BASE_URL, {
      params: {
        api_key: SMS_ACTIVATE_API_KEY,
        action: 'setStatus',
        id: activationId,
        status: status === 'COMPLETED' ? 6 : 8,
      },
    })
  } catch (error: any) {
    // Ignore errors for status updates
    console.error('Failed to set status:', error.message)
  }
}
