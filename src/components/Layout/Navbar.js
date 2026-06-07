import React from 'react';
import { Box, Typography, Chip, Avatar } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ title }) {
  const { user } = useAuth();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        py: 2,
        background: '#fff',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Typography variant="h6" fontWeight={700} color="#1e1e2d">
        {title}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          label={user?.role === 'admin' ? 'Admin' : 'Developer'}
          size="small"
          sx={{
            fontWeight: 600,
            background: user?.role === 'admin'
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: '#fff',
            borderRadius: 1,
          }}
        />
        <Avatar
          sx={{
            width: 36,
            height: 36,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          {user?.role === 'admin' ? 'A' : 'D'}
        </Avatar>
      </Box>
    </Box>
  );
}
