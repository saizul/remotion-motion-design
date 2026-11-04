import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { EASE_OUT, tween } from "../anim";
import { LogoPlate } from "../components/Logo";
import { Backdrop, Dust } from "../components/Space";
import { TypeText } from "../components/TypeText";
import { cue } from "../typing";
import { TextShade } from "./common";

type B = { x: number; z: number; h: number; d: number };

const BUILDINGS: B[] = (() => {
  const out: B[] = [];
  for (let i = -5; i <= 5; i++)
    for (let j = -5; j <= 5; j++) {
      if (random(`b${i}${j}`) < 0.25) continue;
      const dist = Math.hypot(i, j);
      out.push({ x: i * 2.2, z: j * 2.2, h: 0.8 + random(`h${i}${j}`) * (7 - dist * 0.5), d: dist });
    }
  return out;
})();

// Pairs of building tops joined by network links.
const LINKS = new Array(18).fill(0).map((_, k) => [
  Math.floor(random(`la${k}`) * BUILDINGS.length),
  Math.floor(random(`lb${k}`) * BUILDINGS.length),
]);

const Building: React.FC<{ b: B; grow: number }> = ({ b, grow }) => {
  const h = Math.max(0.01, b.h * grow);
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(1.5, 1, 1.5)), []);
  return (
    <group position={[b.x, h / 2, b.z]} scale={[1, h, 1]}>
      <mesh>
        <boxGeometry args={[1.5, 1, 1.5]} />
        <meshStandardMaterial color="#0A1428" metalness={0.4} roughness={0.5} emissive="#0B2A66" emissiveIntensity={0.12} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#5CC8FF" transparent opacity={0.55} />
      </lineSegments>
      <mesh position={[0, 0.5, 0]} scale={[1, 0.02 / h, 1]}>
        <boxGeometry args={[1.5, 1, 1.5]} />
        <meshBasicMaterial color="#2F80FF" transparent opacity={0.8 * grow} />
      </mesh>
    </group>
  );
};

const Link: React.FC<{ a: B; b: B; draw: number; phase: number }> = ({ a, b, draw, phase }) => {
  const frame = useCurrentFrame();
  const line = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(a.x, a.h + 0.05, a.z), new THREE.Vector3(b.x, b.h + 0.05, b.z)]);
    return new THREE.Line(g, new THREE.LineBasicMaterial({ color: "#5CC8FF", transparent: true, opacity: 0.8 }));
  }, [a, b]);
  (line.material as THREE.LineBasicMaterial).opacity = 0.8 * draw;
  const t = (frame * 0.02 + phase) % 1;
  return (
    <group>
      <primitive object={line} />
      {draw >= 1 ? (
        <mesh position={[a.x + (b.x - a.x) * t, a.h + (b.h - a.h) * t + 0.05, a.z + (b.z - a.z) * t]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      ) : null}
    </group>
  );
};

// Digital city rises from a grid, platforms light up, links connect, the logo beacon appears in the sky.
export const S03Ecosystem: React.FC = () => {
  const frame = useCurrentFrame();
  const angle = 0.7 + frame * 0.0022;
  const radius = tween(frame, [0, 240], [30, 24]);
  const beacon = tween(frame, [130, 160], [0, 1], EASE_OUT);
  return (
    <AbsoluteFill>
      <Backdrop tint="#0A1A3E" focusY={30} />
      <ThreeCanvas
        width={1920}
        height={1080}
        camera={{ fov: 40, position: [Math.cos(angle) * radius, 13, Math.sin(angle) * radius] }}
      >
        <CamLook angle={angle} radius={radius} />
        <fog attach="fog" args={["#03050A", 20, 55]} />
        <ambientLight intensity={0.25} />
        <directionalLight position={[10, 20, 10]} intensity={0.5} color="#9CC8FF" />
        <pointLight position={[0, 12, 0]} intensity={70 * beacon + 15} color="#5CC8FF" />
        <gridHelper args={[40, 40, "#1B3A7A", "#0E2250"]} />
        {BUILDINGS.map((b, i) => (
          <Building key={i} b={b} grow={tween(frame, [8 + b.d * 7, 40 + b.d * 7], [0, 1], EASE_OUT)} />
        ))}
        {LINKS.map(([ia, ib], k) => (
          <Link key={k} a={BUILDINGS[ia]} b={BUILDINGS[ib]} draw={tween(frame, [90 + (k % 4) * 10, 110 + (k % 4) * 10], [0, 1])} phase={k * 0.37} />
        ))}
      </ThreeCanvas>
      <Dust seed="s3" count={70} opacity={0.7} />
      {/* Logo beacon with a light beam down to the city */}
      <div style={{ position: "absolute", left: 960 - 210, top: 70 + Math.sin(frame * 0.05) * 8, opacity: beacon, transform: `scale(${0.8 + beacon * 0.2})` }}>
        <div
          style={{
            position: "absolute",
            left: 210 - 90,
            top: 120,
            width: 180,
            height: 520,
            background: "linear-gradient(180deg, rgba(92,200,255,0.55), rgba(92,200,255,0))",
            clipPath: "polygon(35% 0, 65% 0, 100% 100%, 0 100%)",
            filter: "blur(6px)",
          }}
        />
        <LogoPlate width={420} energy={beacon} />
      </div>
      <TextShade side="bottom" />
      <div style={{ position: "absolute", left: 110, top: 760 }}>
        {(["eco0", "eco1", "eco2"] as const).map((id) => (
          <TypeText key={id} cue={cue(id)} fontSize={54} weight={700} lineHeight={1.25} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Keeps the R3F camera aimed at the city centre while it orbits.
const CamLook: React.FC<{ angle: number; radius: number }> = ({ angle, radius }) => {
  const { camera } = useThree();
  camera.position.set(Math.cos(angle) * radius, 13, Math.sin(angle) * radius);
  camera.lookAt(0, 2, 0);
  return null;
};
