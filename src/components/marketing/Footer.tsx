"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1F1E1B] text-[#F6F1E9] border-t border-[#33312C]">
      
      {/* Final CTA Banner */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-14 sm:pb-20 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono uppercase tracking-wider text-[#E8643C]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Begin Your Library</span>
        </div>
        
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white max-w-2xl mx-auto leading-tight">
          Never let a great idea fade away into the margins.
        </h2>
        
        <p className="text-stone-300 text-base sm:text-lg max-w-xl mx-auto font-light leading-relaxed">
          Start capturing thoughts while you read. Speak naturally, organise automatically, and query your vault whenever you need inspiration.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
          <Link
            href="#install"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-[#E8643C] hover:bg-[#D4532B] active:scale-[0.98] transition-all rounded-full shadow-md w-full sm:w-auto"
          >
            <span>Install Sayfold</span>
            <ArrowDown className="w-4 h-4" />
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-medium text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-all rounded-full w-full sm:w-auto"
          >
            <span>Create Free Account</span>
            <ArrowUpRight className="w-4 h-4 text-stone-300" />
          </Link>
        </div>
      </div>

      {/* Footer Nav & Copyright */}
      <div className="border-t border-[#2F2D28] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Logo & Description */}
          <div className="space-y-2 text-center md:text-left">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0">
                <Image
                  src="/brand/sayfold-icon.svg"
                  alt="Sayfold Logo"
                  width={28}
                  height={28}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-sans font-bold text-xl tracking-tight text-white">
                say<span className="text-[#E8643C]">fold</span>
              </span>
            </Link>
            <p className="text-xs text-stone-400 font-light max-w-xs">
              Voice-first knowledge vault for readers, thinkers, and podcast listeners.
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-medium text-stone-300">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">
              How it works
            </Link>
            <Link href="#how-to-use" className="hover:text-white transition-colors">
              How to use
            </Link>
            <Link href="#features" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="#install" className="hover:text-white transition-colors">
              Install
            </Link>
            <Link href="/login" className="hover:text-[#E8643C] transition-colors">
              Sign In
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-xs text-stone-400 text-center md:text-right font-light">
            © {new Date().getFullYear()} Sayfold. All rights reserved.
          </div>

        </div>
      </div>

    </footer>
  );
}

