import { Search, Armchair, CreditCard } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: 'Browse showtimes',
      description: 'Find the perfect late-night movie showing near you',
    },
    {
      icon: Armchair,
      title: 'Pick seats',
      description: 'Choose your ideal seats from our interactive seat map',
    },
    {
      icon: CreditCard,
      title: 'Pay securely',
      description: 'Complete your purchase with our secure payment system',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 bg-gray-950">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
          How NightOwl Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="bg-gray-900 rounded-xl p-8 border border-gray-800 hover:border-amber-500/50 transition-all"
              >
                <div className="w-14 h-14 bg-amber-500/10 rounded-lg flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-amber-500" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
