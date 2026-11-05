const Product = require("../models/Product");
exports.getCategories = async (_req, res, next) => {
  try { res.json({ success: true, categories: await Product.distinct("category") }); }
  catch (error) { next(error); }
};
