import { useState } from 'react';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.sanjaykumarp.info/';

export function useApi<TData = unknown, TPayload = unknown>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [data, setData] = useState<TData | null>(null);

  async function get(
    route: string,
    customHeaders?: Record<string, string>
  ): Promise<TData> {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Check if route is a full URL or a path
      const url = route.startsWith('http') ? route : baseURL + route;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...customHeaders, // Merge custom headers
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || 'API request failed'}`);
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

  async function post(
    route: string,
    payload: TPayload,
    customHeaders?: Record<string, string>
  ): Promise<TData> {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Check if route is a full URL or a path
      const url = route.startsWith('http') ? route : baseURL + route;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...customHeaders, // Merge custom headers
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || 'API request failed'}`);
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

  async function put(
    route: string,
    payload: TPayload,
    customHeaders?: Record<string, string>
  ): Promise<TData> {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Check if route is a full URL or a path
      const url = route.startsWith('http') ? route : baseURL + route;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...customHeaders,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || 'API request failed'}`);
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

  async function del(
    route: string,
    customHeaders?: Record<string, string>
  ): Promise<TData> {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Check if route is a full URL or a path
      const url = route.startsWith('http') ? route : baseURL + route;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...customHeaders,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || 'API request failed'}`);
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

  function reset() {
    setLoading(false);
    setError(null);
    setData(null);
  }

  return {
    get,
    post,
    put,
    del,
    reset,
    loading,
    error,
    data
  };
}