"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, Sparkles, Brain, ArrowLeft, Play, Milestone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface TimelineEntry {
  year: string;
  title: string;
  scientist: string;
  description: string;
}

interface TimelineData {
  concept_title: string;
  title: string;
  entries: TimelineEntry[];
}

export default function ConceptHistoryTimeline() {
  const params = useParams();
  const router = useRouter();
  const conceptSlug = params.concept as string;

  const [timeline, setTimeline] = useState<TimelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`http://localhost:8000/api/v1/content/concepts/${conceptSlug}/timeline`);
        if (!res.ok) {
          throw new Error('Failed to retrieve concept history timeline.');
        }
        const data = await res.json();
        setTimeline(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error loading timeline.');
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, [conceptSlug]);

  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-background flex flex-col items-center justify-center py-12 px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-10 h-10 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest">Reconstructing Historical Timeline...</p>
        </div>
      </div>
    );
  }

  if (error || !timeline || !timeline.entries || timeline.entries.length === 0) {
    return (
      <div className="flex-1 min-h-screen bg-background flex flex-col items-center justify-center py-12 px-6">
        <Card className="max-w-md bg-zinc-900/40 border-white/5 backdrop-blur-2xl p-8 text-center flex flex-col items-center gap-6">
          <div className="p-3 rounded-full bg-red-500/10 border border-red-500/20">
            <Milestone className="w-8 h-8 text-red-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold tracking-tight">No Timeline Registered</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No historical discovery entries were found for this concept. You can still study this concept directly using the Socratic tutor.
            </p>
          </div>
          <Button onClick={() => router.back()} className="w-full">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-background flex flex-col items-center py-12 px-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-purple-600/5 rounded-full blur-[130px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-blue-600/5 rounded-full blur-[130px]" />

      <div className="w-full max-w-3xl space-y-10 relative z-10">
        
        {/* Navigation back link */}
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="text-zinc-400 hover:text-white flex items-center gap-2 p-0 hover:bg-transparent"
        >
          <ArrowLeft className="w-4 h-4" /> Back to learning
        </Button>

        {/* Header */}
        <header className="space-y-3">
          <div className="flex items-center gap-2 text-purple-400">
            <Clock className="w-5 h-5 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-widest font-mono">Discovery Path Timeline</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            {timeline.title || `Discovery of ${timeline.concept_title}`}
          </h1>
          <p className="text-sm text-zinc-400 max-w-xl font-serif italic">
            "We stand on the shoulders of giants. Walk the path of the original discoverers to build your physical intuition."
          </p>
        </header>

        {/* Interactive Vertical Timeline */}
        <div className="relative pl-8 md:pl-16 space-y-12">
          {/* Vertical Timeline bar */}
          <div className="absolute left-[39px] md:left-[71px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-purple-500/80 via-blue-500/50 to-zinc-800" />

          {timeline.entries.map((entry, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.4 }}
              className="relative flex flex-col md:flex-row gap-6 items-start"
            >
              {/* Timeline bubble/node */}
              <div className="absolute left-[-6px] md:left-[-38px] top-1.5 w-6.5 h-6.5 rounded-full bg-zinc-950 border-4 border-purple-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)] z-10">
                <div className="w-1.5 h-1.5 bg-purple-300 rounded-full" />
              </div>

              {/* Event Year Column (Desktops only, mobile shows inside card) */}
              <div className="hidden md:flex flex-col w-20 text-right shrink-0 pr-4 pt-1">
                <span className="text-base font-black font-mono text-purple-400 tracking-wider">
                  {entry.year}
                </span>
                {entry.scientist && (
                  <span className="text-[8px] uppercase tracking-tighter text-zinc-500 font-bold truncate">
                    {entry.scientist.split(' ').pop()}
                  </span>
                )}
              </div>

              {/* Discovery Card */}
              <Card className="flex-1 bg-zinc-900/30 border-white/5 backdrop-blur-xl hover:border-purple-500/20 transition-all rounded-3xl overflow-hidden shadow-xl">
                <CardContent className="p-6 md:p-8 space-y-4">
                  {/* Mobile Year Badge */}
                  <div className="flex md:hidden items-center justify-between">
                    <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 font-mono">
                      {entry.year}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {entry.title}
                    </h3>
                    {entry.scientist && (
                      <p className="text-xs text-zinc-400 font-mono mt-0.5">
                        By {entry.scientist}
                      </p>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed text-zinc-300 font-serif">
                    {entry.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Action Button at the end of discovery path */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pt-10 flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <Button
            onClick={() => router.push(`/feynman/${conceptSlug}`)}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white font-bold h-12 px-8 rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all flex items-center gap-2"
          >
            <Brain className="w-4 h-4" /> Challenge Feynman Explanation
          </Button>

          <Button
            onClick={() => router.push(`/learn`)}
            variant="outline"
            className="w-full sm:w-auto h-12 px-8 rounded-xl border-white/10 hover:bg-zinc-800 text-zinc-300 font-bold"
          >
            Return to Core Study
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
