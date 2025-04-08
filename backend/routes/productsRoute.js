const router = require("express").Router();
const db = require("../models");
const productServices = require('../services/productServices');
const validate = require("validate.js");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

const constraints = {
  productImg: {
    url: {
      message: '^Sökvägen är felaktig.'
    }
  }
};

// GET /products - Get all products (no authentication required)
router.get("/", async (req, res) => {
  try {
    console.log("GET /products route hit");
    
    // Check if product model is available
    if (db.product) {
      const products = await db.product.findAll({
        include: [{ model: db.review }]
      });
      
      // Calculate average ratings for each product
      const productsWithRatings = products.map(product => {
        const productObj = product.toJSON();
        if (productObj.reviews && productObj.reviews.length > 0) {
          // Ensure we're dealing with numbers when calculating averages
          const totalRating = productObj.reviews.reduce((sum, review) => sum + Number(review.rating), 0);
          productObj.averageRating = parseFloat((totalRating / productObj.reviews.length).toFixed(1));
          console.log(`Product ${productObj.id} has average rating: ${productObj.averageRating} from ${productObj.reviews.length} reviews`);
        } else {
          productObj.averageRating = 0;
        }
        return productObj;
      });
      
      console.log(`Found ${products.length} products using model`);
      return res.status(200).json(productsWithRatings);
    }
    
    // Fallback to raw SQL if model isn't available
    console.log("Product model not available, using raw SQL");
    const [products] = await db.sequelize.query(`
      SELECT * FROM products
    `);
    
    console.log(`Found ${products.length} products using raw SQL`);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET /products/:id - Get product by ID (no authentication required)
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await db.product.findByPk(id, {
      include: [{ model: db.review }]
    });
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    const productObj = product.toJSON();
    
    // Calculate average rating
    if (productObj.reviews && productObj.reviews.length > 0) {
      const totalRating = productObj.reviews.reduce((sum, review) => sum + review.rating, 0);
      productObj.averageRating = totalRating / productObj.reviews.length;
    } else {
      productObj.averageRating = 0;
    }
    
    return res.status(200).json(productObj);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// POST /products - Create new product (admin only)
router.post("/", (req, res) => {
  try {
    const product = req.body;
    console.log("Received product creation request:", product);
    
    // Basic validation
    if (!product.title || !product.description || product.price === undefined) {
      return res.status(400).json({ 
        error: "Invalid product data. Title, description, and price are required." 
      });
    }
    
    // Create the product
    db.product.create(product)
      .then((result) => {
        console.log("Product created successfully:", result.id);
        res.status(200).json(result);
      })
      .catch(err => {
        console.error("Error creating product:", err);
        res.status(500).json({ error: "Failed to create product: " + err.message });
      });
  } catch (error) {
    console.error("Error in product creation route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /products/:id/addToCart - Add product to cart (authenticated users only)
router.post("/:id/addToCart", requireAuth, (req, res) => {
  const product = req.body;
  db.product.create(product).then((result) => {
    res.send(result);
  });
});

// POST /products/:id/createReview - Create review for a product (authenticated users only)
router.post("/:id/createReview", requireAuth, (req, res) => {
  const prodId = req.params.id;
  const review = req.body;
  // Ensure the review is linked to the current user
  review.userId = req.user.id;
  
  productServices.addReview(prodId, review).then((result) => {
    res.send(result);
  });
});

// PUT /products/:id - Update product by ID (admin only)
router.put("/:id", requireAdmin, (req, res) => {
  try {
    const id = req.params.id;
    const product = req.body;
    console.log(`Updating product ${id}:`, product);
    
    db.product.update(product, {
      where: { id: id }
    })
    .then(([updated]) => {
      if (updated) {
        console.log(`Product ${id} updated successfully`);
        return db.product.findByPk(id);
      } else {
        throw new Error("Product not found");
      }
    })
    .then(updatedProduct => {
      res.status(200).json(updatedProduct);
    })
    .catch(err => {
      console.error("Error updating product:", err);
      res.status(500).json({ error: "Failed to update product: " + err.message });
    });
  } catch (error) {
    console.error("Error in product update route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /products/:id - Delete product by ID (admin only)
router.delete("/:id", requireAdmin, (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Deleting product ${id}`);
    
    db.product.destroy({
      where: { id: id }
    })
    .then((deleted) => {
      if (deleted) {
        console.log(`Product ${id} deleted successfully`);
        res.status(200).json({ message: "Product deleted successfully" });
      } else {
        throw new Error("Product not found");
      }
    })
    .catch(err => {
      console.error("Error deleting product:", err);
      res.status(500).json({ error: "Failed to delete product: " + err.message });
    });
  } catch (error) {
    console.error("Error in product delete route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
