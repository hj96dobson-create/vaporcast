export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          source: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          source?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          source?: string;
        };
        Relationships: [];
      };
      avatar_favorites: {
        Row: {
          avatar_key: string;
          created_at: string;
          id: string;
          user_id: string;
        };
        Insert: {
          avatar_key: string;
          created_at?: string;
          id?: string;
          user_id: string;
        };
        Update: {
          avatar_key?: string;
          created_at?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      avatar_history: {
        Row: {
          avatar_key: string;
          background: string;
          created_at: string;
          emotion: string;
          id: string;
          language: string;
          personality: string;
          script: string;
          source: string;
          style: string;
          user_id: string;
          voice: string;
        };
        Insert: {
          avatar_key: string;
          background: string;
          created_at?: string;
          emotion: string;
          id?: string;
          language: string;
          personality: string;
          script: string;
          source?: string;
          style: string;
          user_id: string;
          voice: string;
        };
        Update: {
          avatar_key?: string;
          background?: string;
          created_at?: string;
          emotion?: string;
          id?: string;
          language?: string;
          personality?: string;
          script?: string;
          source?: string;
          style?: string;
          user_id?: string;
          voice?: string;
        };
        Relationships: [];
      };
      avatar_projects: {
        Row: {
          avatar_key: string;
          background: string;
          created_at: string;
          emotion: string;
          id: string;
          language: string;
          script: string;
          status: string;
          style: string;
          title: string;
          user_id: string;
          video_job_id: string | null;
          voice: string;
        };
        Insert: {
          avatar_key: string;
          background: string;
          created_at?: string;
          emotion: string;
          id?: string;
          language: string;
          script: string;
          status?: string;
          style: string;
          title: string;
          user_id: string;
          video_job_id?: string | null;
          voice: string;
        };
        Update: {
          avatar_key?: string;
          background?: string;
          created_at?: string;
          emotion?: string;
          id?: string;
          language?: string;
          script?: string;
          status?: string;
          style?: string;
          title?: string;
          user_id?: string;
          video_job_id?: string | null;
          voice?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          updated_at: string;
          user_id: string;
          username: string | null;
        };
        Insert: {
          created_at?: string;
          updated_at?: string;
          user_id: string;
          username?: string | null;
        };
        Update: {
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          username?: string | null;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      video_jobs: {
        Row: {
          avatar_key: string;
          id: string;
          prompt: string;
          status: "processing" | "complete" | "failed";
          created_at: string;
          user_id: string | null;
          video_url: string | null;
        };
        Insert: {
          avatar_key?: string;
          created_at?: string;
          id?: string;
          prompt: string;
          status?: "processing" | "complete" | "failed";
          user_id?: string | null;
          video_url?: string | null;
        };
        Update: {
          avatar_key?: string;
          created_at?: string;
          id?: string;
          prompt?: string;
          status?: "processing" | "complete" | "failed";
          user_id?: string | null;
          video_url?: string | null;
        };
        Relationships: [];
      };
      waitlist: {
        Row: {
          confirmation_token: string | null;
          confirmed_at: string | null;
          created_at: string;
          discount_tier: "vip" | "standard";
          email: string;
          email_normalized: string;
          id: string;
          is_founding_vip: boolean;
          rejection_reason: string | null;
          source: string;
          status: "pending" | "confirmed" | "rejected";
        };
        Insert: {
          confirmation_token?: string | null;
          confirmed_at?: string | null;
          created_at?: string;
          discount_tier?: "vip" | "standard";
          email: string;
          email_normalized: string;
          id?: string;
          is_founding_vip?: boolean;
          rejection_reason?: string | null;
          source?: string;
          status?: "pending" | "confirmed" | "rejected";
        };
        Update: {
          confirmation_token?: string | null;
          confirmed_at?: string | null;
          created_at?: string;
          discount_tier?: "vip" | "standard";
          email?: string;
          email_normalized?: string;
          id?: string;
          is_founding_vip?: boolean;
          rejection_reason?: string | null;
          source?: string;
          status?: "pending" | "confirmed" | "rejected";
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      confirm_waitlist: {
        Args: { _token: string };
        Returns: {
          discount_tier: "vip" | "standard";
          email: string;
          id: string;
          is_founding_vip: boolean;
          status: "pending" | "confirmed" | "rejected";
        }[];
      };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "moderator" | "user";
    };
    CompositeTypes: Record<string, never>;
  };
};
