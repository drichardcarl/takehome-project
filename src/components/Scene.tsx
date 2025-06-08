import { Card, CardContent, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { Scene as SceneType } from '../store/timelineStore';

interface SceneProps {
  scene: SceneType;
}

export const Scene = ({ scene }: SceneProps) => {
  const theme = useTheme();
  const width = Math.max(scene.scene_length * 4, 120);
  
  return (
    <Card 
      sx={{ 
        width: `${width}px`,
        height: '120px',
        backgroundColor: scene.scene_color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mx: 0.5,
        cursor: 'grab',
        position: 'relative',
        flexShrink: 0
      }}
    >
      <CardContent sx={{ p: 1 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          {scene.scene_name}
        </Typography>
      </CardContent>
      
      {/* Right resize handle */}
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '6px',
          height: '40px',
          backgroundColor: theme.palette.background.paper,
          borderRadius: '3px',
          cursor: 'ew-resize',
          opacity: 0.7,
          '&:hover': {
            opacity: 0.9
          }
        }}
      />
    </Card>
  );
};