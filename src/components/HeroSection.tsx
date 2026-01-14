export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#181A20] via-[#1E2329] to-[#181A20]">
      {/* Geometric pattern background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 flex flex-col lg:flex-row items-center justify-between relative z-10 gap-8 lg:gap-0">
        <div className="max-w-xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4 sm:mb-6 leading-tight">
            DePIN: Your Gateway into Decentralized Infrastructure
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
            BNB DePIN is a Decentralized Physical Infrastructure Network built on BNB Smart Chain. 
            Turn your PC into a valuable node by sharing unused bandwidth and earn rewards. Help strengthen 
            the BNB ecosystem by providing decentralized infrastructure that powers real-world applications. 
            Every node you run contributes to a more robust, distributed network on BSC while earning you 
            points redeemable for BNB from collected transaction fees.
          </p>
          <button className="bg-primary text-primary-foreground px-5 sm:px-6 py-2.5 sm:py-3 rounded hover:opacity-90 transition-opacity text-sm sm:text-base font-medium">
            Learn more about the network
          </button>
        </div>

        <div className="relative w-full max-w-[500px] h-[300px] sm:h-[400px] hidden md:block">
          {/* 3D Card illustrations */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#0ECB81] to-[#0a9661] rounded-2xl transform rotate-6 shadow-2xl" />
          <div className="absolute top-20 right-32 w-32 h-32 bg-gradient-to-br from-[#2B3139] to-[#181A20] rounded-2xl transform -rotate-12 shadow-2xl border border-border" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-[#F0B90B] to-[#D9A50A] rounded-2xl transform rotate-3 shadow-2xl flex items-center justify-center">
            <div className="w-20 h-20 bg-[#1E2329] rounded-full" />
          </div>
          <div className="absolute bottom-0 right-0 w-56 h-72 bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground">9:41</span>
              <span className="text-xs text-muted-foreground">100%</span>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-primary rounded-full" />
                <span className="text-primary text-sm">DePIN Network</span>
              </div>
              <div className="text-xs text-muted-foreground">Network Status</div>
              <div className="text-foreground text-xl mt-1">Active</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}







