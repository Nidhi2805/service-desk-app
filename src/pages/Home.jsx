import { Typography, Container } from '@mui/material';
import { useSelector } from 'react-redux';

export default function Home() {
  const { user } = useSelector(state => state.auth);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to Service Desk App
      </Typography>
      {user && (
        <Typography variant="body1">
          Hello, {user.email}
        </Typography>
      )}
    </Container>
  );
}