import React, { useMemo } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const Background: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  // 使用 useMemo 保证粒子在重绘时位置不会乱跳，只在初始化时随机一次
  const particles = useMemo(() => {
    return new Array(30).fill(0).map((_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 10 + 5,
      speed: Math.random() * 2 + 1,
      delay: Math.random() * 100,
    }));
  }, [width, height]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      {particles.map((p, i) => {
        // 让粒子向上缓缓流动
        const translateY = interpolate(
          (frame + p.delay) % durationInFrames,
          [0, durationInFrames],
          [0, -height - 100]
        );

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y + height, // 从屏幕下方开始
              width: p.size,
              height: p.size,
              backgroundColor: color,
              borderRadius: '50%',
              opacity: 0.4,
              filter: 'blur(4px)', // 模糊效果让它看起来像光点
              transform: `translateY(${translateY}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};