import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_IN_OUT, impactShake, tween } from "../anim";
import { Clip } from "../components/Clip";
import { IconBadge, type IconName } from "../components/Icons";
import { BrightBackdrop } from "../components/Light";
import { Particles } from "../components/Particles";
import { TypeText } from "../components/TypeText";
import { TYPE_CUES } from "../typing";
import { CameraRig, DaylightStudio, NAVY, RED, WHITE } from "../components/three/Studio";
import { b1 } from "../theme";

const WORDS = [
  { cue: TYPE_CUES.learn, at: TYPE_CUES.learn.start, red: false },
  { cue: TYPE_CUES.practice, at: TYPE_CUES.practice.start, red: false },
  { cue: TYPE_CUES.succeed, at: TYPE_CUES.succeed.start, red: true },
];

// Each step: learning icon flips into an achievement icon once lit.
const STEPS: { from: IconName; to: IconName }[] = [
  { from: "headphones", to: "check" },
  { from: "mic", to: "star" },
  { from: "chart", to: "trophy" },
];

const GROUP_POS: [number, number, number] = [1.2, -3.7, 0];
const GROUP_ROT: [number, number, number] = [0.22, -0.35, 0];
const GROUP_SCALE = 0.62;
const STEP_X = (i: number) => -1.35 + i * 1.35;
const SLAB_Y = (k: number) => 0.36 + k * 0.72;
const slabsFor = (i: number) => 2 * (i + 1);

// Screen position of a point inside the staircase group (matches the R3F camera).
const projectStepTop = (i: number, camZ: number) => {
  const cam = new THREE.PerspectiveCamera(35, 1080 / 1920, 0.1, 1000);
  cam.position.set(0, 0, camZ);
  cam.lookAt(0, 0, 0);
  cam.updateMatrixWorld();
  const g = new THREE.Object3D();
  g.position.set(...GROUP_POS);
  g.rotation.set(...GROUP_ROT);
  g.scale.setScalar(GROUP_SCALE);
  g.updateMatrixWorld();
  const v = new THREE.Vector3(STEP_X(i), SLAB_Y(slabsFor(i) - 1) + 0.31, 0).applyMatrix4(g.matrixWorld).project(cam);
  return { x: ((v.x + 1) / 2) * 1080, y: ((1 - v.y) / 2) * 1920 };
};

const SLAB_COLORS = [NAVY, RED, WHITE];

// Staircase of stacked books, each step rising into place when its word lands.
const Staircase: React.FC<{ rises: number[] }> = ({ rises }) => (
  <group position={GROUP_POS} rotation={GROUP_ROT} scale={GROUP_SCALE}>
    {rises.map((r, i) =>
      new Array(slabsFor(i)).fill(0).map((_, k) => (
        <group key={`${i}-${k}`} position={[STEP_X(i), SLAB_Y(k) - (1 - r) * 6, 0]}>
          <mesh>
            <boxGeometry args={[1.45, 0.62, 1.3]} />
            <meshStandardMaterial {...SLAB_COLORS[(i + k) % 3]} />
          </mesh>
          <mesh position={[0.02, 0, 0.62]}>
            <boxGeometry args={[1.32, 0.5, 0.08]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
          </mesh>
        </group>
      )),
    )}
    <mesh position={[0, -0.02, 0]}>
      <boxGeometry args={[5, 0.04, 2.2]} />
      <meshStandardMaterial color="#DCE7F7" roughness={0.8} />
    </mesh>
  </group>
);

export const S5Journey: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = b1.scenes.journey + b1.overlap;
  const rises = WORDS.map((w) => spring({ frame: frame - w.at + 4, fps, config: { damping: 14 } }));
  const shake = WORDS.reduce((s, w) => s + impactShake(frame, w.at, 6), 0);
  const camZ = tween(frame, [0, len], [16.5, 15.5], EASE_IN_OUT);

  return (
    <AbsoluteFill>
      <BrightBackdrop focusY={60} />
      <AbsoluteFill
        style={{
          height: 1020,
          maskImage: "linear-gradient(180deg, #000 60%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(180deg, #000 60%, transparent 100%)",
          transform: `translateX(${shake}px)`,
        }}
      >
        <Clip clip="e" duration={len} zoom={[1.02, 1.16]} />
      </AbsoluteFill>
      <Particles seed="b1s5" count={50} opacity={0.5} speed={1.4} />
      <ThreeCanvas width={1080} height={1920} camera={{ fov: 35, position: [0, 0, 16] }}>
        <DaylightStudio />
        <CameraRig position={[0, 0, camZ]} />
        <Staircase rises={rises} />
      </ThreeCanvas>
      {STEPS.map((s, i) => {
        const lit = rises[i];
        const flip = tween(frame, [WORDS[i].at + 16, WORDS[i].at + 28], [0, 1], EASE_IN_OUT);
        const showTo = flip > 0.5;
        const top = projectStepTop(i, camZ);
        return (
          <div
            key={s.from}
            style={{
              position: "absolute",
              left: top.x - 65,
              top: top.y - 170 + Math.sin(frame * 0.06 + i) * 6,
              opacity: lit,
              transform: `scale(${lit}) scaleX(${Math.abs(Math.cos(flip * Math.PI))})`,
            }}
          >
            <IconBadge
              name={showTo ? s.to : s.from}
              size={130}
              color={showTo ? b1.colors.red : b1.colors.navy}
              ring={showTo ? b1.colors.navy : b1.colors.red}
              glow={showTo ? 1 : 0.4}
            />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 70, top: 900 }}>
        {WORDS.map((w) => (
          <TypeText key={w.cue.text} cue={w.cue} fontSize={112} lineHeight={1.08} letterSpacing={-3} color={w.red ? b1.colors.red : b1.colors.navy} />
        ))}
      </div>
      <AbsoluteFill style={{ backgroundColor: "#FFFFFF", opacity: tween(frame, [len - 14, len], [0, 0.5]) }} />
    </AbsoluteFill>
  );
};
