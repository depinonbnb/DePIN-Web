import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full px-10 py-6 flex items-center justify-between border-b border-border">
      <Link to="/" className="text-foreground text-2xl hover:text-primary transition-colors">
        DePIN
      </Link>
      <nav className="flex items-center gap-8">
        <Link 
          to="/dashboard" 
          className={`transition-colors ${
            isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Dashboard
        </Link>
        <Link 
          to="/nodes" 
          className={`transition-colors ${
            isActive('/nodes') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Nodes
        </Link>
        <Link 
          to="/leaderboard" 
          className={`transition-colors ${
            isActive('/leaderboard') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Leaderboard
        </Link>
        <Link 
          to="/register" 
          className={`transition-colors ${
            isActive('/register') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Register
        </Link>
      </nav>
    </header>
  );
}

