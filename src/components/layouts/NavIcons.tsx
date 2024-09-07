import { Hourglass, House, SuitcaseSimple, UserCircleGear, UserCircleMinus, UserCirclePlus } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { BuildingOffice, UserList } from '@phosphor-icons/react/dist/ssr';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  home: House,
  leader: BuildingOffice,
  manager: UserCircleGear,
  user: UserIcon,
  users: UsersIcon,
  'add-employee': UserCirclePlus,
  'manage-employees': UserList,
  'fired-employee': UserCircleMinus,
  'pending-approval': Hourglass,
  'approved': SuitcaseSimple

} as Record<string, Icon>;
