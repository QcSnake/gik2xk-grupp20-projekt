import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
  Divider,
  TextField,
  Grid,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { useCart } from "../contexts/CartContext";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

function Cart() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Beräkna totalpriset för alla varor i kundvagnen
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    setAlertMessage("Utcheckning är inte implementerad ännu.");
    setAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  if (cartItems.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h5" gutterBottom>
          Din kundvagn är tom
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Du har inte lagt till några produkter i din kundvagn ännu.
        </Typography>
        <Button variant="contained" color="primary" href="/">
          Fortsätt shoppa
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Kundvagn
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ mb: 4 }}>
            {cartItems.map((item, index) => (
              <Box key={index}>
                <Box
                  sx={{
                    display: "flex",
                    p: 2,
                    borderBottom:
                      index < cartItems.length - 1
                        ? "1px solid #eee"
                        : "none",
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{ width: 100, height: 100, objectFit: "contain" }}
                    image={
                      item.productImg ||
                      "https://via.placeholder.com/100x100?text=No+Image"
                    }
                    alt={item.title}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      ml: 2,
                      flexGrow: 1,
                    }}
                  >
                    <Box>
                      <Typography variant="h6">{item.title}</Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mb: 1 }}
                      >
                        {item.price} kr
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(
                            index,
                            Math.max(1, (item.quantity || 1) - 1)
                          )
                        }
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>

                      <TextField
                        size="small"
                        inputProps={{ min: 1, style: { textAlign: "center" } }}
                        value={item.quantity || 1}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value > 0) {
                            updateQuantity(index, value);
                          }
                        }}
                        sx={{ width: 60, mx: 1 }}
                      />

                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(index, (item.quantity || 1) + 1)
                        }
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeFromCart(index)}
                        sx={{ ml: 2 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      minWidth: 100,
                    }}
                  >
                    <Typography variant="h6">
                      {((item.price || 0) * (item.quantity || 1)).toFixed(2)} kr
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ordersammanfattning
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body1">
                  Delsumma ({cartItems.reduce((a, c) => a + (c.quantity || 1), 0)}{" "}
                  varor)
                </Typography>
                <Typography variant="body1">{totalPrice.toFixed(2)} kr</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body1">Frakt</Typography>
                <Typography variant="body1">Gratis</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Totalt</Typography>
                <Typography variant="h6">{totalPrice.toFixed(2)} kr</Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleCheckout}
              >
                Gå till kassan
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="info" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Cart;