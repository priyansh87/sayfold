"use client";

import React from "react";
import { Mic, BookCopy, Bookmark, Quote, MessageSquareQuote, Smartphone } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Mic,
      title: "Voice-first capture",
      desc: "Speak freely while reading or walking. High-accuracy transcription captures your ideas in sub-second speed without interrupting your focus.",
    },
    {
      icon: BookCopy,
      title: "Auto-organised by book & chapter",
      desc: "Notes inherit context from your active chapter. If you mention another book in your voice, Sayfold seamlessly re-routes it to the right place.",
    },
    {
      icon: Bookmark,
      title: "Dedicated Word vault",
      desc: "Expand your vocabulary effortlessly. Spoken words are isolated, defined, and preserved in your personal lexicon for future review.",
    },
    {
      icon: Quote,
      title: "Quote collection",
      desc: "Preserve memorable prose with proper attribution. Every captured quote retains its chapter origin so you can cite it anytime with confidence.",
    },
    {
      icon: MessageSquareQuote,
      title: "Ask My Memory",
      desc: "A conversational assistant grounded strictly in your personal vault. Answers quote your exact notes, with zero hallucinations or outside guesses.",
    },
    {
      icon: Smartphone,
      title: "Works on phone & desktop",
      desc: "Install directly from your browser as an agile PWA. No app store downloads, instant offline caching, and real-time cross-device sync.",
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 bg-[#F6F1E9] border-b border-[#E7DFD3]/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E8643C]">
            Crafted for Retention
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#1F1E1B]">
            Features that keep you in the zone
          </h2>
          <p className="text-base sm:text-lg text-[#1F1E1B]/75 font-light">
            Every feature is designed to reduce friction between discovering a great idea and preserving it forever.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#E7DFD3] p-6 sm:p-7 space-y-4 hover:border-[#E8643C]/40 hover:shadow-xs transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-[#F6F1E9] border border-[#E7DFD3] flex items-center justify-center text-[#E8643C]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#1F1E1B]">
                  {feat.title}
                </h3>
                <p className="text-sm text-[#1F1E1B]/70 leading-relaxed font-light">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

