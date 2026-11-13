
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// GET /api/admin/stats
exports.getAdminStats = async (req, res) => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      totalStock,
      featuredProducts,
      orderStatuses,
      revenueResult,
      recentOrders
    ] = await Promise.all([
      Product.countDocuments(),

      Order.countDocuments(),

      User.countDocuments({ role: "customer" }),

      Product.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$stock" }
          }
        }
      ]),

      Product.countDocuments({ isFeatured: true }),

      Order.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]),

      Order.aggregate([
        {
          $match: {
            status: { $ne: "cancelled" }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" }
          }
        }
      ]),

      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "name email")
        .lean()
    ]);

    const statusCounts = {
      placed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };

    orderStatuses.forEach((item) => {
      statusCounts[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue: revenueResult[0]?.total || 0,
        totalStock: totalStock[0]?.total || 0,
        featuredProducts,
        ...statusCounts
      },
      recentOrders
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch admin statistics"
    });
  }
};

// GET /api/admin/customers
exports.getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" })
      .select("name email role createdAt")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      totalCustomers: customers.length,
      customers
    });
  } catch (error) {
    console.error("Get Customers Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch customers"
    });
  }
};
