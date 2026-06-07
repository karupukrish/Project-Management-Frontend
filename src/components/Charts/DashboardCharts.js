import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = {
  Planning: '#667eea',
  'In Progress': '#f59e0b',
  Completed: '#10b981',
  'On Hold': '#ef4444',
  Pending: '#6366f1',
};

export function ProjectStatusChart({ data }) {
  const chartData = [
    { name: 'Planning', value: data.filter((p) => p.status === 'Planning').length },
    { name: 'In Progress', value: data.filter((p) => p.status === 'In Progress').length },
    { name: 'Completed', value: data.filter((p) => p.status === 'Completed').length },
    { name: 'On Hold', value: data.filter((p) => p.status === 'On Hold').length },
  ].filter((d) => d.value > 0);

  return (
    <Paper sx={{ p: 3, borderRadius: 3, height: 320 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Project Status
      </Typography>
      <ResponsiveContainer width="100%" height={230}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name] || '#888'} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export function TaskStatusChart({ data }) {
  const chartData = [
    { name: 'Pending', value: data.filter((t) => t.status === 'Pending').length },
    { name: 'In Progress', value: data.filter((t) => t.status === 'In Progress').length },
    { name: 'Completed', value: data.filter((t) => t.status === 'Completed').length },
  ].filter((d) => d.value > 0);

  return (
    <Paper sx={{ p: 3, borderRadius: 3, height: 320 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Task Status
      </Typography>
      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name] || '#888'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
