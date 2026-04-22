"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDiscovery } from '@/hooks/use-discovery';
import { Layers, Flame, RotateCcw, Check, X, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const mockCards = [
  { id: '1', question: 'What is the physical significance of the area under a Force-Position graph?', answer: 'It represents the total Work Done by the force on the system.', subject: 'physics', diff: 'medium' },
  { id: '2', question: 'State the First Law of Thermodynamics in terms of internal energy, heat, and work.', answer: 'ΔU = Q - W (The change in internal energy is heat added minus work done by the system).', subject: 'physics', diff: 'hard' },
  { id: '3', question: 'Define "Entropy" from a statistical mechanics perspective.', answer: 'Entropy (S) is a measure of the number of microscopic configurations (W) corresponding to a macroscopic state: S = k ln W.', subject: 'physics', diff: 'expert' },
];

export default function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { streak, xp } = useDiscovery();
  const currentCard = mockCards[currentIndex];

  const handleFlip = () => setIsFlipped(!isFlipped);
  
  const handleScore = (score: 'easy' | 'hard' | 'forgot') => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % mockCards.length);
    }, 150);
  };

  return (
    <div className="flex-1 min-h-screen bg-background flex flex-col items-center py-12 px-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-4xl space-y-12 relative z-10">
        {/* Header Stats */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-zinc-900/50 border border-white/5 backdrop-blur-md">
              <Layers className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Memory Deck</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Scientific Spaced Repetition</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Current Session</span>
              <div className="text-lg font-mono font-bold flex items-center gap-2">
                12 / 45 <span className="text-xs text-blue-400 bg-blue-500/10 px-2 rounded-full border border-blue-500/20">Active</span>
              </div>
            </div>
            <div className="h-10 w-px bg-white/5" />
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <Flame className="w-4 h-4 text-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]" />
              </div>
              <span className="text-lg font-mono font-bold">{streak}</span>
            </div>
          </div>
        </header>

        {/* Card Interface */}
        <div className="relative h-[420px] w-full flex items-center justify-center perspective-[1000px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -50 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl h-full relative cursor-pointer"
              onClick={handleFlip}
            >
              <motion.div
                className="w-full h-full relative transition-all duration-500 preserve-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front Side */}
                <Card className="absolute inset-0 backface-hidden flex flex-col justify-center items-center p-12 text-center bg-zinc-900/40 border-white/5 backdrop-blur-2xl shadow-2xl rounded-[2.5rem]">
                  <Badge className="absolute top-8 right-8 bg-blue-500/10 text-blue-400 border-blue-500/20">Physics</Badge>
                  <div className="absolute top-8 left-8 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Question</div>
                  <h2 className="text-2xl font-serif leading-relaxed text-zinc-100 italic">
                    "{currentCard.question}"
                  </h2>
                  <div className="absolute bottom-8 text-[10px] font-bold tracking-widest text-zinc-600 animate-pulse">Click to Reveal Intuition</div>
                </Card>

                {/* Back Side */}
                <Card 
                  className="absolute inset-0 backface-hidden flex flex-col justify-center items-center p-12 text-center bg-zinc-950 border-blue-500/30 backdrop-blur-3xl shadow-2xl rounded-[2.5rem]"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  <Badge className="absolute top-8 right-8 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Answer Revealed</Badge>
                  <div className="absolute top-8 left-8 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Insight</div>
                  <div className="space-y-6">
                    <p className="text-xl font-medium leading-relaxed text-zinc-200">
                      {currentCard.answer}
                    </p>
                    <div className="flex items-center justify-center gap-3 text-[10px] uppercase font-bold tracking-widest text-blue-400">
                      <Sparkles className="w-3 h-3" /> Intuition Synthesized
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* SRS Actions */}
        <div className="flex items-center justify-center gap-6">
          <Button 
            onClick={(e) => { e.stopPropagation(); handleScore('forgot'); }}
            variant="outline" 
            className="h-16 w-16 rounded-full border-red-500/30 hover:bg-red-500/10 text-red-500 group transition-all"
          >
            <X className="w-6 h-6 group-active:scale-90" />
          </Button>
          <Button 
            onClick={(e) => { e.stopPropagation(); handleScore('hard'); }}
            variant="outline" 
            className="h-16 px-10 rounded-2xl border-white/5 bg-zinc-900/50 hover:bg-zinc-800 text-sm font-bold uppercase tracking-widest"
          >
            Not Quite
          </Button>
          <Button 
            onClick={(e) => { e.stopPropagation(); handleScore('easy'); }}
            className="h-16 w-16 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] group transition-all"
          >
            <Check className="w-6 h-6 group-active:scale-95" />
          </Button>
        </div>

        {/* Session Progress */}
        <footer className="pt-12 flex flex-col gap-4 items-center">
          <div className="w-full max-w-sm h-1.5 bg-zinc-900 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-600"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentIndex + 1) / mockCards.length) * 100}%` }}
            />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Session Progress</span>
        </footer>
      </div>
    </div>
  );
}
