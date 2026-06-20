import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AppHeader } from './components/AppHeader';
import Footer from './components/Footer';
import { Splash } from './pages/Splash';
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

// Layout for the node-hosting section (header + footer chrome).
function NodeLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Top-level chooser */}
        <Route path="/" element={<Splash />} />

        {/* Node-hosting section under its own chrome */}
        <Route element={<NodeLayout />}>
          <Route path="/bnbnode" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/nodes" element={<Nodes />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/earn" element={<Earn />} />
          <Route path="/requirements" element={<Requirements />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/explorer" element={<Explorer />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}
