// Checks the data files that drive the videos before you spend minutes rendering.
// Usage: npx tsx scripts/check-media.ts [--strict]
//   --strict  treat warnings (for example missing generated audio) as errors
// Exit code 1 when an error is found.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import {
  checkAssets,
  checkBeats,
  checkTimeline,
  checkVoiceover,
  staticFileRefs,
  totalFrames,
  type Issue,
  type Timeline,
} from "../src/lib/media-check";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const read = <T>(rel: string): T => JSON.parse(readFileSync(path.join(root, rel), "utf8")) as T;

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : /\.(tsx?|jsx?)$/.test(name) ? [full] : [];
  });

export function collectIssues(): Issue[] {
  const issues: Issue[] = [];

  const bangla = read<Timeline>("src/videos/B1Bangla/timeline.json");
  issues.push(...checkTimeline(bangla, "B1Bangla/timeline.json", { graphemes: true }));

  const portfolio = read<Timeline>("src/videos/SaizulPortfolio/timeline.json");
  issues.push(...checkTimeline(portfolio, "SaizulPortfolio/timeline.json"));
  issues.push(...checkVoiceover(read("src/videos/SaizulPortfolio/voiceover.json"), totalFrames(portfolio), "SaizulPortfolio/voiceover.json"));

  issues.push(...checkBeats(read("src/videos/TeamDance/beats.json"), "TeamDance/beats.json"));

  const refs = walk(path.join(root, "src")).flatMap((file) =>
    staticFileRefs(readFileSync(file, "utf8")).map((p) => ({ file: path.relative(root, file), path: p })),
  );
  issues.push(...checkAssets(refs, (p) => existsSync(path.join(root, "public", p))));
  return issues;
}

if (process.argv[1] && /check-media\.ts$/.test(process.argv[1])) {
  const strict = process.argv.includes("--strict");
  const issues = collectIssues();
  for (const i of issues) console.log(`${i.level === "error" ? "ERROR" : "warn "}  ${i.where}: ${i.message}`);
  const errors = issues.filter((i) => i.level === "error").length;
  const warnings = issues.length - errors;
  console.log(`\n${errors} error(s), ${warnings} warning(s)${strict && warnings ? " (--strict: warnings fail)" : ""}`);
  process.exit(errors || (strict && warnings) ? 1 : 0);
}
