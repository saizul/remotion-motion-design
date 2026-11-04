import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Reflection environment + blue/gold key lights shared by all 3D scenes.
export const StudioLights: React.FC<{ envIntensity?: number }> = ({ envIntensity = 0.55 }) => {
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
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 6]} intensity={2.4} color="#FFE6B5" />
      <pointLight position={[-5, -2, 4]} intensity={60} color="#3D7BFF" />
      <pointLight position={[3, 4, -4]} intensity={45} color="#EBD394" />
    </>
  );
};

// Positions the camera every frame (Remotion re-renders per frame).
export const CameraRig: React.FC<{
  position: [number, number, number];
  lookAt?: [number, number, number];
}> = ({ position, lookAt = [0, 0, 0] }) => {
  const { camera } = useThree();
  camera.position.set(...position);
  camera.lookAt(...lookAt);
  return null;
};

export const GOLD = { color: "#D9B864", metalness: 1, roughness: 0.26 } as const;
export const NAVY = { color: "#1B3C7F", metalness: 0.35, roughness: 0.42 } as const;
