const Order = require("../models/Order");
const Product = require("../models/Product");

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
const placeOrder = async (req, res) => {
  try {
    const { products, shippingAddress } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one product" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of products) {
      const product = await Product.findById(item.productId || item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId || item.product}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
      });

      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      userId: req.user._id,
      products: orderItems,
      totalAmount,
      shippingAddress: shippingAddress || "",
      status: "PENDING",
    });

    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ message: "Server error placing order", error: error.message });
  }
};

// @desc    Get orders - user gets own orders, admin gets all orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    let orders;
    if (req.user.role === "ADMIN") {
      orders = await Order.find({}).populate("userId", "name email").sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    }
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching orders", error: error.message });
  }
};

// @desc    Get single order by id
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("userId", "name email");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (req.user.role !== "ADMIN" && order.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching order", error: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(", ")}` });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    const updatedOrder = await order.save();
    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(500).json({ message: "Server error updating order", error: error.message });
  }
};

module.exports = { placeOrder, getOrders, getOrderById, updateOrderStatus };
