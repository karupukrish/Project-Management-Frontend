import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Folder as ProjectIcon,
  People as DeveloperIcon,
  Task as TaskIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const DRAWER_WIDTH = 260;

const menuItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['admin'] },
  { label: 'Projects', icon: <ProjectIcon />, path: '/projects', roles: ['admin'] },
  { label: 'Developers', icon: <DeveloperIcon />, path: '/developers', roles: ['admin'] },
  { label: 'Tasks', icon: <TaskIcon />, path: '/tasks', roles: ['admin'] },
  { label: 'My Tasks', icon: <TaskIcon />, path: '/my-tasks', roles: ['developer'] },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredItems = menuItems.filter((item) => item.roles.includes(user?.role));

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #1e1e2d 0%, #2a2a3d 100%)',
          borderRight: 'none',
          color: '#fff',
        },
      }}
    >
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1.5,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 18,
            color: '#fff',
          }}
        >
          P
        </Box>
        <Typography variant="h6" fontWeight={700} fontSize={18}>
          ProjectHub
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 2 }} />

      <List sx={{ px: 1.5, mt: 1 }}>
        {filteredItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                  '&:hover': {
                    background: active ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? '#667eea' : 'rgba(255,255,255,0.6)',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: 14,
                      fontWeight: active ? 600 : 400,
                      color: active ? '#fff' : 'rgba(255,255,255,0.7)',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 2 }} />

      <List sx={{ px: 1.5, mb: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              py: 1.2,
              '&:hover': { background: 'rgba(255,255,255,0.05)' },
            }}
          >
            <ListItemIcon sx={{ color: 'rgba(255,255,255,0.6)', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{ '& .MuiListItemText-primary': { fontSize: 14, color: 'rgba(255,255,255,0.7)' } }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}

export { DRAWER_WIDTH };
