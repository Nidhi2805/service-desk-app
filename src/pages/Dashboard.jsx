import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import TicketList from '../components/tickets/TicketList';

export default function Dashboard() {
  const { user } = useSelector(state => state.auth);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      {user && (
        <Typography variant="subtitle1" gutterBottom>
          Welcome back, {user.email}
        </Typography>
      )}
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Your Recent Tickets
        </Typography>
        <TicketList />
      </Box>
    </Box>
  );
}