import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_OUT, tween } from "../../UniqueMarkHSC/anim";
import { GlassCard } from "../../B1TestBirmingham/components/GlassCard";
import { Icon, type IconName } from "../../B1TestBirmingham/components/Icons";
import { BrandRibbon, BrightBackdrop, LightStreaks } from "../../B1TestBirmingham/components/Light";
import { Particles } from "../../B1TestBirmingham/components/Particles";
import { BanglaType } from "../components/BanglaType";
import { Skyline } from "../components/Skyline";
import { bn } from "../theme";
import { cue } from "../typing";

const ROWS: { icon: IconName; id: "phone" | "email" | "web" }[] = [
  { icon: "phone", id: "phone" },
  { icon: "mail", id: "email" },
  { icon: "globe", id: "web" },
];

// Camera settles on the logo, the CTA button and contact details type in, final logo glow.
export const S6Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = tween(frame, [0, 40], [0.7, 1], EASE_OUT);
  const btn = spring({ frame: frame - 20, fps, config: { damping: 11 } });
  const pulse = frame > 70 ? Math.sin((frame - 70) * 0.15) : 0;
  const glow = tween(frame, [150, 170, 237], [0, 1, 0.6]);
  return (
    <AbsoluteFill>
      <BrightBackdrop focusY={25} />
      <Skyline layer="mid" base={1700} drift={-0.2} opacity={0.6} />
      <LightStreaks start={10} />
      <Particles seed="bn6" count={55} opacity={0.5} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 200 }}>
        <div style={{ position: "relative", transform: `scale(${zoom})` }}>
          <div style={{ position: "absolute", inset: -140, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,255,255,${0.9 * zoom}) 0%, rgba(191,214,255,${0.5 * glow}) 45%, transparent 70%)` }} />
          <Img src={staticFile("b1/logo-color.png")} style={{ position: "relative", width: 640, filter: `drop-shadow(0 0 ${20 + glow * 30}px rgba(47,111,228,${0.3 + glow * 0.3}))` }} />
        </div>
        <div style={{ marginTop: 60, transform: `scale(${btn * (1 + pulse * 0.03)})` }}>
          <div style={{ padding: "24px 64px 32px", borderRadius: 999, background: bn.redGradient, boxShadow: `0 20px 50px rgba(200,16,46,${0.35 + pulse * 0.1})`, display: "flex", alignItems: "center", gap: 26 }}>
            <BanglaType cue={cue("ctaText")} fontSize={66} weight={800} color="#FFFFFF" caretColor="#FFFFFF" />
            <div style={{ width: 72, height: 72, borderRadius: 36, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={38} height={38} viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" stroke={bn.colors.red} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 60, opacity: tween(frame, [60, 72], [0, 1]), transform: `translateY(${tween(frame, [60, 80], [40, 0])}px)` }}>
          <GlassCard width={920} height={360} radius={40} outline={tween(frame, [60, 100], [0, 1])} sheen={false}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 34, height: "100%", padding: "0 50px" }}>
              {ROWS.map((r) => {
                const c = cue(r.id);
                const p = spring({ frame: frame - (c.start - 6), fps, config: { damping: 14 } });
                return (
                  <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 28, opacity: p, transform: `translateX(${(1 - p) * -40}px)` }}>
                    <div style={{ width: 76, height: 76, flexShrink: 0, borderRadius: 38, background: bn.colors.red, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name={r.icon} size={38} color="#FFFFFF" progress={p} />
                    </div>
                    <BanglaType cue={c} font={bn.fonts.latin} fontSize={40} weight={600} />
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </AbsoluteFill>
      <BrandRibbon progress={tween(frame, [10, 50], [0, 1], EASE_OUT)} y={1720} />
    </AbsoluteFill>
  );
};
