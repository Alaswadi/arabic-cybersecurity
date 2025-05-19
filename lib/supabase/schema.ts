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
      blog_posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          slug: string
          excerpt: string | null
          content: string
          featured_image: string | null
          published: boolean
          published_at: string | null
          author_id: string | null
          category: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          slug: string
          excerpt?: string | null
          content: string
          featured_image?: string | null
          published?: boolean
          published_at?: string | null
          author_id?: string | null
          category?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string
          featured_image?: string | null
          published?: boolean
          published_at?: string | null
          author_id?: string | null
          category?: string | null
        }
      }
      services: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          icon: string | null
          image: string | null
          featured: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          icon?: string | null
          image?: string | null
          featured?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          icon?: string | null
          image?: string | null
          featured?: boolean
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
      [_ in never]: never
    }
  }
}
