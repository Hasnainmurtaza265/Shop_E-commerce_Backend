const router = require("express").Router();
const { protect } = require("../middleware/auth");
const c = require("../controllers/wishlistController");
router.use(protect);
router.get("/", c.getWishlist);
router.post("/:productId", c.toggleWishlist);
module.exports = router;
