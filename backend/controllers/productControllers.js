const Product = require("../models/Product");

exports.getProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;

    // Convert to numbers
    page = parseInt(page);
    limit = parseInt(limit);

    // Search filter
    const query = search ? { name: { $regex: search, $options: "i" } } : {};

    // Count total products (for pagination)
    const total = await Product.countDocuments(query);

    // Fetch paginated products
    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      data: products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};


exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, category, stock,imageUrl } = req.body;

    // Basic validation
    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    // Create new product
    const product = await Product.create({
      name,
      price,
      description,
      category,
      stock,
      imageUrl
    });

    res.status(201).json({
      message: "Product created successfully",
      data: product
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product" });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and update
    const product = await Product.findByIdAndUpdate(
      id,
      { $set: req.body }, 
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      data: product
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product deleted successfully",
      data: product
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

