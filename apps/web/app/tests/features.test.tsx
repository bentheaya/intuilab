import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock useRouter and useParams from Next.js
vi.mock('next/navigation', () => ({
  useParams: () => ({ concept: 'angular-momentum' }),
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn()
  })
}));

// Mock useDiscovery hook
vi.mock('@/hooks/use-discovery', () => ({
  useDiscovery: () => ({
    xp: 1200,
    mastery: { 'angular-momentum': 65 },
    refreshMastery: vi.fn(),
    addXP: vi.fn()
  })
}));

// Mock framer-motion/motion to avoid 3D/animation loop issues in JSDOM
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    aside: ({ children, ...props }: any) => <aside {...props}>{children}</aside>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}));

// Mock child components that rely on Canvas/WebGL (like ProjectileLab)
vi.mock('@/components/features/lab/ProjectileLab', () => ({
  ProjectileLab: () => <div data-testid="projectile-lab-canvas">Mocked Canvas</div>
}));

// Import components to test
import Portfolio from '../portfolio/page';
import FeynmanChallenger from '../feynman/[concept]/page';
import { TitrationLab } from '@/components/features/lab/TitrationLab';

describe('IntuiLab Frontend Features', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn();
  });

  describe('FeynmanChallenger Page', () => {
    it('renders and fetches concept details correctly', async () => {
      // Mock concept fetch API response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 1,
          title: "Angular Momentum",
          slug: "angular-momentum",
          summary: "L = r x p",
          subject: "physics"
        })
      });

      render(<FeynmanChallenger />);

      // Verify concept headers and summary are fetched
      await waitFor(() => {
        expect(screen.getByText('Angular Momentum')).toBeDefined();
        expect(screen.getByText(/L = r x p/)).toBeDefined();
      });

      // Verify text area is editable
      const textarea = screen.getByPlaceholderText(/Break it down in your own words/i);
      fireEvent.change(textarea, { target: { value: 'Momentum is mass times velocity.' } });
      expect((textarea as HTMLTextAreaElement).value).toBe('Momentum is mass times velocity.');
    });

    it('submits explanation and displays AI feedback scores', async () => {
      // Setup mock fetches: 1st for concept load, 2nd for explanation score
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 1, title: "Angular Momentum", summary: "L = r x p", slug: "angular-momentum" })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            score: 85,
            clarity: 4,
            depth: 5,
            intuition: 4,
            feedback: "Excellent description!"
          })
        });

      render(<FeynmanChallenger />);

      await waitFor(() => {
        expect(screen.getByText(/L = r x p/)).toBeDefined();
      });

      const textarea = screen.getByPlaceholderText(/Break it down in your own words/i);
      fireEvent.change(textarea, { target: { value: 'Momentum is mass times velocity.' } });

      const submitBtn = screen.getByText('Analyze Explanation');
      fireEvent.click(submitBtn);

      // Verify feedback and score display
      await waitFor(() => {
        expect(screen.getByText(/SCORE: 85/)).toBeDefined();
        expect(screen.getByText(/Excellent description!/)).toBeDefined();
      });
    });
  });

  describe('Portfolio Digital Notebook Page', () => {
    it('fetches real insights from backend and lists them', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: "123",
            date: "2026-07-10",
            time: "11:20 PM",
            title: "Torque Conservation Insight",
            insight_type: "derivation",
            summary: "Torque is independent of reference point choice.",
            subject: "physics",
            tags: ["Mechanics"]
          }
        ]
      });

      render(<Portfolio />);

      await waitFor(() => {
        expect(screen.getByText('Torque Conservation Insight')).toBeDefined();
        expect(screen.getByText('Torque is independent of reference point choice.')).toBeDefined();
      });
    });

    it('adds a new note successfully via form submission', async () => {
      // Setup mock fetches: 1st for initial load (empty), 2nd for POST creation, 3rd for refresh (with 1 item)
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => []
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ status: 'success', insight_id: '456' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [
            {
              id: "456",
              date: "2026-07-10",
              time: "11:25 PM",
              title: "My New Theory",
              insight_type: "derivation",
              summary: "A brief summary of my personal derivation.",
              subject: "physics",
              tags: ["Derivations"]
            }
          ]
        });

      render(<Portfolio />);

      // Open creation form
      const addBtn = screen.getByText('Add Note');
      fireEvent.click(addBtn);

      const titleInput = screen.getByPlaceholderText(/e.g. Invariance of torque vectors/i);
      const summaryTextarea = screen.getByPlaceholderText(/Explain the intuition you synthesized/i);

      fireEvent.change(titleInput, { target: { value: 'My New Theory' } });
      fireEvent.change(summaryTextarea, { target: { value: 'A brief summary of my personal derivation.' } });

      const saveBtn = screen.getByText('Save Discovery to Portfolio');
      fireEvent.click(saveBtn);

      // Verify newly created insight is rendered
      await waitFor(() => {
        expect(screen.getByText('My New Theory')).toBeDefined();
        expect(screen.getByText('A brief summary of my personal derivation.')).toBeDefined();
      });
    });
  });

  describe('Chemistry TitrationLab Component', () => {
    it('calculates pH curve and color transitions correctly', () => {
      // 1. Initial State (Phenolphthalein - pH ~1, acidic, color clear)
      const { rerender } = render(
        <TitrationLab 
          acidConc={0.1}
          baseConc={0.1}
          baseVolAdded={0}
          indicator="phenolphthalein"
        />
      );
      expect(screen.getByText('pH 1.00')).toBeDefined();
      expect(screen.getByText('Acidic')).toBeDefined();

      // 2. Equivalent Point (base added = 25 mL, pH should hit 7)
      rerender(
        <TitrationLab 
          acidConc={0.1}
          baseConc={0.1}
          baseVolAdded={25}
          indicator="phenolphthalein"
        />
      );
      expect(screen.getByText('pH 7.00')).toBeDefined();
      expect(screen.getByText('Neutral')).toBeDefined();

      // 3. Excess Base (base added = 30 mL, pH > 7, basic state)
      rerender(
        <TitrationLab 
          acidConc={0.1}
          baseConc={0.1}
          baseVolAdded={30}
          indicator="phenolphthalein"
        />
      );
      expect(screen.getByText('pH 11.96')).toBeDefined();
      expect(screen.getByText('Basic')).toBeDefined();
    });
  });
});
