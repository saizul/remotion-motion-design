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
```

Helper scripts in `scripts/` generate voice-over, sound effects and image cut-outs for some videos. They need external tools (Python, macOS Swift, ffmpeg) and are optional for previewing.

CI runs the type check on every push and pull request.

**Author:** [Saizul Amin](https://saizul.com)
