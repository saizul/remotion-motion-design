import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_IN_OUT, tween } from "../anim";
import { Glass } from "../components/Glass";
import { IconBadge, type IconName } from "../components/Icons";
import { HoloPortrait } from "../components/Portrait";
import { Backdrop, Dust } from "../components/Space";
import { TypeText } from "../components/TypeText";
import { cue } from "../typing";

const CARDS: { icon: IconName; id: Parameters<typeof cue>[0] }[] = [
  { icon: "crown", id: "whoCard0" },
  { icon: "layers", id: "whoCard1" },
  { icon: "bot", id: "whoCard2" },
  { icon: "code", id: "whoCard3" },
  { icon: "search", id: "whoCard4" },
  { icon: "trend", id: "whoCard5" },
];

// Hologram scan reveals the real photo; six profile cards materialise and type their titles.
export const S02Who: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scan = tween(frame, [0, 42], [0, 1], EASE_IN_OUT);
  return (
    <AbsoluteFill>
      <Backdrop grid focusX={30} tint="#0C1E45" />
      <Dust seed="s2" count={80} />
      <div style={{ position: "absolute", left: 90, top: 130, transform: `scale(${tween(frame, [0, 240], [1, 1.06])})`, transformOrigin: "50% 100%" }}>
        <HoloPortrait src="saizul/cutout-front.png" width={950} height={950} reveal={scan} />
      </div>
      {CARDS.map((c, i) => {
        const cc = cue(c.id);
        const appear = cc.start - 6;
        const p = spring({ frame: frame - appear, fps, config: { damping: 16 } });
        const flicker = frame - appear < 8 && frame >= appear ? (Math.floor(frame / 2) % 2 ? 0.55 : 1) : 1;
        return (
          <div
            key={c.id}
            style={{
              position: "absolute",
              left: 1130,
              top: 170 + i * 118,
              opacity: Math.min(1, p * 1.4) * flicker,
              transform: `perspective(1400px) translateX(${(1 - p) * 220}px) rotateY(${(1 - p) * -35 - 6}deg)`,
            }}
          >
            <Glass width={680} height={98} radius={20} outline={tween(frame, [appear, appear + 24], [0, 1])}>
              <div style={{ display: "flex", alignItems: "center", gap: 26, height: "100%", padding: "0 22px" }}>
                <IconBadge name={c.icon} size={62} progress={tween(frame, [appear + 4, appear + 22], [0, 1])} />
                <TypeText cue={cc} fontSize={36} weight={600} />
              </div>
            </Glass>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
