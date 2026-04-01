import React, { useMemo } from 'react';
// 💡 1. 引入 Remotion 的 random 函数
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, random } from 'remotion';

export const Background: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const particles = useMemo(() => {
    return new Array(30).fill(0).map((_, i) => ({
      // 💡 2. 把所有的 Math.random() 替换为 random(seed)。
      // 只要传入的字符串(seed)不变，它每次返回的随机数就绝对一样！
      x: random(`x-${i}`) * width,
      y: random(`y-${i}`) * height,
      size: random(`size-${i}`) * 10 + 5,
      speedFactor: random(`speed-${i}`) * 2 + 1, 
      delay: random(`delay-${i}`) * 100,
    }));
  }, [width, height]);

  const PARTICLE_FLOW_PERIOD = 300; 

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      {particles.map((p, i) => {
        const translateY = interpolate(
          ((frame + p.delay) * p.speedFactor) % PARTICLE_FLOW_PERIOD,
          [0, PARTICLE_FLOW_PERIOD],
          [0, -height - 200]
        );

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y + height + 100, 
              width: p.size,
              height: p.size,
              backgroundColor: color,
              borderRadius: '50%',
              opacity: 0.4,
              filter: 'blur(4px)',
              transform: `translateY(${translateY}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};