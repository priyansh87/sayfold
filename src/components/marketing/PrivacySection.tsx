"use client";

import React from "react";
import { ShieldCheck, Trash2, Cpu, Ban } from "lucide-react";

export function PrivacySection() {
  const points = [
    {
      icon: Trash2,
      title: "Audio deleted immediately",
      desc: "Microphone recordings are used solely to produce text transcription. Once the words are transcribed, the temporary audio file is deleted immediately. We do not retain audio clips.",
    },
    {
      icon: Cpu,
      title: "Processed via Groq Cloud",
      desc: "Transcription runs via Whisper on Groq high-speed LPUs, and auto-classification runs on open-weight LLMs via Groq. Note that text prompts transit Groq's API for processing.",
    },
    {
      icon: ShieldCheck,
      title: "Row-Level Security on Supabase",
      desc: "Every database table is isolated by cryptographic user ID using Supabase Row-Level Security (RLS). No user can ever query or read another user's notes.",
    },
    {
      icon: Ban,
      title: "Zero advertisements, zero data brokers",
      desc: "We build tools for readers, not ad-tech auction houses. We do not run third-party tracking scripts, show banner ads, or sell your reading history to advertisers.",
    },
  ];

  return (
    <section id="privacy" className="py-16 sm:py-24 bg-[#F6F1E9] border-b border-[#E7DFD3]/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="max-w-2xl mb-12 sm:mb-16 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E8643C]">
            Verified Privacy
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#1F1E1B]">
            Honest privacy for your personal thoughts
          </h2>
          <p className="text-base sm:text-lg text-[#1F1E1B]/75 font-light">
            A personal knowledge vault only works if you can trust it completely. Here is exactly how your data is handled.
          </p>
        </div>

        {/* 4 Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
          {points.map((p, index) => {
            const Icon = p.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#E7DFD3] p-6 sm:p-7 space-y-3.5 hover:shadow-xs transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E7DFD3] flex items-center justify-center text-[#E8643C]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#1F1E1B]">
                  {p.title}
                </h3>
                <p className="text-sm text-[#1F1E1B]/70 leading-relaxed font-light">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

