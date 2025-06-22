import { Box, Button, Paper } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useTimelineStore } from "../store/timelineStore";
import { Scene } from "./Scene";

export const Timeline = () => {
  const { scenes, addScene } = useTimelineStore();

  const handleAddScene = () => {
    addScene();
  };

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
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          p: 2,
          minHeight: "160px",
          maxWidth: "90vw",
          overflowX: "auto",
          backgroundColor: "#cccccc",
        }}
      >
        {scenes.map((scene) => (
          <Scene key={scene.scene_index} scene={scene} />
        ))}
      </Paper>
    </Box>
  );
};
