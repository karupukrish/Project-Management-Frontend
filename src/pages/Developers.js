import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Alert,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { adminAPI } from '../api/axios';

export default function Developers() {
  const [developers, setDevelopers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const fetchDevelopers = async () => {
    try {
      const res = await adminAPI.getDevelopers();
      setDevelopers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchDevelopers(); }, []);

  const handleOpen = (item = null) => {
    if (item) {
      setEditItem(item);
      setForm({ name: item.name, email: item.email, password: '' });
    } else {
      setEditItem(null);
      setForm({ name: '', email: '', password: '' });
    }
    setError('');
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required');
      return;
    }
    if (!editItem && !form.password) {
      setError('Password is required');
      return;
    }
    try {
      if (editItem) {
        const payload = { name: form.name, email: form.email };
        if (form.password) payload.password = form.password;
        await adminAPI.updateDeveloper(editItem.id, payload);
      } else {
        await adminAPI.createDeveloper(form);
      }
      setOpen(false);
      fetchDevelopers();
    } catch (err) {
      setError(err.response?.data?.detail || 'Error saving developer');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this developer?')) return;
    try {
      await adminAPI.deleteDeveloper(id);
      fetchDevelopers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout title="Developers">
      <Box className="fade-in">
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            New Developer
          </Button>
        </Box>

        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {developers.map((dev) => (
                  <TableRow key={dev.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{dev.name}</TableCell>
                    <TableCell>{dev.email}</TableCell>
                    <TableCell sx={{ color: '#6b7280' }}>
                      {new Date(dev.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpen(dev)} color="primary">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(dev.id)} color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {developers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#9ca3af' }}>
                      No developers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>{editItem ? 'Edit Developer' : 'New Developer'}</DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{error}</Alert>}
            <TextField label="Name" fullWidth value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} sx={{ mt: 2 }} />
            <TextField label="Email" fullWidth value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} sx={{ mt: 2 }} />
            <TextField label={editItem ? 'New Password (leave blank to keep)' : 'Password'} type="password" fullWidth value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} sx={{ mt: 2 }} />
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
