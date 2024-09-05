const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

// Add book to cart
router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;

    // Find the user
    const userData = await User.findById(id);

    // Check if the book is already in the cart
    const isBookInCart = userData.cart.includes(bookid);
    if (isBookInCart) {
      return res.status(200).json({
        status: "Success",
        message: "Book is already in the cart",
      });
    }

    // Add the book to the cart
    await User.findByIdAndUpdate(id, {
      $push: { cart: bookid },
    });

    return res.status(200).json({
      status: "Success",
      message: "Book added to cart",
    });
  } catch (err) {
    console.error(err); // Log error for debugging
    return res.status(500).json({
      status: "Failure",
      message: "An error occurred while adding the book to the cart",
    });
  }
});

//remove from cart
router.put("/remove-from-cart/:bookid", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers; // User ID from headers
    const { bookid } = req.params; // Book ID from route parameters

    // Check if id (User ID) is provided
    if (!id) {
      return res.status(400).json({
        status: "Failure",
        message: "User ID is required",
      });
    }

    // Find the user
    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).json({
        status: "Failure",
        message: "User not found",
      });
    }

    // Check if the book is in the cart
    const isBookInCart = userData.cart.includes(bookid);
    if (!isBookInCart) {
      return res.status(404).json({
        status: "Failure",
        message: "Book not found in cart",
      });
    }

    // Remove the book from the cart
    await User.findByIdAndUpdate(id, {
      $pull: { cart: bookid },
    });

    return res.status(200).json({
      status: "Success",
      message: "Book removed from cart",
    });
  } catch (err) {
    console.error(err); // Log error for debugging
    return res.status(500).json({
      status: "Failure",
      message: "An error occurred while removing the book from the cart",
    });
  }
});

//get cart of a particular user
router.get("/get-user-cart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    // Check if id (User ID) is provided
    if (!id) {
      return res.status(400).json({
        status: "Failure",
        message: "User ID is required",
      });
    }

    // Find the user and populate the cart
    const userData = await User.findById(id).populate("cart");
    if (!userData) {
      return res.status(404).json({
        status: "Failure",
        message: "User not found",
      });
    }

    // Reverse the cart order and return it
    const cart = userData.cart.reverse();

    return res.status(200).json({
      status: "Success",
      data: cart,
    });
  } catch (err) {
    console.error(err); // Log error for debugging
    return res.status(500).json({
      status: "Failure",
      message: "An error occurred while fetching the user's cart",
    });
  }
});

module.exports = router;
