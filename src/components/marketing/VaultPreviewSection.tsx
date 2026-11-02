"use client";

import React from "react";
import { BookOpen, Sparkles, Bookmark, Quote, Search, Check, Folder } from "lucide-react";

export function VaultPreviewSection() {
  const books = [
    {
      title: "Atomic Habits",
      author: "James Clear",
      notes: "28 entries",
      chapters: "12 chapters",
      color: "border-l-4 border-l-amber-500",
      accent: "bg-amber-50 text-amber-900",
    },
    {
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      notes: "34 entries",
      chapters: "18 chapters",
      color: "border-l-4 border-l-sky-500",
      accent: "bg-sky-50 text-sky-900",
    },
    {
      title: "Letters from a Stoic",
      author: "Seneca",
      notes: "42 entries",
      chapters: "24 letters",
      color: "border-l-4 border-l-emerald-500",
      accent: "bg-emerald-50 text-emerald-900",
    },
    {
      title: "The Psychology of Money",
      author: "Morgan Housel",
      notes: "19 entries",
      chapters: "9 chapters",
      color: "border-l-4 border-l-[#E8643C]",
      accent: "bg-[#FDF2EC] text-[#E8643C]",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E7DFD3]/80 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E8643C]">
            Vault Preview
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#1F1E1B]">
            Your living archive of thoughts
          </h2>
          <p className="text-base sm:text-lg text-[#1F1E1B]/75 font-light">
            Every entry neatly structured, linked to the source chapter, and instantly searchable across your lifetime of reading.
          </p>
        </div>

        {/* Dashboard Preview Container */}
        <div className="bg-white rounded-3xl border border-[#E7DFD3] shadow-sm p-6 sm:p-8 lg:p-10 space-y-8">
          
          {/* Top Library Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-[#EBE4D8]">
            <div className="space-y-1">
              <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Books & Pods</span>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1E1B]">14</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Captured Ideas</span>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-[#E8643C]">152</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Word Vault</span>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1E1B]">48</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Saved Quotes</span>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1E1B]">76</p>
            </div>
          </div>

          {/* Two-Column Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Bookshelf Grid */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                <span>Recent Sources</span>
                <span className="text-[#E8643C]">Active library</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {books.map((b, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border border-[#E7DFD3] bg-[#FAF8F5] ${b.color} space-y-2`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif font-semibold text-[#1F1E1B] text-sm leading-snug line-clamp-1">
                        {b.title}
                      </h4>
                      <Folder className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    </div>
                    <p className="text-xs text-stone-500">{b.author}</p>
                    <div className="flex items-center justify-between pt-1 text-[11px] text-stone-500 font-mono">
                      <span>{b.chapters}</span>
                      <span className="font-medium text-[#1F1E1B]">{b.notes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Categorized Items Preview */}
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                Structured Collections
              </div>

              {/* Word Vault Item */}
              <div className="p-4 rounded-xl border border-[#E7DFD3] bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                    <Bookmark className="w-3.5 h-3.5 text-sky-600" />
                    <span>Word Vault</span>
                    <span>·</span>
                    <span className="italic">Meditations</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                    Vocabulary
                  </span>
                </div>
                <div className="text-sm font-semibold text-[#1F1E1B]">
                  ephemeral <span className="text-xs font-normal text-stone-500 font-mono">/ɪˈfɛm(ə)rəl/</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  Lasting for a very short time; transitory; fleeting nature of human moments.
                </p>
              </div>

              {/* Quote Item */}
              <div className="p-4 rounded-xl border border-[#E7DFD3] bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                    <Quote className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Quote Collection</span>
                    <span>·</span>
                    <span>Letters from a Stoic</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Quote
                  </span>
                </div>
                <p className="text-xs font-serif italic text-[#1F1E1B] leading-relaxed">
                  &ldquo;We suffer more often in imagination than in reality.&rdquo;
                </p>
                <div className="text-[11px] text-stone-500 text-right">
                  — Seneca, Letter XIII
                </div>
              </div>

              {/* Ask My Memory grounded response */}
              <div className="p-4 rounded-xl border border-[#FAD1C2] bg-[#FFF9F5] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#E8643C]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask My Memory Response</span>
                </div>
                <div className="text-xs text-stone-700 font-medium">
                  &ldquo;What did Morgan Housel say about spending to impress people?&rdquo;
                </div>
                <div className="text-xs text-[#1F1E1B] bg-white p-2.5 rounded-lg border border-[#F0E4D8] leading-relaxed">
                  Spending money to show people how much money you have is the fastest way to have less money. True wealth is what you do not see.
                  <span className="block mt-1 font-mono text-[10px] text-stone-500">
                    Source: The Psychology of Money · Ch. 8: Man in the Car Paradox
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

