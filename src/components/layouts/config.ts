import type { NavItemConfig } from '../../types/nav';
import { paths } from '../../paths';
import { AuthRole } from '../../types/user';

export const navItems = [
  { key: 'home', title: 'Trang chủ', href: paths.dashboard.home, icon: 'home', role: AuthRole.user },
  {
    key: 'manager', title: 'Quản lý', icon: 'manager', role: AuthRole.user,
    children: [
      {
        key: 'add', title: 'Thêm nhân viên',
        href: paths.dashboard.employees.add, icon: 'add-employee', role: AuthRole.user
      },
      {
        key: 'manage', title: 'Quản lý nhân viên',
        href: paths.dashboard.employees.manage, icon: 'manage-employees', role: AuthRole.user
      },
      {
        key: 'end', title: 'Kết thúc nhân viên',
        href: paths.dashboard.employees.end, icon: 'end-employee', role: AuthRole.user
      },
    ],
  },
  {
    key: 'leader', title: 'Lãnh đạo', icon: 'leader', role: AuthRole.admin,
    children: [
      {
        key: 'pending-approval', title: 'Lãnh đạo chờ duyệt',
        href: paths.dashboard.leader.pendingApproval, icon: 'pending-approval', role: AuthRole.admin
      },
      {
        key: 'approved', title: 'Lãnh đạo đã duyệt',
        href: paths.dashboard.leader.approved, icon: 'approved', role: AuthRole.admin
      },
    ],
  },
] satisfies NavItemConfig[];
