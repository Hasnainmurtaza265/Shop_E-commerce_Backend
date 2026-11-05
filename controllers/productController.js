const Product = require("../models/Product");

exports.getProducts = async (req, res, next) => {
  try {
    const { search, category, sort, minPrice, maxPrice, featured, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (category && category.toLowerCase() !== "all") filter.category = new RegExp(`^${category}$`, "i");
    if (search) filter.$text = { $search: search };
    if (featured === "true") filter.isFeatured = true;
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }
    const sorts = { newest: { createdAt: -1 }, price_asc: { price: 1 }, price_desc: { price: -1 }, rating: { rating: -1 }, name: { name: 1 } };
    const p = Math.max(1, Number(page) || 1);
    const l = Math.min(100, Math.max(1, Number(limit) || 50));
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sorts[sort] || { legacyId: 1 }).skip((p - 1) * l).limit(l),
      Product.countDocuments(filter)
    ]);
    res.json({ success: true, count: products.length, total, page: p, pages: Math.ceil(total / l), products });
  } catch (error) { next(error); }
};
exports.getProduct = async (req, res, next) => {
  try {
    const isNumeric = /^\d+$/.test(req.params.id);
    const product = await Product.findOne(isNumeric ? { legacyId: Number(req.params.id) } : { _id: req.params.id });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (error) { next(error); }
};
exports.createProduct = async (req, res, next) => {
  try { const product = await Product.create(req.body); res.status(201).json({ success: true, product }); }
  catch (error) { next(error); }
};
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (error) { next(error); }
};
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, message: "Product deleted" });
  } catch (error) { next(error); }
};
