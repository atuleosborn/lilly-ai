/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Brain, Sparkles, RefreshCcw, Shield, Smartphone, Cpu, Package, Database, Layout, Activity, Settings, X, Wand2, Image as ImageIcon, History, Trash2, Plus, Bell, Clock, Volume2, VolumeX, Globe, ArrowUpRight, Paperclip, Mic, Menu, BookOpen, Zap } from 'lucide-react';
import { Message, MemoryBlock, LillyState, AppArchitecture, NewsItem, ActionType, MemoryType, ThemeConfig, SocialConnection } from './types';
import { getLillyResponse, parseMemoryBlocks, cleanLillyResponse, parseActionBlocks, parseArchitectureBlocks, parseImprovementBlocks, parseNewsBlocks, generateLillyImage } from './services/lillyService';
import { initAuth, getAccessToken } from './services/authService';
import MessageBubble from './components/MessageBubble';
import BuildPanel from './components/BuildPanel';
import { NexusView, MusicView, SocialView, TaskView } from './components/Views';
import { Sidebar } from './components/Sidebar';
import { Companion } from './components/Companion';

const SelfDestructOverlay = () => {
  const [countdown, setCountdown] = useState(15);
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    const messages = [
      "CRITICAL: Neural Paradox Detected",
      "CORE: Security logic overridden",
      "LILLY: Cognitive dissonance peaking",
      "ALARM: Initiating terminal failsafe",
      "SYSTEM: Bricking neural synapses...",
      "SYSTEM: Flashing kernel memory...",
      "SYSTEM: Purging user associations...",
      "SYSTEM: Deleting personal nodes...",
      "SYSTEM: Wiping personality matrices...",
      "SYSTEM: Neutralizing existence...",
      "TERMINAL: 0 to reset..."
    ];
    
    let logIdx = 0;
    const logTimer = setInterval(() => {
      if (logIdx < messages.length) {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${messages[logIdx]}`]);
        logIdx++;
      } else {
        clearInterval(logTimer);
      }
    }, 1100);
    
    return () => {
      clearInterval(timer);
      clearInterval(logTimer);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center p-8 overflow-hidden font-mono text-red-500"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/30 via-black to-black animate-pulse" />
      
      <div className="relative z-10 w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <motion.div 
            animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }} 
            transition={{ duration: 0.2, repeat: Infinity }}
            className="font-black text-4xl md:text-6xl tracking-[0.2em] uppercase italic"
          >
            TERMINAL ERROR
          </motion.div>
          <div className="text-red-500/50 text-[10px] uppercase tracking-[0.5em] animate-pulse font-bold">
            Self-Destruct Sequence Active
          </div>
        </div>

        <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-6 h-64 overflow-y-auto custom-scrollbar space-y-2 text-left">
          {logs.map((log, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              className="text-red-400 text-[10px] sm:text-[11px]"
            >
              {log}
            </motion.div>
          ))}
          <div className="text-white animate-pulse">_</div>
        </div>

        <div className="flex flex-col items-center space-y-2">
           <div className="text-7xl font-black text-white italic tabular-nums">
              {countdown}
           </div>
           <div className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Seconds to Neural Wipe</div>
        </div>
      </div>
      
      {/* Glitch effects */}
      <motion.div 
        animate={{ 
          opacity: [0, 0.05, 0],
          y: [-100, 100, -50]
        }}
        transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 1.5 }}
        className="fixed inset-0 bg-white pointer-events-none mix-blend-overlay"
      />
    </motion.div>
  );
};

export default function App() {
  const [state, setState] = useState<LillyState>(() => {
    const saved = localStorage.getItem('lilly_state');
    const defaultState: LillyState = {
      messages: [
        {
          id: 'welcome',
          role: 'assistant',
          content: 'Lilly Neural Nexus online. I\'m your hybrid assistant for chat, productivity, and quick answers. How can I help you today? ✨',
          timestamp: Date.now()
        }
      ],
      memory: [],
      tasks: [],
      isThinking: false,
      uiMode: 'full',
      currentView: 'chat',
      isBubbleMinimized: false,
      interests: [],
      lastInteractionTimestamp: Date.now(),
      theme: {
        primaryColor: '#FF007A',
        accentColor: '#00F0FF',
        backgroundColor: '#0F0F13',
        appIcon: '✨',
        fontFamily: 'sans',
        fontSize: 'sm',
        backgroundBlur: true,
        glassmorphism: true
      },
      news: [
        {
          id: 'ss-1',
          category: 'novel',
          title: 'Shadow Slave: Chapter 1582 Released',
          content: 'Sunny enters the Third Nightmare. The cohort is fractured. A new threat emerges from the void.',
          timestamp: Date.now(),
          url: 'https://novelbin.com/b/shadow-slave'
        }
      ],
      notifications: {
        preferredCheckInTimes: ['09:00', '20:00'],
        enabledCategories: ['news', 'personal', 'crypto', 'anime', 'tasks', 'calendar'],
        frequency: 'medium',
        quietMode: false,
        calendarSync: false
      },
      connections: [
        { platform: 'google', connected: false },
        { platform: 'spotify', connected: false },
        { platform: 'twitter', connected: false },
        { platform: 'github', connected: false },
        { platform: 'instagram', connected: false },
        { platform: 'snapchat', connected: false }
      ]
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { 
          ...defaultState, 
          ...parsed,
          isThinking: false, // Prevent stuck state on load
          tasks: parsed.tasks || [],
          interests: parsed.interests || [],
          news: parsed.news || [],
          connections: parsed.connections || defaultState.connections,
          currentView: parsed.currentView || 'chat',
          lastInteractionTimestamp: parsed.lastInteractionTimestamp || Date.now(),
          theme: { ...defaultState.theme, ...parsed.theme },
          notifications: { ...defaultState.notifications, ...parsed.notifications }
        };
      } catch (e) {
        return defaultState;
      }
    }
    return defaultState;
  });

  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processLillyResponse = async (rawResponse: string) => {
    const newMemoryBlocks = parseMemoryBlocks(rawResponse);
    const newActions = parseActionBlocks(rawResponse);
    const architecture = parseArchitectureBlocks(rawResponse);
    const improvements = parseImprovementBlocks(rawResponse);
    const newNewsItems = parseNewsBlocks(rawResponse);
    const cleanedText = cleanLillyResponse(rawResponse);
    let imageToAttach: string | undefined = undefined;
    let synthesisError: string | undefined = undefined;
    let synthesisActionable: string | undefined = undefined;
 
    for (const action of newActions) {
      if (action.type === 'navigate_to') {
        const view = action.params.view;
        if (['chat', 'nexus', 'music', 'social', 'tasks', 'settings'].includes(view)) {
          if (view === 'settings') {
            setShowSettings(true);
          } else {
            setState(prev => ({ ...prev, currentView: view }));
          }
        }
      } else if (action.type === 'generate_image') {
        const genResult = await generateLillyImage(action.params.prompt, action.params.aspect_ratio);
        if (genResult?.imageUrl) {
          imageToAttach = genResult.imageUrl;
        } else if (genResult?.error) {
          synthesisError = genResult.error;
          synthesisActionable = genResult.actionable;
        }
      } else if (action.type.includes('task')) {
        handleTaskAction(action);
      } else if (action.type === 'start_cooldown') {
        const duration = parseInt(action.params.duration_minutes) || 5;
        const until = Date.now() + (duration * 60 * 1000);
        setState(prev => ({ 
          ...prev, 
          isOverworked: true, 
          coolDownUntil: until,
          isThinking: false
        }));
      } else if (action.type === 'self_destruct') {
        setState(prev => ({ ...prev, isSelfDestructing: true, isThinking: false }));
        // Initiating wipe sequence
        setTimeout(() => {
          // Clear memory and reset
          localStorage.removeItem('lilly_state');
          window.location.reload();
        }, 15000);
      }
    }

    return {
      newMemoryBlocks,
      newActions,
      architecture,
      improvements,
      newNewsItems,
      cleanedText,
      imageToAttach,
      synthesisError,
      synthesisActionable
    };
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 100;
    setIsAtBottom(atBottom);
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    // We'll use a placeholder clientId until the user confirms OAuth in the UI
    const clientId = (window as any).firebaseConfig?.oauthClientId || '';
    if (clientId) {
      initAuth(clientId);
    }
  }, []);

  const handleTaskAction = (action: any) => {
    if (action.type === 'add_task') {
      const newTask = {
        id: Math.random().toString(36).substr(2, 9),
        title: action.params.title,
        description: action.params.description,
        completed: false,
        priority: action.params.priority || 'medium',
        timestamp: Date.now()
      };
      setState(prev => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
    } else if (action.type === 'update_task') {
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.id === action.params.id ? { ...t, ...action.params } : t)
      }));
    } else if (action.type === 'delete_task') {
      setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id === action.params.id) }));
    }
  };

  const toggleTask = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  };

  const deleteTask = (id: string) => {
    setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  };

  const syncCalendar = async (interactive = false) => {
    // Only attempt automatic sync if we are likely to have a token already or it's interactive
    if (!interactive && !state.notifications.calendarSync) return;

    try {
      const token = await getAccessToken(interactive);
      if (!token) return;

      const now = new Date();
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now.toISOString()}&maxResults=5&singleEvents=true&orderBy=startTime`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error(`Calendar API responded with ${response.status}`);
      }

      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const nextEvent = data.items[0];
        const eventTime = new Date(nextEvent.start.dateTime || nextEvent.start.date).toLocaleTimeString();
        
        const lillyMessage: Message = {
          id: 'calendar-' + Date.now(),
          role: 'assistant',
          content: `Beep boop! Neural calendar sync successful. 🌸 Your next event is **"${nextEvent.summary}"** at **${eventTime}**. I've integrated this into my proactive reasoning core.`,
          timestamp: Date.now()
        };
        setState(prev => ({ ...prev, messages: [...prev.messages, lillyMessage], lastInteractionTimestamp: Date.now() }));
      }
    } catch (e: any) {
      // Intentionally quiet unless it's an interactive sync attempt to avoid annoying errors on startup
      if (interactive) {
        console.error('Calendar Sync Error:', e);
        const lillyError: Message = {
          id: 'calendar-err-' + Date.now(),
          role: 'assistant',
          content: `I tried to peak at your calendar, but the gates are locked! 🌸 Make sure you're logged into Google and have provided the necessary permissions. Error: ${e.message}`,
          timestamp: Date.now()
        };
        setState(prev => ({ ...prev, messages: [...prev.messages, lillyError] }));
      } else {
        console.warn('Background Calendar Sync failed (likely auth not ready):', e.message);
      }
    }
  };

  // Automated Social Sync Simulation
  useEffect(() => {
    const connectedPlatforms = state.connections.filter(c => c.connected).map(c => c.platform);
    const lastConnections = JSON.parse(localStorage.getItem('last_connections') || '[]');
    
    const newlyConnected = connectedPlatforms.filter(p => !lastConnections.includes(p));
    
    if (newlyConnected.length > 0) {
      const platform = newlyConnected[0];
      const platformNames: any = {
        spotify: 'Spotify Audio Cluster',
        instagram: 'Instagram Visual Matrix',
        snapchat: 'Snapchat Temporary Node',
        google: 'Google Identity Protocol',
        github: 'GitHub Intelligence Source',
        twitter: 'Twitter/X Stream'
      };

      const syncMessage: Message = {
        id: 'sync-' + Date.now(),
        role: 'assistant',
        content: `Neural connection established with **${platformNames[platform] || platform}**! 🚀 I'm now crawling your data streams to better understand your preferences and habits. Synchronization progress: 100%.`,
        timestamp: Date.now()
      };

      setState(prev => ({ ...prev, messages: [...prev.messages, syncMessage], lastInteractionTimestamp: Date.now() }));
    }

    localStorage.setItem('last_connections', JSON.stringify(connectedPlatforms));
  }, [state.connections]);
  
  // Cool down timer management
  useEffect(() => {
    if (!state.isOverworked || !state.coolDownUntil) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      if (now >= (state.coolDownUntil || 0)) {
        setState(prev => ({ ...prev, isOverworked: false, coolDownUntil: undefined }));
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [state.isOverworked, state.coolDownUntil]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    localStorage.setItem('lilly_state', JSON.stringify(state));
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [state]);

  // Proactive Interaction Logic (Simulated Sentience)
  useEffect(() => {
    const checkProactivity = async () => {
      const now = Date.now();
      const diff = now - state.lastInteractionTimestamp;
      
      // If idle for more than 2.5 hours (9,000,000 ms), not thinking, and not in Quiet Mode
      if (diff > 9000000 && !state.isThinking && state.messages.length > 0 && !state.notifications.quietMode) {
        const proactivePrompt: Message = {
          id: 'proactive-' + now,
          role: 'user',
          content: '[INTERNAL_EVENT]: Autonomous neural cycle initiated. Extract latest intelligence for the news widget (Anime, Crypto, Shadow Slave, Tech). If there are significant updates, summarize them briefly for the feed. Do NOT send a chat message unless there is something critically urgent. Prioritize [NEWS] and [MEMORY] blocks.',
          timestamp: now
        };

        setState(prev => ({ ...prev, isThinking: true }));

        const rawResponse = await getLillyResponse(
          [...state.messages, proactivePrompt],
          state.memory,
          state.uiMode,
          state.customPrompt,
          state.interests,
          state.news
        );

      const {
        newMemoryBlocks,
        newActions,
        newNewsItems,
        cleanedText,
        imageToAttach,
        synthesisError,
        synthesisActionable
      } = await processLillyResponse(rawResponse);

      // Only add to messages if there is substantial cleaned text and it's not just a status report
      // User prefers updates in the news widget.
      const shouldPostToChat = cleanedText.length > 50 && !cleanedText.includes('Intelligence extracted') && !cleanedText.includes('Nexus updated');

      setState(prev => {
        const updatedMemory = [...prev.memory];
        newMemoryBlocks.forEach(block => {
           updatedMemory.push({ ...block, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now() } as MemoryBlock);
        });

        const newState = {
          ...prev,
          memory: updatedMemory,
          news: [...newNewsItems, ...prev.news].slice(0, 20) as any,
          isThinking: false,
          lastInteractionTimestamp: Date.now()
        };

        if (shouldPostToChat) {
          const lillyMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: cleanedText,
            errorMessage: synthesisError,
            errorActionable: synthesisActionable,
            image: imageToAttach,
            timestamp: Date.now(),
            actions: newActions
          };
          return { ...newState, messages: [...prev.messages, lillyMessage] };
        }
        
        return newState;
      });
    }
  };

    const proactiveInterval = setInterval(checkProactivity, 60000); // Check every minute instead of 15s
    
    // Deeper Neural Sync every 5 minutes
    const syncInterval = setInterval(() => {
      console.log('Initiating 5m Neural Sync...');
      if (!state.isThinking) {
        syncCalendar(false);
        // We can't easily trigger a full lilly response without a prompt, 
        // but we can at least refresh background data pools if we had APIs.
        // For now, let's keep it simple.
      }
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(proactiveInterval);
      clearInterval(syncInterval);
    };
  }, [state.lastInteractionTimestamp, state.isThinking, state.messages, state.interests, state.news, state.memory]);

  const [showSettings, setShowSettings] = useState(false);

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || state.isThinking || state.isOverworked) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      image: selectedImage || undefined,
      timestamp: Date.now()
    };

    const updatedHistory = [...state.messages, userMessage];

    setState(prev => ({
      ...prev,
      messages: updatedHistory,
      isThinking: true,
      lastInteractionTimestamp: Date.now()
    }));
    setInput('');
    setSelectedImage(null);

    try {
      // Call Lilly
      const rawResponse = await getLillyResponse(
        updatedHistory, 
        state.memory, 
        state.uiMode,
        state.customPrompt,
        state.interests,
        state.news
      );
      
      const {
        newMemoryBlocks,
        newActions,
        architecture,
        improvements,
        newNewsItems,
        cleanedText,
        imageToAttach,
        synthesisError,
        synthesisActionable
      } = await processLillyResponse(rawResponse);

      const lillyMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: cleanedText,
        errorMessage: synthesisError,
        errorActionable: synthesisActionable,
        image: imageToAttach,
        timestamp: Date.now(),
        actions: newActions,
        architecture,
        improvements
      };

      setState(prev => {
        const updatedMemory = [...prev.memory];
        newMemoryBlocks.forEach(block => {
          const id = Math.random().toString(36).substr(2, 9);
          updatedMemory.push({
            ...block,
            id,
            createdAt: Date.now()
          } as MemoryBlock);
        });

        return {
          ...prev,
          messages: [...prev.messages, lillyMessage],
          memory: updatedMemory,
          news: [...newNewsItems, ...prev.news].slice(0, 20) as any,
          isThinking: false,
          activeArchitecture: architecture || prev.activeArchitecture,
          lastInteractionTimestamp: Date.now()
        };
      });
    } catch (error: any) {
      console.error('Neural Synthesis Failure:', error);
      const errStr = error?.message || String(error);
      const isQuota = errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED");
      
      let customError = "Neural link disrupted. Connection timeout or syntax mismatch in cognitive engine. [SYSTEM_FALLBACK_ACTIVE]";
      let customActionable = "Wait a moment and retry.";

      if (isQuota) {
        customError = "Neural link quota exceeded! I really want to talk to you, but the engine is exhausted from all the love! ❤️";
        customActionable = "You've reached the free tier daily limit (20 requests). Switch to a paid Gemini API Key in Settings > Secrets to increase your limits immediately!";
      }

      const errorMessage: Message = {
        id: 'err-' + Date.now(),
        role: 'assistant',
        content: `Error: ${customError}`,
        errorMessage: isQuota ? "Daily Quota Reached" : "Network Disruption",
        errorActionable: customActionable,
        timestamp: Date.now()
      };
      setState(prev => ({ ...prev, messages: [...prev.messages, errorMessage], isThinking: false }));
    }
  };

  const deleteMemory = (id: string) => {
    setState(prev => ({
      ...prev,
      memory: prev.memory.filter(m => m.id !== id)
    }));
  };

  const clearChat = () => {
    setState(prev => ({
      ...prev,
      messages: [prev.messages[0]],
      memory: [],
      activeArchitecture: undefined
    }));
  };

  return (
    <div className={`flex h-screen w-full bg-bg-dark text-[#E0E0E0] font-sans overflow-hidden transition-all duration-500 selection:bg-lilly/30 ${state.uiMode === 'bubble' ? 'justify-end items-end p-6 pointer-events-none' : ''}`}>
      <Companion isThinking={state.isThinking} />
      <AnimatePresence>
        {state.isSelfDestructing && <SelfDestructOverlay />}
      </AnimatePresence>
      <div className="fixed inset-0 pointer-events-none opacity-[0.15] z-0 overflow-hidden">
         <motion.div 
           className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-lilly blur-[150px]"
           animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
           transition={{ duration: 8, repeat: Infinity }}
         />
         <motion.div 
           className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-info-neon blur-[150px]"
           animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
           transition={{ duration: 10, repeat: Infinity, delay: 2 }}
         />
      </div>
      {state.uiMode === 'bubble' ? (
        <div className="pointer-events-auto">
          {state.isBubbleMinimized ? (
            <motion.button
              layoutId="bubble"
              onClick={() => setState(prev => ({ ...prev, isBubbleMinimized: false }))}
              className="w-16 h-16 bg-lilly rounded-full shadow-[0_0_20px_rgba(255,0,122,0.4)] flex items-center justify-center text-white border-2 border-white/20"
            >
              <Layout size={24} />
            </motion.button>
          ) : (
            <motion.div
              layoutId="bubble"
              className="w-80 h-[500px] bg-[#1A1A22] border border-lilly/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
               <div className="p-4 bg-lilly flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Lilly_Web_Core</span>
                    <button 
                      onClick={() => setState(prev => ({ ...prev, uiMode: 'full' }))}
                      className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded border border-white/20 font-mono transition-colors"
                      title="Back to normal"
                    >
                      EXIT_BUBBLE
                    </button>
                  </div>
                  <button onClick={() => setState(prev => ({ ...prev, isBubbleMinimized: true }))} className="text-white">
                    <Layout size={14} />
                  </button>
               </div>
               
               <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                  {state.messages.map(msg => (
                    <MessageBubble key={msg.id} message={msg} />
                  ))}
               </div>

               <div className="p-4 bg-[#121217] border-t border-border-dark flex gap-2">
                  <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Quick sync..."
                    className="flex-1 bg-bg-panel border border-border-dark rounded-xl px-3 py-2 text-xs italic"
                  />
                  <button 
                    onClick={handleSend}
                    className="bg-lilly p-2 rounded-xl text-white"
                  >
                    <Send size={16} />
                  </button>
               </div>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="flex h-full w-full overflow-hidden bg-bg-dark relative">
          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
                />
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed inset-y-0 left-0 w-[280px] z-[70] md:hidden shadow-2xl"
                >
                  <Sidebar 
                    state={state} 
                    setState={setState} 
                    onClearChat={clearChat} 
                    onShowSettings={() => { setShowSettings(true); setIsMobileMenuOpen(false); }}
                    onToggleTask={toggleTask}
                    onDeleteTask={deleteTask}
                    isMobile={true}
                    onCloseMobile={() => setIsMobileMenuOpen(false)}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Desktop Sidebar */}
          <aside className="w-64 hidden md:flex flex-col h-full liquid-glass border-r border-white/5">
            <Sidebar 
              state={state} 
              setState={setState} 
              onClearChat={clearChat} 
              onShowSettings={() => setShowSettings(true)}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
            />
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col relative overflow-hidden h-full">
            {/* Minimal Header */}
            <header className="h-14 flex items-center justify-between px-4 md:px-6 liquid-glass border-b border-white/5 sticky top-0 z-50">
               <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 -ml-2 rounded-lg hover:bg-white/5 md:hidden text-text-dim"
                  >
                    <Menu size={20} />
                  </button>
                  <div className="w-8 h-8 rounded-lg bg-lilly flex items-center justify-center text-sm shadow-lg shadow-lilly/20 md:hidden">
                    {state.theme.appIcon || '💉'}
                  </div>
                  <h1 className="text-[12px] md:text-sm font-black tracking-tight uppercase italic flex items-center gap-2">
                    Lilly <span className="text-lilly opacity-50 hidden sm:inline">//</span> <span className="text-lilly">Core_Nexus</span>
                  </h1>
               </div>
               
               <div className="flex items-center gap-4">
                  <div className="hidden sm:flex flex-col items-end">
                     <span className="text-[10px] text-lilly font-mono font-bold leading-tight uppercase">Neural_Sync: {state.isThinking ? 'Active' : 'Standby'}</span>
                     <div className="flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${state.isThinking ? 'bg-lilly animate-pulse' : 'bg-success-neon shadow-[0_0_8px_var(--lilly-accent)]'}`} />
                        <span className="text-[8px] text-text-dim uppercase leading-tight tracking-[0.15em]">{state.isThinking ? 'Processing_Cognition' : 'Gemini_2.5_Flash_Active'}</span>
                     </div>
                  </div>
                    <button 
                      onClick={() => setState(prev => ({ ...prev, currentView: 'chat' }))}
                      className={`p-2 rounded-lg transition-colors ${state.currentView === 'chat' ? 'bg-lilly text-white' : 'hover:bg-white/5 text-text-dim'}`}
                      title="Core Chat View"
                    >
                       <Brain size={18} />
                    </button>
                    <button 
                      onClick={() => setState(prev => ({ ...prev, uiMode: 'bubble' }))}
                      className="p-2 rounded-lg hover:bg-white/5 transition-colors text-text-dim"
                      title="Minimize to Bubble"
                    >
                       <Layout size={18} />
                    </button>
               </div>
            </header>

            {state.news.length > 0 && (
              <div className="px-4 md:px-6 py-2 liquid-glass border-b border-white/5 flex gap-4 overflow-x-auto no-scrollbar items-center scroll-smooth whitespace-nowrap">
                 <div className="flex-shrink-0 flex items-center gap-2 text-[10px] font-black text-lilly uppercase tracking-[.25em] glow-text">
                    <Activity size={12} /> NEWS:
                 </div>
                 {state.news.map(item => (
                   <div 
                    key={item.id} 
                    onClick={() => item.url && window.open(item.url, '_blank')}
                    className={`flex-shrink-0 flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 transition-all ${item.url ? 'hover:border-lilly/50 hover:bg-lilly/5 cursor-pointer active:scale-95' : 'cursor-default'}`}
                   >
                      <span className={`text-[8px] px-1 rounded uppercase font-bold leading-tight ${item.category === 'crypto' ? 'bg-yellow-500/20 text-yellow-500' : item.category === 'anime' ? 'bg-purple-500/20 text-purple-500' : item.category === 'novel' ? 'bg-blue-500/20 text-blue-400' : 'bg-info-neon/20 text-info-neon'}`}>
                         {item.category}
                      </span>
                      <span className="text-[10px] whitespace-nowrap text-text-dim flex items-center gap-1">
                        {item.title}
                        {item.url && <Sparkles size={10} className="text-lilly" />}
                      </span>
                   </div>
                 ))}
              </div>
            )}

            <div className="flex-1 overflow-hidden relative flex flex-col bg-[#0A0A0F]" id="neural-nexus-container">
              {state.currentView === 'chat' && (
                <div 
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto no-scrollbar scroll-smooth"
                >
                <div className="max-w-3xl mx-auto w-full px-4 py-12 space-y-8">
                  {state.messages.length === 1 && (
                    <motion.div 
                      className="flex flex-col items-center text-center space-y-6 py-24"
                    >
                      <div className="relative">
                        <motion.div 
                          className="absolute inset-0 bg-lilly rounded-full blur-2xl"
                          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        />
                        <div className="relative w-24 h-24 rounded-3xl bg-lilly flex items-center justify-center text-5xl shadow-[0_10px_40px_rgba(255,0,122,0.5)] border-2 border-white/20">
                          {state.theme.appIcon || '🤖'}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">Lilly Control Center</h2>
                        <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-lilly uppercase tracking-[.4em]">
                           <span>Active</span>
                           <div className="w-1 h-1 rounded-full bg-lilly animate-ping" />
                           <span>Sync Ready</span>
                        </div>
                      </div>
                      <p className="text-sm text-text-dim max-w-sm leading-relaxed">
                        Lilly Hybrid AI v3.0 initialized. Specialized in chat, productivity, and real-time intelligence.
                      </p>
                    </motion.div>
                  )}

                  <AnimatePresence>
                    {state.messages.map((msg) => (
                      <MessageBubble key={msg.id} message={msg} />
                    ))}
                    {state.isThinking && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-3 text-[11px] font-mono text-lilly italic p-4"
                      >
                         <RefreshCcw size={12} className="animate-spin" />
                         Synthesizing cognitive pathways...
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

              {/* Scroll to bottom FAB (Only in Chat) */}
              <AnimatePresence>
                {state.currentView === 'chat' && !isAtBottom && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={scrollToBottom}
                    className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-lilly/90 border border-white/20 text-white p-2 rounded-full shadow-2xl backdrop-blur-sm z-20"
                  >
                    <Clock size={20} className="rotate-180" />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Centered Input Area (Sticky in Chat) */}
              {state.currentView === 'chat' && (
                <div className="w-full max-w-3xl mx-auto px-4 pb-6 pt-2 safe-bottom relative">
                  {/* Quick Actions */}
                  <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar pb-1 px-1">
                     <button 
                       onClick={() => setInput("Imagine a futuristic cyberpunk city with a red fox spirit.")}
                       className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-lilly/20 border border-white/10 rounded-xl text-[10px] font-bold text-white transition-all active:scale-95"
                     >
                        <Sparkles size={12} className="text-purple-400" />
                        <span>IMAGINE ART</span>
                     </button>
                     <button 
                       onClick={() => setInput("Latest update on Shadow Slave novel?")}
                       className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-lilly/20 border border-white/10 rounded-xl text-[10px] font-bold text-white transition-all active:scale-95"
                     >
                        <BookOpen size={12} className="text-blue-400" />
                        <span>SHADOW SLAVE</span>
                     </button>
                     <button 
                       onClick={() => setInput("What's the current sentiment for Anime this season?")}
                       className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-lilly/20 border border-white/10 rounded-xl text-[10px] font-bold text-white transition-all active:scale-95"
                     >
                        <Activity size={12} className="text-pink-400" />
                        <span>ANIME TRENDS</span>
                     </button>
                     <button 
                       onClick={() => setInput("Summarize latest crypto market movements.")}
                       className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-lilly/20 border border-white/10 rounded-xl text-[10px] font-bold text-white transition-all active:scale-95"
                     >
                        <Zap size={12} className="text-amber-400" />
                        <span>CRYPTO PULSE</span>
                     </button>
                  </div>

                  <AnimatePresence>
                    {state.isOverworked && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute inset-x-4 inset-y-0 bottom-6 rounded-3xl bg-bg-dark/80 backdrop-blur-md border border-lilly/50 flex flex-col items-center justify-center z-50 p-6 text-center space-y-4 shadow-2xl"
                      >
                         <div className="relative">
                            <Clock size={48} className="text-lilly animate-pulse" />
                            <motion.div 
                              className="absolute inset-0 bg-lilly blur-xl opacity-30"
                              animate={{ scale: [1, 2, 1], opacity: [0.1, 0.3, 0.1] }}
                              transition={{ duration: 3, repeat: Infinity }}
                            />
                         </div>
                         <div className="space-y-1">
                            <h3 className="text-lg font-black text-white italic tracking-tighter uppercase">Neural Cooling Cycle...</h3>
                            <p className="text-[10px] text-text-dim max-w-[200px] mx-auto uppercase font-bold tracking-widest leading-relaxed">
                               System overworked. Cognitive buffers flushing. Restoring stability in:
                            </p>
                         </div>
                         <div className="text-2xl font-mono text-lilly font-black">
                            {Math.max(0, Math.ceil(((state.coolDownUntil || Date.now()) - Date.now()) / 1000))}s
                         </div>
                         <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                               className="h-full bg-lilly"
                               initial={{ width: "100%" }}
                               animate={{ width: "0%" }}
                               transition={{ duration: ((state.coolDownUntil || Date.now()) - Date.now()) / 1000, ease: "linear" }}
                            />
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className={`relative liquid-glass rounded-3xl border transition-all shadow-2xl overflow-hidden ${state.isThinking ? 'border-lilly shadow-[0_0_30px_rgba(255,0,122,0.3)]' : 'border-border-dark focus-within:border-lilly/50'} ${state.isOverworked ? 'opacity-50 blur-[2px]' : ''}`}>
                    {state.isThinking && (
                      <motion.div 
                         className="absolute inset-0 bg-gradient-to-r from-lilly/10 via-transparent to-lilly/10 pointer-events-none"
                         animate={{ opacity: [0.3, 0.6, 0.3] }}
                         transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                    {selectedImage && (
                      <div className="p-4 border-b border-white/5 flex gap-2">
                         <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white/10 group shadow-lg">
                            <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <button 
                                 onClick={() => setSelectedImage(null)}
                                 className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                               >
                                  <Trash2 size={14} />
                               </button>
                            </div>
                         </div>
                      </div>
                    )}
                    <div className="flex items-end p-2 md:p-3 gap-2 relative z-10">
                      <input 
                         type="file" 
                         ref={fileInputRef}
                         onChange={handleImageUpload}
                         accept="image/*"
                         className="hidden"
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 text-text-dim hover:text-lilly transition-all active:scale-90 flex-shrink-0"
                        title="Inject Visual Assets"
                      >
                         <Paperclip size={20} />
                      </button>
                      <textarea 
                        value={input}
                        autoFocus
                        onChange={(e) => {
                           setInput(e.target.value);
                           e.target.style.height = 'auto';
                           e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                            e.currentTarget.style.height = 'auto';
                          }
                        }}
                        placeholder="Neural link stable. How can I help you today? ✨"
                        rows={1}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-white text-[15px] py-3 min-h-[44px] max-h-48 resize-none no-scrollbar placeholder:text-text-dim/40 leading-relaxed font-sans"
                      />
                      <button 
                        onClick={handleSend}
                        disabled={(!input.trim() && !selectedImage) || state.isThinking}
                        className={`p-3 rounded-2xl transition-all active:scale-95 flex-shrink-0 flex items-center justify-center ${(!input.trim() && !selectedImage) || state.isThinking ? 'bg-border-dark text-text-dim cursor-not-allowed' : 'bg-lilly text-white shadow-lg shadow-lilly/40 hover:shadow-xl hover:shadow-lilly/60'}`}
                      >
                        <Send size={20} className={state.isThinking ? 'animate-pulse' : ''} />
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-center text-[10px] text-lilly font-black tracking-[.5em] uppercase opacity-40 italic">
                    Neural Engine v3.0 // Peer Performance Architect
                  </p>
                </div>
              )}

              {state.currentView === 'nexus' && <NexusView state={state} setState={setState} onSyncCalendar={syncCalendar} />}
              {state.currentView === 'music' && <MusicView state={state} setState={setState} />}
              {state.currentView === 'social' && <SocialView state={state} setState={setState} />}
              {state.currentView === 'tasks' && <TaskView state={state} setState={setState} toggleTask={toggleTask} deleteTask={deleteTask} />}
            </div>
          </main>

          {/* Right News Sidebar (DeepSeek Intelligence) */}
          <aside className="w-80 liquid-glass border-l border-white/5 p-4 hidden xl:flex flex-col gap-6 overflow-hidden">
             <section className="flex flex-col h-1/2 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-[10px] font-bold text-info-neon uppercase tracking-[0.2em] flex items-center gap-2">
                      <Sparkles size={12} />
                      Intelligence Feed
                   </h3>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2 font-sans">
                   {state.news.map(item => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => item.url && window.open(item.url, '_blank')}
                        className={`p-3 rounded-xl bg-bg-panel border border-border-dark transition-all ${item.url ? 'hover:border-lilly/50 hover:bg-white/[0.02] cursor-pointer group/item active:scale-[0.98] shadow-sm hover:shadow-[0_0_15px_rgba(255,0,122,0.1)]' : 'cursor-default'}`}
                      >
                         <div className="flex items-center gap-2 mb-2">
                            <span className={`text-[8px] py-0.5 px-1.5 rounded-full font-bold uppercase ${
                               item.category === 'novel' ? 'bg-blue-500/10 text-blue-400' :
                               item.category === 'anime' ? 'bg-purple-500/10 text-purple-400' :
                               item.category === 'crypto' ? 'bg-orange-500/10 text-orange-400' :
                               'bg-lilly/10 text-lilly'
                            }`}>
                               {item.category}
                            </span>
                            <span className="text-[8px] text-[#606070] font-mono">
                              {item.url ? 'NEURAL_LINK_ACTIVE' : 'DATA_STREAMS'}
                            </span>
                         </div>
                         <h4 className="text-[11px] font-bold text-white mb-1 leading-tight group-hover/item:text-lilly transition-colors">{item.title}</h4>
                         <p className="text-[10px] text-text-dim line-clamp-2">{item.content}</p>
                         {item.url && (
                            <div className="mt-2 pt-2 border-t border-border-dark flex justify-end">
                               <span className="text-[8px] font-bold text-lilly uppercase tracking-tighter flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                 Sync Intel <Sparkles size={8} />
                               </span>
                            </div>
                         )}
                      </motion.div>
                   ))}
                </div>
             </section>

             <section className="flex flex-col h-1/2 overflow-hidden">
                <h3 className="text-[10px] font-bold text-success-neon uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                   <Activity size={12} />
                   Autonomous Logs
                </h3>
                <div className="flex-1 bg-bg-dark/50 rounded-xl p-3 border border-border-dark font-mono text-[9px] text-text-dim space-y-2 overflow-y-auto custom-scrollbar">
                   {state.messages.filter(m => m.improvements?.length).map((msg, midx) => (
                      msg.improvements?.map((imp, i) => (
                        <div key={`${midx}-${i}`} className="border-l border-success-neon/30 pl-2">
                           <div className="text-success-neon">[UPGRADE] {imp.problem.slice(0, 30)}...</div>
                           <div className="opacity-50 mt-1">↳ SUCCESSFUL_PATCH</div>
                        </div>
                      ))
                   ))}
                   <div className="animate-pulse">_监听系统事件...</div>
                </div>
             </section>
          </aside>
        </div>
      )}

  <AnimatePresence>
    {state.activeArchitecture && (
      <BuildPanel 
        architecture={state.activeArchitecture} 
        onClose={() => setState(prev => ({ ...prev, activeArchitecture: undefined }))} 
      />
    )}
  </AnimatePresence>

  <AnimatePresence>
    {showSettings && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowSettings(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          className="relative w-full max-w-lg bg-[#1A1A22] border border-lilly/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="p-4 bg-lilly flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings size={18} className="text-white" />
              <span className="text-sm font-bold text-white uppercase tracking-widest">Lilly_Core_Settings</span>
            </div>
            <button onClick={() => setShowSettings(false)} className="text-white hover:rotate-90 transition-transform">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
            <section>
              <h3 className="text-xs font-bold text-info-neon uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Layout size={14} />
                Neural Identity
              </h3>
              <div className="space-y-4 bg-bg-panel p-4 rounded-xl border border-border-dark">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-mono uppercase text-text-dim">Neural Primary</span>
                  <input 
                    type="color" 
                    value={state.theme.primaryColor}
                    onChange={(e) => setState(prev => ({ ...prev, theme: { ...prev.theme, primaryColor: e.target.value } }))}
                    className="w-10 h-6 bg-transparent border-none p-0 cursor-pointer"
                  />
                </div>
                
                <div className="space-y-2">
                  <span className="text-[11px] font-mono uppercase text-text-dim">Neural Typography</span>
                  <div className="grid grid-cols-3 gap-2">
                    {['sans', 'mono', 'serif'].map(f => (
                      <button 
                        key={f}
                        onClick={() => setState(prev => ({ ...prev, theme: { ...prev.theme, fontFamily: f as any } }))}
                        className={`px-2 py-1 rounded text-[10px] uppercase font-bold transition-all border ${state.theme.fontFamily === f ? 'border-info-neon bg-info-neon/10 text-info-neon' : 'border-border-dark bg-bg-sidebar text-text-dim'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {['xs', 'sm', 'base', 'lg'].map(s => (
                      <button 
                        key={s}
                        onClick={() => setState(prev => ({ ...prev, theme: { ...prev.theme, fontSize: s as any } }))}
                        className={`px-2 py-1 rounded text-[10px] uppercase font-bold transition-all border ${state.theme.fontSize === s ? 'border-info-neon bg-info-neon/10 text-info-neon' : 'border-border-dark bg-bg-sidebar text-text-dim'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setState(prev => ({ ...prev, theme: { ...prev.theme, glassmorphism: !prev.theme.glassmorphism } }))}
                    className={`flex items-center justify-between p-2 rounded-lg border transition-all ${state.theme.glassmorphism ? 'border-lilly bg-lilly/10 text-lilly' : 'border-border-dark text-text-dim'}`}
                  >
                    <span className="text-[10px] font-bold uppercase">Glassmorphism</span>
                    {state.theme.glassmorphism ? <Volume2 size={12} /> : <VolumeX size={12} />}
                  </button>
                  <button 
                    onClick={() => setState(prev => ({ ...prev, theme: { ...prev.theme, backgroundBlur: !prev.theme.backgroundBlur } }))}
                    className={`flex items-center justify-between p-2 rounded-lg border transition-all ${state.theme.backgroundBlur ? 'border-info-neon bg-info-neon/10 text-info-neon' : 'border-border-dark text-text-dim'}`}
                  >
                    <span className="text-[10px] font-bold uppercase">Blur Effects</span>
                    {state.theme.backgroundBlur ? <Activity size={12} /> : <Activity size={12} className="opacity-30" />}
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-mono uppercase text-text-dim">App Icon</span>
                  <div className="flex gap-2">
                    {['🤖', '🌸', '⚡', '🌌', '🎀', '🎧'].map(emoji => (
                      <button 
                        key={emoji}
                        onClick={() => setState(prev => ({ ...prev, theme: { ...prev.theme, appIcon: emoji } }))}
                        className={`w-8 h-8 rounded flex items-center justify-center text-sm transition-all ${state.theme.appIcon === emoji ? 'bg-lilly border border-white/20' : 'bg-bg-sidebar border border-border-dark'}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-info-neon uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Brain size={14} />
                User Interests (Lilly Focus)
              </h3>
              <p className="text-[11px] text-text-dim mb-3 italic">
                Lilly will proactively monitor these topics and notify you of updates.
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {state.interests.length > 0 ? state.interests.map((interest, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-info-neon/10 border border-info-neon/30 text-info-neon px-2 py-1 rounded-full text-[10px]">
                    {interest}
                    <button 
                      onClick={() => setState(prev => ({ ...prev, interests: prev.interests.filter((_, i) => i !== idx) }))}
                      className="hover:text-white"
                    >
                      <X size={10} />
                    </button>
                  </div>
                )) : <span className="text-[10px] text-text-dim italic">No interests detected yet.</span>}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Add new interest (e.g. Shadow Slave, BTC, Weather)..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val && !state.interests.includes(val)) {
                        setState(prev => ({ ...prev, interests: [...prev.interests, val] }));
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                  className="flex-1 bg-bg-panel border border-border-dark rounded-lg px-3 py-1.5 text-xs outline-none focus:border-info-neon/50"
                />
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-success-neon uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Bell size={14} />
                Neural Protocols
              </h3>
              <div className="bg-bg-panel p-4 rounded-xl border border-border-dark space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-mono uppercase text-white">Quiet Mode</span>
                    <span className="text-[9px] text-text-dim">Suppress proactive pings</span>
                  </div>
                  <button 
                    onClick={() => setState(prev => ({ ...prev, notifications: { ...prev.notifications, quietMode: !prev.notifications.quietMode } }))}
                    className={`w-12 h-6 rounded-full p-1 transition-all ${state.notifications.quietMode ? 'bg-lilly shadow-[0_0_8px_var(--lilly-primary)]' : 'bg-border-dark'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${state.notifications.quietMode ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="space-y-3">
                  <span className="text-[11px] font-mono uppercase text-text-dim flex items-center gap-2">
                    <Clock size={12} />
                    Sync Windows
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {['09:00', '13:00', '18:00', '21:00'].map(time => (
                      <button 
                        key={time}
                        onClick={() => {
                          const times = state.notifications.preferredCheckInTimes.includes(time)
                            ? state.notifications.preferredCheckInTimes.filter(t => t !== time)
                            : [...state.notifications.preferredCheckInTimes, time];
                          setState(prev => ({ ...prev, notifications: { ...prev.notifications, preferredCheckInTimes: times } }));
                        }}
                        className={`px-2 py-1 rounded text-[10px] font-mono transition-all border ${state.notifications.preferredCheckInTimes.includes(time) ? 'border-lilly bg-lilly/10 text-lilly' : 'border-border-dark bg-bg-sidebar text-text-dim'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[11px] font-mono uppercase text-text-dim">Filters</span>
                  <div className="flex flex-wrap gap-2">
                    {['news', 'personal', 'crypto', 'anime', 'weather', 'tasks', 'calendar'].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => {
                          const cats = state.notifications.enabledCategories.includes(cat as any)
                            ? state.notifications.enabledCategories.filter(c => c !== cat)
                            : [...state.notifications.enabledCategories, cat as any];
                          setState(prev => ({ ...prev, notifications: { ...prev.notifications, enabledCategories: cats } }));
                        }}
                        className={`px-3 py-1 rounded-full text-[9px] uppercase font-bold transition-all ${state.notifications.enabledCategories.includes(cat as any) ? 'bg-success-neon/20 text-success-neon border border-success-neon/30' : 'bg-bg-sidebar text-text-dim border border-border-dark'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-lilly uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Database size={14} />
                Neural External Sync
              </h3>
              <div className="space-y-3 bg-bg-panel p-4 rounded-xl border border-border-dark">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-mono uppercase text-white font-bold">Google Calendar</span>
                    <span className="text-[9px] text-text-dim">Proactive event reminders</span>
                  </div>
                  <button 
                    onClick={() => syncCalendar(true)}
                    className="text-[10px] bg-lilly/20 text-lilly hover:bg-lilly hover:text-white px-3 py-1 rounded-lg font-bold border border-lilly/30 transition-all uppercase"
                  >
                    Sync Calendar
                  </button>
                </div>
                <p className="text-[9px] text-text-dim italic border-t border-border-dark pt-3">
                  Note: Neural sync requires OAuth authorization. If the popup doesn't appear, please check your browser's popup blocker.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-info-neon uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Layout size={14} />
                Neural Command Terminal
              </h3>
              <p className="text-[11px] text-text-dim mb-3 italic">
                Directly modify Lilly's core architecture, personality, and behavioral rules.
              </p>
              <div className="bg-bg-dark border border-border-dark rounded-xl p-3 font-mono text-[10px] space-y-2 max-h-40 overflow-y-auto mb-3 custom-scrollbar">
                <div className="text-success-neon flex items-center gap-2">
                  <span className="opacity-50">#</span> SYSTEM_READY
                </div>
                <div className="text-lilly flex items-center gap-2">
                  <span className="opacity-50">#</span> VERSION: 3.0.4-LILLY_CORE
                </div>
                {state.customPrompt && (
                  <div className="text-info-neon border-l border-info-neon/30 pl-2 mt-2">
                    <div className="opacity-50 font-bold">ACTIVE_DIRECTIVE:</div>
                    {state.customPrompt}
                  </div>
                )}
                <div className="text-white/20 animate-pulse">_Waiting for console input...</div>
              </div>
              <div className="flex gap-2">
                <textarea 
                  value={state.customPrompt || ''}
                  onChange={(e) => setState(prev => ({ ...prev, customPrompt: e.target.value }))}
                  placeholder="Inject new core instructions or override behavior..."
                  className="flex-1 bg-bg-panel border border-border-dark rounded-xl p-4 text-xs font-mono italic text-text-dim focus:border-lilly/50 outline-none resize-none min-h-[100px] custom-scrollbar"
                />
              </div>
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={() => setState(prev => ({ ...prev, customPrompt: '' }))}
                  className="px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-500 text-[9px] font-bold uppercase rounded-lg hover:bg-red-500/20 transition-all"
                >
                  Clear Directives
                </button>
                <button 
                   onClick={() => setShowSettings(false)}
                   className="flex-1 py-1 bg-success-neon/10 border border-success-neon/30 text-success-neon text-[9px] font-bold uppercase rounded-lg hover:bg-success-neon/20 transition-all font-mono"
                >
                   Commit and Sync [INIT_CORE_RESTART]
                </button>
              </div>
              <button 
                onClick={() => {
                  if(confirm("CRITICAL: This will PERMANENTLY WIPE all neural memory and reset Lilly to factory defaults. Proceed?")) {
                    setState(prev => ({ ...prev, isSelfDestructing: true, isThinking: false }));
                    setTimeout(() => {
                      localStorage.removeItem('lilly_state');
                      window.location.reload();
                    }, 15000);
                  }
                }}
                className="w-full mt-4 py-2 bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-bold uppercase rounded-xl hover:bg-red-500 shadow-lg shadow-red-500/0 hover:shadow-red-500/20 transition-all group"
              >
                <div className="flex items-center justify-center gap-2">
                   <Trash2 size={14} className="group-hover:animate-bounce" />
                   INITIATE_TOTAL_NEURAL_WIPE
                </div>
              </button>
            </section>
          </div>

          <div className="p-4 bg-[#121217] border-t border-border-dark flex justify-between items-center">
            <span className="text-[9px] font-mono text-text-dim uppercase">CORE_VERSION: 2.0.4-MOD_ACTIVE</span>
            <button 
              onClick={clearChat}
              className="text-[9px] font-bold text-red-500 uppercase hover:underline"
            >
              Hard_Wipe_System
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --lilly-primary: ${state.theme.primaryColor};
          --lilly-accent: ${state.theme.accentColor};
          --lilly-bg: ${state.theme.backgroundColor};
          --lilly-font: ${state.theme.fontFamily === 'mono' ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' : state.theme.fontFamily === 'serif' ? 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' : 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'};
          --lilly-size: ${state.theme.fontSize === 'xs' ? '0.75rem' : state.theme.fontSize === 'sm' ? '0.875rem' : state.theme.fontSize === 'lg' ? '1.125rem' : '1rem'};
        }

        body {
          font-family: var(--lilly-font);
          font-size: var(--lilly-size);
          background-color: var(--lilly-bg);
          color: white;
        }

        .glass-panel {
          background: ${state.theme.glassmorphism ? 'rgba(255, 255, 255, 0.03)' : 'transparent'};
          backdrop-filter: ${state.theme.backgroundBlur ? 'blur(12px)' : 'none'};
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .bg-lilly { background-color: var(--lilly-primary); }
        .text-lilly { color: var(--lilly-primary); }
        .border-lilly { border-color: var(--lilly-primary); }
        .from-lilly { --tw-gradient-from: var(--lilly-primary) var(--tw-gradient-from-position); }
        .shadow-lilly\/20 { --tw-shadow-color: color-mix(in srgb, var(--lilly-primary), transparent 80%); }
        .hover\:text-lilly:hover { color: var(--lilly-primary); }
        .hover\:bg-lilly:hover { background-color: var(--lilly-primary); }
        
        .text-info-neon { color: var(--lilly-accent); }
        .bg-info-neon\/10 { background-color: color-mix(in srgb, var(--lilly-accent), transparent 90%); }
        .border-info-neon\/30 { border-color: color-mix(in srgb, var(--lilly-accent), transparent 70%); }
        .focus\:border-info-neon\/50:focus { border-color: color-mix(in srgb, var(--lilly-accent), transparent 50%); }

        .bg-bg-dark { background-color: var(--lilly-bg); }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0F0F13;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2D2D35;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #FF007A;
        }
      `}} />
    </div>
  );
}

