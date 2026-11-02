"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { updateEntry } from "@/app/vault/actions";
import type { KnowledgeEntry, EntryType, Source, Chapter } from "@/types/database";

interface EditEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: KnowledgeEntry | null;
  sources: Source[];
  chapters: Chapter[];
  onSuccess?: () => void;
}

export function EditEntryModal({
  isOpen,
  onClose,
  entry,
  sources,
  chapters,
  onSuccess,
}: EditEntryModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entryType, setEntryType] = useState<EntryType>(entry?.entry_type || "Idea");
  const [sourceId, setSourceId] = useState<string>(entry?.source_id || "");
  const [chapterId, setChapterId] = useState<string>(entry?.chapter_id || "");

  if (!isOpen || !entry) return null;

  const relevantChapters = chapters.filter((c) => c.source_id === sourceId);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    formData.set("entry_type", entryType);
    formData.set("source_id", sourceId);
    formData.set("chapter_id", chapterId);

    const res = await updateEntry(entry!.id, formData);
    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      onClose();
      if (onSuccess) onSuccess();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 shadow-xl relative animate-scale-up">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100">
          Edit Knowledge Entry
        </h3>
        <p className="text-xs text-stone-500 mt-1 mb-5">
          Refine your captured note, category, or chapter attribution.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(["Idea", "Vocab", "Quote", "Question", "Note"] as EntryType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setEntryType(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                    entryType === t
                      ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100 shadow-xs"
                      : "bg-stone-50 dark:bg-stone-900/50 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              defaultValue={entry.title || ""}
              placeholder="Concise title"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 text-sm font-serif text-stone-900 dark:text-stone-100"
            />
          </div>

          <div>
            <label
              htmlFor="cleaned_content"
              className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1"
            >
              Note Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="cleaned_content"
              name="cleaned_content"
              rows={4}
              required
              defaultValue={entry.cleaned_content}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 text-sm font-serif text-stone-900 dark:text-stone-100 resize-none"
            />
          </div>

          {/* Source & Chapter selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="source_id"
                className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1"
              >
                Source
              </label>
              <select
                id="source_id"
                value={sourceId}
                onChange={(e) => {
                  setSourceId(e.target.value);
                  setChapterId("");
                }}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs text-stone-800 dark:text-stone-200"
              >
                <option value="">No Book / Unassigned</option>
                {sources.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="chapter_id"
                className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1"
              >
                Chapter
              </label>
              <select
                id="chapter_id"
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
                disabled={!sourceId || relevantChapters.length === 0}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs text-stone-800 dark:text-stone-200 disabled:opacity-50"
              >
                <option value="">No Chapter</option>
                {relevantChapters.map((c) => (
                  <option key={c.id} value={c.id}>
                    Ch.{c.chapter_number}: {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-800 text-xs font-medium text-stone-600 dark:text-stone-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#E8643C] hover:bg-[#D4532B] text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs active:scale-[0.98]"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

