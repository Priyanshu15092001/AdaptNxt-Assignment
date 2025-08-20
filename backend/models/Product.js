const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  stock: Number,
  imageUrl: String
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
