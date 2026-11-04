import { Img, staticFile, useCurrentFrame } from "remotion";
import { tween } from "../anim";
import { sa } from "../theme";

type Props = {
  src: "saizul/cutout-front.png" | "saizul/cutout-casual.png";
  width: number;
  height: number;
  reveal: number; // 0 → 1 hologram scan from top to bottom
  orbit?: number; // subtle "camera circling" amount
};

// Real photo cut-out revealed by a hologram scan; stays photographic after the scan.
// Parallax + light rotation suggests a slow orbiting camera without altering the face.
export const HoloPortrait: React.FC<Props> = ({ src, width, height, reveal, orbit = 1 }) => {
  const frame = useCurrentFrame();
  const line = reveal * 100;
  const rotY = Math.sin(frame * 0.012) * 7 * orbit;
  const x = Math.sin(frame * 0.012) * 18 * orbit;
  const tint = tween(reveal, [0.7, 1], [1, 0]);
  const img = (extra: React.CSSProperties) => (
    <Img
      src={staticFile(src)}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", objectPosition: "50% 100%", ...extra }}
    />
  );
  return (
    <div style={{ position: "relative", width, height, perspective: 1600 }}>
      {/* Floor glow */}
      <div
        style={{
          position: "absolute",
          left: "15%",
          right: "15%",
          bottom: -40,
          height: 120,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(47,128,255,0.55), transparent 70%)",
          filter: "blur(10px)",
          opacity: reveal,
        }}
      />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${x}px) rotateY(${rotY}deg)` }}>
        {/* Photographic layer, revealed above the scan line */}
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${100 - line}% 0)` }}>
          {img({
            filter: `drop-shadow(-12px 0 24px rgba(92,200,255,0.35)) drop-shadow(12px 0 24px rgba(47,128,255,0.3)) saturate(${1 - tint * 0.6}) brightness(${1 + tint * 0.15})`,
          })}
          {/* Hologram tint fading out once the scan completes */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: tint * 0.55,
              background: `repeating-linear-gradient(0deg, rgba(92,200,255,0.35) 0 2px, transparent 2px 6px)`,
              maskImage: `url(${staticFile(src)})`,
              WebkitMaskImage: `url(${staticFile(src)})`,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskPosition: "50% 100%",
              WebkitMaskPosition: "50% 100%",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
            }}
          />
        </div>
        {/* Wireframe ghost below the scan line */}
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(${line}% 0 0 0)`, opacity: 0.35 }}>
          {img({ filter: "grayscale(1) brightness(0.6) sepia(1) hue-rotate(170deg) saturate(4)" })}
        </div>
        {reveal > 0 && reveal < 1 ? (
          <div
            style={{
              position: "absolute",
              left: "5%",
              right: "5%",
              top: `${line}%`,
              height: 4,
              background: sa.colors.cyan,
              boxShadow: `0 0 30px 8px ${sa.colors.cyan}`,
            }}
          />
        ) : null}
      </div>
    </div>
  );
};
