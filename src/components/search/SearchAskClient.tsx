"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Send,
  Loader2,
  BookOpen,
  ArrowRight,
  Layers,
  HelpCircle,
  Bookmark,
  Quote as QuoteIcon,
  Lightbulb,
} from "lucide-react";
import { askMemoryAction } from "@/app/search/actions";
import type { EntryReference } from "@/lib/server/askMemory";

interface QnAPair {
  id: string;
  question: string;
  answer: string;
  references: EntryReference[];
  timestamp: Date;
}

export function SearchAskClient() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<QnAPair[]>([]);

  const promptSuggestions = [
    "What are my key takeaways about identity?",
    "Show quotes on resilience and strength",
    "What vocabulary words have I cataloged?",
    "What questions did I write down while reading?",
  ];

  async function handleAsk(questionText: string) {
    if (!questionText.trim() || loading) return;

    const trimmed = questionText.trim();
    setQuery("");
    setLoading(true);

    const res = await askMemoryAction(trimmed);
    setLoading(false);

    setHistory((prev) => [
      {
        id: Math.random().toString(36).substring(2, 9),
        question: trimmed,
        answer: res.answer,
        references: res.references,
        timestamp: new Date(),
      },
      ...prev,
    ]);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800/80 text-stone-800 dark:text-stone-200 mb-3 shadow-xs">
          <Sparkles className="w-5 h-5 stroke-[1.8]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight text-stone-900 dark:text-stone-100">
          Ask My Memory
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-md mx-auto leading-relaxed">
          Ask questions across your captured books, podcasts, ideas, and quotes. Answers are grounded strictly in your personal vault.
        </p>
      </div>

      {/* Query Input Box */}
      <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-3 sm:p-4 shadow-sm focus-within:border-stone-400 dark:focus-within:border-stone-600 transition">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(query);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
            placeholder="Ask your reading companion anything..."
            className="flex-1 px-2.5 py-2 bg-transparent text-sm font-serif text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="p-2.5 rounded-xl transition flex items-center justify-center shadow-xs disabled:cursor-not-allowed bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white disabled:bg-stone-200 disabled:text-stone-400 dark:disabled:bg-stone-800 dark:disabled:text-stone-600"
            aria-label="Ask"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </form>

        {/* Suggestion Chips */}
        <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex flex-wrap gap-2">
          {promptSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleAsk(suggestion)}
              disabled={loading}
              className="text-xs px-3 py-1.5 rounded-xl bg-stone-100/80 dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 border border-stone-200/80 dark:border-stone-800 transition active:scale-[0.98] text-left"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state indicator */}
      {loading && (
        <div className="py-8 text-center text-xs text-stone-500 dark:text-stone-400 animate-pulse flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-stone-700 dark:text-stone-300" />
          <span>Searching full-text index and synthesizing from your vault...</span>
        </div>
      )}

      {/* Conversation Thread */}
      <div className="space-y-6">
        {history.map((item) => (
          <div
            key={item.id}
            className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 shadow-xs space-y-4 animate-fade-in"
          >
            {/* User Question */}
            <div className="flex items-start gap-2.5 text-sm font-medium text-stone-900 dark:text-stone-100">
              <span className="text-xs uppercase tracking-wider text-stone-400 font-sans mt-0.5">
                You:
              </span>
              <p className="font-serif text-base">{item.question}</p>
            </div>

            {/* AI Answer */}
            <div className="pl-6 border-l-2 border-stone-200 dark:border-stone-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-stone-500 font-sans">
                <Sparkles className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
                <span className="font-medium">Vault Memory</span>
              </div>
              <p className="font-serif text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed whitespace-pre-wrap">
                {item.answer}
              </p>
            </div>

            {/* Grounded Entry References */}
            {item.references && item.references.length > 0 && (
              <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-900">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block mb-2">
                  Referenced Vault Notes ({item.references.length})
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.references.map((ref, idx) => (
                    <div
                      key={ref.id}
                      className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200/60 dark:border-stone-800/60 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] text-stone-500">
                        <span className="font-semibold text-stone-700 dark:text-stone-300">
                          [{idx + 1}] {ref.entry_type}
                        </span>
                        {ref.source_title && (
                          <span className="truncate max-w-[140px]">
                            {ref.source_title}
                          </span>
                        )}
                      </div>

                      {ref.title && (
                        <div className="font-serif font-medium text-stone-900 dark:text-stone-100 line-clamp-1">
                          {ref.title}
                        </div>
                      )}

                      <p className="font-serif text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                        {ref.cleaned_content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
