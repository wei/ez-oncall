import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function DevOpsPanel() {
  const [isTriggering, setIsTriggering] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleHardCrash = async () => {
    setIsTriggering(true);
    setResult(null);

    try {
      await fetch('http://localhost:3001/api/checkout-hard-crash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      setResult('Request sent - backend should crash');
    } catch (err) {
      setResult('Backend crashed successfully (connection failed as expected)');
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <section className="py-16 px-4 bg-gray-950 border-t border-gray-800">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-gray-900 border-2 border-amber-500/30 rounded-lg p-6">
          <div className="flex items-start gap-4 mb-6">
            <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                For DevOps
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                This environment is wired so the Checkout Service can fail under load.
                It's used to demo EZ OnCall, a voice-first DevOps agent that responds to
                production incidents via phone calls.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-300 mb-1">
                  Testing & Monitoring
                </p>
                <p className="text-xs text-gray-500">
                  Trigger a fatal backend crash for error monitoring tools
                </p>
              </div>
            </div>

            <button
              onClick={handleHardCrash}
              disabled={isTriggering}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-sm"
            >
              {isTriggering ? 'Triggering crash...' : 'Trigger hard checkout crash'}
            </button>

            {result && (
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded text-sm text-amber-400">
                {result}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
