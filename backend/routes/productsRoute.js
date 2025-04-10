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
      include: [{ 
        model: db.review,
        include: [{ 
          model: db.user,
          attributes: ['id', 'f_name', 'l_name'] // Only include needed user fields
        }]
      }]
    });
    
    if (!product) {
      return res.status(404).json({ error: "Produkt hittades inte" });
    }
    
    const productObj = product.toJSON();
    
    // Process reviews to include user details
    if (productObj.reviews && productObj.reviews.length > 0) {
      const totalRating = productObj.reviews.reduce((sum, review) => sum + review.rating, 0);
      productObj.averageRating = totalRating / productObj.reviews.length;
      
      // Add user details to each review
      productObj.reviews = productObj.reviews.map(review => {
        if (review.user) {
          review.userDetails = {
            id: review.user.id,
            f_name: review.user.f_name,
            l_name: review.user.l_name
          };
          delete review.user; // Remove the nested user object
        }
        return review;
      });
    } else {
      productObj.averageRating = 0;
    }
    
    return res.status(200).json(productObj);
  } catch (error) {
    console.error("Error fetching product:", error);
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
router.post("/:id/createReview", requireAuth, async (req, res) => {
  try {
    const prodId = req.params.id;
    const review = req.body;
    
    // Ensure the review has the correct user ID from the authenticated user
    review.userId = req.user.id;
    
    console.log(`Creating review for product ${prodId} by user ${req.user.id}:`, review);
    
    const savedReview = await db.review.create(review);
    
    // Return the product with the new review
    const product = await db.product.findByPk(prodId, {
      include: [{
        model: db.review,
        include: [{ 
          model: db.user,
          attributes: ['id', 'f_name', 'l_name'] 
        }]
      }]
    });
    
    if (!product) {
      return res.status(404).json({ error: "Produkt hittades inte" });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Kunde inte skapa recension: " + error.message });
  }
});

// Uppdatera produkt (endast admin)
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const product = req.body;
    
    console.log(`Uppdaterar produkt ${id}:`, product);
    
    const existingProduct = await db.product.findByPk(id);
    
    if (!existingProduct) {
      console.log(`Produkt ${id} hittades inte`);
      return res.status(404).json({ error: "Produkt hittades inte" });
    }
    
    // Använd await för att säkerställa att uppdateringen slutförs
    const [updated] = await db.product.update(product, {
      where: { id: id }
    });
    
    if (updated) {
      console.log(`Produkt ${id} uppdaterad, hämtar den uppdaterade produkten`);
      const updatedProduct = await db.product.findByPk(id);
      console.log(`Uppdaterad produkt:`, updatedProduct.toJSON());
      return res.status(200).json(updatedProduct);
    } else {
      console.log(`Ingen produkt uppdaterades`);
      return res.status(404).json({ error: "Uppdateringen misslyckades" });
    }
  } catch (error) {
    console.error("Fel vid uppdatering av produkt:", error);
    res.status(500).json({ error: "Kunde inte uppdatera produkt: " + error.message });
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
