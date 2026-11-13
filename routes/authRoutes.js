
const router = require("express").Router();
const { body } = require("express-validator");

const {
    register,
    login,
    adminLogin,
    me
} = require("../controllers/authController");

const { protect } = require("../middleware/auth");

router.post(
    "/register",
    [
        body("name").trim().notEmpty(),
        body("email").isEmail(),
        body("password").isLength({ min: 8 })
    ],
    register
);

router.post("/login", login);

router.post("/admin/login", adminLogin);

router.get("/me", protect, me);

module.exports = router;
