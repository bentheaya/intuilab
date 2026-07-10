"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface TitrationLabProps {
  acidConc: number;
  baseConc: number;
  baseVolAdded: number;
  indicator: 'phenolphthalein' | 'methylOrange' | 'bromothymolBlue';
}

export function TitrationLab({ acidConc, baseConc, baseVolAdded, indicator }: TitrationLabProps) {
  const [pH, setPH] = useState(1);
  const [liquidColor, setLiquidColor] = useState('rgba(255,255,255,0.15)'); // Clear/watery
  
  const acidVol = 25; // Constant 25 mL of acid initially

  // Perform pH calculation dynamically based on strong acid (HCl) + strong base (NaOH) titration formula
  useEffect(() => {
    const totalVolL = (acidVol + baseVolAdded) / 1000;
    const initialAcidMoles = (acidVol / 1000) * acidConc;
    const addedBaseMoles = (baseVolAdded / 1000) * baseConc;
    const netMoles = initialAcidMoles - addedBaseMoles;

    let calculatedPH = 7;
    if (netMoles > 0) {
      // Acid is in excess
      const hConc = netMoles / totalVolL;
      calculatedPH = -Math.log10(hConc);
    } else if (netMoles < 0) {
      // Base is in excess
      const ohConc = Math.abs(netMoles) / totalVolL;
      const pOH = -Math.log10(ohConc);
      calculatedPH = 14 - pOH;
    } else {
      calculatedPH = 7;
    }

    // Keep pH in range 0-14
    calculatedPH = Math.max(0, Math.min(14, calculatedPH));
    setPH(calculatedPH);

    // Determine liquid color based on pH and Indicator choice
    if (indicator === 'phenolphthalein') {
      if (calculatedPH >= 8.2) {
        // Transition from clear to fuchsia/pink
        const intensity = Math.min(1, (calculatedPH - 8.2) / 2);
        setLiquidColor(`rgba(236, 72, 153, ${0.15 + intensity * 0.75})`);
      } else {
        setLiquidColor('rgba(255, 255, 255, 0.15)');
      }
    } else if (indicator === 'methylOrange') {
      if (calculatedPH < 3.1) {
        setLiquidColor('rgba(239, 68, 68, 0.8)'); // Red
      } else if (calculatedPH >= 3.1 && calculatedPH <= 4.4) {
        setLiquidColor('rgba(249, 115, 22, 0.8)'); // Orange
      } else {
        setLiquidColor('rgba(234, 179, 8, 0.7)'); // Yellow
      }
    } else if (indicator === 'bromothymolBlue') {
      if (calculatedPH < 6.0) {
        setLiquidColor('rgba(234, 179, 8, 0.8)'); // Yellow
      } else if (calculatedPH >= 6.0 && calculatedPH <= 7.6) {
        setLiquidColor('rgba(34, 197, 94, 0.8)'); // Green
      } else {
        setLiquidColor('rgba(59, 130, 246, 0.8)'); // Blue
      }
    }
  }, [acidConc, baseConc, baseVolAdded, indicator]);

  // Generate Titration curve data points for the graph overlay
  const getTitrationPoints = () => {
    const points = [];
    for (let v = 0; v <= 50; v += 1) {
      const volL = (acidVol + v) / 1000;
      const initialM = (acidVol / 1000) * acidConc;
      const baseM = (v / 1000) * baseConc;
      const diff = initialM - baseM;
      let valPH = 7;
      if (diff > 0) {
        valPH = -Math.log10(diff / volL);
      } else if (diff < 0) {
        valPH = 14 + Math.log10(Math.abs(diff) / volL);
      }
      valPH = Math.max(0, Math.min(14, valPH));
      points.push({ v, ph: valPH });
    }
    return points;
  };

  const points = getTitrationPoints();
  const equivalencePointVol = (acidVol * acidConc) / baseConc;

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-6 p-6 overflow-y-auto max-h-[calc(100vh-4rem)] bg-zinc-950">
      
      {/* 2D Vector Experiment Render Column */}
      <div className="flex-1 flex items-center justify-center bg-zinc-900/30 border border-white/5 rounded-3xl p-8 min-h-[400px] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        <div className="relative flex flex-col items-center gap-12 z-10 w-full max-w-sm">
          {/* Buret Tube */}
          <div className="relative w-12 h-64 border-l-2 border-r-2 border-white/20 bg-white/5 flex flex-col justify-between rounded-t-lg">
            {/* Base liquid level inside buret */}
            <div 
              className="absolute bottom-0 left-0 right-0 bg-blue-500/30 transition-all duration-300 border-t border-blue-400"
              style={{ height: `${((50 - baseVolAdded) / 50) * 100}%` }}
            />
            {/* Volume tick marks */}
            <div className="absolute inset-y-0 right-1 flex flex-col justify-between text-[8px] text-zinc-500 font-mono py-2">
              <span>0mL</span>
              <span>10mL</span>
              <span>20mL</span>
              <span>30mL</span>
              <span>40mL</span>
              <span>50mL</span>
            </div>
            <div className="w-full text-center text-[9px] font-mono text-zinc-400 p-2 z-10">NaOH</div>
          </div>

          {/* Drip Valve Stopcock */}
          <div className="w-6 h-6 bg-zinc-800 rounded-full border border-white/10 flex items-center justify-center -my-8 z-20">
            <div className="w-4 h-1.5 bg-blue-500 rounded-sm transform rotate-45 animate-pulse" />
          </div>

          {/* Beaker */}
          <div className="relative w-48 h-40 border-l-4 border-r-4 border-b-4 border-white/40 rounded-b-3xl bg-white/5 flex items-end overflow-hidden">
            {/* Acid / Neutralizing liquid inside beaker */}
            <div 
              className="w-full transition-all duration-300 border-t border-white/10"
              style={{ 
                height: `${((acidVol + baseVolAdded) / 75) * 80}%`,
                backgroundColor: liquidColor 
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">HCl Solution</span>
              <span className="text-xl font-bold tracking-tight text-white mt-1">pH {pH.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis and Titration Graph Column */}
      <div className="w-full md:w-[360px] flex flex-col gap-6">
        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl">
          <CardContent className="p-6 space-y-6">
            <div>
              <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest">Real-time Readings</span>
              <h3 className="text-lg font-bold tracking-tight text-white mt-1">Neutralization Profile</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-[9px] text-zinc-400 uppercase font-bold">Excess Ion</span>
                <div className="text-lg font-mono font-bold mt-1 text-white">
                  {pH < 7 ? "H⁺" : pH > 7 ? "OH⁻" : "None"}
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-[9px] text-zinc-400 uppercase font-bold">State</span>
                <div className="text-lg font-mono font-bold mt-1 text-white flex items-center gap-1.5">
                  {pH < 6.8 ? (
                    <span className="text-red-400">Acidic</span>
                  ) : pH > 7.2 ? (
                    <span className="text-blue-400">Basic</span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1">
                      Neutral <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Titration Curve Graph */}
            <div className="space-y-3">
              <span className="text-[9px] text-zinc-400 uppercase font-bold">pH vs NaOH Volume (mL)</span>
              <div className="h-44 bg-zinc-950 border border-white/5 rounded-xl p-4 flex items-end justify-between relative">
                {/* Equivalent volume line */}
                <div 
                  className="absolute bottom-0 top-0 border-l border-dashed border-emerald-500/30"
                  style={{ left: `${(equivalencePointVol / 50) * 100}%` }}
                />
                <span 
                  className="absolute bottom-2 text-[8px] font-mono text-emerald-400/80 -translate-x-1/2"
                  style={{ left: `${(equivalencePointVol / 50) * 100}%` }}
                >
                  Equiv ({equivalencePointVol.toFixed(1)}mL)
                </span>

                {/* Dot for current position */}
                <div 
                  className="absolute w-3 h-3 rounded-full bg-blue-500 border border-white shadow-[0_0_10px_rgba(59,130,246,0.6)] z-10 transition-all duration-300"
                  style={{ 
                    left: `calc(${(baseVolAdded / 50) * 100}% - 6px)`,
                    bottom: `calc(${(pH / 14) * 100}% - 6px)` 
                  }}
                />

                {/* Line coordinates drawing */}
                <svg className="absolute inset-0 w-full h-full p-4 overflow-visible pointer-events-none">
                  <path 
                    d={points.map((pt, idx) => {
                      const x = `${(pt.v / 50) * 100}%`;
                      const y = `${100 - (pt.ph / 14) * 100}%`;
                      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="2"
                  />
                  <path 
                    d={points.filter(pt => pt.v <= baseVolAdded).map((pt, idx) => {
                      const x = `${(pt.v / 50) * 100}%`;
                      const y = `${100 - (pt.ph / 14) * 100}%`;
                      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                </svg>
                
                {/* Axis coordinates */}
                <div className="absolute top-2 left-2 text-[8px] font-mono text-zinc-600">pH 14</div>
                <div className="absolute bottom-2 left-2 text-[8px] font-mono text-zinc-600">pH 0</div>
              </div>
            </div>

            <div className="text-[10px] text-zinc-500 leading-relaxed italic bg-white/5 p-3 rounded-lg border border-white/5">
              Observe the rapid, vertical jump in pH near the equivalence point ({equivalencePointVol.toFixed(1)} mL). This is a hallmark of strong acid/strong base neutralizations.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
