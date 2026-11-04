import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadPoppins("normal", {
  weights: ["500", "600", "700", "800"],
  subsets: ["latin"],
});
const { fontFamily: body } = loadInter("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

// B1 Test Birmingham brand tokens (sampled from the official logo).
export const b1 = {
  colors: {
    bg: "#F4F7FC",
    bgAlt: "#E4ECF8",
    navy: "#012169",
    navySoft: "#1B3A8C",
    red: "#C8102E",
    redLight: "#E8364F",
    blue: "#2F6FE4",
    sky: "#BFD6FF",
    ink: "#0B1B3F",
    muted: "#52617F",
    white: "#FFFFFF",
  },
  redGradient: "linear-gradient(100deg, #A50D25 0%, #C8102E 45%, #E8364F 100%)",
  navyGradient: "linear-gradient(100deg, #012169 0%, #1B3A8C 60%, #2F6FE4 100%)",
  fonts: { display, body },
  fps: 30,
  width: 1080,
  height: 1920,
  overlap: 12,
  scenes: {
    hook: 150,
    course: 150,
    features: 150,
    transform: 150,
    journey: 150,
    cta: 190, // longer: contact details type out, then a ~1.5s hold
  },
  // Drop these files into public/b1/ — scenes switch from placeholder to real footage automatically.
  clips: {
    a: { file: "b1/clip-a.mp4", label: "Students entering" },
    b: { file: "b1/clip-b.mp4", label: "Tutor conversation" },
    c: { file: "b1/clip-c.mp4", label: "Tutor with students" },
    d1: { file: "b1/clip-d1.mp4", label: "Before: hesitant" },
    d2: { file: "b1/clip-d2.mp4", label: "After: confident" },
    e: { file: "b1/clip-e.mp4", label: "Walking forward" },
  },
  contact: {
    phone: "+44 7395 425740",
    email: "info@b1testbirmingham.co.uk",
    web: "b1testbirmingham.co.uk",
  },
} as const;

export type ClipKey = keyof typeof b1.clips;
export type SceneKey = keyof typeof b1.scenes;

export const sceneOrder: SceneKey[] = ["hook", "course", "features", "transform", "journey", "cta"];

export const totalFrames = sceneOrder.reduce((sum, k) => sum + b1.scenes[k], 0);

export const sceneLength = (k: SceneKey) => b1.scenes[k] + (k === "cta" ? 0 : b1.overlap);
