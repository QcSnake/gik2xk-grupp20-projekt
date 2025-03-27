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

// Public routes - anyone can access
router.get("/", (req, res) => {
  productServices.getAllProducts().then((result) => {
    res.status(result.status).json(result.data);
  });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  productServices.getProductById(id).then((result) => {
    res.status(result.status).json(result.data);
  });
});

// Protected routes - only admin can create/update/delete products
router.post("/", requireAdmin, (req, res) => {
  const product = req.body;
  const invalidData = validate(product, constraints);
  if (invalidData) {
    res.status(400).json(invalidData);
  } else {
    db.product.create(product).then((result) => {
      res.send(result);
    });
  }
});

router.post("/:id/addToCart", requireAuth, (req, res) => {
  const product = req.body;
  db.product.create(product).then((result) => {
    res.send(result);
  });
});

router.post("/:id/createReview", requireAuth, (req, res) => {
  const prodId = req.params.id;
  const review = req.body;
  // Ensure the review is linked to the current user
  review.userId = req.user.id;
  
  productServices.addReview(prodId, review).then((result) => {
    res.send(result);
  });
});

router.put("/:id", requireAdmin, (req, res)=>{
  const id = req.params.id;
  const product = req.body;
  productServices.updateProduct(id, product).then((result) => {
    res.status(result.status).json(result.data);
  });
});

router.delete("/:id", requireAdmin, (req, res)=>{
  const id = req.params.id;
  productServices.destroyProduct(id).then((result) => {
    res.status(result.status).json(result.data);
  });
});

module.exports = router;
