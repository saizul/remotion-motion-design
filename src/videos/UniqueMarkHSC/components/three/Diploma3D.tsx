import { useCurrentFrame } from "remotion";
import { GOLD, NAVY } from "./Studio";

// Rolled diploma scroll with navy ribbon and gold seal.
export const Diploma3D: React.FC<{ scale?: number; spinOffset?: number }> = ({
  scale = 1,
  spinOffset = 0,
}) => {
  const t = useCurrentFrame() / 30;
  return (
    <group
      scale={scale}
      rotation={[0.3 + t * 0.6, spinOffset - 0.35 + Math.sin(t * 0.9) * 0.35, -0.3]}
      position={[0, Math.sin(t * 1.3) * 0.1, 0]}
    >
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 2.4, 48]} />
        <meshStandardMaterial color="#F4EBD6" roughness={0.75} />
      </mesh>
      {[1.21, -1.21].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.31, 0.31, 0.04, 48]} />
          <meshStandardMaterial {...GOLD} />
        </mesh>
      ))}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.318, 0.318, 0.26, 48]} />
        <meshStandardMaterial {...NAVY} />
      </mesh>
      <mesh position={[0, -0.05, 0.36]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.06, 32]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.1, -0.42, 0.33]} rotation={[0.2, 0, s * 0.25]}>
          <boxGeometry args={[0.12, 0.5, 0.02]} />
          <meshStandardMaterial {...NAVY} />
        </mesh>
      ))}
    </group>
  );
};
