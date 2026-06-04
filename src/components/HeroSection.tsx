import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BackgroundPaths } from './ui/background-paths';

export function HeroSection() {
  return (
    <BackgroundPaths
      className="min-h-[28rem] md:min-h-[36rem] h-auto w-full overflow-hidden"
      svgClassName="translate-x-[4%] sm:translate-x-[6%] md:translate-x-[8%] lg:translate-x-[10%]"
      svgOptions={{ duration: 33 }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="max-w-xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4 sm:mb-6 leading-tight">
            DePIN: Your Gateway into Decentralized Infrastructure
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
            BNB DePIN is a Decentralized Physical Infrastructure Network built on BNB Smart Chain.
            Turn your PC into a crypto-earning node by running BNB Chain infrastructure. Instead of
            centralized entities running all the nodes, you can run BSC or opBNB nodes and earn rewards
            through automatic verification. Every node you operate strengthens the BNB ecosystem while
            earning you points based on uptime and successful verifications.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/how-it-works"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 sm:px-6 py-2.5 sm:py-3 rounded hover:opacity-90 transition-opacity text-sm sm:text-base font-medium"
            >
              Read the operator guide
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 border border-primary/50 text-foreground px-5 sm:px-6 py-2.5 sm:py-3 rounded hover:bg-primary/10 transition-colors text-sm sm:text-base font-medium"
            >
              Register a node
            </Link>
          </div>
        </div>
      </div>
    </BackgroundPaths>
  );
}
