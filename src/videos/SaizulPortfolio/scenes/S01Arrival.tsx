import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EASE_IN_OUT, EASE_OUT, tween } from "../anim";
import { EnergyRings, PulseRing } from "../components/Fx";
import { LogoPlate, ParticleLogo } from "../components/Logo";
import { Backdrop, Dust } from "../components/Space";
import { TypeText } from "../components/TypeText";
import { sceneFrames } from "../theme";
import { cue } from "../typing";

const PLATE_W = 980;
const LOGO_W = PLATE_W * 0.84;

// Silver particles assemble the logo (8→104), the plate lights up (100→130), energy flows, name types.
export const S01Arrival: React.FC = () => {
  const frame = useCurrentFrame();
  const len = sceneFrames.arrival;
  const push = tween(frame, [0, len], [0.9, 1.05], EASE_IN_OUT);
  const assemble = tween(frame, [8, 104], [0, 1], (t) => t);
  const plate = tween(frame, [100, 128], [0, 1]);
  const rotY = tween(frame, [100, 150], [-38, 0], EASE_OUT) + Math.sin(frame * 0.04) * 4;
  const rotX = Math.sin(frame * 0.03) * 3;

  return (
    <AbsoluteFill>
      <Backdrop tint="#0A1733" />
      <Dust seed="s1" count={140} mode="forward" speed={0.8} />
      <AbsoluteFill style={{ transform: `scale(${push})`, alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", marginTop: -90, perspective: 1800 }}>
          <div style={{ position: "absolute", left: "50%", top: "50%" }}>
            <EnergyRings size={1300} intensity={plate * 0.8} speed={0.6} />
            <PulseRing progress={tween(frame, [104, 140], [0, 1])} size={1500} />
          </div>
          <div style={{ transform: `rotateY(${rotY}deg) rotateX(${rotX}deg)`, transformStyle: "preserve-3d" }}>
            <LogoPlate width={PLATE_W} energy={tween(frame, [128, 150], [0, 1])} glow={plate} opacity={plate} />
            <div
              style={{
                position: "absolute",
                left: (PLATE_W - LOGO_W) / 2,
                top: PLATE_W * 0.07,
                opacity: 1 - tween(frame, [104, 124], [0, 1]),
              }}
            >
              <ParticleLogo width={LOGO_W} progress={assemble} />
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", top: 780, width: 1920 }}>
          <TypeText cue={cue("arrivalName")} fontSize={64} weight={300} letterSpacing={26} align="center" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
