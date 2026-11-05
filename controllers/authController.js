const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const tokenFor = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
const publicUser = user => ({ id: user._id, name: user.name, email: user.email, role: user.role });

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) return res.status(409).json({ success: false, message: "Email already registered" });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) });
    res.status(201).json({ success: true, token: tokenFor(user._id), user: publicUser(user) });
  } catch (error) { next(error); }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ success: false, message: "Invalid email or password" });
    res.json({ success: true, token: tokenFor(user._id), user: publicUser(user) });
  } catch (error) { next(error); }
};
exports.me = (req, res) => res.json({ success: true, user: publicUser(req.user) });
