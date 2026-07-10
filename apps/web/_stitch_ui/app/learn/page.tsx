'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import Sidebar from '@/components/sidebar'
import { BookOpen, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

const subjects = [
  {
    id: 'physics',
    name: 'Physics',
    color: 'from-blue-500 to-cyan-400',
    icon: '⚛️',
    description: 'Motion, Forces, Energy, Waves, Electricity & Magnetism',
    topics: [
      { name: 'Mechanics', lessons: 12, mastery: 75 },
      { name: 'Thermodynamics', lessons: 8, mastery: 45 },
      { name: 'Waves & Sound', lessons: 10, mastery: 0 },
      { name: 'Electricity', lessons: 15, mastery: 60 },
    ],
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    color: 'from-orange-500 to-red-400',
    icon: '🧪',
    description: 'Atoms, Bonds, Reactions, Periodic Table',
    topics: [
      { name: 'Bonding', lessons: 10, mastery: 85 },
      { name: 'Stoichiometry', lessons: 8, mastery: 40 },
      { name: 'Acids & Bases', lessons: 9, mastery: 0 },
      { name: 'Organic Chemistry', lessons: 14, mastery: 30 },
    ],
  },
  {
    id: 'biology',
    name: 'Biology',
    color: 'from-green-500 to-emerald-400',
    icon: '🧬',
    description: 'Cells, Evolution, Ecology, Genetics',
    topics: [
      { name: 'Cell Biology', lessons: 11, mastery: 90 },
      { name: 'Genetics', lessons: 12, mastery: 55 },
      { name: 'Ecology', lessons: 9, mastery: 0 },
      { name: 'Evolution', lessons: 8, mastery: 25 },
    ],
  },
  {
    id: 'math',
    name: 'Mathematics',
    color: 'from-violet-500 to-purple-400',
    icon: '∑',
    description: 'Algebra, Calculus, Geometry, Statistics',
    topics: [
      { name: 'Algebra', lessons: 15, mastery: 70 },
      { name: 'Calculus', lessons: 18, mastery: 0 },
      { name: 'Geometry', lessons: 10, mastery: 50 },
      { name: 'Statistics', lessons: 12, mastery: 35 },
    ],
  },
]

export default function LearnPage() {
  const [expandedSubject, setExpandedSubject] = useState<string | null>('physics')

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 ml-64 transition-all duration-300 py-8">
          <div className="max-w-6xl mx-auto px-4">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h1 className="text-4xl font-bold gradient-text mb-3 flex items-center gap-3">
                <BookOpen className="w-10 h-10" />
                Explore All Subjects
              </h1>
              <p className="text-lg text-slate-300">
                Master Physics, Chemistry, Biology, and Mathematics through interactive lessons
              </p>
            </motion.div>

            {/* Subject Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {subjects.map((subject) => (
                <motion.button
                  key={subject.id}
                  onClick={() => setExpandedSubject(expandedSubject === subject.id ? null : subject.id)}
                  whileHover={{ y: -5 }}
                  className="glass-card p-6 text-left group"
                >
                  <div className="text-4xl mb-3">{subject.icon}</div>
                  <h3 className="text-xl font-bold text-white group-hover:gradient-text transition-all">{subject.name}</h3>
                  <p className="text-sm text-slate-400 mb-4">{subject.description}</p>
                  <div className="text-xs text-cyan-300">
                    {subject.topics.length} Topics
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Detailed Subject View */}
            {expandedSubject && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <div className="glass-card p-8">
                  {subjects.map((subject) => {
                    if (subject.id !== expandedSubject) return null

                    return (
                      <div key={subject.id}>
                        <div className="flex items-center gap-3 mb-8">
                          <span className="text-4xl">{subject.icon}</span>
                          <div>
                            <h2 className="text-3xl font-bold gradient-text">{subject.name}</h2>
                            <p className="text-slate-400">{subject.description}</p>
                          </div>
                        </div>

                        {/* Topics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {subject.topics.map((topic) => (
                            <motion.div
                              key={topic.name}
                              whileHover={{ scale: 1.02 }}
                              className="p-6 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-400/30 transition-all group"
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h4 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                                    {topic.name}
                                  </h4>
                                  <p className="text-sm text-slate-400">{topic.lessons} lessons</p>
                                </div>
                                {topic.mastery > 0 && (
                                  <span className="px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs font-semibold text-emerald-300">
                                    {topic.mastery}%
                                  </span>
                                )}
                              </div>

                              {/* Mastery Bar */}
                              <div className="w-full h-2 bg-slate-700/40 rounded-full overflow-hidden mb-4">
                                <motion.div
                                  initial={{ width: '0%' }}
                                  animate={{ width: `${topic.mastery}%` }}
                                  transition={{ duration: 0.8 }}
                                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                                />
                              </div>

                              <Link
                                href={`/learn/${subject.id}/${topic.name.toLowerCase().replace(/\s+/g, '-')}`}
                                className="text-sm text-cyan-400 hover:text-cyan-300 font-medium group-hover:translate-x-1 transition-transform inline-block"
                              >
                                Explore Topic →
                              </Link>
                            </motion.div>
                          ))}
                        </div>

                        {/* Learning Path Recommendation */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="mt-8 p-6 rounded-lg bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border border-cyan-400/20"
                        >
                          <h5 className="font-semibold text-white mb-3">Recommended Learning Path</h5>
                          <div className="flex flex-wrap gap-2">
                            {subject.topics.map((topic, idx) => (
                              <span
                                key={topic.name}
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  idx === 0
                                    ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-200'
                                    : 'bg-slate-700/40 border border-slate-600 text-slate-300'
                                }`}
                              >
                                {idx === 0 ? '▶ ' : `${idx}. `}
                                {topic.name}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    )
                  })}
                </div>
              </motion.section>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
