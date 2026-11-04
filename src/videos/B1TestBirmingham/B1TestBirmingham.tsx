import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { tween } from "./anim";
import { AudioTrack } from "./AudioTrack";
import { S1Hook } from "./scenes/S1Hook";
import { S2Course } from "./scenes/S2Course";
import { S3Features } from "./scenes/S3Features";
import { S4Transform } from "./scenes/S4Transform";
import { S5Journey } from "./scenes/S5Journey";
import { S6Cta } from "./scenes/S6Cta";
import { b1, type SceneKey, sceneLength, sceneOrder } from "./theme";

const SCENES: Record<SceneKey, React.FC> = {
  hook: S1Hook,
  course: S2Course,
  features: S3Features,
  transform: S4Transform,
  journey: S5Journey,
  cta: S6Cta,
};

const FadeIn: React.FC<{ children: React.ReactNode; enabled: boolean }> = ({ children, enabled }) => {
  const frame = useCurrentFrame();
  const opacity = enabled ? tween(frame, [0, b1.overlap], [0, 1]) : 1;
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const B1TestBirmingham: React.FC = () => {
  let start = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: b1.colors.bg, fontFamily: b1.fonts.body }}>
      <AudioTrack />
      {sceneOrder.map((key, i) => {
        const from = start;
        start += b1.scenes[key];
        const Scene = SCENES[key];
        return (
          <Sequence key={key} name={key} from={from} durationInFrames={sceneLength(key)}>
            <FadeIn enabled={i > 0}>
              <Scene />
            </FadeIn>
          </Sequence>
        );
      })}
      {/* Soft edge vignette for depth on a bright palette */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 65% at 50% 45%, transparent 60%, rgba(1,33,105,0.14) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
