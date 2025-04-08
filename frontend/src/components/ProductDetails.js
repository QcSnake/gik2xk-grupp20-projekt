import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../contexts/CartContext";
import {
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Rating,
    Button,
    Box,
    Container 
  } from "@mui/material";
  

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    // Hämta produkt
    axios.get(`http://localhost:3005/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => console.error("Kunde inte hämta produkten"))
      .finally(() => setLoading(false));

    // Hämta betyg
    axios.get(`http://localhost:3005/ratings?productId=${id}`)
      .then((res) => setRatings(res.data))
      .catch(() => console.error("Kunde inte hämta betyg"));
  }, [id]);

  const handleRatingSubmit = async () => {
    if (!newRating) return;
    try {
      const res = await axios.post("http://localhost:3005/ratings", {
        productId: id,
        value: newRating,
      });
      setRatings((prev) => [...prev, res.data]);
      setNewRating(0);
    } catch (err) {
      console.error("Kunde inte spara betyg");
    }
  };

  const averageRating =
    ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length).toFixed(1)
      : "Inga betyg ännu";

  if (loading) return <CircularProgress />;

  if (!product) return <Typography>Produkten hittades inte.</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4">{product.title}</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {product.description}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Pris: {product.price} kr
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Snittbetyg: {averageRating}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Rating
              value={newRating}
              onChange={(e, newVal) => setNewRating(newVal)}
              name="new-rating"
            />
            <Button
              variant="contained"
              sx={{ ml: 2 }}
              onClick={handleRatingSubmit}
            >
              Skicka betyg
            </Button>
          </Box>

          <Button
            variant="outlined"
            color="primary"
            sx={{ mt: 3 }}
            onClick={() => addToCart(product)}
          >
            Lägg till i varukorg
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductDetails;
