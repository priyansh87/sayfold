"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Mic,
  Plus,
  Edit2,
  Trash2,
  MoreVertical,
  CheckCircle2,
  Quote as QuoteIcon,
  HelpCircle,
  Lightbulb,
  FileText,
  Bookmark,
  Sparkles,
} from "lucide-react";
import { deleteChapter, deleteSource } from "@/app/library/actions";
import { ChapterModal } from "@/components/library/ChapterModal";
import { SourceModal } from "@/components/library/SourceModal";
import { useCapture } from "@/context/CaptureContext";
import type { Source, Chapter, KnowledgeEntry, EntryType } from "@/types/database";

interface SourceDetailClientProps {
  source: Source;
  chapters: Chapter[];
  entries: KnowledgeEntry[];
}

export function SourceDetailClient({
  source,
  chapters,
  entries,
}: SourceDetailClientProps) {
  const router = useRouter();
  const { setActiveContext, openCapture } = useCapture();

  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [chapterToEdit, setChapterToEdit] = useState<Chapter | null>(null);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [isDeletingSource, setIsDeletingSource] = useState(false);

  const selectedChapter = chapters.find((c) => c.id === selectedChapterId);

  // Sync active context with CaptureContext so mic presses know this source & chapter!
  useEffect(() => {
    setActiveContext({
      sourceId: source.id,
      sourceTitle: source.title,
      chapterId: selectedChapter?.id || null,
      chapterTitle: selectedChapter?.title || null,
    });
  }, [source, selectedChapter, setActiveContext]);

  // Filter entries
  const displayedEntries = selectedChapterId
    ? entries.filter((e) => e.chapter_id === selectedChapterId)
    : entries;

  async function handleDeleteSource() {
    if (
      !confirm(
        `Are you sure you want to delete "${source.title}"? All chapters and notes will be deleted.`
      )
    ) {
      return;
    }

    setIsDeletingSource(true);
    await deleteSource(source.id);
    router.push("/library");
  }

  async function handleDeleteChapter(chapter: Chapter) {
    if (!confirm(`Delete Chapter ${chapter.chapter_number}: "${chapter.title}"?`)) {
      return;
    }
    if (selectedChapterId === chapter.id) {
      setSelectedChapterId(null);
    }
    await deleteChapter(chapter.id, source.id);
  }

  const handleEditChapter = (chapter: Chapter) => {
    setChapterToEdit(chapter);
    setIsChapterModalOpen(true);
  };

  const handleAddChapter = () => {
    setChapterToEdit(null);
    setIsChapterModalOpen(true);
  };

  const getEntryBadge = (type: EntryType) => {
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
    <div className="space-y-8">
      {/* Back button & top actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/library"
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Library</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSourceModalOpen(true)}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-900 transition text-xs flex items-center gap-1 border border-stone-200/80 dark:border-stone-800/80"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDeleteSource}
            disabled={isDeletingSource}
            className="p-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition text-xs flex items-center gap-1 border border-red-200 dark:border-red-900/50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeletingSource ? "Deleting..." : "Delete"}</span>
          </button>
        </div>
      </div>

      {/* Source Header Banner */}
      <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 text-[10px] uppercase tracking-wider font-semibold">
            {source.source_type === "book" ? (
              <BookOpen className="w-3 h-3" />
            ) : (
              <Mic className="w-3 h-3" />
            )}
            <span>{source.source_type}</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight text-stone-900 dark:text-stone-100">
          {source.title}
        </h1>

        {source.creator && (
          <p className="text-sm text-stone-500 mt-1 font-sans">
            by <span className="text-stone-800 dark:text-stone-200 font-medium">{source.creator}</span>
          </p>
        )}

        {source.description && (
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-3 max-w-2xl leading-relaxed">
            {source.description}
          </p>
        )}

        {/* Active Context Banner */}
        <div className="mt-6 pt-5 border-t border-stone-100 dark:border-stone-900 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-stone-500">Active capture focus:</span>
            <span className="font-medium text-stone-900 dark:text-stone-100">
              {source.title} {selectedChapter ? `· Chapter ${selectedChapter.chapter_number}` : ""}
            </span>
          </div>

          <button
            onClick={() =>
              openCapture({
                sourceId: source.id,
                sourceTitle: source.title,
                chapterId: selectedChapter?.id || null,
                chapterTitle: selectedChapter?.title || null,
              })
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-medium hover:bg-stone-800 dark:hover:bg-white transition text-xs shadow-xs"
          >
            <Mic className="w-3.5 h-3.5 stroke-[2]" />
            <span>Record Voice Note</span>
          </button>
        </div>
      </div>

      {/* Chapters Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
              Chapters
            </h2>
            <p className="text-xs text-stone-500">
              Select a chapter to focus your capture and view its entries.
            </p>
          </div>

          <button
            onClick={handleAddChapter}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 transition text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Chapter</span>
          </button>
        </div>

        {chapters.length === 0 ? (
          <div className="py-8 px-4 text-center rounded-2xl border border-dashed border-stone-200 dark:border-stone-800 text-xs text-stone-500">
            No chapters yet. Add your first chapter to start organizing voice thoughts.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedChapterId(null)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition border ${
                selectedChapterId === null
                  ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100 shadow-xs"
                  : "bg-[var(--card)] text-stone-600 dark:text-stone-400 border-[var(--card-border)] hover:bg-stone-100 dark:hover:bg-stone-900"
              }`}
            >
              All Chapters ({entries.length})
            </button>

            {chapters.map((chapter) => {
              const chapterEntriesCount = entries.filter(
                (e) => e.chapter_id === chapter.id
              ).length;
              const isSelected = selectedChapterId === chapter.id;

              return (
                <div
                  key={chapter.id}
                  className={`group inline-flex items-center gap-2 pl-3.5 pr-2 py-1.5 rounded-xl text-xs font-medium border transition ${
                    isSelected
                      ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100 shadow-xs"
                      : "bg-[var(--card)] text-stone-700 dark:text-stone-300 border-[var(--card-border)] hover:border-stone-400/50"
                  }`}
                >
                  <button
                    onClick={() => setSelectedChapterId(chapter.id)}
                    className="flex items-center gap-1.5"
                  >
                    <span>
                      Ch. {chapter.chapter_number}: {chapter.title}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected
                          ? "bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900"
                          : "bg-stone-100 dark:bg-stone-800 text-stone-500"
                      }`}
                    >
                      {chapterEntriesCount}
                    </span>
                  </button>

                  <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleEditChapter(chapter)}
                      title="Rename chapter"
                      className="p-1 hover:text-stone-400"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteChapter(chapter)}
                      title="Delete chapter"
                      className="p-1 hover:text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Entries Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
              Captured Wisdom
            </h2>
            <p className="text-xs text-stone-500">
              {selectedChapter
                ? `Entries attached to Chapter ${selectedChapter.chapter_number}: ${selectedChapter.title}`
                : `All entries for ${source.title}`}
            </p>
          </div>

          <span className="text-xs text-stone-500">
            {displayedEntries.length} {displayedEntries.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        {displayedEntries.length === 0 ? (
          <div className="py-12 px-4 text-center rounded-2xl bg-[var(--card)] border border-[var(--card-border)]">
            <p className="font-serif text-stone-700 dark:text-stone-300 text-sm">
              No entries captured yet.
            </p>
            <p className="text-xs text-stone-500 mt-1 mb-4">
              Tap the capture button and speak your ideas, quotes, or vocabulary words.
            </p>
            <button
              onClick={() =>
                openCapture({
                  sourceId: source.id,
                  sourceTitle: source.title,
                  chapterId: selectedChapter?.id || null,
                  chapterTitle: selectedChapter?.title || null,
                })
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-medium hover:bg-stone-800 dark:hover:bg-white transition shadow-xs"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Capture Now</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedEntries.map((entry) => {
              const badge = getEntryBadge(entry.entry_type);
              const BadgeIcon = badge.icon;
              const entryChapter = chapters.find((c) => c.id === entry.chapter_id);

              return (
                <div
                  key={entry.id}
                  className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-5 hover:border-stone-400/50 transition shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${badge.color}`}
                      >
                        <BadgeIcon className="w-3 h-3" />
                        <span>{entry.entry_type}</span>
                      </span>

                      {entryChapter && (
                        <span className="text-xs text-stone-500">
                          Ch. {entryChapter.chapter_number}: {entryChapter.title}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-stone-400">
                      {new Date(entry.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {entry.title && (
                    <h4 className="font-serif text-base font-medium text-stone-900 dark:text-stone-100">
                      {entry.title}
                    </h4>
                  )}

                  <p className="text-sm text-stone-700 dark:text-stone-300 font-serif leading-relaxed">
                    {entry.cleaned_content}
                  </p>

                  {/* Vocabulary metadata if entry is Vocab */}
                  {entry.entry_type === "Vocab" && entry.metadata?.vocab && (
                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800/60 text-xs space-y-1">
                      <div className="font-medium text-stone-900 dark:text-stone-100">
                        {entry.metadata.vocab.word}
                      </div>
                      <div className="text-stone-600 dark:text-stone-400">
                        {entry.metadata.vocab.meaning}
                      </div>
                      {entry.metadata.vocab.example && (
                        <div className="italic text-stone-500">
                          &ldquo;{entry.metadata.vocab.example}&rdquo;
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quote attribution if entry is Quote */}
                  {entry.entry_type === "Quote" && entry.metadata?.quote_attribution && (
                    <p className="text-xs text-stone-500 italic">
                      — {entry.metadata.quote_attribution}
                    </p>
                  )}

                  {/* Collapsible raw transcript */}
                  {entry.original_transcription &&
                    entry.original_transcription !== entry.cleaned_content && (
                      <details className="text-xs text-stone-500 pt-1 border-t border-stone-100 dark:border-stone-900">
                        <summary className="cursor-pointer hover:text-stone-700 dark:hover:text-stone-300">
                          View original transcription
                        </summary>
                        <p className="mt-1.5 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-900/40 italic text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
                          &ldquo;{entry.original_transcription}&rdquo;
                        </p>
                      </details>
                    )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <ChapterModal
        isOpen={isChapterModalOpen}
        onClose={() => setIsChapterModalOpen(false)}
        sourceId={source.id}
        chapterToEdit={chapterToEdit}
        suggestedChapterNumber={chapters.length + 1}
      />

      <SourceModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
        sourceToEdit={source}
      />
    </div>
  );
}

