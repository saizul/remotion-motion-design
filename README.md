# Motion Design with Code (Remotion)

Motion graphics and social-media videos (Reels, ads, explainers) built with [Remotion](https://remotion.dev), React and TypeScript.

## Compositions

All compositions are registered in `src/Root.tsx`.

| Composition ID | Source | Format |
|---|---|---|
| `SaizulIntro` | `src/SaizulIntro.tsx` | 1080x1920 vertical, 30 fps |
| `UniqueMarkHSC` | `src/videos/UniqueMarkHSC/` | 1080x1920 vertical, 30 fps |
| `B1TestBirmingham` | `src/videos/B1TestBirmingham/` | 1080x1920 vertical, 30 fps (three.js scenes) |
| `SaizulPortfolio` | `src/videos/SaizulPortfolio/` | size and fps from `timeline.json` |
| `TeamDance` | `src/videos/TeamDance/` | 1080x1080 square, 60 fps, length from beat data |
| `B1Bangla` | `src/videos/B1Bangla/` | size and fps from `timeline.json` |

Each video folder keeps its own `theme.ts` (dimensions, colours, scene timing), so timings can be tuned in one place.

## Getting started

```bash
npm install
npm run dev                                   # open Remotion Studio
npm run render:intro                          # renders SaizulIntro to out/saizul-intro.mp4
npx remotion render <CompositionId> out/video.mp4
npm run lint                                  # type check (tsc --noEmit)
npm run check                                 # validate timeline / voice-over / beat data and assets
npm test                                      # unit tests for the checks (no rendering)
```

Helper scripts in `scripts/` generate voice-over, sound effects and image cut-outs for some videos. They need external tools (Python, macOS Swift, ffmpeg) and are optional for previewing.

## Checking the data before a render

Several videos are driven by JSON: `timeline.json` (scene lengths, typed text, sound effects, voice-over cues), `voiceover.json` and `beats.json`. A wrong number there does not break the type check; it shows up minutes into a render as text that is cut off or a sound on the wrong scene. `npm run check` (`scripts/check-media.ts`) catches that in under a second:

| File | Checks |
| --- | --- |
| `B1Bangla/timeline.json`, `SaizulPortfolio/timeline.json` | fps 1-120; even width/height (H.264); unique scenes longer than the cross-fade `overlap`; every typing cue finishes inside its scene (Bangla counted in graphemes, like `typing.ts`); `fpc` > 0 and volumes 0-1; sfx and voice-over cues reference a real scene and sit inside it |
| `SaizulPortfolio/voiceover.json` | lines in order, ending before the video ends; lines that overlap by more than 6 frames are flagged |
| `TeamDance/beats.json` | `period` matches `bpm`; beats strictly increasing and inside the track; `downbeatPhase` 0-3 |
| every `staticFile("...")` literal in `src/` | images must exist in `public/` (error); missing audio is a warning, since voice-over mixes are produced locally with `scripts/` and music is added by hand |

Errors exit with code 1; `--strict` also fails on warnings (useful on a render machine where the audio must be present). The rules live in `src/lib/media-check.ts`, which has no Remotion or font imports so it runs in plain Node.

Example:

```text
ERROR  B1Bangla/timeline.json: typing.heroTag: typing ends at frame 175 but scene "hero" is 169 frames (0.20 s too long)
```

CI runs the type check, `npm run check` and `npm test` on every push and pull request.

**Author:** [Saizul Amin](https://saizul.com)
