import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Navbar from './components/ui/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register.jsx';
import Profile from './pages/Profile';
import TicketList from './components/tickets/TicketList';
import TicketForm from './components/tickets/TicketForm';
import TicketDetail from './components/tickets/TicketDetail';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';
import AdminDashboard from './pages/AdminDashboard.jsx';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/tickets" element={<PrivateRoute><TicketList /></PrivateRoute>} />
            <Route path="/tickets/new" element={<PrivateRoute><TicketForm /></PrivateRoute>} />
            <Route path="/tickets/:id" element={<PrivateRoute><TicketDetail /></PrivateRoute>} />
            
            <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </ThemeProvider>
    </Provider>
  );
}

export default App;