'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import Sidebar from '@/components/sidebar'
import { BookOpen, Search, Tag, Calendar, Download, Share2 } from 'lucide-react'
import { useState } from 'react'

const portfolioEntries = [
  {
    id: 1,
    title: 'Wave-Particle Duality Experiment',
    subject: 'Physics',
    date: '2 days ago',
    type: 'Lab Result',
    excerpt: 'Discovered fascinating behavior of light at quantum scales...',
    tags: ['quantum', 'light', 'waves'],
  },
  {
    id: 2,
    title: 'DNA Structure Annotation',
    subject: 'Biology',
    date: '1 week ago',
    type: 'Annotation',
    excerpt: 'Detailed diagram of DNA double helix with function notes...',
    tags: ['genetics', 'biology', 'molecular'],
  },
  {
    id: 3,
    title: 'Photosynthesis Explanation',
    subject: 'Biology',
    date: '1 week ago',
    type: 'Feynman Challenge',
    excerpt: 'My explanation scored 94/100 on the Feynman Challenger...',
    tags: ['photosynthesis', 'energy', 'biology'],
  },
  {
    id: 4,
    title: 'Chemical Bonding Insights',
    subject: 'Chemistry',
    date: '2 weeks ago',
    type: 'Discovery',
    excerpt: 'Notes on ionic vs covalent bonds with real-world examples...',
    tags: ['bonding', 'chemistry', 'atoms'],
  },
]

export default function PortfolioPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const allTags = [...new Set(portfolioEntries.flatMap(e => e.tags))]

  const filteredEntries = portfolioEntries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = !selectedTag || entry.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 ml-64 transition-all duration-300 py-8">
          <div className="max-w-4xl mx-auto px-4">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h1 className="text-4xl font-bold gradient-text mb-3 flex items-center gap-3">
                <BookOpen className="w-10 h-10" />
                Discovery Portfolio
              </h1>
              <p className="text-lg text-slate-300">
                Your personal collection of insights, experiments, and achievements
              </p>
            </motion.div>

            {/* Search & Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 mb-8"
            >
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 mb-6">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search your discoveries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      selectedTag === tag
                        ? 'bg-gradient-to-r from-indigo-500 to-cyan-400 text-white'
                        : 'bg-slate-700/40 text-slate-300 hover:bg-slate-700/60'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Entries */}
            <div className="space-y-4">
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry, idx) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="glass-card p-6 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-xs font-semibold text-cyan-300">
                            {entry.type}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {entry.date}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                          {entry.title}
                        </h3>
                        <p className="text-slate-400 mb-4">{entry.excerpt}</p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {entry.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 rounded-full bg-slate-700/40 border border-slate-600/50 text-xs text-slate-300"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="ml-4 flex gap-2">
                        <button className="p-2 hover:bg-slate-700/40 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                          <Share2 className="w-5 h-5 text-slate-400" />
                        </button>
                        <button className="p-2 hover:bg-slate-700/40 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                          <Download className="w-5 h-5 text-slate-400" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        entry.subject === 'Physics'
                          ? 'bg-blue-500/20 border border-blue-400/30 text-blue-300'
                          : entry.subject === 'Chemistry'
                            ? 'bg-orange-500/20 border border-orange-400/30 text-orange-300'
                            : 'bg-green-500/20 border border-green-400/30 text-green-300'
                      }`}>
                        {entry.subject}
                      </span>
                      <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">
                        View Full Entry →
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-slate-400 mb-2">No discoveries found</p>
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedTag(null)
                    }}
                    className="text-sm text-cyan-400 hover:text-cyan-300"
                  >
                    Clear filters
                  </button>
                </motion.div>
              )}
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12"
            >
              {[
                { label: 'Total Entries', value: '24', icon: '📊' },
                { label: 'Lab Results', value: '8', icon: '🧪' },
                { label: 'Annotations', value: '12', icon: '📝' },
                { label: 'Achievements', value: '4', icon: '🏆' },
              ].map(({ label, value, icon }, idx) => (
                <motion.div key={idx} whileHover={{ y: -5 }} className="glass-card p-6 text-center">
                  <div className="text-3xl mb-2">{icon}</div>
                  <p className="text-sm text-slate-400 mb-1">{label}</p>
                  <p className="text-2xl font-bold gradient-text">{value}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
