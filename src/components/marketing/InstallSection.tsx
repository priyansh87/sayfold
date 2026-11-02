"use client";

import React, { useState, useEffect } from "react";
import { Download, Smartphone, Laptop, CheckCircle2, AlertCircle, Share2, PlusSquare, MoreVertical, ShieldAlert } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallSection() {
  const [activeTab, setActiveTab] = useState<"android" | "ios" | "desktop">("desktop");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isSupportedBrowser, setIsSupportedBrowser] = useState(false);

  useEffect(() => {
    // 1. Detect platform for default tab
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(ua)) {
        setActiveTab("ios");
      } else if (/android/.test(ua)) {
        setActiveTab("android");
      } else {
        setActiveTab("desktop");
      }

      // Check if already running in standalone mode (PWA installed)
      if (
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true
      ) {
        setIsInstalled(true);
      }
    }

    // 2. Listen for beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsSupportedBrowser(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error("Install prompt error:", err);
    }
  };

  return (
    <section id="install" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E7DFD3]/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E8643C]">
            Instant Access
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#1F1E1B]">
            Install Sayfold in 10 seconds. No app store.
          </h2>
          <p className="text-base sm:text-lg text-[#1F1E1B]/75 font-light">
            Sayfold is an agile Progressive Web App (PWA) that installs straight from your browser and runs natively on your home screen.
          </p>
        </div>

        {/* Smart 1-Click Install Button (When supported and prompt ready) */}
        {deferredPrompt && !isInstalled && (
          <div className="mb-10 text-center">
            <button
              type="button"
              onClick={handleInstallClick}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-semibold text-white bg-[#E8643C] hover:bg-[#D4532B] active:scale-[0.98] transition-all rounded-full shadow-md animate-bounce focus:outline-hidden focus:ring-4 focus:ring-[#E8643C]/20"
            >
              <Download className="w-5 h-5" />
              <span>Install Sayfold to this Device Now</span>
            </button>
            <p className="mt-2 text-xs text-stone-500">
              One-click install detected for your browser.
            </p>
          </div>
        )}

        {isInstalled && (
          <div className="mb-10 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center max-w-md mx-auto space-y-1">
            <div className="flex items-center justify-center gap-2 text-emerald-800 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Sayfold is already installed on this device!
            </div>
            <p className="text-xs text-emerald-700 font-light">
              You can launch it directly from your app drawer or home screen anytime.
            </p>
          </div>
        )}

        {/* Device Tabs */}
        <div className="bg-white rounded-3xl border border-[#E7DFD3] shadow-xs overflow-hidden">
          
          {/* Tab Selection */}
          <div className="flex border-b border-[#E7DFD3] bg-[#F6F1E9]/60">
            <button
              type="button"
              onClick={() => setActiveTab("android")}
              className={`flex-1 py-3.5 px-4 text-center text-sm font-medium transition-all flex items-center justify-center gap-2 border-b-2 ${
                activeTab === "android"
                  ? "border-[#E8643C] text-[#1F1E1B] bg-white font-semibold shadow-xs"
                  : "border-transparent text-stone-600 hover:text-[#1F1E1B]"
              }`}
            >
              <Smartphone className="w-4 h-4 text-[#E8643C]" />
              <span>Android (Chrome)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ios")}
              className={`flex-1 py-3.5 px-4 text-center text-sm font-medium transition-all flex items-center justify-center gap-2 border-b-2 ${
                activeTab === "ios"
                  ? "border-[#E8643C] text-[#1F1E1B] bg-white font-semibold shadow-xs"
                  : "border-transparent text-stone-600 hover:text-[#1F1E1B]"
              }`}
            >
              <Smartphone className="w-4 h-4 text-[#E8643C]" />
              <span>iPhone (Safari)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("desktop")}
              className={`flex-1 py-3.5 px-4 text-center text-sm font-medium transition-all flex items-center justify-center gap-2 border-b-2 ${
                activeTab === "desktop"
                  ? "border-[#E8643C] text-[#1F1E1B] bg-white font-semibold shadow-xs"
                  : "border-transparent text-stone-600 hover:text-[#1F1E1B]"
              }`}
            >
              <Laptop className="w-4 h-4 text-[#E8643C]" />
              <span>Desktop (Chrome/Edge)</span>
            </button>
          </div>

          {/* Tab Content Instructions */}
          <div className="p-6 sm:p-8">
            
            {/* Android Tab */}
            {activeTab === "android" && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#E8643C]">
                  <span>Chrome on Android</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-2">
                    <span className="font-mono text-xs font-bold text-[#E8643C]">Step 1</span>
                    <p className="text-xs text-[#1F1E1B] font-medium leading-relaxed">
                      Open Sayfold in the Chrome browser on your phone.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-2">
                    <span className="font-mono text-xs font-bold text-[#E8643C]">Step 2</span>
                    <div className="flex items-center gap-1.5 text-xs text-[#1F1E1B] font-medium">
                      <MoreVertical className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                      <span>Tap the 3-dot menu</span>
                    </div>
                    <p className="text-[11px] text-stone-500 leading-normal">
                      Located in the top right corner of Chrome.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-2">
                    <span className="font-mono text-xs font-bold text-[#E8643C]">Step 3</span>
                    <p className="text-xs text-[#1F1E1B] font-medium leading-relaxed">
                      Tap <strong className="text-[#1F1E1B]">&ldquo;Install app&rdquo;</strong> or <strong className="text-[#1F1E1B]">&ldquo;Add to Home screen&rdquo;</strong>.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-2">
                    <span className="font-mono text-xs font-bold text-[#E8643C]">Step 4</span>
                    <p className="text-xs text-[#1F1E1B] font-medium leading-relaxed">
                      Confirm by tapping <strong className="text-[#E8643C]">&ldquo;Install&rdquo;</strong>. Sayfold icon appears on your home screen.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* iPhone Tab */}
            {activeTab === "ios" && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#E8643C]">
                  <span>Safari on iOS (Required by Apple)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-2">
                    <span className="font-mono text-xs font-bold text-[#E8643C]">Step 1</span>
                    <p className="text-xs text-[#1F1E1B] font-medium leading-relaxed">
                      Open Sayfold in <strong className="text-[#1F1E1B]">Safari</strong> (Chrome on iOS cannot install PWAs).
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-2">
                    <span className="font-mono text-xs font-bold text-[#E8643C]">Step 2</span>
                    <div className="flex items-center gap-1.5 text-xs text-[#1F1E1B] font-medium">
                      <Share2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>Tap the Share button</span>
                    </div>
                    <p className="text-[11px] text-stone-500 leading-normal">
                      The box icon with an arrow pointing up at the bottom.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-2">
                    <span className="font-mono text-xs font-bold text-[#E8643C]">Step 3</span>
                    <div className="flex items-center gap-1.5 text-xs text-[#1F1E1B] font-medium">
                      <PlusSquare className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                      <span>Add to Home Screen</span>
                    </div>
                    <p className="text-[11px] text-stone-500 leading-normal">
                      Scroll down the share sheet to find this option.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-2">
                    <span className="font-mono text-xs font-bold text-[#E8643C]">Step 4</span>
                    <p className="text-xs text-[#1F1E1B] font-medium leading-relaxed">
                      Tap <strong className="text-[#E8643C]">&ldquo;Add&rdquo;</strong> in the top right. The Sayfold app will launch full screen.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Tab */}
            {activeTab === "desktop" && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#E8643C]">
                  <span>Chrome, Edge, or Brave on Mac/Windows</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-2">
                    <span className="font-mono text-xs font-bold text-[#E8643C]">Step 1</span>
                    <p className="text-xs text-[#1F1E1B] font-medium leading-relaxed">
                      Look at the far-right end of your browser URL address bar.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-2">
                    <span className="font-mono text-xs font-bold text-[#E8643C]">Step 2</span>
                    <div className="flex items-center gap-1.5 text-xs text-[#1F1E1B] font-medium">
                      <Download className="w-3.5 h-3.5 text-[#E8643C] shrink-0" />
                      <span>Click the Install icon</span>
                    </div>
                    <p className="text-[11px] text-stone-500 leading-normal">
                      A small computer monitor or down arrow icon appears.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7DFD3] space-y-2">
                    <span className="font-mono text-xs font-bold text-[#E8643C]">Step 3</span>
                    <p className="text-xs text-[#1F1E1B] font-medium leading-relaxed">
                      Click <strong className="text-[#E8643C]">&ldquo;Install&rdquo;</strong> in the popup window. Sayfold now opens in its own window.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Microphone Security Notice */}
          <div className="border-t border-[#E7DFD3] bg-[#FAF8F5] p-4 sm:p-5 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-[#E8643C] shrink-0 mt-0.5" />
            <p className="text-xs text-[#1F1E1B]/80 leading-relaxed font-light">
              <strong className="font-semibold text-[#1F1E1B]">Microphone Permission:</strong> When you record your first voice note, your browser will ask for microphone access. Tap &ldquo;Allow&rdquo;. Note that microphone capture strictly requires a secure connection (HTTPS or localhost).
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

