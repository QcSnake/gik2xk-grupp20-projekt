const db = require("../models");
const {
  createResponseSuccess,
  createResponseError,
  createResponseMessage,
} = require("../helpers/responseHelper");

// Hämtar produkt med ID och recensioner
async function getProductById(productId) {
  try {
    const products = await db.product.findOne({ 
      where: { id: productId },
      include: [db.review] 
    });
    return createResponseSuccess(_formatProduct(products));
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

// Räknar ut medelbetyg
async function getAverageRating(productId) {
  try {
    const reviews = await db.review.findAll({
      where: { productId },
      attributes: ['rating']
    });
    
    if (!reviews || reviews.length === 0) return null;
    
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return sum / reviews.length;
  } catch (error) {
    return null;
  }
}

async function getReviewById(reviewId) {
  try {
    const review = await db.review.findOne({ 
      where: { id: reviewId },
      include: [db.user] 
    });
    return createResponseSuccess(review);
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

// Hämtar kundvagn för användare
async function getByUser(userId) {
  try {
    const cart = await db.cart.findOne({
      where: { userId },
      include: [db.user, db.product],
    });
    
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
   
    return createResponseSuccess(review);
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

// Hämtar användare med ID
async function getByUserID(userId) {
  try {
    const user = await db.user.findOne({ where: { id: userId } });
    return createResponseSuccess(user);
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

// Hämtar kundvagn med ID
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

// Hämtar alla produkter
async function getAllProducts() {
  try {
    const allProducts = await db.product.findAll({});
    return createResponseSuccess(allProducts);
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

// Hämtar alla användare
async function getAllUsers() {
  try {
    const allUsers = await db.user.findAll();
    return createResponseSuccess(allUsers.map((user) => _formatUser(user)));
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

// Lägger till recension
async function addReview(id, review) {
  if (!id) return createResponseError(422, "Id måste anges");
  
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
    await _addProductToCart(newCart, cart.products);
    return createResponseSuccess(newCart);
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

// Uppdaterar produkt
async function updateProduct(id, product) {
  try {
    const existingProduct = await db.product.findOne({ where: { id } });
    if (!existingProduct) {
      return createResponseError(404, "Hittade ingen produkt att uppdatera.");
    }
    await db.product.update(product, { where: { id } });
    return createResponseMessage(200, "Produkten har uppdaterats.");
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

// Uppdaterar användare
async function updateUser(id, user) {
  try {
    const existingUser = await db.user.findOne({ where: { id } });
    if (!existingUser) {
      return createResponseError(404, "Hittade ingen användare att uppdatera.");
    }
    await db.user.update(user, { where: { id } });
    return createResponseMessage(200, "Användaren har uppdaterats.");
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

// Uppdaterar recension
async function updateReview(id, review) {
  try {
    const existingProduct = await db.review.findOne({ where: { id } });
    if (!existingProduct) {
      return createResponseError(404, "Hittade ingen recension att uppdatera.");
    }
    await db.review.update(review, { where: { id } });
    return createResponseMessage(200, "Recensionen har uppdaterats.");
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

// Uppdaterar kundvagn
async function updateCart(id, cart) {
  try {
    const existingCart = await db.cart.findOne({ where: { id } });
    if (!existingCart) {
      return createResponseError(404, "Hittade ingen kundvagn att uppdatera.");
    }
    await _addProductToCart(existingCart, cart.products);
    await db.cart.update(cart, { where: { id } });
    return createResponseMessage(200, "Kundvagnen har uppdaterats.");
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

// Tar bort produkt
async function destroyProduct(id) {
  if (!id) return createResponseError(422, "Id måste anges.");
  
  try {
    await db.product.destroy({ where: { id } });
    return createResponseMessage(200, "Produkten har tagits bort.");
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

// Tar bort användare
async function destroyUser(id) {
  if (!id) return createResponseError(422, "Id måste anges.");
  
  try {
    await db.user.destroy({ where: { id } });
    return createResponseMessage(200, "Användaren har tagits bort.");
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

// Tar bort recension
async function destroyReview(id) {
  if (!id) return createResponseError(422, "Id måste anges.");
  
  try {
    await db.review.destroy({ where: { id } });
    return createResponseMessage(200, "Recensionen har tagits bort.");
  } catch (error) {
    return createResponseError(error.status, error.message);
  }
}

// Formaterar produkt för frontend
function _formatProduct(product) {
  const cleanProduct = {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    productImg: product.productImg,
    units: product.units,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
  
  if (product.reviews) {
    cleanProduct.reviews = [];
    cleanProduct.averageRating = 0;
    let totalRating = 0;
    
    product.reviews.forEach(review => {
      cleanProduct.reviews.push({
        id: review.id,
        rating: review.rating,
        summary: review.summary,
        userId: review.userId,
        createdAt: review.createdAt,
      });
      totalRating += review.rating;
    });
    
    if (product.reviews.length > 0) {
      cleanProduct.averageRating = totalRating / product.reviews.length;
    }
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
    }, 
    products: cart.products,
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
  const foundOrCreatedProduct = await db.product.findOrCreate({ where: { id } });
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
  getAverageRating,
};
