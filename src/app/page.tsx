'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useMotionTemplate, useTransform, useScroll } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Star, ChevronRight, UtensilsCrossed, MapPin, Clock } from 'lucide-react'
import TestimonialSlider from '@/components/features/TestimonialSlider'

// --- Components ---

function HeroSection() {
  const ref = useRef(null)
  
  // Restore lightweight blend effect: Fade out hero as user scrolls
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  
  // Fade out content/background as we scroll down (blending into next section)
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section ref={ref} className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* 
        NOTE: Background is handled by ModernBackground.tsx (Charminar + Blobs).
        We keep this section transparent so they show through.
      */}
      
      {/* Scroll-linked Opacity Wrapper for Blending */}
      <motion.div className="absolute inset-0 z-0" style={{ opacity }}>
        {/* Main Gradient: Transparent top/center, dark bottom for blend */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-charcoal-950/90 z-10" />
        
        {/* Header/Nav Background: Darkens ONLY the top 150px for menu readability */}
        <div className="absolute top-0 left-0 right-0 h-[150px] bg-gradient-to-b from-charcoal-950/90 to-transparent z-10" />
      </motion.div>

      {/* Decorative Mandala Pattern - Static to save GPU resources */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{
             backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 45%, #D4AF37 45.5%, transparent 46%, transparent 55%, #FF9933 55.5%, transparent 56%)',
             backgroundSize: '100% 100%'
           }}
      />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center gap-2 py-2 px-6 rounded-full bg-white/5 border border-gold-500/30 text-gold-400 text-sm font-medium mb-8 backdrop-blur-md tracking-widest uppercase"
          >
            <span className="w-2 h-2 rounded-full bg-saffron-500 animate-pulse" />
            Est. 1985 • Coventry
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gold-200 to-stone-400 mb-6 leading-tight drop-shadow-2xl">
            Royal Indian <br />
            <span className="text-gradient-gold italic">Cuisine</span>
          </h1>

          <p className="text-lg md:text-2xl text-stone-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            A culinary journey through the Nizam's kitchens. 
            Experience the authentic taste of heritage in every bite.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/menu" className="group relative px-8 py-4 bg-saffron-600 text-white font-bold rounded-full overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(230,126,34,0.6)]">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-2">
                Order Online <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link href="/reservations" className="group px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/10 backdrop-blur-sm transition-all hover:border-gold-500/50">
              Book a Table
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-stone-400 flex flex-col items-center gap-2 z-30"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-gold-500 to-transparent" />
      </motion.div>
    </section>
  )
}

function FeatureCard({ title, desc, icon: Icon, delay }: { title: string, desc: string, icon: any, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors group"
    >
      <div className="w-12 h-12 rounded-full bg-charcoal-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-gold-500/30">
        <Icon className="text-gold-500" size={24} />
      </div>
      <h3 className="text-xl font-serif font-bold text-white mb-3">{title}</h3>
      <p className="text-stone-400 leading-relaxed font-light">{desc}</p>
    </motion.div>
  )
}

function SpotlightCard({ item, index }: { item: any, index: number }) {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: any) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const maskImage = useMotionTemplate`radial-gradient(250px circle at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      className="group relative rounded-2xl bg-charcoal-900 border border-white/10 overflow-hidden"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-10"
        style={{
          background: 'radial-gradient(600px circle at var(--x) var(--y), rgba(255, 153, 51, 0.15), transparent 40%)',
        }}
      >
        {/* Optimized: Use a transform-based spotlight instead of repainting background if possible, 
            but for now, let's use a simpler DOM element approach to avoid full paint thrashing 
            or just keep it simple. Actually, the previous implementation was repainting the whole div. 
            Let's use a moving div. */}
      </motion.div>
      
      {/* Moving Spotlight Div - Better Performance */}
      <motion.div
        className="pointer-events-none absolute w-[500px] h-[500px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
            background: 'radial-gradient(circle, rgba(255, 153, 51, 0.15) 0%, transparent 70%)',
            x: useTransform(mouseX, x => x - 250),
            y: useTransform(mouseY, y => y - 250),
            top: 0,
            left: 0
        }}
      />

      <div className="relative h-64 overflow-hidden z-10">
        <div 
          className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${item.image})` }}
        />
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-gold-500 text-sm font-bold flex items-center gap-1">
          <Star size={12} className="fill-gold-500" /> {item.rating}
        </div>
      </div>
      <div className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-serif font-bold text-white group-hover:text-saffron-500 transition-colors">{item.title}</h3>
          <span className="text-xl text-gold-500 font-bold">{item.price}</span>
        </div>
        <p className="text-stone-400 mb-6 line-clamp-2 font-light">{item.desc}</p>
        <button className="w-full py-3 rounded-lg border border-white/10 bg-white/5 text-white font-medium hover:bg-saffron-600 hover:border-saffron-600 transition-all flex items-center justify-center gap-2">
          Add to Order <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Features Grid */}
      <section className="py-24 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Authentic Recipes" 
              desc="Passed down through generations, our recipes maintain the original taste of the Royal Nizams."
              icon={UtensilsCrossed}
              delay={0}
            />
            <FeatureCard 
              title="Premium Ambience" 
              desc="Dine in luxury with our carefully curated interiors that reflect the grandeur of Indian heritage."
              icon={MapPin}
              delay={0.2}
            />
            <FeatureCard 
              title="Fast Delivery" 
              desc="Experience fine dining at home. We ensure your food arrives hot and fresh, every time."
              icon={Clock}
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Signature Dishes */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-charcoal-900/50 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-saffron-500 font-bold tracking-widest uppercase text-sm mb-3 block">Our Masterpieces</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Signature Dishes</h2>
            <p className="text-stone-400 max-w-2xl mx-auto font-light text-lg">
              Handpicked favorites that define the Heritage Wala experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Hyderabadi Dum Biryani',
                desc: 'The crown jewel of our menu. Fragrant basmati rice slow-cooked with marinated meat.',
                price: '£14.95',
                image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop',
                rating: 4.9
              },
              {
                title: 'Haleem',
                desc: 'A rich stew of meat, lentils, and wheat, pounded to a smooth consistency.',
                price: '£12.95',
                image: '/images/haleem.jpg',
                rating: 4.8
              },
              {
                title: 'Double Ka Meetha',
                desc: 'A classic Hyderabadi bread pudding dessert soaked in saffron milk and garnished with dry fruits.',
                price: '£7.95',
                image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=800&auto=format&fit=crop',
                rating: 4.7
              }
            ].map((item, index) => (
              <SpotlightCard key={index} item={item} index={index} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/menu" className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-400 font-medium transition-colors border-b border-gold-500/30 pb-1 hover:border-gold-500">
              View Full Menu <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials (Reused but styled via wrapper) */}
      <section className="py-24 relative">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-royal-900/10 via-transparent to-transparent" />
         <div className="container mx-auto px-4 relative z-10">
            <TestimonialSlider />
         </div>
      </section>

      {/* Big CTA */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517244683847-7454b94e41b4?q=80&w=2000&auto=format&fit=crop')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950 via-charcoal-950/90 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              Ready to <span className="text-saffron-500">Feast?</span>
            </h2>
            <p className="text-xl text-stone-300 mb-10 font-light">
              Whether it's a family dinner, a romantic date, or a grand celebration, 
              we have the perfect table waiting for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/reservations"
                className="px-10 py-4 bg-gold-500 text-charcoal-950 font-bold rounded-lg hover:bg-gold-400 transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] text-center"
              >
                Book a Table
              </Link>
              <Link
                href="/contact"
                className="px-10 py-4 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all text-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
