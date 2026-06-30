export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          wallet_balance: number
          full_name: string | null
          phone_number: string | null
          username: string | null
          preferences: Json
          referred_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          wallet_balance?: number
          full_name?: string | null
          phone_number?: string | null
          username?: string | null
          preferences?: Json
          referred_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          wallet_balance?: number
          full_name?: string | null
          phone_number?: string | null
          username?: string | null
          preferences?: Json
          referred_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      referral_codes: {
        Row: {
          id: string
          code: string
          influencer_id: string
          discount_percent: number
          commission_percent: number
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          influencer_id: string
          discount_percent?: number
          commission_percent?: number
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          influencer_id?: string
          discount_percent?: number
          commission_percent?: number
          active?: boolean
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: 'topup' | 'purchase' | 'commission' | 'refund'
          description: string | null
          referral_code_id: string | null
          status: 'pending' | 'completed' | 'failed'
          paystack_reference: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: 'topup' | 'purchase' | 'commission' | 'refund'
          description?: string | null
          referral_code_id?: string | null
          status?: 'pending' | 'completed' | 'failed'
          paystack_reference?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          type?: 'topup' | 'purchase' | 'commission' | 'refund'
          description?: string | null
          referral_code_id?: string | null
          status?: 'pending' | 'completed' | 'failed'
          paystack_reference?: string | null
          created_at?: string
        }
      }
      otp_requests: {
        Row: {
          id: string
          user_id: string
          country_code: string
          service: string
          provider_number_id: string | null
          phone_number: string | null
          status: 'pending' | 'received' | 'failed' | 'timeout'
          otp: string | null
          amount_paid: number | null
          referral_code_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          country_code: string
          service: string
          provider_number_id?: string | null
          phone_number?: string | null
          status?: 'pending' | 'received' | 'failed' | 'timeout'
          otp?: string | null
          amount_paid?: number | null
          referral_code_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          country_code?: string
          service?: string
          provider_number_id?: string | null
          phone_number?: string | null
          status?: 'pending' | 'received' | 'failed' | 'timeout'
          otp?: string | null
          amount_paid?: number | null
          referral_code_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      echo_numbers: {
        Row: {
          id: string
          user_id: string
          twilio_sid: string
          phone_number: string
          country: string
          expiry_date: string
          active: boolean
          monthly_cost: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          twilio_sid: string
          phone_number: string
          country: string
          expiry_date: string
          active?: boolean
          monthly_cost: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          twilio_sid?: string
          phone_number?: string
          country?: string
          expiry_date?: string
          active?: boolean
          monthly_cost?: number
          created_at?: string
          updated_at?: string
        }
      }
      echo_messages: {
        Row: {
          id: string
          echo_number_id: string
          from_number: string
          message_body: string
          received_at: string
        }
        Insert: {
          id?: string
          echo_number_id: string
          from_number: string
          message_body: string
          received_at?: string
        }
        Update: {
          id?: string
          echo_number_id?: string
          from_number?: string
          message_body?: string
          received_at?: string
        }
      }
    }
  }
}
