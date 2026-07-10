"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mic, Send, Sparkles, Brain, Zap, Lightbulb, Play, ArrowLeft, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDiscovery } from '@/hooks/use-discovery';
import { cn } from '@/lib/utils';

interface ConceptData {
  id: number;
  title: string;
  slug: string;
  summary: string;
  subject: string;
}

export default function FeynmanChallenger() {
  const params = useParams();
  const router = useRouter();
  const conceptSlug = params.concept as string;

  const [concept, setConcept] = useState<ConceptData | null>(null);
  const [explanation, setExplanation] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    score: 0,
    clarity: 0,
    depth: 0,
    intuition: 0
  });

  const { mastery, refreshMastery, addXP } = useDiscovery();
  const recognitionRef = useRef<any>(null);

  // Fetch concept details on mount
  useEffect(() => {
    const fetchConcept = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/content/concepts/${conceptSlug}`);
        if (res.ok) {
          const data = await res.json();
          setConcept(data);
        }
      } catch (err) {
        console.error("Failed to fetch concept details:", err);
      }
    };
    fetchConcept();
  }, [conceptSlug]);

  // Set up Speech-to-Text Recognition using browser Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';

        rec.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setExplanation(prev => prev + finalTranscript);
          }
        };

        rec.onerror = (e: any) => {
          console.error("Speech Recognition Error:", e);
          setIsRecording(false);
        };

        rec.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech-to-text is not supported in this browser. Try Chrome, Edge, or Safari.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const handleAnalyze = async () => {
    if (!explanation.trim()) return;

    try {
      setEvaluating(true);
      setFeedback(null);

      const res = await fetch('http://localhost:8000/api/v1/assessment/feynman/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept_slug: conceptSlug,
          explanation: explanation
        })
      });

      if (res.ok) {
        const data = await res.json();
        
        // Update local stats
        setMetrics({
          score: data.score || 0,
          clarity: data.clarity || 0,
          depth: data.depth || 0,
          intuition: data.intuition || 0
        });
        setFeedback(data.feedback || "Good job! Keep explaining simple terms.");
        
        // Award XP based on explanation quality
        if (data.score >= 70) {
          addXP(25);
        } else {
          addXP(10);
        }

        // Refresh discovery context mastery levels to update global state
        if (refreshMastery) {
          refreshMastery();
        }
      }
    } catch (err) {
      console.error("Feynman analysis failed:", err);
    } finally {
      setEvaluating(false);
    }
  };

  const currentMastery = concept ? (mastery[concept.slug] || 0) : 0;

  return (
    <div className="flex-1 min-h-screen bg-background flex flex-col items-center py-12 px-6 relative overflow-hidden">
      {/* Soft Purple Accents for Math/Theory */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[150px]" />

      <div className="w-full max-w-3xl space-y-10 relative z-10">
        
        {/* Navigation back link */}
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="text-zinc-400 hover:text-white flex items-center gap-2 p-0 hover:bg-transparent"
        >
          <ArrowLeft className="w-4 h-4" /> Back to learning
        </Button>

        {/* Header: AI Avatar & Mastery */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16 border-2 border-purple-500/30 ring-4 ring-purple-500/10">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Richard" />
                <AvatarFallback>RF</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-500 rounded-full border-2 border-background flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <div className="breadcrumb-style font-mono">
                Feynman Challenger <span className="text-zinc-500 ml-2">"Explain it like I'm 12."</span>
              </div>
              <h1 className="text-xl font-bold mt-1 text-white">
                {concept ? concept.title : "Loading concept..."}
              </h1>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="text-[10px] uppercase tracking-widest text-purple-400 font-bold">Concept Mastery</span>
            <div className="relative w-20 h-20 rounded-full">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="stroke-zinc-800"
                  strokeDasharray="100, 100"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="stroke-purple-500 transition-all duration-1000"
                  strokeDasharray={`${currentMastery}, 100`}
                  strokeWidth="3"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-foreground">{currentMastery}%</span>
              </div>
            </div>
          </div>
        </header>

        {/* Concept Instruction Box */}
        {concept && (
          <Card className="bg-zinc-900/30 border border-white/5 p-5 rounded-2xl">
            <div className="flex gap-3">
              <Lightbulb className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs uppercase font-bold tracking-widest text-zinc-400">Core Summary to explain</h4>
                <p className="text-sm text-zinc-300 leading-relaxed font-serif italic">
                  "{concept.summary}"
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Interaction Area */}
        <Card className="widget-geometric overflow-hidden border border-purple-500/20 bg-zinc-950/40 backdrop-blur-xl">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block">Your Explanation</label>
              <Textarea
                placeholder="Break it down in your own words. Avoid fancy scientific jargon. Use analogies and simple models..."
                className="min-h-[200px] bg-transparent border-none focus-visible:ring-0 text-lg leading-relaxed resize-none p-0 placeholder:text-zinc-700 font-serif text-zinc-200"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                disabled={evaluating}
              />
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {isRecording && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute inset-0 bg-red-500/20 rounded-full"
                    />
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    className={`relative z-10 h-12 w-12 rounded-full border-white/10 transition-colors ${
                      isRecording ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'hover:bg-zinc-800'
                    }`}
                    onClick={toggleRecording}
                    disabled={evaluating}
                  >
                    <Mic className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} />
                  </Button>
                </div>
                <span className="text-xs text-muted-foreground">
                  {isRecording ? 'Capturing audio input...' : 'Click to explain using speech-to-text'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {explanation && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setExplanation('')}
                    className="h-12 w-12 rounded-xl text-zinc-500 hover:text-white"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                )}
                <Button 
                  onClick={handleAnalyze}
                  disabled={evaluating || !explanation.trim()}
                  className="bg-purple-600 hover:bg-purple-500 px-8 h-12 rounded-xl text-white font-bold transition-all shadow-[0_0_20px_rgba(147,51,234,0.2)]"
                >
                  {evaluating ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Evaluating...
                    </span>
                  ) : (
                    <>
                      Analyze Explanation
                      <Sparkles className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live AI Feedback Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Clarity (Jargon-free)", icon: Lightbulb, color: "text-amber-400", value: metrics.clarity * 20 },
            { label: "Depth (Core Truths)", icon: Brain, color: "text-blue-400", value: metrics.depth * 20 },
            { label: "Intuition (Analogies)", icon: Zap, color: "text-emerald-400", value: metrics.intuition * 20 },
          ].map((gauge, i) => (
            <Card key={i} className="bg-zinc-950/60 border border-white/5 p-4 rounded-2xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <gauge.icon className={`w-4 h-4 ${gauge.color}`} />
                    <span className="text-xs font-semibold text-foreground">{gauge.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">{gauge.value}%</span>
                </div>
                <Progress value={gauge.value} className="h-1.5 bg-zinc-900" />
              </div>
            </Card>
          ))}
        </div>

        {/* Written Critique Feedback box */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-purple-900/10 border border-purple-500/20 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold text-purple-400 font-mono">
                  SCORE: {metrics.score}/100
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-purple-400">
                    <Sparkles className="w-5 h-5" />
                    <h3 className="text-sm font-bold uppercase tracking-widest">Richard's Feedback</h3>
                  </div>
                  <p className="text-zinc-200 leading-relaxed font-serif italic text-base">
                    "{feedback}"
                  </p>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="text-center pt-8">
          <p className="text-xs text-zinc-600 max-w-md mx-auto italic">
            "If you can't explain it simply, you don't understand it well enough." — Richard Feynman
          </p>
        </footer>
      </div>
    </div>
  );
}
