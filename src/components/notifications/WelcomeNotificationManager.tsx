"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Bell, Sparkles, X, CheckCircle2 } from "lucide-react";
import {
  isNotificationSupported,
  sendGreetingNotification,
  requestNotificationPermission,
} from "@/lib/notifications";

interface WelcomeNotificationManagerProps {
  displayName?: string | null;
}

export function WelcomeNotificationManager({
  displayName,
}: WelcomeNotificationManagerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);

  useEffect(() => {
    const isNewUser = searchParams.get("welcome") === "1";

    if (isNewUser) {
      if (typeof window !== "undefined" && isNotificationSupported()) {
        if (Notification.permission === "granted") {
          // Immediately deliver the greeting notification to the OS notification center!
          sendGreetingNotification(displayName).then((sent) => {
            if (sent) {
              setNotificationSent(true);
              setTimeout(() => setNotificationSent(false), 5000);
            }
          });
        } else if (Notification.permission === "default") {
          // Show the onboarding prompt so the user can tap to receive their greeting
          setShowWelcomeBanner(true);
        }
      }

      // Clean query parameter from URL without page reload
      router.replace(pathname);
    }
  }, [searchParams, pathname, router, displayName]);

  async function handleEnableNotifications() {
    const sent = await sendGreetingNotification(displayName);
    if (sent) {
      setNotificationSent(true);
      setShowWelcomeBanner(false);
      setTimeout(() => setNotificationSent(false), 5000);
    } else {
      setShowWelcomeBanner(false);
    }
  }

  return (
    <>
      {/* Sent Toast Notification */}
      {notificationSent && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 bg-[var(--card)] border border-[#E8643C]/40 rounded-2xl p-4 shadow-xl flex items-center gap-3 animate-slide-in max-w-sm">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100">
              Greeting Notification Sent! 📖
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Check your device notification tray for your welcome message.
            </p>
          </div>
          <button
            onClick={() => setNotificationSent(false)}
            className="text-stone-400 hover:text-stone-600 ml-auto p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Welcome Banner for Permission */}
      {showWelcomeBanner && (
        <div className="mb-6 p-4 rounded-2xl bg-[var(--card)] border border-[#E8643C]/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E8643C]/10 text-[#E8643C] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                Welcome to Sayfold, {displayName || "Reader"}!
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Enable notifications to receive your welcome greeting and daily reading reflections.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => setShowWelcomeBanner(false)}
              className="px-3 py-1.5 rounded-xl text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition"
            >
              Maybe Later
            </button>
            <button
              onClick={handleEnableNotifications}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#E8643C] hover:bg-[#D4532B] text-white text-xs font-semibold shadow-xs transition active:scale-[0.98]"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Enable Greeting</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

