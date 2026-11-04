import { loadFont as loadAnek } from "@remotion/google-fonts/AnekBangla";
import { loadFont as loadHind } from "@remotion/google-fonts/HindSiliguri";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import timeline from "./timeline.json";

const { fontFamily: bnDisplay } = loadAnek("normal", { weights: ["600", "700", "800"], subsets: ["bengali", "latin"] });
const { fontFamily: bnBody } = loadHind("normal", { weights: ["500", "600", "700"], subsets: ["bengali", "latin"] });
const { fontFamily: latin } = loadPoppins("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });

// Brand tokens match the B1 Test Birmingham logo and banners (navy / red / white).
export const bn = {
  colors: {
    bg: "#F4F7FC",
    navy: "#012169",
    navySoft: "#1B3A8C",
    red: "#C8102E",
    redLight: "#E8364F",
    blue: "#2F6FE4",
    sky: "#BFD6FF",
    gold: "#D4A437",
    goldLight: "#F4D27A",
    muted: "#52617F",
    white: "#FFFFFF",
  },
  redGradient: "linear-gradient(100deg, #A50D25 0%, #C8102E 45%, #E8364F 100%)",
  goldGradient: "linear-gradient(135deg, #8A6414 0%, #F4D27A 35%, #D4A437 55%, #FFE9A8 75%, #A57A1C 100%)",
  fonts: { bnDisplay, bnBody, latin },
  fps: timeline.fps,
  width: timeline.width,
  height: timeline.height,
  overlap: timeline.overlap,
} as const;

export type SceneKey = "hero" | "journey" | "classroom" | "transform" | "enroll" | "cta";
export const SCENES = timeline.scenes as [SceneKey, number][];
export const sceneFrames = Object.fromEntries(SCENES) as Record<SceneKey, number>;
export const totalFrames = SCENES.reduce((s, [, f]) => s + f, 0);
export const sceneLength = (k: SceneKey) => sceneFrames[k] + (k === "cta" ? 0 : bn.overlap);
