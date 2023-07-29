import { useEffect, useRef } from 'react';

function useInterval(callback: () => void, delay: number | null = null) {
  const savedCallback = useRef<() => void>();
  const savedDelay = useRef<number | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
    savedDelay.current = delay;
  }, [callback, delay]);

  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    if (savedDelay.current !== null) {
      const id = setInterval(tick, savedDelay.current);
      return () => clearInterval(id);
    }
  }, []);
}

export default useInterval;