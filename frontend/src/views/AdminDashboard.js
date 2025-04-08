import React, { useState, useEffect } from 'react';
import {
  Box, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { getAllProducts, remove } from '../models/productModel';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, product: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Kunde inte ladda produkter. Försök igen.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteClick = (product) => {
    setDeleteDialog({ open: true, product });
  };
  
  const handleDeleteConfirm = async () => {
    try {
      await remove(deleteDialog.product);
      setSnackbar({
        open: true,
        message: 'Produkten har tagits bort!',
        severity: 'success'
      });
      fetchProducts();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Kunde inte ta bort produkten. Försök igen.',
        severity: 'error'
      });
    } finally {
      setDeleteDialog({ open: false, product: null });
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Produkthantering
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/productEdit/0"
        >
          Lägg till ny produkt
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Bild</TableCell>
              <TableCell>Titel</TableCell>
              <TableCell>Pris</TableCell>
              <TableCell>Lager</TableCell>
              <TableCell width="200">Åtgärder</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell>{product.id}</TableCell>
                <TableCell>
                  <Box
                    component="img"
                    sx={{ width: 50, height: 50, objectFit: 'cover' }}
                    src={product.productImg || 'https://via.placeholder.com/50x50?text=No+Image'}
                    alt={product.title}
                  />
                </TableCell>
                <TableCell>{product.title}</TableCell>
                <TableCell>{product.price} kr</TableCell>
                <TableCell>
                  <Chip 
                    label={product.units} 
                    color={product.units > 0 ? "success" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button 
                    component={Link} 
                    to={`/productDetail/${product.id}`}
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    Visa
                  </Button>
                  <Button 
                    component={Link} 
                    to={`/productEdit/${product.id}`}
                    color="secondary"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    Redigera
                  </Button>
                  <Button 
                    color="error"
                    size="small"
                    onClick={() => handleDeleteClick(product)}
                  >
                    Ta bort
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, product: null })}>
        <DialogTitle>Ta bort produkt</DialogTitle>
        <DialogContent>
          Är du säker på att du vill ta bort produkten "{deleteDialog.product?.title}"? Denna åtgärd kan inte ångras.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, product: null })}>Avbryt</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Ta bort
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AdminDashboard;
