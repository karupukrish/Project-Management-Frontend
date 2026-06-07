import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, MenuItem, TextField,
} from '@mui/material';
import Layout from '../components/Layout/Layout';
import { developerAPI } from '../api/axios';

const statusColors = {
  Pending: '#e0e7ff',
  'In Progress': '#fef3c7',
  Completed: '#d1fae5',
};

const statusTextColors = {
  Pending: '#3730a3',
  'In Progress': '#92400e',
  Completed: '#065f46',
};

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchTasks = async () => {
    try {
      const params = {};
      if (statusFilter) params.status_filter = statusFilter;
      const res = await developerAPI.getMyTasks(params);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchTasks(); }, [statusFilter]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await developerAPI.updateTaskStatus(taskId, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout title="My Tasks">
      <Box className="fade-in">
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <TextField
            select
            size="small"
            label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 180, background: '#fff', borderRadius: 2 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
        </Box>

        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Project</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{task.title}</TableCell>
                    <TableCell>{task.project?.name || 'Unknown'}</TableCell>
                    <TableCell sx={{ color: '#6b7280', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {task.description || '—'}
                    </TableCell>
                    <TableCell>
                      <TextField
                        select
                        size="small"
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        sx={{
                          minWidth: 130,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            background: statusColors[task.status],
                          },
                        }}
                      >
                        {['Pending', 'In Progress', 'Completed'].map((s) => (
                          <MenuItem key={s} value={s}>{s}</MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                  </TableRow>
                ))}
                {tasks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#9ca3af' }}>
                      No tasks assigned
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Layout>
  );
}
