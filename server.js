require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",").map(origin => origin.trim());

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true
}));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static("public/images"));
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

app.get("/", (_req, res) => res.json({
  success: true,
  message: "Shop.Co API is running",
  endpoints: ["/api/auth", "/api/products", "/api/categories", "/api/cart", "/api/wishlist", "/api/orders"]
}));
app.get("/api/health", (_req, res) => res.json({ success: true, status: "OK" }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

app.use((req, res) => res.status(404).json({
  success: false, message: `Route not found: ${req.method} ${req.originalUrl}`
}));
app.use(errorHandler);

// const PORT = process.env.PORT || 4000;
// connectDB().then(() => {
//   app.listen(PORT, () => console.log(`Shop.Co backend running: http://localhost:${PORT}`));
// }).catch(error => {
//   console.error("Server startup failed:", error.message);
//   process.exit(1);
// });
const PORT = process.env.PORT || 4000;

// Vercel ke liye DB sirf connect karo, listen mat karo
connectDB().catch((error) => {
  console.error("DB connection failed:", error.message);
});

// Local pe chalane ke liye listen, Vercel pe nahi
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Shop.Co backend running on ${PORT}`));
  }).catch((error) => {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  });
}

module.exports = app;