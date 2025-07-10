import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTicketsStart, fetchTicketsSuccess, fetchTicketsFailure } from '../../features/ticketSlice';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Link } from 'react-router-dom';
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
  Chip,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function TicketList() {
  const { tickets, loading } = useSelector(state => state.tickets);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTickets = async () => {
      dispatch(fetchTicketsStart());
      try {
        const q = query(
          collection(db, 'tickets'),
          where('userId', '==', user.uid)
        );
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
  }, [dispatch, user.uid]);

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">My Tickets</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/tickets/new"
        >
          New Ticket
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
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
                    color={
                      ticket.priority === 'high' ? 'error' :
                      ticket.priority === 'medium' ? 'warning' : 'success'
                    } 
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={ticket.status} 
                    color={
                      ticket.status === 'open' ? 'primary' :
                      ticket.status === 'closed' ? 'default' : 'secondary'
                    } 
                  />
                </TableCell>
                <TableCell>
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/tickets/${ticket.id}`}
                    size="small"
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}