import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Divider,
  Button,
  Rating,
  TextField,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  Avatar,
  Chip,
  Snackbar,
  Alert,
  Container,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { getProductsById, addReview } from "../models/productModel";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCart } from "../contexts/CartContext";
import { getCurrentUser } from "../models/authModel";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const { addToCart } = useCart();
  const user = getCurrentUser();

  useEffect(() => {
    setLoading(true);
    getProductsById(id)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setError("Could not load product details. Please try again later.");
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      // Add the product with the selected quantity
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      setAlertMessage("Product added to cart!");
      setAlertSeverity("success");
      setAlertOpen(true);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      setAlertMessage("Vänligen logga in för att lämna en recension");
      setAlertSeverity("warning");
      setAlertOpen(true);
      return;
    }

    if (reviewRating === 0) {
      setAlertMessage("Vänligen välj ett betyg");
      setAlertSeverity("warning");
      setAlertOpen(true);
      return;
    }

    if (reviewText.trim() === "") {
      setAlertMessage("Vänligen skriv en recension");
      setAlertSeverity("warning");
      setAlertOpen(true);
      return;
    }

    try {
      const review = {
        rating: reviewRating,
        summary: reviewText,
        userId: user.id,
      };

      await addReview(id, review);
      
      // Refresh product data to show the new review and updated average
      const updatedProduct = await getProductsById(id);
      setProduct(updatedProduct);
      
      // Reset form
      setReviewRating(0);
      setReviewText("");
      
      setAlertMessage("Recension har skickats!");
      setAlertSeverity("success");
      setAlertOpen(true);
    } catch (err) {
      console.error("Error submitting review:", err);
      setAlertMessage("Failed to submit review. Please try again.");
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h6">Product not found</Typography>
      </Box>
    );
  }

  // Calculate average rating
  const reviews = product.reviews || [];
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        {/* Product Image and Details */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  sx={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                    borderRadius: 1,
                  }}
                  src={product.productImg || "https://via.placeholder.com/400x400?text=No+Image"}
                  alt={product.title}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h4" component="h1" gutterBottom>
                  {product.title}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Rating
                    value={averageRating}
                    precision={0.5}
                    readOnly
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    ({reviews.length} {reviews.length === 1 ? "recension" : "recensioner"})
                  </Typography>
                </Box>

                <Typography
                  variant="h5"
                  color="primary"
                  sx={{ mb: 2, fontWeight: "bold" }}
                >
                  {product.price} kr
                </Typography>

                <Typography variant="body1" paragraph>
                  {product.description}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
                  <TextField
                    label="Antal"
                    type="number"
                    InputProps={{ inputProps: { min: 1 } }}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val > 0) {
                        setQuantity(val);
                      }
                    }}
                    size="small"
                    sx={{ width: 100, mr: 2 }}
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ShoppingCartIcon />}
                    size="large"
                    onClick={handleAddToCart}
                  >
                    Lägg i kundvagn
                  </Button>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Chip
                    color="success"
                    label={product.units > 0 ? "I lager" : "Slut i lager"}
                    sx={{ mr: 1 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Reviews Section */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skriv en recension
              </Typography>

              {user ? (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography component="legend">Ditt betyg</Typography>
                    <Rating
                      name="rating"
                      value={reviewRating}
                      onChange={(event, newValue) => {
                        setReviewRating(newValue);
                      }}
                      precision={0.5}
                    />
                  </Box>

                  <TextField
                    label="Din recension"
                    multiline
                    rows={4}
                    fullWidth
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <Button
                    variant="contained"
                    onClick={handleSubmitReview}
                    fullWidth
                  >
                    Skicka recension
                  </Button>
                </>
              ) : (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Du måste vara inloggad för att lämna en recension.
                  </Typography>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/login"
                    fullWidth
                  >
                    Logga in för att recensera
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Kundrecensioner
              </Typography>

              {reviews.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Inga recensioner än. Bli först med att recensera denna produkt!
                </Typography>
              ) : (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Rating
                      value={averageRating}
                      precision={0.1}
                      readOnly
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2">
                      {averageRating.toFixed(1)} av 5
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {reviews.map((review, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "primary.main",
                            mr: 1,
                          }}
                        >
                          {review.userDetails ? review.userDetails.f_name[0] : (review.userId?.toString().charAt(0) || "U")}
                        </Avatar>
                        <Typography variant="subtitle2">
                          {review.userDetails ? `${review.userDetails.f_name} ${review.userDetails.l_name}` : `Användare ${review.userId}`}
                        </Typography>
                      </Box>

                      <Rating
                        value={review.rating}
                        readOnly
                        size="small"
                        sx={{ mb: 1 }}
                      />

                      <Typography variant="body2" paragraph>
                        {review.summary}
                      </Typography>

                      {index < reviews.length - 1 && (
                        <Divider sx={{ mb: 2 }} />
                      )}
                    </Box>
                  ))}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ProductDetail;
