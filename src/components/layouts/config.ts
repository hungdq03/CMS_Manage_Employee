import type { NavItemConfig } from '../../types/nav';
import { paths } from '../../paths';

export const navItems = [
  { key: 'home', title: 'Trang chủ', href: paths.dashboard.home, icon: 'home' },
  {
    key: 'manager', title: 'Quản lý', icon: 'manager',
    children: [
      { key: 'add', title: 'Thêm nhân viên', href: paths.dashboard.employees.add, icon: 'add-employee' },
      { key: 'manage', title: 'Quản lý nhân viên', href: paths.dashboard.employees.manage, icon: 'manage-employees' },
      { key: 'fired', title: 'Kết thúc nhân viên', href: paths.dashboard.employees.fired, icon: 'fired-employee' },
    ],
  },
  {
    key: 'leader', title: 'Lãnh đạo', icon: 'leader',
    children: [
      { key: 'pending-approval', title: 'Lãnh đạo chờ duyệt', href: paths.dashboard.leader.pendingApproval, icon: 'pending-approval' },
      { key: 'approved', title: 'Lãnh đạo đã duyệt', href: paths.dashboard.leader.approved, icon: 'approved' },
    ],
  },
] satisfies NavItemConfig[];
