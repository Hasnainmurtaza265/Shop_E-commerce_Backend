
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""));

// CORS Configuration
app.use(
  cors({
    origin(origin, callback) {
      const normalizedOrigin = origin?.replace(/\/$/, "");

      if (
        !origin ||
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(normalizedOrigin)
      ) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked origin: ${origin}`)
      );
    },
    credentials: true,
  })
);

// Middlewares
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Static Images
app.use(
  "/images",
  express.static(path.join(__dirname, "public", "images"))
);

// Database Connection
let dbConnection;

const connectDatabase = () => {
  if (!dbConnection) {
    dbConnection = connectDB().catch((error) => {
      dbConnection = null;
      console.error("DB connection failed:", error.message);
      throw error;
    });
  }

  return dbConnection;
};

// Routes
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Shop.Co API is running",
    endpoints: [
      "/api/auth",
      "/api/products",
      "/api/categories",
      "/api/cart",
      "/api/wishlist",
      "/api/orders",
    ],
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    status: "OK",
  });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Error Handler
app.use(errorHandler);

// Local Development
const PORT = process.env.PORT || 4000;

if (require.main === module) {
  connectDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Shop.Co backend running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Server startup failed:", error.message);
      process.exit(1);
    });
}

// Vercel Serverless
app.use((req, res, next) => {
  connectDatabase().then(() => next()).catch(next);
});

module.exports = app;
