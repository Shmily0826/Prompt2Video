import { zColor } from "@remotion/zod-types";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolateColors, // 💡 处理颜色变化要用这个
} from "remotion";
import { z } from "zod";
import { Logo } from "./HelloWorld/Logo";
import { Subtitle } from "./HelloWorld/Subtitle";
import { Title } from "./HelloWorld/Title";
import { Background } from "./HelloWorld/Background";


// 定义 Schema
export const myCompSchema = z.object({
  titleText: z.string(),
  subtitleText: z.string(),
  titleColor: zColor(),
  logoColor1: zColor(),
  logoColor2: zColor(),
});

// 使用 React.FC 并显式声明 Props 类型，解决 "implicit any" 报错
export const HelloWorld: React.FC<z.infer<typeof myCompSchema>> = ({
  titleText,
  subtitleText,
  titleColor,
  logoColor1,
  logoColor2,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // 1. 背景颜色动画：使用 interpolateColors 处理十六进制颜色
  const backgroundColor = interpolateColors(
    frame,
    [0, durationInFrames],
    ["#ffffff", "#e0e0e0"]
  );

  // 2. Logo 平移动画
  const logoTranslationProgress = spring({
    frame: frame - 25,
    fps,
    config: { damping: 100 },
  });
  const logoTranslation = interpolate(logoTranslationProgress, [0, 1], [0, -150]);

  // 3. 整体淡出
  const opacity = interpolate(
    frame,
    [durationInFrames - 25, durationInFrames - 15],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 4. 标题弹出动画
  const titleScale = spring({
    frame: frame - 35,
    fps,
    config: { stiffness: 100, damping: 10 },
  });



  
return (
  <AbsoluteFill>
    <Background color={logoColor1} />

    <AbsoluteFill style={{ opacity }}>
      {/* 1. Logo 向上移动得更多一点 */}
      <AbsoluteFill style={{ transform: `translateY(${logoTranslation - 20}px)` }}>
        <Logo logoColor1={logoColor1} logoColor2={logoColor2} />
      </AbsoluteFill>

      {/* 2. 主标题部分 */}
      <Sequence from={35}>
        <div style={{ 
          width: '100%', 
          height: '100%',
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          transform: `scale(${titleScale})`, 
          // 💡 调整这里的 paddingTop。如果 Logo 挡住了，就增大这个值；
          // 如果整体太靠下，就减小这个值。
          paddingTop: '500px' 
        }}>
          <Title titleText={titleText} titleColor={titleColor} />
          
          {/* 3. 副标题：现在它会严格出现在 Title 正下方 1px 的位置 */}
          <div style={{ 
            marginTop: '1px', 
            opacity: frame > 75 ? 1 : 0,
            width: '100%' 
          }}>
            <Subtitle subtitleText={subtitleText} />
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  </AbsoluteFill>
);
};