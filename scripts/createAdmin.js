require("dotenv").config();

const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("Admin environment variables are missing");
    }

    if (ADMIN_PASSWORD.length < 12) {
      throw new Error("Admin password must be at least 12 characters");
    }

    await connectDB();

    const email = ADMIN_EMAIL.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.name = ADMIN_NAME;
      existingUser.password = hashedPassword;
      existingUser.role = "admin";

      await existingUser.save();

      console.log("Existing account updated to admin successfully!");
    } else {
      await User.create({
        name: ADMIN_NAME,
        email,
        password: hashedPassword,
        role: "admin"
      });

      console.log("Admin account created successfully!");
    }

    console.log("Admin email:", email);

    process.exit(0);
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exit(1);
  }
};

createAdmin();
