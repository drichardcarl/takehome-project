import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useRef } from "react";
import { useTimelineStore } from "../store/timelineStore";
import { wasmService } from "../services/wasmService";

export const Canvas = () => {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  const {
    wasmInstance,
    setWasmInstance,
    playback,
    getSceneAtFrame,
    totalFrames,
    scenes,
  } = useTimelineStore();

  // Initialize WASM on component mount
  useEffect(() => {
    const initializeWasm = async () => {
      try {
        const module = await wasmService.loadRenderer();
        setWasmInstance(module);
      } catch (error) {
        console.error("Failed to initialize WASM:", error);
      }
    };

    if (!wasmInstance) {
      initializeWasm();
    }
  }, [wasmInstance, setWasmInstance]);

  // Handle rendering
  useEffect(() => {
    if (!wasmInstance) return;

    const renderFrame = () => {
      const sceneInfo = getSceneAtFrame(playback.currentFrame);

      if (sceneInfo) {
        const { scene, localFrame } = sceneInfo;
        wasmInstance.renderScene(
          scene.scene_name,
          scene.scene_color,
          localFrame
        );
      } else {
        wasmInstance.clearCanvas();
      }
    };

    renderFrame();
  }, [
    wasmInstance,
    playback.currentFrame,
    totalFrames,
    scenes,
    getSceneAtFrame,
  ]);

  // Handle playback animation
  useEffect(() => {
    const animate = () => {
      const { totalFrames, playback } = useTimelineStore.getState();

      if (!playback.isPlaying) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = undefined;
        }
        return;
      }

      const { currentFrame, fps } = playback;
      const nextFrame = currentFrame + 1;

      if (nextFrame >= totalFrames) {
        // Loop back to beginning
        useTimelineStore.getState().setCurrentFrame(0);
      } else {
        useTimelineStore.getState().setCurrentFrame(nextFrame);
      }

      setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate);
      }, 1000 / fps);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [playback.isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <canvas
        ref={canvasRef}
        id="canvas"
        width={1280}
        height={720}
        style={{
          width: "640px",
          height: "360px",
          border: `2px solid ${theme.palette.divider}`,
          borderRadius: "8px",
          backgroundColor: "#000",
        }}
      />
    </Box>
  );
};
