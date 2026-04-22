"use client";

import React from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, ArrowRight, Clock, BookOpen, Sparkles } from 'lucide-react';
import { useDiscovery } from '@/hooks/use-discovery';
import { motion } from 'motion/react';
import Link from 'next/link';


const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Classical Mechanics' }, style: { background: '#1e40af', color: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' } },
  { id: '2', position: { x: 200, y: -100 }, data: { label: 'Electromagnetism' }, style: { background: '#1e40af', color: '#fff', borderRadius: '12px', border: 'none' } },
  { id: '3', position: { x: 200, y: 100 }, data: { label: 'Thermodynamics' }, style: { background: '#1e40af', color: '#fff', borderRadius: '12px', border: 'none' } },
  { id: '4', position: { x: 400, y: 0 }, data: { label: 'Quantum Physics' }, style: { background: '#1e40af', color: '#fff', borderRadius: '12px', border: 'none', opacity: 0.5 } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#3b82f6' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#3b82f6' } },
  { id: 'e2-4', source: '2', target: '4', style: { stroke: '#3b82f6', strokeDasharray: '5,5' } },
];

export default function Dashboard() {
  const { streak, xp, activeSubject } = useDiscovery();

  return (

    <div className="flex-1 relative flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-md z-40">
        <div className="text-sm font-medium text-muted-foreground">
          Platform <span className="text-foreground">/ Discovery Dashboard</span>
        </div>
        <div className="flex items-center gap-5">
          <div className="text-[13px] text-muted-foreground">
            Subject: <span className="text-foreground font-medium">{activeSubject.charAt(0).toUpperCase() + activeSubject.slice(1)}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-secondary border border-border" />
        </div>

      </header>

      {/* Knowledge Map Area */}
      <div className="flex-1 relative knowledge-map-bg">
        <div className="absolute inset-0 map-grid opacity-50" />
        
        {/* Connections (Simulated) */}
        <div className="absolute w-[150px] h-px bg-gradient-to-r from-blue-500 to-red-500 opacity-30 left-[180px] top-[220px] rotate-[15deg] origin-left" />
        <div className="absolute w-[200px] h-px bg-gradient-to-r from-blue-500 to-red-500 opacity-30 left-[350px] top-[400px] -rotate-[30deg] origin-left" />

        {/* Nodes (Simulated) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-20 top-[180px] bg-blue-600/10 border border-blue-500/30 px-4 py-2 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
        >
          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
          <span className="text-sm font-medium">Classical Mechanics</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="absolute left-[320px] top-[250px] bg-blue-600/10 border border-blue-500/30 px-4 py-2 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
        >
          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
          <span className="text-sm font-medium">Electromagnetism</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute left-[200px] top-[450px] bg-red-600/10 border border-red-500/30 px-4 py-2 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
        >
          <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
          <span className="text-sm font-medium">Thermodynamics</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute left-[550px] top-[320px] bg-zinc-800/10 border border-zinc-700/30 px-4 py-2 rounded-full flex items-center gap-2 opacity-50"
        >
          <div className="w-2 h-2 rounded-full bg-zinc-500" />
          <span className="text-sm font-medium">Quantum Electrodynamics</span>
        </motion.div>

        {/* Floating Widgets */}
        <div className="absolute top-6 right-6 bottom-6 w-[300px] flex flex-col gap-5 pointer-events-none">
          {/* Daily Spark */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="pointer-events-auto p-4 rounded-2xl bg-zinc-900/80 border border-white/5 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Daily Spark</span>
              <span className="text-orange-500">🔥</span>
            </div>
            <div className="flex items-center gap-2 text-2xl font-extrabold text-white">
              {streak} Days
            </div>

            <div className="grid grid-cols-7 gap-1 mt-3">
              {[1, 1, 1, 1, 1, 0, 0].map((active, i) => (
                <div 
                   key={i} 
                  className={`h-1.5 rounded-sm ${active ? 'bg-emerald-500' : 'bg-zinc-800'}`} 
                />
              ))}
            </div>
          </motion.div>

          {/* Next Discovery */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="pointer-events-auto p-4 rounded-2xl bg-zinc-900/80 border border-white/5 backdrop-blur-xl shadow-2xl bg-gradient-to-br from-blue-500/10 via-transparent to-transparent"
          >
             <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">Next Discovery</span>
            <h3 className="text-lg font-bold text-white mb-1">Wave-Particle Duality</h3>
            <p className="text-xs text-zinc-400 mb-4">Path: Quantum Foundations • 12m read</p>
            <Button 
              render={<Link href="/learn/physics/mechanics/angular-momentum" />}
              nativeButton={false}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/20 py-6"
            >
              Begin Rediscovery
            </Button>


          </motion.div>

          {/* Recent Insights */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="pointer-events-auto p-4 rounded-2xl bg-zinc-900/80 border border-white/5 backdrop-blur-xl shadow-2xl"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-3">Recent Insights</span>
            <div className="space-y-3">
              {[
                { title: 'Lorentz Transformation', meta: 'Portfolio #28 • 2h ago' },
                { title: 'Entropy as Information', meta: 'Portfolio #27 • Yesterday' },
                { title: 'Maxwell\'s Equations', meta: 'Portfolio #26 • 3 days ago' },
              ].map((insight, i) => (
                <div key={i} className="pb-3 border-b border-white/5 last:border-0 last:pb-0">
                  <div className="text-[13px] font-medium text-white">{insight.title}</div>
                  <div className="text-[11px] text-zinc-500">{insight.meta}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
