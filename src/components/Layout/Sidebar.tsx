import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Build as BuildIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  show: boolean;
}

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  drawerWidth?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ open = false, onClose, drawerWidth = 240 }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems: MenuItem[] = [
    {
      text: '도구 목록',
      icon: <BuildIcon />,
      path: '/tools',
      show: true,
    },
    {
      text: '프로필',
      icon: <PersonIcon />,
      path: '/profile',
      show: true,
    },
    {
      text: '대시보드',
      icon: <DashboardIcon />,
      path: '/admin/dashboard',
      show: user?.role === 'admin',
    },
    {
      text: '사용자 관리',
      icon: <PeopleIcon />,
      path: '/admin/users',
      show: user?.role === 'admin',
    },
    {
      text: '설정',
      icon: <SettingsIcon />,
      path: '/settings',
      show: true,
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose?.();
    }
  };

  const drawer = (
    <>
      <List>
        {menuItems
          .filter((item) => item.show)
          .map((item) => (
            <ListItemButton
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
                '&.Mui-selected': {
                  backgroundColor: theme.palette.action.selected,
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
      </List>
      <Divider />
    </>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default Sidebar;
