"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Sparkles, Send, BellRing } from "lucide-react";
import {
  isNotificationSupported,
  sendGreetingNotification,
  sendTestNotification,
  requestNotificationPermission,
} from "@/lib/notifications";

interface NotificationBellProps {
  displayName?: string | null;
}

export function NotificationBell({ displayName }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    if (isNotificationSupported()) {
      setPermission(Notification.permission);
    } else {
      setPermission("unsupported");
    }
  }, []);

  async function handleSendTest() {
    setIsSending(true);
    setSentSuccess(false);

    const success = await sendGreetingNotification(displayName);
    if (isNotificationSupported()) {
      setPermission(Notification.permission);
    }
    setIsSending(false);

    if (success) {
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 3000);
    }
  }

  if (permission === "unsupported") {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Sayfold Notifications"
        aria-label="Sayfold Notifications"
        className="p-2 rounded-xl border border-[var(--card-border)] text-[var(--muted)] hover:text-[#E8643C] hover:bg-black/5 dark:hover:bg-white/5 transition relative"
      >
        <Bell className="w-4 h-4" />
        {permission === "granted" && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E8643C]" />
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-11 z-40 w-72 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl shadow-xl p-4 animate-scale-up text-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--card-border)]">
              <div className="flex items-center gap-1.5 font-medium text-stone-900 dark:text-stone-100">
                <BellRing className="w-4 h-4 text-[#E8643C]" />
                <span>PWA Notifications</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  permission === "granted"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                }`}
              >
                {permission === "granted" ? "Active" : "Permission Needed"}
              </span>
            </div>

            <p className="text-[11px] text-stone-500 mb-4 leading-relaxed">
              Sayfold sends greeting notifications, daily reflections, and captured quotes directly to your device lock screen.
            </p>

            <button
              onClick={handleSendTest}
              disabled={isSending}
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#E8643C] hover:bg-[#D4532B] text-white text-xs font-semibold shadow-xs transition active:scale-[0.98] disabled:opacity-60"
            >
              {sentSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Greeting Sent!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>{permission === "granted" ? "Send Greeting Notification" : "Enable & Send Greeting"}</span>
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

