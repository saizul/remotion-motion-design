import timeline from "./timeline.json";
import { type SceneKey } from "./theme";

// Typed lines live in timeline.json so scripts/saizul-audio.py can place one
// key press per character from exactly the same data the scenes render.
export type TypeCue = { scene: SceneKey; start: number; text: string; fpc: number; vol: number };

type CueId = keyof typeof timeline.typing;

export const cue = (id: CueId) => timeline.typing[id] as TypeCue;

export const typedChars = (c: TypeCue) => c.text.replace(/\n/g, "");

export const typeEnd = (c: TypeCue) => c.start + Math.ceil(typedChars(c).length * c.fpc);
