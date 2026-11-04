import { AbsoluteFill, Series } from "remotion";
import { introTimings, theme } from "./theme";
import { Background } from "./scenes/Background";
import { HookScene } from "./scenes/HookScene";
import { ServicesScene } from "./scenes/ServicesScene";
import { WorkflowScene } from "./scenes/WorkflowScene";
import { CtaScene } from "./scenes/CtaScene";

export const SaizulIntro: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: theme.font, color: theme.colors.text }}>
      <Background />
      <Series>
        <Series.Sequence durationInFrames={introTimings.hook}>
          <HookScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={introTimings.services}>
          <ServicesScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={introTimings.workflow}>
          <WorkflowScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={introTimings.cta}>
          <CtaScene />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
