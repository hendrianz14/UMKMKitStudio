export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          avatar_url: string | null
          locale: string | null
          created_at: string
          user_type: string | null // Added user_type
          main_goal: string | null // Added main_goal
          business_type: string | null // Added business_type
          info_source: string | null // Added info_source
          onboarding_completed_at: string | null // Added onboarding_completed_at
        }
        Insert: {
          id: string
          name?: string | null
          avatar_url?: string | null
          locale?: string | null
          created_at?: string
          user_type?: string | null
          main_goal?: string | null
          business_type?: string | null
          info_source?: string | null
          onboarding_completed_at?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          avatar_url?: string | null
          locale?: string | null
          created_at?: string
          user_type?: string | null
          main_goal?: string | null
          business_type?: string | null
          info_source?: string | null
          onboarding_completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      credits_wallet: {
        Row: {
          user_id: string
          balance: number
          plan: string
          expires_at: string | null
          updated_at: string
        }
        Insert: {
          user_id: string
          balance?: number
          plan?: string
          expires_at?: string | null
          updated_at?: string
        }
        Update: {
          user_id?: string
          balance?: number
          plan?: string
          expires_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "credits_wallet_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      credits_ledger: {
        Row: {
          id: string
          user_id: string
          change: number
          reason: string
          job_id: string | null
          meta: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          change: number
          reason: string
          job_id?: string | null
          meta?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          change?: number
          reason?: string
          job_id?: string | null
          meta?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "credits_ledger_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credits_ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          id: string
          user_id: string
          title: string | null
          cover_url: string | null
          updated_at: string
          status: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          cover_url?: string | null
          updated_at?: string
          status?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          cover_url?: string | null
          updated_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          id: string
          project_id: string
          user_id: string
          image_url: string | null
          thumb_url: string | null
          meta: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          image_url?: string | null
          thumb_url?: string | null
          meta?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          image_url?: string | null
          thumb_url?: string | null
          meta?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          id: string
          user_id: string
          project_id: string
          type: string
          status: string
          input_url: string | null
          output_url: string | null
          tokens_used: number | null
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          type: string
          status?: string
          input_url?: string | null
          output_url?: string | null
          tokens_used?: number | null
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          type?: string
          status?: string
          input_url?: string | null
          output_url?: string | null
          tokens_used?: number | null
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
