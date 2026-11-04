import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { tween } from "../../UniqueMarkHSC/anim";
import { Clip } from "../../B1TestBirmingham/components/Clip";
import { BrightBackdrop } from "../../B1TestBirmingham/components/Light";
import { Particles } from "../../B1TestBirmingham/components/Particles";
import { Book, Notebook } from "../../B1TestBirmingham/components/three/Objects";
import { DaylightStudio } from "../../B1TestBirmingham/components/three/Studio";
import { sceneFrames, bn } from "../theme";
import { cue } from "../typing";
import { FeatureCard } from "./common";

// Student walking through the city, books float around, four feature cards type in.
export const S2Journey: React.FC = () => {
  const frame = useCurrentFrame();
  const len = sceneFrames.journey + bn.overlap;
  return (
    <AbsoluteFill>
      <BrightBackdrop focusY={70} />
      <AbsoluteFill
        style={{
          height: 1080,
          maskImage: "linear-gradient(180deg, #000 60%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(180deg, #000 60%, transparent 100%)",
        }}
      >
        <Clip clip="a" duration={len} zoom={[1.02, 1.14]} />
      </AbsoluteFill>
      <ThreeCanvas width={1080} height={1920} camera={{ fov: 45, position: [0, 0, 15] }}>
        <DaylightStudio />
        <Book position={[-3.1, 2.4 + tween(frame, [0, len], [0, 0.8]), 1]} rotation={[0.3, 0.8, 0.2]} scale={0.7} cover="red" phase={0.5} />
        <Book position={[3.1, 3.6 - tween(frame, [0, len], [0, 0.6]), 0]} rotation={[-0.2, -0.6, 0.3]} scale={0.65} cover="navy" phase={1.6} />
        <Notebook position={[3.0, -6.0, -1]} scale={0.6} phase={2.2} />
      </ThreeCanvas>
      <Particles seed="bn2" count={40} opacity={0.45} />
      <FeatureCard icon="calendar" c={cue("feat0")} y={1000} red />
      <FeatureCard icon="headphones" c={cue("feat1")} y={1175} />
      <FeatureCard icon="tutor" c={cue("feat2")} y={1350} red />
      <FeatureCard icon="clock" c={cue("feat3")} y={1525} />
    </AbsoluteFill>
  );
};
