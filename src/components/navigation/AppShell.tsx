"use client";

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BookOpen, Layers, Search, Mic, LogOut, Sparkles } from "lucide-react";
import { logout } from "@/app/auth/actions";
import { useCapture } from "@/context/CaptureContext";
import { CaptureOverlay } from "@/components/capture/CaptureOverlay";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { WelcomeNotificationManager } from "@/components/notifications/WelcomeNotificationManager";

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
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[var(--background)]/90 border-b border-[var(--card-border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/library" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow-xs">
              <Image
                src="/brand/sayfold-icon.svg"
                alt="Sayfold"
                width={32}
                height={32}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div>
              <span className="font-sans font-bold text-xl tracking-tight text-[var(--foreground)]">
                say<span className="text-[#E8643C]">fold</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-200/50 dark:bg-[#1E1C18] p-1 rounded-xl border border-[var(--card-border)] text-xs">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition font-medium ${
                  item.isActive
                    ? "bg-white dark:bg-[#2A2823] text-[#E8643C] dark:text-[#E8643C] shadow-xs font-semibold"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
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
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#E8643C] hover:bg-[#D4532B] text-white text-xs font-semibold shadow-xs transition active:scale-[0.98]"
            >
              <Mic className="w-3.5 h-3.5 stroke-[2]" />
              <span>Capture Thought</span>
            </button>

            <NotificationBell displayName={displayName} />

            <form action={logout}>
              <button
                type="submit"
                title="Sign out"
                className="p-2 rounded-xl border border-[var(--card-border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-12">
        <Suspense fallback={null}>
          <WelcomeNotificationManager displayName={displayName} />
        </Suspense>
        {children}
      </main>

      {/* Full-screen Voice Capture Overlay */}
      <CaptureOverlay />

      {/* Mobile Floating Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--background)]/95 backdrop-blur-lg border-t border-[var(--card-border)] px-4 py-2">
        <div className="max-w-md mx-auto flex items-center justify-around relative">
          {/* Library tab */}
          <Link
            href="/library"
            className={`flex flex-col items-center gap-1 py-1 px-3 text-xs transition ${
              pathname.startsWith("/library")
                ? "text-[#E8643C] font-semibold"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <BookOpen className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px]">Library</span>
          </Link>

          {/* Center Prominent Mic Capture Button */}
          <div className="-mt-6 flex flex-col items-center">
            <button
              onClick={() => openCapture()}
              aria-label="Capture voice note"
              className="w-14 h-14 rounded-full bg-[#E8643C] hover:bg-[#D4532B] text-white flex items-center justify-center shadow-lg shadow-[#E8643C]/25 active:scale-95 transition-transform hover:scale-105 border-4 border-[var(--background)] ring-2 ring-[#E8643C]/30"
            >
              <Mic className="w-6 h-6 stroke-[2]" />
            </button>
            <span className="text-[9px] uppercase tracking-wider font-bold text-[#E8643C] mt-1">
              Capture
            </span>
          </div>

          {/* Vault tab */}
          <Link
            href="/vault"
            className={`flex flex-col items-center gap-1 py-1 px-3 text-xs transition ${
              pathname.startsWith("/vault")
                ? "text-[#E8643C] font-semibold"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <Layers className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px]">Vault</span>
          </Link>

          {/* Search / Ask tab */}
          <Link
            href="/search"
            className={`flex flex-col items-center gap-1 py-1 px-3 text-xs transition ${
              pathname.startsWith("/search")
                ? "text-[#E8643C] font-semibold"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <Sparkles className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px]">Ask</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
