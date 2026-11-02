"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowUpRight, Download } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? "bg-[#F6F1E9]/95 backdrop-blur-md border-b border-[#E7DFD3] shadow-xs"
          : "bg-[#F6F1E9] border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#E8643C] rounded-lg"
        >
          <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow-xs">
            <Image
              src="/brand/sayfold-icon.svg"
              alt="Sayfold Logo"
              width={32}
              height={32}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <span className="font-sans font-bold text-xl sm:text-2xl tracking-tight text-[#1F1E1B]">
            say<span className="text-[#E8643C]">fold</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#1F1E1B]/80">
          <Link
            href="#how-it-works"
            className="hover:text-[#1F1E1B] transition-colors focus-visible:outline-hidden focus-visible:underline"
          >
            How it works
          </Link>
          <Link
            href="#how-to-use"
            className="hover:text-[#1F1E1B] transition-colors focus-visible:outline-hidden focus-visible:underline"
          >
            How to use
          </Link>
          <Link
            href="#features"
            className="hover:text-[#1F1E1B] transition-colors focus-visible:outline-hidden focus-visible:underline"
          >
            Features
          </Link>
          <Link
            href="#privacy"
            className="hover:text-[#1F1E1B] transition-colors focus-visible:outline-hidden focus-visible:underline"
          >
            Privacy
          </Link>
          <Link
            href="#install"
            className="hover:text-[#1F1E1B] transition-colors focus-visible:outline-hidden focus-visible:underline"
          >
            Install
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-3.5 py-2 text-sm font-medium text-[#1F1E1B] hover:text-[#E8643C] transition-colors rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#E8643C]"
          >
            Sign in
          </Link>
          <Link
            href="#install"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#E8643C] hover:bg-[#D4532B] active:scale-[0.98] transition-all rounded-full shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#E8643C]"
          >
            <Download className="w-4 h-4" />
            <span>Install app</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="#install"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#E8643C] rounded-full"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#1F1E1B] hover:bg-[#EBE4D8] rounded-lg transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E7DFD3] bg-[#F6F1E9] px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2 text-base font-medium text-[#1F1E1B]">
            <Link
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#EBE4D8] transition-colors"
            >
              How it works
            </Link>
            <Link
              href="#how-to-use"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#EBE4D8] transition-colors"
            >
              How to use
            </Link>
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#EBE4D8] transition-colors"
            >
              Features
            </Link>
            <Link
              href="#privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#EBE4D8] transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="#install"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#EBE4D8] transition-colors"
            >
              Install guide
            </Link>
          </nav>

          <div className="pt-3 border-t border-[#E7DFD3] flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-medium text-[#1F1E1B] border border-[#E7DFD3] rounded-lg hover:bg-white transition-colors"
            >
              Sign in to Sayfold
            </Link>
            <Link
              href="#install"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-white bg-[#E8643C] rounded-lg shadow-xs"
            >
              Install App on this Device
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

