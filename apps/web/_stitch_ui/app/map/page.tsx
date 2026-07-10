'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import Sidebar from '@/components/sidebar'
import ConceptNode from '@/components/concept-node'
import { Map as MapIcon, Filter, ZoomIn, ZoomOut } from 'lucide-react'
import { useState } from 'react'

interface ConceptData {
  id: string
  label: string
  mastered: boolean
  locked: boolean
  connections: number
}

const conceptNetwork: ConceptData[] = [
  // Physics nodes
  { id: 'forces', label: 'Forces', mastered: true, locked: false, connections: 3 },
  { id: 'motion', label: 'Motion', mastered: true, locked: false, connections: 2 },
  { id: 'energy', label: 'Energy', mastered: false, locked: false, connections: 4 },
  { id: 'waves', label: 'Waves', mastered: false, locked: true, connections: 2 },

  // Chemistry nodes
  { id: 'atoms', label: 'Atoms', mastered: true, locked: false, connections: 3 },
  { id: 'bonding', label: 'Bonding', mastered: true, locked: false, connections: 2 },
  { id: 'reactions', label: 'Reactions', mastered: false, locked: false, connections: 3 },

  // Biology nodes
  { id: 'cells', label: 'Cells', mastered: true, locked: false, connections: 3 },
  { id: 'genetics', label: 'Genetics', mastered: false, locked: false, connections: 2 },
  { id: 'evolution', label: 'Evolution', mastered: false, locked: true, connections: 2 },

  // Math nodes
  { id: 'algebra', label: 'Algebra', mastered: true, locked: false, connections: 2 },
  { id: 'calculus', label: 'Calculus', mastered: false, locked: false, connections: 3 },
  { id: 'geometry', label: 'Geometry', mastered: false, locked: true, connections: 2 },
]

export default function KnowledgeMapPage() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)

  const subjects = ['physics', 'chemistry', 'biology', 'math']
  const subjectEmojis: Record<string, string> = {
    physics: '⚛️',
    chemistry: '🧪',
    biology: '🧬',
    math: '∑',
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 ml-64 transition-all duration-300 py-8">
          <div className="max-w-7xl mx-auto px-4">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold gradient-text mb-3 flex items-center gap-3">
                <MapIcon className="w-10 h-10" />
                Knowledge Map
              </h1>
              <p className="text-lg text-slate-300">
                Explore interconnected concepts across all subjects. Click nodes to dive deeper.
              </p>
            </motion.div>

            {/* Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 mb-8 flex items-center gap-4 flex-wrap"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-cyan-400" />
                <span className="text-sm font-medium text-slate-300">Filter by Subject:</span>
              </div>

              <div className="flex gap-2 flex-wrap">
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(selectedSubject === subject ? null : subject)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      selectedSubject === subject
                        ? 'bg-gradient-to-r from-indigo-500 to-cyan-400 text-white'
                        : 'bg-slate-700/40 text-slate-300 hover:bg-slate-700/60'
                    }`}
                  >
                    {subjectEmojis[subject]} {subject.charAt(0).toUpperCase() + subject.slice(1)}
                  </button>
                ))}
                {selectedSubject && (
                  <button
                    onClick={() => setSelectedSubject(null)}
                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-700/40 text-slate-300 hover:bg-slate-700/60 transition-all"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
                  className="p-2 hover:bg-slate-700/40 rounded-lg transition-all"
                >
                  <ZoomOut className="w-5 h-5 text-slate-300" />
                </button>
                <span className="text-sm text-slate-400 w-12 text-center">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => setZoom(Math.min(2, zoom + 0.2))}
                  className="p-2 hover:bg-slate-700/40 rounded-lg transition-all"
                >
                  <ZoomIn className="w-5 h-5 text-slate-300" />
                </button>
              </div>
            </motion.div>

            {/* Knowledge Graph */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="glass-card p-12 overflow-hidden"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
            >
              <div className="flex flex-wrap items-center justify-center gap-12">
                {conceptNetwork.map((concept, idx) => (
                  <motion.div
                    key={concept.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <ConceptNode
                      label={concept.label}
                      mastered={concept.mastered}
                      locked={concept.locked}
                      connections={concept.connections}
                      onClick={() => {
                        console.log(`[v0] Clicked concept: ${concept.label}`)
                      }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Legend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-16 pt-8 border-t border-slate-700/50 grid grid-cols-3 gap-6"
              >
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-400/10 border-2 border-cyan-400 mx-auto mb-3" />
                  <p className="text-sm text-slate-300">
                    <span className="font-semibold text-cyan-300">Ready</span>
                    <br />
                    Available to learn
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-400/10 border-2 border-emerald-400 mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-10 h-10 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-300">
                    <span className="font-semibold text-emerald-300">Mastered</span>
                    <br />
                    Concept unlocked
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-slate-700/30 border-2 border-slate-600 mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-10 h-10 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-300">
                    <span className="font-semibold text-slate-400">Locked</span>
                    <br />
                    Prerequisites needed
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8"
            >
              {[
                { label: 'Concepts Mastered', value: '8', color: 'from-emerald-500' },
                { label: 'Ready to Learn', value: '5', color: 'from-cyan-400' },
                { label: 'Locked', value: '3', color: 'from-slate-400' },
                { label: 'Map Coverage', value: '87%', color: 'from-indigo-500' },
              ].map(({ label, value, color }, idx) => (
                <motion.div key={idx} whileHover={{ y: -5 }} className="glass-card p-6 text-center">
                  <p className="text-sm text-slate-400 mb-2">{label}</p>
                  <p className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                    {value}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
