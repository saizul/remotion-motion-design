import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_IN_OUT, tween } from "../anim";
import { Bokeh, LightRays } from "../components/Atmosphere";
import { GlassCard } from "../components/GlassCard";
import { Icon, type IconName } from "../components/Icons";
import { ParticleField } from "../components/ParticleField";
import { Book3D } from "../components/three/Book3D";
import { GradCap3D } from "../components/three/GradCap3D";
import { CameraRig, StudioLights } from "../components/three/Studio";
import { um } from "../theme";

const ROWS: { icon: IconName; lines: string[]; at: number }[] = [
  { icon: "phone", lines: [`${um.contact.phones[0]}   |   ${um.contact.phones[1]}`], at: 50 },
  { icon: "mail", lines: [um.contact.email], at: 60 },
  { icon: "pin", lines: [...um.contact.address], at: 70 },
];

export const S8Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = tween(frame, [4, 34], [0, 1], EASE_IN_OUT);
  const s = (d: number) => spring({ frame: frame - d, fps, config: { damping: 200 }, durationInFrames: 20 });
  const btn = spring({ frame: frame - 82, fps, config: { damping: 12 } });
  const pulse = frame > 95 ? Math.sin((frame - 95) * 0.14) : 0;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 90% 55% at 50% 40%, #12306E 0%, ${um.colors.bg} 48%, ${um.colors.bgDeep} 100%)`,
        overflow: "hidden",
      }}
    >
      <LightRays x={540} y={300} opacity={0.35} />
      {/* Floating 3D elements, softly out of focus */}
      <AbsoluteFill style={{ filter: "blur(5px)", opacity: 0.6 }}>
        <ThreeCanvas width={1080} height={1920} camera={{ fov: 45, position: [0, 0, 12] }}>
          <fog attach="fog" args={[um.colors.bgDeep, 10, 26]} />
          <StudioLights />
          <CameraRig position={[0, Math.sin(frame * 0.01) * 0.3, 12 - frame * 0.01]} />
          <Book3D position={[-3.2, 5.5, -4]} rotation={[0.3, 0.5, 0.2]} scale={1.2} phase={1} />
          <Book3D position={[3.4, -5.8, -3]} rotation={[-0.3, -0.6, 0.3]} scale={1.1} phase={2} cover="#0F2A63" />
          <GradCap3D position={[3.2, 4.8, -5]} scale={1.2} phase={0.5} />
          <GradCap3D position={[-3.4, -4.6, -6]} scale={1} phase={2.2} />
          <Book3D position={[-4, 0, -9]} rotation={[0.2, 1, 0]} scale={1.4} phase={3} />
          <Book3D position={[4.2, 0.6, -10]} rotation={[0.5, -1, 0]} scale={1.4} phase={4} cover="#0F2A63" />
        </ThreeCanvas>
      </AbsoluteFill>
      <Bokeh seed="s8" opacity={0.3} />
      <ParticleField seed="s8" count={70} opacity={0.75} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 220 }}>
        {/* Logo reveal: light-edge wipe + settle */}
        <div
          style={{
            position: "relative",
            transform: `scale(${0.92 + logo * 0.08})`,
            maskImage: `linear-gradient(90deg, #000 ${logo * 120 - 20}%, transparent ${logo * 120}%)`,
            WebkitMaskImage: `linear-gradient(90deg, #000 ${logo * 120 - 20}%, transparent ${logo * 120}%)`,
            filter: `drop-shadow(0 0 ${30 * (1 - logo) + 12}px rgba(235,211,148,0.45))`,
          }}
        >
          <Img src={staticFile("um/logo-white.png")} style={{ width: 820 }} />
        </div>

        <div style={{ marginTop: 90, textAlign: "center", opacity: s(26), transform: `translateY(${(1 - s(26)) * 30}px)` }}>
          <div style={{ fontFamily: um.fonts.display, fontSize: 54, fontWeight: 600, color: um.colors.goldLight }}>
            Level 3 Diploma in
          </div>
          <div
            style={{
              fontFamily: um.fonts.display,
              fontSize: 88,
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 1.05,
              color: um.colors.white,
            }}
          >
            Health &amp; Social Care
          </div>
        </div>

        <div
          style={{
            marginTop: 30,
            padding: "14px 44px",
            borderRadius: 999,
            border: `2px solid ${um.colors.goldLight}`,
            background: "rgba(235,211,148,0.12)",
            fontFamily: um.fonts.display,
            fontSize: 42,
            fontWeight: 800,
            letterSpacing: 8,
            color: um.colors.goldLight,
            opacity: s(38),
            transform: `scale(${0.8 + s(38) * 0.2})`,
            boxShadow: "0 0 30px rgba(235,211,148,0.3)",
          }}
        >
          FULLY FUNDED
        </div>

        <div style={{ marginTop: 50, opacity: s(46), transform: `translateY(${(1 - s(46)) * 40}px)` }}>
          <GlassCard width={900} height={420} radius={36} outline={tween(frame, [46, 86], [0, 1])} sheen={false}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 34, height: "100%", padding: "0 50px" }}>
              {ROWS.map((r) => (
                <div
                  key={r.icon}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 30,
                    opacity: s(r.at),
                    transform: `translateX(${(1 - s(r.at)) * -40}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 76,
                      height: 76,
                      flexShrink: 0,
                      borderRadius: 38,
                      background: "rgba(61,123,255,0.25)",
                      border: "1px solid rgba(235,211,148,0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name={r.icon} size={38} progress={tween(frame, [r.at, r.at + 16], [0, 1])} />
                  </div>
                  <div style={{ fontFamily: um.fonts.body, color: um.colors.white }}>
                    {r.lines.map((l, i) => (
                      <div key={l} style={{ fontSize: i === 0 ? 40 : 36, fontWeight: i === 0 ? 600 : 500, opacity: i === 0 ? 1 : 0.8 }}>
                        {l}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div style={{ position: "relative", marginTop: 56 }}>
          {/* Soft pulse ring */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 999,
              border: `3px solid ${um.colors.goldLight}`,
              transform: `scale(${1 + ((frame - 95) % 45) / 45 * 0.18})`,
              opacity: frame > 95 ? 0.6 * (1 - ((frame - 95) % 45) / 45) : 0,
            }}
          />
          <div
            style={{
              padding: "36px 96px",
              borderRadius: 999,
              background: um.goldGradient,
              fontFamily: um.fonts.display,
              fontSize: 54,
              fontWeight: 800,
              letterSpacing: 4,
              color: um.colors.bgDeep,
              transform: `scale(${btn * (1 + pulse * 0.025)})`,
              boxShadow: `0 20px 60px rgba(235,211,148,${0.35 + pulse * 0.15})`,
            }}
          >
            ENQUIRE NOW
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
