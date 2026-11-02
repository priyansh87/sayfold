"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { login } from "@/app/auth/actions";
import { ArrowRight, Loader2 } from "lucide-react";
import { ClerkGoogleButton } from "@/components/auth/ClerkGoogleButton";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-3 group">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-xs">
              <Image
                src="/brand/sayfold-icon.svg"
                alt="Sayfold"
                width={56}
                height={56}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <span className="font-sans font-bold text-3xl tracking-tight text-[var(--foreground)]">
              say<span className="text-[#E8643C]">fold</span>
            </span>
          </Link>
          <p className="mt-1 text-xs uppercase tracking-widest text-[var(--muted)] font-medium">
            Voice-First Knowledge Vault
          </p>
        </div>

        {/* Card */}
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-serif font-medium text-stone-900 dark:text-stone-100 mb-1">
            Sign In
          </h2>
          <p className="text-xs text-stone-500 mb-5">
            Open your vault with Google or your email.
          </p>

          {/* Clerk Google Sign In */}
          <div className="mb-4">
            <ClerkGoogleButton mode="signin" />
          </div>

          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-[var(--card-border)] w-full" />
            <span className="bg-[var(--card)] px-3 text-[10px] text-stone-400 uppercase tracking-wider font-medium">
              or with email
            </span>
            <div className="border-t border-[var(--card-border)] w-full" />
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-xs text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/40 focus:border-stone-400 transition"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/40 focus:border-stone-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#E8643C] hover:bg-[#D4532B] text-white text-sm font-semibold active:scale-[0.99] transition disabled:opacity-60 shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Unlocking vault...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-stone-500">
          Don&apos;t have a vault yet?{" "}
          <Link
            href="/signup"
            className="font-medium text-stone-900 dark:text-stone-200 underline underline-offset-4 decoration-stone-300 hover:decoration-stone-600"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}

