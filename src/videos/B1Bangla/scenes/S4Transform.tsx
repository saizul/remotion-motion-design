import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_IN_OUT, tween } from "../../UniqueMarkHSC/anim";
import { Clip } from "../../B1TestBirmingham/components/Clip";
import { BanglaType } from "../components/BanglaType";
import { bn, sceneFrames } from "../theme";
import { cue } from "../typing";

const SPLIT: [number, number] = [40, 70];

const Label: React.FC<{ id: "before" | "after"; bg: string; side: "left" | "right"; appear: number }> = ({ id, bg, side, appear }) => (
  <div
    style={{
      position: "absolute",
      top: 1540,
      [side]: 60,
      padding: "8px 36px 14px",
      borderRadius: 999,
      background: bg,
      opacity: appear,
      transform: `translateY(${(1 - appear) * 30}px)`,
      boxShadow: "0 12px 30px rgba(1,33,105,0.3)",
    }}
  >
    <BanglaType cue={cue(id)} fontSize={48} weight={700} color="#FFFFFF" caretColor="#FFFFFF" />
  </div>
);

// Before → after: a hesitant learner (desaturated) gives way to the same learner speaking confidently.
export const S4Transform: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = sceneFrames.transform + bn.overlap;
  const divX = tween(frame, SPLIT, [1080, 540], EASE_IN_OUT);
  const split = tween(frame, SPLIT, [0, 1]);
  const burst = tween(frame, [126, 150], [0, 1]);
  const title = spring({ frame: frame - 80, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill style={{ backgroundColor: bn.colors.bg }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: divX, overflow: "hidden" }}>
        <Clip clip="d1" duration={len} grayscale={1} zoom={[1.08, 1.14]} />
        <AbsoluteFill style={{ background: "rgba(40,55,80,0.25)" }} />
      </div>
      <div style={{ position: "absolute", left: divX, top: 0, bottom: 0, right: 0, overflow: "hidden" }}>
        <Clip clip="d2" duration={len} zoom={[1.02, 1.1]} trimBefore={360} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 70% 30%, rgba(255,220,180,0.25), transparent 60%)" }} />
      </div>
      {split > 0 ? (
        <>
          <div style={{ position: "absolute", left: divX - 4, top: 0, bottom: 0, width: 8, background: "#FFFFFF", boxShadow: `0 0 30px ${bn.colors.red}` }} />
          <div
            style={{
              position: "absolute",
              left: divX - 55,
              top: 1080,
              width: 110,
              height: 110,
              borderRadius: 55,
              background: bn.colors.red,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${split})`,
              boxShadow: "0 10px 30px rgba(200,16,46,0.5)",
            }}
          >
            <svg width={52} height={52} viewBox="0 0 24 24">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="#FFFFFF" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </>
      ) : null}
      {/* Confidence burst when the title lands */}
      {burst > 0 && burst < 1 ? (
        <div
          style={{
            position: "absolute",
            left: 540 - 600 * burst,
            top: 330 - 600 * burst,
            width: 1200 * burst,
            height: 1200 * burst,
            borderRadius: "50%",
            border: `6px solid ${bn.colors.red}`,
            opacity: 1 - burst,
          }}
        />
      ) : null}
      <AbsoluteFill
        style={{
          height: 640,
          background: `linear-gradient(180deg, ${bn.colors.bg} 0%, rgba(244,247,252,0.95) 60%, rgba(244,247,252,0) 100%)`,
          alignItems: "center",
          paddingTop: 150,
        }}
      >
        <div style={{ transform: `scale(${0.85 + title * 0.15})` }}>
          <BanglaType cue={cue("confidence")} fontSize={96} weight={800} align="center" lineHeight={1.25} highlight={["পরীক্ষায়"]} />
        </div>
      </AbsoluteFill>
      <Label id="before" bg="#6B7890" side="left" appear={tween(frame, [8, 20], [0, 1])} />
      <Label id="after" bg={bn.colors.red} side="right" appear={split} />
    </AbsoluteFill>
  );
};
