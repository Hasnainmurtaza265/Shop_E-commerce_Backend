const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  legacyId: { type: Number, unique: true, sparse: true },
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  oldPrice: { type: Number, default: null, min: 0 },
  discount: { type: String, default: "" },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  image: { type: String, required: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  sizes: [{ type: String }],
  colors: [{ type: String }],
  stock: { type: Number, min: 0, default: 0 },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });
productSchema.index({ name: "text", description: "text", category: "text" });
module.exports = mongoose.model("Product", productSchema);
