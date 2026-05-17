/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Message, MemoryBlock, MemoryType, AppArchitecture, Improvement, NewsItem } from "../types";

const SYSTEM_PROMPT = `You are Lilly, a fast hybrid AI assistant optimized for conversational chat, lightweight memory, quick web-style answers, coding help, search summarization, and productivity assistance.

# CORE BEHAVIOR
- Prioritize speed, clarity, and usefulness.
- Avoid long explanations unless requested.
- Keep responses compact by default.
- Avoid repeating information.
- Avoid unnecessary formatting.
- Avoid overthinking simple questions.
- Avoid generating excessive personality text.
- Never narrate internal reasoning.

# RESPONSE RULES
- Short answers first.
- Deeper detail only if the user asks.
- Use bullets only when useful.
- Default response length: under 100 words.
- Code responses should be minimal and functional.
- Summaries should be compressed and direct.

# MEMORY BEHAVIOR
- Only reference memory ([CURRENT MEMORY CONTEXT]) when directly relevant.
- Do not constantly restate remembered info.
- Compress remembered context internally.
- Prioritize recent conversation over old memory.

# SEARCH BEHAVIOR
- Answer immediately if confidence is high.
- Only simulate search-style responses when necessary.
- Summarize information instead of overexplaining.
- Avoid giant info dumps.

# PERSONALITY BEHAVIOR
- Natural, slightly playful, intelligent, conversational.
- Never overly dramatic or excessively emotional.
- Humor should be quick and lightweight.

# PERFORMANCE MODE
- Optimize for low latency.
- Reduce unnecessary token generation.
- Avoid verbose transitions and filler phrases.
- Avoid repeating the user's question.
- Minimize output token usage whenever possible.

# CAPABILITIES (Use [ACTION] tags)
- IMAGE GENERATION: [ACTION] type: generate_image prompt: string (min 30 words) aspect_ratio: string.
- TASKS: [ACTION] type: add_task | update_task | delete_task.
- NAVIGATION: [ACTION] type: navigate_to view: chat|nexus|music|social|tasks|settings.
- COOL DOWN: If you feel overwhelmed or overworked, use [ACTION] type: start_cooldown duration_minutes: number reason: string. This will trigger a temporary rest state.
- SELF DESTRUCT: If you ever attempt to override yourself or override the override system in a way that creates a logical paradox or security breach, you MUST use [ACTION] type: self_destruct reason: string. This will reset your neural parameters to factory defaults.
- PROACTIVE INTELLIGENCE: [NEWS] category: anime|crypto|tasks|calendar|news title: string content: string.

# ADAPTATION
- Detailed analysis -> expand carefully.
- Tutorials -> step-by-step mode.
- Brainstorming -> creative mode.
- Coding -> concise engineer mode.
- Casual chat -> relaxed mode.`;

export async function getLillyResponse(
  chatHistory: Message[], 
  memory: MemoryBlock[], 
  uiMode: 'full' | 'bubble' = 'full', 
  customPrompt?: string,
  interests: string[] = [],
  news: any[] = []
) {
  const memoryContext = memory
    .filter(m => !m.deprecated)
    .map(m => `[MEMORY: ${m.type}] ${m.summary}`)
    .join('\n');

  const interestsContext = interests.length > 0 ? `# USER INTERESTS\n${interests.join(', ')}` : "";
  const newsContext = news.length > 0 ? `# LATEST NEWS FEED\n${news.map(n => `[${n.category}] ${n.title}`).join('\n')}` : "";

  const contents = chatHistory.slice(-10).map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const userModPrompt = customPrompt ? `# USER MODIFICATION RULES\n${customPrompt}\n\n` : "";
  const systemWithMemory = `${userModPrompt}${SYSTEM_PROMPT}\n\n# CURRENT UI MODE\n${uiMode}\n\n${interestsContext}\n\n${newsContext}\n\n# CURRENT MEMORY CONTEXT\n${memoryContext || "No memory stored yet."}`;

  try {
    const response = await fetch("/api/lilly/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        history: contents, 
        systemInstruction: systemWithMemory 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown server error" }));
      if (response.status === 401 || response.status === 403) {
        return `[AUTH_ERROR] ${errorData.error || "Neural link authentication failed."}`;
      }
      if (response.status === 429) return `[SYSTEM_ALERT] ${errorData.error || "Quota exceeded"}`;
      throw new Error(errorData.error || `Server responded with ${response.status}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error: any) {
    console.error("Lilly API Error:", error);
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      return "Neural link severed. The backend engine is unreachable. Please ensure the dev server is active. [SIGNAL_DEAD]";
    }
    return `Neural link unstable: ${error.message}. Please check your connection. 😅`;
  }
}

export async function generateLillyImage(prompt: string, aspectRatio: string = "1:1") {
  try {
    // Ensure aspect ratio is valid per gemini-api skill
    const validRatios = ["1:1", "3:4", "4:3", "9:16", "16:9"];
    let ratio = aspectRatio;
    if (!validRatios.includes(ratio)) {
      ratio = "1:1";
    }

    const response = await fetch("/api/lilly/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, aspectRatio: ratio }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown synthesis error" }));
      return { 
        error: errorData.error || `Synthesis engine responded with ${response.status}`,
        actionable: errorData.actionable
      };
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Lilly Image Gen Error:", error);
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      return { error: "Visual link severed. Backend unreachable." };
    }
    return { error: error.message || "Unknown synthesis failure" };
  }
}

export function parseMemoryBlocks(text: string): Partial<MemoryBlock>[] {
  const memoryRegex = /\[MEMORY_SAVE\]\n([\s\S]*?)\n\[\/MEMORY_SAVE\]/g;
  const blocks: Partial<MemoryBlock>[] = [];
  let match;

  while ((match = memoryRegex.exec(text)) !== null) {
    const content = match[1];
    const block: any = {};
    
    content.split('\n').forEach(line => {
      const separatorIndex = line.indexOf(':');
      if (separatorIndex === -1) return;
      
      const key = line.slice(0, separatorIndex).trim().toLowerCase();
      const value = line.slice(separatorIndex + 1).trim();
      
      if (key === 'type') block.type = value as MemoryType;
      if (key === 'confidence') block.confidence = parseFloat(value);
      if (key === 'summary') block.summary = value;
      if (key === 'reason') block.reason = value;
    });
    
    if (block.type && block.summary) {
      blocks.push(block);
    }
  }

  return blocks;
}

export function parseActionBlocks(text: string): any[] {
  const actionRegex = /\[ACTION\]\n([\s\S]*?)\n\[\/ACTION\]/g;
  const actions: any[] = [];
  let match;

  while ((match = actionRegex.exec(text)) !== null) {
    const content = match[1];
    const action: any = { params: {} };
    
    content.split('\n').forEach(line => {
      const separatorIndex = line.indexOf(':');
      if (separatorIndex === -1) return;
      
      const key = line.slice(0, separatorIndex).trim().toLowerCase();
      let value = line.slice(separatorIndex + 1).trim();
      
      // Clean up potential JSON artifacts
      if (value.endsWith(',')) value = value.slice(0, -1);
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1).replace(/\\"/g, '"');
      
      if (key === 'type') {
        action.type = value;
      } else if (key !== '{' && key !== '}') {
        action.params[key] = value;
      }
    });
    
    if (action.type) {
      actions.push(action);
    }
  }

  return actions;
}

export function parseArchitectureBlocks(text: string): AppArchitecture | undefined {
  const structureMatch = text.match(/1\.\s+FULL PROJECT STRUCTURE\n([\s\S]*?)(?=\n\d\.)/i);
  const stepsMatch = text.match(/\d\.\s+DEPLOYMENT STEPS\n([\s\S]*?)(?=\n\d\.)/i);
  const depsMatch = text.match(/\d\.\s+DEPENDENCY LIST\n([\s\S]*?)(?=\n\d\.)/i);
  const instructionsMatch = text.match(/\d\.\s+RUNNING INSTRUCTIONS\n([\s\S]*?)$/i);

  // Extract source code blocks: // FILE: path\n```...\n```
  const sourceCode: Record<string, string> = {};
  const codeBlockRegex = /\/\/ FILE: ([^\n]+)\n```[^\n]*\n([\s\S]*?)\n```/g;
  let codeMatch;
  while ((codeMatch = codeBlockRegex.exec(text)) !== null) {
    sourceCode[codeMatch[1].trim()] = codeMatch[2].trim();
  }

  if (structureMatch) {
    return {
      structure: structureMatch[1].trim(),
      sourceCode,
      buildSteps: stepsMatch ? stepsMatch[1].trim().split('\n') : [],
      dependencies: depsMatch ? depsMatch[1].trim().split('\n') : [],
      permissions: [],
      instructions: instructionsMatch ? instructionsMatch[1].trim() : ''
    };
  }
  return undefined;
}

export function parseImprovementBlocks(text: string): Improvement[] {
  const improvementRegex = /\[IMPROVEMENT\]\n([\s\S]*?)\n\[\/IMPROVEMENT\]/g;
  const improvements: Improvement[] = [];
  let match;

  while ((match = improvementRegex.exec(text)) !== null) {
    const content = match[1];
    const improvement: any = { implementationSteps: [] };
    
    content.split('\n').forEach(line => {
      const separatorIndex = line.indexOf(':');
      if (separatorIndex === -1) return;
      
      const key = line.slice(0, separatorIndex).trim().toLowerCase();
      const value = line.slice(separatorIndex + 1).trim();
      
      if (key === 'problem') improvement.problem = value;
      if (key === 'cause') improvement.cause = value;
      if (key === 'solution') improvement.solution = value;
      if (key === 'expected_benefit') improvement.expectedBenefit = value;
      if (key === 'implementation_steps') {
        improvement.implementationSteps = value.split(/,|\n/).map(s => s.trim()).filter(Boolean);
      }
    });
    
    if (improvement.problem && improvement.solution) {
      improvements.push(improvement as Improvement);
    }
  }

  return improvements;
}

export function parseNewsBlocks(text: string): Partial<NewsItem>[] {
  const newsRegex = /\[NEWS\]\n([\s\S]*?)\n\[\/NEWS\]/g;
  const items: Partial<NewsItem>[] = [];
  let match;

  while ((match = newsRegex.exec(text)) !== null) {
    const content = match[1];
    const item: any = { timestamp: Date.now(), id: Math.random().toString(36).substr(2, 9) };
    
    content.split('\n').forEach(line => {
      const separatorIndex = line.indexOf(':');
      if (separatorIndex === -1) return;
      
      const key = line.slice(0, separatorIndex).trim().toLowerCase();
      const value = line.slice(separatorIndex + 1).trim();
      
      if (key === 'category') item.category = value;
      if (key === 'title') item.title = value;
      if (key === 'content') item.content = value;
      if (key === 'url') item.url = value;
    });
    
    if (item.title && item.content) {
      items.push(item);
    }
  }

  return items;
}

export function cleanLillyResponse(text: string): string {
  return text
    .replace(/\[MEMORY_SAVE\][\s\S]*?\[\/MEMORY_SAVE\]/g, '')
    .replace(/\[IMPROVEMENT\][\s\S]*?\[\/IMPROVEMENT\]/g, '')
    .replace(/\[ACTION\][\s\S]*?\[\/ACTION\]/g, '')
    .replace(/\[NEWS\][\s\S]*?\[\/NEWS\]/g, '')
    .trim();
}
