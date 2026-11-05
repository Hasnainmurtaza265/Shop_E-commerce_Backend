module.exports = (err, _req, res, _next) => {
  console.error(err);
  if (err.code === 11000) return res.status(409).json({ success: false, message: "Duplicate value already exists" });
  if (err.name === "ValidationError") return res.status(400).json({ success: false, message: err.message });
  if (err.name === "CastError") return res.status(400).json({ success: false, message: "Invalid ID" });
  res.status(err.statusCode || 500).json({ success: false, message: err.message || "Internal server error" });
};
