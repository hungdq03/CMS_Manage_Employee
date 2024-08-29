export interface NavItemConfig {
  key: string;
  title?: string;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  icon?: string;
  href?: string;
  items?: NavItemConfig[];
  children?: NavItemConfig[];
  matcher?: { type: 'startsWith' | 'equals'; href: string };
}
