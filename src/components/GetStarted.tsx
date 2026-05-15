import { UserPlus, Server, Download, TrendingUp } from 'lucide-react';

export function GetStarted() {
  const steps = [
    {
      number: 1,
      icon: UserPlus,
      title: 'Register Your Node',
      description: 'Connect your wallet and register your node type (BSC Full, BSC Archive, BSC Fast, opBNB Full, or opBNB Fast). Sign the registration with your wallet.',
    },
    {
      number: 2,
      icon: Server,
      title: 'Run Your BNB Node',
      description: 'Set up and run a BSC or opBNB node on your machine. Choose from full nodes, archive nodes, or lightweight fast nodes based on your hardware.',
    },
    {
      number: 3,
      icon: Download,
      title: 'Download Prover CLI',
      description: 'Install the prover software that connects to your local node. It automatically handles verification requests and submits signed responses.',
    },
    {
      number: 4,
      icon: TrendingUp,
      title: 'Prove & Earn',
      description: 'Your prover automatically verifies your node ownership by answering blockchain queries. Earn points based on successful verifications and uptime.',
    },
  ];

  return (
    <section className="w-full bg-background py-12 sm:py-16 lg:py-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl text-foreground mb-8 sm:mb-12 lg:mb-16">Get Started</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-4 sm:gap-6">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center">
                    <step.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-card border-2 border-background rounded-full flex items-center justify-center text-primary text-xs">
                    {step.number}
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-foreground text-base sm:text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile mockup on the right */}
        <div className="mt-12 sm:mt-16 flex justify-center lg:justify-end">
          <div className="w-56 h-80 sm:w-64 sm:h-96 bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground">9:41</span>
              <span className="text-xs text-muted-foreground">100%</span>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary rounded-full" />
                <span className="text-primary">DePIN</span>
              </div>
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">Total Nodes</div>
                  <div className="text-foreground text-2xl">12,458</div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">Your Points</div>
                  <div className="text-accent text-2xl">245,000</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Uptime</div>
                    <div className="text-foreground">99.9%</div>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Rank</div>
                    <div className="text-primary">#42</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

