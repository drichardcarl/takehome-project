import { Box, AppBar, Toolbar, Typography, IconButton, Container } from '@mui/material';
import { Undo, Redo } from '@mui/icons-material';
import { Canvas } from './components/Canvas';
import { PlaybackControls } from './components/PlaybackControls';
import { Timeline } from './components/Timeline';

function App() {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      minWidth: '100vw',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Timeline Editor
          </Typography>
          <IconButton color="inherit" disabled>
            <Undo />
          </IconButton>
          <IconButton color="inherit" disabled>
            <Redo />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Box 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 3,
          px: { xs: 2, sm: 3, md: 4 },
          gap: 3,
        }}
      >
        <Box sx={{width: '100%'}}>
          <Canvas />
          <PlaybackControls />
          <Timeline />
        </Box>
      </Box>
    </Box>
  );
}

export default App
