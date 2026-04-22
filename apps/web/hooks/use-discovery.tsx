"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Subject = 'physics' | 'chemistry' | 'biology' | 'mathematics';

interface DiscoveryContextType {
  activeSubject: Subject;
  setActiveSubject: (subject: Subject) => void;
  mastery: Record<string, number>; // conceptId -> mastery percentage
  updateMastery: (conceptId: string, delta: number) => void;
  streak: number;
  xp: number;
  addXP: (amount: number) => void;
}

const DiscoveryContext = createContext<DiscoveryContextType | undefined>(undefined);

export function DiscoveryProvider({ children }: { children: React.ReactNode }) {
  const [activeSubject, setActiveSubject] = useState<Subject>('physics');
  const [mastery, setMastery] = useState<Record<string, number>>({});
  const [streak, setStreak] = useState(0);
  const [xp, setXP] = useState(0);

  // Load initial progress from backend
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/assessment/mastery');
        if (res.ok) {
          const data = await res.json();
          const masteryMap: Record<string, number> = {};
          data.forEach((item: any) => {
            masteryMap[item.slug] = item.mastery_percent;
          });
          setMastery(masteryMap);
        }
      } catch (err) {
        console.error("Failed to sync mastery:", err);
      }
    };
    fetchProgress();
  }, []);

  const updateMastery = async (conceptId: string, isCorrect: boolean, assessmentId: number) => {
    try {
      // Optimistic Update
      setMastery(prev => ({
        ...prev,
        [conceptId]: isCorrect ? Math.min(100, (prev[conceptId] || 0) + 10) : prev[conceptId]
      }));

      const res = await fetch('http://localhost:8000/api/v1/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessment_id: assessmentId, is_correct: isCorrect })
      });
      
      if (res.ok) {
        // Refetch to get real BKT calculated value
        const masteryRes = await fetch('http://localhost:8000/api/v1/assessment/mastery');
        const data = await masteryRes.json();
        const masteryMap: Record<string, number> = {};
        data.forEach((item: any) => {
          masteryMap[item.slug] = item.mastery_percent;
        });
        setMastery(masteryMap);
      }
    } catch (err) {
      console.error("Mastery sync failed:", err);
    }
  };
  const addXP = (amount: number) => {
    setXP(prev => prev + amount);
  };

  return (
    <DiscoveryContext.Provider value={{
      activeSubject,
      setActiveSubject,
      mastery,
      updateMastery,
      streak,
      xp,
      addXP,
    }}>
      {children}
    </DiscoveryContext.Provider>
  );
}

export function useDiscovery() {
  const context = useContext(DiscoveryContext);
  if (context === undefined) {
    throw new Error('useDiscovery must be used within a DiscoveryProvider');
  }
  return context;
}
