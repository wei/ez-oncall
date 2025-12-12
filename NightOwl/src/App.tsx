import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import FeaturedShows from './components/FeaturedShows';
import DevOpsPanel from './components/DevOpsPanel';
import Footer from './components/Footer';
import CheckoutModal from './components/CheckoutModal';

function App() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <Hero onCheckoutClick={() => setIsCheckoutOpen(true)} />
      <HowItWorks />
      <FeaturedShows />
      <DevOpsPanel />
      <Footer />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
}

export default App;
