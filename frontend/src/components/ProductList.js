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
  Fade,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getAllProducts()
      .then(data => {
        const productsWithDefaultRatings = data.map(product => ({
          ...product,
          averageRating: product.averageRating || 0
        }));
        setProducts(productsWithDefaultRatings);
        setLoading(false);
      })
      .catch(err => {
        setError("Kunde inte hämta produkter. Försök igen senare.");
        setLoading(false);
      });
  }, [pathname]);

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardClick = (productId) => {
    navigate(`/productDetail/${productId}`);
  };

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
    return <Typography>Inga produkter tillgängliga just nu.</Typography>;
  }

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Sök produkter..."
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
              <Card 
                sx={{ 
                  height: "100%", 
                  display: "flex", 
                  flexDirection: "column",
                  cursor: 'pointer'
                }}
                onClick={() => handleCardClick(product.id)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.productImg || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={product.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" color="primary">
                      {product.price} kr
                    </Typography>
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
                    Lägg i kundvagn
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
