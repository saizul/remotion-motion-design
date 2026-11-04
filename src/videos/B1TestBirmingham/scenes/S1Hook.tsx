import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_IN_OUT, tween } from "../anim";
import { Clip } from "../components/Clip";
import { BrightBackdrop, Sweep } from "../components/Light";
import { Particles } from "../components/Particles";
import { TypeText } from "../components/TypeText";
import { TYPE_CUES } from "../typing";
import { Book, GradCap, Notebook, SpeechBubble } from "../components/three/Objects";
import { CameraRig, DaylightStudio } from "../components/three/Studio";
import { b1 } from "../theme";

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = b1.scenes.hook + b1.overlap;
  const push = tween(frame, [0, len], [1, 1.07], EASE_IN_OUT);
  const logo = spring({ frame: frame - 8, fps, config: { damping: 16 } });
  const wipe = tween(frame, [8, 34], [0, 1], EASE_IN_OUT);

  return (
    <AbsoluteFill>
      <BrightBackdrop />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <AbsoluteFill
          style={{
            height: 1180,
            maskImage: "linear-gradient(180deg, #000 62%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(180deg, #000 62%, transparent 100%)",
          }}
        >
          <Clip clip="a" duration={len} zoom={[1.05, 1.16]} />
        </AbsoluteFill>
      </AbsoluteFill>
      <Particles mode="forward" seed="b1s1" count={60} opacity={0.6} />
      <ThreeCanvas width={1080} height={1920} camera={{ fov: 45, position: [0, 0, 15] }}>
        <fog attach="fog" args={[b1.colors.bg, 14, 30]} />
        <DaylightStudio />
        <CameraRig position={[Math.sin(frame * 0.015) * 0.4, 0, tween(frame, [0, len], [15, 11.5], EASE_IN_OUT)]} />
        <Book position={[-2.6, 4.6, 0]} rotation={[0.4, 0.6, 0.3]} scale={0.8} cover="navy" phase={0} />
        <Book position={[2.8, 5.4, -2]} rotation={[-0.3, -0.8, -0.2]} scale={0.9} cover="red" phase={1.3} />
        <GradCap position={[2.5, 2.2, 1]} scale={0.75} phase={0.4} />
        <SpeechBubble position={[-2.7, 1.8, 1]} scale={0.55} color="blue" phase={2} />
        <SpeechBubble position={[2.7, -0.4, -1]} scale={0.5} color="red" phase={3} />
        <Notebook position={[-2.8, -1.2, -1]} scale={0.7} phase={1.1} />
        <GradCap position={[-1.2, 6.6, -5]} scale={0.8} phase={2.4} />
        <Book position={[3.2, -5.6, 0]} rotation={[0.3, -0.4, 0.4]} scale={0.8} cover="white" phase={2.2} />
        <Book position={[-3.1, -5.8, -1]} rotation={[-0.2, 0.9, -0.3]} scale={0.85} cover="red" phase={3.3} />
      </ThreeCanvas>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 400 }}>
        <div
          style={{
            transform: `scale(${0.85 + logo * 0.15})`,
            opacity: logo,
            maskImage: `linear-gradient(90deg, #000 ${wipe * 120 - 20}%, transparent ${wipe * 120}%)`,
            WebkitMaskImage: `linear-gradient(90deg, #000 ${wipe * 120 - 20}%, transparent ${wipe * 120}%)`,
            filter: "drop-shadow(0 12px 30px rgba(1,33,105,0.18))",
            marginBottom: 30,
          }}
        >
          <Img src={staticFile("b1/logo-color.png")} style={{ width: 400 }} />
        </div>
        <TypeText cue={TYPE_CUES.hookTagline} highlight={["Speak", "Clearly"]} fontSize={96} align="center" />
      </AbsoluteFill>
      <Sweep progress={tween(frame, [len - 22, len], [0, 1], EASE_IN_OUT)} />
    </AbsoluteFill>
  );
};
