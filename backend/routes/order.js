const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");
const Order = require("../models/order");

// Place order
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers; // User ID from headers
    const { order } = req.body; // Array of order data from request body

    // Validate input
    if (!id || !order || !Array.isArray(order)) {
      return res.status(400).json({
        status: "Failure",
        message: "User ID and order details are required",
      });
    }

    // Process each order item
    for (const orderData of order) {
      // Find the book details from the Book model
      const bookDetails = await Book.findById(orderData._id).select('_id title author price'); // Exclude the book ID and select only the necessary fields

      if (!bookDetails) {
        return res.status(404).json({
          status: "Failure",
          message: `Book with ID ${orderData._id} not found`,
        });
      }

      // Create a new order with embedded book details
      const newOrder = new Order({
        user: id,
        book: {
          id: bookDetails._id,
          title: bookDetails.title,
          author: bookDetails.author,
          price: bookDetails.price,
        },
        status: 'Order Placed',
        paymentMethod: orderData.paymentMethod,
      });

      // Save the order to the database
      const orderDataFromDb = await newOrder.save();

      // Add the order ID to the user's orders list
      await User.findByIdAndUpdate(id, {
        $push: { orders: orderDataFromDb._id },
      });

      // Remove the book from the user's cart
      await User.findByIdAndUpdate(id, {
        $pull: { cart: orderData._id },
      });
    }

    return res.status(200).json({
      status: "Success",
      message: "Order Placed Successfully",
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({
      status: "Failure",
      message: "An error occurred while placing the order",
    });
  }
});

// Get order history of a particular user
router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    // Check if the User ID is provided
    if (!id) {
      return res.status(400).json({
        status: "Failure",
        message: "User ID is required",
      });
    }

    // Find the user and populate the orders with book details
    const userData = await User.findById(id).populate({
      path: "orders",
    });

    // Check if the user exists
    if (!userData) {
      return res.status(404).json({
        status: "Failure",
        message: "User not found",
      });
    }

    // Reverse the order history to show the most recent orders first
    const orderData = userData.orders.reverse();

    return res.status(200).json({
      status: "Success",
      data: orderData,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({
      status: "Failure",
      message: "An error occurred while retrieving the order history",
    });
  }
});

// Get all orders -- admin
router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    // Check if the user ID is provided
    if (!id) {
      return res.status(400).json({
        status: "Failure",
        message: "User ID is required",
      });
    }

    // Find the user and check if they are an admin
    const userData = await User.findById(id);
    if (!userData || userData.role !== "admin") {
      return res.status(403).json({
        status: "Failure",
        message: "Access denied. Only admins can view all orders.",
      });
    }

    // Retrieve all orders and populate with user and book details
    const orders = await Order.find()
      .populate({ path: "user" })
      .sort({ createdAt: -1 });

      // console.log(orders);

    return res.status(200).json({
      status: "Success",
      data: orders,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({
      status: "Failure",
      message: "An error occurred while retrieving all orders",
    });
  }
});

// Update order status -- admin
router.put("/update-status/:id", authenticateToken, async (req, res) => {
  try {
    const { id: orderId } = req.params; // Order ID from route parameters
    const { status } = req.body; // New status from request body
    const userId = req.headers.id; // User ID from headers

    console.log("Body: ", req.body);
    // Check if the user ID is provided
    if (!userId) {
      return res.status(400).json({
        status: "Failure",
        message: "User ID is required",
      });
    }

    // Check if the status is provided
    if (!status) {
      return res.status(400).json({
        status: "Failure",
        message: "Status is required",
      });
    }

    // Find the user and check if they are an admin
    const userData = await User.findById(userId);
    if (!userData || userData.role !== "admin") {
      return res.status(403).json({
        status: "Failure",
        message: "Access denied. Only admins can update order statuses.",
      });
    }

    // Find the order and update the status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true } // Return the updated document and validate
    );

    // Check if the order exists
    if (!updatedOrder) {
      return res.status(404).json({
        status: "Failure",
        message: "Order not found",
      });
    }

    return res.status(200).json({
      status: "Success",
      message: "Status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({
      status: "Failure",
      message: "An error occurred while updating the order",
    });
  }
});


module.exports = router;
