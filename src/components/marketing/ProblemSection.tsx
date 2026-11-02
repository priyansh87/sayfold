"use client";

import React from "react";
import { BookDashed, Layers, HelpCircle } from "lucide-react";

export function ProblemSection() {
  return (
    <section className="w-full bg-[#1F1E1B] text-[#F6F1E9] py-16 sm:py-24 relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#33312c_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl space-y-4 mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono uppercase tracking-wider text-[#E8643C]">
            The Problem
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.18] text-[#F6F1E9]">
            We read deep books and listen to insightful podcasts.{" "}
            <span className="italic font-normal text-stone-400">
              Then days pass, and we forget.
            </span>
          </h2>
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed font-light">
            Psychological studies since Hermann Ebbinghaus documented that without immediate active capture, human recall drops sharply within 48 hours. Most notes fail not because we lack interest, but because conventional tools demand too much friction.
          </p>
        </div>

        {/* 3 Truthful Short Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Point 1 */}
          <div className="bg-[#282622] border border-[#3A3833] rounded-2xl p-6 sm:p-7 space-y-4 hover:border-[#E8643C]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E8643C]">
              <BookDashed className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-medium text-white">
              Typing breaks your reading flow
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed font-light">
              Stopping to unlock your phone, open a note-taking app, and tap out three sentences ruins your concentration. We tell ourselves we will write it down when the chapter ends. We rarely do.
            </p>
          </div>

          {/* Point 2 */}
          <div className="bg-[#282622] border border-[#3A3833] rounded-2xl p-6 sm:p-7 space-y-4 hover:border-[#E8643C]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E8643C]">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-medium text-white">
              Unstructured notes lose their context
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed font-light">
              Scattered voice memos and camera-roll screenshots don&apos;t connect to the source. Two months later, an isolated quote without its book or chapter context loses half its meaning.
            </p>
          </div>

          {/* Point 3 */}
          <div className="bg-[#282622] border border-[#3A3833] rounded-2xl p-6 sm:p-7 space-y-4 hover:border-[#E8643C]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E8643C]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-medium text-white">
              No way to query what you already learned
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed font-light">
              When a relevant challenge arrives in work or conversation, you remember that you read the answer somewhere. But traditional highlights sit in static pages, unable to answer your question.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

