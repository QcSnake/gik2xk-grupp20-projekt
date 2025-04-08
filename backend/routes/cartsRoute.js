const router = require("express").Router();
const db = require("../models");
const productServices = require('../services/productServices');
const { requireAuth } = require("../middleware/authMiddleware");

// All cart routes require authentication
router.use(requireAuth);

// Get a specific cart by ID
router.get("/:id", (req, res) => {
  const id = req.params.id;
  // Verify the user owns this cart or is admin
  productServices.getById(id).then((result) => {
    if (result.data && (result.data.user.id === req.user.id || req.user.role === 'admin')) {
      res.status(result.status).json(result.data);
    } else {
      res.status(403).json({ error: "Not authorized to access this cart" });
    }
  });
});

// Get current user's cart
router.get("/user/current", (req, res) => {
  const userId = req.user.id;
  productServices.getByUser(userId).then((result) => {
    res.status(result.status).json(result.data);
  });
});

// Create a new cart
router.post('/', (req, res) => {
  const cart = req.body;
  // Ensure the cart belongs to the current user
  cart.userId = req.user.id;
  
  productServices.create(cart).then((result) => {
    res.status(result.status).json(result.data);
  });
});

// Update a cart (simple update)
router.put("/", (req, res) => {
  const cart = req.body;
  const id = cart.id;
  
  // Verify the user owns this cart or is admin
  db.cart.findOne({ where: { id } }).then(existingCart => {
    if (!existingCart || (existingCart.userId !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({ error: "Not authorized to update this cart" });
    }
    
    db.cart.update(cart, {
      where: { id: cart.id },
    }).then((result) => {
      res.status(200).json(result);
    });
  });
});

// Comprehensive cart update
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const cart = req.body;
  
  // Verify the user owns this cart or is admin
  db.cart.findOne({ where: { id } }).then(existingCart => {
    if (!existingCart || (existingCart.userId !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({ error: "Not authorized to update this cart" });
    }
    
    productServices.updateCart(id, cart).then((result) => {
      res.json(result.data);
    });
  });
});

// Delete a cart
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  
  // Verify the user owns this cart or is admin
  db.cart.findOne({ where: { id } }).then(existingCart => {
    if (!existingCart || (existingCart.userId !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({ error: "Not authorized to delete this cart" });
    }
    
    db.cart.destroy({ where: { id } }).then((result) => {
      res.json(`Cart deleted successfully`);
    });
  });
});

module.exports = router;
