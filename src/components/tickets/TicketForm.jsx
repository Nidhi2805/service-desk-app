import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  createTicketStart, 
  createTicketSuccess, 
  createTicketFailure,
  updateTicketStart,
  updateTicketSuccess,
  updateTicketFailure,
  setCurrentTicket
} from '../../features/ticketSlice';
import { db } from '../../config/firebase';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box, 
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';

export default function TicketForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technical',
    priority: 'medium',
    status: 'open'
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentTicket } = useSelector(state => state.tickets);
  const { user } = useSelector(state => state.auth);
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode && currentTicket) {
      setFormData({
        title: currentTicket.title,
        description: currentTicket.description,
        category: currentTicket.category,
        priority: currentTicket.priority,
        status: currentTicket.status
      });
    }
  }, [isEditMode, currentTicket]);

  useEffect(() => {
    if (isEditMode) {
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
    }
  }, [id, isEditMode, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(createTicketStart());
    
    try {
      const docRef = await addDoc(collection(db, 'tickets'), {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        status: 'open', 
        userId: user.uid,
        userEmail: user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      dispatch(createTicketSuccess({ id: docRef.id, ...formData }));
      toast.success('Ticket created successfully!');
      navigate('/tickets'); 
    } catch (error) {
      dispatch(createTicketFailure(error.message));
      toast.error(error.message);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {isEditMode ? 'Edit Ticket' : 'Create New Ticket'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  label="Category"
                  onChange={handleChange}
                >
                  <MenuItem value="technical">Technical</MenuItem>
                  <MenuItem value="billing">Billing</MenuItem>
                  <MenuItem value="general">General Inquiry</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  label="Priority"
                  onChange={handleChange}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {isEditMode && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    label="Status"
                    onChange={handleChange}
                  >
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="resolved">Resolved</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="contained"
              type="submit"
              sx={{ ml: 2 }}
            >
              {isEditMode ? 'Update Ticket' : 'Create Ticket'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}