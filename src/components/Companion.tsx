/**
 * Companion.tsx — Lilly AI Mascot v3.0
 * ─────────────────────────────────────
 * • Full CompanionState system (idle | thinking | responding | error | listening)
 * • companionAnimations export (per-state motion variants)
 * • useCompanionState hook (drop-in state manager with deriveFrom helper)
 * • Interactive click actions: wave → bounce → spin → pulse → shake (cycles)
 * • Per-state eyes, FX particles, glow halo, thought bubble, sound rings
 * • All sub-components memo'd — zero unnecessary re-renders
 * • Backward-compatible: isThinking boolean still works unchanged
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from 'react';
import { motion, AnimatePresence, useAnimation } from 'motion/react';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export type CompanionState =
  | 'idle'
  | 'thinking'
  | 'responding'
  | 'error'
  | 'listening';

export type ClickAction = 'wave' | 'bounce' | 'spin' | 'pulse' | 'shake';

export interface CompanionProps {
  /** Legacy compat — still works */
  isThinking?: boolean;
  /** Preferred explicit state */
  companionState?: CompanionState;
  /** Called after each click interaction */
  onMascotClick?: () => void;
}

// ═══════════════════════════════════════════════════════════
// ANIMATION VARIANTS — exported so the rest of the app can use them
// ═══════════════════════════════════════════════════════════

export const companionAnimations: Record<CompanionState, object> = {
  idle: {
    y: [0, -6, 0],
    scale: 1,
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
  thinking: {
    y: [0, -12, 0, -8, 0],
    rotate: [-2, 2, -2],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
  responding: {
    y: [0, -10, 2, -8, 0],
    scale: [1, 1.05, 1],
    transition: { duration: 0.6, repeat: Infinity },
  },
  error: {
    x: [-5, 5, -5, 4, -4, 0],
    scale: 0.95,
    transition: { duration: 0.3, repeat: Infinity, repeatDelay: 1.2 },
  },
  listening: {
    y: [0, -8, 0],
    opacity: [1, 0.75, 1],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
};

// Click-action spring animations — cycles on each tap
export const clickActions: ClickAction[] = ['wave', 'bounce', 'spin', 'pulse', 'shake'];

const CLICK_ANIMATIONS: Record<ClickAction, object> = {
  wave:   { rotate: [0, -22, 22, -16, 16, 0],   transition: { duration: 0.6 } },
  bounce: { y: [0, -30, 0, -14, 0],              transition: { duration: 0.55, ease: 'easeOut' } },
  spin:   { rotate: [0, 360],                    transition: { duration: 0.5, ease: 'easeInOut' } },
  pulse:  { scale: [1, 1.38, 0.88, 1.18, 1],    transition: { duration: 0.5 } },
  shake:  { x: [0, -11, 11, -8, 8, 0],          transition: { duration: 0.4 } },
};

// ═══════════════════════════════════════════════════════════
// useCompanionState HOOK
// ═══════════════════════════════════════════════════════════

export function useCompanionState(initialState: CompanionState = 'idle') {
  const [state, setState] = useState<CompanionState>(initialState);

  const transitionTo = useCallback((next: CompanionState) => setState(next), []);

  /**
   * Convenience: pass flags from your LillyState and the hook
   * resolves the correct CompanionState automatically.
   */
  const deriveFrom = useCallback(
    (flags: {
      isThinking?: boolean;
      isResponding?: boolean;
      isListening?: boolean;
      isOverworked?: boolean;
    }) => {
      if (flags.isOverworked)  return transitionTo('error');
      if (flags.isThinking)    return transitionTo('thinking');
      if (flags.isResponding)  return transitionTo('responding');
      if (flags.isListening)   return transitionTo('listening');
      transitionTo('idle');
    },
    [transitionTo]
  );

  return { state, setState, transitionTo, deriveFrom };
}

// ═══════════════════════════════════════════════════════════
// STATE CONFIG MAP
// ═══════════════════════════════════════════════════════════

interface StateConfig {
  label: string;
  bodyColor: string;
  glowColor: string;
  statusColor: string;
  eyeStyle: 'normal' | 'wide' | 'squint' | 'spinning' | 'scan';
  blush: boolean;
  tailSpeed: number;
  statusPulse: boolean;
  activeScale: number;
}

const STATE_CONFIG: Record<CompanionState, StateConfig> = {
  idle: {
    label: 'Lilly Online',
    bodyColor: '#FF6B35',
    glowColor: 'rgba(255,107,53,0.45)',
    statusColor: '#00FF9C',
    eyeStyle: 'normal',
    blush: false,
    tailSpeed: 3.2,
    statusPulse: false,
    activeScale: 0.85,
  },
  thinking: {
    label: 'Neural Processing...',
    bodyColor: '#A855F7',
    glowColor: 'rgba(168,85,247,0.55)',
    statusColor: '#A855F7',
    eyeStyle: 'spinning',
    blush: true,
    tailSpeed: 1.4,
    statusPulse: true,
    activeScale: 1,
  },
  responding: {
    label: 'Responding...',
    bodyColor: '#FF007A',
    glowColor: 'rgba(255,0,122,0.6)',
    statusColor: '#FF007A',
    eyeStyle: 'wide',
    blush: true,
    tailSpeed: 1.8,
    statusPulse: true,
    activeScale: 1.05,
  },
  error: {
    label: 'Neural Disruption!',
    bodyColor: '#EF4444',
    glowColor: 'rgba(239,68,68,0.55)',
    statusColor: '#EF4444',
    eyeStyle: 'squint',
    blush: false,
    tailSpeed: 0.7,
    statusPulse: true,
    activeScale: 0.95,
  },
  listening: {
    label: 'Listening...',
    bodyColor: '#00C8F0',
    glowColor: 'rgba(0,200,240,0.55)',
    statusColor: '#00C8F0',
    eyeStyle: 'scan',
    blush: false,
    tailSpeed: 2.2,
    statusPulse: true,
    activeScale: 0.95,
  },
};

// ═══════════════════════════════════════════════════════════
// EYE COMPONENTS — memo'd, no prop drilling beyond side
// ═══════════════════════════════════════════════════════════

const NormalEye = memo<{ side: 'left' | 'right' }>(({ side }) => (
  <motion.div
    className={`absolute top-7 ${side === 'left' ? 'left-4' : 'right-4'} w-3.5 h-3.5 bg-slate-900 rounded-full flex items-center justify-center overflow-hidden`}
    animate={{ scaleY: [1, 0.07, 1] }}
    transition={{ duration: 4.5, repeat: Infinity, repeatDelay: side === 'left' ? 2 : 2.6 }}
  >
    <div className="w-1 h-1 bg-white rounded-full mb-0.5 ml-0.5" />
  </motion.div>
));
NormalEye.displayName = 'NormalEye';

const WideEye = memo<{ side: 'left' | 'right' }>(({ side }) => (
  <motion.div
    className={`absolute top-6 ${side === 'left' ? 'left-3' : 'right-3'} w-4 h-4 bg-slate-900 rounded-full flex items-center justify-center`}
    animate={{ scale: [1, 1.12, 1] }}
    transition={{ duration: 0.75, repeat: Infinity }}
  >
    <motion.div
      className="w-1.5 h-1.5 bg-white rounded-full"
      animate={{ x: [-1, 1, -1], y: [0, -1, 0] }}
      transition={{ duration: 1.1, repeat: Infinity }}
    />
  </motion.div>
));
WideEye.displayName = 'WideEye';

const SquintEye = memo<{ side: 'left' | 'right' }>(({ side }) => (
  <motion.div
    className={`absolute top-8 ${side === 'left' ? 'left-4' : 'right-4'} w-4 h-[6px] bg-slate-900 rounded-full`}
    animate={{ scaleX: [1, 0.62, 1] }}
    transition={{ duration: 0.9, repeat: Infinity }}
  />
));
SquintEye.displayName = 'SquintEye';

const SpinningEye = memo<{ side: 'left' | 'right' }>(({ side }) => (
  <div className={`absolute top-7 ${side === 'left' ? 'left-4' : 'right-4'} w-3.5 h-3.5 bg-slate-900 rounded-full flex items-center justify-center overflow-hidden`}>
    <motion.div
      className="w-2.5 h-2.5 rounded-full border-2 border-purple-300 border-t-transparent"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.62, repeat: Infinity, ease: 'linear' }}
    />
  </div>
));
SpinningEye.displayName = 'SpinningEye';

const ScanEye = memo<{ side: 'left' | 'right' }>(({ side }) => (
  <div className={`absolute top-7 ${side === 'left' ? 'left-[13px]' : 'right-[13px]'} w-4 h-[14px] bg-slate-900 rounded-sm flex items-center justify-center overflow-hidden`}>
    <motion.div
      className="absolute w-full h-px bg-cyan-300 shadow-[0_0_4px_#00C8F0]"
      animate={{ y: [-5, 5, -5] }}
      transition={{ duration: 1.05, repeat: Infinity, ease: 'easeInOut' }}
    />
  </div>
));
ScanEye.displayName = 'ScanEye';

const EYE_MAP: Record<StateConfig['eyeStyle'], React.FC<{ side: 'left' | 'right' }>> = {
  normal:   NormalEye,
  wide:     WideEye,
  squint:   SquintEye,
  spinning: SpinningEye,
  scan:     ScanEye,
};

const EyePair = memo<{ eyeStyle: StateConfig['eyeStyle'] }>(({ eyeStyle }) => {
  const Comp = EYE_MAP[eyeStyle];
  return (
    <>
      <Comp side="left" />
      <Comp side="right" />
    </>
  );
});
EyePair.displayName = 'EyePair';

// ═══════════════════════════════════════════════════════════
// STATE FX OVERLAYS — memo'd
// ═══════════════════════════════════════════════════════════

const ThoughtBubble = memo(() => (
  <motion.div
    initial={{ opacity: 0, scale: 0.4, y: 8 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.4, y: 6 }}
    transition={{ duration: 0.22 }}
    className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none z-20"
  >
    <div className="px-3 py-2 bg-purple-950/85 backdrop-blur-md rounded-2xl border border-purple-400/30 flex gap-1.5 items-center shadow-xl shadow-purple-900/30">
      {[0, 0.18, 0.36].map((d) => (
        <motion.div
          key={d}
          className="w-1.5 h-1.5 rounded-full bg-purple-300"
          animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.72, repeat: Infinity, delay: d }}
        />
      ))}
    </div>
    <div className="flex flex-col items-center gap-[3px]">
      <div className="w-2 h-2 rounded-full bg-purple-400/50" />
      <div className="w-1 h-1 rounded-full bg-purple-400/30" />
    </div>
  </motion.div>
));
ThoughtBubble.displayName = 'ThoughtBubble';

const ListeningRings = memo(() => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-visible">
    {[1.6, 2.2, 2.9].map((s, i) => (
      <motion.div
        key={i}
        className="absolute w-full h-full rounded-[2.5rem] border border-cyan-300/35"
        animate={{ scale: [1, s], opacity: [0.55, 0] }}
        transition={{ duration: 1.55, repeat: Infinity, delay: i * 0.36, ease: 'easeOut' }}
      />
    ))}
  </div>
));
ListeningRings.displayName = 'ListeningRings';

const ErrorSparks = memo(() => (
  <>
    {[
      { angle: -42, dist: 22 },
      { angle: 22,  dist: 26 },
      { angle: -82, dist: 18 },
      { angle: 62,  dist: 24 },
    ].map(({ angle, dist }, i) => {
      const rad = (angle * Math.PI) / 180;
      const tx = Math.cos(rad) * dist;
      const ty = -Math.abs(Math.sin(rad) * dist) - 8;
      return (
        <motion.div
          key={i}
          className="absolute top-3 left-1/2 w-2 h-[2px] bg-red-400 rounded-full origin-left shadow-[0_0_4px_#EF4444]"
          animate={{ x: [0, tx], y: [0, ty], opacity: [1, 0], scaleX: [1, 0.2] }}
          transition={{ duration: 0.42, repeat: Infinity, repeatDelay: 0.72, delay: i * 0.11 }}
        />
      );
    })}
  </>
));
ErrorSparks.displayName = 'ErrorSparks';

const RespondingParticles = memo(() => (
  <>
    {Array.from({ length: 6 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 rounded-full bg-pink-400 shadow-[0_0_4px_#FF007A]"
        style={{
          top: `${14 + i * 13}%`,
          [i % 2 === 0 ? 'left' : 'right']: '-10px',
        }}
        animate={{ y: [-6, 6, -6], opacity: [0.12, 1, 0.12], scale: [0.5, 1.35, 0.5] }}
        transition={{ duration: 1.25 + i * 0.16, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
      />
    ))}
  </>
));
RespondingParticles.displayName = 'RespondingParticles';

// ═══════════════════════════════════════════════════════════
// FOX BODY — memo'd, CSS transition handles color shifts
// ═══════════════════════════════════════════════════════════

const FoxBody = memo<{ companionState: CompanionState; cfg: StateConfig }>(
  ({ companionState, cfg }) => (
    <div className="w-[90px] h-[90px] relative">
      {/* Tail */}
      <motion.div
        animate={{ rotate: [-24, 24, -24] }}
        transition={{ duration: cfg.tailSpeed, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-0 -right-5 w-14 h-14 rounded-full border border-white/10 origin-bottom-left shadow-md transition-colors duration-300"
        style={{ backgroundColor: cfg.bodyColor }}
      >
        <div className="absolute top-2 right-2 w-5 h-5 bg-white/65 rounded-full" />
      </motion.div>

      {/* Left ear */}
      <motion.div
        className="absolute -top-5 left-0 w-9 h-11 rounded-t-full border border-white/10 transition-colors duration-300"
        style={{ backgroundColor: cfg.bodyColor, rotate: '-12deg' }}
        animate={companionState === 'listening' ? { rotate: ['-20deg', '-7deg', '-20deg'] } : {}}
        transition={{ duration: 1.3, repeat: Infinity }}
      >
        <div className="absolute inset-1.5 top-2 bg-pink-300/25 rounded-t-full" />
      </motion.div>

      {/* Right ear */}
      <motion.div
        className="absolute -top-5 right-0 w-9 h-11 rounded-t-full border border-white/10 transition-colors duration-300"
        style={{ backgroundColor: cfg.bodyColor, rotate: '12deg' }}
        animate={companionState === 'listening' ? { rotate: ['20deg', '7deg', '20deg'] } : {}}
        transition={{ duration: 1.3, repeat: Infinity, delay: 0.07 }}
      >
        <div className="absolute inset-1.5 top-2 bg-pink-300/25 rounded-t-full" />
      </motion.div>

      {/* Head / Body */}
      <div
        className="w-full h-full rounded-[2.5rem] relative shadow-2xl overflow-hidden border-2 border-white/20 z-10 transition-colors duration-300"
        style={{ backgroundColor: cfg.bodyColor }}
      >
        {/* Face muzzle */}
        <div className="absolute bottom-0 inset-x-0 h-10 bg-white/90 rounded-t-full" />

        {/* Eyes */}
        <EyePair eyeStyle={cfg.eyeStyle} />

        {/* Blush marks */}
        <AnimatePresence>
          {cfg.blush && (
            <>
              <motion.div
                key="bl"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.12, 0.44, 0.12] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-[42px] left-[6px] w-5 h-2 bg-pink-400/60 rounded-full blur-[3px]"
              />
              <motion.div
                key="br"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.12, 0.44, 0.12] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.38 }}
                className="absolute top-[42px] right-[6px] w-5 h-2 bg-pink-400/60 rounded-full blur-[3px]"
              />
            </>
          )}
        </AnimatePresence>

        {/* Nose */}
        <div className="absolute top-[41px] left-1/2 -translate-x-1/2 w-3 h-2 bg-slate-900 rounded-full" />

        {/* Mouth — flipped frown on error */}
        <div
          className="absolute top-[52px] left-1/2 w-5 h-1.5 border-b-2 border-slate-900"
          style={{
            transform: `translateX(-50%)${companionState === 'error' ? ' scaleY(-1)' : ''}`,
            borderRadius: '0 0 50% 50%',
          }}
        />

        {/* Per-state overlays */}
        {companionState === 'listening'  && <ListeningRings />}
        {companionState === 'error'      && <ErrorSparks />}
        {companionState === 'responding' && <RespondingParticles />}
      </div>

      {/* Glow halo */}
      <motion.div
        className="absolute -inset-4 rounded-[3rem] z-0 blur-2xl transition-colors duration-300"
        style={{ backgroundColor: cfg.glowColor }}
        animate={{ opacity: [0.22, 0.65, 0.22], scale: [0.93, 1.07, 0.93] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
);
FoxBody.displayName = 'FoxBody';

// ═══════════════════════════════════════════════════════════
// STATUS BADGE
// ═══════════════════════════════════════════════════════════

const StatusBadge = memo<{ label: string; color: string; pulse: boolean }>(
  ({ label, color, pulse }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6, scale: 0.88 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18 }}
      className="mt-3 px-3 py-[5px] liquid-glass-accent rounded-full border border-white/10 shadow-lg flex items-center gap-1.5"
    >
      <motion.div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
        animate={pulse ? { opacity: [1, 0.22, 1], scale: [1, 1.55, 1] } : {}}
        transition={{ duration: 0.82, repeat: Infinity }}
      />
      <span className="text-[9px] font-black text-white italic uppercase tracking-[0.2em] whitespace-nowrap">
        {label}
      </span>
    </motion.div>
  )
);
StatusBadge.displayName = 'StatusBadge';

// ═══════════════════════════════════════════════════════════
// IDLE MINI AVATAR
// ═══════════════════════════════════════════════════════════

const IdleMiniAvatar = memo<{ bodyColor: string; onMascotClick: () => void }>(
  ({ bodyColor, onMascotClick }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.52, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.52, y: 12, transition: { duration: 0.16 } }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity duration-200 cursor-pointer group"
      onClick={onMascotClick}
      title="Lilly — click to chat"
    >
      <div className="relative">
        <div
          className="w-14 h-14 rounded-2xl relative shadow-lg overflow-hidden border border-white/10 group-hover:scale-110 group-hover:shadow-xl transition-all duration-200"
          style={{ backgroundColor: bodyColor }}
        >
          {/* Staggered blink */}
          {[{ pos: 'left-[10px]', delay: 2.6 }, { pos: 'right-[10px]', delay: 3.1 }].map(({ pos, delay }) => (
            <motion.div
              key={pos}
              className={`absolute top-5 ${pos} w-2 h-2 bg-slate-900 rounded-full`}
              animate={{ scaleY: [1, 0.07, 1] }}
              transition={{ duration: 3.8, repeat: Infinity, repeatDelay: delay }}
            />
          ))}
          <div className="absolute bottom-0 inset-x-0 h-5 bg-white/90 rounded-t-full" />
        </div>

        {/* Hover tooltip */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
          <span className="text-[8px] font-bold text-white uppercase tracking-widest">Awaiting Command</span>
        </div>
      </div>
    </motion.div>
  )
);
IdleMiniAvatar.displayName = 'IdleMiniAvatar';

// ═══════════════════════════════════════════════════════════
// TRANSITION FLASH RING
// ═══════════════════════════════════════════════════════════

const FlashRing = memo<{ glowColor: string }>(({ glowColor }) => (
  <motion.div
    initial={{ scale: 0.7, opacity: 0.92 }}
    animate={{ scale: 2.9, opacity: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.36, ease: 'easeOut' }}
    className="absolute inset-0 rounded-full border-2 pointer-events-none"
    style={{ borderColor: glowColor }}
  />
));
FlashRing.displayName = 'FlashRing';

// ═══════════════════════════════════════════════════════════
// MAIN COMPANION — thin orchestrator
// ═══════════════════════════════════════════════════════════

export const Companion: React.FC<CompanionProps> = ({
  isThinking,
  companionState: externalState,
  onMascotClick,
}) => {
  // State resolution — prefer explicit prop, fall back to legacy bool
  const resolvedState: CompanionState = useMemo(
    () => externalState ?? (isThinking ? 'thinking' : 'idle'),
    [externalState, isThinking]
  );

  const cfg = STATE_CONFIG[resolvedState];
  const isActive = resolvedState !== 'idle';

  // Flash ring on state transition
  const prevStateRef = useRef<CompanionState>(resolvedState);
  const [showFlash, setShowFlash] = useState(false);
  useEffect(() => {
    if (prevStateRef.current !== resolvedState) {
      setShowFlash(true);
      const t = setTimeout(() => setShowFlash(false), 420);
      prevStateRef.current = resolvedState;
      return () => clearTimeout(t);
    }
  }, [resolvedState]);

  // Click-action cycle (wave → bounce → spin → pulse → shake → repeat)
  const controls = useAnimation();
  const clickIndexRef = useRef(0);
  const handleClick = useCallback(async () => {
    const action = clickActions[clickIndexRef.current % clickActions.length];
    clickIndexRef.current++;
    await controls.start(CLICK_ANIMATIONS[action]);
    controls.start({
      x: 0, y: 0, rotate: 0, scale: 1, opacity: 1,
      transition: { duration: 0.22 },
    });
    onMascotClick?.();
  }, [controls, onMascotClick]);

  // Float variant for current state
  const floatVariant = useMemo(() => companionAnimations[resolvedState], [resolvedState]);

  return (
    <div className="fixed pointer-events-none z-[1000] bottom-0 left-0 p-5 select-none">
      <AnimatePresence mode="wait">
        {isActive ? (
          <motion.div
            key={`active-${resolvedState}`}
            animate={controls}
            initial={{ y: 68, opacity: 0, scale: 0.52 }}
            exit={{ y: 26, opacity: 0, scale: 0.65, transition: { duration: 0.18 } }}
            transition={{ opacity: { duration: 0.22 }, scale: { duration: 0.22 } }}
            className="relative flex flex-col items-center pointer-events-auto cursor-pointer"
            onClick={handleClick}
          >
            {/* Float layer — isolated from click controls */}
            <motion.div className="flex flex-col items-center" animate={floatVariant}>

              {/* State-transition flash */}
              <AnimatePresence>
                {showFlash && <FlashRing key="flash" glowColor={cfg.glowColor} />}
              </AnimatePresence>

              {/* Thought bubble (thinking only) */}
              <AnimatePresence>
                {resolvedState === 'thinking' && <ThoughtBubble key="thought" />}
              </AnimatePresence>

              {/* Fox mascot */}
              <FoxBody companionState={resolvedState} cfg={cfg} />

              {/* Status badge */}
              <StatusBadge
                label={cfg.label}
                color={cfg.statusColor}
                pulse={cfg.statusPulse}
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="idle-mini"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10, transition: { duration: 0.14 } }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto"
          >
            <IdleMiniAvatar bodyColor={cfg.bodyColor} onMascotClick={handleClick} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Companion;
