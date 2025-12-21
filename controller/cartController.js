const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (req, res) => {
  try {
    console.log('GET /cart - User ID:', req.userData.id);
    const cart = await Cart.findOne({ user: req.userData.id })
      .populate("products.product");
    
    if (!cart) {
      console.log('No cart found for user');
      return res.status(200).json({ message: "Cart not found", cart: { products: [] } });
    }
    
    console.log('Cart found:', cart);
    res.status(200).json({ cart });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    console.log('=== ADD TO CART DEBUG ===');
    console.log('POST /cart - Request body:', req.body);
    console.log('POST /cart - User ID:', req.userData?.id);
    console.log('POST /cart - Headers:', req.headers.authorization);
    
    const { productId, quantity } = req.body;
    
    if (!req.userData || !req.userData.id) {
      console.log('ERROR: No user data found');
      return res.status(401).json({ error: "User not authenticated" });
    }
    
    if (!productId) {
      console.log('ERROR: No product ID provided');
      return res.status(400).json({ error: "Product ID is required" });
    }
    
    console.log('Looking for product with ID:', productId);
    const product = await Product.findById(productId);
    if(!product) {
      console.log('ERROR: Product not found:', productId);
      return res.status(404).json({ error: "Product not found" });
    }
    
    console.log('Product found:', product.name);
    console.log('Looking for existing cart for user:', req.userData.id);
    
    let cart = await Cart.findOne({ user: req.userData.id });

    if(!cart) {
      console.log('Creating new cart for user');
      cart = await Cart.create({ 
        user: req.userData.id, 
        products: [{ product: productId, quantity: quantity || 1 }] 
      });
      console.log('New cart created:', cart._id);
      return res.status(200).json({ message: "Cart created", cart });
    }
    
    console.log('Existing cart found:', cart._id);
    // Check if product already exists in cart
    const existingProduct = cart.products.find(p => p.product.toString() === productId);
    if (existingProduct) {
      console.log('Product already in cart, updating quantity');
      existingProduct.quantity += quantity || 1;
    } else {
      console.log('Adding new product to cart');
      cart.products.push({ product: productId, quantity: quantity || 1 });
    }
    
    await cart.save();
    console.log('Product added to cart successfully');
    console.log('Cart after save:', JSON.stringify(cart, null, 2));
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error('ERROR in addToCart:', error);
    res.status(500).json({ error: error.message });
  }
}

const updateQuantity = async (req, res) => {
  try {
    const { id, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.userData.id });
    
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    
    const productIndex = cart.products.findIndex(p => p.product.toString() === id);
    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }
    
    cart.products[productIndex].quantity = quantity;
    await cart.save();
    
    res.status(200).json({ message: "Quantity updated", cart });
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const cart = await Cart.findOne({ user: req.userData.id });
    
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    
    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    await cart.save();
    
    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getCart, addToCart, updateQuantity, removeFromCart };