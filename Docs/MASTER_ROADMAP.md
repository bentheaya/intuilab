# IntuiLab Master Roadmap: Ideation to Global Execution

IntuiLab is a next-generation "Rediscovery Learning" platform designed to transform science and mathematics education. This document serves as the authoritative guide for the project's evolution, covering all features, phases, and technical milestones.

## 🎯 The Ultimate Goal
To build a platform where students **rediscover** knowledge through Socratic guidance, historical context, and virtual experimentation, moving beyond passive information transfer to deep, intuitive mastery.

---

## 🚀 Phase 1: The Extraordinary Foundation (Months 0–6)
**Goal**: Build a high-performance MVP that delivers exceptional value in Physics and Chemistry for high school students.

### Features (MVP)
1.  **Bite-Sized Lessons**: 5–30 minute guided learning paths with embedded checks.
2.  **Socratic AI Tutor**: The central "Rediscovery" engine that only asks and guides.
3.  **Flashcard System (SRS)**: Spaced-repetition learning based on the SM-2 algorithm.
4.  **Adaptive Learning Engine**: Bayesian Knowledge Tracing (BKT) to adjust pacing and difficulty.
5.  **Concept Graph**: Interactive knowledge map showing connections between topics.
6.  **Curriculum Alignment**: Mapping content to KCSE, CBC, IB, and A-Level.
7.  **Progress Tracking**: Mastery heatmaps, XP, and learning streaks.
8.  **First Principles Mode**: Stripping jargon to rebuild concepts from scratch.
9.  **Multi-Language Support**: Launching with English and Swahili.
10. **Offline Mode**: Downloadable lessons and basic interactive content.

---

## 📈 Phase 2: Depth & Growth (Months 7–18)
**Goal**: Expand to Biology and Mathematics, launch university-level content, and ship the high-complexity proprietary features.

### Features (Advanced)
11. **Virtual Lab Simulator**: Real-time scientific simulations with "Lab Monitor" AI mode.
12. **AI Feynman Challenger**: AI plays a "12-year-old" while the student explains concepts.
13. **History-to-Intuition Timeline**: Interactive journeys through scientific discovery.
14. **Personal Discovery Portfolio**: Digital lab notebook for original derivations and insights.
15. **"Why It Matters" Stories**: AI-narrated documentaries on real-world impact.
16. **Voice-First & Accessibility**: Voice interaction and audio-only learning modes.
17. **Dynamic Concept Weaver**: Personalised cross-subject "knowledge webs".
18. **Notebook & Annotation**: Rich in-lesson note-taking and diagram marking.
19. **Peer Collaboration Rooms**: AI-moderated group problem solving.
20. **Problem-Solving Workspace**: Step-by-step interactive hint system.

---

## 🔭 Phase 3: Global Vision (Months 19+)
**Goal**: Unprecedented scale and immersive technology.

### Features (Future)
21. **AR/VR "See It in Real Life"**: 3D molecules, magnetic fields, and fractals in AR/VR.
- **Global Expansion**: Multi-language (French, Arabic) and international curricula.
- **IntuiLab for Schools**: Comprehensive teacher dashboards and class management.
- **Sign Language**: Video overlays for inclusivity.

---

## 🛠️ Development Plan & Execution Steps

### 1. Architectural Setup [COMPLETED]
- [x] Monorepo (Turborepo) initialization.
- [x] Backend scaffolding (Django 6.0 + PostgreSQL + Redis).
- [x] Authentication & User Profiles.
- [x] Core Content Database Schema (Subject, Topic, Concept, Lesson).

### 2. The AI "Brain" (Grok Integration) [NEXT STEP]
- [ ] Implement `GrokOrchestrator` with the **Socratic Guardrail**.
- [ ] Build the WebSocket bridge for real-time AI guidance.
- [ ] Implement AI-driven hint generation and "Rediscovery" prompts.

### 3. Content Pipeline & CMS
- [ ] Build the Django Admin CMS for domain experts.
- [ ] Create the AI-assisted content generator (Auto-generate quizzes, narratives).
- [ ] Seed the first 50 "Physics: Mechanics" lessons.

### 4. Interactive Frontend (Lesson Player)
- [ ] Build the `LessonPlayer` component shell.
- [ ] Implement the interactive sidebar for the Socratic Tutor.
- [ ] Create the `ConceptGraph` visualizer using React Flow/D3.

### 5. Adaptive Mastery Engine
- [ ] Implement Bayesian Knowledge Tracing (BKT) backend logic.
- [ ] Build the SM-2 Flashcard scheduler.
- [ ] Integrate progress tracking into the user dashboard.

### 6. Polish & PWA
- [ ] Implement Service Workers for Offline Mode.
- [ ] Add Swahili translations.
- [ ] Security hardening & Performance optimization.

---

## 📌 Most Convenient Next Step: AI Orchestrator
To move from "Content Database" to "Rediscovery Platform", the system needs its **Brain**. 
Implementing the **GrokOrchestrator** service in `apps/ai` is the most logical next step. This involves:
1.  Defining the core **System Prompt** for the Socratic method.
2.  Setting up the **LangChain** agent to interact with xAI's Grok.
3.  Defining the **Tools** the AI can use (lookup concept history, generate hints).

---
*Created by Antigravity AI on 2026-04-14*
