import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import GlobalStyles from '@mui/material/GlobalStyles';
import * as React from 'react';
import { Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import { MainNav } from './MainNav';
import { SideNav } from './SideNav';
export default function MainLayout(): React.JSX.Element {
  return (
    <Fragment>
      <GlobalStyles
        styles={{
          body: {
            '--MainNav-height': '56px',
            '--MainNav-zIndex': 1000,
            '--SideNav-width': '280px',
            '--SideNav-zIndex': 1100,
            '--MobileNav-width': '320px',
            '--MobileNav-zIndex': 1100,
          },
        }}
      />
      <Box
        sx={{
          bgcolor: 'var(--mui-palette-background-default)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minHeight: '100%',
        }}
      >
        <SideNav />
        <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', pl: { lg: 'var(--SideNav-width)' } }}>
          <MainNav />
          <main>
            <Container maxWidth="xl" sx={{ py: '64px' }}>
              <Outlet />
            </Container>
          </main>
        </Box>
      </Box>
    </Fragment>
  );
}
