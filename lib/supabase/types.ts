export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: number // Changed from string to number
          name: string
          age: number
          location: string
          price: number
          featured: boolean
          verified: boolean
          status: "pending" | "approved" | "rejected" | "suspended"
          description: string | null
          height: string | null
          education: string | null
          profession: string | null
          languages: string[] | null
          interests: string[] | null
          relationship_status: string | null
          children: string | null
          smoking: string | null
          drinking: string | null
          body_type: string | null
          appearance: string | null
          looking_for: string[] | null
          contact_email: string | null
          contact_phone: string | null
          contact_whatsapp: string | null
          contact_instagram: string | null
          contact_tiktok: string | null
          contact_facebook: string | null
          contact_telegram: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: number // Changed from string to number
          name: string
          age: number
          location: string
          price?: number
          featured?: boolean
          verified?: boolean
          status?: "pending" | "approved" | "rejected" | "suspended"
          description?: string | null
          height?: string | null
          education?: string | null
          profession?: string | null
          languages?: string[] | null
          interests?: string[] | null
          relationship_status?: string | null
          children?: string | null
          smoking?: string | null
          drinking?: string | null
          body_type?: string | null
          appearance?: string | null
          looking_for?: string[] | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_whatsapp?: string | null
          contact_instagram?: string | null
          contact_tiktok?: string | null
          contact_facebook?: string | null
          contact_telegram?: string | null
          created_by?: string | null
        }
        Update: {
          id?: number // Changed from string to number
          name?: string
          age?: number
          location?: string
          price?: number
          featured?: boolean
          verified?: boolean
          status?: "pending" | "approved" | "rejected" | "suspended"
          description?: string | null
          height?: string | null
          education?: string | null
          profession?: string | null
          languages?: string[] | null
          interests?: string[] | null
          relationship_status?: string | null
          children?: string | null
          smoking?: string | null
          drinking?: string | null
          body_type?: string | null
          appearance?: string | null
          looking_for?: string[] | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_whatsapp?: string | null
          contact_instagram?: string | null
          contact_tiktok?: string | null
          contact_facebook?: string | null
          contact_telegram?: string | null
          created_by?: string | null
        }
      }
      profile_images: {
        Row: {
          id: string
          profile_id: number // Changed from string to number
          image_url: string
          is_primary: boolean
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: number // Changed from string to number
          image_url: string
          is_primary?: boolean
          display_order?: number
        }
        Update: {
          id?: string
          profile_id?: number // Changed from string to number
          image_url?: string
          is_primary?: boolean
          display_order?: number
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          updated_at: string
          favorite_profiles: number[] | null // Changed from string[] to number[]
          notification_preferences: Json
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          favorite_profiles?: number[] | null // Changed from string[] to number[]
          notification_preferences?: Json
        }
        Update: {
          email?: string
          full_name?: string | null
          favorite_profiles?: number[] | null // Changed from string[] to number[]
          notification_preferences?: Json
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          profile_id: number // Changed from string to number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          profile_id: number // Changed from string to number
          price: number
        }
        Update: {
          price?: number
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          total_amount: number
          processing_fee: number
          status: "pending" | "completed" | "failed" | "refunded"
          payment_intent_id: string | null
          billing_email: string | null
          billing_name: string | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          total_amount: number
          processing_fee?: number
          status?: "pending" | "completed" | "failed" | "refunded"
          payment_intent_id?: string | null
          billing_email?: string | null
          billing_name?: string | null
        }
        Update: {
          status?: "pending" | "completed" | "failed" | "refunded"
          payment_intent_id?: string | null
          completed_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          profile_id: number // Changed from string to number
          profile_name: string
          price: number
          delivered_contact_info: Json | null
          delivered_at: string | null
        }
        Insert: {
          id?: string
          order_id: string
          profile_id: number // Changed from string to number
          profile_name: string
          price: number
        }
        Update: {
          delivered_contact_info?: Json | null
          delivered_at?: string | null
        }
      }
      contact_deliveries: {
        Row: {
          id: string
          order_item_id: string
          user_id: string
          profile_id: number // Changed from string to number
          contact_data: Json
          delivered_at: string
          accessed_at: string | null
        }
        Insert: {
          id?: string
          order_item_id: string
          user_id: string
          profile_id: number // Changed from string to number
          contact_data: Json
        }
        Update: {
          accessed_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_cart_total: {
        Args: {
          user_uuid: string
        }
        Returns: {
          item_count: number
          subtotal: number
          processing_fee: number
          total: number
        }[]
      }
      create_order_from_cart: {
        Args: {
          user_uuid: string
          billing_email_param: string
          billing_name_param: string
        }
        Returns: string
      }
      deliver_contact_info: {
        Args: {
          order_uuid: string
        }
        Returns: void
      }
      search_profiles: {
        Args: {
          search_query?: string
          location_filter?: string
          min_age?: number
          max_age?: number
          interests_filter?: string[]
          featured_only?: boolean
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          id: number // Changed from string to number
          name: string
          age: number
          location: string
          price: number
          featured: boolean
          description: string
          interests: string[]
          primary_image: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
