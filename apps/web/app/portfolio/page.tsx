"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useDiscovery } from '@/hooks/use-discovery';
import { 
  Briefcase, Calendar, FileText, Mic, Sparkles, X, Plus, BookOpen, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface InsightData {
  id: string;
  date: string;
  time: string;
  title: string;
  insight_type: 'derivation' | 'voice-note' | 'lab-note';
  summary: string;
  subject: 'physics' | 'chemistry' | 'mathematics' | 'biology';
  tags: string[];
}

const subjectStyles: Record<string, { marker: string; border: string; text: string }> = {
  physics: { marker: "border-blue-500/50 text-blue-400", border: "hover:border-blue-500/20", text: "text-blue-400" },
  chemistry: { marker: "border-red-500/50 text-red-400", border: "hover:border-red-500/20", text: "text-red-400" },
  mathematics: { marker: "border-purple-500/50 text-purple-400", border: "hover:border-purple-500/20", text: "text-purple-400" },
  biology: { marker: "border-emerald-500/50 text-emerald-400", border: "hover:border-emerald-500/20", text: "text-emerald-400" },
};

export default function Portfolio() {
  const { xp } = useDiscovery();
  
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // New Note Form State
  const [newNote, setNewNote] = useState({
    title: '',
    insight_type: 'derivation' as 'derivation' | 'voice-note' | 'lab-note',
    subject: 'physics' as 'physics' | 'chemistry' | 'mathematics' | 'biology',
    summary: '',
    tagsString: ''
  });

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/api/v1/assessment/insights');
      if (res.ok) {
        const data = await res.json();
        setInsights(data);
      }
    } catch (err) {
      console.error("Failed to load portfolio insights:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleCreateInsight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title.trim() || !newNote.summary.trim()) return;

    const tags = newNote.tagsString
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    try {
      const res = await fetch('http://localhost:8000/api/v1/assessment/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newNote.title,
          insight_type: newNote.insight_type,
          subject: newNote.subject,
          summary: newNote.summary,
          tags: tags
        })
      });

      if (res.ok) {
        // Reset form & refetch
        setNewNote({
          title: '',
          insight_type: 'derivation',
          subject: 'physics',
          summary: '',
          tagsString: ''
        });
        setShowAddForm(false);
        fetchInsights();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save note to portfolio.");
      }
    } catch (err) {
      console.error("Failed to create portfolio entry:", err);
    }
  };

  const handleDeleteInsight = async (id: string) => {
    // If it's a mock numeric string or id starts with mock, just filter out locally for guest users
    if (id === '1' || id === '2' || id === '3') {
      setInsights(prev => prev.filter(ins => ins.id !== id));
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/v1/assessment/insights/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchInsights();
      }
    } catch (err) {
      console.error("Failed to delete portfolio entry:", err);
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-background p-6 md:p-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[150px]" />

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        
        {/* Portfolio Header */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/5 pb-10 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-zinc-900 border border-white/10">
                <Briefcase className="w-5 h-5 text-zinc-400" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Personal Discovery Lab</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white">Your Portfolio</h1>
            <p className="text-muted-foreground max-w-md">A chronological record of every intuition synthesized and concept derivation achieved.</p>
          </div>
          
          <div className="flex items-center gap-6 justify-between sm:justify-end">
            <div className="text-right space-y-2">
              <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Synthesis Level</div>
              <div className="text-4xl font-mono font-black italic text-blue-500">
                Lvl {Math.floor(xp / 1000) || 1}
              </div>
            </div>

            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl h-11 px-5 flex items-center gap-2"
            >
              {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showAddForm ? "Cancel" : "Add Note"}
            </Button>
          </div>
        </header>

        {/* Add Entry Form Box */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <Card className="bg-zinc-900/40 border border-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8">
                <form onSubmit={handleCreateInsight} className="space-y-6">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Sparkles className="w-4 h-4" />
                    <h3 className="text-xs uppercase font-bold tracking-widest font-mono">Record New Insight</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-zinc-400">Insight Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Invariance of torque vectors" 
                        value={newNote.title}
                        onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-zinc-950 border border-white/5 rounded-xl h-11 px-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-zinc-400">Insight Type</label>
                        <select 
                          value={newNote.insight_type}
                          onChange={(e) => setNewNote(prev => ({ ...prev, insight_type: e.target.value as any }))}
                          className="w-full bg-zinc-950 border border-white/5 rounded-xl h-11 px-3 text-xs text-zinc-300 focus:outline-none focus:border-blue-500/50"
                        >
                          <option value="derivation">Derivation</option>
                          <option value="voice-note">Voice Note</option>
                          <option value="lab-note">Lab Notebook</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-zinc-400">Subject</label>
                        <select 
                          value={newNote.subject}
                          onChange={(e) => setNewNote(prev => ({ ...prev, subject: e.target.value as any }))}
                          className="w-full bg-zinc-950 border border-white/5 rounded-xl h-11 px-3 text-xs text-zinc-300 focus:outline-none focus:border-blue-500/50"
                        >
                          <option value="physics">Physics</option>
                          <option value="chemistry">Chemistry</option>
                          <option value="mathematics">Mathematics</option>
                          <option value="biology">Biology</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-zinc-400">Note Content / Derivation Summary</label>
                    <Textarea 
                      placeholder="Explain the intuition you synthesized or the mathematical derivation details..."
                      value={newNote.summary}
                      onChange={(e) => setNewNote(prev => ({ ...prev, summary: e.target.value }))}
                      className="min-h-[120px] bg-zinc-950 border border-white/5 rounded-xl p-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 font-serif"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-zinc-400">Tags (comma-separated)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Mechanics, Equations, Thermodynamics" 
                      value={newNote.tagsString}
                      onChange={(e) => setNewNote(prev => ({ ...prev, tagsString: e.target.value }))}
                      className="w-full bg-zinc-950 border border-white/5 rounded-xl h-11 px-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>

                  <Button 
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 rounded-xl"
                  >
                    Save Discovery to Portfolio
                  </Button>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timeline Content */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Loading Discovery Path...</p>
          </div>
        ) : insights.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center border border-dashed border-white/5 rounded-3xl">
            <BookOpen className="w-10 h-10 text-zinc-600 mb-4 animate-pulse" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">No Insights Recorded</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              Your portfolio is empty. Click "Add Note" to write up your first concept discovery insight manually.
            </p>
          </div>
        ) : (
          <div className="relative space-y-12">
            {/* Vertical Line */}
            <div className="absolute left-[20px] top-4 bottom-4 w-px bg-gradient-to-b from-blue-500/50 via-zinc-800 to-transparent" />

            {insights.map((insight, i) => {
              const styles = subjectStyles[insight.subject.toLowerCase()] || subjectStyles.physics;
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-6 md:gap-8 relative group"
                >
                  {/* Timeline Marker */}
                  <div className="relative z-10 mt-1.5 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                    <div className={cn(
                      "w-[40px] h-[40px] rounded-full border bg-zinc-950 flex items-center justify-center transition-all",
                      styles.marker
                    )}>
                      {insight.insight_type === 'derivation' ? (
                        <FileText className="w-4 h-4" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  {/* Insight Card Column */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3 text-[9px] font-mono text-muted-foreground uppercase">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {insight.date}</span>
                        <span>•</span>
                        <span>{insight.time}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {insight.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-[8px] bg-zinc-900 border-white/5 text-zinc-400 px-2 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Card className={cn("bg-zinc-900/40 border-white/5 backdrop-blur-xl transition-all relative overflow-hidden", styles.border)}>
                      {/* Delete button positioned absolute on hover */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteInsight(insight.id)}
                        className="absolute right-4 top-4 h-8 w-8 rounded-lg bg-zinc-950/50 border border-white/5 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all z-20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>

                      <CardContent className="p-6 md:p-8 space-y-4 pr-16">
                        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">{insight.title}</h3>
                        <p className="text-sm text-zinc-300 leading-relaxed font-serif italic">
                          {insight.summary}
                        </p>
                        <div className="flex items-center gap-2 text-[9px] text-emerald-400 font-bold uppercase tracking-widest pt-2 font-mono">
                          <Sparkles className="w-3 h-3" /> Verified by Socratic Mentor
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        
        <footer className="text-center pt-8 border-t border-white/5">
          <p className="text-xs text-muted-foreground">Keep exploring. Every derivation is a step towards true mastery.</p>
        </footer>
      </div>
    </div>
  );
}
