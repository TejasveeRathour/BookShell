const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

// Add book to favourite
router.put("/add-book-to-favourite", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;

    // Check if bookid and id are provided
    if (!bookid || !id) {
      return res.status(400).json({
        message: "Book ID and User ID are required",
      });
    }

    // Find the user
    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if the book is already in favourites
    const isBookFavourite = userData.favourites.includes(bookid);
    if (isBookFavourite) {
      return res.status(200).json({
        message: "Book is already in favourites",
      });
    }

    // Add the book to favourites
    await User.findByIdAndUpdate(
      id,
      { $push: { favourites: bookid } },
      { new: true } // Optionally return the updated document
    );

    return res.status(200).json({
      message: "Book added to favourites",
    });
  } catch (err) {
    console.error(err); // Log error for debugging
    return res.status(500).json({
      status: "Failure",
      message: "An error occurred while adding the book to favourites",
    });
  }
});

// Remove book from favourite
router.put(
  "/remove-book-from-favourite",
  authenticateToken,
  async (req, res) => {
    try {
      const { bookid, id } = req.headers;

      // Check if bookid and id are provided
      if (!bookid || !id) {
        return res.status(400).json({
          message: "Book ID and User ID are required",
        });
      }

      // Find the user
      const userData = await User.findById(id);
      if (!userData) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Check if the book is not in favourites
      const isBookFavourite = userData.favourites.includes(bookid);
      if (!isBookFavourite) {
        return res.status(200).json({
          message: "Book is not in favourites",
        });
      }

      // Remove the book from favourites
      await User.findByIdAndUpdate(
        id,
        { $pull: { favourites: bookid } }, // Use $pull to remove the book from the array
        { new: true }
      );

      return res.status(200).json({
        message: "Book removed from favourites",
      });
    } catch (err) {
      console.error(err); // Log error for debugging
      return res.status(500).json({
        status: "Failure",
        message: "An error occurred while removing the book from favourites",
      });
    }
  }
);

// Get favourite books of a particular user
router.get("/get-favourite-books", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    // Find the user and populate the favourites array
    const userData = await User.findById(id).populate("favourites");

    // Check if user exists
    if (!userData) {
      return res.status(404).json({
        status: "Failure",
        message: "User not found",
      });
    }

    // Retrieve the user's favourite books
    const favouriteBooks = userData.favourites;

    return res.status(200).json({
      status: "Success",
      data: favouriteBooks,
    });
  } catch (err) {
    console.error(err); // Log error for debugging
    return res.status(500).json({
      status: "Failure",
      message:
        "An error occurred while fetching the favourite books of the user",
    });
  }
});

module.exports = router;
