import { Easing, interpolate } from "remotion";

// Premium easing curves shared by every scene.
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);

export const tween = (
  frame: number,
  range: readonly number[],
  output: readonly number[],
  easing: (t: number) => number = EASE_OUT,
) =>
  interpolate(frame, range, output, {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Decaying shake used when something "lands" on screen.
export const impactShake = (frame: number, at: number, amp = 10) => {
  const t = frame - at;
  if (t < 0 || t > 12) return 0;
  return Math.sin(t * 2.4) * amp * (1 - t / 12);
};
