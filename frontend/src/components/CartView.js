// src/components/CartView.js
import React from "react";
import { useCart } from "../contexts/CartContext";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
} from "@mui/material";

const CartView = () => {
  const { cartItems, removeFromCart } = useCart();

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Din varukorg
      </Typography>

      <Grid container spacing={2}>
        {cartItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">{item.title}</Typography>
                <Typography>{item.price} kr</Typography>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => removeFromCart(index)}
                >
                  Ta bort
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Totalt: {totalPrice.toFixed(2)} kr</Typography>
      </Box>
    </Container>
  );
};

export default CartView;
