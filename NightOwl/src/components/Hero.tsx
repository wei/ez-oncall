import { Moon } from 'lucide-react';

interface HeroProps {
  onCheckoutClick: () => void;
}

export default function Hero({ onCheckoutClick }: HeroProps) {
  return (
    <section id="home" className="relative py-20 md:py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950"></div>

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Moon className="w-16 h-16 text-amber-500" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Book late-night movie tickets in seconds.
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Skip the box office. Find seats, pay, and walk in.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onCheckoutClick}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-amber-500/20"
            >
              Try Checkout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
