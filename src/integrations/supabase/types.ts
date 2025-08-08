export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          activity_type: string
          admin_id: string
          admin_name: string
          amount: number | null
          created_at: string
          description: string
          id: string
          metadata: Json | null
          record_id: string | null
          table_affected: string | null
          timestamp: string
        }
        Insert: {
          activity_type: string
          admin_id: string
          admin_name: string
          amount?: number | null
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          record_id?: string | null
          table_affected?: string | null
          timestamp?: string
        }
        Update: {
          activity_type?: string
          admin_id?: string
          admin_name?: string
          amount?: number | null
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          record_id?: string | null
          table_affected?: string | null
          timestamp?: string
        }
        Relationships: []
      }
      admin_activities: {
        Row: {
          action: string
          admin_id: string
          admin_name: string
          details: string
          id: string
          timestamp: string
        }
        Insert: {
          action: string
          admin_id: string
          admin_name: string
          details: string
          id?: string
          timestamp?: string
        }
        Update: {
          action?: string
          admin_id?: string
          admin_name?: string
          details?: string
          id?: string
          timestamp?: string
        }
        Relationships: []
      }
      admin_collections: {
        Row: {
          admin_id: string
          admin_name: string
          amount: number
          created_at: string
          date: string
          id: string
        }
        Insert: {
          admin_id: string
          admin_name: string
          amount: number
          created_at?: string
          date: string
          id?: string
        }
        Update: {
          admin_id?: string
          admin_name?: string
          amount?: number
          created_at?: string
          date?: string
          id?: string
        }
        Relationships: []
      }
      admin_credentials_reference: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          notes: string | null
          temp_password: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          notes?: string | null
          temp_password: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          notes?: string | null
          temp_password?: string
        }
        Relationships: []
      }
      admin_expenses: {
        Row: {
          admin_id: string
          admin_name: string
          amount: number
          created_at: string
          date: string
          id: string
          purpose: string
        }
        Insert: {
          admin_id: string
          admin_name: string
          amount: number
          created_at?: string
          date: string
          id?: string
          purpose: string
        }
        Update: {
          admin_id?: string
          admin_name?: string
          amount?: number
          created_at?: string
          date?: string
          id?: string
          purpose?: string
        }
        Relationships: []
      }
      admin_performance: {
        Row: {
          activities_count: number | null
          admin_id: string
          admin_name: string
          created_at: string
          date: string
          id: string
          login_time: string | null
          logout_time: string | null
          session_duration: unknown | null
          total_donations_collected: number | null
          total_expenses_recorded: number | null
          total_people_registered: number | null
          total_schedules_created: number | null
          updated_at: string
        }
        Insert: {
          activities_count?: number | null
          admin_id: string
          admin_name: string
          created_at?: string
          date?: string
          id?: string
          login_time?: string | null
          logout_time?: string | null
          session_duration?: unknown | null
          total_donations_collected?: number | null
          total_expenses_recorded?: number | null
          total_people_registered?: number | null
          total_schedules_created?: number | null
          updated_at?: string
        }
        Update: {
          activities_count?: number | null
          admin_id?: string
          admin_name?: string
          created_at?: string
          date?: string
          id?: string
          login_time?: string | null
          logout_time?: string | null
          session_duration?: unknown | null
          total_donations_collected?: number | null
          total_expenses_recorded?: number | null
          total_people_registered?: number | null
          total_schedules_created?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          created_at: string
          id: string
          setting_name: string
          setting_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_name: string
          setting_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_name?: string
          setting_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          category: string | null
          content: string
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          priority: number | null
          target_audience: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          target_audience?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          target_audience?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          created_at: string
          donor_name: string | null
          donor_phone: string | null
          id: string
          payment_method: string
          person_id: string | null
          person_name: string
          receiving_admin_id: string
          receiving_admin_name: string
        }
        Insert: {
          amount: number
          created_at?: string
          donor_name?: string | null
          donor_phone?: string | null
          id?: string
          payment_method: string
          person_id?: string | null
          person_name: string
          receiving_admin_id: string
          receiving_admin_name: string
        }
        Update: {
          amount?: number
          created_at?: string
          donor_name?: string | null
          donor_phone?: string | null
          id?: string
          payment_method?: string
          person_id?: string | null
          person_name?: string
          receiving_admin_id?: string
          receiving_admin_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "donations_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "persons"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_transactions: {
        Row: {
          admin_id: string
          admin_name: string
          amount: number
          created_at: string
          date: string
          description: string
          donor_phone: string | null
          id: string
          payment_method: string | null
          person_id: string | null
          person_name: string | null
          transaction_type: string
          updated_at: string
        }
        Insert: {
          admin_id: string
          admin_name: string
          amount: number
          created_at?: string
          date?: string
          description: string
          donor_phone?: string | null
          id?: string
          payment_method?: string | null
          person_id?: string | null
          person_name?: string | null
          transaction_type: string
          updated_at?: string
        }
        Update: {
          admin_id?: string
          admin_name?: string
          amount?: number
          created_at?: string
          date?: string
          description?: string
          donor_phone?: string | null
          id?: string
          payment_method?: string | null
          person_id?: string | null
          person_name?: string | null
          transaction_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      people_management: {
        Row: {
          address: string
          admin_id: string
          admin_name: string
          created_at: string
          email: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          id: string
          is_active: boolean | null
          last_donation_date: string | null
          name: string
          notes: string | null
          phone_number: string
          preferred_payment_method: string | null
          registration_date: string | null
          total_donations: number | null
          updated_at: string
        }
        Insert: {
          address: string
          admin_id: string
          admin_name: string
          created_at?: string
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          id?: string
          is_active?: boolean | null
          last_donation_date?: string | null
          name: string
          notes?: string | null
          phone_number: string
          preferred_payment_method?: string | null
          registration_date?: string | null
          total_donations?: number | null
          updated_at?: string
        }
        Update: {
          address?: string
          admin_id?: string
          admin_name?: string
          created_at?: string
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          id?: string
          is_active?: boolean | null
          last_donation_date?: string | null
          name?: string
          notes?: string | null
          phone_number?: string
          preferred_payment_method?: string | null
          registration_date?: string | null
          total_donations?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      persons: {
        Row: {
          address: string
          admin_id: string
          admin_name: string
          amount_paid: number | null
          created_at: string
          id: string
          name: string
          payment_method: string | null
          phone_number: string
          updated_at: string
        }
        Insert: {
          address: string
          admin_id: string
          admin_name: string
          amount_paid?: number | null
          created_at?: string
          id?: string
          name: string
          payment_method?: string | null
          phone_number: string
          updated_at?: string
        }
        Update: {
          address?: string
          admin_id?: string
          admin_name?: string
          amount_paid?: number | null
          created_at?: string
          id?: string
          name?: string
          payment_method?: string | null
          phone_number?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          email: string
          id: string
          last_login_at: string | null
          name: string
          phone_number: string | null
          role: string | null
          status: string | null
          total_login_time: unknown | null
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          email: string
          id?: string
          last_login_at?: string | null
          name: string
          phone_number?: string | null
          role?: string | null
          status?: string | null
          total_login_time?: unknown | null
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          email?: string
          id?: string
          last_login_at?: string | null
          name?: string
          phone_number?: string | null
          role?: string | null
          status?: string | null
          total_login_time?: unknown | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      schedule_events: {
        Row: {
          admin_id: string
          admin_name: string
          attendees_expected: number | null
          created_at: string
          description: string | null
          end_time: string | null
          event_date: string
          id: string
          is_active: boolean | null
          location: string | null
          organizer: string | null
          priority: number | null
          start_time: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          admin_id: string
          admin_name: string
          attendees_expected?: number | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          event_date: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          organizer?: string | null
          priority?: number | null
          start_time?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          admin_id?: string
          admin_name?: string
          attendees_expected?: number | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          event_date?: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          organizer?: string | null
          priority?: number | null
          start_time?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      schedules: {
        Row: {
          created_at: string
          created_by: string
          date: string
          description: string | null
          id: string
          is_active: boolean | null
          location: string | null
          organizer: string | null
          priority: number | null
          time_end: string | null
          time_start: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          date: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          organizer?: string | null
          priority?: number | null
          time_end?: string | null
          time_start?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          date?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          organizer?: string | null
          priority?: number | null
          time_end?: string | null
          time_start?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_admin: {
        Args: { target_user_id: string; approver_id: string }
        Returns: boolean
      }
      get_approved_admin_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      log_activity: {
        Args: {
          admin_id_param: string
          admin_name_param: string
          activity_type_param: string
          description_param: string
          metadata_param?: Json
          table_affected_param?: string
          record_id_param?: string
          amount_param?: number
        }
        Returns: string
      }
      update_admin_performance_stats: {
        Args: { admin_id_param: string; admin_name_param: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
