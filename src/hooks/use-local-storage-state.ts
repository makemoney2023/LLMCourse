"use client";

import { useEffect, useState } from "react";

/**
 * JSON-serialized state persisted under a localStorage key.
 * Returns [value, setAndPersist, loaded] — `loaded` flips true after the
 * stored value (if any) has been read on the client.
 */
export function useLocalStorageState<T>(
  key: string,
  initial: T,
): [T, (next: T) => void, boolean] {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(key);
    if (raw != null) {
      try {
        setValue(JSON.parse(raw) as T);
      } catch {
        // Ignore corrupt entries; keep the initial value.
      }
    }
    setLoaded(true);
  }, [key]);

  const update = (next: T) => {
    setValue(next);
    window.localStorage.setItem(key, JSON.stringify(next));
  };

  return [value, update, loaded];
}
