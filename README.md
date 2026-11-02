<div align="center">

  <img src="public/brand/sayfold-logo.svg" alt="Sayfold Logo" width="340" />

  <p align="center">
    <strong>Voice-First Knowledge Vault for Readers & Listeners</strong>
  </p>
  <p align="center">
    Capture what you read and hear just by speaking. Transcribed instantly, organized by book & chapter, and folded into your permanent personal knowledge vault.
  </p>

  <p align="center">
    <a href="#key-features">Features</a> •
    <a href="#system-architecture">Architecture</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#environment-variables">Configuration</a> •
    <a href="#database-setup">Database Setup</a> •
    <a href="#automated-testing">Test Suite</a> •
    <a href="#pwa-installation">Install Guide</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-15.1-black?style=flat-square&logo=next.js" alt="Next.js 15" />
    <img src="https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react" alt="React 19" />
    <img src="https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20RLS-3ECF8E?style=flat-square&logo=supabase" alt="Supabase" />
    <img src="https://img.shields.io/badge/Groq-Whisper%20%2B%20LLM-F55036?style=flat-square" alt="Groq LPUs" />
    <img src="https://img.shields.io/badge/LangGraph-v0.2-FF6F00?style=flat-square" alt="LangGraph" />
    <img src="https://img.shields.io/badge/PWA-Installable-6C5CE7?style=flat-square" alt="PWA" />
  </p>
</div>

---

## 📖 Overview

Conventional note-taking tools demand high friction: unlocking your phone, opening an app, and typing out thoughts interrupts reading immersion. As documented by psychological research into human memory decay since Hermann Ebbinghaus, uncaptured thoughts degrade rapidly within 48 hours.

**Sayfold** solves this by offering an effortless, voice-first companion:
1. **Context Inheritance:** Open a book and chapter. Sayfold automatically anchors your session so you never repeat the source title.
2. **Sub-Second Voice Capture:** Speak naturally. Groq Whisper transcribes your voice in under a second.
3. **Intelligent LangGraph Classification:** An orchestrated pipeline categorises thoughts into **Idea**, **Word**, **Quote**, **Question**, or **Note**, generating clean titles, tags, and definitions.
4. **Natural Speech Overrides:** Mention another book or chapter in your speech (*"In Chapter 5 of Thinking Fast and Slow..."*), and Sayfold automatically re-routes the note to that source.
5. **Ask My Memory:** Query your reading history using conversational AI grounded strictly in your personal vault, backed by Postgres Full-Text Search.

---

## ⚡ Key Features

- **🎙️ Voice-First Capture:** Tap the microphone and speak freely without touching a keyboard.
- **📚 Hierarchical Organization:** Organised cleanly by Sources (Books, Podcasts) and Chapters/Episodes.
- **🏷️ Dedicated Collections:**
  - **Idea:** Key concepts, mental models, and reflections.
  - **Word Vault:** Spoken words isolated with phonetic pronunciation, definitions, and context.
  - **Quote Collection:** Direct verbatim quotes preserved with exact source attribution.
  - **Question:** Open curiosities and prompts to revisit later.
  - **Note:** General thoughts and quick memos.
- **🔍 Postgres Full-Text Search (FTS):** High-speed indexing over titles, content, and tags using `tsvector` and `GIN` indexes.
- **🤖 Grounded Q&A Assistant:** Ask questions across all your notes. Sayfold provides exact source citations and explicitly falls back to `"vault me nahi mila"` if no notes match, avoiding hallucinations.
- **📱 Installable Progressive Web App (PWA):** Offline service worker caching, standalone mobile UI, responsive at 390px mobile up to 4K desktop.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    User([Reader / Listener]) -->|Spoken Voice Note| Client[PWA Client / Audio Recorder]
    Client -->|Audio Blob| API[/api/capture]
    
    subgraph Groq LPU Cloud
      API -->|WAV/WebM Audio| Whisper[Groq Whisper large-v3-turbo]
      Whisper -->|Clean Transcript| Graph[LangGraph Orchestrator]
      Graph -->|Extraction & Classification| LLM[Groq Open-Weight LLMs]
    end

    subgraph Supabase Database
      Graph -->|Structured JSON| Supabase[(PostgreSQL with RLS)]
      Supabase --> SourcesTable[(sources)]
      Supabase --> ChaptersTable[(chapters)]
      Supabase --> EntriesTable[(knowledge_entries + fts)]
    end

    User -->|Natural Query| SearchUI[Ask My Memory]
    SearchUI -->|Postgres FTS GIN| Supabase
    Supabase -->|Grounded Context| GroundedLLM[Grounded Answer Generator]
    GroundedLLM -->|Answer with Citations| SearchUI
```

---

## 🎨 Design Philosophy & Palettes

Sayfold follows a calm, literary, clutter-free editorial aesthetic:
- **Parchment Background:** `#F6F1E9` (warm off-white, low eye strain)
- **Charcoal Text:** `#1F1E1B` (deep, warm contrast)
- **Terracotta Accent:** `#E8643C` (inspired by folded dog-ear page corners)
- **Dark Problem Band:** `#1F1E1B`
- **Headlines:** Editorial serif (`Newsreader`) via `next/font/google`
- **Body & Controls:** `Inter` / system-ui

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.18+ or Node.js 20+
- A [Supabase](https://supabase.com) project
- A [Groq Cloud](https://groq.com) API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/priyansh87/sayfold.git
cd sayfold

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` and configure your credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-or-publishable-key

# Server-Only Keys (Never bundled to client)
GROQ_API_KEY=gsk_your_groq_api_key
SUPABASE_SERVICE_ROLE_KEY=optional_service_role_key

# Application Settings
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Security Guardrail:** AI credentials and database service roles run strictly server-side inside Next.js Route Handlers. AI model names are centrally managed in `src/lib/config/models.ts`.

---

## 🗄️ Database Setup

Sayfold uses Postgres with strict Row-Level Security on every table so users can never query another user's data.

1. Navigate to the **SQL Editor** in your Supabase Dashboard.
2. Run the migration script: [`supabase/migrations/20261102_init_sayfold.sql`](supabase/migrations/20261102_init_sayfold.sql).
3. The schema provisions:
   - `profiles`: Synced with Supabase Auth users.
   - `sources`: Books and podcast feeds.
   - `chapters`: Chapters/episodes tied to sources.
   - `knowledge_entries`: Captured thoughts, quotes, words, questions, and notes.
   - **Row-Level Security (RLS)**: Enforced with `auth.uid() = user_id` policies on `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.
   - **Cascade Deletion**: Deleting a source cleanly deletes all associated chapters and entries.
   - **Postgres FTS (`fts`)**: Generated `tsvector` column with `GIN` index for instant full-text search.

---

## 🧪 Automated Verification Suite

All core milestones include automated tests that run against the actual backend APIs:

```bash
# 1. Verify Cross-User Row-Level Security (RLS) Isolation
node --env-file=.env.local scripts/verify-rls.mjs

# 2. Verify Library (CRUD & Cascade Deletes)
npx tsx --env-file=.env.local scripts/test-library.mjs

# 3. Verify End-to-End Vertical Slice (Audio -> Whisper -> LangGraph -> DB Save)
npx tsx --env-file=.env.local scripts/test-vertical-slice.ts

# 4. Verify Vault Filters & Full-Text Search (tsvector GIN)
npx tsx --env-file=.env.local scripts/test-vault.ts

# 5. Verify Grounded "Ask My Memory" Q&A & Hallucination Guardrails
npx tsx --env-file=.env.local scripts/test-ask-memory.ts
```

---

## 📲 Progressive Web App (PWA) Installation

Sayfold is designed as an agile PWA with zero app-store download delays:

- **Android (Chrome):** Open Sayfold $\to$ Tap the three dots (⋮) in the top-right $\to$ Tap **"Install app"** or **"Add to Home screen"**.
- **iPhone (Safari only):** Open Sayfold in **Safari** $\to$ Tap the **Share** button $\to$ Scroll and tap **"Add to Home Screen"** $\to$ Tap **Add**.
- **Desktop (Chrome/Edge):** Click the **Install** icon in the right side of the address bar $\to$ Click **Install**.

*Note: Microphone voice recording requires HTTPS (or localhost in development).*

---

## 🔒 Privacy & Data Policy

- **Audio is Deleted Immediately:** Microphone recordings are used solely to produce text transcripts and are discarded immediately. Raw audio files are never stored permanently.
- **Third-Party Processing:** Audio transcription and open-weight model classifications run via Groq Cloud APIs.
- **User Ownership:** You can edit or permanently delete any entry or book at any time.

---

## 📄 License

MIT License. Crafted with care for lifelong readers and thinkers.
