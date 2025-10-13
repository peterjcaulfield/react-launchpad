import { useCallback, useState } from "react";

export function useControllable<T>({
  value,
  defaultValue,
  onChange,
}: {
  value: T | undefined;
  defaultValue: T;
  onChange?: (v: T) => void;
}) {
  const [uncontrolled, setUncontrolled] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as T) : uncontrolled;

  const set = useCallback((next: T | ((prev: T) => T)) => {
    if (isControlled) {
      const nextValue = typeof next === "function" ? (next as (p: T) => T)(current) : next;
      onChange?.(nextValue);
    } else {
      setUncontrolled(next as T | ((p: T) => T));
    }
  }, [isControlled, onChange, current]);

  return [current, set, isControlled] as const;
}

