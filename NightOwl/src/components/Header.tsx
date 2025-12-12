import { Ticket } from 'lucide-react';

export default function Header() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-8 h-8 text-amber-500" />
            <span className="text-xl font-bold text-white">NightOwl Tickets</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              How it Works
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
