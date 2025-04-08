// backend/routes/ratingsRoutes.js
const express = require('express');
const router = express.Router();
const { Rating } = require('../models');

// Hämta alla betyg för en viss produkt
router.get('/', async (req, res) => {
  const { productId } = req.query;
  try {
    const ratings = await Rating.findAll({ where: { productId } });
    res.json(ratings);
  } catch (err) {
    console.error('Kunde inte hämta betyg:', err);
    res.status(500).json({ error: 'Kunde inte hämta betyg' });
  }
});

// GET /ratings?productId=3 - hämta alla betyg för en produkt
router.get("/", async (req, res) => {
    const { productId } = req.query;
    try {
      const ratings = await Rating.findAll({ where: { productId } });
      res.json(ratings);
    } catch (err) {
      console.error("Kunde inte hämta betyg", err);
      res.status(500).json({ error: "Kunde inte hämta betyg" });
    }
  });
  
module.exports = router;
