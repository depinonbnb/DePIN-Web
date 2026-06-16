import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Coins, ExternalLink } from 'lucide-react';
import { REWARD_VAULT_ADDRESS, BSC_MAINNET } from '../lib/contracts';

// Live BNB balance of the public rewards vault. The trading tax collects here
// and is split among active node operators — reading it straight off-chain so
// anyone can verify the pool size themselves.
export function RewardPool() {
  const [bnb, setBnb] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(BSC_MAINNET.rpcUrls[0]);
        const bal = await provider.getBalance(REWARD_VAULT_ADDRESS);
        if (!cancelled) {
          setBnb(parseFloat(ethers.formatEther(bal)).toLocaleString(undefined, { maximumFractionDigits: 4 }));
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    };

    load();
    // refresh every 60s so the pool updates live while someone watches
    const id = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <section className="mx-4 sm:mx-6 lg:mx-10 my-8 sm:my-12">
      <div className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 rounded-lg p-6 sm:p-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Coins className="w-5 h-5 text-primary" />
          <h2 className="text-foreground m-0">Reward Pool</h2>
        </div>
        <p className="text-muted-foreground text-sm sm:text-base mb-5">
          A share of this pool is up for grabs by active node operators. It&apos;s funded by the
          trading tax and paid out to nodes that stay synced and pass verification — the more you
          contribute, the bigger your slice.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4">
          <div className="text-4xl sm:text-5xl font-semibold text-foreground tabular-nums">
            {error ? '—' : bnb === null ? '…' : bnb}
            <span className="text-xl sm:text-2xl text-muted-foreground ml-2">BNB</span>
          </div>
        </div>

        <a
          href={`https://bscscan.com/address/${REWARD_VAULT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mt-4"
        >
          Verify the vault on BscScan <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
}
