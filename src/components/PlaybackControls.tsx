import { Pause, PlayArrow } from "@mui/icons-material";
import { Box, IconButton, Paper, Slider, Typography } from "@mui/material";
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
        <IconButton onClick={handlePlayPause}>
          {playback.isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>

        <Typography variant="body2" sx={{ minWidth: "40px" }}>
          {formatTime(playback.currentFrame)}
        </Typography>

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

        <Typography variant="body2" sx={{ minWidth: "40px" }}>
          {formatTime(totalFrames)}
        </Typography>
      </Paper>
    </Box>
  );
};
