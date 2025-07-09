import { useState } from 'react';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setCurrentTicket,
  updateTicketStart,
  updateTicketSuccess,
  updateTicketFailure 
} from '../../features/ticketSlice';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { toast } from 'react-hot-toast';

import {
  Container,
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentTicket } = useSelector(state => state.tickets);
  const { user } = useSelector(state => state.auth);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const docRef = doc(db, 'tickets', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          dispatch(setCurrentTicket({ id: docSnap.id, ...docSnap.data() }));
        } else {
          toast.error('Ticket not found');
          navigate('/tickets');
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchTicket();
  }, [id, dispatch, navigate]);

  const handleStatusChange = async (newStatus) => {
    try {
      dispatch(updateTicketStart());
      const ticketRef = doc(db, 'tickets', id);
      await updateDoc(ticketRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      dispatch(updateTicketSuccess({ id, status: newStatus }));
      toast.success('Ticket status updated!');
    } catch (error) {
      dispatch(updateTicketFailure(error.message));
      toast.error(error.message);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    
    try {
      setLoading(true);
      const ticketRef = doc(db, 'tickets', id);
      const updatedComments = [
        ...(currentTicket.comments || []),
        {
          text: comment,
          userId: user.uid,
          userEmail: user.email,
          createdAt: new Date().toISOString()
        }
      ];
      
      await updateDoc(ticketRef, {
        comments: updatedComments,
        updatedAt: new Date().toISOString()
      });
      
      dispatch(setCurrentTicket({
        ...currentTicket,
        comments: updatedComments
      }));
      
      setComment('');
      toast.success('Comment added!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentTicket) {
    return (
      <Container maxWidth="lg">
        <CircularProgress />
      </Container>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'primary';
      case 'in-progress': return 'secondary';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Button 
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/tickets')}
        sx={{ mb: 2 }}
      >
        Back to Tickets
      </Button>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4">{currentTicket.title}</Typography>
          <Box>
            <Chip 
              label={currentTicket.priority} 
              color={getPriorityColor(currentTicket.priority)} 
              sx={{ mr: 1 }}
            />
            <Chip 
              label={currentTicket.status} 
              color={getStatusColor(currentTicket.status)}
            />
          </Box>
        </Box>

        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Category: {currentTicket.category} | Created: {new Date(currentTicket.createdAt).toLocaleString()}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body1" paragraph>
          {currentTicket.description}
        </Typography>

        {user.role === 'admin' && (
          <Box sx={{ mt: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Update Status</InputLabel>
              <Select
                value={currentTicket.status}
                label="Update Status"
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
      </Paper>

      <Typography variant="h5" gutterBottom>
        Comments ({currentTicket.comments?.length || 0})
      </Typography>

      <Box sx={{ mb: 3 }}>
        {currentTicket.comments?.map((comment, index) => (
          <Paper key={index} elevation={1} sx={{ p: 2, mb: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              {comment.userEmail} - {new Date(comment.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body1">{comment.text}</Typography>
          </Paper>
        )) || (
          <Typography variant="body1" color="text.secondary">
            No comments yet
          </Typography>
        )}
      </Box>

      <Box component="form" onSubmit={(e) => { e.preventDefault(); handleAddComment(); }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={10}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleAddComment}
              disabled={loading || !comment.trim()}
              sx={{ height: '100%' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Post'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}