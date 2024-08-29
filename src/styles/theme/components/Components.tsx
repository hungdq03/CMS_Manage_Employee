import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';
import { MuiAvatar } from './Avatar';
import { MuiButton } from './Button';
import { MuiCard } from './Card';
import { MuiCardContent } from './CardContent';
import { MuiCardHeader } from './CardHeader';
import { MuiLink } from './Link';
import { MuiStack } from './Stack';
import { MuiTab } from './Tab';
import { MuiTableBody } from './TableBody';
import { MuiTableCell } from './TableCell';
import { MuiTableHead } from './TableHead';

export const components = {
  MuiAvatar,
  MuiButton,
  MuiCard,
  MuiCardContent,
  MuiCardHeader,
  MuiLink,
  MuiStack,
  MuiTab,
  MuiTableBody,
  MuiTableCell,
  MuiTableHead,
} satisfies Components<Theme>;
