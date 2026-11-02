"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Lightbulb,
  Bookmark,
  Quote as QuoteIcon,
  HelpCircle,
  FileText,
  Star,
  Edit2,
  Trash2,
  BookOpen,
  ArrowUpRight,
  Layers,
} from "lucide-react";
import { deleteEntry, toggleFavourite } from "@/app/vault/actions";
import { EditEntryModal } from "@/components/vault/EditEntryModal";
import type { KnowledgeEntry, EntryType, Source, Chapter } from "@/types/database";

interface EntryWithRelations extends KnowledgeEntry {
  sources?: { id: string; title: string; source_type: string } | null;
  chapters?: { id: string; title: string; chapter_number: number } | null;
}

interface VaultClientProps {
  initialEntries: EntryWithRelations[];
  sources: Source[];
  chapters: Chapter[];
}

export function VaultClient({
  initialEntries,
  sources,
  chapters,
}: VaultClientProps) {
  const [entries, setEntries] = useState<EntryWithRelations[]>(initialEntries);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"All" | EntryType>("All");
  const [selectedSourceId, setSelectedSourceId] = useState<string>("All");
  const [onlyFavourites, setOnlyFavourites] = useState(false);

  const [editingEntry, setEditingEntry] = useState<KnowledgeEntry | null>(null);

  // Filter entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Type filter
      if (selectedType !== "All" && entry.entry_type !== selectedType) {
        return false;
      }

      // Source filter
      if (selectedSourceId !== "All" && entry.source_id !== selectedSourceId) {
        return false;
      }

      // Favourites filter
      if (onlyFavourites && !entry.is_favourite) {
        return false;
      }

      // Search query (case-insensitive search in title, cleaned_content, and transcription)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = entry.title?.toLowerCase().includes(query);
        const matchesContent = entry.cleaned_content.toLowerCase().includes(query);
        const matchesRaw = entry.original_transcription.toLowerCase().includes(query);
        const matchesVocab = entry.metadata?.vocab?.word?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesContent && !matchesRaw && !matchesVocab) {
          return false;
        }
      }

      return true;
    });
  }, [entries, selectedType, selectedSourceId, onlyFavourites, searchQuery]);

  const handleDelete = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this knowledge entry?")) {
      return;
    }
    setEntries((prev) => prev.filter((e) => e.id !== entryId));
    await deleteEntry(entryId);
  };

  const handleToggleFav = async (entryId: string, currentStatus: boolean) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === entryId ? { ...e, is_favourite: !currentStatus } : e
      )
    );
    await toggleFavourite(entryId, currentStatus);
  };

  const getBadgeStyle = (type: EntryType) => {
    switch (type) {
      case "Idea":
        return {
          icon: Lightbulb,
          color: "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-900/50",
        };
      case "Vocab":
        return {
          icon: Bookmark,
          color: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50",
        };
      case "Quote":
        return {
          icon: QuoteIcon,
          color: "bg-indigo-50 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/50",
        };
      case "Question":
        return {
          icon: HelpCircle,
          color: "bg-purple-50 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-900/50",
        };
      default:
        return {
          icon: FileText,
          color: "bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700",
        };
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight text-stone-900 dark:text-stone-100">
            Vault
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            All your captured voice thoughts, ideas, quotes, and vocabulary in one place.
          </p>
        </div>

        <div className="text-xs text-stone-500">
          {filteredEntries.length} of {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-4 mb-6 space-y-3 shadow-xs">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, quotes, vocabulary, concepts..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/40 transition"
          />
        </div>

        {/* Filter pills & source dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          {/* Type pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(["All", "Idea", "Vocab", "Quote", "Question", "Note"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  selectedType === t
                    ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs"
                    : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Source dropdown */}
            <select
              value={selectedSourceId}
              onChange={(e) => setSelectedSourceId(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs text-stone-700 dark:text-stone-300"
            >
              <option value="All">All Books / Sources</option>
              {sources.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>

            {/* Favourites button */}
            <button
              onClick={() => setOnlyFavourites(!onlyFavourites)}
              className={`p-1.5 rounded-lg border transition ${
                onlyFavourites
                  ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400"
                  : "border-stone-200 dark:border-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
              }`}
              title="Favourites only"
            >
              <Star className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>
      </div>

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <div className="py-16 px-4 text-center rounded-2xl bg-[var(--card)] border border-[var(--card-border)]">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-900 text-stone-500 mb-3">
            <Layers className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
            {searchQuery ? "No entries match your search" : "Your vault is quiet"}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 leading-relaxed">
            {searchQuery
              ? "Try searching for a different keyword or adjusting your filters."
              : "Tap the prominent mic button anytime to capture an idea, quote, or vocabulary word."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => {
            const badge = getBadgeStyle(entry.entry_type);
            const BadgeIcon = badge.icon;

            return (
              <div
                key={entry.id}
                className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-5 hover:border-stone-400/50 transition shadow-xs space-y-3"
              >
                {/* Meta row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${badge.color}`}
                    >
                      <BadgeIcon className="w-3 h-3" />
                      <span>{entry.entry_type}</span>
                    </span>

                    {entry.sources && (
                      <Link
                        href={`/library/${entry.sources.id}`}
                        className="inline-flex items-center gap-1 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>{entry.sources.title}</span>
                        {entry.chapters && (
                          <span className="text-stone-400">
                            · Ch. {entry.chapters.chapter_number}
                          </span>
                        )}
                      </Link>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleFav(entry.id, entry.is_favourite)}
                      className={`p-1.5 rounded-lg transition ${
                        entry.is_favourite
                          ? "text-amber-500 fill-amber-500"
                          : "text-stone-300 hover:text-stone-600"
                      }`}
                      title={entry.is_favourite ? "Remove favourite" : "Star as favourite"}
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingEntry(entry)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition"
                      title="Edit note"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 transition"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                {entry.title && (
                  <h3 className="font-serif text-lg font-medium tracking-tight text-stone-900 dark:text-stone-100">
                    {entry.title}
                  </h3>
                )}

                {/* Content */}
                <p className="font-serif text-sm text-stone-800 dark:text-stone-200 leading-relaxed whitespace-pre-wrap">
                  {entry.cleaned_content}
                </p>

                {/* Vocabulary block */}
                {entry.entry_type === "Vocab" && entry.metadata?.vocab && (
                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800/60 text-xs space-y-1">
                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                      {entry.metadata.vocab.word}
                    </span>
                    <p className="text-stone-600 dark:text-stone-400">
                      {entry.metadata.vocab.meaning}
                    </p>
                    {entry.metadata.vocab.example && (
                      <p className="italic text-stone-500">
                        &ldquo;{entry.metadata.vocab.example}&rdquo;
                      </p>
                    )}
                  </div>
                )}

                {/* Quote attribution block */}
                {entry.entry_type === "Quote" && entry.metadata?.quote_attribution && (
                  <p className="text-xs text-stone-500 italic">
                    — {entry.metadata.quote_attribution}
                  </p>
                )}

                {/* Footer date & raw accordion */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-900 text-[11px] text-stone-400">
                  <span>
                    {new Date(entry.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>

                  {entry.original_transcription &&
                    entry.original_transcription !== entry.cleaned_content && (
                      <details className="text-right">
                        <summary className="cursor-pointer hover:text-stone-600">
                          Raw speech transcript
                        </summary>
                        <p className="mt-1 text-left p-2 rounded bg-stone-50 dark:bg-stone-900 italic font-sans text-stone-600 dark:text-stone-400">
                          &ldquo;{entry.original_transcription}&rdquo;
                        </p>
                      </details>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Entry Modal */}
      <EditEntryModal
        isOpen={Boolean(editingEntry)}
        onClose={() => setEditingEntry(null)}
        entry={editingEntry}
        sources={sources}
        chapters={chapters}
      />
    </div>
  );
}

