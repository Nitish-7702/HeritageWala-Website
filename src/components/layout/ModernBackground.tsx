'use client'

import { motion, useMotionTemplate, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function ModernBackground() {
  // Mouse position for subtle spotlight
  let mouseX = useSpring(0, { stiffness: 150, damping: 50 });
  let mouseY = useSpring(0, { stiffness: 150, damping: 50 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  const spotlightX = useMotionTemplate`calc(${mouseX}px - 400px)`
  const spotlightY = useMotionTemplate`calc(${mouseY}px - 400px)`

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-charcoal-950">
      
      {/* 1. Charminar Background Layer (Visible & Seamless) */}
      <div className="absolute inset-0 z-0 opacity-[0.35] pointer-events-none select-none">
        <Image 
           src="https://upload.wikimedia.org/wikipedia/commons/7/71/Charminar_Hyderabad_1.jpg"
           alt="Charminar Background"
           fill
           className="object-cover grayscale contrast-125"
           priority
           sizes="100vw"
        />
      </div>

      {/* 2. Base Noise Texture */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-10 mix-blend-soft-light" 
           style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} 
      />

      {/* 3. Subtle Mouse Spotlight (Restored) */}
      <motion.div 
        className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full z-20 pointer-events-none opacity-40 mix-blend-screen"
        style={{ 
          background: 'radial-gradient(circle, rgba(230, 126, 34, 0.15) 0%, transparent 70%)',
          x: spotlightX,
          y: spotlightY
        }}
      />

      {/* 4. Animated "Breathing" Blobs (Ambient - Optimized) */}
      <motion.div 
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full opacity-20 will-change-transform translate-z-0"
        style={{ background: 'radial-gradient(circle, #FF9933 0%, transparent 70%)', filter: 'blur(40px)' }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <motion.div 
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full opacity-15 will-change-transform translate-z-0"
        style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)', filter: 'blur(50px)' }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
          delay: 2
        }}
      />

      {/* 5. Aurora Strip (Dynamic - Optimized) */}
      <motion.div 
        className="absolute top-[40%] left-[-20%] w-[140%] h-[40%] opacity-10 rotate-12 will-change-transform translate-z-0"
        style={{ 
            background: 'linear-gradient(90deg, #101436 0%, #E67E22 50%, #101436 100%)',
            filter: 'blur(30px)'
        }}
        animate={{
            opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
        }}
      />
      
      {/* 6. Heavy Vignette for Focus */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-30 mix-blend-multiply" />
    </div>
  )
}
