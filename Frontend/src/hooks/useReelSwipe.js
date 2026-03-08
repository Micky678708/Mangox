import { useEffect, useRef } from "react";
import useReelsSwipe from "../hooks/useReelsSwipe";export default function useReelSwipe({ onNext, onPrev, threshold = 50, cooldownMs = 450 }) {
  const startY = useRef(null);
  const locked = useRef(false);
  const wheelAcc = useRef(0);

  const lock = () => {
    locked.current = true;
    setTimeout(() => (locked.current = false), cooldownMs);
  };

  useEffect(() => {
    const onTouchStart = (e) => {
      if (locked.current) return;
      startY.current = e.touches?.[0]?.clientY ?? null;
    };

    const onTouchMove = (e) => {
      if (startY.current == null || locked.current) return;
      const y = e.touches?.[0]?.clientY ?? null;
      if (y == null) return;

      const diff = startY.current - y;

      if (diff > threshold) {
        lock();
        startY.current = null;
        onNext?.();
      } else if (diff < -threshold) {
        lock();
        startY.current = null;
        onPrev?.();
      }
    };

    const onTouchEnd = () => {
      startY.current = null;
    };

    const onWheel = (e) => {
      if (locked.current) return;
      wheelAcc.current += e.deltaY;

      if (wheelAcc.current > 120) {
        wheelAcc.current = 0;
        lock();
        onNext?.();
      } else if (wheelAcc.current < -120) {
        wheelAcc.current = 0;
        lock();
        onPrev?.();
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("wheel", onWheel);
    };
  }, [onNext, onPrev, threshold, cooldownMs]);
}