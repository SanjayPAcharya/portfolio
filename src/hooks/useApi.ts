import { useState } from 'react';

const baseURL = 'https://api.sanjaykumarp.info/';

export function useApi<TData = unknown, TPayload = unknown>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [data, setData] = useState<TData | null>(null);

  async function post(route: string, payload: TPayload): Promise<TData> {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await fetch(baseURL + route, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('API request failed');
      }
      const result: TData = await response.json();
      setData(result);
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { post, loading, error, data };
}
