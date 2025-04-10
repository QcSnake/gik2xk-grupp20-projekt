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
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  useEffect(() => {
    const updateUserState = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      console.log("User state updated:", currentUser);
    };

    updateUserState();

    window.addEventListener('auth-change', updateUserState);

    return () => {
      window.removeEventListener('auth-change', updateUserState);
    };
  }, [location.pathname]);

  const isAdmin = user && user.role === 'admin';
  const isLoggedIn = !!user;

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/');

    window.dispatchEvent(new Event('auth-change'));
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
                <Box sx={{ mr: 2, textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
                    {user?.f_name} {user?.l_name}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: 'white.main' }}>
                    {user?.role === 'admin' ? 'Administrator' : 'Kund'}
                  </Typography>
                </Box>
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: isAdmin ? 'secondary.main' : 'primary.main', 
                    mr: 2,
                    border: '2px solid white'
                  }}
                >
                  {user?.f_name ? user.f_name[0].toUpperCase() : 'A'}
                </Avatar>
                <Button 
                  color="inherit" 
                  onClick={handleLogout}
                  variant="outlined"
                  size="small"
                  sx={{ borderColor: 'rgba(255,255,255,0.5)' }}
                >
                  Logga ut
                </Button>
              </Box>
            ) : (
              <Button 
                component={Link} 
                to="/login" 
                color="inherit"
                variant="outlined"
                size="small"
                sx={{ borderColor: 'rgba(255,255,255,0.5)' }}
              >
                Logga in
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, pb: 8 }}>
        <Routes>
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
