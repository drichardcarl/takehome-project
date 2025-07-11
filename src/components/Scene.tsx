import { Card, CardContent, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { MIN_SCENE_LENGTH, PIXELS_PER_FRAME } from "../constants";
import type { Scene as SceneType } from "../store/timelineStore";
import { useTimelineStore } from "../store/timelineStore";

interface SceneProps {
  scene: SceneType;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDragOver?: () => void;
  isDragPreview?: boolean;
  showDropZone?: boolean;
}

export const Scene = ({
  scene,
  onDragStart,
  onDragEnd,
  onDragOver,
  isDragPreview = false,
  showDropZone = false,
}: SceneProps) => {
  const theme = useTheme();
  const { reorderScenes, resizeScene } = useTimelineStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [originalLength, setOriginalLength] = useState(0);
  const [currentMouseX, setCurrentMouseX] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const width = scene.scene_length * PIXELS_PER_FRAME;

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", scene.scene_index.toString());
    onDragStart?.();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd?.();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    onDragOver?.();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
    const toIndex = scene.scene_index;

    if (fromIndex !== toIndex) {
      reorderScenes(fromIndex, toIndex);
    }
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStartX(e.clientX);
    setOriginalLength(scene.scene_length);
  };

  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      setCurrentMouseX(e.clientX);
      const deltaX = e.clientX - resizeStartX;
      const deltaFrames = Math.round(deltaX / PIXELS_PER_FRAME);
      const newLength = Math.max(
        MIN_SCENE_LENGTH,
        originalLength + deltaFrames
      );

      // Update the scene length in real-time for visual feedback
      if (cardRef.current) {
        const newWidth = Math.max(
          newLength * PIXELS_PER_FRAME,
          MIN_SCENE_LENGTH * PIXELS_PER_FRAME
        );
        cardRef.current.style.width = `${newWidth}px`;
        cardRef.current.style.transition = "none"; // Disable transition during resize
      }
    },
    [isResizing, resizeStartX, originalLength]
  );

  const handleResizeEnd = useCallback(() => {
    if (!isResizing) return;

    setIsResizing(false);

    // Calculate final length using current mouse position
    const deltaX = currentMouseX - resizeStartX;
    const deltaFrames = Math.round(deltaX / PIXELS_PER_FRAME);
    const newLength = Math.max(MIN_SCENE_LENGTH, originalLength + deltaFrames);

    if (newLength !== scene.scene_length) {
      resizeScene(scene.scene_index, newLength);
    }

    // Reset card width and re-enable transitions
    if (cardRef.current) {
      cardRef.current.style.width = "";
      cardRef.current.style.transition = "";
    }
  }, [
    isResizing,
    currentMouseX,
    resizeStartX,
    originalLength,
    scene.scene_length,
    scene.scene_index,
    resizeScene,
  ]);

  // Add global mouse event listeners for resize
  useEffect(() => {
    if (isResizing) {
      const handleMouseMove = (e: MouseEvent) => handleResizeMove(e);
      const handleMouseUp = () => handleResizeEnd();

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isDragPreview ? 1.05 : 1,
        rotate: isDragPreview ? 5 : 0,
        zIndex: isDragPreview ? 1000 : 1,
      }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3,
      }}
      style={{ position: "relative" }}
    >
      <motion.div
        whileHover={{
          margin: "0px 5px 0px 5px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        }}
        whileTap={{ scale: 0.98 }}
      >
        <Card
          ref={cardRef}
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          sx={{
            width: `${width}px`,
            height: "120px",
            backgroundColor: scene.scene_color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isDragging ? "grabbing" : "grab",
            position: "relative",
            flexShrink: 0,
            opacity: isDragging ? 0.5 : 1,
            transform: isDragging ? "rotate(5deg)" : "none",
            transition: "opacity 0.2s, transform 0.2s",
            userSelect: "none",
            border: showDropZone
              ? `3px solid ${theme.palette.primary.main}`
              : "none",
            boxShadow: showDropZone
              ? `0 0 20px ${theme.palette.primary.main}40`
              : "none",
          }}
        >
          <CardContent sx={{ p: 1 }}>
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {scene.scene_name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "white",
                textAlign: "center",
                opacity: 0.8,
              }}
            >
              {scene.scene_length} frames
            </Typography>
          </CardContent>

          {/* Right resize handle */}
          <motion.div
            onMouseDown={handleResizeStart}
            whileHover={{ scale: 1.2, opacity: 1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              position: "absolute",
              right: 0,
              transform: "translateY(-50%)",
              width: "6px",
              height: "40px",
              backgroundColor: theme.palette.background.paper,
              borderRadius: "3px",
              cursor: "ew-resize",
              opacity: 0.7,
              zIndex: 10,
              scale: 1,
            }}
          />
        </Card>
      </motion.div>
    </motion.div>
  );
};
