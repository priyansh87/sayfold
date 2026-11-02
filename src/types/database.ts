export type SourceType = "book" | "podcast";
export type EntryType = "Idea" | "Vocab" | "Quote" | "Question" | "Note";

export interface Profile {
  id: string;
  display_name: string | null;
  created_at: string;
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
}

export interface Chapter {
  id: string;
  source_id: string;
  user_id: string;
  title: string;
  chapter_number: number;
  created_at: string;
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
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
      sources: {
        Row: Source;
        Insert: Omit<Source, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Source>;
      };
      chapters: {
        Row: Chapter;
        Insert: Omit<Chapter, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Chapter>;
      };
      knowledge_entries: {
        Row: KnowledgeEntry;
        Insert: Omit<KnowledgeEntry, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<KnowledgeEntry>;
      };
    };
  };
}

