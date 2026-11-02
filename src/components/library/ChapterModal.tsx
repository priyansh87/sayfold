"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { createChapter, updateChapter } from "@/app/library/actions";
import type { Chapter } from "@/types/database";

interface ChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceId: string;
  chapterToEdit?: Chapter | null;
  suggestedChapterNumber?: number;
}

export function ChapterModal({
  isOpen,
  onClose,
  sourceId,
  chapterToEdit,
  suggestedChapterNumber = 1,
}: ChapterModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    let res;
    if (chapterToEdit) {
      res = await updateChapter(chapterToEdit.id, sourceId, formData);
    } else {
      res = await createChapter(sourceId, formData);
    }

    setLoading(false);
    if (res?.error) {
      setError(res.error);
    } else {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 shadow-xl relative animate-scale-up">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
          {chapterToEdit ? "Edit Chapter" : "New Chapter"}
        </h3>
        <p className="text-xs text-stone-500 mt-0.5 mb-5">
          {chapterToEdit
            ? "Rename or reorder this chapter."
            : "Add a chapter to organize your voice notes."}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-1">
              <label
                htmlFor="chapter_number"
                className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1"
              >
                No.
              </label>
              <input
                id="chapter_number"
                name="chapter_number"
                type="number"
                min={1}
                defaultValue={
                  chapterToEdit ? chapterToEdit.chapter_number : suggestedChapterNumber
                }
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 text-sm text-stone-900 dark:text-stone-100 text-center focus:outline-none focus:ring-2 focus:ring-stone-400/40 transition"
              />
            </div>

            <div className="col-span-3">
              <label
                htmlFor="title"
                className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                defaultValue={chapterToEdit?.title || ""}
                placeholder="The Fundamentals"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/40 transition"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-800 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-[#E8643C] hover:bg-[#D4532B] text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs disabled:opacity-60 active:scale-[0.98]"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{chapterToEdit ? "Save Changes" : "Add Chapter"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

