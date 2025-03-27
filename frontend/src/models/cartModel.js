import api from "../api.js";
 
export async function create(cart) {
  try {
    const result = await api.post('/carts/', cart);
    if (result.status === 200) return result.data;
    return null;
  } catch (error) {
    console.error("Error creating cart:", error);
    throw error;
  }
}

export async function getCartById(id) {
  try {
    const result = await api.get(`/carts/${id}`);
    if (result.status === 200) return result.data;
    return null;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return null;
  }
}

export async function getByUser(userId) {
  try {
    const result = await api.get(`/carts/user/current`);
    if (result.status === 200) return result.data;
    return null;
  } catch (error) {
    console.error("Error fetching user's cart:", error);
    return null;
  }
}

export async function updateCart(cart, id) {
  try {
    const result = await api.put(`/carts/${id}`, cart);
    if (result.status === 200) return result.data;
    return null;
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
}

export async function deleteCart(id) {
  try {
    const result = await api.delete(`/carts/${id}`);
    if (result.status === 200) return true;
    return false;
  } catch (error) {
    console.error("Error deleting cart:", error);
    return false;
  }
}


