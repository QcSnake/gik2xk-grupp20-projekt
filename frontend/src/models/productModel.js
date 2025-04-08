import api from '../api.js';

export async function getAllProducts(url= '/products') {
  try {
    const result = await api.get(url);
    
    if (result.status === 200) {
      const products = result.data.map(product => ({
        ...product,
        averageRating: Number(product.averageRating) || 0
      }));
      
      return products;
    }
    return [];
  } catch (error) {
    return []; 
  }
}

export async function getProductsById(id) {
  const result = await api.get(`/products/${id}`);
  if (result.status === 200) return result.data;
  return [];
}

export async function update(product) {
  try {
    const result = await api.put(`/products/${product.id}`, product);
    if (result.status === 200) return result.data;
    return {};
  } catch (error) {
    throw error;
  }
}

export async function create(product) {
  try {
    const result = await api.post('/products/', product);
    if (result.status === 200) return result.data;
    return {};
  } catch (error) {
    throw error;
  }
}

export async function remove(product) {
  try {
    const result = await api.delete(`/products/${product.id}`);
    if (result.status === 200) return result.data;
    return {};
  } catch (error) {
    throw error;
  }
}

export async function addReview(id, review) {
  const result = await api.post(`/products/${id}/createReview`, review);
  if (result.status === 200) return result.data;
  return {};
}

