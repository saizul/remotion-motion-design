import { Composition } from "remotion";
import { SaizulIntro } from "./SaizulIntro";
import { introTotal, theme } from "./theme";
import { UniqueMarkHSC } from "./videos/UniqueMarkHSC/UniqueMarkHSC";
import { totalFrames, um } from "./videos/UniqueMarkHSC/theme";
import { B1TestBirmingham } from "./videos/B1TestBirmingham/B1TestBirmingham";
import { b1, totalFrames as b1Total } from "./videos/B1TestBirmingham/theme";
import { SaizulPortfolio } from "./videos/SaizulPortfolio/SaizulPortfolio";
import { sa, totalFrames as saTotal } from "./videos/SaizulPortfolio/theme";
import { TeamDance } from "./videos/TeamDance/TeamDance";
import { B1Bangla } from "./videos/B1Bangla/B1Bangla";
import { bn, totalFrames as bnTotal } from "./videos/B1Bangla/theme";
import { DURATION_FRAMES as danceFrames, FPS as danceFps, SIZE as danceSize } from "./videos/TeamDance/shots";

export const RemotionRoot: React.FC = () => {
  return (
    <>
    <Composition
      id="SaizulIntro"
      component={SaizulIntro}
      durationInFrames={introTotal}
      fps={theme.fps}
      width={theme.vertical.width}
      height={theme.vertical.height}
    />
    <Composition
      id="UniqueMarkHSC"
      component={UniqueMarkHSC}
      durationInFrames={totalFrames}
      fps={um.fps}
      width={um.width}
      height={um.height}
    />
    <Composition
      id="B1TestBirmingham"
      component={B1TestBirmingham}
      durationInFrames={b1Total}
      fps={b1.fps}
      width={b1.width}
      height={b1.height}
    />
    <Composition
      id="SaizulPortfolio"
      component={SaizulPortfolio}
      durationInFrames={saTotal}
      fps={sa.fps}
      width={sa.width}
      height={sa.height}
    />
    <Composition
      id="TeamDance"
      component={TeamDance}
      durationInFrames={danceFrames}
      fps={danceFps}
      width={danceSize}
      height={danceSize}
    />
    <Composition
      id="B1Bangla"
      component={B1Bangla}
      durationInFrames={bnTotal}
      fps={bn.fps}
      width={bn.width}
      height={bn.height}
    />
    </>
  );
};
