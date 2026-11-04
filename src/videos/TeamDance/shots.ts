import beats from "./beats.json";

export const FPS = 60;
export const SIZE = 1080;
export const DURATION_FRAMES = Math.floor(beats.duration * FPS);

// Seconds → frame at 60 fps.
export const f = (sec: number) => Math.round(sec * FPS);

// Bars start on the strongest beat phase; one shot per bar (4 beats ≈ 2.15 s).
const barStarts: number[] = [];
for (let b = beats.downbeatPhase; b < beats.beats.length; b += 4) barStarts.push(beats.beats[b]);

export type Move = "bounce" | "sway" | "sidestep" | "shoulder" | "groove" | "hero" | "still";
export type Camera = "wide" | "medium" | "trackLeft" | "trackRight" | "lowHero" | "close" | "orbit" | "rotate360" | "pushIn" | "pullBack";
export type Transition = "none" | "whip" | "shutter" | "flash" | "swipe" | "ramp";
export type Location =
  | "downtown"
  | "village"
  | "neon"
  | "field"
  | "rooftop"
  | "street"
  | "sunsetRoad"
  | "digital"
  | "business"
  | "skyline";

type Plan = { loc: Location; cam: Camera; move: Move; enter: Transition; slow?: boolean };

// One entry per bar, in order. The first shot also covers the short intro before bar 1.
const PLAN: Plan[] = [
  { loc: "downtown", cam: "wide", move: "bounce", enter: "none" },
  { loc: "downtown", cam: "medium", move: "groove", enter: "ramp" },
  { loc: "village", cam: "trackLeft", move: "sidestep", enter: "whip" },
  { loc: "neon", cam: "lowHero", move: "shoulder", enter: "shutter" },
  { loc: "neon", cam: "close", move: "groove", enter: "flash" },
  { loc: "field", cam: "orbit", move: "sway", enter: "whip" },
  { loc: "rooftop", cam: "trackRight", move: "sidestep", enter: "swipe" },
  { loc: "street", cam: "rotate360", move: "shoulder", enter: "shutter" },
  { loc: "sunsetRoad", cam: "lowHero", move: "hero", enter: "flash", slow: true },
  { loc: "digital", cam: "pushIn", move: "groove", enter: "ramp" },
  { loc: "business", cam: "lowHero", move: "bounce", enter: "whip" },
  { loc: "skyline", cam: "medium", move: "sway", enter: "flash" },
  { loc: "skyline", cam: "pullBack", move: "still", enter: "swipe" },
];

export type Shot = Plan & { from: number; to: number };

export const SHOTS: Shot[] = PLAN.slice(0, barStarts.length).map((p, i) => ({
  ...p,
  from: i === 0 ? 0 : f(barStarts[i]),
  to: i + 1 < Math.min(PLAN.length, barStarts.length) ? f(barStarts[i + 1]) : DURATION_FRAMES,
}));

// Beat position (in beats, fractional) at a given frame; negative before the first beat.
export const beatAt = (frame: number) => (frame / FPS - beats.offset) / beats.period;

// Final second is a freeze frame.
export const FREEZE_FROM = DURATION_FRAMES - FPS;
