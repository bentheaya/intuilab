# IntuiLab - Next-Generation Science & Mathematics Learning Platform

A revolutionary, production-ready educational platform designed for intuitive rediscovery of Physics, Chemistry, Biology, and Mathematics through interactive, immersive experiences.

## 🚀 Features

### Core Learning Experience
- **Dashboard** (`/`) - Personalized daily rediscovery recommendations, progress tracking, streak counter
- **Subject Explorer** (`/learn`) - Browse Physics, Chemistry, Biology, and Mathematics with interactive topic trees
- **Knowledge Map** (`/map`) - Interactive visual graph of interconnected scientific concepts with mastery indicators
- **Virtual Laboratory** (`/lab`) - Real-time interactive simulations (Ideal Gas Law, DNA Replication, Electron Orbitals)
- **Feynman Challenger** (`/feynman`) - AI-powered scoring system for explaining concepts simply

### Advanced Features
- **Discovery Portfolio** (`/portfolio`) - Personal collection of insights, lab results, and annotations with full-text search
- **Historical Timeline** (`/history`) - Explore scientific breakthroughs with replay-able experiments
- **Peer Collaboration** (`/collaborate`) - Real-time shared whiteboard and group chat with AI moderator
- **User Profile** (`/profile`) - Mastery tracking, achievements, learning activity stats, global ranking

## 🎨 Design System

### Color Palette
- **Primary**: Deep Indigo (#4F46E5) to Electric Cyan (#22D3EE)
- **Accents**: Vibrant Emerald (#10B981) for mastery moments
- **Background**: Dark Mode (Slate-950: #0F172A) with subtle grid pattern
- **Subject Colors**:
  - Physics: Electric Blue (#0EA5E9)
  - Chemistry: Fiery Orange (#F97316)
  - Biology: Lush Green (#10B981)
  - Mathematics: Pure Violet (#8B5CF6)

### Visual Language
- **Glassmorphism**: Semi-transparent cards with backdrop blur
- **Animations**: Smooth Framer Motion transitions for discovery moments
- **Typography**: Inter for UI, large airy headings with generous whitespace
- **Components**: Reusable, accessible shadcn/ui base with custom theming

## 📁 Project Structure

```
app/
├── page.tsx              # Home dashboard
├── layout.tsx            # Root layout with design tokens
├── globals.css           # Design system & theme variables
├── learn/
│   └── page.tsx          # Subject explorer
├── map/
│   └── page.tsx          # Knowledge map
├── lab/
│   └── page.tsx          # Virtual laboratory
├── feynman/
│   └── page.tsx          # Feynman challenger
├── portfolio/
│   └── page.tsx          # Discovery portfolio
├── history/
│   └── page.tsx          # Historical timeline
├── collaborate/
│   └── page.tsx          # Peer collaboration
└── profile/
    └── page.tsx          # User profile

components/
├── navbar.tsx            # Top navigation with streak & profile
├── sidebar.tsx           # Collapsible navigation with mastery indicator
├── hero-section.tsx      # Landing hero with CTAs
├── lesson-card.tsx       # Reusable lesson preview card
├── concept-node.tsx      # Interactive concept graph node
└── rediscover-loader.tsx # Animated atom loader
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Animations**: Framer Motion
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)
- **TypeScript**: Full type safety

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or pnpm 10+

### Installation
```bash
# Clone or extract the project
cd intuilab

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Access the App
Open [http://localhost:3000](http://localhost:3000) in your browser. The app includes:

- Hot Module Replacement (HMR) for instant updates
- Server-side rendering for optimal performance
- Responsive design (mobile-first PWA)

## 📱 Responsive Design

- **Mobile**: Bottom navigation pattern with collapsible sidebar
- **Tablet**: Hybrid layout with adaptive components
- **Desktop**: Full-featured sidebar with expanded dashboard

## ✨ Key Design Principles

1. **Intuitive Rediscovery**: Every interaction feels like a scientific discovery
2. **Progressive Disclosure**: Complex information revealed gradually
3. **Mastery Visualization**: Real-time progress indicators across all pages
4. **Accessibility First**: ARIA labels, semantic HTML, high contrast
5. **Performance Optimized**: Code splitting, lazy loading, Turbopack bundling

## 🎯 Component Highlights

### Glassmorphic Cards
Semi-transparent overlays with gradient borders and subtle inner shadows create depth.

### Animated Loaders
Electron orbital animations represent "rediscovery in progress" with pulsing nuclei.

### Concept Nodes
Interactive graph nodes with connection indicators, glow effects on hover, and state-based styling.

### Progress Rings
Animated SVG-based progress indicators with gradient fills for mastery tracking.

### Energy Badges
Pill-shaped badges indicating streaks, energy levels, and achievements with glowing accents.

## 🔮 Future Enhancements

- Multi-user real-time collaboration with WebSockets
- AI-powered adaptive learning paths
- Voice-to-text explanation recording
- 3D interactive molecular and atomic visualizations
- Gamification leaderboards and team challenges
- Export insights as shareable portfolios
- Offline mode with service worker caching

## 📄 License

Built with ❤️ for intuitive learning. Open source and MIT licensed.

## 🤝 Contributing

This project demonstrates best practices in:
- React 19 with Server Components
- Next.js 16 patterns
- Tailwind CSS v4 customization
- Framer Motion choreography
- Accessible UI design

Feel free to fork, modify, and build upon IntuiLab!

---

**IntuiLab**: Where Science Becomes Intuitive. 🔬✨
