const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product", "name price stock"); 

    if (!cart) {
      return res.json({
        message: "Cart is empty",
        data: { items: [] }
      });
    }

    res.json({
      message: "Cart fetched successfully",
      data: cart
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};


exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Basic validation
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Valid productId and quantity are required" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Get user's cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(item => item.product.toString() === productId);

    if (existingItem) {
      // New total quantity
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} items available in stock`
        });
      }

      existingItem.quantity = newQuantity;
    } else {
      if (quantity > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} items available in stock`
        });
      }

      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    // Populate product details for response
    const populatedCart = await cart.populate("items.product", "name price stock");

    res.status(200).json({
      message: "Item added to cart successfully",
      data: populatedCart
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
};



exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemExists = cart.items.some(item => item.product.toString() === productId);
    if (!itemExists) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Remove product from cart
    cart.items = cart.items.filter(item => item.product.toString() !== productId);

    await cart.save();

    // Populate product details for better response
    const populatedCart = await cart.populate("items.product", "name price stock");

    res.json({
      message: "Product removed from cart successfully",
      data: populatedCart
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Failed to remove product from cart" });
  }
};

exports.reduceCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Reduce quantity by 1
    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
    } else {
      // If quantity is 1, remove item completely
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();
    res.json(cart);

  } catch (error) {
    console.error("Error reducing cart item:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

