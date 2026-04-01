import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Sequence } from "remotion";

export const FeatureScene: React.FC<{
  title: string;
  items: string[];
  themeColor: string;
}> = ({ title, items, themeColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 标题进场动画
  const titleScale = spring({ frame: frame - 10, fps, config: { damping: 12 } });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', color: themeColor }}>
      {/* 场景小标题 */}
      <h2 style={{ fontSize: 60, transform: `scale(${titleScale})`, margin: '0 0 40px 0' }}>
        {title}
      </h2>

      {/* 逐个弹出的列表项 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: 40 }}>
        {items.map((item, index) => {
          // 每个 item 依次延迟 15 帧出现
          const itemScale = spring({
            frame: frame - (30 + index * 15), 
            fps,
            config: { damping: 14 }
          });
          
          return (
            <div key={index} style={{ transform: `scale(${itemScale})`, backgroundColor: 'rgba(255,255,255,0.1)', padding: '10px 30px', borderRadius: '15px' }}>
              ✨ {item}
            </div>
          );
        })}
      </div>
    </div>
  );
};