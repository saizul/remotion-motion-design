import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_IN_OUT, EASE_OUT, tween } from "../anim";
import { Clip } from "../components/Clip";
import { TypeText } from "../components/TypeText";
import { TYPE_CUES } from "../typing";
import { b1 } from "../theme";

const SPLIT_START = 40;
const SPLIT_END = 70;

// Glass tube meter whose fill rises upward.
const ConfidenceMeter: React.FC<{ level: number; appear: number }> = ({ level, appear }) => {
  const H = 500;
  const fillH = (H - 20) * level;
  return (
    <div style={{ position: "absolute", left: 540 - 70, top: 1010, width: 140, opacity: appear, transform: `translateY(${(1 - appear) * 60}px)` }}>
      <div
        style={{
          position: "relative",
          width: 140,
          height: H,
          borderRadius: 70,
          background: "linear-gradient(90deg, rgba(255,255,255,0.55), rgba(255,255,255,0.9) 35%, rgba(255,255,255,0.5))",
          border: "3px solid #FFFFFF",
          boxShadow: "0 30px 70px rgba(1,33,105,0.3), inset 0 0 20px rgba(1,33,105,0.12)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          overflow: "hidden",
        }}
      >
        {/* Liquid */}
        <div
          style={{
            position: "absolute",
            left: 10,
            right: 10,
            bottom: 10,
            height: fillH,
            borderRadius: 60,
            background: `linear-gradient(0deg, ${b1.colors.navy} 0%, ${b1.colors.blue} 45%, ${b1.colors.red} 100%)`,
            boxShadow: "inset 14px 0 18px rgba(255,255,255,0.35), 0 0 30px rgba(200,16,46,0.35)",
          }}
        />
        {/* Ticks */}
        {[0.25, 0.5, 0.75].map((t) => (
          <div key={t} style={{ position: "absolute", left: 0, width: 34, bottom: 10 + (H - 20) * t, height: 3, background: "rgba(1,33,105,0.35)" }} />
        ))}
        {/* Glass highlight */}
        <div style={{ position: "absolute", left: 22, top: 20, bottom: 20, width: 16, borderRadius: 8, background: "rgba(255,255,255,0.6)" }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 150,
          bottom: 10 + fillH - 40,
          padding: "10px 20px",
          borderRadius: 18,
          background: b1.colors.red,
          color: "#FFFFFF",
          fontFamily: b1.fonts.display,
          fontWeight: 800,
          fontSize: 40,
          boxShadow: "0 10px 30px rgba(200,16,46,0.4)",
        }}
      >
        {Math.round(level * 100)}%
      </div>
      <div
        style={{
          margin: "18px -70px 0",
          padding: "10px 0",
          borderRadius: 999,
          background: b1.colors.navy,
          textAlign: "center",
          fontFamily: b1.fonts.body,
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: 5,
          color: "#FFFFFF",
        }}
      >
        CONFIDENCE
      </div>
    </div>
  );
};

const Tag: React.FC<{ text: string; color: string; appear: number; style: React.CSSProperties }> = ({ text, color, appear, style }) => (
  <div
    style={{
      position: "absolute",
      padding: "12px 30px",
      borderRadius: 999,
      background: color,
      color: "#FFFFFF",
      fontFamily: b1.fonts.display,
      fontWeight: 700,
      fontSize: 34,
      letterSpacing: 3,
      opacity: appear,
      transform: `translateY(${(1 - appear) * 30}px)`,
      boxShadow: "0 12px 30px rgba(1,33,105,0.25)",
      ...style,
    }}
  >
    {text}
  </div>
);

export const S4Transform: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = b1.scenes.transform + b1.overlap;
  const divX = tween(frame, [SPLIT_START, SPLIT_END], [1080, 540], EASE_IN_OUT);
  const split = tween(frame, [SPLIT_START, SPLIT_END], [0, 1]);
  const level = tween(frame, [60, 125], [0.15, 0.95], EASE_OUT);
  const meter = spring({ frame: frame - 55, fps, config: { damping: 16 } });
  const tagB = spring({ frame: frame - 16, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ backgroundColor: b1.colors.bg }}>
      {/* Before: desaturated, cool */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: divX, overflow: "hidden" }}>
        <Clip clip="d1" duration={len} grayscale={1} zoom={[1.08, 1.14]} />
        <AbsoluteFill style={{ background: "rgba(40,55,80,0.25)" }} />
      </div>
      {/* After: full colour, warm */}
      <div style={{ position: "absolute", left: divX, top: 0, bottom: 0, right: 0, overflow: "hidden" }}>
        <Clip clip="d2" duration={len} zoom={[1.02, 1.1]} trimBefore={360} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 70% 30%, rgba(255,220,180,0.25), transparent 60%)" }} />
      </div>
      {/* Divider */}
      {split > 0 ? (
        <>
          <div
            style={{
              position: "absolute",
              left: divX - 4,
              top: 0,
              bottom: 0,
              width: 8,
              background: "#FFFFFF",
              boxShadow: `0 0 30px ${b1.colors.red}, 0 0 8px ${b1.colors.red}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: divX - 50,
              top: 860,
              width: 100,
              height: 100,
              borderRadius: 50,
              background: b1.colors.red,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 30px rgba(200,16,46,0.5)",
              transform: `scale(${split})`,
            }}
          >
            <svg width={48} height={48} viewBox="0 0 24 24">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="#FFFFFF" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </>
      ) : null}
      {/* Title panel */}
      <AbsoluteFill
        style={{
          height: 520,
          background: `linear-gradient(180deg, ${b1.colors.bg} 0%, rgba(244,247,252,0.92) 55%, rgba(244,247,252,0) 100%)`,
          alignItems: "center",
          paddingTop: 130,
        }}
      >
        <TypeText cue={TYPE_CUES.transformFrom} fontSize={80} weight={700} color={b1.colors.muted} letterSpacing={-1} align="center" />
        <TypeText cue={TYPE_CUES.transformTo} highlight={["Confidence"]} fontSize={100} letterSpacing={-2} lineHeight={1.05} align="center" />
      </AbsoluteFill>
      <Tag text="BEFORE" color="#6B7890" appear={tagB} style={{ left: 50, top: 1560 }} />
      <Tag text="AFTER" color={b1.colors.red} appear={split} style={{ right: 50, top: 1560 }} />
      <ConfidenceMeter level={level} appear={meter} />
    </AbsoluteFill>
  );
};
