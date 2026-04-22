"use client";

import React, { useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Connection,
  Edge,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDiscovery } from '@/hooks/use-discovery';
import { Sparkles, Map as MapIcon, Brain, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const initialNodes = [
  { 
    id: '1', 
    position: { x: 250, y: 100 }, 
    data: { label: 'Classical Mechanics', subject: 'physics', mastery: 85 }, 
    type: 'concept' 
  },
  { 
    id: '2', 
    position: { x: 50, y: 250 }, 
    data: { label: 'Kinematics', subject: 'physics', mastery: 100 }, 
    type: 'concept' 
  },
  { 
    id: '3', 
    position: { x: 450, y: 250 }, 
    data: { label: 'Dynamics', subject: 'physics', mastery: 70 }, 
    type: 'concept' 
  },
  { 
    id: '4', 
    position: { x: 250, y: 400 }, 
    data: { label: 'Energy & Work', subject: 'physics', mastery: 45 }, 
    type: 'concept' 
  },
  { 
    id: '5', 
    position: { x: 550, y: 400 }, 
    data: { label: 'Thermodynamics', subject: 'physics', mastery: 10 }, 
    type: 'concept' 
  },
  { 
    id: '6', 
    position: { x: 750, y: 300 }, 
    data: { label: 'Physical Chemistry', subject: 'chemistry', mastery: 30 }, 
    type: 'concept' 
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
  { id: 'e3-4', source: '3', target: '4', animated: true },
  { id: 'e4-5', source: '4', target: '5', style: { strokeDasharray: '5,5' } },
  { id: 'e5-6', source: '5', target: '6', style: { strokeDasharray: '5,5' } },
];

const ConceptNode = ({ data }: { data: { label: string, subject: string, mastery: number } }) => {
  const isCompleted = data.mastery === 100;
  
  return (
    <div className={cn(
      "px-4 py-3 rounded-xl border bg-background/80 backdrop-blur-md shadow-2xl min-w-[180px] transition-all",
      data.subject === 'physics' ? "border-blue-500/30" : "border-red-500/30"
    )}>
      <Handle type="target" position={Position.Top} className="!bg-zinc-700 !border-none" />
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={cn(
            "text-[8px] uppercase tracking-tighter px-1 lg:px-2",
            data.subject === 'physics' ? "text-blue-400 border-blue-500/20" : "text-red-400 border-red-500/20"
          )}>
            {data.subject}
          </Badge>
          <div className="text-[10px] font-mono text-muted-foreground">{data.mastery}%</div>
        </div>
        <div className="text-sm font-bold tracking-tight text-foreground truncate">{data.label}</div>
        <div className="w-full bg-secondary h-0.5 mt-1 rounded-full overflow-hidden">
          <div 
            className={cn("h-full transition-all", data.subject === 'physics' ? "bg-blue-500" : "bg-red-500")} 
            style={{ width: `${data.mastery}%` }} 
          />
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-zinc-700 !border-none" />
    </div>
  );
};

const nodeTypes = {
  concept: ConceptNode,
};

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KnowledgeMap() {
  const { mastery } = useDiscovery();
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);


  useEffect(() => {
    const fetchMap = async () => {
      try {
        setError(false);
        const res = await fetch('http://localhost:8000/api/v1/content/map');
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        
        // Merge with mastery levels
        const liveNodes = (data.nodes || []).map((node: any) => ({
          ...node,
          data: {
            ...node.data,
            mastery: mastery[node.slug as keyof typeof mastery] || 0
          }
        }));

        setNodes(liveNodes);
        setEdges(data.edges || []);
      } catch (err) {
        console.error("Failed to fetch knowledge web:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchMap();
  }, [mastery, setNodes, setEdges]);


  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    // Navigate to the lesson for this concept
    // Note: We need the subject and topic IDs which we'll derive or assume physics/mechanics for now
    router.push(`/learn/physics/mechanics/${node.slug}`);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-blue-600/20 rounded-full animate-ping" />
          <div className="absolute inset-0 flex items-center justify-center">
            <MapIcon className="w-6 h-6 text-blue-500 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground p-8 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
          <Info className="w-10 h-10 text-red-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Neural Link Severed</h2>
          <p className="text-muted-foreground max-w-sm">
            We are unable to synchronize with the IntuiLab Knowledge Base. Please ensure the backend server is active.
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button variant="outline" onClick={() => window.location.reload()} className="border-white/10 hover:bg-white/5">
            Retry Connection
          </Button>
          <div className="p-3 bg-zinc-900 rounded-lg border border-white/5 text-[10px] font-mono text-zinc-500 text-left">
            $ python manage.py runserver
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden relative">
      {/* HUD Header */}
      <header className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="p-3 rounded-2xl bg-zinc-900/80 border border-white/5 backdrop-blur-xl shadow-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
              <MapIcon className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">Ethereal Knowledge Web</h1>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1 font-mono"><Brain className="w-2 h-2" /> {nodes.length} Nodes</span>
                <span className="flex items-center gap-1 font-mono"><Sparkles className="w-2 h-2" /> {nodes.filter(n => (n.data as any).mastery === 100).length} Synthesized</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-auto p-4 rounded-2xl bg-zinc-900/80 border border-white/5 backdrop-blur-xl shadow-2xl max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Neural Path Suggestion</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed font-serif">
            Analyzing your intuition in <span className="text-blue-400 font-bold">Physics</span>... 
            {nodes.some(n => (n.data as any).mastery < 100) 
              ? " Continue your derivation in " + (nodes.find(n => (n.data as any).mastery < 100)?.data as any).label 
              : " All mechanics concepts synthesized. Awaiting further data."}
          </p>
        </div>
      </header>

      {/* Grid Background Effect */}
      <div className="absolute inset-0 map-grid opacity-20 pointer-events-none" />

      <div className="flex-1 w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-transparent"
        >
          <Background color="#27272a" variant={Background.variant ?? 'dots'} />
          <Controls className="bg-zinc-900 border border-white/5 fill-white !shadow-2xl" />
        </ReactFlow>
      </div>

      {/* Subtle Legend */}
      <footer className="absolute bottom-6 left-6 z-10 p-3 rounded-xl bg-zinc-900/50 border border-white/5 backdrop-blur-md flex gap-4 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" /> Physics
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500" /> Chemistry
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500" /> Mathematics
        </div>
      </footer>
    </div>
  );
}

