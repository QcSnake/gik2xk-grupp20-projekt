const db = require("../models");


const {
  createResponseSuccess,
  createResponseError,
  createResponseMessage,
} = require("../helpers/responseHelper");

//Tar imot ett produkt ID och hämtar ut produkten med det ID:t
//lägg till hämta kommentar och betyg
async function getProductById(productId) {
  try {
    const products = await db.product.findOne({ where: { id: productId },
       include: [ db.review] });
    //return createResponseSuccess(_formatProduct(product));
    return createResponseSuccess(
      _formatProduct(products)
    );
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}
async function getReviewById(reviewId) {
  try {
    const review = await db.review.findOne({ where: { id: reviewId },
       include: [ db.user] });
    //return createResponseSuccess(_formatProduct(product));
    return createResponseSuccess(
     review
    );
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}


//Hämtar cart och dess produkter via user id.
async function getByUser(userId) {
  try {
    const cart = await db.cart.findOne({
      where: { userId },
      include: [db.user, db.product],
    });
    /* return createResponseSuccess(cart); */
    return createResponseSuccess(_formatCart(cart));
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

async function getReviewByUser(userId) {
  try {
    const review = await db.review.findAll({
      where: { userId },
      include: [db.user, db.product],
    });
    /* return createResponseSuccess(cart); */
    return createResponseSuccess(review);
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}
//get user by id
async function getByUserID(userId) {
  try {
    const user = await db.user.findOne({ where: { id: userId } });
    return createResponseSuccess(user);
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

//För cart!  check
async function getById(id) {
  try {
    const cart = await db.cart.findOne({
      where: { id },
      include: [db.user, db.product],
    });
    return createResponseSuccess(_formatCart(cart));
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

//Hämta alla produkter
//check
async function getAllProducts() {
  try {
    const allProducts = await db.product.findAll({
    });
    return createResponseSuccess(allProducts);
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}
//get all users
//check
async function getAllUsers() {
  try {
    const allUsers = await db.user.findAll();
    return createResponseSuccess(allUsers.map((user) => _formatUser(user)));
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

//Add review till produkt
async function addReview(id, review) {
  if (!id) {
    return createResponseError(422, "Id is obligatory");
  }
  try {
    review.productId = id;
    await db.review.create(review);

    const newReview = await db.product.findOne({
      where: { id }
    });

    return createResponseSuccess(newReview);
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

async function create(cart) {

  try {
    const newCart = await db.cart.create(cart);
    //post tags är en array av namn
    //lägg till eventuella taggar
    await _addProductToCart(newCart, cart.products);

    return createResponseSuccess(newCart);
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

//check
async function updateProduct(id, product) {

  try {
    const existingProduct = await db.product.findOne({ where: { id } });
    if (!existingProduct) {
      return createResponseError(404, "Found no product to update.");
    }
    //await _addTagToPost(existingProduct, post.tags);
    
    await db.product.update(product, { where: { id } }); //funkar inte dubbelkolla detta
    return createResponseMessage(200, "Product has been updated.");
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

//check
async function updateUser(id, user) {
 
  try {
    const existingUser = await db.user.findOne({ where: { id } });
    if (!existingUser) {
      return createResponseError(404, "Found no user to update.");
    }
    //await _addTagToPost(existingProduct, post.tags);
    await db.user.update(user, { where: { id } }); //funkar inte dubbelkolla detta
    return createResponseMessage(200, "user has been updated.");
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

async function updateReview(id, review) {
 
  try {
    const existingProduct = await db.review.findOne({ where: { id } });
    if (!existingProduct) {
      return createResponseError(404, "Found no review to update.");
    }
    //await _addTagToPost(existingProduct, post.tags);
    await db.review.update(review, { where: { id } }); //funkar inte dubbelkolla detta
    return createResponseMessage(200, "Review has been updated.");
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

//check!
async function updateCart(id, cart) {
  
  //Denna behöver en cart och ett ID, cart ID

  try {
    const existingCart = await db.cart.findOne({ where: { id } });
    if (!existingCart) {
      return createResponseError(404, "Found no cart to update.");
    }
    //await _addTagToPost(existingProduct, post.tags);
   
    await _addProductToCart(existingCart, cart.products);
    
    await db.cart.update(cart, { where: { id } }); //funkar inte dubbelkolla detta
    
    
    return createResponseMessage(200, "Cart has been updated.");
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}



//check
async function destroyProduct(id) {
  if (!id) {
    return createResponseError(422, "Id is obligatory.");
  }
  try {
    await db.product.destroy({ where: { id } });
    return createResponseMessage(200, "Product was deleted.");
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

//check
async function destroyUser(id) {
  if (!id) {
    return createResponseError(422, "Id is obligatory.");
  }
  try {
    await db.user.destroy({ where: { id } });
    return createResponseMessage(200, "user was deleted.");
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

async function destroyReview(id) {
  
  if (!id) {
    return createResponseError(422, "Id does not exist.");
  }
  try {
    await db.review.destroy({ where: { id } });
    return createResponseMessage(200, "Review was deleted.");
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

function _formatProduct(product) {
  const cleanProduct = {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    productImg: product.productImg,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
  if (product.reviews) {
    cleanProduct.reviews = [];
    product.reviews.map((review) => {
      return (cleanProduct.reviews = [
        {
          id: review.id,
          rating: review.rating,
          summary: review.summary,
          userId: review.userId,
          createdAt: review.createdAt,
        },
        ...cleanProduct.reviews
      ]);
    });
  }

  return cleanProduct;
}

function _formatCart(cart) {
  
  const cleanCart = {
    id: cart.id,
    units: cart.units,
    total_amount: cart.total_amount,
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
    user: {
      id: cart.user.id,
      email: cart.user.email,
      f_name: cart.user.f_name,
      l_name: cart.user.l_name,
    }, products: cart.products,
   

  };
  
    return cleanCart;
  
}



function _formatUser(user) {
  const cleanUser = {
    id: user.id,
    email: user.email,
    f_name: user.f_name,
    l_name: user.l_name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
  if (user.review) {
    cleanUser.reviews = [];
    user.reviews.map((review) => {
      return (cleanUser.review = [
        {
          id: review.user.product.id,
          rating: review.rating,
          summary: review.summary,
          createdAt: review.createdAt,
        },
        ...cleanUser.reviews,
      ]);
    });
  }
  return cleanUser;
}
async function _findOrCreateproductId(id) {
 
  const foundOrCreatedProduct = await db.product.findOrCreate({ where: { id} });

  return foundOrCreatedProduct[0].id;
}

async function _addProductToCart(cart, products) {

 
  
  if (products) {
    products.forEach(async (product) => {
      const productId = await _findOrCreateproductId(product.id);
      await cart.addProduct(productId);
    });
  }
}

//uppdatera så dessa stämmer ;D gjort!
module.exports = {
  getProductById,
  getByUserID,
  getByUser,
  getReviewByUser,
  getReviewById,
  getById,
  getAllProducts,
  getAllUsers,
  create,
  addReview,
  updateUser,
  updateProduct,
  updateReview,
  updateCart,
  destroyProduct,
  destroyUser,
  destroyReview,
};
