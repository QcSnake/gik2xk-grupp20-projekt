import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  CardMedia
} from '@mui/material';

function ProductSmall({product}) {
  return (
    <>
      <Box sx={{ mb: 2 }}>
        <CardMedia
          component="img"
          height="180"
          image={product.productImg || 'https://via.placeholder.com/300x180?text=No+Image'}
          alt={`Cover for ${product.title}`}
          sx={{ objectFit: 'cover', borderRadius: 1 }}
        />
      </Box>
      <div>
        <Typography variant="h5" component="h3">
          <Link to={`/productDetail/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {product.title}
          </Link>
        </Typography>
        <Typography variant="h6" component="h4" sx={{ marginBottom: '1rem', fontWeight: 'bold', color: '#1976d2' }}>
          {product.price} kr
        </Typography>
      </div>
    </>
  );
}

export default ProductSmall;
