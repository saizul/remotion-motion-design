import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, useCurrentFrame, staticFile } from "remotion";
import { tween } from "./anim";
import { FilmGrain, Vignette } from "./components/Atmosphere";
import { S1Hook } from "./scenes/S1Hook";
import { S2CareerVision } from "./scenes/S2CareerVision";
import { S3CourseIntro } from "./scenes/S3CourseIntro";
import { S4FullyFunded } from "./scenes/S4FullyFunded";
import { S5Benefits } from "./scenes/S5Benefits";
import { S6Journey } from "./scenes/S6Journey";
import { S7Opportunity } from "./scenes/S7Opportunity";
import { S8Cta } from "./scenes/S8Cta";
import { type SceneKey, sceneLength, sceneOrder, um } from "./theme";

const SCENES: Record<SceneKey, React.FC> = {
  hook: S1Hook,
  vision: S2CareerVision,
  course: S3CourseIntro,
  funded: S4FullyFunded,
  benefits: S5Benefits,
  journey: S6Journey,
  opportunity: S7Opportunity,
  cta: S8Cta,
};

// Incoming scene crossfades over the tail of the previous one.
const FadeIn: React.FC<{ children: React.ReactNode; enabled: boolean }> = ({ children, enabled }) => {
  const frame = useCurrentFrame();
  const opacity = enabled ? tween(frame, [0, um.overlap], [0, 1]) : 1;
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const UniqueMarkHSC: React.FC = () => {
  let start = 0;
  return (
    <>
      <AbsoluteFill style={{ backgroundColor: um.colors.bgDeep, fontFamily: um.fonts.body }}>
        {sceneOrder.map((key, i) => {
          const from = start;
          start += um.scenes[key];
          const Scene = SCENES[key];
          return (
            <Sequence key={key} name={key} from={from} durationInFrames={sceneLength(key)}>
              <FadeIn enabled={i > 0}>
                <Scene />
              </FadeIn>
            </Sequence>
          );
        })}
        <Vignette strength={0.55} />
        <FilmGrain opacity={0.05} />
      </AbsoluteFill>
      <Audio
        src={staticFile("starostin-educational-educational-music-569134.mp3")}
        durationInFrames={21543.97}
        volume={0.25}
      />
    </>
  );
};
