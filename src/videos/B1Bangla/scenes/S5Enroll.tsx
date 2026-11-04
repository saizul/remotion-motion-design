import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_OUT, tween } from "../../UniqueMarkHSC/anim";
import { GlassCard } from "../../B1TestBirmingham/components/GlassCard";
import { Icon } from "../../B1TestBirmingham/components/Icons";
import { BrightBackdrop } from "../../B1TestBirmingham/components/Light";
import { Particles } from "../../B1TestBirmingham/components/Particles";
import { BanglaType } from "../components/BanglaType";
import { Seal } from "../components/Seal";
import { Skyline } from "../components/Skyline";
import { bn } from "../theme";
import { cue } from "../typing";

// Enrollment card rises, the limited-seats seal spins in, the button is pressed, success tick.
export const S5Enroll: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = spring({ frame: frame - 8, fps, config: { damping: 18 } });
  const seal = spring({ frame: frame - 30, fps, config: { damping: 12, mass: 1.2 } });
  const spin = tween(frame, [30, 70], [540, 0], EASE_OUT) + Math.sin(frame * 0.05) * 8;
  const btn = spring({ frame: frame - 92, fps, config: { damping: 11 } });
  const press = frame >= 94 && frame < 100 ? 0.94 : 1;
  const success = spring({ frame: frame - 200, fps, config: { damping: 10 } });
  return (
    <AbsoluteFill>
      <BrightBackdrop focusY={40} />
      <Skyline layer="far" base={1760} drift={-0.2} opacity={0.8} />
      <Particles seed="bn5" count={45} opacity={0.45} />
      <div style={{ position: "absolute", left: 80, top: 330, opacity: card, transform: `perspective(1800px) translateY(${(1 - card) * 300}px) rotateX(${(1 - card) * 25}deg)` }}>
        <GlassCard width={920} height={1100} radius={48} outline={tween(frame, [10, 50], [0, 1])}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "70px 60px", gap: 40 }}>
            <Img src={staticFile("b1/logo-color.png")} style={{ width: 380 }} />
            <div style={{ height: 4, width: 520, borderRadius: 2, background: bn.redGradient, transform: `scaleX(${tween(frame, [30, 60], [0, 1])})` }} />
            <div style={{ marginTop: 280, transform: `scale(${btn * press})` }}>
              <div style={{ padding: "22px 60px 30px", borderRadius: 999, background: bn.redGradient, boxShadow: "0 20px 50px rgba(200,16,46,0.4)", display: "flex", alignItems: "center", gap: 24 }}>
                <BanglaType cue={cue("register")} fontSize={62} weight={800} color="#FFFFFF" caretColor="#FFFFFF" />
                <div style={{ width: 68, height: 68, borderRadius: 34, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width={36} height={36} viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" stroke={bn.colors.red} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <BanglaType cue={cue("future")} fontSize={50} weight={700} align="center" color={bn.colors.navySoft} />
            </div>
          </div>
        </GlassCard>
      </div>
      <div style={{ position: "absolute", left: 540 - 190, top: 620, opacity: seal, transform: `scale(${0.4 + seal * 0.6})` }}>
        <Seal size={380} spin={spin}>
          <BanglaType cue={cue("seats")} fontSize={74} weight={800} align="center" lineHeight={1.05} color={bn.colors.navy} caretColor={bn.colors.navy} />
        </Seal>
      </div>
      {/* Success tick */}
      <div style={{ position: "absolute", left: 540 - 60, top: 1480, transform: `scale(${success})`, opacity: success }}>
        <div style={{ width: 120, height: 120, borderRadius: 60, background: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 12px rgba(22,163,74,0.2), 0 20px 40px rgba(22,163,74,0.35)" }}>
          <Icon name="check" size={70} color="#FFFFFF" strokeWidth={3} progress={tween(frame, [202, 216], [0, 1])} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
