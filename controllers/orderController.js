const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");

exports.checkout = async (req, res, next) => {
  try {
    const { shippingAddress, deliveryFee = 15 } = req.body;
    if (!shippingAddress || ["fullName", "phone", "address", "city"].some(k => !shippingAddress[k])) {
      return res.status(400).json({ success: false, message: "Full name, phone, address and city are required" });
    }
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart?.items.length) return res.status(400).json({ success: false, message: "Cart is empty" });
    let subtotal = 0;
    const items = [];
    for (const entry of cart.items) {
      const p = entry.product;
      if (!p || p.stock < entry.quantity) return res.status(400).json({ success: false, message: `${p?.name || "Product"} is out of stock` });
      subtotal += p.price * entry.quantity;
      items.push({ product: p._id, legacyId: p.legacyId, name: p.name, image: p.image, price: p.price, quantity: entry.quantity, size: entry.size, color: entry.color });
    }
    // Matches the current Shop.Co cart UI: 20% discount and $15 delivery.
    const discountAmount = Math.round(subtotal * 0.20);
    const fee = Math.max(0, Number(deliveryFee));
    const order = await Order.create({
      user: req.user._id, items, shippingAddress, subtotal, discountAmount,
      deliveryFee: fee, total: subtotal - discountAmount + fee
    });
    for (const entry of cart.items) await Product.findByIdAndUpdate(entry.product._id, { $inc: { stock: -entry.quantity } });
    cart.items = []; await cart.save();
    res.status(201).json({ success: true, message: "Order placed successfully", order });
  } catch (error) { next(error); }
};
exports.getMyOrders = async (req, res, next) => {
  try { res.json({ success: true, orders: await Order.find({ user: req.user._id }).sort({ createdAt: -1 }) }); }
  catch (error) { next(error); }
};
exports.getAllOrders = async (_req, res, next) => {
  try { res.json({ success: true, orders: await Order.find().populate("user", "name email").sort({ createdAt: -1 }) }); }
  catch (error) { next(error); }
};
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const allowed = ["processing", "shipped", "delivered", "cancelled"];
    if (!allowed.includes(req.body.status)) return res.status(400).json({ success: false, message: "Invalid status" });
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order });
  } catch (error) { next(error); }
};
