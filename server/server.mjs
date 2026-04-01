import express from 'express';
import cors from 'cors';
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
import OpenAI from 'openai'; // 💡 新增：引入大模型 SDK
import dotenv from 'dotenv';

;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') })
// 确保输出目录存在
const outDir = path.join(__dirname, "out");
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir); 
}

const app = express();
app.use(cors());
app.use(express.json());

// 💡 1. 初始化 DeepSeek 客户端
// ⚠️ 注意：请把 "YOUR_DEEPSEEK_API_KEY" 替换成你真实的 API Key
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com', // 关键：将请求地址指向 DeepSeek
  apiKey: process.env.DEEPSEEK_API_KEY, // 从环境变量读取 API Key，更安全
});

// 接口 1：生成视频配置（接入 AI 大脑）
app.post('/api/generate-config', async (req, res) => {
  const { prompt } = req.body;
  console.log("🤖 收到用户需求，正在请求 DeepSeek:", prompt);

  try {
    // 💡 2. 调用 DeepSeek 模型
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat", // 使用 V3 模型，速度快且稳定
      messages: [
        {
          role: "system",
          content: `你是一个专业的 Remotion 视频参数生成器以及配色专家。
          请根据用户描述，返回符合以下 JSON 格式的内容，严禁包含任何多余解释文字和 Markdown 标记：
          {
            "titleText": "视频标题",
            "subtitleText": "一句吸引人的副标题",
            "titleColor": "#十六进制颜色，必须与背景黑色(#000)有极高对比度，建议亮色",
            "logoColor1": "#主色调，需与标题色有区分度",
            "logoColor2": "#辅助色"
          }注意：禁止返回与黑色接近的暗色。`
        },
        { 
          role: "user", 
          content: prompt || "随机生成一个有科技感的标题和配色" 
        }
      ],
      response_format: { type: "json_object" } // 强制大模型返回 JSON
    });

    // 💡 3. 解析大模型返回的数据并传给前端
    const aiConfig = JSON.parse(completion.choices[0].message.content);
    console.log("✅ DeepSeek 生成配置成功:", aiConfig);
    res.json(aiConfig);

  } catch (error) {
    res.json({
      titleText: "生成失败",
      subtitleText: "请检查 API 配置",
      titleColor: "#ffffff", // 默认白色确保看清
      logoColor1: "#00b4d8",
      logoColor2: "#0077b6",
    });
    console.error("❌ DeepSeek 调用失败:", error);
    res.status(500).json({ error: "AI 生成失败，请检查 API Key 或网络" });
  }
});

// 接口 2：渲染视频（保持你原本完美运行的逻辑）
app.post('/api/render', async (req, res) => {
    const { videoConfig } = req.body;
    console.log("🎬 开始渲染视频，配置:", videoConfig);

    try {
        const entry = path.join(__dirname, "..", "remotion", "src", "render.tsx");
        const bundled = await bundle(entry);
        
        const compositionId = "HelloWorld";
        const composition = await selectComposition({
            serveUrl: bundled,
            id: compositionId,
            inputProps: videoConfig, 
        });

        const outputLocation = path.join(__dirname, `out/video-${Date.now()}.mp4`);

        await renderMedia({
            composition,
            serveUrl: bundled,
            codec: "h264",
            outputLocation,
            inputProps: videoConfig,
            crf: 6, 
            pixelFormat: "yuv420p", 
        });

        console.log("✅ 渲染成功:", outputLocation);
        res.json({ success: true, url: outputLocation }); 
    } catch (error) {
        console.error("❌ 渲染失败:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 后端服务已启动: http://localhost:${PORT}`);
});