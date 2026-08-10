# IntuiLab System Audit

**Date:** 2026-08-10  
**Scope:** Full monorepo (`apps/api`, `apps/web`, `Docs/`, root tooling)  
**Method:** Static architecture review, code/path inventory, feature-vs-spec comparison, dependency and infrastructure gap analysis  
**Repo commits reviewed (recent):** `1dd58c9` (tests), `3d4dd92` (“MVP done”), earlier AI/UI scaffolding  

---

## 0. Executive Summary

IntuiLab is an ambitious **Rediscovery Learning** platform (Socratic AI tutor, concept graph, SRS, BKT mastery, virtual labs, Feynman scoring). The repository contains a **substantial prototype**: Django domain models and Ninja API endpoints, a polished dark Next.js shell, two client-side labs, WebSocket AI plumbing, and seed content for Physics/Chemistry/Math.

However, the system is **not production-ready** and is **not a complete MVP** relative to its own architecture and roadmap. Critical infrastructure is missing (Python dependency lockfile, installable API package, auth product surface, shared frontend utilities). Several Phase 1/2 items marked complete in `Docs/task_tracker.md` are **UI mockups**, **client-only state**, or **half-wired integrations**. Security and learning integrity are weak (client-reported correctness, open CORS, no real auth flow).

| Dimension | Verdict |
|-----------|---------|
| **Vision / docs** | Strong, coherent, detailed |
| **Backend domain model** | Solid foundation; incomplete operationalization |
| **API surface** | Functional sketch; auth/guest gaps; error-shape issues |
| **AI brain** | Scaffold present; runtime reliability and tool loop incomplete |
| **Frontend product shell** | Good visual coverage; many routes are mock or broken |
| **Adaptive learning (BKT/SRS)** | Algorithms coded; not end-to-end without auth + content |
| **Infra / DevEx / CI** | Broken or absent for a clean clone |
| **Overall maturity** | **Early prototype / demoable UI + partial backend** (~Phase 0.6–0.8 of claimed Phase 1+2) |

**Overall health score (subjective):** **4 / 10** — impressive breadth of scaffolding; shallow depth and high integration risk.

---

## 1. System Map (What Exists)

### 1.1 Repository layout

```
intuilab/
├── package.json          # Turborepo monorepo (workspaces: apps/*, packages/*)
├── turbo.json
├── package-lock.json
├── Docs/                 # Architecture, roadmap, task tracker, Stitch prompts
├── apps/
│   ├── api/              # Django project (no package.json → turbo ignores it)
│   │   ├── config/       # settings, urls, asgi, monolithic api.py
│   │   ├── apps/
│   │   │   ├── users/
│   │   │   ├── content/
│   │   │   ├── assessment/
│   │   │   └── ai/
│   │   ├── physics_mechanics.json | chemistry_seeds.json | math_seeds.json
│   │   └── manage.py
│   └── web/              # Next.js 16 App Router + leftover Vite/AI Studio artifacts
│       ├── app/          # Product routes
│       ├── components/   # UI + feature components
│       ├── hooks/
│       ├── public/       # PWA sw.js, manifest
│       └── _stitch_ui/   # Parallel UI prototype (should not ship as-is)
```

### 1.2 Declared tech stack vs actual

| Layer | Architecture doc | Actual in repo |
|-------|------------------|----------------|
| Frontend | Next.js 15 + React 19 + TanStack Query + Zustand | Next.js **16.2**, React 19, **no** TanStack Query, **no** Zustand; Context + local state |
| API | Django 5 + DRF + Django Ninja | Django settings present; **Ninja carries all product APIs**; DRF configured but barely used |
| Realtime | Channels + Redis | Channels consumers present; **InMemoryChannelLayer**; `channels` **not** in `INSTALLED_APPS` |
| DB | PostgreSQL 16 + pgvector | `DATABASE_URL` with **SQLite default**; embeddings stored as **JSONField placeholder** |
| Cache/queue | Redis + Celery | **Neither** configured or present |
| AI | LangChain + Grok + offline Ollama | LangChain + Grok **or** Gemini fallback; **no** offline Ollama path |
| Auth | JWT | `simplejwt` referenced in settings; **no token endpoints, no frontend auth** |
| Deploy | Vercel + Railway | No Docker, no CI, no deploy configs |
| Monorepo packages | Shared packages | `packages/*` workspace **does not exist** |

### 1.3 Approximate code volume

| Area | Approx. size |
|------|----------------|
| Backend Python (excl. migrations) | ~2.2k LOC |
| Frontend TSX (excl. `_stitch_ui`) | ~5.9k LOC |
| Seed JSON | ~626 lines (~19 concepts, ~49 lessons) |
| Backend tests | ~200 LOC (assessment services + API) |
| Frontend tests | ~230 LOC (Feynman, portfolio, titration) |

---

## 2. What Is Working (or Largely Implemented)

These pieces exist as real code paths and, given dependencies and env vars, could work in a local demo.

### 2.1 Domain models (backend)

Well-structured Django apps with migrations:

- **Users:** custom `User` (`is_premium`), `UserProfile` (streak, XP, curriculum, language) — model only.
- **Content:** `Subject → Topic → Concept → Lesson → LessonSection`; prerequisites graph fields; `VirtualLab`, `HistoryTimeline`, `WhyItMattersStory`, `AssessmentItem`/`AssessmentChoice`, curriculum tags.
- **Assessment:** `ConceptMastery` (BKT), `AssessmentAttempt`, `Flashcard`, `SRSReview` (SM-2), `StudentInsight` (portfolio).
- **AI:** `SocraticSession`, `SocraticMessage` with string `lesson_id_str` (supports lab slug IDs).

Content admin is relatively rich (inlines, reversion `VersionAdmin`) — CMS scaffolding is ahead of many other areas.

### 2.2 Learning algorithms (unit-testable core)

- **BKT** in `MasteryService.update_mastery` — correct structure of Bayesian update + transit term.
- **SM-2** in `SRSService.record_review` — intervals 1 → 6 → EF scaling; fail resets.
- Backend tests cover BKT directionality, SRS intervals, insights CRUD (session auth), Feynman score → mastery (mocked LLM).

### 2.3 REST API (Django Ninja)

Mounted at `/api/v1/`:

| Endpoint | Role |
|----------|------|
| `GET /content/subjects/{slug}/topics` | Topic/concept tree |
| `GET /content/lessons/{id\|slug}` | Lesson + denormalized sections |
| `GET /content/map` | Concept graph nodes/edges |
| `GET /content/concepts/{slug}` | Concept detail |
| `GET /content/concepts/{slug}/timeline` | History timeline (or fallback text) |
| `POST /assessment/submit` | Record attempt + BKT |
| `GET /assessment/mastery` | User mastery list |
| `GET/POST /assessment/flashcards` (+ review) | SRS deck |
| `POST /assessment/feynman/score` | LLM score + optional BKT |
| `GET/POST/DELETE /assessment/insights` | Portfolio CRUD |
| `GET /hello` | Health/hello |

### 2.4 AI orchestrator + WebSocket path

- `SocraticOrchestrator` / `GrokOrchestrator` with Socratic system prompt guardrails.
- Tool definitions: `lookup_concept_history`, `generate_hint` (bound to model).
- Feynman evaluation prompt → JSON scores (clarity/depth/intuition).
- `SocraticConsumer`: connect, load history, stream chunks, lab event → pseudo-observation messages, persist user/assistant messages.
- Frontend `useSocraticChat` connects to `ws://host:8000/ws/ai/chat/{lessonId}/`, streams chunks, reconnects.

### 2.5 Seed content pipeline

- `seed_content` management command loads JSON, builds subject/topic/concept/lesson/sections, sequential prerequisites, map coordinates, rebuilds `content_json`.
- Physics Mechanics: **6 topics, 14 concepts, 41 lessons** (largest corpus).
- Chemistry + Math smaller seeds exist.

### 2.6 Frontend product shell

Routes and components that form a navigable demo:

| Route | Implementation quality |
|-------|------------------------|
| `/` | Dashboard UI; static decorative “map” nodes (not live API) |
| `/learn/[subject]` | Fetches topics from API |
| `/learn/.../[lesson]` | Fetches lesson; renders section types; Socratic sidebar |
| `/map` | React Flow; fetches `/content/map` |
| `/lab` | Projectile (Three-ish trajectory) + Titration (pH math); lab events → WS |
| `/flashcards` | Loads deck; SM-2 quality posts |
| `/feynman/[concept]` | Concept fetch, STT (Web Speech API), score API |
| `/history/[concept]` | Timeline API with static fallbacks in UI |
| `/portfolio` | Insights list/create/delete against API |
| UI kit | shadcn-style components, dark theme, sidebar |

### 2.7 Labs (client physics/chemistry)

- Projectile: analytical \(x,y\) integration at ~60fps in `useLabState`.
- Titration: pH curve / indicator color logic; **covered by unit test**.

### 2.8 Documentation

- Architecture v1.0, master roadmap, task tracker, Stitch UI prompts — product intent is clear and useful for planning.

---

## 3. What Is Broken

Issues that will fail builds, runtime, or core user journeys **today**.

### 3.1 Critical: missing `@/lib/utils` (frontend will not compile)

Almost every feature page imports:

```ts
import { cn } from '@/lib/utils';
```

There is **no** `apps/web/lib/` directory and **no** `utils.ts`.  
`components.json` aliases `utils` → `@/lib/utils`, but the file was never created (or was lost). This alone blocks Next production builds for map, lab, flashcards, portfolio, feynman, sidebar, etc.

### 3.2 Critical: backend is not installable from the repo

- **No** `requirements.txt`, `pyproject.toml`, `Pipfile`, or lockfile under `apps/api`.
- Django is not present in the audit environment (`ModuleNotFoundError: No module named 'django'`).
- Implied dependencies include at least: Django, daphne, channels, djangorestframework, djangorestframework-simplejwt, django-cors-headers, django-ninja, django-environ, django-extensions, django-reversion, langchain-*, pillow (avatars), etc. — **none declared**.

A clean clone cannot start the API without reverse-engineering imports.

### 3.3 Critical: authentication product is incomplete / non-functional for SPA

- Settings reference JWT auth, but there are **no** login/register/token refresh routes (no SimpleJWT URL includes, no Ninja auth schemes wired).
- Frontend never sends `Authorization` headers or cookies with `credentials: 'include'`.
- All fetches hit `http://localhost:8000/...` anonymously.
- Consequence:
  - Mastery submit → `"Authentication required"` (silently ignored on client after optimistic UI).
  - Flashcard review → fails for real SRS persistence.
  - Insights create/delete → guest can only see **hardcoded fake portfolio data**.
  - Map mastery for “real” users never hydrates via JWT.

**Net: adaptive learning and portfolio persistence do not work for the actual SPA user.**

### 3.4 Broken / fragile WebSocket & Channels setup

- `CHANNEL_LAYERS` uses **InMemory** (no multi-process / multi-instance).
- `channels` package is imported but **`channels` is not listed in `INSTALLED_APPS`** (only `daphne`). This often causes subtle Channels misconfiguration.
- Consumer performs **sync ORM** inside `SocraticOrchestrator.get_response` from an async path without consistent `database_sync_to_async` wrapping for lesson/concept lookups → risk of `SynchronousOnlyOperation` under ASGI.
- Reconnect loop in `useSocraticChat` has **no cleanup cancellation**; unmount can leave infinite reconnect timers.
- Tool calls are **bound** but there is **no tool-execution loop** after `bind_tools` — if the model emits tool_calls, streaming may produce empty text and the consumer injects a filler: *“I am processing your input…”*.

### 3.5 Broken navigation / route contracts

| Issue | Detail |
|-------|--------|
| Sidebar **Feynman** → `/feynman` | App only has `/feynman/[concept]` → **404** |
| Map click → always `/learn/physics/mechanics/{slug}` | Wrong for chemistry/math concepts |
| Learn “Previous / Continue Mastery” | Buttons non-functional (no routing) |
| Lab section in lessons | Decorative play UI only; **does not launch** `/lab` or embed sim |

### 3.6 Hardcoded localhost API (environment lock-in)

All product data calls use:

```text
http://localhost:8000/api/v1/...
```

WebSocket assumes port **8000** on `window.location.hostname`.  
No `NEXT_PUBLIC_API_URL`, no Next rewrites/proxy. Deployed frontend cannot reach backend without code edits; mixed-content issues under HTTPS.

### 3.7 Task tracker / roadmap overclaim (“MVP done”)

`Docs/task_tracker.md` marks Phase 1 Modules 1–6 and Phase 2 Modules 7–10 as **done**. Reality:

| Claimed done | Reality |
|--------------|---------|
| Auth & profiles | Models only; no login UX/API |
| Offline mode + local caching | Minimal SW shell; **no IndexedDB/WatermelonDB**; wrong static asset list (`/globals.css` not a real Next asset path) |
| Multi-language | Profile field default `en`; no i18n framework |
| Curriculum alignment | `CurriculumTag` model; **not used** in seeds/API/UI |
| Progress/streaks/XP | **Client-only** context; not persisted to `UserProfile` |
| Peer collaboration | **100% mock** (fake users, fake chat, empty whiteboard) |
| Profile | Hardcoded “Alex Chen” stats |
| History index `/history` | Static famous-scientist timeline, **not** concept data |
| Assessment/BKT from lessons | Seed content has **zero** interactive/quiz sections |

Commit message `MVP done` is not accurate for the architecture’s own Phase 1 definition.

### 3.8 Frontend API client integrity bugs

- `useDiscovery` does **not** export `refreshMastery`, but Feynman page destructures it → runtime `undefined` if called.
- Assessment correctness is **client-computed** and posted as `is_correct` — server trusts the client (see Security).
- Knowledge checks only update mastery if `assessmentId` is present; seeds never provide `component_config.assessment_id` → BKT never fires from lessons.
- Guest insights return fabricated IDs/dates that look real — confuses demos and testing.

### 3.9 Dual-stack / leftover project artifacts (high confusion risk)

Inside `apps/web`:

- Next.js app (**source of truth**)
- `vite.config.ts`, `index.html` (“My Google AI Studio App”), `metadata.json`
- `intui-lab-ui-system.zip` (~1MB binary in tree)
- `_stitch_ui/` full second Next app + `pnpm-lock.yaml`
- Both `framer-motion` and `motion` packages used inconsistently
- `components.json` points CSS to `src/index.css` which does not exist in the Next layout
- Root workspace depends on `turbo` `latest` (non-pinned)
- `apps/api` has no `package.json`, so `turbo dev/build` only runs the web app

### 3.10 Test/tooling gaps that make “green” misleading

- `package.json` has **no** `test` script despite Vitest config and tests.
- No CI workflow.
- Backend tests need Django installed and DB; Insights tests use **session login**, which Ninja may or may not honor without CSRF/auth middleware specifics — fragile without documented test settings.
- BKT test comment says default `p_init` 0.15 but model default is **0.1**.

---

## 4. What Is Incomplete

### 4.1 Phase 1 MVP gaps (from architecture §3)

| # | Feature | Status |
|---|---------|--------|
| 01 | Bite-sized lessons | Partial: structure + render; no duration selection, weak checks, no lesson graph navigation |
| 02 | Socratic AI tutor | Partial: prompt + WS; tools incomplete; no offline fallback; no auth-bound sessions |
| 03 | Flashcards SM-2 | Partial: backend + UI; auth required for real scheduling; auto-generated cards are generic |
| 04 | Adaptive engine (BKT) | Partial: service exists; not driving next-lesson or difficulty |
| 05 | Concept graph | Partial: map API + React Flow; layout simplistic; navigation broken for non-physics |
| 06 | Curriculum alignment | Schema only |
| 07 | Progress / streaks | UI chrome only; not server-backed |
| 08 | First Principles Mode | Not a distinct mode (only prompt flavor) |
| 09 | Multi-language (EN + Swahili) | Not implemented |
| 10 | Offline mode | SW skeleton only; far from “90% offline” vision |

### 4.2 Phase 2 items marked complete but incomplete

| Feature | Status |
|---------|--------|
| Virtual labs | Two client labs; not content-driven `VirtualLab` model; no server physics; no DNA/calculus labs |
| Feynman challenger | Works as text/STT + score API if LLM keys present; no robust structured output; Mic UX browser-dependent |
| History timeline | Per-concept API + page; seeds don’t populate `HistoryTimeline`; list page is fake |
| Portfolio | CRUD when authenticated; guests get fake data; no voice notes pipeline; no diagram attachments |
| Collaboration rooms | Mock only |
| Why It Matters / Concept Weaver / Notebook / Problem workspace | Models or nothing; no product surface |

### 4.3 Content incompleteness

- **Biology:** none.
- **University-level depth:** not really present; HS-oriented text blocks.
- **Assessment items:** models + admin; **not seeded**; no MCQ content in JSON.
- **Media:** almost no videos/diagrams; placeholders.
- **Timeline / story / lab configs:** models unused by seeder.
- Roadmap goal “50 Physics Mechanics lessons” — physics has 41 lessons, mostly short text + pauses, not full rediscovery pathways.

### 4.4 Operational incompleteness

- No `.env.example`
- No Docker Compose (Postgres/Redis)
- No migration workflow docs for fresh setup
- No Sentry/PostHog/Stripe/Flutterwave integrations despite architecture
- No rate limiting on AI endpoints
- No Celery Beat for SRS notifications
- No vector search (pgvector)
- No shared monorepo packages (`packages/` missing)

### 4.5 AI incompleteness

- No enforced secondary “answer leak” classifier (guardrail is prompt-only).
- No conversation-level analytics.
- Lab monitor prompt hardcodes projectile narrative even when titration lab is active (`is_lab = lesson_id == "projectile-motion-lab"` only).
- No cost controls / caching of LLM responses.
- Model default `grok-beta` may be outdated depending on xAI catalog.

---

## 5. Bad Architectural Decisions & Design Flaws

### 5.1 Monolithic `config/api.py` as the entire API surface

All content + assessment endpoints live in one ~437-line module. App-level `views.py` files are empty stubs. This:

- Breaks modular monolith boundaries promised in the architecture (`apps/learning`, `apps/labs`, etc.).
- Prevents clear ownership, versioning, and testing per domain.
- Encourages “god module” growth.

**Better:** Ninja routers co-located per app (`apps/content/api.py`, `apps/assessment/api.py`) and assembled in `config/api.py`.

### 5.2 Dual API frameworks without purpose

DRF + SimpleJWT configured; product uses Django Ninja exclusively. Complexity without benefit. JWT is configured on DRF defaults but Ninja endpoints do not declare Ninja auth classes → **auth is effectively session-or-nothing**, and the SPA doesn’t use sessions.

### 5.3 Client-trusted assessment correctness (learning integrity flaw)

```text
POST /assessment/submit { assessment_id, is_correct }
```

The server **never scores the answer**. A client can send `is_correct: true` forever and max out BKT mastery. For an adaptive learning platform this is a **core design defect**, not a minor bug.

**Better:** submit selected choice / free-text; server grades against `AssessmentChoice` or scorer; then update BKT.

### 5.4 Guest vs authenticated dual realities

Many endpoints return **fake demo data** for guests (insights, partial flashcards) and hard-fail others. This blurs product truth, pollutes analytics, and makes E2E testing ambiguous. Prefer explicit demo mode or require auth for personalization features.

### 5.5 Error handling returns HTTP 200 with `{"error": ...}`

Ninja handlers catch exceptions and return error dicts without raising `HttpError`. Clients checking `res.ok` treat failures as success. Example: lesson not found still 200.

### 5.6 Denormalized `content_json` without strong schema

Lesson sections cache is a free-form list. No JSON schema validation, no versioning strategy beyond an integer field. Interactive sections expect `component_config` shapes that seeds never produce. Frontend switch statements silently `null` unknown types.

### 5.7 Embeddings as JSONField “placeholder”

Architecture depends on pgvector semantic search; implementation stores optional JSON lists. This will not scale and invites accidental full-table scans if ever used naively.

### 5.8 Offline-first vision vs network-hardcoded SPA

Architecture claims privacy-first, on-device learning data, WatermelonDB, background sync. Implementation is online-first with hardcoded localhost and a naive service worker. **Largest architecture/implementation gap in the project.** Building more online-only features without a sync model will make true offline later extremely expensive.

### 5.9 Turborepo monorepo that only contains a frontend package

Root workspaces include `packages/*` (missing) and `apps/*` (api has no Node package). Backend is a second-class citizen outside the monorepo task graph. No unified `dev` story (API + web + workers).

### 5.10 UI generation residue as architecture

Stitch UI, AI Studio Vite skeleton, zip of design system, duplicate motion libraries — indicate **UI-first generation** stitched onto a backend sketch rather than a single coherent app architecture. This produces:

- Dead code (`markdownContent`, `initialNodes` unused fallbacks)
- Import-order hacks (`Sparkles` imported at bottom of lesson page)
- Inconsistent patterns page-to-page

### 5.11 Security posture unsuitable even for private beta

| Issue | Risk |
|-------|------|
| `CORS_ALLOW_ALL_ORIGINS = True` | CSRF/data exfil if cookies ever used |
| No rate limits on LLM endpoints | Cost abuse |
| Secret key from env with no `.env.example` | Misconfig / accidental commit risk |
| Client-trusted mastery | Grade inflation / broken pedagogy metrics |
| In-memory channel layer | Session cross-talk limits + no horizontal scale |
| Anonymous Socratic sessions with `user=None` + weak session key | History collision / privacy bleed between guests |
| No content security policy / authz on insights beyond user FK | OK when auth works; untested |

### 5.12 Progress metrics split-brain

`UserProfile.streak_count` / `total_xp` exist server-side; frontend XP/streak live only in React context and reset on refresh. Map mastery merge prefers client map keyed by slug and can **overwrite** richer server node mastery with zeros when unauthenticated.

### 5.13 Socratic “non-negotiable” guardrail is only a system prompt

Architecture insists Rediscovery Mode is enforced at the system level. Implementation is a prompt string. Models will still leak formulas under pressure; no output filter, no tool-only answer ban, no evaluation harness measuring answer-leak rate.

### 5.14 Content graph generation is sequential, not pedagogical

Seeder chains prerequisites as “previous concept in file order” and places nodes on a grid. Cross-topic and cross-subject edges (entropy ↔ free energy ↔ information) from the vision are not modeled in seeds.

---

## 6. Feature Reality Matrix (Quick Reference)

| Area | Models | API | UI | End-to-end? |
|------|--------|-----|----|-------------|
| Lessons | ✅ | ✅ | ✅ | ⚠️ needs API+seed running; no quizzes |
| Socratic chat | ✅ | WS | ✅ | ⚠️ needs keys + Channels stack |
| Concept map | ✅ | ✅ | ✅ | ⚠️ mastery/nav issues |
| BKT mastery | ✅ | ✅ | partial | ❌ without auth + server grading |
| SRS flashcards | ✅ | ✅ | ✅ | ❌ without auth (review) |
| Feynman | — | ✅ | ✅ | ⚠️ LLM + optional mastery |
| Portfolio | ✅ | ✅ | ✅ | ❌ without auth (fake guest data) |
| Labs | partial | — | ✅ | ⚠️ local only + AI comments |
| History timeline | ✅ | ✅ | partial | ⚠️ no seeded timelines |
| Collaborate | — | — | mock | ❌ |
| Profile/auth | partial | ❌ | mock | ❌ |
| Offline PWA | — | — | shell | ❌ |
| Curriculum tags | ✅ | ❌ | ❌ | ❌ |
| Celery/SRS jobs | — | — | — | ❌ |
| Payments/premium | field only | ❌ | ❌ | ❌ |

---

## 7. Strengths (Do Not Throw Away)

1. **Clear product philosophy** — Socratic rediscovery is consistently reflected in AI prompt design and feature naming.
2. **Sensible domain model** for an education graph (concepts, prerequisites, mastery, SRS, sessions).
3. **Real algorithm implementations** (BKT, SM-2) rather than only UI.
4. **Coherent visual language** — dark zinc theme, lab/map/lesson layout is demo-ready.
5. **Lesson section polymorphism** (text, video, diagram, interactive, lab, socratic_pause) is a good content abstraction if schemas are hardened.
6. **Admin CMS direction** with reversion is correct for expert-authored content.
7. **Lab → AI observation channel** is a creative integration (when WS works).

---

## 8. Priority Recommendations

### P0 — Make the system runnable and honest

1. Add `apps/api/requirements.txt` (or `pyproject.toml`) + `.env.example`; pin Django/Channels/Ninja/LangChain versions.
2. Create `apps/web/lib/utils.ts` (`cn` helper) so the frontend builds.
3. Document a single local bootstrap: Postgres optional, migrate, seed all three JSON files, run Daphne + Next.
4. Correct `Docs/task_tracker.md` to match reality (avoid false “done” state).
5. Remove or quarantine `_stitch_ui/`, zip, and Vite/AI Studio leftovers from the production app path.

### P1 — Unlock personalization (auth + API client)

1. Implement JWT (or cookie session) login/register; wire Ninja auth.
2. Introduce `NEXT_PUBLIC_API_URL` + shared `apiClient` with credentials.
3. Persist XP/streaks to `UserProfile`; drop fake guest portfolio or label it “demo”.
4. Server-side grade assessments; stop accepting `is_correct` from clients.

### P2 — Close the learning loop

1. Seed `AssessmentItem`s and interactive lesson sections.
2. Drive map mastery from authenticated BKT only.
3. Fix Feynman nav (`/feynman` index listing concepts).
4. Complete tool-calling loop in orchestrator; wrap ORM in async-safe calls.
5. Fix lab-specific system prompts (titration vs projectile).

### P3 — Architecture cleanup

1. Split `config/api.py` into per-app routers.
2. Choose one motion library; one API framework; pin turbo.
3. Add Docker Compose: `web`, `api`, `db`, `redis`.
4. Add CI: lint, `vitest`, `manage.py test`.
5. Decide offline strategy: either scope down claims or introduce local DB + sync early.

### P4 — Content & pedagogy quality

1. Expand beyond text dumps: rediscovery paths, assessments, timelines, lab configs as data.
2. Measure Socratic answer-leak rate with eval harness.
3. Curriculum tags mapped to KCSE/CBC in content and filters.

---

## 9. Suggested Honest Project Status Statement

> IntuiLab is an **early vertical slice**: Django models and Ninja APIs for content/assessment/AI, a Next.js dark UI covering major routes, two interactive labs, and seed Physics/Chemistry/Math text content. Core adaptive features (auth-bound mastery, SRS, portfolio) and several Phase 2 UIs are incomplete or mocked. The monorepo is not yet reliably installable or deployable. Treat “MVP done” as **aspirational**, not operational.

---

## 10. Appendix A — Inventory of major files

| Path | Role |
|------|------|
| `apps/api/config/settings.py` | Django settings (DB, CORS, JWT, Channels memory, AI keys) |
| `apps/api/config/api.py` | Entire REST API |
| `apps/api/config/asgi.py` | HTTP + WebSocket routing |
| `apps/api/apps/ai/services/orchestrator.py` | LLM Socratic + Feynman |
| `apps/api/apps/ai/consumers.py` | WS tutor |
| `apps/api/apps/assessment/services.py` | BKT + SM-2 |
| `apps/api/apps/content/management/commands/seed_content.py` | Content seeder |
| `apps/web/hooks/use-intuilab.ts` | WS chat hook |
| `apps/web/hooks/use-discovery.tsx` | Mastery/XP context |
| `apps/web/app/lab/page.tsx` | Dual lab shell |
| `Docs/IntuiLab_System_Architecture_v1_0.md` | Spec |
| `Docs/MASTER_ROADMAP.md` | Phases (somewhat outdated vs tracker) |
| `Docs/task_tracker.md` | Over-optimistic completion state |

## 11. Appendix B — Environment assumptions required for a local demo

To exercise the “happy path” today you would need roughly:

1. Python venv with all reverse-engineered deps installed  
2. `.env` with `SECRET_KEY`, `DEBUG`, optional `DATABASE_URL`, `XAI_API_KEY` or `GOOGLE_API_KEY`  
3. `migrate` + `seed_content` for each JSON file  
4. Daphne/ASGI on `:8000`  
5. `apps/web` dependencies installed + **missing `lib/utils` fixed**  
6. Next on `:3000`  
7. Manual creation of a Django user + some way to authenticate API calls (currently not productized)

---

*End of audit. This document describes repository state as of the audit date; it does not modify application code.*
