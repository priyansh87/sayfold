"use client";

import React from "react";
import { BookOpen, Mic, Sparkles, Search } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      icon: BookOpen,
      title: "Pick your book or podcast",
      desc: "Open your active book and chapter. Sayfold sets your context automatically, so you never have to repeat the book title while speaking.",
    },
    {
      num: "02",
      icon: Mic,
      title: "Tap the mic and speak",
      desc: "Speak naturally as if talking to a thoughtful friend. Mention a key takeaway, an unfamiliar word, or dictate a powerful quote word-for-word.",
    },
    {
      num: "03",
      icon: Sparkles,
      title: "Auto-transcribed and sorted",
      desc: "Fast Whisper transcription turns your voice into clean text, and an intelligent classification graph files it into Idea, Word, Quote, Question, or Note.",
    },
    {
      num: "04",
      icon: Search,
      title: "Search it or ask your vault",
      desc: "Retrieve any thought with millisecond full-text search, or use Ask My Memory to synthesize answers grounded strictly in your personal vault.",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-[#F6F1E9] border-b border-[#E7DFD3]/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E8643C]">
            Simple Workflow
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#1F1E1B]">
            How Sayfold works
          </h2>
          <p className="text-base sm:text-lg text-[#1F1E1B]/75 font-light">
            Designed to stay out of your way while you read, then give you superpowers when you need to recall.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative bg-white rounded-2xl border border-[#E7DFD3] p-6 flex flex-col justify-between hover:shadow-xs transition-all duration-200"
              >
                <div>
                  {/* Step number and icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-2xl font-bold text-[#E8643C]/90">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#F6F1E9] border border-[#E7DFD3] flex items-center justify-center text-[#1F1E1B]">
                      <Icon className="w-5 h-5 text-[#E8643C]" />
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-[#1F1E1B] mb-2.5">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#1F1E1B]/70 leading-relaxed font-light">
                    {step.desc}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-stone-300 font-mono text-sm z-10 pointer-events-none">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

