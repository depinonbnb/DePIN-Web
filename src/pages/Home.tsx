import { HeroSection } from '../components/HeroSection';
import { NoticeBanner } from '../components/NoticeBanner';
import { GetStarted } from '../components/GetStarted';
import { NetworkStats } from '../components/NetworkStats';

export function Home() {
  return (
    <>
      <HeroSection />
      <NoticeBanner />
      <NetworkStats />
      <GetStarted />
    </>
  );
}

