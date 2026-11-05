const router = require("express").Router();
const { protect, adminOnly } = require("../middleware/auth");
const c = require("../controllers/orderController");
router.use(protect);
router.post("/checkout", c.checkout);
router.get("/my", c.getMyOrders);
router.get("/", adminOnly, c.getAllOrders);
router.patch("/:id/status", adminOnly, c.updateOrderStatus);
module.exports = router;
