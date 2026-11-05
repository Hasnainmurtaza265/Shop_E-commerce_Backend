const Product = require("../models/Product");
exports.getWishlist = async (req, res, next) => {
  try { await req.user.populate("wishlist"); res.json({ success: true, wishlist: req.user.wishlist }); }
  catch (error) { next(error); }
};
exports.toggleWishlist = async (req, res, next) => {
  try {
    const product = await Product.findOne(/^\d+$/.test(req.params.productId) ? { legacyId: Number(req.params.productId) } : { _id: req.params.productId });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    const exists = req.user.wishlist.some(id => id.toString() === product._id.toString());
    if (exists) req.user.wishlist.pull(product._id); else req.user.wishlist.push(product._id);
    await req.user.save();
    res.json({ success: true, message: exists ? "Removed from wishlist" : "Added to wishlist" });
  } catch (error) { next(error); }
};
