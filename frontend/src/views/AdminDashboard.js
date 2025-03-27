import { useEffect, useState } from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent, Dialog, 
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, 
  FormControl, InputLabel, Snackbar, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProducts } from '../models/productModel';
import { getAllUsers, create as createUser } from '../models/userModel';
import { isAdmin, resetDatabase } from '../models/authModel';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    f_name: '',
    l_name: '',
    role: 'customer'
  });
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin, redirect if not
    if (!isAdmin()) {
      navigate('/login');
      return;
    }

    // Fetch data
    loadData();
  }, [navigate]);

  const loadData = () => {
    getAllProducts().then(data => setProducts(data || []));
    getAllUsers().then(data => setUsers(data || []));
  };

  const handleAddUser = async () => {
    try {
      await createUser(newUser);
      setAlert({
        open: true,
        message: 'Användare skapad!',
        severity: 'success'
      });
      setOpenDialog(false);
      loadData(); // Reload user list
      
      // Reset form
      setNewUser({
        email: '',
        password: '',
        f_name: '',
        l_name: '',
        role: 'customer'
      });
    } catch (error) {
      setAlert({
        open: true,
        message: 'Kunde inte skapa användare: ' + error.message,
        severity: 'error'
      });
    }
  };

  const handleResetDatabase = async () => {
    try {
      await resetDatabase();
      setAlert({
        open: true,
        message: 'Databasen har återställts! Produkterna har återskapats.',
        severity: 'success'
      });
      setOpenResetDialog(false);
      loadData(); // Reload data
    } catch (error) {
      setAlert({
        open: true,
        message: 'Kunde inte återställa databasen: ' + error.message,
        severity: 'error'
      });
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Administratörspanel
      </Typography>
      
      <Grid container spacing={3}>
        {/* Product summary */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Produkter
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Totalt antal produkter: {products.length}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" component={Link} to="/productEdit/0">
                  Lägg till ny produkt
                </Button>
                <Button 
                  variant="outlined" 
                  component={Link} 
                  to="/products"
                  sx={{ ml: 2 }}
                >
                  Visa alla produkter
                </Button>
                <Button 
                  variant="outlined" 
                  color="warning"
                  onClick={() => setOpenResetDialog(true)}
                  sx={{ ml: 2 }}
                >
                  Återställ produkter
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* User summary */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Användare
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Totalt antal användare: {users.length}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={() => setOpenDialog(true)}
                >
                  Lägg till ny användare
                </Button>
                <Button 
                  variant="outlined" 
                  component={Link} 
                  to="/users"
                  sx={{ ml: 2 }}
                >
                  Hantera användare
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add User Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Lägg till ny användare</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="E-postadress"
            type="email"
            fullWidth
            variant="standard"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <TextField
            margin="dense"
            id="password"
            label="Lösenord"
            type="password"
            fullWidth
            variant="standard"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <TextField
            margin="dense"
            id="f_name"
            label="Förnamn"
            type="text"
            fullWidth
            variant="standard"
            value={newUser.f_name}
            onChange={(e) => setNewUser({ ...newUser, f_name: e.target.value })}
          />
          <TextField
            margin="dense"
            id="l_name"
            label="Efternamn"
            type="text"
            fullWidth
            variant="standard"
            value={newUser.l_name}
            onChange={(e) => setNewUser({ ...newUser, l_name: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="role-label">Roll</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              value={newUser.role}
              label="Roll"
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <MenuItem value="customer">Kund</MenuItem>
              <MenuItem value="admin">Administratör</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Avbryt</Button>
          <Button onClick={handleAddUser}>Lägg till användare</Button>
        </DialogActions>
      </Dialog>

      {/* Reset Database Confirmation Dialog */}
      <Dialog
        open={openResetDialog}
        onClose={() => setOpenResetDialog(false)}
      >
        <DialogTitle>Bekräfta databasåterställning</DialogTitle>
        <DialogContent>
          <Typography>
            Detta kommer att återställa produktdatabasen. Är du säker på att du vill fortsätta?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResetDialog(false)}>Avbryt</Button>
          <Button onClick={handleResetDatabase} color="warning">Återställ databasen</Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default AdminDashboard;
