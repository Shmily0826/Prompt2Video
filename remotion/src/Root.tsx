import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./video/HelloWorld";
import { Logo, myCompSchema2 } from "./video/HelloWorld/Logo";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={420}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        schema={myCompSchema}
        
        defaultProps={{
          titleText: "Hello COMPSCI 732",
          titleColor: "#3b82f6",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
          scenes: [
            { type: "intro", title: "默认标题", subtitle: "默认副标题" },
            { type: "features", title: "默认列表", items: ["A", "B", "C"] }
          ]
        }}

        // 每次渲染前，Remotion 会先执行这个函数，根据 props (就是你的 videoConfig) 来决定最终的渲染长度
        calculateMetadata={({ props }) => {
          const totalDuration = props.scenes 
            ? props.scenes.reduce((total, scene) => {
                const duration = scene.type === "intro" ? 120 : 210;
                return total + duration;
              }, 0)
            : 330;

          return {
            durationInFrames: totalDuration,
          };
        }}
      />

      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema2}
        defaultProps={{
          logoColor1: "#91dAE2" as const,
          logoColor2: "#86A8E7" as const,
        }}
      />
    </>
  );
};
