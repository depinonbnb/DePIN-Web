import heroImage from 'figma:asset/b1e9097f48bcc53db888335be4fdb5b90fcd8aba.png';

export function Hero() {
  return (
    <section className="relative w-full h-[400px] overflow-hidden mx-10 rounded-lg mt-6">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
      </div>
      <div className="relative z-10 h-full flex flex-col items-center justify-center">
        <h1 className="text-primary text-6xl text-center px-4 mb-4">
          Decentralized Infrastructure Network
        </h1>
        <p className="text-muted-foreground text-xl text-center px-4">
          Join the future of distributed computing
        </p>
      </div>
    </section>
  );
}

