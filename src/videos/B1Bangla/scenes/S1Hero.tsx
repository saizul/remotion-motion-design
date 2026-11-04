import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_IN_OUT, tween } from "../../UniqueMarkHSC/anim";
import { BrightBackdrop, Sweep } from "../../B1TestBirmingham/components/Light";
import { Particles } from "../../B1TestBirmingham/components/Particles";
import { Book, GradCap, SpeechBubble } from "../../B1TestBirmingham/components/three/Objects";
import { CameraRig, DaylightStudio } from "../../B1TestBirmingham/components/three/Studio";
import { BanglaType } from "../components/BanglaType";
import { Skyline } from "../components/Skyline";
import { bn, sceneFrames } from "../theme";
import { cue } from "../typing";

// Camera glides through a Birmingham-style skyline; the logo emerges in a light sweep,
// "B1 Test" and the Bengali tagline type in.
export const S1Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = sceneFrames.hero + bn.overlap;
  const push = tween(frame, [0, len], [1, 1.08], EASE_IN_OUT);
  const logo = spring({ frame: frame - 6, fps, config: { damping: 16 } });
  const wipe = tween(frame, [6, 34], [0, 1], EASE_IN_OUT);
  const pill = spring({ frame: frame - 52, fps, config: { damping: 18 } });
  return (
    <AbsoluteFill>
      <BrightBackdrop focusY={30} />
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "50% 80%" }}>
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${tween(frame, [0, len], [30, 0])}px)` }}>
          <Skyline layer="far" base={1520} drift={-0.15} />
        </div>
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${tween(frame, [0, len], [60, 0])}px) scale(1.02)` }}>
          <Skyline layer="mid" base={1700} drift={-0.3} />
        </div>
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${tween(frame, [0, len], [120, 0])}px)` }}>
          <Skyline layer="near" base={1880} drift={-0.55} opacity={0.85} />
        </div>
      </AbsoluteFill>
      <ThreeCanvas width={1080} height={1920} camera={{ fov: 45, position: [0, 0, 15] }}>
        <DaylightStudio />
        <CameraRig position={[Math.sin(frame * 0.02) * 0.4, 0, tween(frame, [0, len], [15, 12.5])]} />
        <Book position={[-2.6, 5.2, 0]} rotation={[0.4, 0.6, 0.3]} scale={0.75} cover="navy" phase={0} />
        <Book position={[2.8, 4.6, -1]} rotation={[-0.3, -0.8, -0.2]} scale={0.8} cover="red" phase={1.3} />
        <GradCap position={[2.6, 1.6, 1]} scale={0.6} phase={0.4} />
        <SpeechBubble position={[-2.8, 1.2, 0]} scale={0.45} color="blue" phase={2} />
      </ThreeCanvas>
      <Particles seed="bn1" count={50} opacity={0.5} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 230 }}>
        <div
          style={{
            transform: `scale(${0.85 + logo * 0.15})`,
            opacity: logo,
            maskImage: `linear-gradient(90deg, #000 ${wipe * 120 - 20}%, transparent ${wipe * 120}%)`,
            WebkitMaskImage: `linear-gradient(90deg, #000 ${wipe * 120 - 20}%, transparent ${wipe * 120}%)`,
            filter: "drop-shadow(0 14px 30px rgba(1,33,105,0.2))",
          }}
        >
          <Img src={staticFile("b1/logo-color.png")} style={{ width: 520 }} />
        </div>
        <div style={{ marginTop: 40 }}>
          <BanglaType cue={cue("heroTitle")} font={bn.fonts.latin} fontSize={200} weight={800} letterSpacing={-8} lineHeight={1} highlight={["Test"]} align="center" />
        </div>
        <div
          style={{
            marginTop: 40,
            padding: "20px 44px 26px",
            borderRadius: 28,
            background: bn.colors.navy,
            boxShadow: "0 20px 50px rgba(1,33,105,0.35)",
            opacity: pill,
            transform: `scale(${0.8 + pill * 0.2})`,
          }}
        >
          <BanglaType cue={cue("heroTag")} fontSize={60} weight={700} color="#FFFFFF" caretColor={bn.colors.goldLight} />
        </div>
      </AbsoluteFill>
      <Sweep progress={tween(frame, [len - 20, len], [0, 1], EASE_IN_OUT)} />
    </AbsoluteFill>
  );
};
