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

// Hämta alla produkter
router.get("/", async (req, res) => {
  try {
    if (db.product) {
      const products = await db.product.findAll({
        include: [{ model: db.review }]
      });
      
      const productsWithRatings = products.map(product => {
        const productObj = product.toJSON();
        if (productObj.reviews && productObj.reviews.length > 0) {
          const totalRating = productObj.reviews.reduce((sum, review) => sum + Number(review.rating), 0);
          productObj.averageRating = parseFloat((totalRating / productObj.reviews.length).toFixed(1));
        } else {
          productObj.averageRating = 0;
        }
        return productObj;
      });
      
      return res.status(200).json(productsWithRatings);
    }
    
    const [products] = await db.sequelize.query(`
      SELECT * FROM products
    `);
    
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Kunde inte hämta produkter" });
  }
});

// Hämta produkt med ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await db.product.findByPk(id, {
      include: [{ model: db.review }]
    });
    
    if (!product) {
      return res.status(404).json({ error: "Produkt hittades inte" });
    }
    
    const productObj = product.toJSON();
    
    if (productObj.reviews && productObj.reviews.length > 0) {
      const totalRating = productObj.reviews.reduce((sum, review) => sum + review.rating, 0);
      productObj.averageRating = totalRating / productObj.reviews.length;
    } else {
      productObj.averageRating = 0;
    }
    
    return res.status(200).json(productObj);
  } catch (error) {
    res.status(500).json({ error: "Kunde inte hämta produkt" });
  }
});

// Skapa ny produkt (endast admin)
router.post("/", (req, res) => {
  try {
    const product = req.body;
    
    if (!product.title || !product.description || product.price === undefined) {
      return res.status(400).json({ 
        error: "Ogiltig produktdata. Titel, beskrivning och pris krävs." 
      });
    }
    
    db.product.create(product)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch(err => {
        res.status(500).json({ error: "Kunde inte skapa produkt: " + err.message });
      });
  } catch (error) {
    res.status(500).json({ error: "Serverfel" });
  }
});

// Lägg till produkt i kundvagn
router.post("/:id/addToCart", requireAuth, (req, res) => {
  const product = req.body;
  db.product.create(product).then((result) => {
    res.send(result);
  });
});

// Skapa recension för produkt
router.post("/:id/createReview", requireAuth, (req, res) => {
  const prodId = req.params.id;
  const review = req.body;
  review.userId = req.user.id;
  
  productServices.addReview(prodId, review).then((result) => {
    res.send(result);
  });
});

// Uppdatera produkt (endast admin)
router.put("/:id", requireAdmin, (req, res) => {
  try {
    const id = req.params.id;
    const product = req.body;
    
    db.product.update(product, {
      where: { id: id }
    })
    .then(([updated]) => {
      if (updated) {
        return db.product.findByPk(id);
      } else {
        throw new Error("Produkt hittades inte");
      }
    })
    .then(updatedProduct => {
      res.status(200).json(updatedProduct);
    })
    .catch(err => {
      res.status(500).json({ error: "Kunde inte uppdatera produkt: " + err.message });
    });
  } catch (error) {
    res.status(500).json({ error: "Serverfel" });
  }
});

// Ta bort produkt (endast admin)
router.delete("/:id", requireAdmin, (req, res) => {
  try {
    const id = req.params.id;
    
    db.product.destroy({
      where: { id: id }
    })
    .then((deleted) => {
      if (deleted) {
        res.status(200).json({ message: "Produkt borttagen" });
      } else {
        throw new Error("Produkt hittades inte");
      }
    })
    .catch(err => {
      res.status(500).json({ error: "Kunde inte ta bort produkt: " + err.message });
    });
  } catch (error) {
    res.status(500).json({ error: "Serverfel" });
  }
});

module.exports = router;
