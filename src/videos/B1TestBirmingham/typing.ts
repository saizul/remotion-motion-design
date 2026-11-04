import { type SceneKey } from "./theme";

// Single source of truth for every typed line: scenes render from it and the
// audio track places one key press per typed character from the same data.
export type TypeCue = {
  scene: SceneKey;
  start: number; // local frame the first character appears
  text: string; // "\n" = line break
  fpc: number; // frames per character
};

export const TYPE_CUES = {
  hookTagline: { scene: "hook", start: 26, text: "Build Confidence.\nSpeak Clearly.", fpc: 1.5 },
  courseTitle: { scene: "course", start: 12, text: "Listening &\nSpeaking Course", fpc: 1.5 },
  courseSub: { scene: "course", start: 54, text: "Practical Training For Real-Life Conversations", fpc: 1.2 },
  featuresEyebrow: { scene: "features", start: 12, text: "COURSE HIGHLIGHTS", fpc: 1 },
  feature1: { scene: "features", start: 26, text: "10 Day Course", fpc: 1.5 },
  feature2: { scene: "features", start: 50, text: "Flexible Weekday Classes", fpc: 1.5 },
  feature3: { scene: "features", start: 88, text: "Study Materials Included", fpc: 1.5 },
  transformFrom: { scene: "transform", start: 6, text: "From Hesitation", fpc: 1.5 },
  transformTo: { scene: "transform", start: 64, text: "To Confidence", fpc: 1.5 },
  learn: { scene: "journey", start: 14, text: "Learn", fpc: 1.6 },
  practice: { scene: "journey", start: 48, text: "Practice", fpc: 1.5 },
  succeed: { scene: "journey", start: 82, text: "Succeed", fpc: 1.5 },
  ctaHeadline: { scene: "cta", start: 32, text: "Prepare With Confidence", fpc: 1.5 },
  ctaPhone: { scene: "cta", start: 70, text: "+44 7395 425740", fpc: 1 },
  ctaEmail: { scene: "cta", start: 88, text: "info@b1testbirmingham.co.uk", fpc: 1 },
  ctaWeb: { scene: "cta", start: 118, text: "b1testbirmingham.co.uk", fpc: 1 },
} satisfies Record<string, TypeCue>;

export type CueId = keyof typeof TYPE_CUES;

// Characters that actually get typed (line breaks are not keystrokes).
export const typedChars = (cue: TypeCue) => cue.text.replace(/\n/g, "");

export const typeEnd = (cue: TypeCue) => cue.start + Math.ceil(typedChars(cue).length * cue.fpc);
