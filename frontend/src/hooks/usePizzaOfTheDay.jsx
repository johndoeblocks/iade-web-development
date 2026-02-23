import { useState, useEffect, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export default function usePizzaOfTheDay() {
  const [pizza, setPizza] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPizza = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_URL}/pizzas/pizza-of-the-day`, { signal });
      if (!res.ok) throw new Error('Erro ao carregar pizza do dia');

      const data = await res.json();
      setPizza(data);
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('usePizzaOfTheDay error:', err);
      setError(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchPizza(controller.signal);
    return () => controller.abort();
  }, [fetchPizza]);

  const refetch = useCallback(() => {
    const controller = new AbortController();
    fetchPizza(controller.signal);
    return () => controller.abort();
  }, [fetchPizza]);

  return { pizza, loading, error, refetch };
}
