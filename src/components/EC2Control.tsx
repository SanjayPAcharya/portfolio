import { useState } from 'react';

interface EC2Response {
  message: string;
  state: string;
  instance_id: string;
  public_ip?: string;
  client_url?: string;
  api_url?: string;
  note?: string;
  domains_updated?: string[];
  error?: string;
}

const EC2Control = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<EC2Response | null>(null);
  const [error, setError] = useState<string>('');
  const [responseType, setResponseType] = useState<'success' | 'error' | 'loading' | ''>('');

  // Replace these with your actual endpoints / secret
  const START_URL = 'https://jgcyebh6q74ypknshfv3f7ow2e0meijx.lambda-url.us-east-1.on.aws/';
  const STOP_URL = 'https://yc5v7z2sf2hmoh2uybzwh3afr40ubepl.lambda-url.us-east-1.on.aws/';
  const SECRET_KEY = 'a7b3c9d2e5f1g8h4i6j0k2l5m9n3p7q1r4s8t2u6v0w3x7y1z5';

  const handleStart = async () => {
    setLoading(true);
    setResponseType('loading');
    setError('⏳ Starting EC2 instance... This may take 1-2 minutes.');
    setResponse(null);

    try {
      const res = await fetch(START_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-custom-auth': SECRET_KEY,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data: EC2Response = await res.json();

      setResponseType('success');
      setError('');
      setResponse(data);
    } catch (err: unknown) {
      setResponseType('error');
      setError(`❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setResponse(null);
      // Keep console for debugging
      // eslint-disable-next-line no-console
      console.error('Start error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    const confirmed = window.confirm(
      '⚠️ Stop EC2 instance?\n\nYour applications will become unavailable until you start it again.'
    );

    if (!confirmed) return;

    setLoading(true);
    setResponseType('loading');
    setError('⏳ Stopping EC2 instance...');
    setResponse(null);

    try {
      const res = await fetch(STOP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-custom-auth': SECRET_KEY,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data: EC2Response = await res.json();

      setResponseType('success');
      setError('');
      setResponse(data);
    } catch (err: unknown) {
      setResponseType('error');
      setError(`❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setResponse(null);
      // eslint-disable-next-line no-console
      console.error('Stop error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🖥️ EC2 Control Panel</h1>
          <p className="text-gray-600 text-sm">Manage your EC2 instance</p>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={handleStart}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 uppercase tracking-wide"
          >
            <span className="text-xl">▶️</span>
            {loading && responseType === 'loading' && error.includes('Starting') ? 'Starting...' : 'Start EC2'}
          </button>

          <button
            onClick={handleStop}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 uppercase tracking-wide"
          >
            <span className="text-xl">⏹️</span>
            {loading && responseType === 'loading' && error.includes('Stopping') ? 'Stopping...' : 'Stop EC2'}
          </button>
        </div>

        {(error || response) && (
          <div
            className={`rounded-xl p-6 min-h-[120px] font-mono text-sm leading-relaxed ${
              responseType === 'loading'
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500 animate-pulse'
                : responseType === 'success'
                ? 'bg-green-50 text-green-700 border-l-4 border-green-500'
                : responseType === 'error'
                ? 'bg-red-50 text-red-700 border-l-4 border-red-500'
                : 'bg-gray-50 text-gray-700'
            }`}
          >
            {error && <div className="whitespace-pre-line">{error}</div>}

            {response && (
              <div className="space-y-3">
                <div className="font-bold text-base">✅ {response.message}</div>

                <div className="space-y-1">
                  <div>
                    <span className="font-semibold">Instance ID:</span> {response.instance_id}
                  </div>
                  {response.public_ip && (
                    <div>
                      <span className="font-semibold">Public IP:</span> {response.public_ip}
                    </div>
                  )}
                  <div>
                    <span className="font-semibold">State:</span>{' '}
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-800 text-xs font-semibold">
                      {response.state}
                    </span>
                  </div>
                </div>

                {response.note && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg text-blue-700 text-xs">⏰ {response.note}</div>
                )}

                {(response.client_url || response.api_url) && (
                  <div className="mt-4 space-y-2">
                    {response.client_url && (
                      <a
                        href={response.client_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                      >
                        🌐 Open Client Application →
                      </a>
                    )}
                    {response.api_url && (
                      <a
                        href={response.api_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                      >
                        🔗 Open API Endpoint →
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!error && !response && (
          <div className="rounded-xl p-6 bg-gray-50 text-gray-600 text-center min-h-[120px] flex items-center justify-center">
            Ready to manage your EC2 instance.
          </div>
        )}
      </div>
    </div>
  );
};

export default EC2Control;
