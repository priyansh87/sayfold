# Sayfold — Voice-First Knowledge Capture Vault

> **One-liner:** Voice-first knowledge capture PWA. Tap the mic, speak naturally, and let AI classify your thoughts into the exact book or chapter collection.

Inspired by the editorial minimalism, quiet focus, and calm aesthetics of [AskLibris](https://asklibris.com/), Sayfold is designed as a tranquil, clutter-free second brain for avid readers and thinkers.

---

## 1. Tech Stack

- **Framework:** Next.js 15 (App Router, TypeScript, Tailwind CSS)
- **Database & Auth:** Supabase (PostgreSQL with Row-Level Security, Auth, Full-Text Search `tsvector`)
- **AI & Speech-to-Text:** Groq (Whisper `whisper-large-v3-turbo` + LLM `openai/gpt-oss-120b` / `qwen/qwen3.8-27b`)
- **Pipeline Orchestration:** LangGraph (`@langchain/langgraph`) for stateful context resolution, speech cleaning, and classification
- **PWA:** Installable manifest, service worker (`/sw.js`), mobile-responsive layout with bottom navigation

---

## 2. Environment Variables

Create a `.env.local` file in the root directory. See `.env.example` for variable names only.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_or_publishable_key
GROQ_API_KEY=gsk_your_groq_api_key
SUPABASE_SERVICE_ROLE_KEY=optional_service_role_key
```

> **Security Guardrail:** `GROQ_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are strictly server-side environment variables and are never bundled into client-side code. Model names are maintained in one central config file: `src/lib/config/models.ts`.

---

## 3. Database & Migrations Setup

1. Open your Supabase Project Dashboard -> **SQL Editor**.
2. Run the migration script located at:
   `supabase/migrations/20261102_init_sayfold.sql`
3. This creates:
   - `profiles`: User profile auto-synced with Supabase Auth.
   - `sources`: Books and podcasts collections.
   - `chapters`: Chapters tied to sources.
   - `knowledge_entries`: Captured ideas, quotes, vocabulary, questions, and notes.
   - **Row-Level Security (RLS)** on all 4 tables (`auth.uid() = user_id`).
   - **Postgres Full-Text Search (`fts`)** generated column and `GIN` index.
   - Cascade delete cascading `sources` -> `chapters` -> `knowledge_entries`.

---

## 4. Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Automated Verification & Testing Suite

Every milestone is verified with automated tests:

```bash
# 1. Verify Cross-User Row Level Security (RLS)
node --env-file=.env.local scripts/verify-rls.mjs

# 2. Verify Library (Books, Chapters, Cascade Deletion)
npx tsx --env-file=.env.local scripts/test-library.mjs

# 3. Verify Core Vertical Slice (Signup -> Book -> Chapter -> Audio -> Whisper -> LangGraph -> DB Save)
npx tsx --env-file=.env.local scripts/test-vertical-slice.ts

# 4. Verify Vault Filtering & Postgres Full-Text Search (FTS)
npx tsx --env-file=.env.local scripts/test-vault.ts

# 5. Verify Ask My Memory Grounded Q&A and "vault me nahi mila" fallback
npx tsx --env-file=.env.local scripts/test-ask-memory.ts
```

---

## 6. Deployment (Vercel)

1. Push this repository to GitHub or GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GROQ_API_KEY`) in the Vercel Project Settings.
4. Deploy!
