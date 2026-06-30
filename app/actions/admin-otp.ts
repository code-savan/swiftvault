'use server'

import { revalidatePath } from 'next/cache'
import { isAdmin } from './admin'
import { supabase } from '@/app/lib/supabase'
import { getServices } from '@/app/lib/sms-activate'
import { getPricingTiers as getPricingTiersFromDB } from '@/app/lib/otp-pricing'

export async function getAdminOtpServices() {
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized')

  const { data } = await supabase
    .from('otp_services')
    .select('*')
    .order('name', { ascending: true })

  return { services: data || [] }
}

export async function syncOtpServices() {
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized')

  const services = await getServices()
  const entries = Object.entries(services)

  for (const [code, name] of entries) {
    await supabase
      .from('otp_services')
      .upsert({ code, name: typeof name === 'string' ? name : code }, { onConflict: 'code' })
  }

  revalidatePath('/admin/otp')
  return { synced: entries.length }
}

export async function updateOtpService(
  code: string,
  data: { visible?: boolean; custom_price?: number | null }
) {
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized')

  const update: Record<string, any> = { updated_at: new Date().toISOString() }
  if (data.visible !== undefined) update.visible = data.visible
  if (data.custom_price !== undefined) update.custom_price = data.custom_price

  await supabase.from('otp_services').update(update).eq('code', code)

  revalidatePath('/admin/otp')
}

export async function getAdminPricingTiers() {
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized')

  const { data } = await supabase
    .from('otp_pricing')
    .select('*')
    .order('min_ngn', { ascending: true })

  return { tiers: data || [] }
}

export async function updatePricingTier(
  id: number,
  data: { min_ngn?: number; max_ngn?: number | null; multiplier?: number }
) {
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized')

  const update: Record<string, any> = { updated_at: new Date().toISOString() }
  if (data.min_ngn !== undefined) update.min_ngn = data.min_ngn
  if (data.max_ngn !== undefined) update.max_ngn = data.max_ngn
  if (data.multiplier !== undefined) update.multiplier = data.multiplier

  await supabase.from('otp_pricing').update(update).eq('id', id)

  revalidatePath('/admin/otp')
}
