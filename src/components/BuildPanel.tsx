import React from 'react';
import { AppArchitecture } from '../types';
import { motion } from 'motion/react';
import { Box, Code, Cpu, ShieldCheck, Zap } from 'lucide-react';

interface BuildPanelProps {
  architecture: AppArchitecture;
  onClose: () => void;
}

export default function BuildPanel({ architecture, onClose }: BuildPanelProps) {
  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed top-0 right-0 w-full md:w-[600px] h-full bg-[#1A1A22] border-l border-border-dark z-50 flex flex-col shadow-2xl"
    >
      <header className="p-6 border-bottom border-border-dark flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-lilly flex items-center gap-2">
            <Cpu className="text-info-neon" size={24} />
            WEB_GEN_v2.0
          </h2>
          <p className="text-[10px] font-mono text-text-dim uppercase tracking-tighter">Architecture // Web Deployment Protocol</p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/5 rounded-full transition-colors text-text-dim"
        >
          ✕
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Project Structure */}
        <section>
          <h3 className="text-xs font-mono text-info-neon uppercase mb-3 flex items-center gap-2">
            <Box size={14} />
            01_Project_Structure
          </h3>
          <div className="bg-black/40 border border-border-dark p-4 rounded font-mono text-[11px] text-text-dim whitespace-pre leading-relaxed">
            {architecture.structure}
          </div>
        </section>

        {/* Source Code */}
        {Object.keys(architecture.sourceCode).length > 0 && (
          <section>
            <h3 className="text-xs font-mono text-info-neon uppercase mb-3 flex items-center gap-2">
              <Code size={14} />
              02_Source_Code
            </h3>
            <div className="space-y-4">
              {Object.entries(architecture.sourceCode).map(([path, code]) => (
                <div key={path} className="border border-border-dark rounded-lg overflow-hidden">
                  <div className="bg-bg-sidebar px-3 py-1.5 border-b border-border-dark flex justify-between items-center">
                    <span className="text-[10px] font-mono text-text-dim">{path}</span>
                    <button className="text-[9px] text-lilly uppercase font-bold hover:underline">Copy</button>
                  </div>
                  <pre className="p-3 bg-black/60 text-[10px] font-mono text-[#A0A0B0] overflow-x-auto">
                    <code>{code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Build Steps */}
        <section>
          <h3 className="text-xs font-mono text-info-neon uppercase mb-3 flex items-center gap-2">
            <Zap size={14} />
            03_Deployment_Steps
          </h3>
          <ul className="space-y-2">
            {architecture.buildSteps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-[#F0E0F0]">
                <span className="text-lilly font-mono text-[10px] mt-1">{String(i + 1).padStart(2, '0')}.</span>
                {step}
              </li>
            ))}
          </ul>
        </section>

        {/* Dependencies */}
        <section>
          <h3 className="text-xs font-mono text-info-neon uppercase mb-3 flex items-center gap-2">
            <Code size={14} />
            04_Dependencies
          </h3>
          <div className="flex flex-wrap gap-2">
            {architecture.dependencies.map((dep, i) => (
              <span key={i} className="px-2 py-1 bg-white/5 border border-border-dark rounded text-[10px] font-mono text-text-dim">
                {dep}
              </span>
            ))}
          </div>
        </section>

        {/* Permissions check */}
        {architecture.permissions.length > 0 && (
          <section>
            <h3 className="text-xs font-mono text-info-neon uppercase mb-3 flex items-center gap-2">
              <ShieldCheck size={14} />
              05_Environment_Config
            </h3>
            <div className="space-y-1">
              {architecture.permissions.map((perm, i) => (
                <div key={i} className="text-[11px] font-mono text-orange-400/80 bg-orange-400/5 px-3 py-1 border-l-2 border-orange-400/30">
                  {perm}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Running Instructions */}
        <section className="bg-lilly/5 p-4 border border-lilly/20 rounded-lg">
          <h3 className="text-xs font-bold text-lilly uppercase mb-2">Final Instructions</h3>
          <p className="text-sm text-[#E0E0E0] leading-relaxed italic">
            {architecture.instructions}
          </p>
        </section>
      </div>

      <footer className="p-6 border-t border-border-dark bg-black/20">
        <button 
          className="w-full py-3 bg-lilly text-black font-bold uppercase tracking-widest text-xs hover:bg-lilly/90 transition-all active:scale-[0.98]"
        >
          Export Build Logic
        </button>
      </footer>
    </motion.div>
  );
}
