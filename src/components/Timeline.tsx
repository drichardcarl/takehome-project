import { Box, Button, Paper } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTimelineStore } from '../store/timelineStore';
import { Scene } from './Scene';

export const Timeline = () => {
  const { scenes, addScene } = useTimelineStore();

  const handleAddScene = () => {
    addScene();
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
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
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          p: 2,
          mr: 2.5,
          minHeight: '160px',
          overflowX: 'auto',
          backgroundColor: '#cccccc'
        }}
      >
        {scenes.map((scene) => (
          <Scene key={scene.scene_index} scene={scene} />
        ))}
      </Paper>
    </Box>
  );
};