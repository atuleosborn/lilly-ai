/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum MemoryType {
  PROFILE = 'profile',
  SESSION = 'session',
  TASK = 'task',
  PREFERENCE = 'preference'
}

export interface MemoryBlock {
  type: MemoryType;
  confidence: number;
  summary: string;
  reason: string;
  tags: string[];
  id: string;
  createdAt: number;
  deprecated?: boolean;
}

export enum ActionType {
  PLAY_SONG = 'play_song',
  PAUSE_SONG = 'pause_song',
  NEXT_SONG = 'next_song',
  SET_TIMER = 'set_timer',
  SET_ALARM = 'set_alarm',
  CANCEL_TIMER = 'cancel_timer',
  READ_TEXT_ALOUD = 'read_text_aloud',
  SAVE_NOTE = 'save_note',
  RETRIEVE_NOTE = 'retrieve_note',
  BUILD_APP = 'build_app',
  GENERATE_IMAGE = 'generate_image',
  START_COOLDOWN = 'start_cooldown',
  SELF_DESTRUCT = 'self_destruct'
}

export interface Action {
  type: ActionType;
  params: Record<string, any>;
}

export interface AppArchitecture {
  structure: string;
  sourceCode: Record<string, string>;
  buildSteps: string[];
  dependencies: string[];
  permissions: string[];
  instructions: string;
}

export interface Improvement {
  problem: string;
  cause: string;
  solution: string;
  expectedBenefit: string;
  implementationSteps: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: number;
  actions?: Action[];
  architecture?: AppArchitecture;
  improvements?: Improvement[];
  errorMessage?: string;
  errorActionable?: string;
}

export interface NewsItem {
  id: string;
  category: 'anime' | 'crypto' | 'novel' | 'weather' | 'general' | 'tasks' | 'calendar';
  title: string;
  content: string;
  timestamp: number;
  url?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: number;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category?: string;
}

export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  appIcon?: string;
  fontFamily: 'sans' | 'mono' | 'serif';
  fontSize: 'xs' | 'sm' | 'base' | 'lg';
  backgroundBlur: boolean;
  glassmorphism: boolean;
}

export interface NotificationSettings {
  preferredCheckInTimes: string[];
  enabledCategories: ('news' | 'personal' | 'crypto' | 'anime' | 'novel' | 'weather' | 'tasks' | 'calendar')[];
  frequency: 'low' | 'medium' | 'high';
  quietMode: boolean;
  calendarSync: boolean;
}

export interface SocialConnection {
  platform: 'spotify' | 'twitter' | 'github' | 'instagram' | 'google' | 'snapchat' | 'facebook';
  connected: boolean;
  username?: string;
  lastSync?: number;
  data?: any;
}

export interface LillyState {
  messages: Message[];
  memory: MemoryBlock[];
  tasks: Task[];
  isThinking: boolean;
  uiMode: 'full' | 'bubble';
  isBubbleMinimized: boolean;
  activeArchitecture?: AppArchitecture;
  currentView: 'chat' | 'nexus' | 'music' | 'social' | 'tasks' | 'settings';
  customPrompt?: string;
  interests: string[];
  news: NewsItem[];
  lastInteractionTimestamp: number;
  coolDownUntil?: number;
  isOverworked?: boolean;
  isSelfDestructing?: boolean;
  theme: ThemeConfig;
  notifications: NotificationSettings;
  connections: SocialConnection[];
}
