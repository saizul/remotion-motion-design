import { useCurrentFrame } from "remotion";
import { tween } from "../anim";
import { b1 } from "../theme";
import { type TypeCue, typeEnd, typedChars } from "../typing";

type Props = {
  cue: TypeCue;
  fontSize: number;
  weight?: number;
  color?: string;
  highlight?: string[];
  highlightColor?: string;
  font?: string;
  align?: "left" | "center";
  lineHeight?: number;
  letterSpacing?: number;
  caret?: boolean;
};

// Typewriter text: characters appear one by one with a blinking caret.
// Hidden characters keep their space, so the layout never shifts while typing.
export const TypeText: React.FC<Props> = ({
  cue,
  fontSize,
  weight = 800,
  color = b1.colors.navy,
  highlight = [],
  highlightColor = b1.colors.red,
  font = b1.fonts.display,
  align = "left",
  lineHeight = 1.1,
  letterSpacing = -1.5,
  caret = true,
}) => {
  const frame = useCurrentFrame();
  const shown = Math.max(0, Math.floor((frame - cue.start) / cue.fpc) + 1);
  const end = typeEnd(cue);
  const typing = frame >= cue.start && frame < end;
  // Caret blinks for ~1s after typing finishes, then hides.
  const caretOn = caret && frame >= cue.start && frame < end + 30 && (typing || Math.floor((frame - end) / 8) % 2 === 0);

  let idx = 0;
  const lines = cue.text.split("\n");
  return (
    <div style={{ fontFamily: font, fontSize, fontWeight: weight, lineHeight, letterSpacing, color, textAlign: align }}>
      {lines.map((line, li) => (
        <div key={li} style={{ whiteSpace: "pre" }}>
          {line.split(/(\s+)/).map((word, wi) => {
            const isHi = word.trim() !== "" && highlight.some((h) => word.toLowerCase().startsWith(h.toLowerCase()));
            const wordStart = idx;
            const chars = [...word].map((ch) => {
              const i = idx++;
              const visible = i < shown;
              const isCaret = caretOn && i === Math.min(shown, typedChars(cue).length) - 1;
              return (
                <span key={i} style={{ position: "relative", opacity: visible ? 1 : 0 }}>
                  {ch}
                  {isCaret ? (
                    <span
                      style={{
                        position: "absolute",
                        right: "-0.08em",
                        top: "0.12em",
                        width: "0.06em",
                        height: "0.95em",
                        borderRadius: 2,
                        background: isHi ? highlightColor : color,
                      }}
                    />
                  ) : null}
                </span>
              );
            });
            if (!isHi) return <span key={wi}>{chars}</span>;
            // Underline sweeps in once the whole highlighted word is typed.
            const doneAt = cue.start + (wordStart + word.length) * cue.fpc;
            return (
              <span key={wi} style={{ position: "relative", color: highlightColor }}>
                {chars}
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    right: "0.05em",
                    bottom: "0.02em",
                    height: "0.08em",
                    borderRadius: 99,
                    background: highlightColor,
                    transformOrigin: "left",
                    transform: `scaleX(${tween(frame, [doneAt, doneAt + 10], [0, 1])})`,
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

