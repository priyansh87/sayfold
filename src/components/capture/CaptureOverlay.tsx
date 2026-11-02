"use client";

import { useState, useEffect } from "react";
import {
  Mic,
  Square,
  X,
  RotateCcw,
  Check,
  Loader2,
  Sparkles,
  BookOpen,
  Bookmark,
  Quote as QuoteIcon,
  HelpCircle,
  Lightbulb,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useCapture } from "@/context/CaptureContext";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import type { EntryType, Source, Chapter } from "@/types/database";

type PipelineStage =
  | "idle"
  | "recording"
  | "transcribing"
  | "classifying"
  | "review"
  | "success"
  | "error";

interface ClassifiedData {
  entry_type: EntryType;
  title: string;
  cleaned_content: string;
  source_id?: string | null;
  chapter_id?: string | null;
  quote_attribution?: string | null;
  vocab?: { word: string; meaning: string; example?: string } | null;
  confidence: number;
  requires_confirmation: boolean;
}

export function CaptureOverlay() {
  const { isOverlayOpen, closeCapture, activeContext, onEntrySaved } = useCapture();
  const {
    isRecording,
    recordingTime,
    error: recorderError,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useAudioRecorder();

  const [stage, setStage] = useState<PipelineStage>("idle");
  const [pipelineError, setPipelineError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string>("");
  const [classifiedData, setClassifiedData] = useState<ClassifiedData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available sources and chapters for review dropdowns
  const [sources, setSources] = useState<Array<{ id: string; title: string }>>([]);
  const [chapters, setChapters] = useState<Array<{ id: string; source_id: string; title: string; chapter_number: number }>>([]);

  // Editable review fields
  const [editType, setEditType] = useState<EntryType>("Idea");
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editSourceId, setEditSourceId] = useState<string>("");
  const [editChapterId, setEditChapterId] = useState<string>("");
  const [editAttribution, setEditAttribution] = useState("");
  const [editVocabWord, setEditVocabWord] = useState("");
  const [editVocabMeaning, setEditVocabMeaning] = useState("");
  const [editVocabExample, setEditVocabExample] = useState("");

  // Auto-start recording when overlay opens
  useEffect(() => {
    if (isOverlayOpen && stage === "idle") {
      setPipelineError(null);
      startRecording();
      setStage("recording");
    }
  }, [isOverlayOpen, stage, startRecording]);

  // Sync recorder errors
  useEffect(() => {
    if (recorderError) {
      setPipelineError(recorderError);
      setStage("error");
    }
  }, [recorderError]);

  if (!isOverlayOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStopAndProcess = async () => {
    if (recordingTime < 1) {
      setPipelineError("Recording was too short. Speak a thought to capture.");
      setStage("error");
      cancelRecording();
      return;
    }

    setStage("transcribing");
    const audioBlob = await stopRecording();

    if (!audioBlob) {
      setPipelineError("Failed to capture audio buffer.");
      setStage("error");
      return;
    }

    try {
      setStage("classifying");
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      if (activeContext.sourceId) formData.append("source_id", activeContext.sourceId);
      if (activeContext.chapterId) formData.append("chapter_id", activeContext.chapterId);

      const res = await fetch("/api/capture", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Capture pipeline failed.");
      }

      setTranscription(data.transcription);
      const classification: ClassifiedData = data.classification;
      setClassifiedData(classification);

      // Populate editable fields
      setEditType(classification.entry_type);
      setEditTitle(classification.title);
      setEditContent(classification.cleaned_content);
      setEditSourceId(classification.source_id || activeContext.sourceId || "");
      setEditChapterId(classification.chapter_id || activeContext.chapterId || "");
      setEditAttribution(classification.quote_attribution || "");
      setEditVocabWord(classification.vocab?.word || "");
      setEditVocabMeaning(classification.vocab?.meaning || "");
      setEditVocabExample(classification.vocab?.example || "");

      if (data.status === "awaiting_confirmation" || classification.requires_confirmation) {
        setStage("review");
      } else {
        setStage("success");
        if (onEntrySaved) onEntrySaved();
      }
    } catch (err: any) {
      console.error("Pipeline failure:", err);
      setPipelineError(err.message || "An error occurred during speech classification.");
      setStage("error");
    }
  };

  const handleConfirmSave = async () => {
    if (!editContent.trim()) {
      setPipelineError("Content cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        entry_type: editType,
        title: editTitle.trim() || "Untitled Note",
        original_transcription: transcription || editContent,
        cleaned_content: editContent.trim(),
        source_id: editSourceId || null,
        chapter_id: editChapterId || null,
        quote_attribution: editType === "Quote" ? editAttribution.trim() || null : null,
        vocab:
          editType === "Vocab" && editVocabWord.trim()
            ? {
                word: editVocabWord.trim(),
                meaning: editVocabMeaning.trim(),
                example: editVocabExample.trim() || undefined,
              }
            : null,
      };

      const res = await fetch("/api/capture/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to save confirmed entry.");
      }

      setStage("success");
      if (onEntrySaved) onEntrySaved();
    } catch (err: any) {
      setPipelineError(err.message || "Failed to save entry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAndClose = () => {
    cancelRecording();
    setStage("idle");
    setPipelineError(null);
    closeCapture();
  };

  const handleRetry = () => {
    setPipelineError(null);
    setTranscription("");
    setClassifiedData(null);
    startRecording();
    setStage("recording");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-6 sm:p-8 shadow-2xl relative text-center">
        {/* Close Button */}
        <button
          onClick={handleCancelAndClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-900 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. RECORDING STATE */}
        {stage === "recording" && (
          <div className="py-6 flex flex-col items-center">
            {/* Context Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 text-xs mb-8">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>
                {activeContext.sourceTitle
                  ? `Focus: ${activeContext.sourceTitle}${activeContext.chapterTitle ? ` · ${activeContext.chapterTitle}` : ""}`
                  : "General Knowledge Capture"}
              </span>
            </div>

            {/* Pulsing Mic Visualizer */}
            <div className="relative mb-8">
              <div className="absolute inset-0 rounded-full bg-stone-400/20 dark:bg-stone-600/20 animate-ping opacity-75" />
              <div className="relative w-28 h-28 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-center shadow-xl">
                <Mic className="w-12 h-12 stroke-[1.8]" />
              </div>
            </div>

            {/* Live Timer */}
            <div className="font-mono text-3xl font-light tracking-widest text-stone-900 dark:text-stone-100 mb-2">
              {formatTimer(recordingTime)}
            </div>
            <p className="text-xs text-stone-500 mb-8 max-w-xs">
              Speak naturally. Share an idea, quote, vocab word, or open question.
            </p>

            {/* Action buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancelAndClose}
                className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 text-xs font-medium hover:bg-stone-100 dark:hover:bg-stone-900 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleStopAndProcess}
                className="px-6 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-medium flex items-center gap-2 hover:bg-stone-800 dark:hover:bg-white active:scale-95 transition shadow-sm"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Done Speaking</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. PROCESSING STATE (Transcribing / Classifying) */}
        {(stage === "transcribing" || stage === "classifying") && (
          <div className="py-12 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center text-stone-800 dark:text-stone-200 mb-6 shadow-sm">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100 mb-2">
              {stage === "transcribing"
                ? "Transcribing with Groq Whisper..."
                : "Classifying with LangGraph..."}
            </h3>
            <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
              Cleaning voice disfluencies and organizing into the right book and chapter.
            </p>
          </div>
        )}

        {/* 3. REVIEW / CONFIRMATION MODAL */}
        {stage === "review" && (
          <div className="text-left py-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400">
                  Needs Confirmation
                </span>
                <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100">
                  Review Your Thought
                </h3>
              </div>
            </div>

            {/* Type selector pills */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">
                Entry Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(["Idea", "Vocab", "Quote", "Question", "Note"] as EntryType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setEditType(t)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
                      editType === t
                        ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100"
                        : "bg-stone-50 dark:bg-stone-900/60 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                Title
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 text-sm font-serif"
              />
            </div>

            {/* Cleaned Content */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                Cleaned Note
              </label>
              <textarea
                rows={3}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 text-sm font-serif resize-none"
              />
            </div>

            {/* Vocab extra inputs */}
            {editType === "Vocab" && (
              <div className="p-3 mb-3 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 space-y-2">
                <input
                  type="text"
                  placeholder="Word"
                  value={editVocabWord}
                  onChange={(e) => setEditVocabWord(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border text-xs"
                />
                <input
                  type="text"
                  placeholder="Meaning"
                  value={editVocabMeaning}
                  onChange={(e) => setEditVocabMeaning(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border text-xs"
                />
              </div>
            )}

            {/* Quote attribution input */}
            {editType === "Quote" && (
              <div className="mb-3">
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                  Quote Attribution (Speaker/Author)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Marcus Aurelius"
                  value={editAttribution}
                  onChange={(e) => setEditAttribution(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 text-sm"
                />
              </div>
            )}

            {/* Raw transcription reference */}
            <details className="mb-5 text-xs text-stone-500">
              <summary className="cursor-pointer hover:text-stone-800 dark:hover:text-stone-200">
                View verbatim audio transcript
              </summary>
              <p className="mt-1 p-2 rounded-lg bg-stone-100 dark:bg-stone-900 italic">
                &ldquo;{transcription}&rdquo;
              </p>
            </details>

            {/* Bottom confirmation actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-900">
              <button
                onClick={handleCancelAndClose}
                className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-800 text-xs font-medium text-stone-600 dark:text-stone-400"
              >
                Discard
              </button>
              <button
                onClick={handleConfirmSave}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-medium hover:bg-stone-800 dark:hover:bg-white transition flex items-center gap-1.5 shadow-xs"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Save to Vault</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. SUCCESS STATE */}
        {stage === "success" && (
          <div className="py-8 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 flex items-center justify-center mb-4 shadow-sm animate-scale-up">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100 mb-1">
              Wisdom Captured
            </h3>
            <p className="text-xs text-stone-500 mb-6 max-w-xs">
              Your voice note has been transcribed, categorized, and folded into your vault.
            </p>
            <button
              onClick={handleCancelAndClose}
              className="px-6 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-medium hover:bg-stone-800 dark:hover:bg-white transition shadow-sm"
            >
              Done
            </button>
          </div>
        )}

        {/* 5. ERROR STATE */}
        {stage === "error" && (
          <div className="py-8 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 flex items-center justify-center mb-4 shadow-sm">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100 mb-2">
              Capture Issue
            </h3>
            <p className="text-xs text-red-600 dark:text-red-400 mb-6 max-w-sm leading-relaxed">
              {pipelineError || "An error occurred while processing your recording."}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancelAndClose}
                className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-800 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 dark:hover:text-stone-200 transition"
              >
                Dismiss
              </button>
              <button
                onClick={handleRetry}
                className="px-5 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-medium flex items-center gap-1.5 hover:bg-stone-800 shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

