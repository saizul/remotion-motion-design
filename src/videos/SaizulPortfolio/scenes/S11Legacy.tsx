import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EASE_IN_OUT, EASE_OUT, tween } from "../anim";
import { EnergyRings, PulseRing } from "../components/Fx";
import { LogoPlate, ParticleLogo } from "../components/Logo";
import { HoloPortrait } from "../components/Portrait";
import { Backdrop, Dust } from "../components/Space";
import { TypeText } from "../components/TypeText";
import { sa } from "../theme";
import { cue } from "../typing";

const PLATE_W = 720;
const LOGO_W = PLATE_W * 0.84;
const TITLES = ["legacyTitle0", "legacyTitle1", "legacyTitle2", "legacyTitle3", "legacyTitle4", "legacyTitle5"] as const;

// Final assembly: logo forms once more, Saizul stands beside it, titles and URL type out, cursor blinks.
export const S11Legacy: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = tween(frame, [0, 240], [1, 1.06], EASE_IN_OUT);
  const assemble = tween(frame, [0, 46], [0, 1], (t) => t);
  const plate = tween(frame, [42, 62], [0, 1]);
  return (
    <AbsoluteFill>
      <Backdrop focusX={40} tint="#0B1D48" />
      <Dust seed="s11" count={150} speed={0.6} />
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "40% 45%" }}>
        <div style={{ position: "absolute", left: 1150, top: 110 }}>
          <HoloPortrait src="saizul/cutout-front.png" width={900} height={970} reveal={tween(frame, [60, 96], [0, 1], EASE_IN_OUT)} orbit={0.6} />
        </div>
        <div style={{ position: "absolute", left: 140, top: 90, perspective: 1600 }}>
          <div style={{ position: "absolute", left: PLATE_W / 2, top: 150 }}>
            <EnergyRings size={950} intensity={plate * 0.6} speed={0.5} />
            <PulseRing progress={tween(frame, [48, 84], [0, 1])} size={1300} />
          </div>
          <div style={{ transform: `rotateY(${tween(frame, [42, 90], [-30, 0], EASE_OUT) + Math.sin(frame * 0.03) * 3}deg)` }}>
            <LogoPlate width={PLATE_W} glow={plate} opacity={plate} energy={plate} />
            <div style={{ position: "absolute", left: (PLATE_W - LOGO_W) / 2, top: PLATE_W * 0.07, opacity: 1 - plate }}>
              <ParticleLogo width={LOGO_W} progress={assemble} seed="pl2" />
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 150, top: 470 }}>
          <TypeText cue={cue("legacyName")} fontSize={58} weight={300} letterSpacing={18} />
          <div style={{ marginTop: 16 }}>
            {TITLES.map((id) => (
              <TypeText key={id} cue={cue(id)} fontSize={30} weight={500} color={sa.colors.silver} lineHeight={1.45} letterSpacing={0.5} glow={false} />
            ))}
          </div>
          <div style={{ marginTop: 26 }}>
            <TypeText cue={cue("legacyUrl")} fontSize={48} weight={700} color={sa.colors.cyan} font={sa.fonts.mono} letterSpacing={0} holdCaret />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
