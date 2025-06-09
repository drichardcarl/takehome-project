import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const Canvas = () => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
      }}
    >
      <canvas
        id="canvas"
        width={1280}
        height={720}
        style={{
          width: '640px',
          height: '360px',
          border: `2px solid ${theme.palette.divider}`,
          borderRadius: '8px',
          backgroundColor: '#000'
        }}
      />
    </Box>
  );
};