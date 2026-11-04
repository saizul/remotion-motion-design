import { GOLD, NAVY } from "./Studio";

const SCALLOPS = 28;

// Award rosette: scalloped gold medal, navy face, gold ring, check mark, ribbons.
export const Badge3D: React.FC<{ rotationY?: number; rotationX?: number }> = ({
  rotationY = 0,
  rotationX = 0,
}) => {
  const gold = <meshStandardMaterial {...GOLD} />;
  return (
    <group rotation={[rotationX, rotationY, 0]}>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.5, -1.55, -0.12]} rotation={[0, 0, s * 0.28]}>
          <boxGeometry args={[0.6, 1.2, 0.05]} />
          <meshStandardMaterial {...NAVY} />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.6, 1.6, 0.24, 64]} />
        {gold}
      </mesh>
      {new Array(SCALLOPS).fill(0).map((_, i) => {
        const a = (i / SCALLOPS) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 1.6, Math.sin(a) * 1.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.22, 20]} />
            {gold}
          </mesh>
        );
      })}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.22, 1.22, 0.28, 64]} />
        <meshStandardMaterial color="#12306E" metalness={0.5} roughness={0.3} />
      </mesh>
      {[1, -1].map((s) => (
        <mesh key={s} position={[0, 0, s * 0.15]}>
          <torusGeometry args={[1.08, 0.045, 16, 96]} />
          {gold}
        </mesh>
      ))}
      {[1, -1].map((s) => (
        <group key={s} position={[0, 0.02, s * 0.17]} rotation={[0, s === 1 ? 0 : Math.PI, 0]}>
          <mesh position={[-0.31, -0.17, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[0.66, 0.17, 0.1]} />
            {gold}
          </mesh>
          <mesh position={[0.215, 0.03, 0]} rotation={[0, 0, 0.86]}>
            <boxGeometry args={[1.15, 0.17, 0.1]} />
            {gold}
          </mesh>
        </group>
      ))}
    </group>
  );
};
