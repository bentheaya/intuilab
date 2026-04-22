"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mic, Send, Sparkles, Brain, Zap, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FeynmanChallenger() {
  const [explanation, setExplanation] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mastery, setMastery] = useState(45);

  return (
    <div className="flex-1 min-h-screen bg-background flex flex-col items-center py-12 px-6 relative overflow-hidden">
      {/* Soft Purple Accents for Math/Theory */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[150px]" />

      <div className="w-full max-w-3xl space-y-12 relative z-10">
        {/* Header: AI Avatar & Mastery */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16 border-2 border-purple-500/30 ring-4 ring-purple-500/10">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-background flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            </div>
            <div className="breadcrumb-style">
              Feynman Challenger <span className="text-zinc-500 ml-2">"Explain it like I'm 12."</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="text-[10px] uppercase tracking-widest text-purple-400 font-bold">Mastery Score</span>
            <div className="relative w-20 h-20 neon-glow-math rounded-full">
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
                  className="stroke-purple-500"
                  strokeDasharray={`${mastery}, 100`}
                  strokeWidth="3"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-foreground">{mastery}%</span>
              </div>
            </div>
          </div>
        </header>

        {/* Interaction Area */}
        <Card className="widget-geometric overflow-hidden border border-purple-500/20 bg-zinc-950/40 backdrop-blur-xl">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground block">Your Explanation</label>
              <Textarea
                placeholder="Start explaining the concept here..."
                className="min-h-[240px] bg-transparent border-none focus-visible:ring-0 text-lg leading-relaxed resize-none p-0 placeholder:text-zinc-700 font-serif"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
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
                    onClick={() => setIsRecording(!isRecording)}
                  >
                    <Mic className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} />
                  </Button>
                </div>
                <span className="text-xs text-muted-foreground">
                  {isRecording ? 'Listening to your voice...' : 'Click to record voice note'}
                </span>
              </div>

              <Button className="bg-purple-600 hover:bg-purple-500 px-8 h-12 rounded-xl text-white">
                Analyze Explanation
                <Sparkles className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Live AI Feedback Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Clarity", icon: Lightbulb, color: "text-amber-400", value: 65 },
            { label: "Depth", icon: Brain, color: "text-blue-400", value: 40 },
            { label: "Intuition", icon: Zap, color: "text-emerald-400", value: 55 },
          ].map((gauge, i) => (
            <Card key={i} className="bg-zinc-950/60 border border-white/5 p-4 rounded-2xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <gauge.icon className={`w-4 h-4 ${gauge.color}`} />
                    <span className="text-xs font-semibold text-foreground">{gauge.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">Live AI...</span>
                </div>
                <Progress value={gauge.value} className="h-1 bg-zinc-800" />
              </div>
            </Card>
          ))}
        </div>

        <footer className="text-center pt-8">
          <p className="text-xs text-zinc-600 max-w-md mx-auto italic">
            "If you can't explain it simply, you don't understand it well enough." — Richard Feynman
          </p>
        </footer>
      </div>
    </div>
  );
}
