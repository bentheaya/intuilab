"use client";

import { useState, useCallback, useRef, useEffect } from 'react';

export interface ProjectileState {
  velocity: number;
  angle: number;
  gravity: number;
  height: number;
  isLaunching: boolean;
}

export function useLabState() {
  const [state, setState] = useState<ProjectileState>({
    velocity: 25,
    angle: 45,
    gravity: 9.81,
    height: 0,
    isLaunching: false,
  });

  const [trajectory, setTrajectory] = useState<[number, number, number][]>([]);
  const [currentPos, setCurrentPos] = useState<[number, number, number]>([0, 0, 0]);
  
  const startTimeRef = useRef<number | null>(null);

  const launch = useCallback(() => {
    setState(prev => ({ ...prev, isLaunching: true }));
    setTrajectory([]);
    setCurrentPos([0, state.height, 0]);
    startTimeRef.current = Date.now();
  }, [state.height]);

  const reset = useCallback(() => {
    setState(prev => ({ ...prev, isLaunching: false }));
    setTrajectory([]);
    setCurrentPos([0, state.height, 0]);
    startTimeRef.current = null;
  }, [state.height]);

  useEffect(() => {
    if (!state.isLaunching) return;

    const interval = setInterval(() => {
      if (!startTimeRef.current) return;
      
      const t = (Date.now() - startTimeRef.current) / 1000; // time in seconds
      const v0 = state.velocity;
      const theta = (state.angle * Math.PI) / 180;
      const g = state.gravity;

      // Projectile Motion Equations
      const x = v0 * Math.cos(theta) * t;
      const y = state.height + (v0 * Math.sin(theta) * t) - (0.5 * g * t * t);

      if (y < -0.1) {
        setState(prev => ({ ...prev, isLaunching: false }));
        clearInterval(interval);
        return;
      }

      const newPos: [number, number, number] = [x, y, 0];
      setCurrentPos(newPos);
      setTrajectory(prev => [...prev, newPos]);
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [state.isLaunching, state.velocity, state.angle, state.gravity, state.height]);

  const updateState = (updater: Partial<ProjectileState>) => {
    setState(prev => ({ ...prev, ...updater }));
  };

  return {
    state,
    updateState,
    launch,
    reset,
    currentPos,
    trajectory
  };
}
