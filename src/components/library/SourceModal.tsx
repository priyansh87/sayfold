"use client";

import { useState, useEffect } from "react";
import { X, Loader2, BookOpen, Mic, Link2 } from "lucide-react";
import { createSource, updateSource } from "@/app/library/actions";
import type { Source, SourceType } from "@/types/database";

export interface SourceModalInitialValues {
  title?: string;
  creator?: string;
  source_url?: string;
  source_type?: SourceType;
  description?: string;
}

interface SourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceToEdit?: Source | null;
  initialValues?: SourceModalInitialValues;
  onSuccess?: (source?: Source) => void;
}

export function SourceModal({
  isOpen,
  onClose,
  sourceToEdit,
  initialValues,
  onSuccess,
}: SourceModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sourceType, setSourceType] = useState<SourceType>(
    sourceToEdit?.source_type || initialValues?.source_type || "book"
  );

  useEffect(() => {
    if (sourceToEdit) {
      setSourceType(sourceToEdit.source_type);
    } else if (initialValues?.source_type) {
      setSourceType(initialValues.source_type);
    }
  }, [sourceToEdit, initialValues]);

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
      if (onSuccess) onSuccess((res as any)?.source);
    }
  }

  const defaultTitle = sourceToEdit?.title || initialValues?.title || "";
  const defaultCreator = sourceToEdit?.creator || initialValues?.creator || "";
  const defaultUrl = sourceToEdit?.source_url || initialValues?.source_url || "";
  const defaultDescription =
    sourceToEdit?.description || initialValues?.description || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 shadow-xl relative animate-scale-up">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg transition"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100">
          {sourceToEdit
            ? "Edit Source"
            : initialValues?.source_url
            ? "Add Shared Link to Library"
            : "Add to Library"}
        </h3>
        <p className="text-xs text-stone-500 mt-1 mb-5">
          {sourceToEdit
            ? "Update your book or podcast details."
            : initialValues?.source_url
            ? "Confirm the title and details to catalog this shared source."
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
                    : "bg-stone-50 dark:bg-stone-900/50 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800"
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
                    : "bg-stone-50 dark:bg-stone-900/50 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800"
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Podcast</span>
              </button>
            </div>
          </div>

          {/* Title */}
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
              defaultValue={defaultTitle}
              key={`title-${defaultTitle}`}
              placeholder={sourceType === "book" ? "Atomic Habits" : "Huberman Lab"}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#E8643C]/40 focus:border-[#E8643C] transition"
            />
          </div>

          {/* Author / Host */}
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
              defaultValue={defaultCreator}
              key={`creator-${defaultCreator}`}
              placeholder={sourceType === "book" ? "James Clear" : "Andrew Huberman"}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#E8643C]/40 focus:border-[#E8643C] transition"
            />
          </div>

          {/* Source Link / URL */}
          <div>
            <label
              htmlFor="source_url"
              className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1"
            >
              Source Link / URL{" "}
              <span className="text-stone-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Link2 className="w-3.5 h-3.5" />
              </div>
              <input
                id="source_url"
                name="source_url"
                type="url"
                defaultValue={defaultUrl}
                key={`url-${defaultUrl}`}
                placeholder="https://open.spotify.com/... or goodreads.com/..."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#E8643C]/40 focus:border-[#E8643C] transition"
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Paste an Amazon, Goodreads, Spotify, YouTube, or article link.
            </p>
          </div>

          {/* Notes / Description */}
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
              defaultValue={defaultDescription}
              key={`desc-${defaultDescription}`}
              placeholder="Brief thought about why you are reading or listening to this..."
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#E8643C]/40 focus:border-[#E8643C] transition resize-none"
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
              className="px-4 py-2 rounded-xl bg-[#E8643C] hover:bg-[#D4532B] text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs disabled:opacity-60 active:scale-[0.98]"
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
