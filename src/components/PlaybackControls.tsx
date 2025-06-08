import { Box, IconButton, Slider, Typography, Paper } from '@mui/material';
import { PlayArrow } from '@mui/icons-material';

export const PlaybackControls = () => {
  const formatTime = (frames: number) => {
    const seconds = Math.floor(frames / 30);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%"
      }}
    >
      <Paper 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          minWidth: '640px',
          maxWidth: '640px'
        }}
      >
        <IconButton>
          <PlayArrow />
        </IconButton>
        
        <Typography variant="body2" sx={{ minWidth: '40px' }}>
          {formatTime(0)}
        </Typography>
        
        <Slider
          value={0}
          max={120}
          sx={{ flex: 1 }}
        />
        
        <Typography variant="body2" sx={{ minWidth: '40px' }}>
          {formatTime(120)}
        </Typography>
      </Paper>
    </Box>
  );
};