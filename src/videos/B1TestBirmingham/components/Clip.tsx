import { AbsoluteFill, OffthreadVideo, getStaticFiles, staticFile, useCurrentFrame } from "remotion";
import { tween } from "../anim";
import { b1, type ClipKey } from "../theme";

type Props = {
  clip: ClipKey;
  duration: number;
  objectPosition?: string;
  zoom?: [number, number];
  pan?: [number, number];
  trimBefore?: number;
  grayscale?: number;
  blur?: number;
};

const hasFile = (file: string) => getStaticFiles().some((f) => f.name === file);

// Bright stand-in shown until the real clip is dropped into public/b1/.
const Placeholder: React.FC<{ label: string; clip: ClipKey }> = ({ label, clip }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #DCE8FA 0%, #F7FAFF 45%, #E7EEF9 100%)`,
        overflow: "hidden",
      }}
    >
      {/* Window light */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: -200,
            left: 140 + i * 300 + frame * 0.4,
            width: 180,
            height: 1400,
            transform: "skewX(-18deg)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0))",
            filter: "blur(10px)",
          }}
        />
      ))}
      {/* Soft people silhouettes */}
      <svg width="100%" height="100%" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
        {[
          { x: 300, s: 1, o: 0.14 },
          { x: 620, s: 1.2, o: 0.18 },
          { x: 860, s: 0.9, o: 0.1 },
        ].map((p, i) => (
          <g key={i} transform={`translate(${p.x} ${1100 - Math.sin(frame * 0.05 + i) * 6}) scale(${p.s})`} fill={b1.colors.navy} opacity={p.o}>
            <circle cx={0} cy={-260} r={90} />
            <path d="M-190 200 C-190 -40 -110 -130 0 -130 C110 -130 190 -40 190 200 Z" />
          </g>
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          top: 70,
          right: 60,
          padding: "10px 22px",
          borderRadius: 999,
          border: `2px dashed ${b1.colors.navySoft}`,
          color: b1.colors.navySoft,
          fontFamily: b1.fonts.body,
          fontSize: 24,
          fontWeight: 600,
          background: "rgba(255,255,255,0.7)",
        }}
      >
        FOOTAGE {clip.toUpperCase()} · {label}
      </div>
    </AbsoluteFill>
  );
};

// Footage layer with slow camera push and a bright, clean grade.
export const Clip: React.FC<Props> = ({
  clip,
  duration,
  objectPosition = "50% 40%",
  zoom = [1.02, 1.12],
  pan = [0, 0],
  trimBefore = 0,
  grayscale = 0,
  blur = 0,
}) => {
  const frame = useCurrentFrame();
  const { file, label } = b1.clips[clip];
  const z = tween(frame, [0, duration], zoom, (t) => t);
  const x = tween(frame, [0, duration], pan, (t) => t);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `translateX(${x}px) scale(${z})`,
          filter: `grayscale(${grayscale}) blur(${blur}px)`,
        }}
      >
        {hasFile(file) ? (
          <OffthreadVideo
            src={staticFile(file)}
            muted
            trimBefore={trimBefore}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition,
              filter: "saturate(1.05) contrast(1.05) brightness(1.04)",
            }}
          />
        ) : (
          <Placeholder label={label} clip={clip} />
        )}
      </AbsoluteFill>
      {/* Cool daylight tint */}
      <AbsoluteFill style={{ background: "rgba(191,214,255,0.18)", mixBlendMode: "soft-light" }} />
    </AbsoluteFill>
  );
};
