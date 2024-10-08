import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import * as React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../redux/hook';
import { isNavItemActive } from '../../lib/isNavItemActive';
import { selectCurrentUser } from '../../redux/slices/userSlice';
import type { NavItemConfig } from '../../types/nav';
import { navItems } from './config';
import { navIcons } from './NavIcons';

export interface MobileNavProps {
  onClose?: () => void;
  open?: boolean;
  items?: NavItemConfig[];
}

export function MobileNav({ open, onClose }: MobileNavProps): React.JSX.Element {
  const location = useLocation();
  const currentUser = useAppSelector(selectCurrentUser)
  const pathname = location.pathname;

  return (
    <Drawer
      PaperProps={{
        sx: {
          '--MobileNav-background': 'var(--mui-palette-neutral-950)',
          '--MobileNav-color': 'var(--mui-palette-common-white)',
          '--NavItem-color': 'var(--mui-palette-neutral-300)',
          '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
          '--NavItem-active-background': 'var(--mui-palette-primary-main)',
          '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
          '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
          '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
          '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
          '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
          bgcolor: 'var(--MobileNav-background)',
          color: 'var(--MobileNav-color)',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '100%',
          scrollbarWidth: 'none',
          width: 'var(--MobileNav-width)',
          zIndex: 'var(--MobileNav-zIndex)',
          '&::-webkit-scrollbar': { display: 'none' },
        },
      }}
      onClose={onClose}
      open={open}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box
          sx={{
            alignItems: 'center',
            backgroundColor: 'var(--mui-palette-neutral-950)',
            border: '1px solid var(--mui-palette-neutral-700)',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            p: '4px 12px',
          }}
        >
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography color="inherit" variant="subtitle1">
              {currentUser?.user?.username}
            </Typography>
          </Box>
        </Box>
      </Stack>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
      <Box component="nav" sx={{ flex: '1 1 auto', p: '12px' }}>
        {renderNavItems({ pathname, items: navItems, userRole: currentUser.user?.roles.map(role => role.name) })}
      </Box>
    </Drawer>
  );
}

function renderNavItems({ items = [], pathname, userRole }:
  { items?: NavItemConfig[]; pathname: string, userRole?: string[] }): React.JSX.Element {

  const children = items.map((item) => (
    item.role?.some(role => userRole?.includes(role)) && (
      <NavItem
        key={item.key}
        pathname={pathname}
        disabled={item.disabled}
        external={item.external}
        href={item.href}
        icon={item.icon}
        matcher={item.matcher}
        title={item.title}
      >
        {item.children && renderNavItems({ items: item.children, pathname, userRole })}
      </NavItem>
    )
  ));

  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {children}
    </Stack>
  );
}

interface NavItemProps extends Omit<NavItemConfig, 'children'> {
  pathname: string;
  children?: React.ReactNode;
}

function NavItem({ disabled, external, href, icon, matcher, pathname, title, children }: NavItemProps): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? navIcons[icon] : null;

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const LinkComponent = external ? 'a' : RouterLink;

  return (
    <li>
      <Box
        component={LinkComponent}
        to={!external ? href : undefined}
        href={external ? href : undefined}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        onClick={children ? handleToggle : undefined}
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          color: 'var(--NavItem-color)',
          cursor: 'pointer',
          display: 'flex',
          flex: '0 0 auto',
          gap: 1,
          p: '6px 16px',
          position: 'relative',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          ...(disabled && {
            bgcolor: 'var(--NavItem-disabled-background)',
            color: 'var(--NavItem-disabled-color)',
            cursor: 'not-allowed',
          }),
          ...(active && { bgcolor: 'var(--NavItem-active-background)', color: 'var(--NavItem-active-color)' }),
        }}
      >
        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
          {Icon ? (
            <Icon
              fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
              fontSize="var(--icon-fontSize-md)"
              weight={active ? 'fill' : undefined}
            />
          ) : null}
        </Box>
        <Box sx={{ flex: '1 1 auto' }}>
          <Typography
            component="span"
            sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}
          >
            {title}
          </Typography>
        </Box>
        {children && (open ? <CaretUp /> : <CaretDown />)}
      </Box>
      {open && children ? (
        <Box sx={{ pl: 2 }}>
          {children}
        </Box>
      ) : null}
    </li>
  );
}
