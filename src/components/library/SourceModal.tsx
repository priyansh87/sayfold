"use client";

import { useState } from "react";
import { X, Loader2, BookOpen, Mic } from "lucide-react";
import { createSource, updateSource } from "@/app/library/actions";
import type { Source, SourceType } from "@/types/database";

interface SourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceToEdit?: Source | null;
  onSuccess?: () => void;
}

export function SourceModal({
  isOpen,
  onClose,
  sourceToEdit,
  onSuccess,
}: SourceModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sourceType, setSourceType] = useState<SourceType>(
    sourceToEdit?.source_type || "book"
  );

  if (!isOpen) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    formData.set("source_type", sourceType);

    let res;
    if (sourceToEdit) {
      res = await updateSource(sourceToEdit.id, formData);
    } else {
      res = await createSource(formData);
    }

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
      <div className="w-full max-w-md bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 shadow-xl relative animate-scale-up">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100">
          {sourceToEdit ? "Edit Source" : "Add to Library"}
        </h3>
        <p className="text-xs text-stone-500 mt-1 mb-5">
          {sourceToEdit
            ? "Update your book or podcast details."
            : "Catalog a book or podcast to attach voice thoughts and chapters."}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Source Type Selector */}
          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
              Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSourceType("book")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition ${
                  sourceType === "book"
                    ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100 shadow-xs"
                    : "bg-stone-50 dark:bg-stone-900/50 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:bg-stone-100"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Book</span>
              </button>
              <button
                type="button"
                onClick={() => setSourceType("podcast")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition ${
                  sourceType === "podcast"
                    ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100 shadow-xs"
                    : "bg-stone-50 dark:bg-stone-900/50 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:bg-stone-100"
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Podcast</span>
              </button>
            </div>
          </div>

          <div>
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
              defaultValue={sourceToEdit?.title || ""}
              placeholder={sourceType === "book" ? "Atomic Habits" : "Huberman Lab"}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/40 focus:border-stone-400 transition"
            />
          </div>

          <div>
            <label
              htmlFor="creator"
              className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1"
            >
              Author / Host
            </label>
            <input
              id="creator"
              name="creator"
              type="text"
              defaultValue={sourceToEdit?.creator || ""}
              placeholder={sourceType === "book" ? "James Clear" : "Andrew Huberman"}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/40 focus:border-stone-400 transition"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1"
            >
              Notes / Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={sourceToEdit?.description || ""}
              placeholder="Brief thought about why you are reading this..."
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/40 focus:border-stone-400 transition resize-none"
            />
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
              className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-medium hover:bg-stone-800 dark:hover:bg-white transition flex items-center gap-1.5 shadow-xs disabled:opacity-60"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{sourceToEdit ? "Save Changes" : "Create Source"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
