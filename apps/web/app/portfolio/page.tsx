"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { useDiscovery } from '@/hooks/use-discovery';
import { Briefcase, Calendar, MapPin, Quote, Mic, FileText, ChevronRight, Share2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const mockInsights = [
  {
    id: '1',
    date: 'April 20, 2026',
    time: '01:45 AM',
    title: 'Non-linear derivation of Angular Momentum',
    type: 'derivation',
    summary: 'While exploring the conservation laws, I realized that the pivot point choice is purely relative but the torque result is invariant...',
    subject: 'physics',
    tags: ['Mechanics', 'Personal Insight'],
  },
  {
    id: '2',
    date: 'April 18, 2026',
    time: '11:20 PM',
    title: 'Intuition on Entropy',
    type: 'voice-note',
    summary: 'Voice recording: Transcribed summary of the relationship between entropy and information theory. Entropy is missing information.',
    subject: 'physics',
    tags: ['Thermodynamics', 'Philosophy'],
  },
  {
    id: '3',
    date: 'April 15, 2026',
    time: '04:10 PM',
    title: 'Chemical Equilibrium Visualization',
    type: 'lab-note',
    summary: 'Le Chatelier\'s principle is essentially system feedback in action. Like a spring resisting displacement.',
    subject: 'chemistry',
    tags: ['Equilibrium', 'Analogies'],
  }
];

export default function Portfolio() {
  const { xp } = useDiscovery();

  return (
    <div className="flex-1 min-h-screen bg-background p-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[150px]" />
      
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        {/* Portfolio Header */}
        <header className="flex items-end justify-between border-b border-white/5 pb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-zinc-900 border border-white/10">
                <Briefcase className="w-5 h-5 text-zinc-400" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Personal Discovery Lab</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter">Your Portfolio</h1>
            <p className="text-muted-foreground max-w-md">A chronological record of every intuition synthesized and concept derivation achieved.</p>
          </div>
          
          <div className="text-right space-y-2">
            <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Synthesis Level</div>
            <div className="text-4xl font-mono font-black italic text-blue-500">
              Lvl {Math.floor(xp / 1000)}
            </div>
          </div>
        </header>

        {/* Timeline Content */}
        <div className="relative space-y-12">
          {/* Vertical Line */}
          <div className="absolute left-[20px] top-4 bottom-4 w-px bg-gradient-to-b from-blue-500/50 via-zinc-800 to-transparent" />

          {mockInsights.map((insight, i) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-8 relative"
            >
              {/* Timeline Marker */}
              <div className="relative z-10 mt-1.5 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <div className={cn(
                  "w-[40px] h-[40px] rounded-full border bg-zinc-950 flex items-center justify-center",
                  insight.subject === 'physics' ? "border-blue-500/50 text-blue-400" : "border-red-500/50 text-red-400"
                )}>
                  {insight.type === 'derivation' ? <FileText className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </div>
              </div>

              {/* Insight Card */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground uppercase">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {insight.date}</span>
                    <span>•</span>
                    <span>{insight.time}</span>
                  </div>
                  <div className="flex gap-2">
                    {insight.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-[8px] bg-zinc-900 border-white/5 text-zinc-400 px-2 py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-xl hover:border-blue-500/20 transition-all cursor-pointer group">
                  <CardContent className="p-8 space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-2xl font-bold tracking-tight group-hover:text-blue-400 transition-colors">{insight.title}</h3>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon-sm" className="h-8 w-8 rounded-lg bg-zinc-950/50 border border-white/5">
                          <Share2 className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" className="h-8 w-8 rounded-lg bg-zinc-950/50 border border-white/5">
                          <ChevronRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed font-serif italic">
                      <Quote className="w-3 h-3 inline-block mr-2 text-blue-500/50 mb-4" />
                      {insight.summary}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold uppercase tracking-widest pt-2">
                      <Sparkles className="w-3 h-3" /> Verified by Socratic Mentor
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
        
        <footer className="text-center pt-8 border-t border-white/5">
          <p className="text-xs text-muted-foreground">Keep exploring. Every derivation is a step towards true mastery.</p>
        </footer>
      </div>
    </div>
  );
}
