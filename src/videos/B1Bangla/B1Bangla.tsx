import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { tween } from "../UniqueMarkHSC/anim";
import { S1Hero } from "./scenes/S1Hero";
import { S2Journey } from "./scenes/S2Journey";
import { S3Classroom } from "./scenes/S3Classroom";
import { S4Transform } from "./scenes/S4Transform";
import { S5Enroll } from "./scenes/S5Enroll";
import { S6Cta } from "./scenes/S6Cta";
import { SCENES, type SceneKey, bn, sceneLength } from "./theme";

const SCENE_COMPONENTS: Record<SceneKey, React.FC> = {
  hero: S1Hero,
  journey: S2Journey,
  classroom: S3Classroom,
  transform: S4Transform,
  enroll: S5Enroll,
  cta: S6Cta,
};

const FadeIn: React.FC<{ children: React.ReactNode; enabled: boolean }> = ({ children, enabled }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: enabled ? tween(frame, [0, bn.overlap], [0, 1]) : 1 }}>{children}</AbsoluteFill>;
};

export const B1Bangla: React.FC = () => {
  let start = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: bn.colors.bg }}>
      {/* Bengali voice-over + effects + typing keys, pre-mixed by scripts/b1bn-audio.py */}
      <Audio src={staticFile("b1bn/audio/mix.wav")} />
      {SCENES.map(([key, frames], i) => {
        const from = start;
        start += frames;
        const Scene = SCENE_COMPONENTS[key];
        return (
          <Sequence key={key} name={key} from={from} durationInFrames={sceneLength(key)}>
            <FadeIn enabled={i > 0}>
              <Scene />
            </FadeIn>
          </Sequence>
        );
      })}
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse 80% 65% at 50% 45%, transparent 60%, rgba(1,33,105,0.14) 100%)" }} />
    </AbsoluteFill>
  );
};
