import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { tween } from "./anim";
import { Grain, Vignette } from "./components/Space";
import { S01Arrival } from "./scenes/S01Arrival";
import { S02Who } from "./scenes/S02Who";
import { S03Ecosystem } from "./scenes/S03Ecosystem";
import { S04Web } from "./scenes/S04Web";
import { S05Seo } from "./scenes/S05Seo";
import { S06Marketing } from "./scenes/S06Marketing";
import { S07Ai } from "./scenes/S07Ai";
import { S08Systems } from "./scenes/S08Systems";
import { S09Global } from "./scenes/S09Global";
import { S10Showcase } from "./scenes/S10Showcase";
import { S11Legacy } from "./scenes/S11Legacy";
import { SCENES, type SceneKey, sa, sceneLength } from "./theme";

const SCENE_COMPONENTS: Record<SceneKey, React.FC> = {
  arrival: S01Arrival,
  who: S02Who,
  ecosystem: S03Ecosystem,
  web: S04Web,
  seo: S05Seo,
  marketing: S06Marketing,
  ai: S07Ai,
  systems: S08Systems,
  global: S09Global,
  showcase: S10Showcase,
  legacy: S11Legacy,
};

const FadeIn: React.FC<{ children: React.ReactNode; enabled: boolean }> = ({ children, enabled }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: enabled ? tween(frame, [0, sa.overlap], [0, 1]) : 1 }}>{children}</AbsoluteFill>;
};

export const SaizulPortfolio: React.FC = () => {
  let start = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: sa.colors.bg, fontFamily: sa.fonts.display }}>
      {/* Voice + effects + typing keys, pre-mixed by scripts/saizul-audio.py from timeline.json */}
      <Audio src={staticFile("saizul/audio/mix.wav")} />
      {SCENES.map(([key], i) => {
        const from = start;
        start += SCENES[i][1];
        const Scene = SCENE_COMPONENTS[key];
        return (
          <Sequence key={key} name={key} from={from} durationInFrames={sceneLength(key)}>
            <FadeIn enabled={i > 0}>
              <Scene />
            </FadeIn>
          </Sequence>
        );
      })}
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};
