import { useCurrentFrame } from "remotion";
import { GOLD } from "./Studio";

type Props = {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  cover?: string;
  spin?: number;
  phase?: number;
};

// Hardcover book built from primitives: covers, pages, spine, gold foil bands.
export const Book3D: React.FC<Props> = ({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  cover = "#1B3C7F",
  spin = 0.3,
  phase = 0,
}) => {
  const t = useCurrentFrame() / 30;
  const bob = Math.sin(t * 1.1 + phase) * 0.12;
  const coverMat = <meshStandardMaterial color={cover} metalness={0.25} roughness={0.38} />;
  const goldMat = <meshStandardMaterial {...GOLD} />;
  return (
    <group
      position={[position[0], position[1] + bob, position[2]]}
      rotation={[
        rotation[0] + Math.sin(t * 0.6 + phase) * 0.18,
        rotation[1] + t * spin,
        rotation[2] + Math.cos(t * 0.5 + phase) * 0.08,
      ]}
      scale={scale}
    >
      <mesh position={[0.04, 0, 0]}>
        <boxGeometry args={[1.34, 1.9, 0.26]} />
        <meshStandardMaterial color="#F2E8D2" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0, 0.155]}>
        <boxGeometry args={[1.46, 2, 0.05]} />
        {coverMat}
      </mesh>
      <mesh position={[0, 0, -0.155]}>
        <boxGeometry args={[1.46, 2, 0.05]} />
        {coverMat}
      </mesh>
      <mesh position={[-0.71, 0, 0]}>
        <boxGeometry args={[0.06, 2, 0.36]} />
        {coverMat}
      </mesh>
      {[0.62, -0.62].map((y) => (
        <mesh key={y} position={[-0.1, y, 0.183]}>
          <boxGeometry args={[0.9, 0.045, 0.01]} />
          {goldMat}
        </mesh>
      ))}
      {[0.75, -0.75].map((y) => (
        <mesh key={y} position={[-0.745, y, 0]}>
          <boxGeometry args={[0.012, 0.05, 0.3]} />
          {goldMat}
        </mesh>
      ))}
    </group>
  );
};
