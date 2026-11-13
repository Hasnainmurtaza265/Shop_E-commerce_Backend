
const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/auth");

const {
  getAdminStats,
  getCustomers
} = require("../controllers/adminController");

// Admin authentication
router.use(protect, adminOnly);

// Admin routes
router.get("/stats", getAdminStats);
router.get("/customers", getCustomers);

module.exports = router;
