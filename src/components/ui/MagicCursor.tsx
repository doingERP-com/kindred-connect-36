import { useEffect, useRef, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  createdAt: number;
}

// Detect touch-only devices (no mouse)
const isTouchDevice = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: none) and (pointer: coarse)").matches;

export function MagicCursor() {
  if (isTouchDevice()) return null;
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState<Particle[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const counterRef = useRef(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      setPos({ x, y });

      // Add particle
      counterRef.current += 1;
      const id = counterRef.current;
      setTrail(prev => [
        ...prev.slice(-18),
        { id, x, y, size: Math.random() * 6 + 3, opacity: 1, createdAt: Date.now() },
      ]);
    };

    const handleOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setIsHovering(
        el.tagName === "A" ||
        el.tagName === "BUTTON" ||
        el.closest("a") !== null ||
        el.closest("button") !== null
      );
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Fade out old particles
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTrail(prev => prev.filter(p => now - p.createdAt < 600));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hide default cursor globally */}
      <style>{`* { cursor: none !important; }`}</style>

      {/* Trail particles */}
      {trail.map((p, i) => {
        const age = (Date.now() - p.createdAt) / 600;
        const opacity = Math.max(0, 1 - age) * (i / trail.length) * 0.8;
        return (
          <div
            key={p.id}
            className="pointer-events-none fixed z-[9998]"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              background: `hsl(5 91% 52% / ${opacity})`,
              boxShadow: `0 0 ${p.size * 2}px hsl(5 91% 52% / ${opacity * 0.6})`,
              transition: "opacity 0.1s",
            }}
          />
        );
      })}

      {/* Outer ring */}
      <div
        className="pointer-events-none fixed z-[9999]"
        style={{
          left: pos.x,
          top: pos.y,
          width: isHovering ? 44 : 32,
          height: isHovering ? 44 : 32,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: "1.5px solid hsl(5 91% 52% / 0.6)",
          boxShadow: "0 0 12px hsl(5 91% 52% / 0.3)",
          transition: "width 0.2s ease, height 0.2s ease",
        }}
      />

      {/* Inner dot */}
      <div
        className="pointer-events-none fixed z-[9999]"
        style={{
          left: pos.x,
          top: pos.y,
          width: isHovering ? 6 : 8,
          height: isHovering ? 6 : 8,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: "hsl(5 91% 52%)",
          boxShadow: "0 0 8px hsl(5 91% 52% / 0.8), 0 0 20px hsl(5 91% 52% / 0.4)",
          transition: "width 0.15s ease, height 0.15s ease",
        }}
      />
    </>
  );
}
