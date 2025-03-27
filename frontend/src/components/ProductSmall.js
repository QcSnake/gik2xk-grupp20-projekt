
import { Link } from 'react-router-dom';
import {
  Box,
  Typography
} from '@mui/material';



function ProductSmall({product}) {
  return (
    <>
      {<Box
        >
        <img heigh="200" width="500" src={product.productImg} alt="cover for the game"/>
      </Box>
 }
      <div>
        <Typography variant="h5" component="h3">
          <Link to={`/productDetail/${product.id}`}>{product.title}</Link>
        </Typography>
        <Typography variant="h5" component="h3"sx={{ marginBottom: '2rem' }}>
          Price: {product.price}kr
        </Typography>
      </div>
    </>
   
  );
}

export default ProductSmall;
