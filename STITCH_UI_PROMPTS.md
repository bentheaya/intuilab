# UI Development Guide & Stitch Prompts

This document outlines the frontend goals, required pages, and refined prompts for **Google Stitch** to ensure the IntuiLab UI is generated with production-grade structure and pedagogical depth.

## Technical Preferences for Stitch
To ensure the generated code fits the IntuiLab monorepo, specify these rules in your initial Stitch session:
- **Framework**: Next.js 15 (App Router).
- **Styling**: Tailwind CSS + shadcn/ui + Lucide React icons.
- **Architecture**: Separate "Pure UI" components (in `@/components/ui`) from "Feature" components (in `@/components/features`).
- **Real-time**: Leave `useSocraticChat` hook placeholders for WebSocket integration in chat sidebars.
- **Aesthetic**: **"Scientific Noir"** — Depth-heavy dark mode (`bg-zinc-950`), glassmorphism effects, and vibrant neon accents for subjects (Physics: Blue, Chemistry: Red, Bio: Green, Math: Purple).

---

## Required Pages & Routes

| Route | Page Name | Primary Objective |
| :--- | :--- | :--- |
| `/` | **Discovery Dashboard** | Knowledge Map navigation, streaks, and "Next Lesson" CTA. |
| `/learn/[subject]` | **Topic Navigator** | Hierarchical view of concepts and mastery heatmaps. |
| `/learn/.../[lesson]` | **Lesson Player** | The core experience: Multi-media learning + Socratic AI Sidebar. |
| `/lab/[lab_id]` | **Virtual Lab** | Full-screen simulation canvas with the "AI Lab Monitor". |
| `/feynman/[concept]` | **Feynman Challenger** | Voice/Text assessment where the student teaches the AI. |
| `/flashcards` | **Memory Deck** | SRS-based flashcard review with flip animations. |
| `/map` | **Knowledge Web** | Full-screen interactive D3/React Flow graph of all concepts. |
| `/portfolio` | **Discovery Portfolio** | Timeline of student insights, voice notes, and derivations. |
| `/history/[concept]` | **Intuition Timeline** | Interactive historical journey of a scientific discovery. |

---

## Refined Stitch Prompts

### 1. The Lesson Player (Core MVP)
**Copy and paste this into Stitch:**
> "Generate a professional Lesson Player UI for a Next.js 15 app using Tailwind and shadcn/ui. 
> **Layout**: Fixed-height viewport. Header has a progress bar and subject/lesson title. Main area is a 70/30 split.
> **Left Column (Learning)**: Scrollable area containing a placeholder for a 16:9 3D simulation canvas (Three.js component), a section for Markdown-formatted scientific text, and interactive MCQ 'Knowledge Checks' using shadcn Radio Groups.
> **Right Column (Socratic Tutor)**: A persistent chat sidebar. Top header shows a pulsing green indicator: 'Socratic Guardrail Active'. Messages should have distinct 'Student' and 'Mentor' styles. The 'Mentor' bubbles should use a slightly serif font for a classical academic feel.
> **Mobile**: The sidebar must collapse into a bottom-sheet.
> **Code Style**: Use a 'useSocraticChat' placeholder hook for and 'useLessonProgress' for the header."

### 2. The Discovery Dashboard (Knowledge Map)
**Copy and paste this into Stitch:**
> "Generate a premium Dashboard UI for IntuiLab. 
> **Centerpiece**: A large 'Knowledge Map' area using an interactive node-graph aesthetic (placeholder for React Flow). Nodes should be color-coded by subject (Physics: Blue, Chemistry: Red, etc.).
> **Widgets**:
> 1. 'Daily Spark': A streak counter widget with a flame icon and a weekly activity calendar.
> 2. 'Next Discovery': A prominent glassmorphism card suggesting the next lesson based on mastery, with a 'Begin Rediscovery' button.
> 3. 'Recent Insights': A list of the student's last 3 Portfolio entries.
> **Global Navigation**: Sleek Sidebar with icons for Learn, Map, Lab, Portfolio, and Flashcards.
> **Theme**: Deep Zinc-950 background with subtle radial gradients of the active subject's color."

### 3. The Feynman Challenger Assessment
**Copy and paste this into Stitch:**
> "Generate a clean, focused assessment UI called the 'Feynman Challenger'. 
> **Objective**: The student explains a concept to a '12-year-old' AI.
> **Layout**: Centered workspace. Top area features the AI persona (a friendly, curious avatar) and a 'Mastery Score' gauge (0-100%).
> **Interaction**: A large text-area for the explanation, but also include a prominent 'Record Voice' button (using a microphone icon with a ripple animation). 
> **Feedback**: Below the input, show three 'Understanding Gauges': Clarity, Depth, and Intuition. Use progress bars that update with 'Live AI Analysis' placeholders.
> **Theme**: Minimalist, focusing on concentration. Dark theme with soft purple (Mathematics) accents."

---

## Next Logic for Antigravity
Once Stitch provides the UI code:
1.  **Component Mapping**: I will place the files in `apps/web/components/`.
2.  **API Hooking**: I will connect the AI chat sidebar to our `SocraticConsumer` WebSocket.
3.  **Data Wiring**: I will map the Lesson Player's content to the `content_json` we defined in our PostgreSQL models.
