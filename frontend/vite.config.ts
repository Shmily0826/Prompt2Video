import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    // 💡 关键修复：强制让 Vite 只使用同一份依赖，避免多实例冲突
    dedupe: [
      'react', 
      'react-dom', 
      'remotion', 
      '@remotion/player'
    ]
  }
});