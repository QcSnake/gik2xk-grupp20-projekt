import { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Alert, Link as MuiLink } from '@mui/material';
import { login } from '../models/authModel';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    
    try {
      const user = await login(credentials);
      // Store user in localStorage (in a real app, consider using context or state management)
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/products');
      }
    } catch (err) {
      setError(err.message || 'Inloggningen misslyckades. Kontrollera dina uppgifter.');
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Logga in
        </Typography>
        
        {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-postadress"
            name="email"
            autoComplete="email"
            autoFocus
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Lösenord"
            type="password"
            id="password"
            autoComplete="current-password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Logga in
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Har du inget konto?{' '}
              <MuiLink component={Link} to="/register">
                Registrera dig nu
              </MuiLink>
            </Typography>
          </Box>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              Demokonton:
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Admin: admin@example.com / Admin123
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Kund: customer@example.com / Customer123
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
