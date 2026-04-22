"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useLabState } from '@/hooks/use-lab-state';
import { ProjectileLab } from '@/components/features/lab/ProjectileLab';
import { SocraticSidebar } from '@/components/features/SocraticSidebar';
import { 
  Crosshair, 
  Play, 
  RotateCcw, 
  MessageSquare, 
  ChevronRight, 
  ChevronLeft,
  Settings2,
  Sparkles,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export default function VirtualLab() {
  const { state, updateState, launch, reset, currentPos, trajectory } = useLabState();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex-1 h-screen bg-zinc-950 flex flex-col overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Lab Header */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-zinc-900/50 backdrop-blur-xl z-20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
            <Crosshair className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold leading-none mb-1">Physics Experiment</div>
            <h1 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
              Classical Projectile Motion <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[8px]">R3F Engine</Badge>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={reset} className="text-zinc-500 hover:text-white hover:bg-white/5">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button 
            onClick={launch} 
            disabled={state.isLaunching}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 shadow-[0_0_20px_rgba(59,130,246,0.3)] h-10"
          >
            <Play className="w-4 h-4 mr-2 fill-current" />
            Launch
          </Button>
          
          <div className="w-px h-6 bg-white/10 mx-2" />
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn("transition-colors", sidebarOpen ? "text-emerald-400" : "text-zinc-500")}
          >
            <MessageSquare className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content Viewport */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Lab Sidebar (Left - Controls) */}
        <aside className="w-72 border-r border-white/5 p-6 flex flex-col gap-8 bg-zinc-950/40 backdrop-blur-md z-10">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-zinc-400">
              <Settings2 className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-widest">Global Parameters</span>
            </div>
            
            <div className="space-y-6 pt-2">
              {/* Velocity Control */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[11px] text-zinc-400 font-medium">Initial Velocity</span>
                  <span className="text-xs font-mono text-blue-400 font-bold">{state.velocity} m/s</span>
                </div>
                <Slider 
                  value={[state.velocity]} 
                  onValueChange={(v) => updateState({ velocity: Array.isArray(v) ? v[0] : v })}
                  min={5} max={100} step={1}
                  className="py-2"
                />
              </div>

              {/* Angle Control */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[11px] text-zinc-400 font-medium">Launch Angle</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">{state.angle}°</span>
                </div>
                <Slider 
                  value={[state.angle]} 
                  onValueChange={(v) => updateState({ angle: Array.isArray(v) ? v[0] : v })}
                  min={0} max={90} step={1}
                  className="py-2"
                />
              </div>

              {/* Gravity Control */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[11px] text-zinc-400 font-medium">Gravity (G)</span>
                  <span className="text-xs font-mono text-zinc-200 font-bold">{state.gravity} m/s²</span>
                </div>
                <Slider 
                  value={[state.gravity]} 
                  onValueChange={(v) => updateState({ gravity: Array.isArray(v) ? v[0] : v })}
                  min={1} max={30} step={0.1}
                  className="py-2"
                />
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <div className="p-4 rounded-xl bg-blue-900/10 border border-blue-500/10 space-y-2">
              <div className="flex items-center gap-2 text-blue-400">
                <Info className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-tight">Discovery Tip</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed italic">
                A 45° angle provides maximum range on level ground. Can you prove why using the equations?
              </p>
            </div>
          </div>
        </aside>

        {/* 3D Simulation Canvas */}
        <main className="flex-1 relative bg-black">
          <ProjectileLab 
            currentPos={currentPos} 
            trajectory={trajectory} 
            angle={state.angle} 
          />

          {/* AI Observation Overlay (Subtle) */}
          <div className="absolute top-6 right-6 flex items-center gap-3 pointer-events-none">
            {state.isLaunching && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 px-3 py-1.5 rounded-full flex items-center gap-2"
              >
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">Monitor: Trajectory Detected</span>
              </motion.div>
            )}
          </div>
        </main>

        {/* Minimizable Socratic Sidebar (Right) */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="w-96 h-full z-30"
            >
              <div className="h-full relative group">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSidebarOpen(false)}
                  className="absolute -left-12 top-4 bg-zinc-950 border border-white/5 rounded-l-xl rounded-r-none h-12 w-10 hover:bg-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </Button>
                <SocraticSidebar lessonId="projectile-motion-lab" />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Re-open Tab (when closed) */}
        {!sidebarOpen && (
          <motion.div
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30"
          >
            <Button 
              onClick={() => setSidebarOpen(true)}
              className="h-20 w-8 bg-blue-600 hover:bg-blue-500 rounded-l-xl rounded-r-none flex flex-col items-center justify-center gap-2 shadow-2xl border border-blue-400/20"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
              <div className="rotate-90 origin-center whitespace-nowrap text-[8px] font-black tracking-widest translate-y-4">
                MENTOR
              </div>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
