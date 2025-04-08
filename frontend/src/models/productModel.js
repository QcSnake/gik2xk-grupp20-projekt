import api from '../api.js';

export async function getAllProducts(url= '/products') {
  try {
    console.log("Fetching products from:", url);
    const result = await api.get(url);
    
    if (result.status === 200) {
      // Ensure ratings are properly formatted as numbers
      const products = result.data.map(product => ({
        ...product,
        averageRating: Number(product.averageRating) || 0
      }));
      
      console.log("Products received with ratings:", products);
      return products;
    } else {
      console.log("Unexpected status:", result.status);
      console.log("Response data:", result.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching products:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    return []; // Return empty array instead of throwing to prevent UI errors
  }
}

export async function getProductsById(id) {
  const result = await api.get(`/products/${id}`);

   if (result.status === 200) return result.data;
   
    else {
        console.log(result.status);
        console.log(result.data);
        return [];
    }
}

export async function update(product) {
  try {
    console.log("Updating product:", product);
    const result = await api.put(`/products/${product.id}`, product);
    
    if (result.status === 200) {
      console.log("Product updated successfully:", result.data);
      return result.data;
    } else {
      console.error("Unexpected status:", result.status);
      console.error("Response data:", result.data);
      return {};
    }
  } catch (error) {
    console.error("Error updating product:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw error;
  }
}

export async function create(product) {
  try {
    console.log("Creating new product:", product);
    const result = await api.post('/products/', product);
    
    if (result.status === 200) {
      console.log("Product created successfully:", result.data);
      return result.data;
    } else {
      console.error("Unexpected status:", result.status);
      console.error("Response data:", result.data);
      return {};
    }
  } catch (error) {
    console.error("Error creating product:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw error;
  }
}

export async function remove(product) {
  try {
    console.log("Deleting product:", product.id);
    const result = await api.delete(`/products/${product.id}`);
    
    if (result.status === 200) {
      console.log("Product deleted successfully:", result.data);
      return result.data;
    } else {
      console.error("Unexpected status:", result.status);
      console.error("Response data:", result.data);
      return {};
    }
  } catch (error) {
    console.error("Error deleting product:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw error;
  }
}

export async function getOne(id) {
  const result = await api.get(`/products/${id}`);
    
  
  if (result.status === 200) return result.data;
  else {
    console.log(result.status);
    console.log(result.data);
    return {};
  }
}

export async function addReview(id, review) {
  const result = await api.post(`/products/${id}/createReview`, review);

  if (result.status === 200) return result.data;
  else {
    console.log(result.status);
    console.log(result.data);
    return {};
  }
}

export async function updateCart(cart, id) {
    
  const result = await api.put(`/carts/${id}`, cart);

    if (result.status === 200) return result.data;
    else {
      console.log(result.status);
      console.log(result.data);
      return {};
    }
  }

