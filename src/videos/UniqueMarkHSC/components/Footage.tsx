import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { tween } from "../anim";

type Props = {
  src: string;
  duration: number;
  objectPosition?: string;
  zoom?: [number, number];
  pan?: [number, number];
  trimBefore?: number;
  shakeX?: number;
  shakeY?: number;
};

// Real footage layer: cover-cropped for 9:16 (edge watermarks fall outside the
// crop), slow camera push, cinematic navy/gold grade.
export const Footage: React.FC<Props> = ({
  src,
  duration,
  objectPosition = "50% 50%",
  zoom = [1.02, 1.14],
  pan = [0, 0],
  trimBefore = 0,
  shakeX = 0,
  shakeY = 0,
}) => {
  const frame = useCurrentFrame();
  const z = tween(frame, [0, duration], zoom, (t) => t);
  const x = tween(frame, [0, duration], pan, (t) => t);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${x + shakeX}px, ${shakeY}px) scale(${z})` }}>
        <OffthreadVideo
          src={staticFile(src)}
          muted
          trimBefore={trimBefore}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition,
            filter: "saturate(0.88) contrast(1.1) brightness(0.9)",
          }}
        />
      </AbsoluteFill>
      {/* Cool shadows, warm highlights */}
      <AbsoluteFill style={{ background: "rgba(27,60,127,0.35)", mixBlendMode: "soft-light" }} />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 70% 20%, rgba(235,211,148,0.22), transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(3,8,23,0.55) 0%, rgba(3,8,23,0) 30%, rgba(3,8,23,0.15) 55%, rgba(3,8,23,0.94) 88%)",
        }}
      />
    </AbsoluteFill>
  );
};
