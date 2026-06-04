import { Link, useLocation } from 'react-router-dom';
import { Globe, Menu, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from './ui/sheet';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
];

export function AppHeader() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  const changeLanguage = (langCode: string) => {
    // Store selected language
    localStorage.setItem('selectedLang', langCode);

    // Clear ALL googtrans cookies aggressively
    const clearAllCookies = () => {
      // Get all possible domain variations
      const hostname = window.location.hostname;
      const domainParts = hostname.split('.');
      const domains = ['', hostname];

      // Add parent domains (e.g., .vercel.app, .bnb-depin.site)
      for (let i = 0; i < domainParts.length; i++) {
        domains.push('.' + domainParts.slice(i).join('.'));
      }

      domains.forEach(domain => {
        ['/', ''].forEach(path => {
          const expires = 'expires=Thu, 01 Jan 1970 00:00:00 UTC';
          const domainStr = domain ? `; domain=${domain}` : '';
          const pathStr = path ? `; path=${path}` : '';
          document.cookie = `googtrans=;${expires}${pathStr}${domainStr}`;
        });
      });
    };

    clearAllCookies();

    // Set the new language cookie for both root and current domain
    if (langCode !== 'en') {
      const hostname = window.location.hostname;
      // Set cookie for root path
      document.cookie = `googtrans=/en/${langCode}; path=/`;
      // Also set for the domain specifically
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=${hostname}`;
      // And with leading dot for subdomains
      if (hostname.includes('.')) {
        const rootDomain = hostname.split('.').slice(-2).join('.');
        document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${rootDomain}`;
      }
    }

    // Force a full page reload (not just navigation)
    window.location.reload();
  };

  useEffect(() => {
    // Get language from localStorage (our source of truth)
    const savedLang = localStorage.getItem('selectedLang') || 'en';
    setCurrentLang(savedLang);

    const hostname = window.location.hostname;
    const rootDomain = hostname.includes('.') ? hostname.split('.').slice(-2).join('.') : hostname;

    // If English selected but page is translated, clear and reload
    if (savedLang === 'en') {
      const html = document.documentElement;
      if (html.classList.contains('translated-ltr') || html.classList.contains('translated-rtl')) {
        // Page is still translated, clear cookies
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname}`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${rootDomain}`;
        window.location.reload();
      }
    } else {
      // Non-English language selected, ensure cookie is set correctly
      const currentCookie = document.cookie;
      const expectedValue = `/en/${savedLang}`;
      if (!currentCookie.includes(`googtrans=${expectedValue}`)) {
        // Cookie doesn't match, set it correctly
        document.cookie = `googtrans=${expectedValue}; path=/`;
        document.cookie = `googtrans=${expectedValue}; path=/; domain=${hostname}`;
        document.cookie = `googtrans=${expectedValue}; path=/; domain=.${rootDomain}`;
      }
    }
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full bg-background border-b border-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8">
              <img 
                src="/assets/bnb-logo.ico" 
                alt="BNB DePIN" 
                className="w-full h-full object-contain drop-shadow-lg"
                style={{ imageRendering: 'crisp-edges' }}
              />
            </div>
            <span className="font-heading text-primary text-lg sm:text-xl font-semibold">BNB DePIN</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              to="/how-it-works"
              className={`transition-colors ${
                isActive('/how-it-works') || isActive('/requirements') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Guide
            </Link>
            <Link
              to="/nodes"
              className={`transition-colors ${
                isActive('/nodes') || isActive('/dashboard') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Nodes
            </Link>
            <Link
              to="/explorer"
              className={`transition-colors ${
                isActive('/explorer') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Explorer
            </Link>
            <Link
              to="/leaderboard"
              className={`transition-colors ${
                isActive('/leaderboard') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Leaderboard
            </Link>
            <Link
              to="/earn"
              className={`transition-colors ${
                isActive('/earn') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Earn
            </Link>
            <Link
              to="/register"
              className={`px-4 py-1.5 rounded-md transition-colors ${
                isActive('/register')
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground'
              }`}
            >
              Register
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden sm:flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                <Globe className="w-5 h-5" />
                <span className="text-sm">{LANGUAGES.find(l => l.code === currentLang)?.flag || '🌐'}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border min-w-[180px]">
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className="cursor-pointer flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </span>
                  {currentLang === lang.code && <Check className="w-4 h-4 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div id="google_translate_element" className="hidden"></div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden text-foreground">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card border-border w-[280px] sm:w-[350px]">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <SheetDescription className="sr-only">Site navigation links</SheetDescription>
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  to="/how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-colors ${
                    isActive('/how-it-works') || isActive('/requirements') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
                  }`}
                >
                  Guide
                </Link>
                <Link
                  to="/nodes"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-colors ${
                    isActive('/nodes') || isActive('/dashboard') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
                  }`}
                >
                  Nodes
                </Link>
                <Link
                  to="/explorer"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-colors ${
                    isActive('/explorer') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
                  }`}
                >
                  Explorer
                </Link>
                <Link
                  to="/leaderboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-colors ${
                    isActive('/leaderboard') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
                  }`}
                >
                  Leaderboard
                </Link>
                <Link
                  to="/earn"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-colors ${
                    isActive('/earn') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
                  }`}
                >
                  Earn
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-colors ${
                    isActive('/register') ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground'
                  }`}
                >
                  Register
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

