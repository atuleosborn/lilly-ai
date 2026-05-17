import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CompanionProps {
  isThinking: boolean;
}

export const Companion: React.FC<CompanionProps> = ({ isThinking }) => {
  return (
    <div className="fixed pointer-events-none z-[1000] bottom-0 right-0 p-8">
      <AnimatePresence mode="wait">
        {isThinking ? (
          <motion.div
            key="active"
            initial={{ y: 100, opacity: 0, scale: 0.5 }}
            animate={{ 
              y: [0, -10, 0], 
              opacity: 1, 
              scale: 1,
              x: [-50, 50, -50],
            }}
            exit={{ y: 20, opacity: 0, scale: 0.8 }}
            transition={{ 
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              x: { duration: 10, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 0.3 }
            }}
            className="relative"
          >
            {/* Liquid Glow behind fox */}
            <div className="absolute inset-0 bg-lilly blur-3xl opacity-30 rounded-full animate-pulse" />
            
            <div className="relative flex flex-col items-center">
                {/* Fox Character */}
                <div className="w-20 h-20 relative">
                    {/* Tail */}
                    <motion.div 
                        animate={{ rotate: [-20, 20, -20] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-2 -right-4 w-12 h-12 bg-orange-600 rounded-full border-2 border-white/10"
                    >
                         <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full opacity-60" />
                    </motion.div>

                    {/* Ears */}
                    <div className="absolute -top-4 left-0 w-8 h-10 bg-orange-600 rounded-t-full border-2 border-white/10 -rotate-12" />
                    <div className="absolute -top-4 right-0 w-8 h-10 bg-orange-600 rounded-t-full border-2 border-white/10 rotate-12" />
                    
                    {/* Body/Head */}
                    <div className="w-full h-full bg-orange-500 rounded-[2.5rem] relative shadow-2xl overflow-hidden border-2 border-white/20 z-10">
                        {/* Face Markings */}
                        <div className="absolute bottom-0 inset-x-0 h-10 bg-white/90 rounded-t-full" />
                        
                        {/* Static Eyes when Thinking (Active) */}
                        <div className="absolute top-8 left-5 w-3 h-3 bg-slate-900 rounded-full flex items-center justify-center">
                            <div className="w-1 h-1 bg-white rounded-full mb-1 ml-1" />
                        </div>
                        <div className="absolute top-8 right-5 w-3 h-3 bg-slate-900 rounded-full flex items-center justify-center">
                            <div className="w-1 h-1 bg-white rounded-full mb-1 ml-1" />
                        </div>
                        
                        {/* Blushing */}
                        <motion.div 
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute top-11 left-3 w-4 h-2 bg-pink-400/40 rounded-full blur-[2px]" 
                        />
                        <motion.div 
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute top-11 right-3 w-4 h-2 bg-pink-400/40 rounded-full blur-[2px]" 
                        />

                        {/* Nose */}
                        <div className="absolute top-11 left-1/2 -translate-x-1/2 w-3 h-2 bg-slate-900 rounded-full" />
                    </div>
                </div>
                
                {/* Ambient Glow */}
                <div className="absolute -inset-4 bg-orange-500/20 blur-xl rounded-full z-0" />
            </div>
            
            <div className="mt-4 px-3 py-1 liquid-glass-accent rounded-full border border-white/10 shadow-lg">
                <span className="text-[10px] font-black text-white px-2 italic uppercase tracking-[0.2em]">
                    {isThinking ? "Neural Processing..." : "Lilly Online"}
                </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="asleep"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center opacity-80 hover:opacity-100 transition-opacity cursor-pointer group"
          >
             <div className="relative">
                <div className="w-12 h-12 bg-orange-500 rounded-2xl relative shadow-lg overflow-hidden border border-white/10 group-hover:scale-110 transition-transform">
                    {/* Blinking eyes every few seconds */}
                    <motion.div 
                        animate={{ scaleY: [1, 0.1, 1] }} 
                        transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
                        className="absolute top-5 left-3 w-2 h-2 bg-slate-900 rounded-full" 
                    />
                    <motion.div 
                        animate={{ scaleY: [1, 0.1, 1] }} 
                        transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
                        className="absolute top-5 right-3 w-2 h-2 bg-slate-900 rounded-full" 
                    />
                    <div className="absolute bottom-0 inset-x-0 h-4 bg-white/90 rounded-t-full" />
                </div>
                
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                   <span className="text-[8px] font-bold text-white uppercase tracking-widest">Awaiting Command</span>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
