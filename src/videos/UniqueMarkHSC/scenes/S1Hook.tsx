import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EASE_IN, EASE_IN_OUT, tween } from "../anim";
import { ParticleField } from "../components/ParticleField";
import { WordReveal } from "../components/WordReveal";
import { Book3D } from "../components/three/Book3D";
import { CameraRig, StudioLights } from "../components/three/Studio";
import { um } from "../theme";

const BOOKS: {
  p: [number, number, number];
  r: [number, number, number];
  s: number;
  c?: string;
}[] = [
  { p: [-2.1, 3.4, 1], r: [0.4, 0.6, 0.3], s: 0.9 },
  { p: [2.2, 2.6, -1.5], r: [-0.3, -0.8, -0.2], s: 1.1, c: "#0F2A63" },
  { p: [-2.4, -2.9, -0.5], r: [0.2, 1.2, 0.5], s: 1 },
  { p: [2.0, -3.6, 2], r: [0.6, -0.4, -0.4], s: 0.8, c: "#0F2A63" },
  { p: [0.3, 5.2, -5], r: [0.1, 0.9, 0.2], s: 1.2 },
  { p: [-0.6, -5.4, -6], r: [-0.4, 0.2, 0.6], s: 1.3, c: "#0F2A63" },
  { p: [3.4, 0.4, -7], r: [0.2, -1.2, 0.1], s: 1.4 },
  { p: [-3.6, 0.8, -9], r: [0.5, 0.8, -0.3], s: 1.5, c: "#0F2A63" },
  // Books on the camera path for the fly-through
  { p: [1.1, 0.9, 3.5], r: [0.3, 0.5, 0.2], s: 0.7 },
  { p: [-1.2, -1.1, 4.8], r: [-0.2, -0.7, 0.4], s: 0.7, c: "#0F2A63" },
];

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const len = um.scenes.hook + um.overlap;
  // Slow dolly forward, then accelerate through the books.
  const camZ =
    frame < 70
      ? tween(frame, [0, 70], [13, 10], EASE_IN_OUT)
      : tween(frame, [70, len], [10, 2.2], EASE_IN);
  const textOut = tween(frame, [74, 96], [0, 1], EASE_IN);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 90% 60% at 50% 45%, #0B1F4D 0%, ${um.colors.bg} 45%, ${um.colors.bgDeep} 100%)`,
      }}
    >
      <ParticleField mode="forward" seed="s1" count={110} speed={frame > 70 ? 2.2 : 1} />
      <ThreeCanvas width={1080} height={1920} camera={{ fov: 50, position: [0, 0, 13] }}>
        <fog attach="fog" args={[um.colors.bgDeep, 9, 24]} />
        <StudioLights />
        <CameraRig position={[Math.sin(frame * 0.02) * 0.3, Math.cos(frame * 0.015) * 0.2, camZ]} />
        {BOOKS.map((b, i) => (
          <Book3D key={i} position={b.p} rotation={b.r} scale={b.s} cover={b.c} phase={i * 1.7} spin={0.25 + (i % 3) * 0.08} />
        ))}
      </ThreeCanvas>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          padding: "0 80px",
          opacity: 1 - textOut,
          transform: `scale(${1 + textOut * 0.5})`,
          filter: `blur(${textOut * 14}px)`,
        }}
      >
        <WordReveal
          text={"Looking for a\ncareer that makes\na difference?"}
          start={6}
          stagger={4}
          highlight={["difference"]}
          fontSize={92}
          align="center"
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
