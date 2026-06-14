import { useState, useEffect, useRef } from "react";
import { KONAMI_CODE } from "@/data/portfolio";

export function useKonamiCode() {
  const [triggered, setTriggered] = useState(false);
  const inputRef = useRef<string[]>([]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      inputRef.current.push(e.key);
      inputRef.current = inputRef.current.slice(-10);
      if (inputRef.current.join(",") === KONAMI_CODE.join(",")) {
        setTriggered(true);
        setTimeout(() => setTriggered(false), 3000);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return triggered;
}
