import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import {
  Folder as ProjectIcon,
  People as DeveloperIcon,
  Task as TaskIcon,
  CheckCircle as CompletedIcon,
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { ProjectStatusChart, TaskStatusChart } from '../components/Charts/DashboardCharts';
import { adminAPI } from '../api/axios';

function StatCard({ icon, label, value, color }) {
  return (
    <Paper
      className="card-hover"
      sx={{
        p: 3,
        borderRadius: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2.5,
      }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: 2.5,
          background: `linear-gradient(135deg, ${color} 0%, ${color}88 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Paper>
  );
}

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, devRes, taskRes] = await Promise.all([
          adminAPI.getProjects(),
          adminAPI.getDevelopers(),
          adminAPI.getTasks(),
        ]);
        setProjects(projRes.data);
        setDevelopers(devRes.data);
        setTasks(taskRes.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;

  return (
    <Layout title="Dashboard">
      <Box className="fade-in">
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard icon={<ProjectIcon />} label="Total Projects" value={projects.length} color="#667eea" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard icon={<DeveloperIcon />} label="Developers" value={developers.length} color="#764ba2" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard icon={<TaskIcon />} label="Total Tasks" value={tasks.length} color="#f59e0b" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard icon={<CompletedIcon />} label="Completed Tasks" value={completedTasks} color="#10b981" />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ProjectStatusChart data={projects} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TaskStatusChart data={tasks} />
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={0}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Recent Projects
              </Typography>
              {projects.slice(0, 5).map((project) => (
                <Box
                  key={project.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.5,
                    borderBottom: '1px solid #f0f0f0',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Typography variant="body2" fontWeight={500}>
                    {project.name}
                  </Typography>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.3,
                      borderRadius: 1,
                      fontSize: 12,
                      fontWeight: 600,
                      background:
                        project.status === 'Completed'
                          ? '#d1fae5'
                          : project.status === 'In Progress'
                          ? '#fef3c7'
                          : project.status === 'On Hold'
                          ? '#fee2e2'
                          : '#e0e7ff',
                      color:
                        project.status === 'Completed'
                          ? '#065f46'
                          : project.status === 'In Progress'
                          ? '#92400e'
                          : project.status === 'On Hold'
                          ? '#991b1b'
                          : '#3730a3',
                    }}
                  >
                    {project.status}
                  </Box>
                </Box>
              ))}
              {projects.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No projects yet
                </Typography>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Task Overview
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {[
                  { label: 'Pending', value: tasks.filter((t) => t.status === 'Pending').length, color: '#6366f1' },
                  { label: 'In Progress', value: inProgressTasks, color: '#f59e0b' },
                  { label: 'Completed', value: completedTasks, color: '#10b981' },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      flex: 1,
                      minWidth: 100,
                      p: 2,
                      borderRadius: 2,
                      background: `${item.color}15`,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h5" fontWeight={700} color={item.color}>
                      {item.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
