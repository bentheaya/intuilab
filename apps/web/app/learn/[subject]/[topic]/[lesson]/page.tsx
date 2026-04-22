"use client";

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { SocraticSidebar } from '@/components/features/SocraticSidebar';
import { KnowledgeCheck } from '@/components/features/KnowledgeCheck';
import { MessageSquare, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useLessonProgress } from '@/hooks/use-intuilab';

import { motion } from 'motion/react';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// KaTeX CSS moved to RootLayout




const markdownContent = `
# The Principle of Conservation of Energy

In physics and chemistry, the **law of conservation of energy** states that the total energy of an isolated system remains constant; it is said to be conserved over time.

Energy can neither be created nor destroyed; rather, it can only be transformed or transferred from one form to another. For instance, chemical energy is converted to kinetic energy when a stick of dynamite explodes.

## Mechanical Energy
In a frictionless system, the sum of potential energy ($U$) and kinetic energy ($K$) is constant:
$$E = K + U$$

Where:
- $K = \\frac{1}{2}mv^2$
- $U = mgh$
`;

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function LessonPlayer() {
  const { subject, topic, lesson } = useParams();
  const { progress } = useLessonProgress();
  const [lessonData, setLessonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/content/lessons/${lesson}`);
        const data = await res.json();
        setLessonData(data);
      } catch (err) {
        console.error("Failed to fetch lesson:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lesson]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-mono text-muted-foreground animate-pulse">Synchronizing with Knowledge Base...</span>
        </div>
      </div>
    );
  }

  if (!lessonData || lessonData.error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background p-8">
        <div className="max-w-md text-center space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Lesson Not Available</h2>
          <p className="text-muted-foreground">The specific concept derivation for "{lesson}" is not yet indexed in our repository.</p>
          <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-border flex items-center px-6 gap-6 bg-background/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={() => window.history.back()}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="breadcrumb-style">
            {lessonData.subject || "Physics"} • Mechanics <span className="text-blue-400">{lessonData.concept_title}</span>
          </div>
        </div>
        
        <div className="flex-1 flex items-center gap-4 px-12">
          <Progress value={progress} className="h-1 bg-secondary" />
          <span className="text-[10px] font-mono text-muted-foreground">{progress}%</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-border hover:bg-secondary text-xs">
            <Info className="w-3.5 h-3.5 mr-2" />
            Resources
          </Button>
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger
                render={
                  <Button size="icon" className="bg-blue-600 hover:bg-blue-500">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                }
              />

              <SheetContent side="bottom" className="h-[80vh] p-0 bg-background border-border">
                <SocraticSidebar lessonId={lesson as string} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Learning Canvas */}
        <main className="flex-1 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1">
            <div className="max-w-4xl mx-auto p-8 space-y-12">
              <div className="space-y-4">
                <h1 className="text-4xl font-black tracking-tighter">{lessonData.title}</h1>
                <div className="text-lg text-muted-foreground font-serif italic border-l-2 border-blue-500/30 pl-4 prose prose-zinc dark:prose-invert italic">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{lessonData.summary}</ReactMarkdown>
                </div>

              </div>

              {lessonData.content.map((section: any, idx: number) => {
                switch (section.type) {
                  case 'text':
                    return (
                      <article key={idx} className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{section.content}</ReactMarkdown>
                      </article>

                    );
                  case 'socratic_pause':
                    return (
                      <div key={idx} className="p-6 rounded-2xl bg-zinc-900 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Socratic Reflection</span>
                        </div>
                        <p className="text-zinc-200 leading-relaxed italic">{section.content}</p>
                      </div>
                    );
                  case 'lab':
                    return (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="aspect-video w-full rounded-2xl bg-secondary/30 border border-border relative overflow-hidden group cursor-pointer shadow-xl"
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/30 group-hover:scale-110 transition-transform neon-glow-physics">
                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                              <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                            </div>
                          </div>
                          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{section.content || "Launch Simulation"}</span>
                        </div>
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                      </motion.div>
                    );
                  default:
                    return null;
                }
              })}

              <div className="h-24 flex items-center justify-between border-t border-border pt-8 pb-12">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-500 px-8 text-white">
                  Continue Mastery
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </ScrollArea>
        </main>

        {/* Right Column: Socratic Tutor (Desktop) */}
        <aside className="hidden lg:block w-[400px] border-l border-border">
          <SocraticSidebar lessonId={lesson as string} />
        </aside>
      </div>
    </div>
  );
}

// Add the Sparkles import missing in the replacement
import { Sparkles } from 'lucide-react';

