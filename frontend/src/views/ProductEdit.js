import { Button, TextField, Box, CircularProgress, Snackbar, Alert, Typography, Paper, Grid, Card, CardMedia, Divider } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  create,
  getProductsById,
  remove,
  update,
} from "../models/productModel";

function ProductEdit() {
  const params = useParams();
  const navigate = useNavigate();
  const productId = params.id;
  const isNewProduct = productId === "0";

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [loading, setLoading] = useState(false);
  
  const emptyProduct = {
    id: 0,
    title: "",
    description: "",
    price: 0,
    productImg: "",
    units: 0
  };
  
  const [product, setProduct] = useState(emptyProduct);
  
  useEffect(() => {
    if (!isNewProduct) {
      setLoading(true);
      getProductsById(productId)
        .then((product) => {
          setProduct(product);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching product:", err);
          setLoading(false);
          setAlertMessage("Kunde inte hämta produkt");
          setAlertSeverity("error");
          setAlertOpen(true);
        });
    }
  }, [productId, isNewProduct]);

  async function onSave() {
    setLoading(true);
    try {
      if (isNewProduct) {
        console.log("Creating new product:", product);
        await create(product);
        setAlertMessage("Product created successfully!");
        setAlertSeverity("success");
        setAlertOpen(true);
        
        // Redirect to products page after 2 seconds
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
      } else {
        console.log("Updating product:", product);
        await update(product);
        setAlertMessage("Product updated successfully!");
        setAlertSeverity("success");
        setAlertOpen(true);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      setAlertMessage("An error occurred: " + (error.message || "Unknown error"));
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    if (isNewProduct) return;
    
    setLoading(true);
    try {
      await remove(product);
      setAlertMessage("Product deleted successfully!");
      setAlertSeverity("success");
      setAlertOpen(true);
      
      // Redirect to products page after 2 seconds
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (error) {
      console.error("Error deleting product:", error);
      setAlertMessage("An error occurred: " + (error.message || "Unknown error"));
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  }

  const handleCloseAlert = () => {
    setAlertOpen(false);
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin')}
          sx={{ mr: 2 }}
        >
          Back to Admin
        </Button>
        <Typography variant="h4">
          {isNewProduct ? "Add New Product" : "Edit Product"}
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <form>
              <TextField
                fullWidth
                name="title"
                id="title"
                label="Title"
                variant="outlined"
                margin="normal"
                value={product.title}
                onChange={(e) => setProduct({ ...product, title: e.target.value })}
                required
              />
              
              <TextField
                name="description"
                label="Description"
                value={product.description}
                fullWidth
                multiline
                minRows={4}
                margin="normal"
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                required
              />
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="price"
                    label="Price"
                    type="number"
                    value={product.price}
                    fullWidth
                    margin="normal"
                    onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) || 0 })}
                    required
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="units"
                    label="Units in Stock"
                    type="number"
                    value={product.units}
                    fullWidth
                    margin="normal"
                    onChange={(e) => setProduct({ ...product, units: parseInt(e.target.value) || 0 })}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              </Grid>
              
              <TextField
                name="productImg"
                label="Image URL"
                value={product.productImg}
                fullWidth
                margin="normal"
                onChange={(e) => setProduct({ ...product, productImg: e.target.value })}
                helperText="Enter a URL to the product image"
              />

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<SaveIcon />} 
                  onClick={onSave}
                  disabled={loading}
                  size="large"
                >
                  {isNewProduct ? "Create Product" : "Update Product"}
                </Button>

                {!isNewProduct && (
                  <Button 
                    variant="contained" 
                    color="error" 
                    startIcon={<DeleteIcon />} 
                    onClick={onDelete}
                    disabled={loading}
                  >
                    Delete
                  </Button>
                )}
              </Box>
            </form>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <Typography variant="h6" sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
              Product Preview
            </Typography>
            <Divider />
            <CardMedia
              component="img"
              height="280"
              image={product.productImg || 'https://via.placeholder.com/400x280?text=Product+Image'}
              alt="Product preview"
            />
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {product.title || "Product Title"}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {product.description || "Product description will appear here."}
              </Typography>
              <Typography variant="h5" color="primary">
                ${product.price || "0.00"}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Stock: {product.units || 0} units
              </Typography>
            </Box>
          </Card>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
            This is how your product will appear to customers
          </Typography>
        </Grid>
      </Grid>
      
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ProductEdit;
