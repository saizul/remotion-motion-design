import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TypeText } from "../components/TypeText";
import { cue } from "../typing";

type CueId = Parameters<typeof cue>[0];

// Left-column list of typed capability lines with a small cyan marker per line.
export const TypedList: React.FC<{ ids: CueId[]; x: number; y: number; size?: number; gap?: number; title?: boolean }> = ({
  ids,
  x,
  y,
  size = 46,
  gap = 1.55,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      {ids.map((id, i) => {
        const c = cue(id);
        const p = spring({ frame: frame - c.start + 4, fps, config: { damping: 200 }, durationInFrames: 10 });
        return (
          <div key={id} style={{ display: "flex", alignItems: "center", gap: 22, height: size * gap }}>
            <div
              style={{
                width: 10,
                height: size * 0.9,
                borderRadius: 5,
                background: "linear-gradient(#5CC8FF, #2F80FF)",
                boxShadow: "0 0 14px #5CC8FF",
                transform: `scaleY(${p})`,
                opacity: p,
              }}
            />
            <TypeText cue={c} fontSize={size} weight={i === 0 ? 800 : 600} />
          </div>
        );
      })}
    </div>
  );
};

// Soft dark panel behind text so it stays readable over busy 3D visuals.
export const TextShade: React.FC<{ side?: "left" | "bottom" }> = ({ side = "left" }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background:
        side === "left"
          ? "linear-gradient(90deg, rgba(3,5,10,0.85) 0%, rgba(3,5,10,0.55) 30%, transparent 55%)"
          : "linear-gradient(0deg, rgba(3,5,10,0.9) 0%, rgba(3,5,10,0.5) 30%, transparent 55%)",
    }}
  />
);
