"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Layers, Search, Mic, LogOut, Sparkles } from "lucide-react";
import { logout } from "@/app/auth/actions";
import { useCapture } from "@/context/CaptureContext";
import { CaptureOverlay } from "@/components/capture/CaptureOverlay";

interface AppShellProps {
  children: React.ReactNode;
  userEmail?: string;
  displayName?: string;
}

export function AppShell({ children, userEmail, displayName }: AppShellProps) {
  const pathname = usePathname();
  const { openCapture } = useCapture();

  const navItems = [
    {
      label: "Library",
      href: "/library",
      icon: BookOpen,
      isActive: pathname.startsWith("/library"),
    },
    {
      label: "Vault",
      href: "/vault",
      icon: Layers,
      isActive: pathname.startsWith("/vault"),
    },
    {
      label: "Ask / Search",
      href: "/search",
      icon: Sparkles,
      isActive: pathname.startsWith("/search"),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      {/* Top Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[var(--background)]/85 border-b border-stone-200/80 dark:border-stone-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/library" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-center font-serif text-sm font-semibold shadow-xs">
              S
            </div>
            <div>
              <span className="font-serif text-lg font-medium tracking-tight text-stone-900 dark:text-stone-100">
                Sayfold
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100 dark:bg-stone-900/60 p-1 rounded-xl border border-stone-200/60 dark:border-stone-800/60 text-xs">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition font-medium ${
                  item.isActive
                    ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Header: Capture & User profile */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => openCapture()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-medium hover:bg-stone-800 dark:hover:bg-white transition active:scale-[0.98] shadow-xs"
            >
              <Mic className="w-3.5 h-3.5 stroke-[2]" />
              <span>Capture Thought</span>
            </button>

            <form action={logout}>
              <button
                type="submit"
                title="Sign out"
                className="p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-12">
        {children}
      </main>

      {/* Full-screen Voice Capture Overlay */}
      <CaptureOverlay />

      {/* Mobile Floating Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--background)]/90 backdrop-blur-lg border-t border-stone-200/80 dark:border-stone-800/80 px-4 py-2">
        <div className="max-w-md mx-auto flex items-center justify-around relative">
          {/* Library tab */}
          <Link
            href="/library"
            className={`flex flex-col items-center gap-1 py-1 px-3 text-xs transition ${
              pathname.startsWith("/library")
                ? "text-stone-900 dark:text-stone-100 font-medium"
                : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-300"
            }`}
          >
            <BookOpen className="w-5 h-5 stroke-[1.7]" />
            <span className="text-[10px]">Library</span>
          </Link>

          {/* Center Prominent Mic Capture Button */}
          <div className="-mt-6 flex flex-col items-center">
            <button
              onClick={() => openCapture()}
              aria-label="Capture voice note"
              className="w-14 h-14 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-center shadow-lg active:scale-95 transition-transform hover:scale-105 border-4 border-[var(--background)]"
            >
              <Mic className="w-6 h-6 stroke-[2]" />
            </button>
            <span className="text-[9px] uppercase tracking-wider font-semibold text-stone-600 dark:text-stone-400 mt-1">
              Capture
            </span>
          </div>

          {/* Vault tab */}
          <Link
            href="/vault"
            className={`flex flex-col items-center gap-1 py-1 px-3 text-xs transition ${
              pathname.startsWith("/vault")
                ? "text-stone-900 dark:text-stone-100 font-medium"
                : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-300"
            }`}
          >
            <Layers className="w-5 h-5 stroke-[1.7]" />
            <span className="text-[10px]">Vault</span>
          </Link>

          {/* Search / Ask tab */}
          <Link
            href="/search"
            className={`flex flex-col items-center gap-1 py-1 px-3 text-xs transition ${
              pathname.startsWith("/search")
                ? "text-stone-900 dark:text-stone-100 font-medium"
                : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-300"
            }`}
          >
            <Sparkles className="w-5 h-5 stroke-[1.7]" />
            <span className="text-[10px]">Ask</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
