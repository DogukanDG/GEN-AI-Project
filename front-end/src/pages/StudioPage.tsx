import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function StudioPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant='h3'>Admin Studio Sayfası</Typography>
      <Typography variant='body1' sx={{ mt: 2 }}>
        Yalnızca admin kullanıcılar için erişilebilir.
      </Typography>
    </Box>
  );
}

export default StudioPage;
