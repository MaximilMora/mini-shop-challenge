import { useCallback, useState } from 'react';

/**
 * Wraps an async action with its own pending and error state.
 * Every caller gets an independent pair, so only the button that fired the
 * request is disabled and its error shows up next to it.
 */
export function useAsyncAction(action) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(async (...args) => {
    setPending(true);
    setError(null);
    try {
      await action(...args);
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  }, [action]);

  return { run, pending, error };
}
