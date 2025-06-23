import { Pause, PlayArrow } from "@mui/icons-material";
import { Box, IconButton, Paper, Slider, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { FRAMES_PER_SECOND } from "../constants";
import { useTimelineStore } from "../store/timelineStore";

export const PlaybackControls = () => {
  const { playback, totalFrames, setCurrentFrame, setPlaybackState } =
    useTimelineStore();

  const formatTime = (frames: number) => {
    const seconds = Math.floor(frames / FRAMES_PER_SECOND);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    setPlaybackState(!playback.isPlaying);
  };

  const handleSliderChange = (_event: Event, value: number | number[]) => {
    const frame = Array.isArray(value) ? value[0] : value;
    setCurrentFrame(frame);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            minWidth: "640px",
            maxWidth: "640px",
          }}
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton onClick={handlePlayPause}>
              <motion.div
                initial={false}
                animate={{ rotate: playback.isPlaying ? 0 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {playback.isPlaying ? <Pause /> : <PlayArrow />}
              </motion.div>
            </IconButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Typography variant="body2" sx={{ minWidth: "40px" }}>
              {formatTime(playback.currentFrame)}
            </Typography>
          </motion.div>

          <motion.div
            style={{ flex: 1 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Slider
              value={playback.currentFrame}
              max={Math.max(0, totalFrames - 1)}
              onChange={handleSliderChange}
              sx={{
                flex: 1,
                "& .MuiSlider-thumb": {
                  transition: "none",
                },
                "& .MuiSlider-track": {
                  transition: "none",
                },
                "& .MuiSlider-rail": {
                  transition: "none",
                },
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <Typography variant="body2" sx={{ minWidth: "40px" }}>
              {formatTime(totalFrames)}
            </Typography>
          </motion.div>
        </Paper>
      </motion.div>
    </Box>
  );
};
