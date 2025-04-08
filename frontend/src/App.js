// src/App.js
import React, { useState, useEffect } from "react";
import {
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  ThemeProvider,
  createTheme,
  Button,
  Box,
  IconButton,
  Badge,
  Avatar,
  Stack,
} from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// Import components
import ProductDetail from "./views/ProductDetail";
import ProductEdit from "./views/ProductEdit";
import Login from "./views/Login";
import Register from "./views/Register";
import CartMain from "./views/CartMain";
import AdminDashboard from "./views/AdminDashboard";
import { CartProvider, useCart } from "./contexts/CartContext";
import Products from "./views/Products";
import { getCurrentUser, logout } from "./models/authModel";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#ff9800" },
    background: { default: "#f5f5f5" },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }
      }
    }
  }
});

function AppContent() {
  const { cartItems } = useCart();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);
  
  const isAdmin = user && user.role === 'admin';
  const isLoggedIn = !!user;

  const handleLogout = () => {
    logout();
    navigate('/');
    window.location.reload(); // Refresh to clear state
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{ color: "inherit", textDecoration: "none", mr: 3 }}
            >
              Snabbis
            </Typography>
            
            {/*  Navigation Menu - ??*/}
            <Stack direction="row" spacing={2}>
              <Button color="inherit" component={Link} to="/">
                Produkter
              </Button>
              {isAdmin && (
                <Button color="inherit" component={Link} to="/admin">
                  Admin
                </Button>
              )}
            </Stack>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton component={Link} to="/cart" color="inherit" sx={{ mr: 1 }}>
              <Badge badgeContent={cartItems.length} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            
            {isLoggedIn ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  {user.f_name}
                </Typography>
                <Avatar 
                  sx={{ width: 32, height: 32, bgcolor: isAdmin ? 'secondary.main' : 'primary.main', mr: 2 }}
                >
                  {user.f_name ? user.f_name[0].toUpperCase() : 'A'}
                </Avatar>
                <Button color="inherit" onClick={handleLogout}>
                  Logga ut
                </Button>
              </Box>
            ) : (
              <Button 
                component={Link} 
                to="/login" 
                color="inherit"
              >
                Logga in
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, pb: 8 }}>
        <Routes>
          {/* Samma */}
          <Route path="/" element={<Products />} />
          <Route path="/products" element={<Products />} />
          <Route path="/productDetail/:id" element={<ProductDetail />} />
          <Route path="/productEdit/:id" element={<ProductEdit />} />
          <Route path="/cart" element={<CartMain />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}
