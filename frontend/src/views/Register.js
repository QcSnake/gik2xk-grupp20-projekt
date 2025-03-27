import { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Alert, Link as MuiLink } from '@mui/material';
import { register } from '../models/authModel';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    f_name: '',
    l_name: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    
    // Validate inputs
    if (!userData.email || !userData.password || !userData.f_name || !userData.l_name) {
      setError('Alla fält är obligatoriska');
      return;
    }
    
    if (userData.password !== userData.confirmPassword) {
      setError('Lösenorden matchar inte');
      return;
    }
    
    if (userData.password.length < 6) {
      setError('Lösenordet måste vara minst 6 tecken långt');
      return;
    }
    
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...dataToSend } = userData;
      await register(dataToSend);
      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registreringen misslyckades. Försök igen.');
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Skapa konto
        </Typography>
        
        {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
          Registrering lyckades! Omdirigerar till inloggning...
        </Alert>}
        
        <Box component="form" onSubmit={handleRegister} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-postadress"
            name="email"
            autoComplete="email"
            autoFocus
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="f_name"
            label="Förnamn"
            id="f_name"
            value={userData.f_name}
            onChange={(e) => setUserData({ ...userData, f_name: e.target.value })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="l_name"
            label="Efternamn"
            id="l_name"
            value={userData.l_name}
            onChange={(e) => setUserData({ ...userData, l_name: e.target.value })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Lösenord"
            type="password"
            id="password"
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Bekräfta lösenord"
            type="password"
            id="confirmPassword"
            value={userData.confirmPassword}
            onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Registrera
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Har du redan ett konto?{' '}
              <MuiLink component={Link} to="/login">
                Logga in
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default Register;
