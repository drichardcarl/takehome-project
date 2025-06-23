import { Add } from "@mui/icons-material";
import { Box, Button, Paper } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { PIXELS_PER_FRAME, TIMELINE_PADDING } from "../constants";
import { useTimelineStore } from "../store/timelineStore";
import { Scene } from "./Scene";

export const Timeline = () => {
  const { scenes, addScene, playback, totalFrames, setCurrentFrame } =
    useTimelineStore();
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const paperRef = useRef<HTMLDivElement>(null);

  const handleAddScene = () => {
    addScene();
  };

  const contentWidth = scenes.reduce((total, scene) => {
    return total + scene.scene_length * PIXELS_PER_FRAME;
  }, 0);

  const playheadPosition =
    totalFrames > 0 ? (playback.currentFrame / totalFrames) * contentWidth : 0;

  const handlePlayheadMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPlayhead(true);
  };

  const updateFrameFromPosition = useCallback(
    (positionX: number) => {
      if (!paperRef.current) return;

      const rect = paperRef.current.getBoundingClientRect();
      const scrollLeft = paperRef.current.scrollLeft;

      const mouseX = positionX - rect.left + scrollLeft - TIMELINE_PADDING;
      const clampedMouseX = Math.max(0, Math.min(mouseX, contentWidth));

      if (contentWidth > 0) {
        const newFrame = Math.round(
          (clampedMouseX / contentWidth) * totalFrames
        );
        setCurrentFrame(Math.max(0, Math.min(newFrame, totalFrames - 1)));
      }
    },
    [contentWidth, totalFrames, setCurrentFrame]
  );

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (e.target !== paperRef.current) {
      return;
    }

    if (isDraggingPlayhead) return;
    updateFrameFromPosition(e.clientX);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingPlayhead) return;
      updateFrameFromPosition(e.clientX);
    },
    [isDraggingPlayhead, updateFrameFromPosition]
  );

  const handleMouseUp = useCallback(() => {
    setIsDraggingPlayhead(false);
  }, []);

  useEffect(() => {
    if (isDraggingPlayhead) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDraggingPlayhead, handleMouseMove, handleMouseUp]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ mb: 2, width: "90vw" }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddScene}
        >
          Add Scene
        </Button>
      </Box>

      <Paper
        ref={paperRef}
        onClick={handleTimelineClick}
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          p: `${TIMELINE_PADDING}px`,
          pt: "24px",
          minHeight: "160px",
          width: "90vw",
          maxWidth: "90vw",
          overflowX: "auto",
          backgroundColor: "#cccccc",
          cursor: "pointer",
        }}
      >
        {scenes.map((scene) => (
          <Scene key={scene.scene_index} scene={scene} />
        ))}

        <Box
          onMouseDown={handlePlayheadMouseDown}
          sx={{
            position: "absolute",
            left: `${playheadPosition + TIMELINE_PADDING}px`,
            top: "12px",
            bottom: "5px",
            width: "2px",
            backgroundColor: "red",
            cursor: "grab",
            zIndex: 10,
            "&:hover": {
              width: "4px",
              backgroundColor: "#ff3333",
            },
            "&:active": {
              cursor: "grabbing",
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -8,
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderBottom: "8px solid red",
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};
