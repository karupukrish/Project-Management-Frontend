import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Chip, Alert,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { adminAPI } from '../api/axios';

const statuses = ['Planning', 'In Progress', 'Completed', 'On Hold'];

const statusColors = {
  Planning: '#e0e7ff',
  'In Progress': '#fef3c7',
  Completed: '#d1fae5',
  'On Hold': '#fee2e2',
};

const statusTextColors = {
  Planning: '#3730a3',
  'In Progress': '#92400e',
  Completed: '#065f46',
  'On Hold': '#991b1b',
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', status: 'Planning' });
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await adminAPI.getProjects();
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleOpen = (item = null) => {
    if (item) {
      setEditItem(item);
      setForm({ name: item.name, description: item.description, status: item.status });
    } else {
      setEditItem(null);
      setForm({ name: '', description: '', status: 'Planning' });
    }
    setError('');
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Name is required'); return; }
    try {
      if (editItem) {
        await adminAPI.updateProject(editItem.id, form);
      } else {
        await adminAPI.createProject(form);
      }
      setOpen(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.detail || 'Error saving project');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await adminAPI.deleteProject(id);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout title="Projects">
      <Box className="fade-in">
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            New Project
          </Button>
        </Box>

        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{project.name}</TableCell>
                    <TableCell sx={{ color: '#6b7280', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {project.description || '—'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={project.status}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          background: statusColors[project.status],
                          color: statusTextColors[project.status],
                          borderRadius: 1,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpen(project)} color="primary">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(project.id)} color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {projects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#9ca3af' }}>
                      No projects found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>{editItem ? 'Edit Project' : 'New Project'}</DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{error}</Alert>}
            <TextField
              label="Name"
              fullWidth
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              sx={{ mt: 2 }}
            />
            <TextField
              select
              label="Status"
              fullWidth
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              sx={{ mt: 2 }}
            >
              {statuses.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
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
