import { Audio, Sequence, staticFile } from "remotion";
import { VO_EVENTS } from "./voiceover";
import { b1, type SceneKey, sceneOrder } from "./theme";
import { TYPE_CUES, typedChars } from "./typing";

type Sfx = "key1" | "key2" | "key3" | "key4" | "whoosh" | "whoosh-big" | "pop" | "pop-high" | "tick" | "impact" | "riser" | "ding" | "shimmer" | "blip";

const SCENE_START = sceneOrder.reduce(
  (acc, k, i) => ({ ...acc, [k]: i === 0 ? 0 : acc[sceneOrder[i - 1]] + b1.scenes[sceneOrder[i - 1]] }),
  {} as Record<SceneKey, number>,
);

// [scene, local frame, effect, volume] — each cue matches an on-screen element change.
const SFX: [SceneKey, number, Sfx, number][] = [
  // Hook: camera push, logo reveal, sweep out
  ["hook", 0, "whoosh-big", 0.35],
  ["hook", 8, "shimmer", 0.45],
  ["hook", 140, "whoosh", 0.45],
  // Course: frame rises, badges pop, sound wave, bubbles
  ["course", 2, "whoosh", 0.4],
  ["course", 22, "pop", 0.5],
  ["course", 30, "pop-high", 0.5],
  ["course", 32, "blip", 0.4],
  ["course", 36, "pop", 0.4],
  ["course", 46, "pop-high", 0.4],
  ["course", 58, "pop", 0.4],
  ["course", 138, "whoosh", 0.3],
  // Features: widgets pop, cards slide in, icons draw (text typing is added from TYPE_CUES)
  ["features", 8, "pop", 0.45],
  ["features", 14, "pop-high", 0.45],
  ["features", 20, "whoosh", 0.4],
  ["features", 26, "tick", 0.35],
  ["features", 44, "whoosh", 0.4],
  ["features", 50, "tick", 0.35],
  ["features", 82, "whoosh", 0.4],
  ["features", 88, "tick", 0.35],
  // Transformation: title, split wipe, confidence lands, meter rises
  ["transform", 6, "whoosh", 0.3],
  ["transform", 40, "whoosh-big", 0.55],
  ["transform", 60, "riser", 0.4],
  ["transform", 66, "impact", 0.6],
  ["transform", 124, "ding", 0.45],
  // Journey: each word + step lands, icons flip to achievements
  ["journey", 10, "impact", 0.3],
  ["journey", 36, "ding", 0.4],
  ["journey", 44, "impact", 0.3],
  ["journey", 70, "ding", 0.4],
  ["journey", 78, "impact", 0.35],
  ["journey", 104, "ding", 0.5],
  ["journey", 146, "whoosh", 0.3],
  // CTA: elements gather, logo glow, ribbon, button
  ["cta", 0, "whoosh-big", 0.45],
  ["cta", 14, "shimmer", 0.6],
  ["cta", 22, "whoosh", 0.3],
  ["cta", 46, "pop", 0.55],
];

const KEYS: Sfx[] = ["key1", "key2", "key3", "key4"];

// One key press per typed character (spaces get none), timed from the same
// cues the TypeText component renders, so sound and letters stay in sync.
const KEY_PRESSES: [number, Sfx, number][] = Object.values(TYPE_CUES).flatMap((cue, b) =>
  [...typedChars(cue)].flatMap((ch, k): [number, Sfx, number][] =>
    ch === " "
      ? []
      : [[SCENE_START[cue.scene] + cue.start + Math.floor(k * cue.fpc), KEYS[(k * 3 + b) % KEYS.length], 0.16 + ((k * 5 + b) % 4) * 0.025]],
  ),
);

// Typing sits under the voice by design, so it is only lightly ducked.
const TYPING_DUCK = 0.8;

// Effects that start while the voice is speaking play at half volume so the voice stays on top.
const DUCK = 0.5;
// Master trim keeps voice + effects from clipping when they overlap.
const MASTER = 0.8;
const underVoice = (frame: number) => VO_EVENTS.some((e) => frame >= e.from - 3 && frame < e.from + e.frames);

export const AudioTrack: React.FC = () => (
  <>
    {SFX.map(([scene, at, name, volume], i) => {
      const from = SCENE_START[scene] + at;
      return (
        <Sequence key={`sfx-${i}`} from={from} name={`sfx ${name}`} layout="none">
          <Audio src={staticFile(`b1/sfx/${name}.wav`)} volume={(underVoice(from) ? volume * DUCK : volume) * MASTER} />
        </Sequence>
      );
    })}
    {KEY_PRESSES.map(([from, name, volume], i) => (
      <Sequence key={`key-${i}`} from={from} name={`type ${name}`} layout="none">
        <Audio src={staticFile(`b1/sfx/${name}.wav`)} volume={(underVoice(from) ? volume * TYPING_DUCK : volume) * MASTER} />
      </Sequence>
    ))}
    {VO_EVENTS.map((e) => (
      <Sequence key={e.file} from={e.from} name={`vo ${e.text}`} layout="none">
        <Audio src={staticFile(e.file)} volume={MASTER} />
      </Sequence>
    ))}
  </>
);
