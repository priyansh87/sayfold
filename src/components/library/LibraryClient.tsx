"use client";

import { useState } from "react";
import { Plus, BookOpen, Mic, Filter, Library as LibraryIcon } from "lucide-react";
import { SourceCard } from "@/components/library/SourceCard";
import { SourceModal } from "@/components/library/SourceModal";
import type { Source, SourceType } from "@/types/database";

interface SourceWithStats extends Source {
  chaptersCount?: number;
  entriesCount?: number;
}

interface LibraryClientProps {
  initialSources: SourceWithStats[];
}

export function LibraryClient({ initialSources }: LibraryClientProps) {
  const [sources, setSources] = useState<SourceWithStats[]>(initialSources);
  const [filter, setFilter] = useState<"all" | SourceType>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sourceToEdit, setSourceToEdit] = useState<Source | null>(null);

  const filteredSources = sources.filter((s) => {
    if (filter === "all") return true;
    return s.source_type === filter;
  });

  const handleEdit = (source: Source) => {
    setSourceToEdit(source);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSourceToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <div>
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight text-stone-900 dark:text-stone-100">
            Library
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Your collection of books, podcasts, and reading companions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="inline-flex items-center bg-stone-100 dark:bg-stone-900/60 p-1 rounded-xl border border-stone-200/60 dark:border-stone-800/60 text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-lg transition font-medium ${
                filter === "all"
                  ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs"
                  : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-200"
              }`}
            >
              All ({sources.length})
            </button>
            <button
              onClick={() => setFilter("book")}
              className={`px-3 py-1 rounded-lg transition font-medium ${
                filter === "book"
                  ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs"
                  : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-200"
              }`}
            >
              Books
            </button>
            <button
              onClick={() => setFilter("podcast")}
              className={`px-3 py-1 rounded-lg transition font-medium ${
                filter === "podcast"
                  ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs"
                  : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-200"
              }`}
            >
              Podcasts
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-medium hover:bg-stone-800 dark:hover:bg-white transition active:scale-[0.98] shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Source</span>
          </button>
        </div>
      </div>

      {/* Sources Grid */}
      {filteredSources.length === 0 ? (
        <div className="text-center py-16 px-4 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-900 text-stone-500 mb-3">
            <LibraryIcon className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
            {filter === "all"
              ? "Your library is quiet"
              : `No ${filter === "book" ? "books" : "podcasts"} found`}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-5 leading-relaxed">
            Catalog a book or podcast here. When you read and speak thoughts into
            Sayfold, they will automatically fold into your chapters.
          </p>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-medium hover:bg-stone-800 dark:hover:bg-white transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Your First Source</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSources.map((source) => (
            <SourceCard key={source.id} source={source} onEdit={handleEdit} />
          ))}
        </div>
      )}

      {/* Source Modal */}
      <SourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sourceToEdit={sourceToEdit}
      />
    </div>
  );
}
