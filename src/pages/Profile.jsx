import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfileStart, updateProfileSuccess, updateProfileFailure } from '../features/authSlice';
import { updateProfile } from 'firebase/auth';  
import { auth } from '../config/firebase';
import { toast } from 'react-hot-toast';

import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  CircularProgress
} from '@mui/material';

export default function Profile() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(updateProfileStart());
    
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName
      });
      
      dispatch(updateProfileSuccess({ displayName }));
      toast.success('Profile updated successfully!');
    } catch (error) {
      dispatch(updateProfileFailure(error.message));
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Profile
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar 
            sx={{ width: 80, height: 80, mr: 3 }}
            alt={user?.displayName || user?.email}
          />
          <Box>
            <Typography variant="h6">{user?.displayName || 'No name set'}</Typography>
            <Typography variant="body1">{user?.email}</Typography>
          </Box>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500 }}>
          <TextField
            fullWidth
            label="Display Name"
            variant="outlined"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}