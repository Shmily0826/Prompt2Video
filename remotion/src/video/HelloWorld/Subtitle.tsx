import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

// 💡 必须定义接收 subtitleText 的接口
export const Subtitle: React.FC<{ subtitleText?: string }> = ({ subtitleText }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <div
      style={{
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontSize: 60,
        textAlign: 'center',
        // 💡 关键修改：去掉 position: 'absolute' 和 bottom: 140
        width: '100%',
        opacity,
        color: '#e0e0e0', // 调亮一点，避免和深色背景融为一体
        textShadow: '0 0 10px rgba(0,0,0,0.5)', // 增加阴影防止看不清
      }}
    >
      {subtitleText || "默认副标题"}
    </div>
  );
};