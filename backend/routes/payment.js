const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { authenticateToken } = require("./userAuth");
const Order = require("../models/order");
const User = require("../models/user");
const book = require("../models/book");

const router = express.Router();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
router.post("/create-order", async (req, res) => {
  const { amount } = req.body;
  console.log("amount", amount);
  try {
    const options = {
      amount: Number(amount * 100), // Amount in smallest currency unit
      currency: "INR",
      receipt: Math.random(Date.now()).toString(),
      
    };
    const paymentResponse = await razorpayInstance.orders.create(options);
    console.log("paymentResponse: " ,paymentResponse);
    res.status(200).json({
      success: true,
      data: paymentResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Failure",
      message: "An error occurred while creating the order",
    });
  }
});

 // Verify payment signature
 router.post("/verify-signature", async (req, res) => {
  try {
    const { id } = req.headers; // User ID from headers
    const { order } = req.body; // Array of order data from request body

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Validate payment details
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(200).json({
        success: false,
        message: "Payment Failed",
      });
    }

    // Verify the Razorpay signature
    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Update the payment status of the order in the database
      await Order.findByIdAndUpdate(order._id, { paymentStatus: "Paid" });

      // Process each order item
      for (const orderData of order) {
        // Find the book details from the Book model
        const bookDetails = await book.findById(orderData._id).select('_id title author price');

        if (!bookDetails) {
          return res.status(404).json({
            success: false,
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
          paymentMethod: "Online",
          paymentStatus: "Paid",
        });

        // Save the new order to the database
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
        success: true,
        message: "Payment Verified and Order Placed Successfully",
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Payment Verification Failed",
      });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({
      success: false,
      message: "An error occurred while verifying the payment",
    });
  }
});


// Place COD order
router.post("/place-cod-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order } = req.body;

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
      const bookDetails = await book.findById(orderData._id).select('_id title author price');

      if (!bookDetails) {
        return res.status(404).json({
          success: false,
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
        paymentMethod: "COD",
        paymentStatus: "Pending",
      });

      // Save the new order to the database
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
      message: "COD Order Placed Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "Failure",
      message: "An error occurred while placing the COD order",
    });
  }
});

module.exports = router;
