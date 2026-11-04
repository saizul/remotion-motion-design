import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Bright daylight studio: strong environment, soft key light, cool fill.
export const DaylightStudio: React.FC<{ envIntensity?: number }> = ({ envIntensity = 1 }) => {
  const { gl, scene } = useThree();
  const env = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const tex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    return tex;
  }, [gl]);
  scene.environment = env;
  scene.environmentIntensity = envIntensity;
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 6, 8]} intensity={2.2} color="#FFFFFF" />
      <directionalLight position={[-6, -2, 4]} intensity={0.8} color="#BFD6FF" />
    </>
  );
};

export const CameraRig: React.FC<{ position: [number, number, number]; lookAt?: [number, number, number] }> = ({
  position,
  lookAt = [0, 0, 0],
}) => {
  const { camera } = useThree();
  camera.position.set(...position);
  camera.lookAt(...lookAt);
  return null;
};

export const NAVY = { color: "#012169", metalness: 0.2, roughness: 0.4 } as const;
export const RED = { color: "#C8102E", metalness: 0.15, roughness: 0.4 } as const;
export const WHITE = { color: "#F4F7FC", metalness: 0.05, roughness: 0.6 } as const;
