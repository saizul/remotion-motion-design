import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { tween } from "../anim";
import { um } from "../theme";

type Props = {
  text: string; // use "\n" for line breaks
  start?: number;
  stagger?: number;
  highlight?: string[];
  fontSize: number;
  weight?: number;
  color?: string;
  lineHeight?: number;
  align?: "left" | "center";
  letterSpacing?: number;
};

// Word-by-word blur/slide reveal; highlighted words turn gold with an underline.
export const WordReveal: React.FC<Props> = ({
  text,
  start = 0,
  stagger = 4,
  highlight = [],
  fontSize,
  weight = 800,
  color = um.colors.white,
  lineHeight = 1.08,
  align = "left",
  letterSpacing = -2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let idx = 0;
  return (
    <div
      style={{
        fontFamily: um.fonts.display,
        fontSize,
        fontWeight: weight,
        lineHeight,
        letterSpacing,
        color,
        textAlign: align,
      }}
    >
      {text.split("\n").map((line, li) => (
        <div key={li}>
          {line.split(" ").map((word, wi) => {
            const i = idx++;
            const local = frame - start - i * stagger;
            const p = spring({ frame: local, fps, config: { damping: 200, mass: 0.8 }, durationInFrames: 20 });
            const isHi = highlight.some((h) => word.toLowerCase().startsWith(h.toLowerCase()));
            const hi = tween(local, [12, 30], [0, 1]);
            return (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  position: "relative",
                  marginRight: "0.24em",
                  opacity: p,
                  transform: `translateY(${(1 - p) * 0.45}em)`,
                  filter: `blur(${(1 - p) * 10}px)`,
                }}
              >
                {word}
                {isHi ? (
                  <>
                    <span
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: um.goldGradient,
                        backgroundSize: "220% 100%",
                        backgroundPosition: `${100 - hi * 100}% 0`,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        opacity: hi,
                        filter: `drop-shadow(0 0 ${18 * hi}px rgba(235,211,148,0.55))`,
                      }}
                    >
                      {word}
                    </span>
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: "-0.02em",
                        height: "0.07em",
                        borderRadius: 99,
                        background: um.goldGradient,
                        transformOrigin: "left",
                        transform: `scaleX(${hi})`,
                        boxShadow: "0 0 18px rgba(235,211,148,0.8)",
                      }}
                    />
                  </>
                ) : null}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
