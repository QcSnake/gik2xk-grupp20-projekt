import api from "../api.js";

export async function getAll() {
  try {
    const result = await api.get("/users");
    if (result.status === 200) return result.data;
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getAllUsers() {
  return getAll();
}

export async function getByUserID(id) {
  const result = await api.get(`/users/${id}`);
 
  if (result.status === 200) return result.data;
  
  else {
    console.log(result.status);
    console.log(result.data);
    return [];
  }
}

export async function getReviewByUserID(id) {
  const result = await api.get(`/users/${id}/reviews`);
 
  if (result.status === 200) return result.data;
  
  else {
    console.log(result.status);
    console.log(result.data);
    return [];
  }
}

export async function getReviewById(id) {
  const result = await api.get(`/users/${id}/review`);
 
  if (result.status === 200) return result.data;
  
  else {
    console.log(result.status);
    console.log(result.data);
    return [];
  }
}

export async function create(user) {
  const result = await api.post("/users/", user);

  if (result.status === 200) return result.data;
  else {
    console.log(result.status);
    console.log(result.data);
}
}

export async function updateReview(review, id) {
  const result = await api.put(`/users/${id}/review` , review);

  if (result.status === 200) return result.data;
  else {
    console.log(result.status);
    console.log(result.data);
    return {};
  }
}

export async function update(user) {
  console.log(user);
  const result = await api.put(`/users/${user.id}`, user);

  if (result.status === 200) return result.data;
  else {
    console.log(result.status);
    console.log(result.data);
    return {};
  }
}

export async function remove(review) {
  console.log(review.id);
  const result = await api.delete(`/users/${review.id}/destroyReview`, review.id);
 
  if (result.status === 200) {
    console.log("error here?");
    return result.data;
  }
  else {
    console.log(result.status);
    console.log(result.data);
    return {};
  }
}

