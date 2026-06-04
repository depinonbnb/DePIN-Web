import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

const BNB_LOGO = '/assets/bnb-logo.ico';

const CX = 500;
const CY = 350;
const LOGO_SIZE = 200;
const LOGO_HALF = LOGO_SIZE / 2;

type Point = { x: number; y: number };

/**
 * Each spoke is an orthogonal route from the centre (CX, CY) out to a terminal
 * dot. v2 strings two spokes together per "beat": a pulse travels in from one
 * dot, through the logo at the centre, and out the other side to another dot.
 */
const spokePoints: Point[][] = [
  [{ x: 500, y: 350 }, { x: 535, y: 350 }, { x: 535, y: 95 }, { x: 500, y: 95 }, { x: 500, y: 75 }],
  [{ x: 500, y: 350 }, { x: 710, y: 350 }, { x: 710, y: 130 }, { x: 800, y: 130 }],
  [{ x: 500, y: 350 }, { x: 875, y: 350 }, { x: 920, y: 350 }],
  [{ x: 500, y: 350 }, { x: 500, y: 510 }, { x: 810, y: 510 }, { x: 810, y: 570 }, { x: 800, y: 570 }],
  [{ x: 500, y: 350 }, { x: 415, y: 350 }, { x: 415, y: 625 }, { x: 500, y: 625 }],
  [{ x: 500, y: 350 }, { x: 335, y: 350 }, { x: 335, y: 570 }, { x: 200, y: 570 }],
  [{ x: 500, y: 350 }, { x: 115, y: 350 }, { x: 80, y: 350 }],
  [{ x: 500, y: 350 }, { x: 500, y: 225 }, { x: 215, y: 225 }, { x: 215, y: 130 }, { x: 200, y: 130 }],
  [{ x: 500, y: 350 }, { x: 650, y: 350 }, { x: 650, y: 90 }],
  [{ x: 500, y: 350 }, { x: 350, y: 350 }, { x: 350, y: 610 }],
  [{ x: 500, y: 350 }, { x: 500, y: 470 }, { x: 900, y: 470 }],
];

const toPath = (pts: Point[]) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

type Beat = { d: string; inDot: Point; outDot: Point };

// each beat: pulse enters from one dot, crosses the centre, exits to the spoke
// roughly opposite it
const beats: Beat[] = spokePoints.map((inSpoke, i) => {
  const outSpoke = spokePoints[(i + 4) % spokePoints.length];
  const inReversed = [...inSpoke].reverse(); // terminal -> centre
  const combined = [...inReversed, ...outSpoke.slice(1)]; // ... centre -> out terminal
  return {
    d: toPath(combined),
    inDot: inSpoke[inSpoke.length - 1],
    outDot: outSpoke[outSpoke.length - 1],
  };
});

export const BackgroundPaths = ({
  children,
  className,
  svgClassName,
  svgOptions,
}: {
  children: React.ReactNode;
  className?: string;
  svgClassName?: string;
  svgOptions?: {
    duration?: number;
  };
}) => {
  return (
    <div className={cn('relative w-full bg-black', className)}>
      <PathSVG svgOptions={svgOptions} className={svgClassName} />
      {/* readability scrim: strong dim on mobile so text stays legible over the
          animation, fading to a left-side gradient on desktop so the circuit
          animation still shows through on the right */}
      <div className="pointer-events-none absolute inset-0 bg-black/65 md:bg-transparent md:bg-gradient-to-r md:from-black md:via-black/40 md:to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const PathSVG = ({
  svgOptions,
  className,
}: {
  svgOptions?: { duration?: number };
  className?: string;
}) => {
  // full cycle through every beat; each beat gets an equal slot, fired one at a time
  const total = svgOptions?.duration ?? 16;
  const slot = total / beats.length;
  const repeatDelay = total - slot;

  return (
    <motion.svg
      viewBox="0 0 1000 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('absolute inset-0 w-full h-full', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <defs>
        <linearGradient id="circuitGradientYellow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F0B90B" />
          <stop offset="50%" stopColor="#FCD535" />
          <stop offset="100%" stopColor="#D9A50A" />
        </linearGradient>
        <filter id="circuitGlowYellow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* beats render before the logo so the pulse passes behind (through) it */}
      <g aria-hidden="true">
        {beats.map((beat, idx) => (
          <g key={`beat-${idx}`}>
            <motion.path
              d={beat.d}
              stroke="url(#circuitGradientYellow)"
              strokeWidth="3"
              fill="none"
              filter="url(#circuitGlowYellow)"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 1], opacity: [0, 0.85, 0] }}
              transition={{
                duration: slot,
                times: [0, 0.7, 1],
                repeat: Infinity,
                repeatDelay,
                delay: idx * slot,
                ease: 'easeInOut',
              }}
            />
            {/* dot the pulse starts from */}
            <motion.circle
              cx={beat.inDot.x}
              cy={beat.inDot.y}
              r={5}
              fill="url(#circuitGradientYellow)"
              filter="url(#circuitGlowYellow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 1, 0.8], opacity: [0, 1, 0.5, 0] }}
              transition={{
                duration: slot,
                times: [0, 0.1, 0.35, 0.55],
                repeat: Infinity,
                repeatDelay,
                delay: idx * slot,
                ease: 'easeInOut',
              }}
            />
            {/* dot the pulse exits to */}
            <motion.circle
              cx={beat.outDot.x}
              cy={beat.outDot.y}
              r={6}
              fill="url(#circuitGradientYellow)"
              filter="url(#circuitGlowYellow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 0, 1.3, 1, 1], opacity: [0, 0, 1, 1, 0] }}
              transition={{
                duration: slot,
                times: [0, 0.6, 0.72, 0.88, 1],
                repeat: Infinity,
                repeatDelay,
                delay: idx * slot,
                ease: 'easeInOut',
              }}
            />
          </g>
        ))}
      </g>

      <motion.image
        href={BNB_LOGO}
        x={CX - LOGO_HALF}
        y={CY - LOGO_HALF}
        width={LOGO_SIZE}
        height={LOGO_SIZE}
        preserveAspectRatio="xMidYMid meet"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  );
};
