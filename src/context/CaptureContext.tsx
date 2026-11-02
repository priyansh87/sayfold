"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface ActiveContext {
  sourceId?: string | null;
  sourceTitle?: string | null;
  chapterId?: string | null;
  chapterTitle?: string | null;
}

interface CaptureContextType {
  activeContext: ActiveContext;
  setActiveContext: (context: ActiveContext) => void;
  isOverlayOpen: boolean;
  openCapture: (context?: ActiveContext) => void;
  closeCapture: () => void;
  onEntrySaved?: () => void;
  setOnEntrySaved: (callback: () => void) => void;
}

const CaptureContext = createContext<CaptureContextType | undefined>(undefined);

export function CaptureProvider({ children }: { children: ReactNode }) {
  const [activeContext, setActiveContext] = useState<ActiveContext>({});
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [onEntrySavedCallback, setOnEntrySavedCallback] = useState<(() => void) | undefined>();

  const openCapture = (ctx?: ActiveContext) => {
    if (ctx) {
      setActiveContext(ctx);
    }
    setIsOverlayOpen(true);
  };

  const closeCapture = () => {
    setIsOverlayOpen(false);
  };

  const setOnEntrySaved = (callback: () => void) => {
    setOnEntrySavedCallback(() => callback);
  };

  return (
    <CaptureContext.Provider
      value={{
        activeContext,
        setActiveContext,
        isOverlayOpen,
        openCapture,
        closeCapture,
        onEntrySaved: onEntrySavedCallback,
        setOnEntrySaved,
      }}
    >
      {children}
    </CaptureContext.Provider>
  );
}

export function useCapture() {
  const context = useContext(CaptureContext);
  if (!context) {
    throw new Error("useCapture must be used within a CaptureProvider");
  }
  return context;
}
