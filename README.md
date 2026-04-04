### 


# PROMPT2VIDEO - AI 一句话生成 Remotion 短视频

**COMPSCI 732 Assignment**  



使用 **MERN 栈 + Remotion + DeepSeek AI** 实现：输入一句话主题 → AI 自动生成视频文案和配色 → 一键生成专业级 1080p 短视频。

**演示效果**：输入“奶茶店开业” → 自动生成带粒子背景、Logo 动画、标题 + 功能列表的 10-15 秒酷炫视频。

## ✨ 功能亮点
- ✅ 一句话提示词 → DeepSeek AI 自动生成完整视频配置（颜色 + 场景）
- ✅ 浏览器实时预览（Remotion Player）
- ✅ 一键导出高清 MP4（Remotion 服务器端渲染）
- ✅ 动态视频时长（根据 AI 生成的场景数量自动适配）
- ✅ 模块化动画组件（Logo、粒子背景、标题、列表）

## 🛠 技术栈（MERN + 自学扩展）
- **Frontend**: React 18 + Vite + Tailwind CSS + Remotion Player
- **Backend**: Node.js + Express + DeepSeek AI (通过 OpenAI SDK 兼容)
- **Video Engine**: Remotion（核心自学技术）—— 用 React 写视频
- **AI**: DeepSeek-chat（结构化 JSON 输出）
- **Type Safety**: Zod + Remotion Schema

## 📋 前置要求
- Node.js 20+
- 一个 DeepSeek API Key

## 🚀 本地运行（两终端同时启动）

### 1. 后端（Server）
```bash
cd server
cp .env.example .env          # 把你的 DEEPSEEK_API_KEY 填进去
npm install
node server.mjs
```

后端运行在 http://localhost:5000

### 2. 前端（Frontend）

Bash

```
cd frontend
npm install
npm run dev
```

前端运行在 http://localhost:5173

打开浏览器访问前端地址即可开始使用！

## 📁 项目结构说明

text

```
PROMPT2VIDEO/
├── frontend/          # React + Remotion Player 前端界面
├── remotion/          # Remotion 视频模板（核心自学部分）
│   └── src/
│       ├── render.tsx          # Remotion 打包入口
│       ├── Root.tsx            # 注册 Composition
│       └── video/HelloWorld/   # 所有动画组件
├── server/            # Express + AI + 渲染后端
│   ├── server.mjs
│   └── out/           # 生成的 MP4 文件夹
└── .env.example
```

**核心流程**：

1. 前端 App.tsx 发送提示词 → server.mjs 调用 DeepSeek
2. DeepSeek 返回 JSON 配置 → App.tsx 用 Remotion Player 实时预览
3. 点击导出 → server.mjs 使用 bundle() + renderMedia() 把 React 组件渲染成 MP4

## 🎥 Remotion 核心实现（本作业自学重点）

Remotion 允许我们**用 React 写视频**，核心概念如下：

- registerRoot(RemotionRoot)（render.tsx）：Remotion 渲染引擎入口
- <Composition>（Root.tsx）：定义可渲染的视频模板
- calculateMetadata：根据 AI 生成的 scenes 动态计算视频总时长
- Sequence + getStartFrame：把多个场景按顺序无缝拼接
- useCurrentFrame() + spring() + interpolate()：实现 Logo 飞入、粒子背景、结尾淡出等帧级动画

详细代码讲解见视频演示。

## 🔧 如何扩展

- 想增加新场景类型？在 HelloWorld.tsx 添加新的 scene.type 并创建对应组件即可。
- 想更换 AI 模型？只需修改 server.mjs 中的 baseURL 和 model。
- 想部署？把前端部署到 Vercel，后端部署到 Render / Railway 即可。

## 📝 注意事项

- .env 文件已加入 .gitignore，请使用 .env.example 作为模板
- out/ 文件夹里的 MP4 文件不会提交到 GitHub
- node_modules 已忽略

**本项目完全符合课程要求**：基于 MERN 栈，深度自学 Remotion + AI 集成，代码结构清晰，可直接运行。

欢迎同学们 fork、提 issue、一起改进！
