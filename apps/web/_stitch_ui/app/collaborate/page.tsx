'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import Sidebar from '@/components/sidebar'
import { Users, MessageCircle, Pen, Share2, Eye } from 'lucide-react'
import { useState } from 'react'

export default function CollaboratePage() {
  const [message, setMessage] = useState('')

  const collaborators = [
    { id: 1, name: 'Alex Chen', avatar: '👨‍💻', color: 'from-blue-500' },
    { id: 2, name: 'Jordan Smith', avatar: '👩‍🔬', color: 'from-purple-500' },
    { id: 3, name: 'Sam Rivers', avatar: '👨‍🎓', color: 'from-cyan-500' },
  ]

  const messages = [
    { author: 'Alex Chen', text: 'I think the photosynthesis equation should include ATP production', time: '2m ago' },
    { author: 'Jordan Smith', text: 'Great point! Let me annotate that on the diagram', time: '1m ago' },
    { author: 'AI Moderator', text: '✓ Checked: Both explanations align with current research', time: 'now', isBot: true },
  ]

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
              className="mb-8"
            >
              <h1 className="text-4xl font-bold gradient-text mb-3 flex items-center gap-3">
                <Users className="w-10 h-10" />
                Collaboration Room
              </h1>
              <p className="text-lg text-slate-300">
                Learn together with real-time whiteboard and group chat
              </p>
            </motion.div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Whiteboard Area */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-3 glass-card p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Pen className="w-6 h-6 text-cyan-400" />
                    Shared Canvas
                  </h2>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 hover:bg-indigo-500/30 transition-all text-sm font-semibold">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>

                {/* Canvas */}
                <div className="bg-slate-900/50 border-2 border-cyan-400/30 rounded-lg aspect-video mb-6 flex items-center justify-center relative overflow-hidden group">
                  <div className="text-center text-slate-400">
                    <Pen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Collaborative whiteboard will display here</p>
                    <p className="text-sm mt-2">Real-time drawing, annotations, and equations</p>
                  </div>

                  {/* Simulated cursors */}
                  {collaborators.map((collab, idx) => (
                    <motion.div
                      key={collab.id}
                      animate={{
                        x: [0, 50, 100, 50, 0],
                        y: [0, 30, 60, 30, 0],
                      }}
                      transition={{
                        duration: 4 + idx,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="absolute pointer-events-none"
                      style={{
                        left: `${20 + idx * 30}%`,
                        top: `${30 + idx * 20}%`,
                      }}
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${collab.color} shadow-lg`} />
                      <div className="text-xs text-slate-400 mt-1 bg-slate-800/80 px-2 py-1 rounded whitespace-nowrap">
                        {collab.name}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Tools */}
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-slate-700/40 transition-all text-slate-300 hover:text-cyan-300">
                    ✏️
                  </button>
                  <button className="p-2 rounded-lg hover:bg-slate-700/40 transition-all text-slate-300 hover:text-cyan-300">
                    📐
                  </button>
                  <button className="p-2 rounded-lg hover:bg-slate-700/40 transition-all text-slate-300 hover:text-cyan-300">
                    ∑
                  </button>
                  <div className="w-6 h-6 rounded-lg border-2 border-cyan-400 cursor-pointer ml-auto" />
                </div>
              </motion.div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1 space-y-4"
              >
                {/* Collaborators */}
                <div className="glass-card p-4">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    In Room
                  </h3>
                  <div className="space-y-2">
                    {collaborators.map((collab) => (
                      <div key={collab.id} className="flex items-center gap-2">
                        <span className="text-lg">{collab.avatar}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{collab.name}</p>
                          <p className="text-xs text-emerald-300">Online</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Moderator */}
                <div className="glass-card p-4 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 border-cyan-400/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">AI</span>
                    </div>
                    <span className="text-sm font-semibold text-cyan-300">Moderator Status</span>
                  </div>
                  <p className="text-xs text-slate-400">Active & Monitoring</p>
                </div>

                {/* Room Stats */}
                <div className="glass-card p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Session Time</span>
                    <span className="text-white font-semibold">12:45</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Messages</span>
                    <span className="text-white font-semibold">24</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Annotations</span>
                    <span className="text-white font-semibold">8</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Chat Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 glass-card p-6"
            >
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-cyan-400" />
                Group Chat
              </h3>

              {/* Messages */}
              <div className="space-y-4 mb-6 max-h-48 overflow-y-auto">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.isBot ? 'items-center' : ''}`}
                  >
                    {msg.isBot ? (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-white font-bold">AI</span>
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${msg.isBot ? 'text-cyan-300' : 'text-white'}`}>
                          {msg.author}
                        </p>
                        <span className="text-xs text-slate-500">{msg.time}</span>
                      </div>
                      <p className="text-sm text-slate-300 break-words">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Add your thoughts..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 transition-colors"
                />
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all">
                  Send
                </button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
