import { useState } from "react";

function useSet() {
  const [items, setItems] = useState<string[]>([]);

  return {
    add: (flag: string) =>
      setItems((state) => (items.includes(flag) ? state : [...state, flag])),
    remove: (flag: string) =>
      setItems((state) => state.filter((f) => f !== flag)),
    includes: (flag: string) => items.includes(flag),
  };
}

export default useSet;
