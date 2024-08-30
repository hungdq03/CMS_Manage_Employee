import Box from '@mui/material/Box';
import * as React from 'react';

export interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: { xs: 'flex', lg: 'flex' },
        background: 'radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)',
        minHeight: '100vh',
        minWidth: '100vw'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            maxWidth: '450px',
            width: '100%',
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
