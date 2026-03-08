import { useEffect, useRef, useState } from "react";

export default function useReelSwipe(count) {
  const [active, setActive] = useState(0);
  const lockRef = useRef(false);
  const startY = useRef(0);
  const deltaY = useRef(0);

  const clamp = (n) => Math.max(0, Math.min(count - 1, n));

  const go = (next) => {
    if (count <= 0) return;
    if (lockRef.current) return;
    lockRef.current = true;
    setActive(clamp(next));
    setTimeout(() => (lockRef.current = false), 420);
  };

  const onWheel = (e) => {
    if (Math.abs(e.deltaY) < 10) return;
    if (e.deltaY > 0) go(active + 1);
    else go(active - 1);
  };

  const onTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    deltaY.current = 0;
  };

  const onTouchMove = (e) => {
    deltaY.current = e.touches[0].clientY - startY.current;
  };

  const onTouchEnd = () => {
    if (deltaY.current < -60) go(active + 1);
    if (deltaY.current > 60) go(active - 1);
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "ArrowDown") go(active + 1);
      if (e.key === "ArrowUp") go(active - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, count]);

  return { active, setActive, onWheel, onTouchStart, onTouchMove, onTouchEnd };
}