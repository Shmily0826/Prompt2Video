import express from 'express';
import cors from 'cors';
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 在 app.post('/api/render', ...) 内部添加：
const outDir = path.join(__dirname, "out");
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir); // 确保目录存在
}
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate-config', async (req, res) => {
  const { prompt } = req.body;
  console.log("收到用户需求:", prompt);

  // 模拟 AI 逻辑
  const mockConfig = {
    titleText: prompt || "AI 生成的标题",
    titleColor: "#" + Math.floor(Math.random()*16777215).toString(16),
    logoColor1: "#00b4d8",
    logoColor2: "#0077b6",
  };

  res.json(mockConfig);
});
// 增加一个渲染接口
app.post('/api/render', async (req, res) => {
    const { videoConfig } = req.body;
    console.log("🎬 开始渲染视频，配置:", videoConfig);

    try {
        // 1. 定义入口文件路径
        const entry = path.join(__dirname, "..", "remotion", "src", "render.tsx");
        
        // 2. 将 React 代码打包 (Bundle)
        const bundled = await bundle(entry);

        // 3. 选择要渲染的组合 (Composition)
        const compositionId = "HelloWorld";
        const composition = await selectComposition({
            serveUrl: bundled,
            id: compositionId,
            inputProps: videoConfig, // 关键：把当前的 AI 配置传进去
        });

        const outputLocation = path.join(__dirname, `out/video-${Date.now()}.mp4`);

        // 4. 执行渲染
        await renderMedia({
            composition,
            serveUrl: bundled,
            codec: "h264",
            outputLocation,
            inputProps: videoConfig,
            // 💡 新增：通过 crf 控制体积。范围 0-51，建议 24-28。
            // 28 左右可以让 5s 视频保持在几 MB 以内（数值越小越清晰）。
            crf: 6, 
            pixelFormat: "yuv420p", // 提高设备兼容性
        });

        console.log("✅ 渲染成功:", outputLocation);
        res.json({ success: true, url: outputLocation }); 
    } catch (error) {
        console.error("❌ 详细错误信息:");
        console.error(error); // 这行会在终端打印具体是哪个文件找不到或哪个插件报错
        res.status(500).json({ error: error.message, stack: error.stack });
        }
});

app.get('/', (req, res) => {
  res.json({ status: "Backend is running ✅" });
});
app.listen(5000, () => console.log('Backend Server 运行在 http://localhost:5000'));