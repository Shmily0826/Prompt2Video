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

app.get('/', (req, res) => {
  res.send('🚀 后端服务器运行正常！请从前端页面 (Port 3000) 进行操作。');
});
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
      temperature: 0.8, // 💡 重点：增加 AI 的创造力（0-1，越大越发散）
      messages: [
      {
        role: "system",
        content: `You are a top Remotion short video director and copywriting master. Your task is to conceive the video's copy and color scheme based on the user-given theme.
    【⚠️ Core Rules - Must Read】
    1. Must deeply understand the theme input by the user! For example, if the user inputs 'food', the copy should talk about eating and drinking; if input 'medicine', talk about health; if input 'computer', talk about code algorithms. Never return generic phrases like 'the future has arrived' or 'explore infinite possibilities'!
    2. Colors must match the theme's atmosphere (e.g., technology uses dark blue/purple, food uses orange/red, nature uses green).
    3. Strictly output the following JSON, absolutely prohibit including extra text or Markdown tags:
    {
      "themeColor": "#FFFFFF", 
      "logoColor1": "#Fill in the color 1 that fits the theme you designed here",
      "logoColor2": "#Fill in the color 2 that fits the theme you designed here",
      "scenes": [
        { 
          "type": "intro", 
          "title": "A catchy main title closely related to the theme", 
          "subtitle": "An interesting subtitle closely related to the theme" 
        },
        { 
          "type": "features", 
          "title": "Three Core Features of the Theme", 
          "items": ["Specific feature 1", "Specific feature 2", "Specific feature 3"] 
        }
      ]
    }Note:
    1. Must return the scenes array.
    2. themeColor must have high contrast with black background (such as pure white #FFFFFF), absolutely prohibit returning dark colors.`
      },
      { 
        role: "user", 
        content: `Please generate video configuration for this theme: 【${prompt || "Random Blind Box Theme"}】` 
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