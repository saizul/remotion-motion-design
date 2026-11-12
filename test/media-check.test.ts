import test from "node:test";
import assert from "node:assert/strict";
import {
  checkAssets,
  checkBeats,
  checkTimeline,
  checkVoiceover,
  countChars,
  sceneLengths,
  sceneStarts,
  staticFileRefs,
  totalFrames,
  typeEnd,
  type Timeline,
} from "../src/lib/media-check";
import { collectIssues } from "../scripts/check-media";
import { DURATION_FRAMES, SHOTS } from "../src/videos/TeamDance/shots";

const base = (): Timeline => ({
  fps: 30,
  width: 1080,
  height: 1920,
  overlap: 10,
  scenes: [
    ["a", 100],
    ["b", 50],
  ],
  typing: { t: { scene: "a", start: 10, text: "Hello", fpc: 2, vol: 1 } },
  sfx: [["b", 0, "pop", 0.5]],
  vo: [["vo1", "a", 0, "hi"]],
});
const errors = (issues: { level: string; message: string }[]) => issues.filter((i) => i.level === "error").map((i) => i.message);

test("repository data has no errors", () => {
  assert.deepEqual(errors(collectIssues()), []);
});

test("scene math matches the compositions", () => {
  const tl = base();
  assert.deepEqual(sceneLengths(tl), { a: 110, b: 50 });
  assert.deepEqual(sceneStarts(tl), { a: 0, b: 100 });
  assert.equal(totalFrames(tl), 150);
});

test("a valid timeline passes", () => {
  assert.deepEqual(checkTimeline(base(), "t"), []);
});

test("Bangla is counted in graphemes, like typing.ts", () => {
  assert.equal(countChars("প্রস্তুতি", true), 3);
  assert.ok(countChars("প্রস্তুতি", false) > 3);
  assert.equal(countChars("a\nb", false), 2);
  assert.equal(typeEnd({ scene: "a", start: 10, text: "abc", fpc: 1.5, vol: 1 }, false), 15);
});

test("typing that runs past its scene is an error", () => {
  const tl = base();
  tl.typing!.t = { scene: "a", start: 100, text: "Hello", fpc: 2, vol: 1 }; // ends 110 = ok (overlap)
  assert.deepEqual(errors(checkTimeline(tl, "t")), []);
  tl.typing!.t.start = 101;
  assert.match(errors(checkTimeline(tl, "t"))[0], /ends at frame 111 but scene "a" is 110 frames/);
  tl.typing!.t = { scene: "nope", start: 0, text: "x", fpc: 1, vol: 1 };
  assert.match(errors(checkTimeline(tl, "t"))[0], /unknown scene "nope"/);
  tl.typing!.t = { scene: "a", start: 0, text: " ", fpc: 0, vol: 2 };
  assert.equal(errors(checkTimeline(tl, "t")).length, 3);
});

test("dimensions, fps, duplicate scenes and too-short scenes", () => {
  const tl = base();
  tl.width = 1081;
  tl.fps = 0;
  tl.scenes = [
    ["a", 8],
    ["a", 50],
  ];
  const msgs = errors(checkTimeline(tl, "t")).join("\n");
  assert.match(msgs, /must be even/);
  assert.match(msgs, /fps/);
  assert.match(msgs, /duplicate scene "a"/);
  assert.match(msgs, /not longer than the 10-frame overlap/);
  assert.match(errors(checkTimeline({ ...base(), scenes: [] }, "t"))[0], /non-empty/);
});

test("sfx and vo cues must sit inside their scene", () => {
  const tl = base();
  tl.sfx = [["b", 50, "pop", 0.5], ["zz", 0, "pop", 0.5], ["a", 0, "pop", 1.5]];
  tl.vo = [["vo1", "b", 60, "x"], ["vo1", "a", null, "y"]];
  const issues = checkTimeline(tl, "t");
  const msgs = errors(issues).join("\n");
  assert.match(msgs, /frame 50 is outside scene "b" \(0-49\)/);
  assert.match(msgs, /unknown scene "zz"/);
  assert.match(msgs, /volume must be between 0 and 1/);
  assert.match(msgs, /start 60 is outside scene "b"/);
  assert.ok(issues.some((i) => i.level === "warning" && /not unique/.test(i.message)));
});

test("voice-over overlap tolerance and end of video", () => {
  const vo = [
    { file: "1.wav", from: 0, frames: 40 },
    { file: "2.wav", from: 36, frames: 20 }, // 4 frames early: tolerated
    { file: "3.wav", from: 40, frames: 20 }, // 16 frames early: warning
    { file: "4.wav", from: 90, frames: 20 }, // past the end
  ];
  const issues = checkVoiceover(vo, 100, "vo");
  assert.deepEqual(issues.map((i) => [i.level, i.where]), [
    ["warning", "vo[2] (3.wav)"],
    ["error", "vo[3] (4.wav)"],
  ]);
  assert.equal(checkVoiceover([{ file: "x", from: -1, frames: 0 }], 10, "vo").length, 2);
});

test("beats: tempo, order, range and phase", () => {
  const good = { bpm: 120, offset: 0, period: 0.5, duration: 3, downbeatPhase: 0, beats: [0.5, 1, 1.5, 2], strength: [1, 1, 1, 1] };
  assert.deepEqual(checkBeats(good, "b"), []);
  const bad = { ...good, period: 0.6, beats: [0.5, 0.4, 1.5, 4], downbeatPhase: 5, strength: [1] };
  const issues = checkBeats(bad, "b");
  const msgs = issues.map((i) => i.message).join("\n");
  assert.match(msgs, /does not match bpm/);
  assert.match(msgs, /strictly increasing/);
  assert.match(msgs, /within 0-3 s/);
  assert.match(msgs, /downbeatPhase/);
  assert.ok(issues.some((i) => i.level === "warning" && /strength/.test(i.message)));
  assert.match(checkBeats({ ...good, beats: [1] }, "b")[0].message, /at least 4/);
});

test("staticFile literal extraction and asset rules", () => {
  const src = 'staticFile("a/logo.png"); staticFile(\'b.mp3\'); staticFile(`c/${x}.wav`); staticFile(file)';
  assert.deepEqual(staticFileRefs(src), ["a/logo.png", "b.mp3"]);
  const issues = checkAssets(
    [
      { file: "A.tsx", path: "a/logo.png" },
      { file: "A.tsx", path: "a/logo.png" },
      { file: "B.tsx", path: "b.mp3" },
      { file: "C.tsx", path: "ok.png" },
    ],
    (p) => p === "ok.png",
  );
  assert.deepEqual(issues.map((i) => [i.level, i.where]), [
    ["error", "A.tsx"],
    ["warning", "B.tsx"],
  ]);
});

test("TeamDance shots cover the whole track without gaps", () => {
  assert.equal(SHOTS[0].from, 0);
  assert.equal(SHOTS[SHOTS.length - 1].to, DURATION_FRAMES);
  for (let i = 1; i < SHOTS.length; i++) {
    assert.equal(SHOTS[i].from, SHOTS[i - 1].to, `gap before shot ${i}`);
    assert.ok(SHOTS[i].to > SHOTS[i].from, `shot ${i} is empty`);
  }
});
