import { type Move } from "./shots";

export type Pose = { x: number; y: number; rot: number; skew: number; sx: number; sy: number };

const tri = (p: number) => 1 - Math.abs(((p % 2) + 2) % 2 - 1) * 2; // -1..1 triangle
const ease = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t);

// Stylised, beat-locked body motion applied to a flat cut-out (pivot at the feet).
// `b` is the beat position; everyone uses the same pose so the team moves in sync.
export const poseFor = (move: Move, b: number, unit: number): Pose => {
  const beat = Math.floor(b);
  const p = b - beat; // 0..1 inside the beat
  const hit = Math.max(0, 1 - p * 5); // short accent right on the beat
  const bounce = Math.sin(Math.PI * p); // up between beats, down on the beat
  const side = beat % 2 === 0 ? 1 : -1;
  const pose: Pose = { x: 0, y: 0, rot: 0, skew: 0, sx: 1, sy: 1 };
  switch (move) {
    case "bounce":
      pose.y = -bounce * 22 * unit;
      pose.sy = 1 - hit * 0.035;
      pose.sx = 1 + hit * 0.02;
      break;
    case "sway":
      pose.rot = Math.sin(Math.PI * (b / 2)) * 5; // lean left/right across two beats
      pose.y = -bounce * 10 * unit;
      break;
    case "sidestep": {
      const t2 = (b / 2) % 2; // two beats each way
      pose.x = (t2 < 1 ? ease(t2) * 2 - 1 : 1 - ease(t2 - 1) * 2) * 38 * unit;
      pose.y = -bounce * 14 * unit;
      pose.rot = side * 2;
      break;
    }
    case "shoulder":
      // Quick left/right lean on eighth notes reads as a shoulder shimmy.
      pose.skew = tri(b * 2) * 5;
      pose.y = -Math.abs(Math.sin(Math.PI * 2 * p)) * 8 * unit;
      pose.sy = 1 - hit * 0.02;
      break;
    case "groove":
      pose.y = -bounce * 16 * unit;
      pose.rot = Math.sin(Math.PI * b) * 3;
      pose.skew = Math.sin(Math.PI * b) * 3;
      pose.sy = 1 - hit * 0.03;
      break;
    case "hero":
      pose.y = -bounce * 12 * unit;
      pose.rot = Math.sin(Math.PI * (b / 2)) * 3;
      pose.sx = pose.sy = 1 + hit * 0.02;
      break;
    case "still":
      break;
  }
  return pose;
};
