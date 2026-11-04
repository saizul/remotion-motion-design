import { useCurrentFrame } from "remotion";
import { tween } from "../../UniqueMarkHSC/anim";
import { bn } from "../theme";
import { type TypeCue, graphemes, typeEnd } from "../typing";

type Props = {
  cue: TypeCue;
  fontSize: number;
  weight?: number;
  color?: string;
  font?: string;
  highlight?: string[];
  highlightColor?: string;
  align?: "left" | "center";
  lineHeight?: number;
  letterSpacing?: number;
  caretColor?: string;
  holdCaret?: boolean;
};

// Typewriter for Bengali (and Latin): reveals one grapheme cluster at a time so conjuncts
// never break, with a blinking cursor. Hidden clusters keep their space (no reflow).
export const BanglaType: React.FC<Props> = ({
  cue,
  fontSize,
  weight = 700,
  color = bn.colors.navy,
  font = bn.fonts.bnDisplay,
  highlight = [],
  highlightColor = bn.colors.red,
  align = "left",
  lineHeight = 1.3,
  letterSpacing = 0,
  caretColor = bn.colors.red,
  holdCaret = false,
}) => {
  const frame = useCurrentFrame();
  const shown = Math.max(0, Math.floor((frame - cue.start) / cue.fpc) + 1);
  const end = typeEnd(cue);
  const total = graphemes(cue.text.replace(/\n/g, "")).length;
  const typing = frame >= cue.start && frame < end;
  const caretOn = frame >= cue.start && (typing || ((holdCaret || frame < end + 30) && Math.floor((frame - end) / 10) % 2 === 0));
  let idx = 0;
  return (
    <div style={{ fontFamily: font, fontSize, fontWeight: weight, lineHeight, letterSpacing, color, textAlign: align }}>
      {cue.text.split("\n").map((line, li) => (
        <div key={li} style={{ whiteSpace: "pre" }}>
          {line.split(/(\s+)/).map((word, wi) => {
            const isHi = word.trim() !== "" && highlight.some((h) => word.startsWith(h));
            const wordStart = idx;
            const parts = graphemes(word).map((g) => {
              const i = idx++;
              const isCaret = caretOn && i === Math.min(shown, total) - 1;
              return (
                <span key={i} style={{ position: "relative", opacity: i < shown ? 1 : 0 }}>
                  {g}
                  {isCaret ? (
                    <span
                      style={{
                        position: "absolute",
                        right: "-0.1em",
                        top: "0.18em",
                        width: "0.07em",
                        minWidth: 3,
                        height: "0.95em",
                        borderRadius: 2,
                        background: caretColor,
                      }}
                    />
                  ) : null}
                </span>
              );
            });
            if (!isHi) return <span key={wi}>{parts}</span>;
            const done = cue.start + (wordStart + graphemes(word).length) * cue.fpc;
            return (
              <span key={wi} style={{ color: highlightColor, position: "relative" }}>
                {parts}
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: "0.05em",
                    height: "0.07em",
                    borderRadius: 99,
                    background: highlightColor,
                    transformOrigin: "left",
                    transform: `scaleX(${tween(frame, [done, done + 10], [0, 1])})`,
                  }}
                />
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
