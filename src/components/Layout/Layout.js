import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children, title }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          background: '#f0f2f5',
          minHeight: '100vh',
        }}
      >
        <Navbar title={title} />
        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
}
