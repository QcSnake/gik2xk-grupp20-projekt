import ProductList from "../components/ProductList";

import { useLocation } from 'react-router-dom';
import "./Products.css"
import { Container } from '@mui/material';



function Products() {
  const location = useLocation();
  return (
  

  
    <Container maxWidth="md">
      
      <ProductList pathname={location.pathname} />
    </Container>
  );
  
}

export default Products;
