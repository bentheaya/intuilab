'use client'

import { motion } from 'framer-motion'

export default function RediscoverLoader({ text = 'Rediscovery in progress...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Orbiting electrons animation */}
      <div className="relative w-24 h-24">
        {/* Center nucleus */}
        <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" />

        {/* Orbital shells */}
        {[0, 1, 2].map((orbit) => (
          <motion.div
            key={orbit}
            className="absolute inset-0 rounded-full border border-cyan-400/30"
            style={{
              width: `${100 - orbit * 20}%`,
              height: `${100 - orbit * 20}%`,
              left: `${orbit * 10}%`,
              top: `${orbit * 10}%`,
            }}
          />
        ))}

        {/* Electrons */}
        {[0, 1, 2].map((electron) => (
          <motion.div
            key={electron}
            initial={{ rotate: electron * 120 }}
            animate={{ rotate: electron * 120 + 360 }}
            transition={{
              duration: 4 - electron * 0.5,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0"
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400 shadow-lg shadow-cyan-400/50"
              style={{
                top: `${(100 - (100 - electron * 20)) / 2}%`,
              }}
            />
          </motion.div>
        ))}

        {/* Pulsing center */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.6, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-400/20 blur-md"
        />
      </div>

      {/* Text */}
      <p className="text-sm font-medium text-zinc-300 animate-pulse">{text}</p>
    </div>
  )
}
