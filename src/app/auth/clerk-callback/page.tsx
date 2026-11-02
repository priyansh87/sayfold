"use client";

import { useEffect, useState } from "react";
import { AuthenticateWithRedirectCallback, useUser } from "@clerk/nextjs";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { syncClerkUserToSupabase } from "@/app/auth/clerk-actions";

export default function ClerkCallbackPage() {
  const { user, isLoaded } = useUser();
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user || syncing) return;

    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) {
      setSyncError("No primary email found on Google account.");
      return;
    }

    setSyncing(true);

    syncClerkUserToSupabase({
      id: user.id,
      email,
      name: user.fullName,
    })
      .then((res) => {
        if (res.error) {
          setSyncError(res.error);
          setSyncing(false);
        } else {
          // Full redirect to guarantee Supabase session cookies propagate
          const target = res.isNewUser ? "/library?welcome=1" : "/library";
          window.location.href = target;
        }
      })
      .catch((err) => {
        console.error("Bridge sync failed:", err);
        setSyncError("Failed to sync your Google account. Please try again.");
        setSyncing(false);
      });
  }, [user, isLoaded, syncing]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--background)]">
      {/* Clerk's internal redirect callback component */}
      <div className="hidden">
        <AuthenticateWithRedirectCallback />
      </div>

      <div className="w-full max-w-sm bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-8 shadow-sm text-center">
        {syncError ? (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
                Sign-In Notice
              </h3>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                {syncError}
              </p>
            </div>
            <Link
              href="/login"
              className="inline-block w-full py-2.5 px-4 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold hover:bg-stone-800 transition"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E8643C]/10 text-[#E8643C] flex items-center justify-center mx-auto">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
                Opening your vault...
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Authenticating with Google and connecting your reading companion.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

