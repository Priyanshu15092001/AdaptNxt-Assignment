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
    const { productId } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if product already exists in the cart
    const existingItem = cart.items.find(item => item.product.toString() === productId);

    if (existingItem) {
      return res.status(400).json({ message: "Item already exists in cart" });
    }

    // Add new item with quantity = 1
    cart.items.push({ product: productId, quantity: 1 });

    await cart.save();
    res.status(201).json(cart);

  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error" });
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

exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { action } = req.body; // "increase" or "decrease"

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find product to check stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find item in the cart
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (action === "increase") {
      // Check stock before increasing
      if (cart.items[itemIndex].quantity < product.stock) {
        cart.items[itemIndex].quantity += 1;
      } else {
        return res.status(400).json({ message: "Cannot add more, product out of stock" });
      }
    } 
    
    else if (action === "decrease") {
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      } else {
        // If quantity is 1, remove item from cart
        cart.items.splice(itemIndex, 1);
      }
    } 
    
    else {
      return res.status(400).json({ message: "Invalid action. Use 'increase' or 'decrease'" });
    }

    await cart.save();
    res.json(cart);

  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


