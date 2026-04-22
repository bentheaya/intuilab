"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useDiscovery, Subject } from '@/hooks/use-discovery';
import { BookOpen, Sparkles, Clock, ArrowRight, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const subjectThemes: Record<Subject, { color: string, border: string, bg: string, text: string }> = {
  physics: { color: 'bg-blue-500', border: 'border-blue-500/20', bg: 'bg-blue-500/10', text: 'text-blue-400' },
  chemistry: { color: 'bg-red-500', border: 'border-red-500/20', bg: 'bg-red-500/10', text: 'text-red-400' },
  biology: { color: 'bg-emerald-500', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  mathematics: { color: 'bg-purple-500', border: 'border-purple-500/20', bg: 'bg-purple-500/10', text: 'text-purple-400' },
};

const mockTopics = [
  { id: 'mechanics', title: 'Classical Mechanics', concepts: 12, completed: 8, estimatedTime: '4h 20m', status: 'active' },
  { id: 'electromagnetism', title: 'Electromagnetism', concepts: 15, completed: 3, estimatedTime: '6h 45m', status: 'available' },
  { id: 'thermodynamics', title: 'Thermodynamics', concepts: 10, completed: 0, estimatedTime: '3h 30m', status: 'locked' },
  { id: 'optics', title: 'Optics & Waves', concepts: 8, completed: 0, estimatedTime: '2h 15m', status: 'locked' },
];

import { useState, useEffect } from 'react';

export default function TopicNavigator() {
  const params = useParams();
  const subject = (params.subject as Subject) || 'physics';
  const theme = subjectThemes[subject] || subjectThemes.physics;
  const { mastery } = useDiscovery();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/content/subjects/${subject}/topics`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch topics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, [subject]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const topics = data?.topics || [];

  return (
    <div className="flex-1 p-8 space-y-12 bg-background relative overflow-hidden">
      {/* Subject Background Glow */}
      <div className={cn("absolute -top-24 -right-24 w-[40%] h-[40%] rounded-full blur-[120px] opacity-10", theme.color)} />
      
      <header className="space-y-4 relative z-10">
        <div className="breadcrumb-style">
          Subject <span>{subject.charAt(0).toUpperCase() + subject.slice(1)}</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Concept Mastery</h1>
            <p className="text-muted-foreground mt-2">Explore the hierarchical paths of scientific intuition.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Subject Readiness</span>
              <div className="text-2xl font-mono font-bold flex items-center gap-2">
                {Math.floor((mastery[subject] || 0) / 10)}% <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {topics.map((topic: any, i: number) => {
          const conceptsCount = topic.concepts.length;
          const firstConcept = topic.concepts[0]?.slug || 'demo';
          
          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={cn(
                "widget-geometric group transition-all duration-300 hover:border-blue-500/40"
              )}>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center border shadow-xl", theme.border, theme.bg)}>
                      <BookOpen className={cn("w-5 h-5", theme.text)} />
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{conceptsCount} Concepts</div>
                      <div className="text-xs font-mono flex items-center gap-1 justify-end mt-1">
                        <Clock className="w-3 h-3" /> ~{conceptsCount * 15}m
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold tracking-tight">{topic.title}</h3>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">0% Explored</span>
                      <span className="text-foreground font-bold">0/{conceptsCount}</span>
                    </div>
                    <Progress value={0} className="h-1 bg-secondary" />
                  </div>

                  <Button 
                    render={<Link href={`/learn/${subject}/${topic.id}/${firstConcept}`} />}
                    nativeButton={false}
                    variant="outline" 
                    className="w-full justify-between h-10 group-hover:bg-blue-600 group-hover:text-white transition-all text-xs"
                  >
                    Begin Discovery
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {topics.length === 0 && (
          <div className="col-span-full py-12 text-center border border-dashed border-border rounded-xl">
            <p className="text-muted-foreground">No topics have been seeded for this subject yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

  );
}
