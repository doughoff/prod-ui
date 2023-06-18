import React from 'react';

function useDebouncedEffect(
  effect: () => void,
  delay: number,
  deps: React.DependencyList
) {
  const timeoutIdRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (timeoutIdRef.current !== null) {
      clearTimeout(timeoutIdRef.current);
    }
    timeoutIdRef.current = setTimeout(effect, delay);

    return () => {
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, deps);
}

export default useDebouncedEffect;
