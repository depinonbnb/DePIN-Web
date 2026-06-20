import { Server, Sparkles, ArrowRight } from 'lucide-react';

// The node-hosting site lives on its own subdomain in production; in local dev
// it's reachable at the /bnbnode path of this same app.
const NODE_HOSTING_URL = import.meta.env.DEV ? '/bnbnode' : 'https://bnbnode.depinonbnb.com';

export function Splash() {
  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col">
      {/* subtle backdrop */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(240,185,11,0.10),transparent_70%)]" />

      <div className="relative flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12">
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-primary text-2xl sm:text-3xl font-semibold tracking-tight">DePIN</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-semibold text-foreground mb-3">
            Pick your network
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Two decentralized infrastructure networks on BNB Chain. Contribute real hardware, earn real
            rewards. Choose where you want to start.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 w-full max-w-4xl">
          {/* Node hosting */}
          <a
            href={NODE_HOSTING_URL}
            className="group relative rounded-2xl border border-border bg-card/60 backdrop-blur p-6 sm:p-8 flex flex-col transition-all hover:border-primary/60 hover:bg-card"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-5">
              <Server className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">BNB Node Hosting</h2>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              Get paid to run BNB Chain nodes. Strengthen the network's access layer with your own
              hardware and earn rewards for verified uptime. The decentralization the chain actually
              needs, funded by its own activity.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
              Enter node hosting <ArrowRight className="w-4 h-4" />
            </span>
          </a>

          {/* AI / Plexus — not live yet */}
          <div className="relative rounded-2xl border border-border bg-card/40 backdrop-blur p-6 sm:p-8 flex flex-col">
            <span className="absolute top-4 right-4 text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#8b5cf6]/15 text-[#a78bfa] border border-[#8b5cf6]/30">
              Coming soon
            </span>
            <div className="w-12 h-12 rounded-xl bg-[#8b5cf6]/15 flex items-center justify-center mb-5">
              <Sparkles className="w-6 h-6 text-[#a78bfa]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">DePIN for AI — Plexus</h2>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              AI you can't be locked out of. Run any model through a compatible API with no account gate,
              no prompt logging, and no censorship. The GPUs are contributed by a crowd, not rented from a
              datacenter, and everyone earns in $PLEX on BNB Chain.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-muted-foreground font-medium">
              Launching soon
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground/70 mt-10">Built on BNB Chain</p>
      </div>
    </div>
  );
}
