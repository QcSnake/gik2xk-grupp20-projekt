// src/components/ProductList.js
import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Container,
  Box,
  CardMedia,
  CardActions,
  Button,
  Rating,
  Fade,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { getAllProducts } from "../models/productModel";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import { useCart } from "../contexts/CartContext";

function ProductList({ pathname }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    getAllProducts()
      .then(data => {
        console.log("Products fetched:", data);
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Could not fetch products:", err);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      });
  }, [pathname]);

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product, event) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart(product);
  };

  if (loading) return (
    <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8, mb: 8 }}>
      <CircularProgress />
    </Container>
  );
  
  if (error) return <Typography color="error">{error}</Typography>;
  
  if (!products || products.length === 0) {
    return <Typography>No products available at the moment.</Typography>;
  }

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={`product_${product.id}`}>
            <Fade in={true} timeout={500}>
              <Card sx={{ 
                height: "100%", 
                display: "flex", 
                flexDirection: "column",
              }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.productImg || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={product.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component={Link} to={`/productDetail/${product.id}`} 
                    sx={{ textDecoration: 'none', color: 'inherit', display: 'block', mb: 1 }}>
                    {product.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    mb: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {product.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary">
                      ${product.price}
                    </Typography>
                    <Rating value={4} readOnly size="small" />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    variant="contained" 
                    startIcon={<AddShoppingCartIcon />}
                    fullWidth
                    onClick={(e) => handleAddToCart(product, e)}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default ProductList;
