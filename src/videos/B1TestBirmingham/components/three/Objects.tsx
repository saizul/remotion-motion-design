import { useCurrentFrame } from "remotion";
import { NAVY, RED, WHITE } from "./Studio";

type Vec3 = [number, number, number];

const useFloat = (phase: number) => {
  const t = useCurrentFrame() / 30;
  return { t, bob: Math.sin(t * 1.1 + phase) * 0.12 };
};

// Hardcover book in brand colours with white foil bands.
export const Book: React.FC<{ position: Vec3; rotation?: Vec3; scale?: number; cover?: "navy" | "red" | "white"; spin?: number; phase?: number }> = ({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  cover = "navy",
  spin = 0.3,
  phase = 0,
}) => {
  const { t, bob } = useFloat(phase);
  const mat = cover === "navy" ? NAVY : cover === "red" ? RED : WHITE;
  const band = cover === "white" ? RED : WHITE;
  return (
    <group
      position={[position[0], position[1] + bob, position[2]]}
      rotation={[rotation[0] + Math.sin(t * 0.6 + phase) * 0.15, rotation[1] + t * spin, rotation[2]]}
      scale={scale}
    >
      <mesh position={[0.04, 0, 0]}>
        <boxGeometry args={[1.34, 1.9, 0.26]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
      </mesh>
      {[0.155, -0.155].map((z) => (
        <mesh key={z} position={[0, 0, z]}>
          <boxGeometry args={[1.46, 2, 0.05]} />
          <meshStandardMaterial {...mat} />
        </mesh>
      ))}
      <mesh position={[-0.71, 0, 0]}>
        <boxGeometry args={[0.06, 2, 0.36]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {[0.62, -0.62].map((y) => (
        <mesh key={y} position={[-0.1, y, 0.183]}>
          <boxGeometry args={[0.9, 0.06, 0.01]} />
          <meshStandardMaterial {...band} />
        </mesh>
      ))}
    </group>
  );
};

// Open book (two fanned page blocks on a spine).
export const OpenBook: React.FC<{ position?: Vec3; scale?: number; open?: number }> = ({ position = [0, 0, 0], scale = 1, open = 1 }) => {
  const a = 0.15 + (1 - open) * 1.2;
  return (
    <group position={position} scale={scale} rotation={[-0.85, 0, 0]}>
      {[-1, 1].map((s) => (
        <group key={s} rotation={[0, s * a, 0]}>
          <mesh position={[s * 0.95, 0, 0.06]}>
            <boxGeometry args={[1.9, 2.6, 0.12]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.85} />
          </mesh>
          <mesh position={[s * 0.97, 0, -0.02]}>
            <boxGeometry args={[2, 2.7, 0.05]} />
            <meshStandardMaterial {...NAVY} />
          </mesh>
          {[0.8, 0.45, 0.1, -0.25, -0.6].map((y) => (
            <mesh key={y} position={[s * 0.95, y, 0.125]}>
              <boxGeometry args={[1.3, 0.05, 0.005]} />
              <meshStandardMaterial color="#C9D6EE" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

export const GradCap: React.FC<{ position: Vec3; scale?: number; phase?: number }> = ({ position, scale = 1, phase = 0 }) => {
  const { t, bob } = useFloat(phase);
  return (
    <group position={[position[0], position[1] + bob, position[2]]} rotation={[0.45 + Math.sin(t * 0.7 + phase) * 0.12, t * 0.4 + phase, 0.1]} scale={scale}>
      <mesh rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[1.9, 0.07, 1.9]} />
        <meshStandardMaterial {...NAVY} />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.62, 0.7, 0.52, 40]} />
        <meshStandardMaterial {...NAVY} />
      </mesh>
      <mesh position={[0, 0.07, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial {...RED} />
      </mesh>
      <mesh position={[0.66, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 1.32, 8]} />
        <meshStandardMaterial {...RED} />
      </mesh>
      <mesh position={[1.32, -0.1, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.32, 8]} />
        <meshStandardMaterial {...RED} />
      </mesh>
      <mesh position={[1.32, -0.38, 0]}>
        <cylinderGeometry args={[0.05, 0.09, 0.35, 12]} />
        <meshStandardMaterial {...RED} />
      </mesh>
    </group>
  );
};

// Rounded speech bubble with three dots.
export const SpeechBubble: React.FC<{ position: Vec3; scale?: number; color?: "blue" | "red" | "white"; phase?: number }> = ({
  position,
  scale = 1,
  color = "blue",
  phase = 0,
}) => {
  const { t, bob } = useFloat(phase);
  const body = color === "blue" ? { color: "#2F6FE4", metalness: 0.1, roughness: 0.3 } : color === "red" ? RED : { ...WHITE, color: "#FFFFFF" };
  const dot = color === "white" ? NAVY : { color: "#FFFFFF", metalness: 0, roughness: 0.5 };
  return (
    <group position={[position[0], position[1] + bob, position[2]]} rotation={[0.2, Math.sin(t * 0.8 + phase) * 0.5, Math.sin(t * 0.5 + phase) * 0.1]} scale={scale}>
      <mesh scale={[1.3, 0.9, 0.45]}>
        <sphereGeometry args={[1, 40, 32]} />
        <meshStandardMaterial {...body} />
      </mesh>
      <mesh position={[-0.75, -0.75, 0]} rotation={[0, 0, 0.7]}>
        <coneGeometry args={[0.28, 0.6, 16]} />
        <meshStandardMaterial {...body} />
      </mesh>
      {[-0.45, 0, 0.45].map((x) => (
        <mesh key={x} position={[x, 0, 0.44]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial {...dot} />
        </mesh>
      ))}
    </group>
  );
};

// Spiral notebook.
export const Notebook: React.FC<{ position: Vec3; scale?: number; phase?: number }> = ({ position, scale = 1, phase = 0 }) => {
  const { t, bob } = useFloat(phase);
  return (
    <group position={[position[0], position[1] + bob, position[2]]} rotation={[0.5, t * 0.35 + phase, 0.3]} scale={scale}>
      <mesh>
        <boxGeometry args={[1.3, 1.7, 0.1]} />
        <meshStandardMaterial {...RED} />
      </mesh>
      {new Array(7).fill(0).map((_, i) => (
        <mesh key={i} position={[-0.66, 0.7 - i * 0.23, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.07, 0.02, 8, 16]} />
          <meshStandardMaterial color="#D9DEE8" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0.1, 0.3, 0.055]}>
        <boxGeometry args={[0.8, 0.3, 0.005]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
};
