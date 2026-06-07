import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Chip, Alert,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { adminAPI } from '../api/axios';

const taskStatuses = ['Pending', 'In Progress', 'Completed'];

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

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', status: 'Pending', project_id: '', developer_id: '' });
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [taskRes, projRes, devRes] = await Promise.all([
        adminAPI.getTasks(),
        adminAPI.getProjects(),
        adminAPI.getDevelopers(),
      ]);
      setTasks(taskRes.data);
      setProjects(projRes.data);
      setDevelopers(devRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpen = (item = null) => {
    if (item) {
      setEditItem(item);
      setForm({
        title: item.title,
        description: item.description || '',
        status: item.status,
        project_id: item.project_id,
        developer_id: item.developer_id,
      });
    } else {
      setEditItem(null);
      setForm({ title: '', description: '', status: 'Pending', project_id: '', developer_id: '' });
    }
    setError('');
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Title is required'); return; }
    if (!form.project_id) { setError('Project is required'); return; }
    if (!form.developer_id) { setError('Developer is required'); return; }
    try {
      if (editItem) {
        await adminAPI.updateTask(editItem.id, form);
      } else {
        await adminAPI.createTask(form);
      }
      setOpen(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Error saving task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await adminAPI.deleteTask(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const getProjectName = (id) => projects.find((p) => p.id === id)?.name || 'Unknown';
  const getDeveloperName = (id) => developers.find((d) => d.id === id)?.name || 'Unknown';

  return (
    <Layout title="Tasks">
      <Box className="fade-in">
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            New Task
          </Button>
        </Box>

        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Project</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Developer</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{task.title}</TableCell>
                    <TableCell>{getProjectName(task.project_id)}</TableCell>
                    <TableCell>{getDeveloperName(task.developer_id)}</TableCell>
                    <TableCell>
                      <Chip
                        label={task.status}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          background: statusColors[task.status],
                          color: statusTextColors[task.status],
                          borderRadius: 1,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpen(task)} color="primary">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(task.id)} color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {tasks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#9ca3af' }}>
                      No tasks found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>{editItem ? 'Edit Task' : 'New Task'}</DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{error}</Alert>}
            <TextField label="Title" fullWidth value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} sx={{ mt: 2 }} />
            <TextField label="Description" fullWidth multiline rows={2} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} sx={{ mt: 2 }} />
            <TextField select label="Project" fullWidth value={form.project_id}
              onChange={(e) => setForm({ ...form, project_id: e.target.value })} sx={{ mt: 2 }}>
              {projects.map((p) => (<MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>))}
            </TextField>
            <TextField select label="Developer" fullWidth value={form.developer_id}
              onChange={(e) => setForm({ ...form, developer_id: e.target.value })} sx={{ mt: 2 }}>
              {developers.map((d) => (<MenuItem key={d.id} value={d.id}>{d.name} ({d.email})</MenuItem>))}
            </TextField>
            <TextField select label="Status" fullWidth value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })} sx={{ mt: 2 }}>
              {taskStatuses.map((s) => (<MenuItem key={s} value={s}>{s}</MenuItem>))}
            </TextField>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
            <Button variant="contained" onClick={handleSave} sx={{ borderRadius: 2, textTransform: 'none' }}>
              {editItem ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}
