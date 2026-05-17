import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Activity, Calendar, Music, Globe, CheckCircle2, 
  ExternalLink, Github, Twitter, Instagram, Smartphone, 
  Cpu, Music2, TrendingUp, Info, Play, SkipForward, SkipBack, Pause,
  Search, List, Plus, Trash2, Clock, MapPin, Brain, ArrowUpRight
} from 'lucide-react';
import { LillyState, NewsItem, Task } from '../types';

interface ViewProps {
  state: LillyState;
  setState: React.Dispatch<React.SetStateAction<LillyState>>;
}

export const NexusView: React.FC<ViewProps & { onSyncCalendar: (interactive: boolean) => void }> = ({ state, setState, onSyncCalendar }) => {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="space-y-2">
           <h2 className="text-3xl font-black tracking-tighter uppercase italic text-white">Neural Synapse Nexus</h2>
           <p className="text-text-dim text-sm max-w-2xl font-sans">
             Centralized intelligence dashboard aggregating real-time data from architecture nodes, social streams, and personal work matrices.
           </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
           {/* Calendar/Schedule Card */}
           <motion.div 
             whileHover={{ y: -5 }}
             className="bg-[#1A1A22] border border-border-dark rounded-2xl p-5 space-y-4 shadow-xl group"
           >
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2 text-info-neon bg-info-neon/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                    <Calendar size={12} /> Schedule
                 </div>
                 <button onClick={() => onSyncCalendar(true)} className="text-[10px] text-text-dim hover:text-white underline">Refresh</button>
              </div>
              <div className="space-y-3">
                 <h3 className="text-sm font-bold text-white">Upcoming Events</h3>
                 <div className="space-y-2">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                       <div className="space-y-1">
                          <div className="text-[11px] font-medium text-white">Neural Sync Meeting</div>
                          <div className="text-[10px] text-text-dim flex items-center gap-1">
                             <Clock size={10} /> 10:00 AM - 11:00 AM
                          </div>
                       </div>
                       <div className="w-1.5 h-1.5 rounded-full bg-lilly animate-pulse" />
                    </div>
                    {/* Placeholder if none */}
                    <p className="text-[10px] text-text-dim italic pt-2">Neural calendar sync requested by user. Proactive monitoring active.</p>
                 </div>
              </div>
           </motion.div>

           {/* Music Card */}
           <motion.div 
             whileHover={{ y: -5 }}
             className="bg-[#1A1A22] border border-border-dark rounded-2xl p-5 space-y-4 shadow-xl"
           >
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2 text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                    <Music2 size={12} /> Audio Pulse
                 </div>
                 <span className="text-[10px] text-success-neon flex items-center gap-1">
                    <Activity size={10} /> Live
                 </span>
              </div>
              <div className="flex gap-4 items-center">
                 <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-lilly flex items-center justify-center text-2xl shadow-lg border border-white/10">
                    🎵
                 </div>
                 <div className="flex-1 space-y-1">
                    <div className="text-sm font-bold text-white truncate">Neural Symphony No. 4</div>
                    <div className="text-[10px] text-text-dim truncate">Synapse Orchestra // LILLY_CORE</div>
                    <div className="flex items-center gap-3 pt-2">
                       <SkipBack size={14} className="text-text-dim hover:text-white cursor-pointer" />
                       <Pause size={18} className="text-white hover:text-lilly cursor-pointer" />
                       <SkipForward size={14} className="text-text-dim hover:text-white cursor-pointer" />
                    </div>
                 </div>
              </div>
           </motion.div>

            {/* Market/Crypto Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#1A1A22] border border-border-dark rounded-2xl p-5 space-y-4 shadow-xl"
            >
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                     <TrendingUp size={12} /> Market Sync
                  </div>
                  <span className="text-[10px] text-red-400">-2.4%</span>
               </div>
               <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                     <span className="text-text-dim">BTC / USD</span>
                     <span className="text-white font-mono">$64,231.50</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                     <span className="text-text-dim">ETH / USD</span>
                     <span className="text-white font-mono">$3,412.10</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                     <span className="text-text-dim">SOL / USD</span>
                     <span className="text-white font-mono">$142.80</span>
                  </div>
               </div>
            </motion.div>

            {/* Neural Interests Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#1A1A22] border border-border-dark rounded-2xl p-5 space-y-4 shadow-xl"
            >
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-info-neon bg-info-neon/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                     <Brain size={12} /> Neural Focus
                  </div>
               </div>
               <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white">Active Interests</h3>
                  <div className="flex flex-wrap gap-2">
                     {state.interests.map((interest, idx) => (
                       <span key={idx} className="text-[9px] px-2 py-1 bg-white/5 border border-white/10 rounded-full text-text-dim uppercase tracking-wider">
                          {interest}
                       </span>
                     ))}
                     {state.interests.length === 0 && <span className="text-[10px] text-text-dim italic">No interests logged.</span>}
                  </div>
                  <p className="text-[10px] text-text-dim italic pt-2">Lilly monitors these topics in the background.</p>
               </div>
            </motion.div>
         </div>

         {/* Intelligence Feed Expanded */}
         <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-border-dark pb-4">
               <h3 className="text-[12px] font-bold text-lilly uppercase tracking-[.4em] flex items-center gap-2">
                  <Activity size={14} /> Global Intelligence Stream
               </h3>
               <div className="flex gap-2">
                  <span className="text-[9px] text-success-neon flex items-center gap-1 font-mono">
                     <div className="w-1.5 h-1.5 rounded-full bg-success-neon animate-pulse" />
                     LIVE_FEED_SYNCING
                  </span>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {state.news.length > 0 ? state.news.map(item => (
                 <motion.div 
                   key={item.id} 
                   layout
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   whileHover={{ scale: 1.02 }}
                   className="p-6 bg-[#1A1A22] border border-border-dark rounded-3xl hover:border-lilly/40 transition-all cursor-pointer group flex flex-col h-full shadow-lg overflow-hidden relative"
                 >
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <ArrowUpRight size={16} className="text-lilly" />
                    </div>
                    <div className="flex justify-between items-start mb-4">
                       <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          item.category === 'crypto' ? 'bg-yellow-500/10 text-yellow-500' :
                          item.category === 'anime' ? 'bg-purple-500/10 text-purple-400' :
                          item.category === 'novel' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-lilly/10 text-lilly'
                       }`}>{item.category}</span>
                       <span className="text-[9px] text-text-dim font-mono">{new Date(item.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <h4 className="text-base font-bold text-white mb-3 group-hover:text-lilly transition-colors leading-tight">{item.title}</h4>
                    <p className="text-xs text-text-dim leading-relaxed mb-6 flex-1">{item.content}</p>
                    {item.url && (
                      <button 
                        onClick={() => window.open(item.url, '_blank')}
                        className="w-full py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-info-neon hover:bg-info-neon hover:text-bg-dark transition-all flex items-center justify-center gap-2"
                      >
                        EXTERNAL_LINK_ACCESS <ExternalLink size={10} />
                      </button>
                    )}
                 </motion.div>
               )) : (
                 <div className="col-span-full py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-white/5 rounded-full mx-auto flex items-center justify-center text-text-dim opacity-20">
                       <Activity size={32} />
                    </div>
                    <p className="text-text-dim italic">Neural feed is currently silent. Synchronizing background nodes...</p>
                 </div>
               )}
            </div>
         </section>
      </div>
    </div>
  );
};

export const MusicView: React.FC<ViewProps> = ({ state, setState }) => {
   const isConnected = (platform: string) => state.connections.find(c => c.platform === platform)?.connected;
   const toggleConnection = (platform: string) => {
      setState(prev => ({
         ...prev,
         connections: prev.connections.map(c => 
            c.platform === platform ? { ...c, connected: !c.connected, username: !c.connected ? 'User_Sync_Active' : undefined } : c
         )
      }));
   };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
       <header className="space-y-4">
          <div className="flex items-center justify-between">
             <h2 className="text-4xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-lilly to-purple-500 bg-clip-text text-transparent">Audio Synapse</h2>
             <button 
               onClick={() => toggleConnection('spotify')}
               className={`${isConnected('spotify') ? 'bg-success-neon text-bg-dark' : 'bg-lilly text-white'} px-4 py-2 rounded-xl text-xs font-bold shadow-lg hover:shadow-lilly/40 transition-all active:scale-95`}
             >
               {isConnected('spotify') ? 'CONNECTED_SPOTIFY' : 'CONNECT_SPOTIFY'}
             </button>
          </div>
          <p className="text-text-dim text-sm max-w-2xl font-sans">
             Immersive auditory environment synced with your neural preferences. Music is the architecture of the soul.
          </p>
       </header>

       <div className="grid grid-cols-4 gap-6">
          <div className="col-span-4 lg:col-span-1 space-y-6">
             <div className="p-6 bg-gradient-to-br from-[#1A1A22] to-[#121217] border border-lilly/20 rounded-3xl space-y-6 shadow-2xl">
                <div className="aspect-square rounded-2xl bg-lilly flex items-center justify-center text-6xl shadow-inner border border-white/20">🎸</div>
                <div className="space-y-1">
                   <h3 className="text-xl font-bold text-white">Midnight Resonance</h3>
                   <p className="text-sm text-text-dim">Lilly // Artificial Emotion</p>
                </div>
                <div className="space-y-4">
                   <div className="h-1 w-full bg-white/10 rounded-full relative overflow-hidden">
                      <motion.div 
                        className="absolute h-full bg-lilly" 
                        animate={{ width: ['20%', '80%', '45%'] }} 
                        transition={{ duration: 120, repeat: Infinity }}
                      />
                   </div>
                   <div className="flex justify-between text-[10px] text-text-dim font-mono">
                      <span>1:24</span>
                      <span>4:02</span>
                   </div>
                   <div className="flex items-center justify-center gap-8">
                       <SkipBack className="text-text-dim hover:text-white cursor-pointer" />
                       <div className="w-12 h-12 rounded-full bg-lilly flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all">
                          <Play size={24} className="ml-1" />
                       </div>
                       <SkipForward className="text-text-dim hover:text-white cursor-pointer" />
                   </div>
                </div>
             </div>
          </div>

          <div className="col-span-4 lg:col-span-3 space-y-8">
             <section className="space-y-4">
                <h3 className="text-xs font-bold text-text-dim uppercase tracking-[.3em]">Discovery Stream</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                   {[1,2,3,4,5,6,7,8].map(i => (
                     <div key={i} className="p-4 bg-[#1A1A22] border border-border-dark rounded-2xl hover:bg-lilly/5 hover:border-lilly/30 transition-all group cursor-pointer">
                        <div className="aspect-square bg-white/5 rounded-xl mb-3 flex items-center justify-center text-2xl relative overflow-hidden">
                           <span className="z-10">{['🎷', '🎻', '🎹', '🥁', '🎸', '🎺', '🎹', '🎻'][i-1]}</span>
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                           <Play className="absolute bottom-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0" size={16} />
                        </div>
                        <h4 className="text-[11px] font-bold text-white truncate">Neural Mix vol. {i}</h4>
                        <p className="text-[9px] text-text-dim truncate">AI Curated Discovery</p>
                     </div>
                   ))}
                </div>
             </section>
          </div>
       </div>
    </div>
  );
};

export const SocialView: React.FC<ViewProps> = ({ state, setState }) => {
  const isConnected = (platform: string) => state.connections.find(c => c.platform === platform)?.connected;
  const toggleConnection = (platform: string) => {
    setState(prev => ({
       ...prev,
       connections: prev.connections.map(c => 
          c.platform === platform ? { ...c, connected: !c.connected, username: !c.connected ? 'Neural_User' : undefined } : c
       )
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
       <header className="space-y-4">
          <h2 className="text-4xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-blue-500 to-info-neon bg-clip-text text-transparent">Social Synapse</h2>
          <p className="text-text-dim text-sm max-w-2xl font-sans">
             Real-time aggregation of your digital footprint across the connected social matrix.
          </p>
       </header>

       <div className="flex items-center gap-4 mb-6">
          <span className="text-[10px] font-bold text-text-dim uppercase tracking-[.2em]">Quick External Access</span>
          <div className="flex gap-2">
            {[
              { id: 'instagram', icon: Instagram, url: 'https://instagram.com', color: 'hover:text-lilly' },
              { id: 'twitter', icon: Twitter, url: 'https://twitter.com', color: 'hover:text-blue-400' },
              { id: 'github', icon: Github, url: 'https://github.com', color: 'hover:text-white' }
            ].map(p => (
              <a 
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 bg-[#1A1A22] border border-border-dark rounded-xl text-text-dim ${p.color} hover:border-white/20 transition-all flex items-center justify-center`}
                title={`Visit ${p.id}`}
              >
                <p.icon size={16} />
              </a>
            ))}
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { id: 'google', icon: Globe, label: 'Google', color: 'text-white' },
            { id: 'spotify', icon: Music2, label: 'Spotify', color: 'text-success-neon' },
            { id: 'instagram', icon: Instagram, label: 'Instagram', color: 'text-lilly' },
            { id: 'snapchat', icon: Smartphone, label: 'Snapchat', color: 'text-yellow-400' }
          ].map(p => (
            <button 
              key={p.id}
              onClick={() => toggleConnection(p.id)}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between group ${isConnected(p.id) ? 'bg-white/5 border-lilly/50 shadow-[0_0_15px_rgba(255,0,122,0.1)]' : 'bg-[#1A1A22] border-border-dark hover:border-white/20'}`}
            >
              <div className="flex items-center gap-3">
                <p.icon size={18} className={p.color} />
                <span className="text-xs font-bold uppercase tracking-wider">{p.label}</span>
              </div>
              <div className={`w-2 h-2 rounded-full ${isConnected(p.id) ? 'bg-success-neon animate-pulse' : 'bg-white/10'}`} />
            </button>
          ))}
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="col-span-1 xl:col-span-2 space-y-6">
             <div className="bg-[#1A1A22] border border-border-dark rounded-3xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-border-dark pb-4">
                   <h3 className="text-sm font-bold text-white">Unified Social Feed</h3>
                   <button className="text-[10px] text-blue-400 font-bold hover:underline">Sync Cloud</button>
                </div>
                <div className="space-y-6 lg:p-4">
                   {[1,2,3].map(i => (
                     <div key={i} className="flex gap-4 border-b border-border-dark pb-6 last:border-0 last:pb-0">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                           <Twitter size={20} />
                        </div>
                        <div className="flex-1 space-y-2">
                           <div className="flex items-center gap-2">
                              <span className="text-[12px] font-bold text-white">Quantum dev</span>
                              <span className="text-[10px] text-text-dim">@quantum_ai // 2h</span>
                           </div>
                           <p className="text-[12px] text-text-dim leading-relaxed">
                              Just synthesized a new architecture layer with Lilly. The neural recursive feedback loop is finally reaching sub-10ms latency. Pure digital bliss. #AI #LillyNexus
                           </p>
                           <div className="flex items-center gap-4 pt-2">
                              {/* Placeholder for interactions */}
                              <div className="w-1 h-1 rounded-full bg-text-dim" />
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <div className="bg-[#1A1A22] border border-border-dark rounded-3xl p-6 space-y-6">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                   <Github size={16} /> GitHub Intelligence
                </h3>
                <div className="space-y-4">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-lilly/30 transition-all cursor-pointer">
                        <div className="w-2 h-2 rounded-full bg-success-neon" />
                        <div className="flex-1">
                           <div className="text-[11px] font-bold text-white">Push to lilly-core-web</div>
                           <div className="text-[9px] text-text-dim italic">feat: autonomous synapse navigation</div>
                        </div>
                        <span className="text-[8px] text-text-dim font-mono tracking-tighter">SH-721</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export const TaskView: React.FC<ViewProps & { toggleTask: (id: string) => void, deleteTask: (id: string) => void }> = ({ state, setState, toggleTask, deleteTask }) => {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
       <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-4">
             <h2 className="text-4xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-success-neon to-info-neon bg-clip-text text-transparent">Task Matrix</h2>
             <p className="text-text-dim text-sm max-w-2xl font-sans">
                Neural workstream optimization. Prioritize your goals for maximum architecture efficiency.
             </p>
          </div>
          <button className="bg-success-neon text-bg-dark px-6 py-2 rounded-xl text-xs font-bold shadow-[0_0_20px_rgba(0,255,122,0.3)] hover:shadow-[0_0_30px_rgba(0,255,122,0.4)] transition-all active:scale-95 flex items-center gap-2">
             <Plus size={16} /> NEW_PROTOCOL
          </button>
       </header>

       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-4">
             {state.tasks.map(task => (
               <motion.div 
                 key={task.id}
                 layout
                 className={`p-4 rounded-2xl border flex items-center gap-4 group transition-all ${task.completed ? 'bg-bg-dark/50 border-border-dark opacity-60' : 'bg-[#1A1A22] border-border-dark hover:border-success-neon/30 hover:bg-success-neon/[0.02]'}`}
               >
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-success-neon border-success-neon text-bg-dark' : 'border-border-dark hover:border-success-neon'}`}
                  >
                     {task.completed && <CheckCircle2 size={14} />}
                  </button>
                  <div className="flex-1 space-y-1">
                     <h4 className={`text-sm font-bold ${task.completed ? 'text-text-dim line-through' : 'text-white'}`}>{task.title}</h4>
                     {task.description && <p className="text-xs text-text-dim">{task.description}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                     <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${task.priority === 'high' ? 'bg-red-500/10 text-red-400' : task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-success-neon/10 text-success-neon'}`}>
                        {task.priority}
                     </span>
                     <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-red-500/50 hover:text-red-500 transition-all p-2">
                        <Trash2 size={16} />
                     </button>
                  </div>
               </motion.div>
             ))}

             {state.tasks.length === 0 && (
               <div className="py-24 text-center space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-full mx-auto flex items-center justify-center text-text-dim">
                     <CheckCircle2 size={32} />
                  </div>
                  <p className="text-text-dim italic">Neural task list is clear. All protocols synchronized.</p>
               </div>
             )}
          </div>

          <div className="space-y-6">
             <div className="bg-[#1A1A22] border border-border-dark rounded-3xl p-6 space-y-6">
                <h3 className="text-xs font-bold text-text-dim uppercase tracking-[.3em]">Matrix Analytics</h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-text-dim">Completed Protocols</span>
                      <span className="text-success-neon font-mono">{state.tasks.filter(t => t.completed).length}</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-text-dim">Pending Protocols</span>
                      <span className="text-lilly font-mono">{state.tasks.filter(t => !t.completed).length}</span>
                   </div>
                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mt-4">
                      <motion.div 
                         className="h-full bg-success-neon"
                         initial={{ width: 0 }}
                         animate={{ width: `${(state.tasks.filter(t => t.completed).length / (state.tasks.length || 1)) * 100}%` }}
                      />
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};
