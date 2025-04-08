const router = require("express").Router();
const db = require("../models");
const productServices = require('../services/productServices');
const { requireAuth } = require("../middleware/authMiddleware");

router.use(requireAuth);

// Hämta kundvagn med ID
router.get("/:id", (req, res) => {
  const id = req.params.id;
  productServices.getById(id).then((result) => {
    if (result.data && (result.data.user.id === req.user.id || req.user.role === 'admin')) {
      res.status(result.status).json(result.data);
    } else {
      res.status(403).json({ error: "Ej behörig" });
    }
  });
});

router.get("/user/current", (req, res) => {
  const userId = req.user.id;
  productServices.getByUser(userId).then((result) => {
    res.status(result.status).json(result.data);
  });
});

// Skapa kundvagn
router.post('/', (req, res) => {
  const cart = req.body;
  cart.userId = req.user.id;
  
  productServices.create(cart).then((result) => {
    res.status(result.status).json(result.data);
  });
});

// Enkel uppdatering
router.put("/", (req, res) => {
  const cart = req.body;
  const id = cart.id;
  
  db.cart.findOne({ where: { id } }).then(existingCart => {
    if (!existingCart || (existingCart.userId !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({ error: "Ej behörig" });
    }
    
    db.cart.update(cart, {
      where: { id: cart.id },
    }).then((result) => {
      res.status(200).json(result);
    });
  });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const cart = req.body;
  
  db.cart.findOne({ where: { id } }).then(existingCart => {
    if (!existingCart || (existingCart.userId !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({ error: "Ej behörig" });
    }
    
    productServices.updateCart(id, cart).then((result) => {
      res.json(result.data);
    });
  });
});

// Ta bort kundvagn
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  
  db.cart.findOne({ where: { id } }).then(existingCart => {
    if (!existingCart || (existingCart.userId !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({ error: "Ej behörig" });
    }
    
    db.cart.destroy({ where: { id } }).then((result) => {
      res.json(`Kundvagn borttagen`);
    });
  });
});

module.exports = router;
