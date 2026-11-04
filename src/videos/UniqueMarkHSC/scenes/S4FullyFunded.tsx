import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_IN, EASE_IN_OUT, EASE_OUT, tween } from "../anim";
import { LightRays } from "../components/Atmosphere";
import { ParticleField } from "../components/ParticleField";
import { Badge3D } from "../components/three/Badge3D";
import { CameraRig, StudioLights } from "../components/three/Studio";
import { um } from "../theme";

const BADGE_Y = 820;

// Energy particles orbiting the badge on a tilted ellipse.
const Orbit: React.FC<{ appear: number }> = ({ appear }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {new Array(70).fill(0).map((_, i) => {
        const speed = 0.02 + random(`o${i}`) * 0.03;
        const a = random(`oa${i}`) * Math.PI * 2 + frame * speed;
        const rx = 380 + random(`orx${i}`) * 160;
        const ry = 120 + random(`ory${i}`) * 60;
        const x = 540 + Math.cos(a) * rx;
        const y = BADGE_Y + Math.sin(a) * ry - Math.cos(a) * 60;
        const front = Math.sin(a) > 0;
        const gold = i % 3 !== 0;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={(front ? 5 : 3) * (0.6 + random(`os${i}`))}
            fill={gold ? um.colors.goldLight : um.colors.blueSoft}
            opacity={appear * (front ? 0.95 : 0.4)}
            style={{ filter: `drop-shadow(0 0 8px ${gold ? um.colors.goldLight : um.colors.blue})` }}
          />
        );
      })}
    </svg>
  );
};

export const S4FullyFunded: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = um.scenes.funded + um.overlap;
  const emerge = spring({ frame, fps, config: { damping: 16, mass: 1.2 } });
  const spinIn = tween(frame, [0, 45], [-Math.PI * 2, 0], EASE_OUT);
  const expand = tween(frame, [len - 30, len], [0, 1], EASE_IN);
  const title = tween(frame, [22, 48], [0, 1]);
  const sub = spring({ frame: frame - 44, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% ${BADGE_Y}px, #1A4596 0%, #0B1F4D 32%, ${um.colors.bgDeep} 75%)`,
        overflow: "hidden",
      }}
    >
      <LightRays x={540} y={BADGE_Y} opacity={0.8 * emerge} />
      <ParticleField seed="s4" count={60} opacity={0.6} />
      <Orbit appear={tween(frame, [15, 40], [0, 1])} />
      <ThreeCanvas width={1080} height={1920} camera={{ fov: 35, position: [0, 0, 10] }}>
        <StudioLights envIntensity={0.8} />
        <CameraRig position={[0, 0, 10 - expand * 6]} />
        <group position={[0, 0.45, -8 + emerge * 8]} scale={0.62 * emerge}>
          <Badge3D rotationY={spinIn + Math.sin(frame * 0.05) * 0.35} rotationX={Math.sin(frame * 0.04) * 0.12} />
        </group>
      </ThreeCanvas>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 1250, opacity: 1 - expand }}>
        <div
          style={{
            fontFamily: um.fonts.display,
            fontSize: 132,
            fontWeight: 800,
            letterSpacing: 40 - title * 34,
            opacity: title,
            transform: `scale(${0.85 + title * 0.15})`,
            backgroundImage: um.goldGradient,
            backgroundSize: "220% 100%",
            backgroundPosition: `${(frame * 1.5) % 220}% 0`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: "drop-shadow(0 6px 30px rgba(235,211,148,0.45))",
            whiteSpace: "nowrap",
          }}
        >
          FULLY FUNDED
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: um.fonts.body,
            fontSize: 46,
            fontWeight: 500,
            color: um.colors.white,
            opacity: sub,
            transform: `translateY(${(1 - sub) * 24}px)`,
          }}
        >
          Start your learning journey today.
        </div>
      </AbsoluteFill>
      {/* Badge energy expands outward into the next scene */}
      {expand > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 540 - 150,
            top: BADGE_Y - 150,
            width: 300,
            height: 300,
            borderRadius: "50%",
            border: `6px solid ${um.colors.goldLight}`,
            boxShadow: `0 0 60px ${um.colors.goldLight}, inset 0 0 60px ${um.colors.goldLight}`,
            transform: `scale(${1 + tween(expand, [0, 1], [0, 9], EASE_IN_OUT)})`,
            opacity: 1 - expand * 0.7,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
