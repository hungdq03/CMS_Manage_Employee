import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { SignOut as SignOutIcon } from '@phosphor-icons/react/dist/ssr/SignOut';
import * as React from 'react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../../redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { selectCurrentUser } from '../../redux/slices/userSlice';

export interface UserPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}

export function UserPopover({ anchorEl, onClose, open }: UserPopoverProps): React.JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser)

  const handleSignOut = useCallback(async (): Promise<void> => {
    dispatch(signOut());
    navigate('/sign-in');
  }, [dispatch, navigate]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
    >
      <Box sx={{ p: '16px 20px ' }}>
        <Typography variant="subtitle1">
          {currentUser?.user?.username || ''}
        </Typography>
      </Box>
      <Divider />
      <MenuList disablePadding sx={{ p: '8px', '& .MuiMenuItem-root': { borderRadius: 1 } }}>
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <SignOutIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Đăng xuất
        </MenuItem>
      </MenuList>
    </Popover>
  );
}
