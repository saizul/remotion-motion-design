import timeline from "./timeline.json";
import { type SceneKey } from "./theme";

// Typed lines live in timeline.json; scripts/b1bn-audio.py places one key press per
// grapheme from the same data, so letters and keyboard sounds stay in sync.
export type TypeCue = { scene: SceneKey; start: number; text: string; fpc: number; vol: number };
type CueId = keyof typeof timeline.typing;

export const cue = (id: CueId) => timeline.typing[id] as TypeCue;

// Bengali-safe split: conjuncts and vowel signs stay together (e.g. "প্র", "স্তু").
const seg = new Intl.Segmenter("bn", { granularity: "grapheme" });
export const graphemes = (s: string) => [...seg.segment(s)].map((g) => g.segment);

export const typeEnd = (c: TypeCue) => c.start + Math.ceil(graphemes(c.text.replace(/\n/g, "")).length * c.fpc);
