import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';

function Company() {
  return (
    <Link to="/" className="content-stretch flex gap-3 items-center relative shrink-0 hover:opacity-80 transition-opacity" data-name="Company">
      <div className="relative shrink-0 size-10">
        <img 
          src="/assets/bnb-logo.ico" 
          alt="BNB DePIN" 
          className="w-full h-full object-contain drop-shadow-lg"
          style={{ imageRendering: 'crisp-edges' }}
        />
      </div>
      <div className="flex flex-col font-semibold justify-center leading-none relative shrink-0 text-xl text-foreground text-nowrap">
        <p className="whitespace-pre">BNB DePIN</p>
      </div>
    </Link>
  );
}

function Nav() {
  return (
    <nav className="box-border content-stretch flex flex-wrap justify-center md:flex-nowrap font-medium gap-x-6 gap-y-3 md:gap-8 items-start leading-none overflow-visible p-0 relative shrink-0 text-base text-muted-foreground text-nowrap" data-name="Nav">
      <Link to="/" className="flex flex-col justify-center relative shrink-0 hover:text-primary transition-colors">
        <p className="whitespace-pre">Home</p>
      </Link>
      <Link to="/dashboard" className="flex flex-col justify-center relative shrink-0 hover:text-primary transition-colors">
        <p className="whitespace-pre">Dashboard</p>
      </Link>
      <Link to="/register" className="flex flex-col justify-center relative shrink-0 hover:text-primary transition-colors">
        <p className="whitespace-pre">Register</p>
      </Link>
      <Link to="/earn" className="flex flex-col justify-center relative shrink-0 hover:text-primary transition-colors">
        <p className="whitespace-pre">Earn</p>
      </Link>
      <Link to="/leaderboard" className="flex flex-col justify-center relative shrink-0 hover:text-primary transition-colors">
        <p className="whitespace-pre">Leaderboard</p>
      </Link>
      <Link to="/requirements" className="flex flex-col justify-center relative shrink-0 hover:text-primary transition-colors">
        <p className="whitespace-pre">Requirements</p>
      </Link>
      <Link to="/how-it-works" className="flex flex-col justify-center relative shrink-0 hover:text-primary transition-colors">
        <p className="whitespace-pre">How It Works</p>
      </Link>
    </nav>
  );
}

function Text() {
  return (
    <div className="content-stretch flex flex-col md:flex-row gap-6 md:gap-12 items-center justify-center relative shrink-0" data-name="Text">
      <Company />
      <Nav />
    </div>
  );
}

function SocialLinks() {
  return (
    <nav className="box-border content-stretch flex gap-6 items-center overflow-visible p-0 relative shrink-0" data-name="Social links">
      <a 
        href="https://x.com/DePINonBNB" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block relative shrink-0 size-6 text-muted-foreground hover:text-primary transition-colors"
        aria-label="X (Twitter)"
      >
        <svg className="size-full" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
      <a 
        href="https://github.com/depinonbnb/DePIN" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block relative shrink-0 size-6 text-muted-foreground hover:text-primary transition-colors"
        aria-label="GitHub"
      >
        <Github className="size-full" />
      </a>
    </nav>
  );
}

function Copyright() {
  return (
    <div className="text-sm text-muted-foreground">
      <p>© 2025-2026 BNB DePIN. Built on BNB Smart Chain.</p>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative w-full bg-card border-t border-border mt-auto" data-name="Footer">
      <div className="flex flex-col items-center w-full">
        {/* Main Footer Content */}
        <div className="box-border content-stretch flex flex-col md:flex-row gap-6 md:gap-0 items-center justify-between px-6 sm:px-10 lg:px-16 py-8 relative w-full max-w-7xl mx-auto">
          <Text />
          <SocialLinks />
        </div>
        
        {/* Copyright Section */}
        <div className="w-full border-t border-border/50">
          <div className="flex items-center justify-center text-center px-6 sm:px-10 lg:px-16 py-4 max-w-7xl mx-auto">
            <Copyright />
          </div>
        </div>
      </div>
    </footer>
  );
}

