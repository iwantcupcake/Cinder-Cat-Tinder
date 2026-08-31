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
      cat_images: {
        Row: {
          id: string
          url: string
          source: string | null
          breed: string | null
          color: string | null
          tags: Json
          width: number | null
          height: number | null
          created_at: string
        }
        Insert: {
          id?: string
          url: string
          source?: string | null
          breed?: string | null
          color?: string | null
          tags?: Json
          width?: number | null
          height?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          url?: string
          source?: string | null
          breed?: string | null
          color?: string | null
          tags?: Json
          width?: number | null
          height?: number | null
          created_at?: string
        }
      }
      swipes: {
        Row: {
          id: string
          user_id: string
          cat_image_id: string
          direction: 'like' | 'nope'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          cat_image_id: string
          direction: 'like' | 'nope'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          cat_image_id?: string
          direction?: 'like' | 'nope'
          created_at?: string
        }
      }
      compatibility_checks: {
        Row: {
          id: string
          user_a_id: string
          user_b_id: string
          score: number
          explanation: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_a_id: string
          user_b_id: string
          score: number
          explanation?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_a_id?: string
          user_b_id?: string
          score?: number
          explanation?: string | null
          created_at?: string
        }
      }
    }
  }
}
