import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", {
  weights: ["500", "700", "800"],
  subsets: ["latin"],
});
const { fontFamily: body } = loadInter("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

// Unique Mark brand tokens (navy + gold sampled from the official logo).
export const um = {
  colors: {
    bgDeep: "#030817",
    bg: "#071433",
    navy: "#1B3C7F",
    blue: "#3D7BFF",
    blueSoft: "#9DBBFF",
    gold: "#B9A163",
    goldLight: "#EBD394",
    white: "#F6F8FF",
    muted: "rgba(226,234,255,0.72)",
  },
  goldGradient:
    "linear-gradient(100deg, #B9A163 0%, #F3DE9C 38%, #C9AE68 58%, #F7E7B4 78%, #B9A163 100%)",
  fonts: { display, body },
  fps: 30,
  width: 1080,
  height: 1920,
  // Frames each scene overlaps the next one (crossfade window).
  overlap: 12,
  scenes: {
    hook: 90,
    vision: 90,
    course: 90,
    funded: 120,
    benefits: 120,
    journey: 120,
    opportunity: 120,
    cta: 150,
  },
  contact: {
    phones: ["07837 800628", "07395 425740"],
    email: "contact@uniquemark.co.uk",
    address: ["Cobalt Square, 83 Hagley Road", "Birmingham B16 8QG"],
  },
} as const;

export type SceneKey = keyof typeof um.scenes;

export const sceneOrder: SceneKey[] = [
  "hook",
  "vision",
  "course",
  "funded",
  "benefits",
  "journey",
  "opportunity",
  "cta",
];

export const totalFrames = sceneOrder.reduce((sum, k) => sum + um.scenes[k], 0);

// Length of a scene's Sequence including the overlap into the next scene.
export const sceneLength = (k: SceneKey) =>
  um.scenes[k] + (k === "cta" ? 0 : um.overlap);
