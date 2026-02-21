import React from 'react';
import { Box, Typography } from '@mui/material';

const LandscapeGuard = () => (
  <Box
    sx={{
      position: 'fixed',
      inset: 0,
      zIndex: (theme) => theme.zIndex.modal + 1,
      display: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3,
      textAlign: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      color: 'common.white',
      '@media (orientation: portrait) and (max-width: 900px)': {
        display: 'flex',
      },
    }}
  >
    <Box sx={{ maxWidth: 420 }}>
      <Typography variant="h6" gutterBottom>
        Gira tu dispositivo
      </Typography>
      <Typography variant="body2">
        Esta aplicación funciona mejor en modo horizontal. Por favor rota tu pantalla.
      </Typography>
    </Box>
  </Box>
);

export default LandscapeGuard;
