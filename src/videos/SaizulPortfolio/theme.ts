import { loadFont as loadInterTight } from "@remotion/google-fonts/InterTight";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import timeline from "./timeline.json";

const { fontFamily: display } = loadInterTight("normal", {
  weights: ["300", "500", "600", "700", "800"],
  subsets: ["latin"],
});
const { fontFamily: mono } = loadMono("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

// Saizul Amin brand film tokens: deep space black, electric blue, silver; logo red kept for accents.
export const sa = {
  colors: {
    bg: "#03050A",
    bg2: "#081021",
    blue: "#2F80FF",
    cyan: "#5CC8FF",
    silver: "#C9D1DC",
    white: "#F4F7FB",
    muted: "rgba(201,209,220,0.62)",
    red: "#E0262B",
  },
  fonts: { display, mono },
  fps: timeline.fps,
  width: timeline.width,
  height: timeline.height,
  overlap: timeline.overlap,
} as const;

export type SceneKey =
  | "arrival"
  | "who"
  | "ecosystem"
  | "web"
  | "seo"
  | "marketing"
  | "ai"
  | "systems"
  | "global"
  | "showcase"
  | "legacy";

export const SCENES = timeline.scenes as [SceneKey, number][];

export const sceneFrames = Object.fromEntries(SCENES) as Record<SceneKey, number>;

export const totalFrames = SCENES.reduce((sum, [, f]) => sum + f, 0);

export const sceneLength = (k: SceneKey) => sceneFrames[k] + (k === "legacy" ? 0 : sa.overlap);
