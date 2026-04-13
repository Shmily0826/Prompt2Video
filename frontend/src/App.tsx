import { Player } from "@remotion/player";
import React, { useState } from "react";
import "./index.css";
import { HelloWorld, myCompSchema } from "../../remotion/src/video/HelloWorld"; // 确保路径指向你移动后的位置
import { z } from "zod";
export const App: React.FC = () => {
  // 1. 状态管理：存储视频的配置参数

  const [videoConfig, setVideoConfig] = useState({
  themeColor: "#FFFFFF",
  logoColor1: "#91EAE4",
  logoColor2: "#86A8E7",
  // 💡 重点：初始化一个默认场景，防止一开机就报错
  scenes: [
    {
      type: "intro",
      title: "Default Title",
      subtitle: "Waiting for instructions...",
    },
    {
      type: "features",
      title: "Core Features",
      items: ["AI Automatic Generation", "Multi-Scene Switching", "Remotion Rendering"]
    }
  ],
});


  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [rendering, setRendering] = useState(false);

  // 2. 调用后端 API 的函数
  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/generate-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userInput }),
      });
      const newConfig = await response.json();
      
      // 更新状态，Player 会自动重新渲染
      setVideoConfig(newConfig);
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Unable to connect to the backend server, please check if server.mjs is running");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setRendering(true);
    try {
        const response = await fetch("http://localhost:5000/api/render", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ videoConfig }), // 发送当前视频的配置
        });
        const result = await response.json();
        if (result.success) {
            alert("Video rendering completed successfully! File saved at: " + result.url);
        }
    } catch (e) {
        alert("Video rendering failed, please check the backend terminal for errors");
    } finally {
        setRendering(false);
    }
};
  const totalFrames = videoConfig.scenes 
    ? videoConfig.scenes.reduce((total, scene) => {
        const duration = scene.type === "intro" ? 120 : 210; // intro 4秒，features 7秒
        return total + duration;
      }, 0)
    : 330;

    
  return (

    <div className="flex flex-col md:flex-row h-screen bg-gray-100 p-8 gap-8">
      {/* 左侧：控制面板 */}
      <div className="w-full md:w-1/3 bg-white p-6 rounded-xl shadow-lg flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-800">AI Video Maker</h1>
        <p className="text-sm text-gray-500">COMPSCI 732 Project</p>
        
        <textarea
          className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Describe the video you want... (e.g., the development of AI technology)"
          value={userInput}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUserInput(e.target.value)}
        />


        <div className="flex gap-2 w-full">
            <button
                onClick={handleGenerate}
                disabled={loading || rendering}
                // 💡 关键：去掉 flex-[2]，直接用 w-2/3，这是最稳健的比例控制
                className={`w-2/3 py-3 rounded-lg font-bold text-white transition-all transform active:scale-95 shadow-md ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
                {loading ? "✨ Thinking..." : "🪄 Start Generation"}
            </button>

            <button
                onClick={handleExport}
                disabled={rendering || loading}
                // 💡 关键：用 w-1/3
                className={`w-1/3 py-3 rounded-lg font-bold text-white transition-all transform active:scale-95 shadow-md ${
                rendering ? "bg-sky-300 animate-pulse" : "bg-sky-500 hover:bg-sky-600"
                }`}
            >
                {rendering ? "⏳" : "📥 Export"}
            </button>
            </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-sm font-semibold mb-2">Current Configuration (JSON):</h2>
          <pre className="text-xs text-gray-600 overflow-auto max-h-96">
            {JSON.stringify(videoConfig, null, 2)}
          </pre>
        </div>
      </div>

      {/* 右侧：视频预览区 */}
      <div className="flex-1 bg-black rounded-xl overflow-hidden shadow-2xl flex items-center justify-center relative">
        <Player
          component={HelloWorld}
          inputProps={videoConfig as z.infer<typeof myCompSchema>} // 核心：将 State 注入视频
          // 💡 重点：总时长 = 场景数量 * 单个场景帧数
          durationInFrames={totalFrames}
          fps={30}
          compositionWidth={1920}
          compositionHeight={1080}
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
          }}
          controls // 显示播放控件
          autoPlay={false} // 默认不自动播放，用户点击后播放
          loop={false}// 不循环播放  
        />
      </div>
    </div>
  );
};