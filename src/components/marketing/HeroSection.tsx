"use client";

import React from "react";
import Link from "next/link";
import { Mic, ArrowDown, Sparkles, BookOpen, Tag, CheckCircle2, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-8 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28 overflow-hidden bg-[#F6F1E9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            {/* Context Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-[#E7DFD3] text-xs font-medium text-[#1F1E1B]">
              <span className="w-2 h-2 rounded-full bg-[#E8643C] animate-pulse" />
              <span>Voice-first knowledge vault for readers & listeners</span>
            </div>

            {/* Serif Hero Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#1F1E1B] leading-[1.12]">
              Capture what you read and hear.{" "}
              <span className="italic font-normal text-[#1F1E1B]/90">
                Just by speaking.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-[#1F1E1B]/80 max-w-xl leading-relaxed">
              Never pause your reading flow to type. Speak a thought, quote, or unknown word into Sayfold. We transcribe, auto-categorise into your current book and chapter, and fold it into your searchable vault.
            </p>

            {/* Two Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href="#install"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-[#E8643C] hover:bg-[#D4532B] active:scale-[0.98] transition-all rounded-full shadow-sm"
              >
                <span>Install Sayfold</span>
                <ArrowDown className="w-4 h-4" />
              </Link>
              <Link
                href="#how-to-use"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-medium text-[#1F1E1B] bg-white hover:bg-[#FAF7F2] border border-[#E7DFD3] transition-all rounded-full"
              >
                <span>See how it works</span>
                <ArrowRight className="w-4 h-4 text-[#1F1E1B]/60" />
              </Link>
            </div>

            {/* Micro guarantees */}
            <div className="flex items-center gap-6 pt-2 text-xs font-medium text-[#1F1E1B]/60">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E8643C]" />
                Zero app store install
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E8643C]" />
                Private & ad-free
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E8643C]" />
                Instant sync
              </span>
            </div>
          </div>

          {/* Right Column: Static Mock Capture Card */}
          <div className="lg:col-span-5 relative">
            {/* Background card accent glow */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-[#E8643C]/10 to-stone-200/40 rounded-3xl blur-xl -z-10" />

            <div className="relative bg-white rounded-2xl border border-[#E7DFD3] p-5 sm:p-6 shadow-sm overflow-hidden">
              {/* Dog-ear fold top-right indicator */}
              <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none">
                <div className="absolute top-0 right-0 border-t-[32px] border-r-[32px] border-t-[#E8643C] border-r-transparent rounded-tr-xl transform rotate-90" />
              </div>

              {/* Source Context Bar */}
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#F0EAE1] text-xs">
                <div className="flex items-center gap-1.5 text-[#1F1E1B]/70 font-medium truncate">
                  <BookOpen className="w-3.5 h-3.5 text-[#E8643C] shrink-0" />
                  <span className="text-[#1F1E1B] font-semibold">Atomic Habits</span>
                  <span className="text-stone-400">·</span>
                  <span className="truncate">Chapter 2</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 shrink-0">
                  Transcribed in 0.8s
                </span>
              </div>

              {/* Spoken Audio Input Waveform & Speech Preview */}
              <div className="rounded-xl bg-[#FAF7F2] p-3.5 mb-4 border border-[#EBE4D8] space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#1F1E1B]/60 font-medium">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#E8643C] animate-ping" />
                    <span>Spoken note (audio)</span>
                  </div>
                  <span className="font-mono">0:04</span>
                </div>
                <p className="text-xs sm:text-[13px] text-[#1F1E1B] italic leading-relaxed">
                  &ldquo;Chapter two says every action you take is a vote for the type of person you wish to become.&rdquo;
                </p>
              </div>

              {/* LangGraph Auto-Classification Result */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1F1E1B]/50">
                    Auto-categorised
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FDF2EC] text-[#E8643C] border border-[#FAD1C2] text-xs font-semibold">
                    <Sparkles className="w-3 h-3" />
                    Idea
                  </span>
                </div>

                {/* Saved Vault Card Preview */}
                <div className="border border-[#E7DFD3] rounded-xl p-3.5 bg-white space-y-2">
                  <h4 className="text-sm font-semibold text-[#1F1E1B]">
                    Habits as Identity Votes
                  </h4>
                  <p className="text-xs text-[#1F1E1B]/80 leading-relaxed">
                    Actions act as evidence for who you are. Every small choice votes for the identity you want to reinforce.
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-2 text-[11px] text-[#1F1E1B]/60">
                    <span className="inline-flex items-center gap-1 bg-[#F6F1E9] px-2 py-0.5 rounded-md font-mono text-[10px]">
                      <Tag className="w-2.5 h-2.5 text-[#E8643C]" />
                      #identity
                    </span>
                    <span className="inline-flex items-center gap-1 bg-[#F6F1E9] px-2 py-0.5 rounded-md font-mono text-[10px]">
                      #habits
                    </span>
                    <span className="inline-flex items-center gap-1 bg-[#F6F1E9] px-2 py-0.5 rounded-md font-mono text-[10px]">
                      #mindset
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                  <span>Saved to your personal vault</span>
                  <span className="font-medium text-[#1F1E1B]">Now searchable forever</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

