const mongoose = require("mongoose");
module.exports = async function connectDB() {
  if (!process.env.MONGO_URL) throw new Error("MONGO_URL is missing in .env");
  await mongoose.connect(process.env.MONGO_URL);
  console.log("MongoDB connected successfully");
};
