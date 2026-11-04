import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "800"],
  subsets: ["latin"],
});

// Brand tokens — change these to re-brand every video at once.
export const theme = {
  colors: {
    bg: "#0B0F1A",
    bgAlt: "#131A2B",
    text: "#F5F7FB",
    muted: "#8A94A8",
    primary: "#7C5CFF",
    accent: "#22D3EE",
    success: "#34D399",
  },
  font: fontFamily,
  fps: 30,
  // Reels / Ads format
  vertical: { width: 1080, height: 1920 },
  landscape: { width: 1920, height: 1080 },
} as const;

// Scene durations in frames (30 fps)
export const introTimings = {
  hook: 90, // 0–3s
  services: 150, // 3–8s
  workflow: 120, // 8–12s
  cta: 90, // 12–15s
} as const;

export const introTotal = Object.values(introTimings).reduce((a, b) => a + b, 0);
