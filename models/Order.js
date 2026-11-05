const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    product: mongoose.Schema.Types.ObjectId,
    legacyId: Number,
    name: String,
    image: String,
    price: Number,
    quantity: Number,
    size: String,
    color: String
  }],
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, default: "" },
    country: { type: String, default: "Pakistan" }
  },
  subtotal: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 15 },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["cash_on_delivery"], default: "cash_on_delivery" },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  status: { type: String, enum: ["placed", "processing", "shipped", "delivered", "cancelled"], default: "placed" }
}, { timestamps: true });
module.exports = mongoose.model("Order", orderSchema);
