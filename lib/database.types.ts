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
      assets: {
        Row: {
          created_at: string
          id: string
          image_url: string
          meta: Json | null
          project_id: string
          thumb_url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          meta?: Json | null
          project_id: string
          thumb_url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          meta?: Json | null
          project_id?: string
          thumb_url?: string | null
          user_id?: string
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
      credits_ledger: {
        Row: {
          change: number
          created_at: string
          id: string
          job_id: string | null
          meta: Json | null
          reason: Database["public"]["Enums"]["reason_type"]
          user_id: string
        }
        Insert: {
          change: number
          created_at?: string
          id?: string
          job_id?: string | null
          meta?: Json | null
          reason: Database["public"]["Enums"]["reason_type"]
          user_id: string
        }
        Update: {
          change?: number
          created_at?: string
          id?: string
          job_id?: string | null
          meta?: Json | null
          reason?: Database["public"]["Enums"]["reason_type"]
          user_id?: string
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
      credits_wallet: {
        Row: {
          balance: number
          expires_at: string | null
          plan: Database["public"]["Enums"]["plan_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          expires_at?: string | null
          plan?: Database["public"]["Enums"]["plan_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          expires_at?: string | null
          plan?: Database["public"]["Enums"]["plan_type"]
          updated_at?: string
          user_id?: string
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
      jobs: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          input_url: string | null
          output_url: string | null
          project_id: string | null
          status: Database["public"]["Enums"]["job_status"]
          tokens_used: number | null
          type: Database["public"]["Enums"]["job_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          input_url?: string | null
          output_url?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          tokens_used?: number | null
          type: Database["public"]["Enums"]["job_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          input_url?: string | null
          output_url?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          tokens_used?: number | null
          type?: Database["public"]["Enums"]["job_type"]
          updated_at?: string
          user_id?: string
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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          locale: Database["public"]["Enums"]["profile_locale"]
          name: string | null
          user_type: string | null
          main_goal: string | null
          business_type: string | null
          info_source: string | null
          onboarding_completed_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          locale?: Database["public"]["Enums"]["profile_locale"]
          name?: string | null
          user_type?: string | null
          main_goal?: string | null
          business_type?: string | null
          info_source?: string | null
          onboarding_completed_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          locale?: Database["public"]["Enums"]["profile_locale"]
          name?: string | null
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
      projects: {
        Row: {
          cover_url: string | null
          id: string
          status: Database["public"]["Enums"]["project_status"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cover_url?: string | null
          id?: string
          status?: Database["public"]["Enums"]["project_status"]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cover_url?: string | null
          id?: string
          status?: Database["public"]["Enums"]["project_status"]
          title?: string
          updated_at?: string
          user_id?: string
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
    }
    Views: {
      [_ in string]: {
        Row: Record<string, unknown>
      }
    }
    Functions: {
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: Record<string, unknown>
      }
      set_updated_at: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      job_status: "queued" | "processing" | "done" | "error"
      job_type: "generate" | "remove_bg" | "template"
      plan_type: "free" | "pro" | "enterprise"
      profile_locale: "id" | "en"
      project_status: "active" | "archived"
      reason_type: "generate" | "template" | "topup" | "bonus" | "trial"
    }
    CompositeTypes: {
      [_ in string]: Record<string, unknown>
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
