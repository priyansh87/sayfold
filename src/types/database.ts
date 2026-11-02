export type SourceType = "book" | "podcast";
export type EntryType = "Idea" | "Vocab" | "Quote" | "Question" | "Note";

export interface Profile {
  id: string;
  display_name: string | null;
  created_at: string;
  [key: string]: unknown;
}

export interface Source {
  id: string;
  user_id: string;
  title: string;
  source_type: SourceType;
  creator: string | null;
  description: string | null;
  status: string;
  created_at: string;
  [key: string]: unknown;
}

export interface Chapter {
  id: string;
  source_id: string;
  user_id: string;
  title: string;
  chapter_number: number;
  created_at: string;
  [key: string]: unknown;
}

export interface VocabMetadata {
  word: string;
  meaning: string;
  example?: string;
}

export interface KnowledgeEntryMetadata {
  confidence?: number;
  requires_confirmation?: boolean;
  quote_attribution?: string | null;
  vocab?: VocabMetadata | null;
  [key: string]: unknown;
}

export interface KnowledgeEntry {
  id: string;
  user_id: string;
  source_id: string | null;
  chapter_id: string | null;
  entry_type: EntryType;
  title: string | null;
  original_transcription: string;
  cleaned_content: string;
  tags: string[];
  metadata: KnowledgeEntryMetadata;
  is_favourite: boolean;
  fts?: string;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export type GenericRelationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          display_name?: string | null;
          created_at?: string;
          [key: string]: unknown;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          created_at?: string;
          [key: string]: unknown;
        };
        Relationships: GenericRelationship[];
      };
      sources: {
        Row: Source;
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          source_type?: SourceType;
          creator?: string | null;
          description?: string | null;
          status?: string;
          created_at?: string;
          [key: string]: unknown;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          source_type?: SourceType;
          creator?: string | null;
          description?: string | null;
          status?: string;
          created_at?: string;
          [key: string]: unknown;
        };
        Relationships: GenericRelationship[];
      };
      chapters: {
        Row: Chapter;
        Insert: {
          id?: string;
          source_id: string;
          user_id: string;
          title: string;
          chapter_number?: number;
          created_at?: string;
          [key: string]: unknown;
        };
        Update: {
          id?: string;
          source_id?: string;
          user_id?: string;
          title?: string;
          chapter_number?: number;
          created_at?: string;
          [key: string]: unknown;
        };
        Relationships: GenericRelationship[];
      };
      knowledge_entries: {
        Row: KnowledgeEntry;
        Insert: {
          id?: string;
          user_id: string;
          source_id?: string | null;
          chapter_id?: string | null;
          entry_type: EntryType;
          title?: string | null;
          original_transcription: string;
          cleaned_content: string;
          tags?: string[];
          metadata?: KnowledgeEntryMetadata;
          is_favourite?: boolean;
          fts?: string;
          created_at?: string;
          updated_at?: string;
          [key: string]: unknown;
        };
        Update: {
          id?: string;
          user_id?: string;
          source_id?: string | null;
          chapter_id?: string | null;
          entry_type?: EntryType;
          title?: string | null;
          original_transcription?: string;
          cleaned_content?: string;
          tags?: string[];
          metadata?: KnowledgeEntryMetadata;
          is_favourite?: boolean;
          fts?: string;
          created_at?: string;
          updated_at?: string;
          [key: string]: unknown;
        };
        Relationships: GenericRelationship[];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
