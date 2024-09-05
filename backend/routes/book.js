const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");
const Book = require("../models/book");
const Order = require("../models/order");

//add book --admin
router.post("/add-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);
    console.log(user);

    if (user.role !== "admin") {
      return res.status(400).json({
        message: "Only admin can add new book",
      });
    }

    // Check if a book with the same title and author already exists
    const { title, author } = req.body;
    const existBook = await Book.findOne({ title: title, author: author });

    if (existBook) {
      return res.status(400).json({
        message: "This book already exists",
      });
    }

    const book = new Book({
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    });

    await book.save();
    res.status(200).json({
      message: "Book added successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "An error occured in add book",
    });
  }
});

//update book --admin
router.put("/update-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    console.log(bookid);

    // Update the book with the provided data
    const updatedBook = await Book.findByIdAndUpdate(
      bookid,
      {
        url: req.body.url,
        title: req.body.title,
        author: req.body.author,
        price: req.body.price,
        desc: req.body.desc,
        language: req.body.language,
      },
      { new: true } // This option returns the updated document
    );

    if (!updatedBook) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    return res.status(200).json({
      message: "Book Updated Successfully!",
    });
  } catch (err) {
    res.status(500).json({
      message: "An error occurred while updating the book",
    });
  }
});

//delete book --admin
router.delete("/delete-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;

    // Find and delete the book
    const deletedBook = await Book.findByIdAndDelete(bookid);
    
    // console.log("book--",book);
    if (!deletedBook) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    return res.status(200).json({
      message: "Book deleted successfully!",
    });
  } catch (err) {
    console.error(err); // Log error for debugging
    return res.status(500).json({
      message: "An error occurred while deleting the book",
    });
  }
});

//get all books
router.get("/get-all-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (err) {
    console.error(err); // Log error for debugging
    return res.status(500).json({
      message: "An error occurred while fetching all books",
    });
  }
});

//get recently added books limit - 4
router.get("/get-recent-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(4);
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (err) {
    console.error(err); // Log error for debugging
    return res.status(500).json({
      message: "An error occurred while fetching recent 4 books",
    });
  }
});

//get book by id
router.get("/get-book-by-id/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const book = await Book.findById(id);
    return res.json({
      status: "Success",
      data: book,
    });
  } catch (err) {
    console.error(err); // Log error for debugging
    return res.status(500).json({
      message: "An error occurred while fetching particular book detail",
    });
  }
});

module.exports = router;
