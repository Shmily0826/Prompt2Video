import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

// 渲染引擎专用的入口，必须使用 registerRoot
registerRoot(RemotionRoot);