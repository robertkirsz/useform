import { useEffect, useRef } from 'react';

export default function usePrevious(value) {
  const ref = useRef();

  const storeRef = () => {
    ref.current = value;
  };

  useEffect(storeRef);

  return ref.current;
}
