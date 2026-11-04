import { AbsoluteFill, random, useCurrentFrame } from "remotion";

// Code-built futuristic city backdrop: neon skyline, glowing windows, moving grid floor.
export const DigitalCity: React.FC = () => {
  const frame = useCurrentFrame();
  const towers = new Array(26).fill(0).map((_, i) => ({
    x: i * 44 - 30 + random(`dx${i}`) * 20,
    w: 34 + random(`dw${i}`) * 40,
    h: 180 + random(`dh${i}`) * 420,
    c: random(`dc${i}`) < 0.5 ? "#5CC8FF" : "#C06CFF",
  }));
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #070320 0%, #1B0B4D 45%, #3A1270 62%, #0B1E4D 100%)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -200, right: -200, top: 560, height: 160, background: "radial-gradient(ellipse, rgba(255,80,200,0.55), transparent 70%)", filter: "blur(20px)" }} />
      <svg width={1080} height={1080} style={{ position: "absolute", inset: 0 }}>
        {towers.map((t, i) => (
          <g key={i}>
            <rect x={t.x} y={680 - t.h} width={t.w} height={t.h} fill="#0A0626" stroke={t.c} strokeOpacity={0.7} strokeWidth={1.5} />
            {new Array(Math.floor(t.h / 22)).fill(0).map((_, r) =>
              [0, 1, 2].map((c) =>
                random(`w${i}-${r}-${c}`) < 0.45 ? (
                  <rect
                    key={`${r}-${c}`}
                    x={t.x + 5 + c * ((t.w - 10) / 3)}
                    y={680 - t.h + 8 + r * 22}
                    width={(t.w - 18) / 3}
                    height={8}
                    fill={t.c}
                    opacity={0.35 + 0.5 * Math.abs(Math.sin(frame * 0.05 + i + r))}
                  />
                ) : null,
              ),
            )}
          </g>
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          left: -800,
          right: -800,
          top: 680,
          height: 800,
          transform: "perspective(600px) rotateX(70deg)",
          transformOrigin: "top",
          backgroundImage:
            "linear-gradient(rgba(92,200,255,0.7) 2px, transparent 2px), linear-gradient(90deg, rgba(192,108,255,0.7) 2px, transparent 2px)",
          backgroundSize: "90px 90px",
          backgroundPosition: `0 ${frame * 4}px`,
        }}
      />
    </AbsoluteFill>
  );
};
