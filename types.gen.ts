export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      build_likes: {
        Row: {
          build_id: number
          created_at: string
          user_id: string
        }
        Insert: {
          build_id?: number
          created_at?: string
          user_id: string
        }
        Update: {
          build_id?: number
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "build_likes_build_id_fkey"
            columns: ["build_id"]
            referencedRelation: "builds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "build_likes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      builds: {
        Row: {
          breaks_in_version_int: number | null
          created_at: string
          description: string
          extra_images: string[]
          full_text_search: unknown | null
          id: number
          likes_count: number
          title: string
          user_id: string
          works_in_version_int: number | null
        }
        Insert: {
          breaks_in_version_int?: number | null
          created_at?: string
          description?: string
          extra_images?: string[]
          full_text_search?: unknown | null
          id?: number
          likes_count?: number
          title: string
          user_id: string
          works_in_version_int?: number | null
        }
        Update: {
          breaks_in_version_int?: number | null
          created_at?: string
          description?: string
          extra_images?: string[]
          full_text_search?: unknown | null
          id?: number
          likes_count?: number
          title?: string
          user_id?: string
          works_in_version_int?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "builds_id_fkey"
            columns: ["id"]
            referencedRelation: "schematics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "builds_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      schematics: {
        Row: {
          created_at: string
          id: number
          object_path: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          object_path: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          object_path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schematics_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          avatar_path: string | null
          bio: string
          created_at: string
          id: string
          numeric_id: number
          username: string
        }
        Insert: {
          avatar_path?: string | null
          bio?: string
          created_at?: string
          id: string
          numeric_id?: number
          username: string
        }
        Update: {
          avatar_path?: string | null
          bio?: string
          created_at?: string
          id?: string
          numeric_id?: number
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "user_info"
            referencedColumns: ["id"]
          }
        ]
      }
      users_private: {
        Row: {
          api_token: string | null
          id: string
        }
        Insert: {
          api_token?: string | null
          id: string
        }
        Update: {
          api_token?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_private_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      user_info: {
        Row: {
          banned_until: string | null
          id: string | null
          role: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      ban_user: {
        Args: {
          user_id: string
          until_date: string
        }
        Returns: string
      }
      set_role: {
        Args: {
          user_id: string
          new_role: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "user_info"
            referencedColumns: ["id"]
          }
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
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

