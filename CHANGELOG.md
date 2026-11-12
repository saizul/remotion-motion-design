# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- `npm run check` (`scripts/check-media.ts`): validates `timeline.json`, `voiceover.json`
  and `beats.json` (scene lengths and overlap, typing cues that would run past their
  scene, sfx/voice-over placement, tempo and beat order, H.264-safe dimensions) and
  checks that every literal `staticFile()` image exists in `public/`.
- `src/lib/media-check.ts` with the rules as pure functions.
- Unit tests (`npm test`, node:test via tsx), including a check that the TeamDance shot
  list covers the whole track without gaps.
- CI runs the data check and the tests after the type check.

## [1.0.0]

- SaizulIntro, UniqueMarkHSC, B1TestBirmingham, SaizulPortfolio, TeamDance and B1Bangla.
