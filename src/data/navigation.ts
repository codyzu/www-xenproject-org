import navigationData from '../../data/navigation.json';

export type NavigationItem = {
  name: string;
  href: string;
  target?: '_blank';
  header?: boolean;
  footer?: boolean;
  children?: NavigationItem[];
};

export const navigationItems = navigationData as NavigationItem[];
