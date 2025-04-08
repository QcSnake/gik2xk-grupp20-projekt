import { Typography, Button, Box, TextField, Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProductsById, update } from "../models/productModel";
import { updateCart, getByUser } from "../models/cartModel";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { getCurrentUser } from "../models/authModel";

function ProductLarge({ product }) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  
  const user = getCurrentUser();

  async function addToCart() {
    if (!user) {
      // Skicka till inloggning om användaren inte är inloggad
      setAlertMessage("Logga in för att lägga till varor i kundvagnen");
      setAlertSeverity("warning");
      setAlertOpen(true);
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    try {
      // Hämta användarens kundvagn eller skapa en ny
      let cart = await getByUser(user.id);
      
      if (!cart) {
        cart = {
          userId: user.id,
          units: 0,
          total_amount: 0,
          products: []
        };
      }
      
      // Kontrollera om produkten redan finns i kundvagnen
      const existingProductIndex = cart.products.findIndex(p => p.id === product.id);
      
      if (existingProductIndex >= 0) {
        // Uppdatera antal
        cart.products[existingProductIndex].quantity += parseInt(quantity);
      } else {
        // Lägg till ny produkt
        cart.products.push({
          ...product,
          quantity: parseInt(quantity)
        });
      }
      
      // Uppdatera totaler
      cart.units = cart.products.reduce((total, product) => total + product.quantity, 0);
      cart.total_amount = cart.products.reduce(
        (total, product) => total + (product.price * product.quantity), 0
      );
      
      await updateCart(cart, cart.id);
      
      setAlertMessage("Tillagd i kundvagnen!");
      setAlertSeverity("success");
      setAlertOpen(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setAlertMessage("Fel vid tillägg i kundvagnen");
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  }

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  return product ? (
    <>
      <ul>
        <li key={`productId_${product.id}`}>
          <div>
            <img
              height="200"
              width="500"
              src={product.productImg}
              alt={product.title}
            />
          </div>

          <div>
            <Typography variant="h5" component="h3">
              {
                <Link to={`/productDetail/${product.id}`}>
                  {product.title}
                </Link>
              }
            </Typography>
            <Typography>{product.description}</Typography>
            <br />
            <Typography variant="h5" component="h3">
              Pris: {product.price}kr
            </Typography>

            <Box variant="h5" component="h3" sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <TextField
                name="quantity"
                size="small"
                label="Antal"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                InputProps={{ inputProps: { min: 1 } }}
                sx={{ width: '100px', mr: 2 }}
              />
              
              <Button
                size="large"
                startIcon={<AddShoppingCartIcon />}
                onClick={addToCart}
                variant="contained"
                color="primary"
              >
                Lägg i kundvagn
              </Button>
            </Box>
          </div>
        </li>
      </ul>
      
      {user && user.role === 'admin' && (
        <Typography variant="h5" component="h3">
          <Link to={`/productEdit/${product.id}`}>Redigera produkt</Link>
        </Typography>
      )}
      
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  ) : (
    <Typography>Produkten saknas</Typography>
  );
}

export default ProductLarge;
