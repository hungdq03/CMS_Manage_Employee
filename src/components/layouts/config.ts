import type { NavItemConfig } from '../../types/nav';
import { paths } from '../../paths';

export const navItems = [
  { key: 'home', title: 'Trang chủ', href: paths.dashboard.home, icon: 'users' },
  {
    key: 'manager', title: 'Quản lý', icon: 'manager',
    children: [
      { key: 'add', title: 'Thêm nhân viên', href: paths.dashboard.employees.add },
      { key: 'manage', title: 'Quản lý nhân viên', href: paths.dashboard.employees.manage },
      { key: 'fired', title: 'Kết thúc nhân viên', href: paths.dashboard.employees.fired },

    ],
  },
  {
    key: 'leader', title: 'Lãnh đạo', icon: 'manager',
    children: [
      { key: 'pending-approval', title: 'Lãnh đạo chờ duyệt', href: paths.dashboard.leader.pendingApproval },
      { key: 'approved', title: 'Lãnh đạo đã duyệt', href: paths.dashboard.leader.approved },
    ],
  },
] satisfies NavItemConfig[];
