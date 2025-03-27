import api from '../api.js';

export async function getAllProducts(url= '/products') {

  const result = await api.get(url);
    
  if (result.status === 200) return result.data;
   
    else {
        console.log(result.status);
        console.log(result.data);
        return [];
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
    const result = await api.put(`/products/${product.id}`, product);
  
    if (result.status === 200) return result.data;
    else {
      console.log(result.status);
      console.log(result.data);
      return {};
    }
  }
  
  export async function create(product) {
    const result = await api.post('/products/', product);
  
    if (result.status === 200) return result.data;
    else {
      console.log(result.status);
      console.log(result.data);
      return {};
    }
  }
  
  export async function remove(product) {
    
    console.log(product.id);
    const result = await api.delete(`/products/${product.id}`, product.id);
 
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
    
  
    /*  const test = {id:1,units:2,total_amount:600,user:{
     id: 1,
      email: "tokvi@du.se",
      f_name: "Thomas",
      l_name: "Kvist"},
      products:[
        {
          id: 1,
          title: "monster Hunter World ",
          description: "sahudhasfhaf afgasfsaf",
          price: 300,
          productImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXc9DMETl9AlCTuR4di8yrLzek7Vi9o98SwA&usqp=CAU",
          createdAt: "2023-03-22T12:02:24.000Z",
          updatedAt: "2023-03-22T12:02:24.000Z",
      },
      {
          id: 2,
          title: "Space hunter",
          description: "sahudhasfhaf afgasfsaf",
          price: 300,
          productImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXc9DMETl9AlCTuR4di8yrLzek7Vi9o98SwA&usqp=CAU",
          createdAt: "2023-03-22T12:02:24.000Z",
          updatedAt: "2023-03-22T12:02:24.000Z",
      }
      ]
    }; */
    
  const result = await api.put(`/carts/${id}`, cart);
  
    /* const result = await api.put(`/cart/${cart.id}`, cart); */


    if (result.status === 200) return result.data;
    else {
      console.log(result.status);
      console.log(result.data);
      return {};
    }
  }

