const router = require("express").Router();
const authService = require("../services/authService");
const { requireAdmin } = require("../middleware/authMiddleware");

router.post("/login", (req, res) => {
  const credentials = req.body;
  authService.login(credentials).then((result) => {
    res.status(result.status).json(result.data);
  });
});

// Add registration endpoint
router.post("/register", (req, res) => {
  const userData = req.body;
  authService.register(userData).then((result) => {
    res.status(result.status).json(result.data);
  });
});

// Add reset database endpoint (admin only)
router.post("/resetDatabase", requireAdmin, (req, res) => {
  authService.resetDatabase().then((result) => {
    res.status(result.status).json(result.data);
  });
});

module.exports = router;
