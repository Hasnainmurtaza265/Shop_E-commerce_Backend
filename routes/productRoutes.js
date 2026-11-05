const router = require("express").Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/auth");
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);
module.exports = router;
