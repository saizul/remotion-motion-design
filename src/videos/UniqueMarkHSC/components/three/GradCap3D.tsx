import { useCurrentFrame } from "remotion";
import { GOLD } from "./Studio";

// Graduation mortarboard with gold button and tassel.
export const GradCap3D: React.FC<{
  position: [number, number, number];
  scale?: number;
  phase?: number;
}> = ({ position, scale = 1, phase = 0 }) => {
  const t = useCurrentFrame() / 30;
  return (
    <group
      position={[position[0], position[1] + Math.sin(t * 1.2 + phase) * 0.15, position[2]]}
      rotation={[0.45 + Math.sin(t * 0.7 + phase) * 0.12, t * 0.4 + phase, 0.1]}
      scale={scale}
    >
      <mesh rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[1.9, 0.07, 1.9]} />
        <meshStandardMaterial color="#0E2150" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.62, 0.7, 0.52, 40]} />
        <meshStandardMaterial color="#0E2150" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.07, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>
      <mesh position={[0.66, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 1.32, 8]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>
      <mesh position={[1.32, -0.1, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.32, 8]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>
      <mesh position={[1.32, -0.38, 0]}>
        <cylinderGeometry args={[0.05, 0.09, 0.35, 12]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>
    </group>
  );
};
