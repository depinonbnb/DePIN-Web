import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

const BNB_LOGO = '/assets/bnb-logo.ico';

const CX = 500;
const CY = 350;
const LOGO_SIZE = 200;
const LOGO_HALF = LOGO_SIZE / 2;

type Point = { x: number; y: number };

type Spoke = { terminal: Point; path: string };

/** Orthogonal only (H/V segments); each spoke uses a different bend layout */
const spokes: Spoke[] = [
  {
    terminal: { x: 500, y: 75 },
    path: `M ${CX} ${CY} L 535 350 L 535 95 L 500 95 L 500 75`,
  },
  {
    terminal: { x: 800, y: 130 },
    path: `M ${CX} ${CY} L 710 350 L 710 130 L 800 130`,
  },
  {
    terminal: { x: 920, y: 350 },
    path: `M ${CX} ${CY} L 875 350 L 920 350`,
  },
  {
    terminal: { x: 800, y: 570 },
    path: `M ${CX} ${CY} L ${CX} 510 L 810 510 L 810 570 L 800 570`,
  },
  {
    terminal: { x: 500, y: 625 },
    path: `M ${CX} ${CY} L 415 350 L 415 625 L 500 625`,
  },
  {
    terminal: { x: 200, y: 570 },
    path: `M ${CX} ${CY} L 335 350 L 335 570 L 200 570`,
  },
  {
    terminal: { x: 80, y: 350 },
    path: `M ${CX} ${CY} L 115 350 L 80 350`,
  },
  {
    terminal: { x: 200, y: 130 },
    path: `M ${CX} ${CY} L ${CX} 225 L 215 225 L 215 130 L 200 130`,
  },
];

const circuits = spokes.map((s) => s.path);
const terminals = spokes.map((s) => s.terminal);

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
  const cycleDuration = svgOptions?.duration || 8;

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

      <g aria-hidden="true">
        {circuits.map((path, idx) => (
          <motion.path
            key={`circuit-${idx}`}
            d={path}
            stroke="url(#circuitGradientYellow)"
            strokeWidth="2.5"
            fill="none"
            filter="url(#circuitGlowYellow)"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0.92, 1],
              opacity: [0, 0.75, 0.5, 0.75],
            }}
            transition={{
              duration: cycleDuration,
              repeat: Infinity,
              delay: idx * 0.55,
              ease: 'easeInOut',
            }}
          />
        ))}

        {terminals.map((point, idx) => (
          <motion.circle
            key={`terminal-${idx}`}
            cx={point.x}
            cy={point.y}
            r={5}
            fill="url(#circuitGradientYellow)"
            filter="url(#circuitGlowYellow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1, 1.15, 1], opacity: [0, 0.9, 0.6, 0.9] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: 0.3 + idx * 0.55,
              ease: 'easeInOut',
            }}
          />
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
