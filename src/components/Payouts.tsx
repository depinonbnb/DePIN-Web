import { useEffect, useState } from 'react';
import { ArrowUpRight, ExternalLink, Send } from 'lucide-react';
import { getVaultPayouts, type Payout } from '../lib/api';
import { REWARD_VAULT_ADDRESS } from '../lib/contracts';

function truncate(addr: string): string {
  if (!addr || addr.length < 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

// Live feed of outgoing transfers from the rewards vault, shown as payouts to
// node operators. Verifiable on BscScan — every row links to its tx.
export function Payouts() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      getVaultPayouts(12).then((p) => {
        if (!cancelled) {
          setPayouts(p);
          setLoaded(true);
        }
      });
    load();
    const id = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <section className="mx-4 sm:mx-6 lg:mx-10 my-8 sm:my-12">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <Send className="w-5 h-5 text-accent" />
        <h2 className="text-foreground m-0">Payouts to Node Operators</h2>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {!loaded ? (
          <div className="p-6 animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-6 bg-muted rounded" />
            ))}
          </div>
        ) : payouts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No payouts yet — the pool is still filling. Every payout will show up here, live and
            verifiable on-chain.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {payouts.map((p) => (
              <a
                key={p.hash}
                href={`https://bscscan.com/tx/${p.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <ArrowUpRight className="w-4 h-4 text-accent flex-shrink-0" />
                  <span className="font-mono text-sm sm:text-base text-foreground truncate">
                    {truncate(p.to)}
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {timeAgo(p.timestamp)}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm sm:text-base text-accent font-medium">{p.valueBnb} BNB</span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      <a
        href={`https://bscscan.com/address/${REWARD_VAULT_ADDRESS}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mt-4"
      >
        See all vault activity on BscScan <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </section>
  );
}
