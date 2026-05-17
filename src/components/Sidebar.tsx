import React from 'react';
import { motion } from 'motion/react';
import { 
  Plus, Brain, Layout, Volume2, Globe, Activity, Settings, 
  History, Trash2, Github, Twitter, Instagram 
} from 'lucide-react';
import { LillyState } from '../types';

interface SidebarProps {
  state: LillyState;
  setState: React.Dispatch<React.SetStateAction<LillyState>>;
  onClearChat: () => void;
  onShowSettings: () => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  state, 
  setState, 
  onClearChat, 
  onShowSettings, 
  onToggleTask, 
  onDeleteTask,
  isMobile,
  onCloseMobile
}) => {
  const NavButton = ({ view, icon: Icon, label, colorClass, activeColorClass }: { view: LillyState['currentView'], icon: any, label: string, colorClass: string, activeColorClass: string }) => (
    <button 
      onClick={() => {
        setState(prev => ({ ...prev, currentView: view }));
        if (isMobile && onCloseMobile) onCloseMobile();
      }}
      className={`w-full p-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${
        state.currentView === view 
          ? `liquid-glass-accent ${activeColorClass} px-4 shadow-lg border-white/10 scale-[1.02]` 
          : `hover:bg-white/5 ${colorClass} border-transparent`
      }`}
    >
       <Icon size={18} />
       {label}
    </button>
  );

  return (
    <div className={`h-full flex flex-col liquid-glass ${isMobile ? 'w-full' : 'w-full'}`}>
       <div className="p-4">
          <button 
            onClick={() => {
              onClearChat();
              if (isMobile && onCloseMobile) onCloseMobile();
            }}
            className="w-full py-3 px-4 rounded-2xl border border-lilly/30 bg-lilly/5 hover:bg-lilly/20 flex items-center gap-2 text-sm font-bold text-white transition-all group shadow-inner"
          >
             <Plus size={18} className="text-lilly group-hover:rotate-90 transition-transform" />
             NEW SESSION
          </button>
       </div>

       <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold text-text-dim uppercase tracking-widest opacity-50">Core Modules</div>
          <NavButton 
            view="chat" 
            icon={Brain} 
            label="Chat Interface" 
            colorClass="text-text-dim" 
            activeColorClass="bg-lilly/20 text-lilly" 
          />
          <NavButton 
            view="nexus" 
            icon={Layout} 
            label="Dashboard" 
            colorClass="text-text-dim" 
            activeColorClass="bg-info-neon/20 text-info-neon" 
          />

          <div className="pt-4 px-3 py-2 text-[10px] font-bold text-text-dim uppercase tracking-widest opacity-50">Integrations</div>
          <NavButton 
            view="music" 
            icon={Volume2} 
            label="Music Sync" 
            colorClass="text-text-dim" 
            activeColorClass="bg-purple-500/20 text-purple-400" 
          />
          <NavButton 
            view="social" 
            icon={Globe} 
            label="Social Feed" 
            colorClass="text-text-dim" 
            activeColorClass="bg-blue-500/20 text-blue-400" 
          />
          <NavButton 
            view="tasks" 
            icon={Activity} 
            label="Productivity" 
            colorClass="text-text-dim" 
            activeColorClass="bg-success-neon/20 text-success-neon" 
          />
          <button 
            onClick={onShowSettings}
            className="w-full p-3 rounded-xl hover:bg-white/5 text-text-dim hover:text-[#E0E0E0] flex items-center gap-3 text-sm transition-all border border-transparent"
          >
             <Settings size={18} />
             System Config
          </button>
          
          <div className="mt-6 px-3 py-2 text-[10px] font-bold text-text-dim uppercase tracking-widest flex items-center justify-between opacity-50">
              Active Tasks
              <span className="text-[8px] bg-white/10 px-1.5 rounded-full">{state.tasks.filter(t => !t.completed).length}</span>
          </div>
          <div className="space-y-1 px-1">
              {state.tasks.slice(0, 5).map(t => (
                <div key={t.id} className="px-3 py-1.5 flex items-center justify-between group rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                  <button 
                    onClick={() => onToggleTask(t.id)}
                    className={`text-[11px] flex items-center gap-2 truncate transition-all ${t.completed ? 'text-text-dim line-through opacity-50' : 'text-white'}`}
                  >
                     <div className={`w-3.5 h-3.5 rounded border transition-colors ${t.completed ? 'bg-success-neon border-success-neon' : 'border-white/20 hover:border-lilly'}`} />
                     <span className="truncate">{t.title}</span>
                  </button>
                  <button onClick={() => onDeleteTask(t.id)} className="opacity-0 group-hover:opacity-100 text-red-500/50 hover:text-red-500 transition-opacity">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              {state.tasks.length === 0 && (
                <div className="px-3 py-2 text-[10px] text-text-dim italic">No active tasks.</div>
              )}
          </div>

          <div className="mt-6 px-3 py-2 text-[10px] font-bold text-text-dim uppercase tracking-widest opacity-50">Memory Logs</div>
          {state.memory.slice(0, 8).map(m => (
            <button key={m.id} className="w-full p-3 rounded-xl hover:bg-white/5 text-text-dim hover:text-[#E0E0E0] flex items-center gap-3 text-[12px] truncate transition-all text-left group">
               <History size={14} className="flex-shrink-0 opacity-30 group-hover:opacity-100 transition-opacity" />
               <span className="truncate">{m.summary}</span>
            </button>
          ))}
       </div>

       <div className="p-4 border-t border-white/5 space-y-4 bg-black/20">
          <div className="flex items-center gap-3 group">
             <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-lilly to-red-900 flex items-center justify-center text-xl shadow-lg shadow-lilly/20 border border-white/10 group-hover:scale-105 transition-transform">
                {state.theme.appIcon || '💉'}
             </div>
             <div className="flex-1 overflow-hidden">
                <div className="text-[12px] font-black text-white truncate italic tracking-tight">Lilly Hybrid AI</div>
                <div className={`text-[9px] font-bold animate-pulse uppercase ${state.isOverworked ? 'text-info-neon' : 'text-lilly'}`}>
                  {state.isOverworked ? 'Status: Resting (Cool Down)' : 'Core Sync Active'}
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};
