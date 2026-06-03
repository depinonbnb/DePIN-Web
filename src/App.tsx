import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppHeader } from './components/AppHeader';
import Footer from './components/Footer';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { Register } from './pages/Register';
import { Earn } from './pages/Earn';
import { Requirements } from './pages/Requirements';
import { HowItWorks } from './pages/HowItWorks';
import { Nodes } from './pages/Nodes';
import { Explorer } from './pages/Explorer';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <AppHeader />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/nodes" element={<Nodes />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/earn" element={<Earn />} />
            <Route path="/requirements" element={<Requirements />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/explorer" element={<Explorer />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

