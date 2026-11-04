import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Clip } from "../../B1TestBirmingham/components/Clip";
import { IconBadge } from "../../B1TestBirmingham/components/Icons";
import { BrightBackdrop } from "../../B1TestBirmingham/components/Light";
import { Particles } from "../../B1TestBirmingham/components/Particles";
import { bn, sceneFrames } from "../theme";
import { cue } from "../typing";
import { FeatureCard } from "./common";

// Classroom: tutor with a learner in a framed 3D panel, floating learning icons, three typed points.
export const S3Classroom: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = sceneFrames.classroom + bn.overlap;
  const p = spring({ frame: frame - 2, fps, config: { damping: 18 } });
  const pop = (d: number) => spring({ frame: frame - d, fps, config: { damping: 11 } });
  return (
    <AbsoluteFill>
      <BrightBackdrop focusY={35} />
      <Particles seed="bn3" count={45} opacity={0.45} />
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 150,
          width: 940,
          height: 760,
          borderRadius: 44,
          overflow: "hidden",
          border: "8px solid #FFFFFF",
          boxShadow: "0 40px 90px rgba(1,33,105,0.25)",
          opacity: p,
          transform: `perspective(1600px) translateY(${(1 - p) * 140}px) rotateX(${(1 - p) * 16}deg) rotateY(${Math.sin(frame * 0.02) * 3}deg)`,
        }}
      >
        <Clip clip="c" duration={len} zoom={[1.06, 1.14]} objectPosition="50% 35%" />
      </div>
      {[
        { icon: "book" as const, x: 20, y: 110, d: 14 },
        { icon: "cap" as const, x: 900, y: 80, d: 20 },
        { icon: "chat" as const, x: 930, y: 820, d: 26 },
      ].map((f) => (
        <div key={f.icon} style={{ position: "absolute", left: f.x, top: f.y + Math.sin(frame * 0.05 + f.x) * 10, transform: `scale(${pop(f.d)})` }}>
          <IconBadge name={f.icon} size={130} progress={Math.min(1, pop(f.d))} />
        </div>
      ))}
      <FeatureCard icon="cap" c={cue("class0")} y={1040} red />
      <FeatureCard icon="coursework" c={cue("class1")} y={1215} />
      <FeatureCard icon="star" c={cue("class2")} y={1390} red />
    </AbsoluteFill>
  );
};
