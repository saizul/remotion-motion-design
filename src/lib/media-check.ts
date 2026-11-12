/**
 * Data checks for the JSON that drives the videos (timeline.json, voiceover.json,
 * beats.json) and for staticFile() assets. Pure functions with no Remotion, React or
 * font imports, so they run in plain Node (scripts/check-media.ts and the tests).
 *
 * The rules mirror how the compositions read the data:
 *  - scenes play back to back; every scene except the last runs `overlap` frames longer
 *    so it can cross-fade into the next one (see sceneLength() in each theme.ts);
 *  - a typing cue must finish inside its scene: start + ceil(chars * fpc) (typing.ts);
 *  - sfx entries are [scene, frameInScene, name, volume].
 */

export type Level = "error" | "warning";
export type Issue = { level: Level; where: string; message: string };

export type TypingCue = { scene: string; start: number; text: string; fpc: number; vol: number };
export type Timeline = {
  fps: number;
  width: number;
  height: number;
  overlap: number;
  scenes: [string, number][];
  typing?: Record<string, TypingCue>;
  sfx?: [string, number, string, number][];
  vo?: [string, string, number | null, string][];
};
export type VoEvent = { file: string; from: number; frames: number; text?: string };
export type Beats = {
  bpm: number;
  offset: number;
  period: number;
  duration: number;
  downbeatPhase: number;
  beats: number[];
  strength?: number[];
};

const isInt = (n: unknown): n is number => typeof n === "number" && Number.isInteger(n);
const isNum = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n);

/** Characters as the scenes count them: graphemes for Bangla (conjuncts stay whole). */
export const countChars = (text: string, graphemes: boolean): number => {
  const flat = text.replace(/\n/g, "");
  if (!graphemes) return flat.length;
  const seg = new Intl.Segmenter("bn", { granularity: "grapheme" });
  return [...seg.segment(flat)].length;
};

export const typeEnd = (cue: TypingCue, graphemes: boolean) =>
  cue.start + Math.ceil(countChars(cue.text, graphemes) * cue.fpc);

export const sceneLengths = (tl: Pick<Timeline, "scenes" | "overlap">): Record<string, number> =>
  Object.fromEntries(tl.scenes.map(([k, n], i) => [k, n + (i < tl.scenes.length - 1 ? tl.overlap : 0)]));

export const sceneStarts = (tl: Pick<Timeline, "scenes">): Record<string, number> => {
  let at = 0;
  const out: Record<string, number> = {};
  for (const [k, n] of tl.scenes) {
    out[k] = at;
    at += n;
  }
  return out;
};

export const totalFrames = (tl: Pick<Timeline, "scenes">) => tl.scenes.reduce((s, [, n]) => s + n, 0);

export function checkTimeline(tl: Timeline, name: string, opts: { graphemes?: boolean } = {}): Issue[] {
  const issues: Issue[] = [];
  const err = (where: string, message: string) => issues.push({ level: "error", where: `${name}: ${where}`, message });
  const warn = (where: string, message: string) => issues.push({ level: "warning", where: `${name}: ${where}`, message });

  if (!isInt(tl.fps) || tl.fps < 1 || tl.fps > 120) err("fps", `fps must be an integer 1-120 (got ${tl.fps})`);
  for (const dim of ["width", "height"] as const) {
    const v = tl[dim];
    if (!isInt(v) || v < 2) err(dim, `must be a positive integer (got ${v})`);
    else if (v % 2 !== 0) err(dim, `must be even for H.264 output (got ${v})`);
  }
  if (!isInt(tl.overlap) || tl.overlap < 0) err("overlap", `must be a non-negative integer (got ${tl.overlap})`);

  if (!Array.isArray(tl.scenes) || tl.scenes.length === 0) {
    err("scenes", "must be a non-empty list of [key, frames]");
    return issues;
  }
  const seen = new Set<string>();
  tl.scenes.forEach((entry, i) => {
    const [key, frames] = Array.isArray(entry) ? entry : [];
    if (typeof key !== "string" || !key) return err(`scenes[${i}]`, "needs a scene key");
    if (seen.has(key)) err(`scenes[${i}]`, `duplicate scene "${key}"`);
    seen.add(key);
    if (!isInt(frames) || frames < 1) err(`scenes[${i}] (${key})`, `frames must be a positive integer (got ${frames})`);
    else if (isInt(tl.overlap) && i < tl.scenes.length - 1 && frames <= tl.overlap) {
      err(`scenes[${i}] (${key})`, `${frames} frames is not longer than the ${tl.overlap}-frame overlap`);
    }
  });

  const lengths = sceneLengths(tl);
  const fps = isInt(tl.fps) && tl.fps > 0 ? tl.fps : 30;

  for (const [id, cue] of Object.entries(tl.typing ?? {})) {
    const where = `typing.${id}`;
    if (!(cue.scene in lengths)) {
      err(where, `unknown scene "${cue.scene}"`);
      continue;
    }
    if (!isNum(cue.start) || cue.start < 0) err(where, `start must be >= 0 (got ${cue.start})`);
    if (!isNum(cue.fpc) || cue.fpc <= 0) err(where, `fpc (frames per character) must be > 0 (got ${cue.fpc})`);
    if (!isNum(cue.vol) || cue.vol < 0 || cue.vol > 1) err(where, `vol must be between 0 and 1 (got ${cue.vol})`);
    if (typeof cue.text !== "string" || !cue.text.trim()) err(where, "text is empty");
    if (isNum(cue.start) && isNum(cue.fpc) && cue.fpc > 0 && typeof cue.text === "string") {
      const end = typeEnd(cue, Boolean(opts.graphemes));
      const len = lengths[cue.scene];
      if (end > len) {
        err(where, `typing ends at frame ${end} but scene "${cue.scene}" is ${len} frames (${((end - len) / fps).toFixed(2)} s too long)`);
      }
    }
  }

  (tl.sfx ?? []).forEach((s, i) => {
    const [scene, frame, sound, vol] = s;
    const where = `sfx[${i}] (${sound})`;
    if (!(scene in lengths)) return err(where, `unknown scene "${scene}"`);
    if (!isNum(frame) || frame < 0 || frame >= lengths[scene]) {
      err(where, `frame ${frame} is outside scene "${scene}" (0-${lengths[scene] - 1})`);
    }
    if (typeof sound !== "string" || !sound) err(where, "sound name is empty");
    if (!isNum(vol) || vol < 0 || vol > 1) err(where, `volume must be between 0 and 1 (got ${vol})`);
  });

  (tl.vo ?? []).forEach((v, i) => {
    const [id, scene, start] = v;
    const where = `vo[${i}] (${id})`;
    if (!(scene in lengths)) return err(where, `unknown scene "${scene}"`);
    if (start !== null && (!isNum(start) || start < 0 || start >= lengths[scene])) {
      err(where, `start ${start} is outside scene "${scene}" (0-${lengths[scene] - 1})`);
    }
  });
  if (tl.vo && new Set(tl.vo.map((v) => v[0])).size !== tl.vo.length) warn("vo", "voice-over ids are not unique");

  return issues;
}

export function checkVoiceover(
  events: VoEvent[],
  total: number,
  name: string,
  opts: { toleranceFrames?: number } = {},
): Issue[] {
  const tolerance = opts.toleranceFrames ?? 6;
  const issues: Issue[] = [];
  let prevEnd = 0;
  let prevFile = "";
  events.forEach((e, i) => {
    const where = `${name}[${i}] (${e.file})`;
    if (!isInt(e.from) || e.from < 0) issues.push({ level: "error", where, message: `from must be a non-negative integer (got ${e.from})` });
    if (!isInt(e.frames) || e.frames < 1) issues.push({ level: "error", where, message: `frames must be a positive integer (got ${e.frames})` });
    if (!isInt(e.from) || !isInt(e.frames)) return;
    if (e.from < prevEnd - tolerance) {
      issues.push({ level: "warning", where, message: `starts ${prevEnd - e.from} frames before ${prevFile} ends; the lines will talk over each other` });
    }
    if (e.from + e.frames > total) {
      issues.push({ level: "error", where, message: `ends at frame ${e.from + e.frames}, after the video ends (${total})` });
    }
    prevEnd = Math.max(prevEnd, e.from + e.frames);
    prevFile = e.file;
  });
  return issues;
}

export function checkBeats(b: Beats, name: string): Issue[] {
  const issues: Issue[] = [];
  const err = (message: string) => issues.push({ level: "error", where: name, message });
  const warn = (message: string) => issues.push({ level: "warning", where: name, message });
  if (!isNum(b.bpm) || b.bpm <= 0) err(`bpm must be > 0 (got ${b.bpm})`);
  if (!isNum(b.duration) || b.duration <= 0) err(`duration must be > 0 (got ${b.duration})`);
  if (isNum(b.bpm) && b.bpm > 0 && isNum(b.period) && Math.abs(60 / b.bpm - b.period) > 0.005) {
    err(`period ${b.period} s does not match bpm ${b.bpm} (expected ${(60 / b.bpm).toFixed(4)} s)`);
  }
  if (!Array.isArray(b.beats) || b.beats.length < 4) {
    err("needs at least 4 beats");
    return issues;
  }
  for (let i = 1; i < b.beats.length; i++) {
    if (!(b.beats[i] > b.beats[i - 1])) err(`beats must be strictly increasing (index ${i}: ${b.beats[i - 1]} -> ${b.beats[i]})`);
  }
  if (b.beats[0] < 0 || b.beats[b.beats.length - 1] > b.duration) err(`beats must lie within 0-${b.duration} s`);
  if (!isInt(b.downbeatPhase) || b.downbeatPhase < 0 || b.downbeatPhase > 3) err(`downbeatPhase must be 0-3 (got ${b.downbeatPhase})`);
  if (b.strength && b.strength.length !== b.beats.length) {
    warn(`strength has ${b.strength.length} values for ${b.beats.length} beats`);
  }
  return issues;
}

/** Literal string paths passed to staticFile() in a source file (template literals are skipped). */
export const staticFileRefs = (source: string): string[] =>
  [...source.matchAll(/staticFile\(\s*(["'])([^"'`$]+)\1\s*\)/g)].map((m) => m[2]);

const IMAGE_RE = /\.(png|jpe?g|webp|gif|svg|avif)$/i;

/**
 * Missing images are errors (they are committed and the render would fail). Missing
 * audio is only a warning: voice-over mixes are produced locally by the scripts in
 * scripts/, and licensed music is added by hand; neither is part of the repository.
 */
export function checkAssets(refs: { file: string; path: string }[], exists: (p: string) => boolean): Issue[] {
  const issues: Issue[] = [];
  const seen = new Set<string>();
  for (const { file, path } of refs) {
    const key = `${file}:${path}`;
    if (seen.has(key) || exists(path)) continue;
    seen.add(key);
    issues.push(
      IMAGE_RE.test(path)
        ? { level: "error", where: file, message: `public/${path} does not exist` }
        : { level: "warning", where: file, message: `public/${path} is missing (audio is not committed: generate it with scripts/ or add your own licensed file before rendering)` },
    );
  }
  return issues;
}
