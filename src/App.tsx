import { Redo, Undo } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { motion } from "framer-motion";
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
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        <AppBar position="static">
          <Toolbar>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Timeline Editor
              </Typography>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{ display: "flex", gap: "8px" }}
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  color="inherit"
                  disabled={!canUndo}
                  onClick={undo}
                  title="Undo"
                >
                  <Undo />
                </IconButton>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  color="inherit"
                  disabled={!canRedo}
                  onClick={redo}
                  title="Redo"
                >
                  <Redo />
                </IconButton>
              </motion.div>
            </motion.div>
          </Toolbar>
        </AppBar>
      </motion.div>

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
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ width: "100%" }}
        >
          <Box sx={{ width: "100%" }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Canvas />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <PlaybackControls />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Timeline />
            </motion.div>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}

export default App;
