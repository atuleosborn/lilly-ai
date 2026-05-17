/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MemoryBlock, MemoryType } from '../types';
import { Brain, Tag, Trash2, ShieldCheck, Zap, History, UserCheck } from 'lucide-react';

interface MemoryViewProps {
  memory: MemoryBlock[];
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function MemoryView({ memory, onDelete, onClose }: MemoryViewProps) {
  const getIcon = (type: MemoryType) => {
    switch (type) {
      case MemoryType.PROFILE: return <UserCheck size={14} />;
      case MemoryType.SESSION: return <History size={14} />;
      case MemoryType.TASK: return <Zap size={14} />;
      case MemoryType.PREFERENCE: return <ShieldCheck size={14} />;
    }
  };

  const getBgColor = (type: MemoryType) => {
    switch (type) {
      case MemoryType.PROFILE: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case MemoryType.SESSION: return 'bg-blue-50 text-blue-700 border-blue-100';
      case MemoryType.TASK: return 'bg-amber-50 text-amber-700 border-amber-100';
      case MemoryType.PREFERENCE: return 'bg-purple-50 text-purple-700 border-purple-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-50 border-l border-gray-100 flex flex-col"
    >
      <div className="p-6 border-bottom flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          <Brain className="text-pink-500" />
          <h2 className="text-xl font-bold text-gray-800">Lilly's Memory</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <Trash2 size={20} className="text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {memory.length === 0 ? (
          <div className="text-center py-20 opacity-40">
            <Brain size={48} className="mx-auto mb-4" />
            <p>My mind is a blank slate...</p>
          </div>
        ) : (
          memory.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border ${getBgColor(item.type)} relative group`}
            >
              <div className="flex items-center gap-2 mb-2">
                {getIcon(item.type)}
                <span className="text-[10px] uppercase font-bold tracking-wider">{item.type}</span>
                <span className="ml-auto text-[10px] opacity-60">
                  Comp: {(item.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-sm font-medium mb-3">{item.summary}</p>
              
              <div className="flex flex-wrap gap-1">
                {item.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-[10px] bg-white/50 px-2 py-0.5 rounded-full">
                    <Tag size={8} />
                    {tag}
                  </span>
                ))}
              </div>

              <button 
                onClick={() => onDelete(item.id)}
                className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white rounded transition-all text-red-400"
              >
                <Trash2 size={12} />
              </button>
            </motion.div>
          ))
        )}
      </div>

      <div className="p-6 text-[10px] text-gray-400 bg-gray-50 flex flex-col gap-2">
        <p>Lilly continuously adapts these blocks based on your interactions.</p>
        <p className="font-mono opacity-60">STORAGE: Local Storage v1.0</p>
      </div>
    </motion.div>
  );
}
