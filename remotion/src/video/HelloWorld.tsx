import { zColor } from "@remotion/zod-types";
import { loadFont } from "@remotion/google-fonts/Inter";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { Logo } from "./HelloWorld/Logo";
import { Subtitle } from "./HelloWorld/Subtitle";
import { Title } from "./HelloWorld/Title";
import { Background } from "./HelloWorld/Background";
import { FeatureScene } from "./HelloWorld/FeatureScene";

const { fontFamily } = loadFont();

// ==========================================
// 1. 定义 Schema (数据结构)
// ==========================================
const introSceneSchema = z.object({
  type: z.literal("intro"),
  title: z.string(),
  subtitle: z.string(),
});

const featureSceneSchema = z.object({
  type: z.literal("features"),
  title: z.string(),
  items: z.array(z.string()),
});

// 主 Schema：组合基础颜色和场景数组
export const myCompSchema = z.object({
  themeColor: zColor(),
  logoColor1: zColor(),
  logoColor2: zColor(),
  scenes: z.array(z.union([introSceneSchema, featureSceneSchema])),
});

// ==========================================
// 2. 主视频组件
// ==========================================
export const HelloWorld: React.FC<z.infer<typeof myCompSchema>> = ({
  themeColor,
  logoColor1,
  logoColor2,
  scenes = [], // 💡 防御性空数组，防止未加载时报错
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // 💡 1. 提取一个获取场景时长的小工具
  const getSceneDuration = (type: string) => {
    if (type === "intro") return 120; // 标题场景：4秒 (4 * 30fps = 120)
    if (type === "features") return 210; // 列表场景：7秒 (7 * 30fps = 210)
    return 150; // 兜底默认值
  };

  // 💡 2. 计算某个场景的起始帧（把前面所有场景的时间加起来）
  const getStartFrame = (currentIndex: number) => {
    let start = 0;
    for (let i = 0; i < currentIndex; i++) {
      start += getSceneDuration(scenes[i].type);
    }
    return start;
  };
  // --- 保留你原本的优秀动画逻辑 ---
  
  // 1. Logo 平移动画
  const logoTranslationProgress = spring({
    frame: frame - 25,
    fps,
    config: { damping: 100 },
  });
  const logoTranslation = interpolate(logoTranslationProgress, [0, 1], [0, -150]);

  // 2. 视频结尾整体淡出
  const opacity = interpolate(
    frame,
    [durationInFrames - 25, durationInFrames - 15],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', fontFamily }}>
      {/* 动态粒子背景 */}
      <Background color={logoColor1} />

      {/* 包含淡出效果的主容器 */}
      <AbsoluteFill style={{ opacity }}>
        
        {/* 常驻的 Logo，带有你原本写的向上平移动画 */}
        <AbsoluteFill style={{ top: '-10%', transform: `translateY(${logoTranslation}px) scale(0.5)` }}>
          <Logo logoColor1={logoColor1} logoColor2={logoColor2} />
        </AbsoluteFill>

        {/* 核心：动态渲染 AI 生成的场景 */}
        {scenes.map((scene, index) => {
          // 💡 3. 使用新的动态时间和起始帧
          const duration = getSceneDuration(scene.type);
          const startFrame = getStartFrame(index);
          
          return (
            <Sequence key={index} from={startFrame} durationInFrames={duration}>
              
              {/* === 场景 1: Intro (主标题 + 副标题) === */}
              {scene.type === "intro" && (
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  paddingTop: '300px' // 给上方的 Logo 留出空间
                }}>
                  <Title titleText={scene.title} titleColor={themeColor} />
                  <div style={{ marginTop: '20px', width: '100%' }}>
                    <Subtitle subtitleText={scene.subtitle} />
                  </div>
                </div>
              )}

              {/* === 场景 2: Features (列表展示) === */}
              {scene.type === "features" && (
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  paddingTop: '500px' // 列表比较长，向下移一点
                }}>
                  <FeatureScene 
                    title={scene.title} 
                    items={scene.items} 
                    themeColor={themeColor} 
                  />
                </div>
              )}

            </Sequence>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};