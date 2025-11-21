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
          referral_code: string | null
          stripe_customer_id: string | null
          total_referral_earnings: number | null
          created_at: string | null
        }
        Insert: {
          id: string
          email: string
          referral_code?: string | null
          stripe_customer_id?: string | null
          total_referral_earnings?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          referral_code?: string | null
          stripe_customer_id?: string | null
          total_referral_earnings?: number | null
          created_at?: string | null
        }
      }
      trips: {
        Row: {
          id: string
          user_id: string
          airline_code: string
          flight_number: string
          scheduled_departure: string
          ticket_price: number | null
          status: 'UPCOMING' | 'COMPLETED' | 'CANCELED' | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          airline_code: string
          flight_number: string
          scheduled_departure: string
          ticket_price?: number | null
          status?: 'UPCOMING' | 'COMPLETED' | 'CANCELED' | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          airline_code?: string
          flight_number?: string
          scheduled_departure?: string
          ticket_price?: number | null
          status?: 'UPCOMING' | 'COMPLETED' | 'CANCELED' | null
          created_at?: string | null
        }
      }
      claims: {
        Row: {
          id: string
          trip_id: string
          user_id: string
          status: 'DRAFT' | 'PAID_UNLOCK' | 'SUBMITTED' | 'APPROVED' | null
          estimated_payout: number | null
          is_unlocked: boolean | null
          stripe_session_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          trip_id: string
          user_id: string
          status?: 'DRAFT' | 'PAID_UNLOCK' | 'SUBMITTED' | 'APPROVED' | null
          estimated_payout?: number | null
          is_unlocked?: boolean | null
          stripe_session_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          trip_id?: string
          user_id?: string
          status?: 'DRAFT' | 'PAID_UNLOCK' | 'SUBMITTED' | 'APPROVED' | null
          estimated_payout?: number | null
          is_unlocked?: boolean | null
          stripe_session_id?: string | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      trip_status: 'UPCOMING' | 'COMPLETED' | 'CANCELED'
      claim_status: 'DRAFT' | 'PAID_UNLOCK' | 'SUBMITTED' | 'APPROVED'
    }
  }
}

