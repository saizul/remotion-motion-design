import { useCurrentFrame } from "remotion";
import { tween } from "../anim";
import { sa } from "../theme";
import { type TypeCue, typeEnd, typedChars } from "../typing";

type Props = {
  cue: TypeCue;
  fontSize: number;
  weight?: number;
  color?: string;
  highlight?: string[];
  highlightColor?: string;
  font?: string;
  align?: "left" | "center" | "right";
  lineHeight?: number;
  letterSpacing?: number;
  caretColor?: string;
  // Keep the caret blinking to the end of the scene (final URL).
  holdCaret?: boolean;
  glow?: boolean;
};

// Typewriter text: one character per `fpc` frames with a blinking cursor.
// Hidden characters keep their space so the layout never shifts.
export const TypeText: React.FC<Props> = ({
  cue,
  fontSize,
  weight = 700,
  color = sa.colors.white,
  highlight = [],
  highlightColor = sa.colors.cyan,
  font = sa.fonts.display,
  align = "left",
  lineHeight = 1.15,
  letterSpacing = -0.5,
  caretColor = sa.colors.cyan,
  holdCaret = false,
  glow = true,
}) => {
  const frame = useCurrentFrame();
  const shown = Math.max(0, Math.floor((frame - cue.start) / cue.fpc) + 1);
  const total = typedChars(cue).length;
  const end = typeEnd(cue);
  const typing = frame >= cue.start && frame < end;
  const blinkOn = Math.floor((frame - end) / 12) % 2 === 0;
  const caretOn = frame >= cue.start && (typing || ((holdCaret || frame < end + 36) && blinkOn));

  let idx = 0;
  return (
    <div
      style={{
        fontFamily: font,
        fontSize,
        fontWeight: weight,
        lineHeight,
        letterSpacing,
        color,
        textAlign: align,
        textShadow: glow ? "0 0 24px rgba(92,200,255,0.25)" : undefined,
      }}
    >
      {cue.text.split("\n").map((line, li) => (
        <div key={li} style={{ whiteSpace: "pre" }}>
          {line.split(/(\s+)/).map((word, wi) => {
            const isHi = word.trim() !== "" && highlight.some((h) => word.toLowerCase().startsWith(h.toLowerCase()));
            const wordStart = idx;
            const chars = [...word].map((ch) => {
              const i = idx++;
              const isCaret = caretOn && i === Math.min(shown, total) - 1;
              return (
                <span key={i} style={{ position: "relative", opacity: i < shown ? 1 : 0 }}>
                  {ch}
                  {isCaret ? (
                    <span
                      style={{
                        position: "absolute",
                        right: "-0.12em",
                        top: "0.1em",
                        width: "0.07em",
                        minWidth: 2,
                        height: "0.95em",
                        background: caretColor,
                        boxShadow: `0 0 10px ${caretColor}`,
                      }}
                    />
                  ) : null}
                </span>
              );
            });
            if (!isHi) return <span key={wi}>{chars}</span>;
            const doneAt = cue.start + (wordStart + word.length) * cue.fpc;
            return (
              <span key={wi} style={{ color: highlightColor, opacity: 0.6 + 0.4 * tween(frame, [doneAt, doneAt + 8], [0, 1]) }}>
                {chars}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
