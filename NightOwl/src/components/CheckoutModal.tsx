import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const [email, setEmail] = useState('');
  const [movieId, setMovieId] = useState('neon-midnight');
  const [cardNumber, setCardNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{
    title: string;
    message: string;
  } | null>(null);

  const movies = [
    { id: 'neon-midnight', name: 'Neon Midnight - 11:45 PM' },
    { id: 'dark-horizon', name: 'Dark Horizon - 12:00 AM' },
    { id: 'after-hours', name: 'After Hours - 11:30 PM' },
    { id: 'silent-dreams', name: 'Silent Dreams - 12:15 AM' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          movieId,
          price: 24,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError({
          title: 'Checkout error',
          message: `We were unable to complete your order due to an internal error in the ${data.service || 'checkout service'}. Please try again later or contact support.`,
        });
      } else {
        onClose();
        setEmail('');
        setCardNumber('');
      }
    } catch (err) {
      setError({
        title: 'Connection error',
        message: 'Unable to connect to the checkout service. Please check your connection and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md border border-gray-800">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Checkout</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-500 mb-1">
                    {error.title}
                  </h3>
                  <p className="text-sm text-red-400">{error.message}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Movie
            </label>
            <select
              value={movieId}
              onChange={(e) => setMovieId(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Card number
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
              maxLength={19}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="4242 4242 4242 4242"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-900 disabled:text-gray-500 font-semibold rounded-lg transition-colors"
          >
            {isLoading ? 'Processing...' : 'Pay $24'}
          </button>
        </form>
      </div>
    </div>
  );
}
