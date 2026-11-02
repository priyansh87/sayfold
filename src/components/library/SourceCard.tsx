"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Mic, MoreVertical, Edit2, Trash2, ArrowUpRight, FolderGit2 } from "lucide-react";
import { deleteSource } from "@/app/library/actions";
import type { Source } from "@/types/database";

interface SourceWithStats extends Source {
  chaptersCount?: number;
  entriesCount?: number;
}

interface SourceCardProps {
  source: SourceWithStats;
  onEdit: (source: Source) => void;
}

export function SourceCard({ source, onEdit }: SourceCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Are you sure you want to delete "${source.title}" and all its chapters & notes?`)) {
      return;
    }

    setIsDeleting(true);
    await deleteSource(source.id);
  }

  const isBook = source.source_type === "book";

  return (
    <div className="group relative bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-5 hover:border-stone-400/50 dark:hover:border-stone-700 transition shadow-xs flex flex-col justify-between">
      <div>
        {/* Top meta row */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 text-[10px] uppercase tracking-wider font-semibold">
            {isBook ? <BookOpen className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
            <span>{isBook ? "Book" : "Podcast"}</span>
          </span>

          {/* Action Menu */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              aria-label="Actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-7 z-20 w-32 bg-[var(--card)] border border-stone-200 dark:border-stone-800 rounded-xl shadow-lg py-1 text-xs"
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setMenuOpen(false);
                    onEdit(source);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition text-left"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition text-left"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Title & Creator */}
        <Link href={`/library/${source.id}`} className="block group-hover:opacity-95">
          <h4 className="font-serif text-lg font-medium tracking-tight text-stone-900 dark:text-stone-100 line-clamp-1">
            {source.title}
          </h4>
          {source.creator && (
            <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
              by {source.creator}
            </p>
          )}
          {source.description && (
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-2.5 line-clamp-2 leading-relaxed">
              {source.description}
            </p>
          )}
        </Link>
      </div>

      {/* Footer stats & open link */}
      <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-900 flex items-center justify-between text-xs text-stone-500">
        <div className="flex items-center gap-3">
          <span>{source.chaptersCount ?? 0} chapters</span>
          <span className="w-1 h-1 rounded-full bg-stone-300 dark:bg-stone-700" />
          <span>{source.entriesCount ?? 0} entries</span>
        </div>

        <Link
          href={`/library/${source.id}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-stone-800 dark:text-stone-200 hover:underline underline-offset-4"
        >
          <span>Open</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

