"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, BookOpen, Mic, Filter, Library as LibraryIcon, Link2, Sparkles } from "lucide-react";
import { SourceCard } from "@/components/library/SourceCard";
import { SourceModal, type SourceModalInitialValues } from "@/components/library/SourceModal";
import type { Source, SourceType } from "@/types/database";

interface SourceWithStats extends Source {
  chaptersCount?: number;
  entriesCount?: number;
}

interface LibraryClientProps {
  initialSources: SourceWithStats[];
}

export function LibraryClient({ initialSources }: LibraryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sources, setSources] = useState<SourceWithStats[]>(initialSources);
  const [filter, setFilter] = useState<"all" | SourceType>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sourceToEdit, setSourceToEdit] = useState<Source | null>(null);
  const [initialModalValues, setInitialModalValues] = useState<SourceModalInitialValues | undefined>(undefined);
  const [sharedBannerNotice, setSharedBannerNotice] = useState<string | null>(null);

  // Detect incoming Web Share Target parameters (?url=..., ?title=..., ?text=...)
  useEffect(() => {
    const urlParam = searchParams.get("url") || "";
    const titleParam = searchParams.get("title") || "";
    const textParam = searchParams.get("text") || "";

    if (urlParam || titleParam || textParam) {
      let finalUrl = urlParam;
      let finalTitle = titleParam;

      // Extract URL embedded in text (common on Android share sheets)
      if (!finalUrl && textParam) {
        const match = textParam.match(/(https?:\/\/[^\s]+)/i);
        if (match) {
          finalUrl = match[0];
          const remaining = textParam.replace(finalUrl, "").trim();
          if (!finalTitle && remaining) {
            finalTitle = remaining;
          }
        } else if (!finalTitle) {
          finalTitle = textParam;
        }
      }

      // Infer if the link is a podcast based on common media domains
      const lowerUrl = finalUrl.toLowerCase();
      const isPodcast =
        lowerUrl.includes("spotify.com") ||
        lowerUrl.includes("apple.com/podcast") ||
        lowerUrl.includes("podcasts.google.com") ||
        lowerUrl.includes("youtube.com") ||
        lowerUrl.includes("youtu.be") ||
        lowerUrl.includes("podcast");

      setSourceToEdit(null);
      setInitialModalValues({
        title: finalTitle,
        source_url: finalUrl,
        source_type: isPodcast ? "podcast" : "book",
      });
      setIsModalOpen(true);
      setSharedBannerNotice(finalUrl || finalTitle);

      // Clean query parameters so refreshes don't re-trigger
      router.replace("/library");
    }
  }, [searchParams, router]);

  const filteredSources = sources.filter((s) => {
    if (filter === "all") return true;
    return s.source_type === filter;
  });

  const handleEdit = (source: Source) => {
    setInitialModalValues(undefined);
    setSourceToEdit(source);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSourceToEdit(null);
    setInitialModalValues(undefined);
    setIsModalOpen(true);
  };

  const handleModalSuccess = (createdSource?: Source) => {
    setIsModalOpen(false);
    if (createdSource?.id) {
      // Immediately open the newly created source so the user can add chapters & voice notes!
      router.push(`/library/${createdSource.id}`);
    } else {
      router.refresh();
    }
  };

  return (
    <div>
      {/* Shared Link Notice Banner */}
      {sharedBannerNotice && (
        <div className="mb-6 p-4 rounded-2xl bg-[#E8643C]/10 border border-[#E8643C]/30 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5 text-xs text-stone-800 dark:text-stone-200">
            <span className="p-1.5 rounded-lg bg-[#E8643C] text-white">
              <Link2 className="w-3.5 h-3.5" />
            </span>
            <span>
              Shared link ready to catalog:{" "}
              <strong className="font-semibold max-w-[280px] sm:max-w-md inline-block truncate align-bottom">
                {sharedBannerNotice}
              </strong>
            </span>
          </div>
          <button
            onClick={() => setSharedBannerNotice(null)}
            className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs px-2 py-1 rounded-lg"
          >
            Dismiss
          </button>
        </div>
      )}

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
          <div className="inline-flex items-center bg-stone-200/50 dark:bg-[#1E1C18] p-1 rounded-xl border border-[var(--card-border)] text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-lg transition font-medium ${
                filter === "all"
                  ? "bg-white dark:bg-[#2A2823] text-[#E8643C] font-semibold shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              All ({sources.length})
            </button>
            <button
              onClick={() => setFilter("book")}
              className={`px-3 py-1 rounded-lg transition font-medium ${
                filter === "book"
                  ? "bg-white dark:bg-[#2A2823] text-[#E8643C] font-semibold shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Books
            </button>
            <button
              onClick={() => setFilter("podcast")}
              className={`px-3 py-1 rounded-lg transition font-medium ${
                filter === "podcast"
                  ? "bg-white dark:bg-[#2A2823] text-[#E8643C] font-semibold shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Podcasts
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E8643C] hover:bg-[#D4532B] text-white text-xs font-semibold transition active:scale-[0.98] shadow-xs"
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
        initialValues={initialModalValues}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
