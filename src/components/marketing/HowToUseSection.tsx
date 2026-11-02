"use client";

import React from "react";
import { UserCheck, ListPlus, FolderOpen, Mic, CheckCircle2, Lightbulb, Quote, BookMarked } from "lucide-react";

export function HowToUseSection() {
  const samplePhrases = [
    {
      category: "Idea / Insight",
      phrase: "“Chapter two says every action is a vote for the person I want to become.”",
      color: "border-amber-200 bg-amber-50/60 text-amber-950",
      badge: "Idea",
    },
    {
      category: "Vocabulary / Word",
      phrase: "“Save the word ephemeral, it means lasting a very short time.”",
      color: "border-sky-200 bg-sky-50/60 text-sky-950",
      badge: "Word",
    },
    {
      category: "Direct Quote",
      phrase: "“Remember this quote: we suffer more often in imagination than in reality.”",
      color: "border-emerald-200 bg-emerald-50/60 text-emerald-950",
      badge: "Quote",
    },
  ];

  return (
    <section id="how-to-use" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E7DFD3]/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="max-w-2xl mb-12 sm:mb-16 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E8643C]">
            First-Time Guide
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#1F1E1B]">
            How to use Sayfold
          </h2>
          <p className="text-base sm:text-lg text-[#1F1E1B]/75 font-light">
            Five simple steps to start capturing thoughts without breaking your reading rhythm.
          </p>
        </div>

        {/* 5 Numbered Steps */}
        <div className="space-y-6 sm:space-y-8">
          
          {/* Step 1 */}
          <div className="flex gap-4 sm:gap-6 bg-white p-5 sm:p-6 rounded-2xl border border-[#E7DFD3] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F6F1E9] border border-[#E7DFD3] text-[#E8643C] font-mono font-bold flex items-center justify-center shrink-0">
              1
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#1F1E1B]/60" />
                <h3 className="text-base sm:text-lg font-semibold text-[#1F1E1B]">
                  Create an account and add a book or podcast
                </h3>
              </div>
              <p className="text-sm text-[#1F1E1B]/70 leading-relaxed font-light">
                Sign in with your email in one click. Tap <strong className="font-medium text-[#1F1E1B]">&ldquo;New Source&rdquo;</strong> to add whatever you are reading or listening to right now (e.g. <em>Atomic Habits</em>, <em>The Psychology of Money</em>, or <em>Huberman Lab</em>).
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4 sm:gap-6 bg-white p-5 sm:p-6 rounded-2xl border border-[#E7DFD3] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F6F1E9] border border-[#E7DFD3] text-[#E8643C] font-mono font-bold flex items-center justify-center shrink-0">
              2
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ListPlus className="w-4 h-4 text-[#1F1E1B]/60" />
                <h3 className="text-base sm:text-lg font-semibold text-[#1F1E1B]">
                  Add chapters or episodes inside it
                </h3>
              </div>
              <p className="text-sm text-[#1F1E1B]/70 leading-relaxed font-light">
                Add chapter numbers or episode titles as you reach them. Organizing by chapter preserves the exact structural narrative of the author.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4 sm:gap-6 bg-white p-5 sm:p-6 rounded-2xl border border-[#E7DFD3] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F6F1E9] border border-[#E7DFD3] text-[#E8643C] font-mono font-bold flex items-center justify-center shrink-0">
              3
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-[#1F1E1B]/60" />
                <h3 className="text-base sm:text-lg font-semibold text-[#1F1E1B]">
                  Open a chapter — Sayfold now knows your context
                </h3>
              </div>
              <p className="text-sm text-[#1F1E1B]/70 leading-relaxed font-light">
                Once inside a chapter, you never need to repeat the title of the book while speaking. Sayfold automatically anchors all captures to this source.
              </p>
            </div>
          </div>

          {/* Step 4 (Crucial: 3 Spoken Examples) */}
          <div className="flex flex-col gap-4 bg-white p-5 sm:p-7 rounded-2xl border-2 border-[#E7DFD3] shadow-xs">
            <div className="flex gap-4 sm:gap-6">
              <div className="w-10 h-10 rounded-xl bg-[#E8643C] text-white font-mono font-bold flex items-center justify-center shrink-0 shadow-xs">
                4
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-[#E8643C]" />
                  <h3 className="text-base sm:text-lg font-semibold text-[#1F1E1B]">
                    Tap the big mic button and speak naturally
                  </h3>
                </div>
                <p className="text-sm text-[#1F1E1B]/70 leading-relaxed font-light">
                  Hold your phone or speak toward your laptop. No need to pause or speak robotically. Try phrasing your thought naturally:
                </p>
              </div>
            </div>

            {/* 3 Spoken Phrase Examples */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2 pl-0 sm:pl-16">
              {samplePhrases.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${item.color} space-y-2 flex flex-col justify-between`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider opacity-70">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 border border-current/20">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13px] font-medium leading-snug">
                    {item.phrase}
                  </p>
                  <span className="text-[10px] text-stone-500 font-mono">
                    Speak in plain language
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-4 sm:gap-6 bg-white p-5 sm:p-6 rounded-2xl border border-[#E7DFD3] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F6F1E9] border border-[#E7DFD3] text-[#E8643C] font-mono font-bold flex items-center justify-center shrink-0">
              5
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F1E1B]/60" />
                <h3 className="text-base sm:text-lg font-semibold text-[#1F1E1B]">
                  Stop recording, check the entry, and retrieve it anytime
                </h3>
              </div>
              <p className="text-sm text-[#1F1E1B]/70 leading-relaxed font-light">
                Sayfold renders the structured note in under two seconds. Edit if needed, or leave it as-is. Find it later in your categorized <strong className="font-medium text-[#1F1E1B]">Vault</strong> or ask a conversational question inside <strong className="font-medium text-[#1F1E1B]">Ask My Memory</strong>.
              </p>
            </div>
          </div>

        </div>

        {/* Small Tip Box: Override Behaviour */}
        <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-[#FFF8F3] border border-[#FAD1C2] flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-full bg-[#E8643C]/10 text-[#E8643C] flex items-center justify-center shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-semibold text-[#1F1E1B]">
              Pro-tip: Natural speech override
            </h4>
            <p className="text-xs sm:text-sm text-[#1F1E1B]/80 leading-relaxed">
              Even if you are inside Chapter 3, you can say: <span className="font-medium italic text-[#1F1E1B]">&ldquo;In Chapter 5 of Thinking Fast and Slow, Kahneman talks about cognitive ease...&rdquo;</span>. Sayfold detects the named source in your speech and automatically overrides the active context to file it under Chapter 5.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

