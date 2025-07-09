import { Container, Typography, Box , Grid, Paper, Button } from '@mui/material';
import { useSelector } from 'react-redux';

export default function AdminDashboard() {
  const { user } = useSelector(state => state.auth);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1">
          Welcome, {user?.email} (Admin)
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                User Management
              </Typography>
              <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                View Users
              </Button>
              <Button variant="outlined" color="secondary">
                Add Admin
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Site Analytics
              </Typography>
              <Typography variant="body2">Total Users: 1243</Typography>
              <Typography variant="body2">Active Today: 87</Typography>
              <Typography variant="body2">New Signups: 12</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                System Settings
              </Typography>
              <Button variant="contained" color="warning">
                Update Configurations
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}