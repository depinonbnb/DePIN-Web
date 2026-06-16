import { HeroSection } from '../components/HeroSection';
import { NoticeBanner } from '../components/NoticeBanner';
import { GetStarted } from '../components/GetStarted';
import { NetworkStats } from '../components/NetworkStats';
import { RewardPool } from '../components/RewardPool';
import { Payouts } from '../components/Payouts';

export function Home() {
  return (
    <>
      <HeroSection />
      <NoticeBanner />
      <RewardPool />
      <Payouts />
      <NetworkStats />
      <GetStarted />
    </>
  );
}

