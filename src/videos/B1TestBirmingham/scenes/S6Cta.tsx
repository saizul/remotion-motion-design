import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_IN_OUT, EASE_OUT, tween } from "../anim";
import { Clip } from "../components/Clip";
import { GlassCard } from "../components/GlassCard";
import { Icon, type IconName } from "../components/Icons";
import { BrandRibbon, BrightBackdrop, LightStreaks } from "../components/Light";
import { Particles } from "../components/Particles";
import { TypeText } from "../components/TypeText";
import { TYPE_CUES } from "../typing";
import { Book, GradCap, Notebook, SpeechBubble } from "../components/three/Objects";
import { DaylightStudio } from "../components/three/Studio";
import { b1 } from "../theme";

type Vec3 = [number, number, number];

// Elements fly in from scattered positions and settle beside/above the logo, clear of the text.
const RING: { kind: "book" | "cap" | "bubble" | "note"; at: Vec3; from: Vec3; cover?: "navy" | "red" | "white"; color?: "blue" | "red" | "white" }[] = [
  { kind: "book", at: [-2.6, 4.5, -2], from: [-9, 8, -6], cover: "navy" },
  { kind: "bubble", at: [-2.75, 2.3, -2], from: [-9, -4, -4], color: "red" },
  { kind: "cap", at: [2.6, 4.7, -2], from: [9, 10, -4] },
  { kind: "bubble", at: [2.75, 2.5, -2], from: [10, -2, -5], color: "blue" },
  { kind: "note", at: [-1.3, 5.6, -4], from: [-4, 12, -8] },
  { kind: "book", at: [1.4, 5.7, -4], from: [5, 12, -8], cover: "red" },
];

// Each row's icon pops in just before its text types.
const ROWS: { icon: IconName; cue: (typeof TYPE_CUES)["ctaPhone"]; at: number }[] = [
  { icon: "phone", cue: TYPE_CUES.ctaPhone, at: TYPE_CUES.ctaPhone.start - 6 },
  { icon: "mail", cue: TYPE_CUES.ctaEmail, at: TYPE_CUES.ctaEmail.start - 6 },
  { icon: "globe", cue: TYPE_CUES.ctaWeb, at: TYPE_CUES.ctaWeb.start - 6 },
];

export const S6Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const gather = tween(frame, [0, 42], [0, 1], EASE_OUT);
  const logo = spring({ frame: frame - 14, fps, config: { damping: 14 } });
  const wipe = tween(frame, [14, 40], [0, 1], EASE_IN_OUT);
  const glow = 0.5 + 0.5 * Math.sin(frame * 0.08);
  const s = (d: number) => spring({ frame: frame - d, fps, config: { damping: 200 }, durationInFrames: 20 });
  const btn = spring({ frame: frame - 46, fps, config: { damping: 11 } });
  const pulse = frame > 80 ? Math.sin((frame - 80) * 0.15) : 0;

  return (
    <AbsoluteFill>
      <BrightBackdrop focusY={28} />
      <AbsoluteFill style={{ opacity: 0.28, height: 1300 }}>
        <Clip clip="c" duration={150} blur={8} zoom={[1.15, 1.2]} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 40% at 50% 26%, rgba(255,255,255,0.95), rgba(255,255,255,0) 70%)" }} />
      <LightStreaks start={20} />
      <Particles seed="b1s6" count={60} opacity={0.6} />
      <ThreeCanvas width={1080} height={1920} camera={{ fov: 40, position: [0, 0, 14] }}>
        <DaylightStudio />
        {RING.map((r, i) => {
          const target: Vec3 = [r.at[0] + Math.sin(frame * 0.02 + i) * 0.12, r.at[1], r.at[2]];
          const p: Vec3 = [
            r.from[0] + (target[0] - r.from[0]) * gather,
            r.from[1] + (target[1] - r.from[1]) * gather,
            r.from[2] + (target[2] - r.from[2]) * gather,
          ];
          if (r.kind === "book") return <Book key={i} position={p} rotation={[0.3, 0.6, 0.2]} scale={0.55} cover={r.cover} phase={i} />;
          if (r.kind === "cap") return <GradCap key={i} position={p} scale={0.5} phase={i} />;
          if (r.kind === "note") return <Notebook key={i} position={p} scale={0.5} phase={i} />;
          return <SpeechBubble key={i} position={p} scale={0.38} color={r.color} phase={i} />;
        })}
      </ThreeCanvas>

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 250 }}>
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              inset: -120,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(255,255,255,${0.9 * logo}) 0%, rgba(191,214,255,${0.35 * glow * logo}) 45%, transparent 70%)`,
            }}
          />
          <div
            style={{
              position: "relative",
              transform: `scale(${0.8 + logo * 0.2})`,
              maskImage: `linear-gradient(90deg, #000 ${wipe * 120 - 20}%, transparent ${wipe * 120}%)`,
              WebkitMaskImage: `linear-gradient(90deg, #000 ${wipe * 120 - 20}%, transparent ${wipe * 120}%)`,
              filter: `drop-shadow(0 0 ${18 + glow * 16}px rgba(47,111,228,0.35))`,
            }}
          >
            <Img src={staticFile("b1/logo-color.png")} style={{ width: 600 }} />
          </div>
        </div>

        <div
          style={{
            marginTop: 40,
          }}
        >
          <TypeText cue={TYPE_CUES.ctaHeadline} highlight={["Confidence"]} fontSize={66} letterSpacing={-1.5} align="center" />
        </div>

        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            gap: 26,
            padding: "26px 40px 26px 70px",
            borderRadius: 999,
            background: b1.redGradient,
            color: "#FFFFFF",
            fontFamily: b1.fonts.display,
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: 2,
            transform: `scale(${btn * (1 + pulse * 0.03)})`,
            boxShadow: `0 20px 50px rgba(200,16,46,${0.35 + pulse * 0.1})`,
          }}
        >
          JOIN TODAY
          <div style={{ width: 70, height: 70, borderRadius: 35, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={38} height={38} viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" stroke={b1.colors.red} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div style={{ marginTop: 50, opacity: s(52), transform: `translateY(${(1 - s(52)) * 40}px)` }}>
          <GlassCard width={880} height={330} radius={34} outline={tween(frame, [52, 90], [0, 1])} sheen={false}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 30, height: "100%", padding: "0 50px" }}>
              {ROWS.map((r) => (
                <div
                  key={r.icon}
                  style={{ display: "flex", alignItems: "center", gap: 28, opacity: s(r.at), transform: `translateX(${(1 - s(r.at)) * -40}px)` }}
                >
                  <div
                    style={{
                      width: 70,
                      height: 70,
                      flexShrink: 0,
                      borderRadius: 35,
                      background: b1.colors.red,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name={r.icon} size={36} color="#FFFFFF" progress={tween(frame, [r.at, r.at + 16], [0, 1])} />
                  </div>
                  <TypeText cue={r.cue} font={b1.fonts.body} fontSize={40} weight={600} letterSpacing={0} />
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </AbsoluteFill>
      <BrandRibbon progress={tween(frame, [20, 60], [0, 1], EASE_OUT)} y={1720} />
    </AbsoluteFill>
  );
};
