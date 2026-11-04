import { AbsoluteFill, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_IN_OUT, EASE_OUT, tween } from "../anim";
import { Glass } from "../components/Glass";
import { Icon } from "../components/Icons";
import { Backdrop, Dust } from "../components/Space";
import { TypeText } from "../components/TypeText";
import { sa } from "../theme";
import { cue } from "../typing";
import { TypedList } from "./common";

const ROWS = 6;
const ROW_H = 74;

// Out-of-focus keyword chips drifting through depth (blurred: atmosphere, not readable text).
const KeywordField: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {new Array(22).fill(0).map((_, i) => {
        const z = random(`kz${i}`);
        const w = 90 + random(`kw${i}`) * 160;
        const x = ((random(`kx${i}`) * 2200 + frame * (0.6 + z * 1.6)) % 2300) - 200;
        const y = 80 + random(`ky${i}`) * 920;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: w * (0.6 + z),
              height: 34 * (0.6 + z),
              borderRadius: 20,
              border: "1px solid rgba(92,200,255,0.5)",
              background: "rgba(47,128,255,0.12)",
              filter: `blur(${6 - z * 4}px)`,
              opacity: 0.25 + z * 0.35,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Search bar types a query, results load, the highlighted site climbs from #6 to #1, analytics grow.
export const S05Seo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bar = spring({ frame: frame - 4, fps, config: { damping: 18 } });
  const results = tween(frame, [46, 60], [0, 1]);
  const climb = tween(frame, [90, 150], [0, 1], EASE_IN_OUT);
  const ourRank = 5 - climb * 5; // row index 5 → 0
  const chart = tween(frame, [170, 230], [0, 1], EASE_OUT);
  const bars = [0.25, 0.32, 0.3, 0.45, 0.55, 0.62, 0.78, 0.95];
  return (
    <AbsoluteFill>
      <Backdrop focusX={55} tint="#0A1A40" />
      <KeywordField />
      <Dust seed="s5" count={60} opacity={0.7} />
      <div style={{ position: "absolute", left: 620, top: 110, opacity: bar, transform: `translateY(${(1 - bar) * -60}px)` }}>
        <Glass width={800} height={84} radius={42} outline={1} glow={0.9}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, height: "100%", padding: "0 30px" }}>
            <Icon name="search" size={36} />
            <TypeText cue={cue("seoQuery")} fontSize={32} weight={500} font={sa.fonts.mono} letterSpacing={0} glow={false} />
          </div>
        </Glass>
      </div>
      <div style={{ position: "absolute", left: 620, top: 230, opacity: results }}>
        <Glass width={800} height={ROWS * ROW_H + 30} radius={22} outline={results} sheen={false}>
          {new Array(ROWS).fill(0).map((_, i) => {
            const isOurs = i === ROWS - 1;
            // Rows step down one at a time as the highlighted site passes them.
            const slot = isOurs ? ourRank : i + Math.min(1, Math.max(0, climb * 5 - (4 - i)));
            const y = 15 + slot * ROW_H;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 20,
                  right: 20,
                  top: y,
                  height: ROW_H - 12,
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "0 18px",
                  background: isOurs ? "linear-gradient(90deg, rgba(47,128,255,0.45), rgba(92,200,255,0.15))" : "rgba(255,255,255,0.04)",
                  border: isOurs ? `1.5px solid ${sa.colors.cyan}` : "1px solid rgba(255,255,255,0.06)",
                  boxShadow: isOurs ? "0 0 30px rgba(92,200,255,0.45)" : undefined,
                  zIndex: isOurs ? 2 : 1,
                }}
              >
                <div style={{ fontFamily: sa.fonts.mono, fontSize: 26, fontWeight: 700, color: isOurs ? sa.colors.white : sa.colors.muted, width: 44 }}>
                  {Math.round(slot) + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 12, width: isOurs ? "62%" : `${40 + random(`r${i}`) * 30}%`, borderRadius: 6, background: isOurs ? "#FFFFFF" : "rgba(201,209,220,0.35)" }} />
                  <div style={{ marginTop: 10, height: 8, width: "38%", borderRadius: 4, background: isOurs ? sa.colors.cyan : "rgba(201,209,220,0.18)" }} />
                </div>
                {isOurs ? <Icon name="trend" size={34} progress={tween(frame, [90, 110], [0, 1])} /> : null}
              </div>
            );
          })}
        </Glass>
      </div>
      {/* Analytics */}
      <div style={{ position: "absolute", left: 1470, top: 330, opacity: tween(frame, [160, 175], [0, 1]) }}>
        <Glass width={380} height={330} radius={22} outline={tween(frame, [160, 190], [0, 1])}>
          <svg width={380} height={330}>
            {bars.map((b, i) => (
              <rect key={i} x={30 + i * 42} y={290 - 230 * b * chart} width={28} height={230 * b * chart} rx={6} fill={i === bars.length - 1 ? sa.colors.cyan : "rgba(47,128,255,0.6)"} />
            ))}
            <polyline
              points={bars.map((b, i) => `${44 + i * 42},${270 - 230 * b * chart}`).join(" ")}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={3}
              style={{ filter: "drop-shadow(0 0 6px #5CC8FF)" }}
            />
          </svg>
        </Glass>
      </div>
      <TypedList ids={["seo0", "seo1", "seo2", "seo3", "seo4"]} x={80} y={240} size={38} gap={1.8} />
    </AbsoluteFill>
  );
};
