import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const STORAGE_KEY = 'landscapeGuardDismissed';

const LandscapeGuard = () => {
  const [dismissed, setDismissed] = React.useState(() => {
    try {
      return window.sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch (error) {
      return false;
    }
  });

  const handleDismiss = () => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1');
    } catch (error) {
      // If storage is blocked, just dismiss for this session.
    }
    setDismissed(true);
  };

  return (
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
          display: dismissed ? 'none' : 'flex',
        },
      }}
    >
      <Box sx={{ position: 'relative', maxWidth: 420, width: '100%' }}>
        <IconButton
          aria-label="Cerrar"
          onClick={handleDismiss}
          size="small"
          sx={{
            position: 'absolute',
            top: -8,
            right: -8,
            color: 'common.white',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.22)' },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <Typography variant="h6" gutterBottom>
          Gira tu dispositivo
        </Typography>
        <Typography variant="body2">
          Esta aplicación funciona mejor en modo horizontal. Por favor rota tu pantalla.
        </Typography>
      </Box>
    </Box>
  );
};

export default LandscapeGuard;
