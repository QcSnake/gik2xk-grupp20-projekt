import { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Alert, Link as MuiLink, Paper, CircularProgress } from '@mui/material';
import { login } from '../models/authModel';
import { useNavigate, Link } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      console.log("Loggar in med:", credentials);
      const result = await login(credentials.email, credentials.password);
      console.log("Login resultat:", result);
      
      if (result && result.id) {
        setLoading(false);
        
        // Trigger auth event to update UI
        window.dispatchEvent(new Event('auth-change'));
        
        // Redirect based on role
        setTimeout(() => {
          if (result.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/products');
          }
        }, 500);
      } else {
        setError('Inloggningen misslyckades.');
        setLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || 'Inloggningen misslyckades. Kontrollera dina uppgifter.');
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ 
          width: 40, 
          height: 40, 
          bgcolor: 'primary.main', 
          color: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2
        }}>
          <LockOutlinedIcon />
        </Box>
        
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Logga in
        </Typography>
        
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
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
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Logga in'}
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              component={Link}
              to="/register"
              variant="outlined"
              sx={{ width: '100%', py: 1 }}
            >
              Registrera dig
            </Button>
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
      </Paper>
    </Container>
  );
}

export default Login;
