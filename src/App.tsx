import { Box, AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { Undo, Redo } from "@mui/icons-material";
import { Canvas } from "./components/Canvas";
import { PlaybackControls } from "./components/PlaybackControls";
import { Timeline } from "./components/Timeline";
import { useTimelineStore } from "./store/timelineStore";

function App() {
  const { commandHistory, commandIndex, undo, redo } = useTimelineStore();

  const canUndo = commandIndex >= 0;
  const canRedo = commandIndex < commandHistory.length - 1;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Timeline Editor
          </Typography>
          <IconButton
            color="inherit"
            disabled={!canUndo}
            onClick={undo}
            title="Undo"
          >
            <Undo />
          </IconButton>
          <IconButton
            color="inherit"
            disabled={!canRedo}
            onClick={redo}
            title="Redo"
          >
            <Redo />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 3,
          px: { xs: 2, sm: 3, md: 4 },
          gap: 3,
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Canvas />
          <PlaybackControls />
          <Timeline />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
