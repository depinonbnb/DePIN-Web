import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Terminal, Copy, CheckCircle, ExternalLink, Wallet, Server, Cpu, ArrowRight } from 'lucide-react';

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) || 'https://api.depinonbnb.com/api';
const BACKEND_REPO = 'https://github.com/depinonbnb/DePIN';

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — ignore
    }
  };

  return (
    <div className="relative group">
      <pre className="bg-[#0d0d12] text-[#e0e0e0] rounded-lg p-4 pr-12 text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed whitespace-pre">
        {code}
      </pre>
      <button
        onClick={copy}
        className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Copy to clipboard"
      >
        {copied ? <CheckCircle className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}

function Step({
  number,
  icon: Icon,
  title,
  children,
}: {
  number: number;
  icon: typeof Terminal;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="bg-card border-border p-5 sm:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">STEP {number}</span>
          <h2 className="text-lg sm:text-xl text-foreground font-medium">{title}</h2>
        </div>
      </div>
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">{children}</div>
    </Card>
  );
}

export function Register() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl text-foreground mb-3">Run a Node &amp; Register</h1>
        <p className="text-muted-foreground mb-2 leading-relaxed">
          Everything happens from your terminal. Create a wallet, sync a BNB Chain node, then run the
          open-source prover — it registers your node automatically and starts earning. You never
          download anything from us to run the node itself; it&apos;s the official BNB Chain software.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Check the{' '}
          <Link to="/requirements" className="text-primary hover:underline">
            hardware requirements
          </Link>{' '}
          first, then work through the steps below.
        </p>

        <div className="space-y-5">
          <Step number={1} icon={Wallet} title="Create a BNB wallet">
            <p>
              BNB Chain is EVM-compatible, so any Ethereum-style keypair works. The quickest way from
              the terminal is Foundry&apos;s <span className="font-mono text-foreground">cast</span>:
            </p>
            <CodeBlock
              code={`# install foundry (one time)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# generate a fresh wallet
cast wallet new`}
            />
            <p>
              It prints an <span className="font-mono text-foreground">Address</span> and a{' '}
              <span className="font-mono text-foreground">Private key</span>. Save the private key
              somewhere safe — it controls your rewards and is what the prover uses to sign. Already
              have a wallet (e.g. MetaMask)? You can use its private key instead.
            </p>
          </Step>

          <Step number={2} icon={Server} title="Download &amp; run a BNB Chain node">
            <p>
              Run the official, open-source node software. Below is a minimal BSC full node exposing
              RPC on port 8545 — see the official docs for snapshots and full tuning.
            </p>
            <CodeBlock
              code={`# build the official BSC client
git clone https://github.com/bnb-chain/bsc
cd bsc && make geth

# grab the mainnet config, then start the node
# (RPC served on localhost:8545)
./build/bin/geth --config ./config.toml --datadir ./node-data \\
  --http --http.addr 127.0.0.1 --http.port 8545 \\
  --http.api eth,net,web3`}
            />
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href="https://github.com/bnb-chain/bsc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-primary hover:underline text-sm"
              >
                bnb-chain/bsc <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://docs.bnbchain.org/bnb-smart-chain/developers/node_operators/full_node/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-primary hover:underline text-sm"
              >
                BSC node docs <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://docs.bnbchain.org/bnb-opbnb/advanced/local-node/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-primary hover:underline text-sm"
              >
                opBNB node docs <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-xs">
              Let the node fully sync before registering — it has to answer challenges about real chain
              data.
            </p>
          </Step>

          <Step number={3} icon={Terminal} title="Register &amp; earn with the prover">
            <p>
              The prover signs a registration message with your wallet, registers your node, then
              automatically answers verification challenges every 5 minutes. Build it and point it at
              your node:
            </p>
            <CodeBlock
              code={`# build the open-source prover
git clone ${BACKEND_REPO}
cd DePIN && go build -o prover ./cmd/prover

# run it — registers your node, then proves uptime
./prover \\
  --private-key <YOUR_WALLET_PRIVATE_KEY> \\
  --node-rpc http://localhost:8545 \\
  --api ${API_BASE} \\
  --node-type bsc-full`}
            />
            <p>
              Prefer env vars? The prover also reads{' '}
              <span className="font-mono text-foreground">PROVER_PRIVATE_KEY</span>,{' '}
              <span className="font-mono text-foreground">NODE_RPC</span>,{' '}
              <span className="font-mono text-foreground">DEPIN_API</span>, and{' '}
              <span className="font-mono text-foreground">NODE_TYPE</span>.
            </p>
            <div className="bg-muted/40 border border-border rounded-lg p-4">
              <div className="text-foreground font-medium mb-2 text-sm">
                <Cpu className="w-4 h-4 inline mr-1.5 -mt-0.5 text-primary" />
                Node types (set with <span className="font-mono">--node-type</span>)
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                <li><span className="font-mono text-foreground">bsc-full</span> — BSC full node</li>
                <li><span className="font-mono text-foreground">bsc-fast</span> — BSC fast node</li>
                <li><span className="font-mono text-foreground">bsc-archive</span> — highest tier</li>
                <li><span className="font-mono text-foreground">opbnb-full</span> — opBNB full node</li>
                <li><span className="font-mono text-foreground">opbnb-fast</span> — opBNB fast node</li>
              </ul>
            </div>
            <p>
              Keep the prover running to keep earning. Your points accrue from uptime and passed
              challenges — track them in the{' '}
              <Link to="/explorer" className="text-primary hover:underline">
                explorer
              </Link>{' '}
              and{' '}
              <Link to="/leaderboard" className="text-primary hover:underline">
                leaderboard
              </Link>
              .
            </p>
          </Step>
        </div>

        <Card className="bg-primary/5 border-primary/20 p-5 sm:p-6 mt-6">
          <div className="flex items-start gap-3">
            <Terminal className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-foreground font-medium mb-1">Don&apos;t want to expose your node?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The prover path above never exposes your node to the internet — it polls challenges and
                answers them locally. That&apos;s the recommended setup. Advanced operators who&apos;d
                rather be probed directly can instead host a public RPC endpoint; see the{' '}
                <Link to="/how-it-works" className="text-primary hover:underline">
                  guide
                </Link>{' '}
                for the exposed-RPC method.
              </p>
            </div>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <a
            href={BACKEND_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded hover:opacity-90 transition-opacity text-sm font-medium"
          >
            View the source on GitHub <ExternalLink className="w-4 h-4" />
          </a>
          <Link to="/how-it-works">
            <Button variant="outline" className="w-full sm:w-auto">
              Read the full guide <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
