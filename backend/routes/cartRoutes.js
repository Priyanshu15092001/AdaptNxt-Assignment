const express = require("express");
const { getCart, addToCart, removeFromCart,updateCartItem } = require("../controllers/cartControllers");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth, getCart);
router.post("/", auth, addToCart);
router.delete("/:productId", auth, removeFromCart);
router.patch("/:productId", auth, updateCartItem);

module.exports = router;
