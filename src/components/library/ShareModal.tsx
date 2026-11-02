"use client";

import { useState } from "react";
import { X, Share2, Copy, Check, ExternalLink, Sparkles } from "lucide-react";
import type { Source, Chapter, KnowledgeEntry } from "@/types/database";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: Source;
  chapters: Chapter[];
  entries: KnowledgeEntry[];
}

export function ShareModal({
  isOpen,
  onClose,
  source,
  chapters,
  entries,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  // Filter top quotes and ideas to share
  const topQuotes = entries
    .filter((e) => e.entry_type === "Quote" || e.entry_type === "Idea")
    .slice(0, 4);

  const isBook = source.source_type === "book";
  const iconEmoji = isBook ? "📖" : "🎙️";

  // Build formatted text for sharing
  const shareLines: string[] = [];
  shareLines.push(`${iconEmoji} ${source.title}`);
  if (source.creator) {
    shareLines.push(`by ${source.creator}`);
  }
  shareLines.push(
    `Captured in Sayfold · ${chapters.length} ${chapters.length === 1 ? "chapter" : "chapters"} · ${entries.length} ${entries.length === 1 ? "note" : "notes"}`
  );
  shareLines.push("");

  if (topQuotes.length > 0) {
    shareLines.push("💡 Key Takeaways & Quotes:");
    topQuotes.forEach((item) => {
      const quoteAttr = item.metadata?.quote_attribution
        ? ` — ${item.metadata.quote_attribution}`
        : "";
      if (item.entry_type === "Quote") {
        shareLines.push(`• "${item.cleaned_content}"${quoteAttr}`);
      } else {
        shareLines.push(`• ${item.cleaned_content}`);
      }
    });
    shareLines.push("");
  }

  if (source.source_url) {
    shareLines.push(`Source Link: ${source.source_url}`);
  }

  const appUrl =
    typeof window !== "undefined" ? window.location.origin : "https://sayfold.vercel.app";
  shareLines.push(`Captured with Sayfold — Voice-First Knowledge Vault: ${appUrl}`);

  const formattedShareText = shareLines.join("\n");

  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  async function handleNativeShare() {
    if (canNativeShare) {
      try {
        await navigator.share({
          title: `${source.title} — Sayfold Notes`,
          text: formattedShareText,
          url: source.source_url || window.location.href,
        });
      } catch (err: any) {
        if (err.name !== "AbortError") {
          handleCopyNotes();
        }
      }
    } else {
      handleCopyNotes();
    }
  }

  async function handleCopyNotes() {
    try {
      await navigator.clipboard.writeText(formattedShareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error("Clipboard copy failed", e);
    }
  }

  async function handleCopyLink() {
    try {
      const targetUrl = source.source_url || window.location.href;
      await navigator.clipboard.writeText(targetUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      console.error("Link copy failed", e);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 shadow-xl relative animate-scale-up">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg transition"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-[#E8643C]/10 flex items-center justify-center text-[#E8643C]">
            <Share2 className="w-4 h-4" />
          </div>
          <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100">
            Share {isBook ? "Book" : "Podcast"} Wisdom
          </h3>
        </div>
        <p className="text-xs text-stone-500 mb-5">
          Share your captured takeaways, quotes, and source details with friends or on social media.
        </p>

        {/* Text Preview Box */}
        <div className="mb-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 p-4 max-h-56 overflow-y-auto text-xs text-stone-700 dark:text-stone-300 font-mono whitespace-pre-wrap leading-relaxed select-all">
          {formattedShareText}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          {canNativeShare && (
            <button
              onClick={handleNativeShare}
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#E8643C] hover:bg-[#D4532B] text-white text-xs font-semibold transition shadow-xs active:scale-[0.98]"
            >
              <Share2 className="w-4 h-4" />
              <span>Share via Device</span>
            </button>
          )}

          <button
            onClick={handleCopyNotes}
            className={`w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition active:scale-[0.98] ${
              copied
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-700 dark:text-emerald-300"
                : "border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-800 dark:text-stone-200"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Notes Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Notes</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyLink}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition active:scale-[0.98] ${
              copiedLink
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-700 dark:text-emerald-300"
                : "border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-600 dark:text-stone-400"
            }`}
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

