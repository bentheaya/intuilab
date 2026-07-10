'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import Sidebar from '@/components/sidebar'
import { Beaker, Zap, Download, MessageCircle } from 'lucide-react'
import { useState } from 'react'

export default function LabPage() {
  const [temperature, setTemperature] = useState(20)
  const [pressure, setPressure] = useState(1)
  const [volume, setVolume] = useState(100)
  const [isSimulating, setIsSimulating] = useState(false)

  const labs = [
    {
      id: 'ideal-gas',
      name: 'Ideal Gas Simulation',
      subject: 'Physics',
      description: 'Explore the relationship between temperature, pressure, and volume',
      duration: '20 min',
    },
    {
      id: 'dna-replication',
      name: 'DNA Replication',
      subject: 'Biology',
      description: 'Watch how DNA unwinds and replicates with interactive controls',
      duration: '15 min',
    },
    {
      id: 'electron-orbitals',
      name: 'Electron Orbitals',
      subject: 'Chemistry',
      description: 'Visualize electron probability clouds and orbital shapes',
      duration: '25 min',
    },
  ]

  const handleSimulate = () => {
    setIsSimulating(true)
    setTimeout(() => setIsSimulating(false), 2000)
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
              className="mb-12"
            >
              <h1 className="text-4xl font-bold gradient-text mb-3 flex items-center gap-3">
                <Beaker className="w-10 h-10" />
                Virtual Laboratory
              </h1>
              <p className="text-lg text-slate-300">
                Interactive simulations to experiment and discover scientific principles
              </p>
            </motion.div>

            {/* Lab Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
            >
              {labs.map((lab) => (
                <motion.button
                  key={lab.id}
                  whileHover={{ y: -5 }}
                  className="glass-card p-6 text-left group"
                >
                  <span className="inline-block text-3xl mb-3">🧪</span>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                    {lab.name}
                  </h3>
                  <p className="text-sm text-slate-400 mb-4">{lab.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
                      {lab.subject}
                    </span>
                    <span className="text-xs text-slate-400">{lab.duration}</span>
                  </div>
                </motion.button>
              ))}
            </motion.div>

            {/* Active Lab Simulation */}
            <motion.section
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="glass-card p-8 mb-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Canvas Area */}
                <div className="lg:col-span-2">
                  <div className="bg-slate-900/50 border-2 border-cyan-400/30 rounded-xl aspect-video flex items-center justify-center relative overflow-hidden">
                    {/* Animated particles */}
                    {isSimulating && (
                      <>
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ x: 0, y: 0 }}
                            animate={{
                              x: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
                              y: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: 'linear',
                            }}
                            className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400 shadow-lg shadow-cyan-400/50"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                            }}
                          />
                        ))}
                      </>
                    )}

                    <div className="text-center z-10">
                      <Beaker className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400">
                        {isSimulating ? 'Simulation running...' : 'Adjust parameters and click Simulate'}
                      </p>
                    </div>
                  </div>

                  {/* Top Bar */}
                  <div className="mt-6 flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Observation Status</p>
                      <p className="font-semibold text-white">Ideal Gas Law Verification</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/30 transition-all">
                      <Download className="w-4 h-4" />
                      Export Data
                    </button>
                  </div>
                </div>

                {/* Control Panel */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Temperature
                    </label>
                    <input
                      type="range"
                      min="-50"
                      max="150"
                      value={temperature}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-2xl font-bold gradient-text">{temperature}°C</span>
                      <span className="text-xs text-slate-400">Range: -50 to 150</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Pressure
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="5"
                      step="0.1"
                      value={pressure}
                      onChange={(e) => setPressure(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-2xl font-bold gradient-text">{pressure.toFixed(1)} atm</span>
                      <span className="text-xs text-slate-400">Range: 0.5-5</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Volume
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="500"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-2xl font-bold gradient-text">{volume} mL</span>
                      <span className="text-xs text-slate-400">Range: 50-500</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSimulate}
                    disabled={isSimulating}
                    className="w-full py-3 px-6 rounded-lg font-semibold bg-gradient-to-r from-indigo-500 to-cyan-400 text-white hover:shadow-lg hover:shadow-indigo-500/50 disabled:opacity-50 transition-all"
                  >
                    {isSimulating ? 'Simulating...' : '▶ Start Simulation'}
                  </button>

                  {/* Results */}
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <p className="text-xs text-slate-400 mb-2">CALCULATED VALUE</p>
                    <p className="font-mono text-sm text-cyan-300">
                      PV = {(pressure * volume).toFixed(0)} moles·RT
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* AI Lab Monitor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 border-cyan-400/30 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-2">Lab Monitor</h3>
                  <p className="text-slate-300 mb-4">
                    Your simulation shows expected behavior according to the ideal gas law. Try increasing temperature while keeping volume constant—what happens to pressure?
                  </p>
                  <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">
                    Ask a question →
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
