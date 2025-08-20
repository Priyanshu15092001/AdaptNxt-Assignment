const express = require("express");
const { getProducts, createProduct, updateProduct, deleteProduct } = require("../controllers/productControllers");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

const router = express.Router();

router.get("/", getProducts);
router.post("/", auth, role(["admin"]), createProduct);
router.put("/:id", auth, role(["admin"]), updateProduct);
router.delete("/:id", auth, role(["admin"]), deleteProduct);

module.exports = router;
