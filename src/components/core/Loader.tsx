import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';

// Loader Component
const Loader: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <CircularProgress
        size={50}
        sx={{
          zIndex: 2,
        }}
      />
    </div>
  );
};

export default Loader;
