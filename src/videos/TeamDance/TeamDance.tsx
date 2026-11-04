import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { tween } from "../UniqueMarkHSC/anim";
import { DigitalCity } from "./DigitalCity";
import { poseFor } from "./motion";
import { type Camera, FREEZE_FROM, type Location, type Shot, SHOTS, SIZE, beatAt } from "./shots";

// Look of each location: background file and how the people are lit to sit in it.
const LOOKS: Record<Location, { bg?: string; grade: string; rim: string; shadow: number; bgY?: number }> = {
  downtown: { bg: "bg-01-downtown.jpg", grade: "brightness(1.02)", rim: "rgba(255,255,255,0.35)", shadow: 0.45, bgY: 30 },
  village: { bg: "bg-02-village.jpg", grade: "brightness(1.03) saturate(1.05)", rim: "rgba(255,250,230,0.35)", shadow: 0.45, bgY: 40 },
  neon: { bg: "bg-03-neon.jpg", grade: "brightness(0.72) saturate(1.15) contrast(1.05)", rim: "rgba(255,70,190,0.45)", shadow: 0.7 },
  field: { bg: "bg-04-field.jpg", grade: "brightness(1.05)", rim: "rgba(255,255,255,0.35)", shadow: 0.4, bgY: 60 },
  rooftop: { bg: "bg-05-rooftop.jpg", grade: "brightness(0.98) saturate(0.92)", rim: "rgba(220,230,255,0.35)", shadow: 0.45 },
  street: { bg: "bg-06-street.jpg", grade: "brightness(0.95) sepia(0.12)", rim: "rgba(255,200,120,0.5)", shadow: 0.55 },
  sunsetRoad: { bg: "bg-07-sunset-road.jpg", grade: "brightness(1.02) sepia(0.28) saturate(1.1)", rim: "rgba(255,170,70,0.45)", shadow: 0.5, bgY: 50 },
  digital: { grade: "brightness(0.82) saturate(1.1)", rim: "rgba(92,200,255,0.5)", shadow: 0.65 },
  business: { bg: "bg-09-business.jpg", grade: "brightness(1) saturate(0.95) hue-rotate(-4deg)", rim: "rgba(170,210,255,0.5)", shadow: 0.45 },
  skyline: { bg: "bg-10-skyline.jpg", grade: "brightness(0.9) sepia(0.3) saturate(1.1)", rim: "rgba(255,160,60,0.45)", shadow: 0.55, bgY: 20 },
};

// V formation: leader front-centre, two either side stepping back. [file index, feet x, feet y, height]
const V: [number, number, number, number][] = [
  [0, 150, 800, 470],
  [4, 930, 800, 470],
  [1, 335, 890, 580],
  [3, 745, 890, 580],
  [2, 540, 1020, 780],
];
// Line formation used as a formation change on the rooftop shot.
const LINE: Record<number, [number, number, number]> = {
  0: [120, 960, 610],
  4: [960, 960, 610],
  1: [330, 960, 630],
  3: [750, 960, 630],
  2: [540, 975, 680],
};
const ASPECT = [278 / 778, 266 / 844, 300 / 934, 274 / 842, 270 / 796];

// Camera = transform of the stage (people) plus a slower parallax transform for the background.
const cameraFor = (cam: Camera, t: number): { stage: string; bg: string } => {
  const shake = `translate(${Math.sin(t * 13.1) * 2}px, ${Math.cos(t * 11.3) * 2}px)`;
  switch (cam) {
    case "wide":
      return { stage: `${shake} scale(${0.94 + t * 0.05})`, bg: `scale(${1.12 + t * 0.04})` };
    case "medium":
      return { stage: `${shake} translateY(170px) scale(${1.32 + t * 0.05})`, bg: `scale(${1.3 + t * 0.04})` };
    case "trackLeft":
      return { stage: `${shake} translateX(${-110 + t * 220}px) scale(1.08)`, bg: `translateX(${60 - t * 120}px) scale(1.25)` };
    case "trackRight":
      return { stage: `${shake} translateX(${110 - t * 220}px) scale(1.08)`, bg: `translateX(${-60 + t * 120}px) scale(1.25)` };
    case "lowHero":
      return { stage: `${shake} translateY(-20px) perspective(1400px) rotateX(${7 - t * 3}deg) scale(${1.12 + t * 0.05})`, bg: `translateY(40px) scale(${1.3 + t * 0.04})` };
    case "close":
      return { stage: `${shake} translate(0px, 560px) scale(${2.15 + t * 0.1})`, bg: `scale(1.6)` };
    case "orbit":
      return { stage: `${shake} rotate(${-6 + t * 12}deg) scale(1.12)`, bg: `rotate(${-3 + t * 6}deg) translateX(${-70 + t * 140}px) scale(1.4)` };
    case "rotate360":
      return { stage: `perspective(1400px) rotateY(${-32 + t * 64}deg) scale(1.05)`, bg: `translateX(${90 - t * 180}px) scale(1.35)` };
    case "pushIn":
      return { stage: `${shake} scale(${1 + t * 0.35})`, bg: `scale(${1.15 + t * 0.15})` };
    case "pullBack":
      return { stage: `scale(${1.3 - Math.min(1, t * 1.8) * 0.33})`, bg: `scale(${1.35 - Math.min(1, t * 1.8) * 0.2})` };
  }
};

const ShotView: React.FC<{ shot: Shot; next?: Shot }> = ({ shot, next }) => {
  const local = useCurrentFrame();
  const global = Math.min(shot.from + local, FREEZE_FROM);
  const len = shot.to - shot.from;
  const t = Math.min(1, (global - shot.from) / len);
  const look = LOOKS[shot.loc];
  const cam = cameraFor(shot.cam, t);
  // Slow-motion hero moment: the groove runs at half speed through this bar.
  const bStart = beatAt(shot.from);
  const b = shot.slow ? bStart + (beatAt(global) - bStart) * 0.5 : beatAt(global);
  const pose = poseFor(shot.move, Math.max(0, b), 1);
  const lineMix = shot.loc === "rooftop" ? tween(local, [0, 24], [0, 1]) : 0;

  // Entry transitions (first ~10 frames) and exit whip/ramp into the next shot.
  const e = local;
  let enter = "";
  let blur = 0;
  if (shot.enter === "whip") {
    enter = `translateX(${tween(e, [0, 10], [55, 0])}%)`;
    blur = tween(e, [0, 10], [28, 0]);
  } else if (shot.enter === "ramp") {
    enter = `scale(${tween(e, [0, 12], [1.35, 1])})`;
    blur = tween(e, [0, 12], [12, 0]);
  }
  // Exit: 0 → 1 over the final 8 frames of the shot.
  const out = tween(local, [len - 8, len], [0, 1]);
  if (next?.enter === "whip" && out > 0) {
    enter += ` translateX(${out * -55}%)`;
    blur = Math.max(blur, out * 28);
  } else if (next?.enter === "ramp" && out > 0) {
    enter += ` scale(${1 + out * 0.25})`;
    blur = Math.max(blur, out * 10);
  }

  const people = V.map(([idx, vx, vy, vh]) => {
    const [lx, ly, lh] = LINE[idx];
    const x = vx + (lx - vx) * lineMix;
    const y = vy + (ly - vy) * lineMix;
    const h = vh + (lh - vh) * lineMix;
    return { idx, x, y, h, w: h * ASPECT[idx] };
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: enter, filter: blur > 0.5 ? `blur(${blur}px)` : undefined }}>
        <AbsoluteFill style={{ transform: cam.bg, transformOrigin: `50% ${look.bgY ?? 50}%` }}>
          {look.bg ? (
            <Img src={staticFile(`dance/bg/${look.bg}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <DigitalCity />
          )}
        </AbsoluteFill>
        {/* Depth haze so the background sits behind the team */}
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)" }} />
        <AbsoluteFill style={{ transform: cam.stage, transformOrigin: "50% 85%" }}>
          {people.map((p) => (
            <div key={p.idx}>
              <div
                style={{
                  position: "absolute",
                  left: p.x - p.w * 0.55,
                  top: p.y - 16,
                  width: p.w * 1.1,
                  height: 34,
                  borderRadius: "50%",
                  background: `radial-gradient(ellipse, rgba(0,0,0,${look.shadow}) 0%, transparent 70%)`,
                  transform: `scaleX(${1 - Math.min(0.25, -pose.y / 120)})`,
                }}
              />
              <Img
                src={staticFile(`dance/people/person-${p.idx}.png`)}
                style={{
                  position: "absolute",
                  left: p.x - p.w / 2,
                  top: p.y - p.h,
                  width: p.w,
                  height: p.h,
                  transformOrigin: "50% 100%",
                  transform: `translate(${pose.x * (p.h / 760)}px, ${pose.y * (p.h / 760)}px) rotate(${pose.rot}deg) skewX(${pose.skew}deg) scale(${pose.sx}, ${pose.sy})`,
                  filter: `${look.grade} drop-shadow(0 0 14px ${look.rim})`,
                }}
              />
            </div>
          ))}
        </AbsoluteFill>
      </AbsoluteFill>
      {/* Overlay transitions */}
      {shot.enter === "flash" ? <AbsoluteFill style={{ background: "#FFFFFF", opacity: tween(e, [0, 12], [1, 0]) }} /> : null}
      {shot.enter === "shutter" ? (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: `${tween(e, [0, 10], [50, 0])}%`, background: "#000" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${tween(e, [0, 10], [50, 0])}%`, background: "#000" }} />
        </>
      ) : null}
      {shot.enter === "swipe" && e < 12 ? (
        <div
          style={{
            position: "absolute",
            top: "-20%",
            height: "140%",
            width: "70%",
            left: `${tween(e, [0, 12], [-10, 110])}%`,
            transform: "rotate(12deg)",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)",
            filter: "blur(12px)",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

export const TeamDance: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000", width: SIZE, height: SIZE }}>
    <Audio src={staticFile("dance/music.mp3")} />
    {SHOTS.map((s, i) => (
      <Sequence key={i} from={s.from} durationInFrames={s.to - s.from} name={`${s.loc} ${s.cam}`}>
        <ShotView shot={s} next={SHOTS[i + 1]} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
