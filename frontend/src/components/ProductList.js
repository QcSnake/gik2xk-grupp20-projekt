

import { useEffect, useState } from 'react';
import { getAllProducts } from '../models/productModel'
import ProductSmall from "./ProductSmall";


function ProductList({ pathname }) {
  
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    getAllProducts(pathname).then((products) => setProducts(products));
  }, [pathname]);
  

  return (
    <ul>
      
      {products &&
        products.map((product) => {
            return (
              <li key={`productId_${product.id}`} >
                <ProductSmall product={product}  />
              </li>
            );
          })}
    </ul>
  );
}

export default ProductList;
