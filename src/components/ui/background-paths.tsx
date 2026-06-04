import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

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
    <div
      className={cn(
        'relative w-full bg-black',
        className,
      )}
    >
      <PathSVG svgOptions={svgOptions} className={svgClassName} />
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
  const circuits = [
    'M 50 100 L 200 100 L 200 200 L 350 200 L 350 300 L 500 300',
    'M 500 50 L 500 150 L 650 150 L 650 250 L 800 250 L 800 350',
    'M 100 400 L 250 400 L 250 500 L 400 500 L 400 600 L 550 600',
    'M 600 400 L 750 400 L 750 500 L 900 500 L 900 600',
    'M 50 300 L 150 300 L 150 450 L 300 450 L 300 550',
    'M 700 100 L 850 100 L 850 200 L 950 200',
    'M 150 200 L 300 200 L 300 350 L 450 350 L 450 450',
    'M 550 150 L 700 150 L 700 300 L 850 300',
  ];

  const nodes = [
    { x: 200, y: 100 },
    { x: 350, y: 200 },
    { x: 500, y: 300 },
    { x: 500, y: 150 },
    { x: 650, y: 150 },
    { x: 800, y: 350 },
    { x: 250, y: 400 },
    { x: 400, y: 500 },
    { x: 750, y: 400 },
    { x: 150, y: 300 },
    { x: 300, y: 450 },
    { x: 850, y: 100 },
  ];

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
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {circuits.map((path, idx) => (
        <motion.path
          key={`circuit-${idx}`}
          d={path}
          stroke="url(#circuitGradientYellow)"
          strokeWidth="3"
          fill="none"
          filter="url(#circuitGlowYellow)"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 0.8, 1],
            opacity: [0, 1, 0.4, 1],
          }}
          transition={{
            duration: svgOptions?.duration || 6,
            repeat: Infinity,
            delay: idx * 0.5,
            ease: 'easeInOut',
          }}
        />
      ))}

      {nodes.map((node, idx) => (
        <motion.g key={`node-${idx}`}>
          <motion.circle
            cx={node.x}
            cy={node.y}
            r="6"
            fill="url(#circuitGradientYellow)"
            filter="url(#circuitGlowYellow)"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1, 1.1, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: idx * 0.3,
              ease: 'easeInOut',
            }}
          />
          <motion.circle
            cx={node.x}
            cy={node.y}
            r="12"
            fill="none"
            stroke="url(#circuitGradientYellow)"
            strokeWidth="1"
            opacity="0.5"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 1.2, 1.5] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: idx * 0.3,
              ease: 'easeInOut',
            }}
          />
        </motion.g>
      ))}
    </motion.svg>
  );
};
