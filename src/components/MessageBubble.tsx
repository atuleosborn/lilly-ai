/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types';
import { Activity, Clock, Sparkles, AlertTriangle, Shield } from 'lucide-react';

const MessageBubble: React.FC<{ message: Message }> = ({ 
  message
}) => {
  const isLilly = message.role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col gap-2 w-full ${isLilly ? 'items-start max-w-[90%]' : 'items-end max-w-[85%] ml-auto'}`}
    >
      <div className={`flex items-center gap-2 mb-1 px-2 ${isLilly ? '' : 'flex-row-reverse'}`}>
         <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] ${isLilly ? 'bg-lilly text-white shadow-[0_0_10px_rgba(255,0,122,0.4)]' : 'bg-[#2D2D35] text-text-dim'}`}>
            {isLilly ? 'L' : 'U'}
         </div>
         <span className={`text-[10px] font-mono uppercase tracking-[0.2em] font-bold ${isLilly ? 'text-lilly' : 'text-text-dim'}`}>
            {isLilly ? 'Lilly_Core' : 'User_Node'}
         </span>
      </div>
      
      <div className={`relative p-5 rounded-3xl text-sm leading-relaxed border transition-all duration-500 overflow-hidden ${
        isLilly 
          ? 'bg-[#121217] border-lilly/20 text-[#F0E0F0] rounded-tl-none shadow-[inset_0_0_40px_rgba(255,0,122,0.03)]' 
          : 'bg-[#1A1A22] border-border-dark text-[#E0E0E0] rounded-tr-none'
      }`}>
        {isLilly && (
           <motion.div 
             className="absolute top-0 right-0 p-4 opacity-5"
             animate={{ rotate: 360 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           >
              <Activity size={100} className="text-lilly" />
           </motion.div>
        )}

        {message.image && (
          <div className="mb-4 overflow-hidden rounded-xl border border-white/10 shadow-2xl">
            <img 
              src={message.image} 
              alt="Synthesis Result" 
              className="max-w-full h-auto object-cover max-h-[32rem] hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {message.errorMessage && (
          <div className="mb-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex flex-col gap-2 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
             <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle size={14} className="animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Neural Warning: {message.errorMessage}</span>
             </div>
             {message.errorActionable && (
               <div className="flex items-start gap-2 text-[11px] text-[#D0D0D0] bg-white/5 p-2 rounded-xl border border-white/5">
                  <Shield size={12} className="text-info-neon mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="text-info-neon mr-1">PROTOCOL:</strong> {message.errorActionable}
                  </span>
               </div>
             )}
          </div>
        )}

        <div className="prose prose-invert prose-sm max-w-none prose-headings:text-lilly prose-headings:font-black prose-a:text-info-neon prose-code:text-info-neon prose-code:bg-info-neon/5 prose-code:px-1 prose-code:rounded">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
        
        {message.actions && message.actions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
            <div className="text-[9px] font-bold text-info-neon uppercase tracking-widest mb-1 flex items-center gap-2">
               <Activity size={10} /> Executing Neural Commands
            </div>
            {message.actions.map((action, i) => (
              <div key={i} className="flex flex-col gap-1 bg-info-neon/5 p-3 rounded-xl border border-info-neon/10 hover:border-info-neon/30 transition-all">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-mono font-bold text-info-neon">
                     {action.type.toUpperCase()}
                   </span>
                   <div className="w-1.5 h-1.5 bg-info-neon rounded-full animate-pulse shadow-[0_0_8px_var(--lilly-accent)]" />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                   {Object.entries(action.params).map(([k, v]) => (
                     <div key={k} className="flex flex-col">
                        <span className="text-[8px] text-text-dim uppercase">{k}</span>
                        <span className="text-[10px] text-[#C0C0D0] truncate">{String(v)}</span>
                     </div>
                   ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {message.improvements && message.improvements.length > 0 && (
          <div className="mt-4 pt-4 border-t border-success-neon/20 space-y-4">
            {message.improvements.map((imp, i) => (
              <div key={i} className="bg-success-neon/5 border border-success-neon/10 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={12} className="text-success-neon" />
                  <span className="text-[10px] font-bold text-success-neon uppercase tracking-widest">Self-Improvement Protocol</span>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div>
                    <span className="text-success-neon/60 uppercase font-mono mr-2 text-[9px]">Problem:</span>
                    <span className="text-[#E0E0E0]">{imp.problem}</span>
                  </div>
                  <div>
                    <span className="text-success-neon/60 uppercase font-mono mr-2 text-[9px]">Solution:</span>
                    <span className="text-success-neon font-medium">{imp.solution}</span>
                  </div>
                  {imp.implementationSteps.length > 0 && (
                    <div className="mt-2 pl-2 border-l border-success-neon/20">
                      <span className="text-[9px] text-[#A0A0B0] uppercase block mb-1">Steps:</span>
                      <ul className="space-y-1">
                        {imp.implementationSteps.map((step, idx) => (
                          <li key={idx} className="flex gap-2 text-[#C0C0C0] text-[10px]">
                            <span className="text-success-neon opacity-50">›</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <span className="text-[8px] font-mono text-text-dim opacity-50 px-2 mt-1 uppercase tracking-tighter">
        {new Date(message.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
    </motion.div>
  );
};

export default MessageBubble;
