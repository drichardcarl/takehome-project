import { Add } from "@mui/icons-material";
import { Box, Button, Paper } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { PIXELS_PER_FRAME, TIMELINE_PADDING } from "../constants";
import { useTimelineStore } from "../store/timelineStore";
import { Scene } from "./Scene";

export const Timeline = () => {
  const { scenes, addScene, playback, totalFrames, setCurrentFrame } =
    useTimelineStore();
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    draggedIndex: number | null;
    dropIndex: number | null;
  }>({
    isDragging: false,
    draggedIndex: null,
    dropIndex: null,
  });
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

  // Handle drag state updates
  const handleDragStart = (index: number) => {
    setDragState({
      isDragging: true,
      draggedIndex: index,
      dropIndex: null,
    });
  };

  const handleDragEnd = () => {
    setDragState({
      isDragging: false,
      draggedIndex: null,
      dropIndex: null,
    });
  };

  const handleDragOver = (index: number) => {
    if (dragState.isDragging && dragState.draggedIndex !== null) {
      setDragState((prev) => ({
        ...prev,
        dropIndex: index,
      }));
    }
  };

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
        <AnimatePresence>
          {scenes.map((scene, index) => (
            <motion.div
              key={scene.scene_index}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                x:
                  dragState.isDragging && dragState.draggedIndex === index
                    ? 0
                    : 0,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.3,
              }}
              style={{
                position: "relative",
                zIndex:
                  dragState.isDragging && dragState.draggedIndex === index
                    ? 1000
                    : 1,
              }}
            >
              <Scene
                scene={scene}
                onDragStart={() => handleDragStart(index)}
                onDragEnd={handleDragEnd}
                onDragOver={() => handleDragOver(index)}
                isDragPreview={
                  dragState.isDragging && dragState.draggedIndex === index
                }
                showDropZone={
                  dragState.isDragging &&
                  dragState.dropIndex === index &&
                  dragState.draggedIndex !== index
                }
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Drop zone indicators */}
        <AnimatePresence>
          {dragState.isDragging && dragState.dropIndex !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute",
                left: `${(() => {
                  let position = TIMELINE_PADDING;
                  for (let i = 0; i < dragState.dropIndex; i++) {
                    position += scenes[i].scene_length * PIXELS_PER_FRAME;
                  }
                  return position;
                })()}px`,
                transform: "translateY(-50%)",
                width: "4px",
                height: "140px",
                backgroundColor: "#ff4444",
                borderRadius: "2px",
                zIndex: 999,
              }}
            />
          )}
        </AnimatePresence>

        <motion.div
          onMouseDown={handlePlayheadMouseDown}
          animate={{
            x: playheadPosition,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          style={{
            position: "absolute",
            top: "12px",
            bottom: "5px",
            width: "2px",
            backgroundColor: "red",
            cursor: "grab",
            zIndex: 10,
          }}
          whileHover={{
            backgroundColor: "#ff3333",
          }}
          whileTap={{
            cursor: "grabbing",
          }}
        >
          <motion.div
            animate={{
              rotate: isDraggingPlayhead ? 180 : 0,
            }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              top: -8,
              left: -7,
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderBottom: "8px solid red",
            }}
          />
        </motion.div>
      </Paper>
    </Box>
  );
};
