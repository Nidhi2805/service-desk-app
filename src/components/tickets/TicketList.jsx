import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  fetchTicketsStart, 
  fetchTicketsSuccess, 
  fetchTicketsFailure,
  setCurrentTicket
} from '../../features/ticketSlice';
import { db } from '../../config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

import { 
  Container, 
  Typography, 
  Box, 
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function TicketList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tickets, loading } = useSelector(state => state.tickets);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchTickets = async () => {
      dispatch(fetchTicketsStart());
      try {
        let q;
        if (user.role === 'admin') {
          q = query(collection(db, 'tickets'));
        } else {
          q = query(collection(db, 'tickets'), where('userId', '==', user.uid));
        }
        
        const querySnapshot = await getDocs(q);
        const ticketsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        dispatch(fetchTicketsSuccess(ticketsData));
      } catch (error) {
        dispatch(fetchTicketsFailure(error.message));
        toast.error(error.message);
      }
    };

    fetchTickets();
  }, [dispatch, user]);

  const handleViewTicket = (ticket) => {
    dispatch(setCurrentTicket(ticket));
    navigate(`/tickets/${ticket.id}`);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'primary';
      case 'in-progress':
        return 'secondary';
      case 'resolved':
        return 'success';
      case 'closed':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">My Tickets</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/tickets/new')}
        >
          New Ticket
        </Button>
      </Box>
      
      {loading ? (
        <Typography>Loading tickets...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>{ticket.category}</TableCell>
                  <TableCell>
                    <Chip 
                      label={ticket.priority} 
                      color={getPriorityColor(ticket.priority)} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={ticket.status} 
                      color={getStatusColor(ticket.status)} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleViewTicket(ticket)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}