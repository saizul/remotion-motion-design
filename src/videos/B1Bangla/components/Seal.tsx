import { useCurrentFrame } from "remotion";
import { bn } from "../theme";

// Gold scalloped seal (like the banner badge); children are the typed label.
export const Seal: React.FC<{ size: number; spin: number; children?: React.ReactNode }> = ({ size, spin, children }) => {
  const frame = useCurrentFrame();
  const n = 28;
  const pts = new Array(n * 2)
    .fill(0)
    .map((_, i) => {
      const a = (i / (n * 2)) * Math.PI * 2;
      const r = i % 2 === 0 ? 50 : 45;
      return `${50 + Math.cos(a) * r},${50 + Math.sin(a) * r}`;
    })
    .join(" ");
  const shine = ((frame * 2) % 240) - 70;
  return (
    <div style={{ width: size, height: size, position: "relative", transform: `perspective(900px) rotateY(${spin}deg)`, filter: "drop-shadow(0 20px 40px rgba(138,100,20,0.45))" }}>
      <svg viewBox="0 0 100 100" width={size} height={size} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="sealGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8A6414" />
            <stop offset="0.35" stopColor={bn.colors.goldLight} />
            <stop offset="0.55" stopColor={bn.colors.gold} />
            <stop offset="0.75" stopColor="#FFE9A8" />
            <stop offset="1" stopColor="#A57A1C" />
          </linearGradient>
        </defs>
        <polygon points={pts} fill="url(#sealGold)" />
        <circle cx={50} cy={50} r={38} fill="none" stroke="#FFF3C4" strokeWidth={1.2} />
        <circle cx={50} cy={50} r={35} fill="url(#sealGold)" />
        {[40, 50, 60].map((x) => (
          <text key={x} x={x} y={79} fontSize={7} textAnchor="middle" fill={bn.colors.navy}>
            ★
          </text>
        ))}
      </svg>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${shine}%`, width: "30%", background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.55), transparent)", transform: "skewX(-20deg)" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: size * 0.06 }}>{children}</div>
    </div>
  );
};
