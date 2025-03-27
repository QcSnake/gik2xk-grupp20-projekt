import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from "@mui/material/styles";

 const root = ReactDOM.createRoot(document.getElementById('root'));
  const theme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#263238",
        contrastText: "#ffd600",
      },
      secondary: {
        main: "#95acc9",
        contrastText: "#ffd600",
      },
      
    }, 
    
  });


root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
        
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);


