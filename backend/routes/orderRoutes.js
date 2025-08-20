const express = require("express");
const { createOrder,getAllOrders } = require("../controllers/orderControllers");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/", auth, createOrder);
router.get("/", auth, getAllOrders);

module.exports = router;
