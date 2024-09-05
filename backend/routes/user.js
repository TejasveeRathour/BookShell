const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");

//Sign Up
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, address, role } = req.body;

    //check username Length is more than 4
    if (username.length < 4) {
      return res.status(400).json({
        message: "Username length should be greater than 3",
      });
    }

    //check user already exists?
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    //check password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password length should be greater than 5",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: username,
      email: email,
      password: hashPassword,
      address: address,
      role: role,
    });

    await newUser.save();
    return res.status(200).json({
      message: "Sigup Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server error",
    });
  }
});

//Sign In
router.post("/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      res.status(400).json({
        message: "User not exist",
      });
      return;
    }

    await bcrypt.compare(password, existingUser.password, (err, data) => {
      if (data) {
        const authClaims = [
          { name: existingUser.username },
          { role: existingUser.role },
        ];

        const token = jwt.sign({ authClaims }, process.env.JWT_SECRET_KEY, {
          expiresIn: "30d",
        });
        res.status(200).json({
          id: existingUser._id,
          role: existingUser.role,
          token: token,
          message: "Login Successfully",
        });
      } else {
        res.status(200).json({
          message: "Invalid Credentials",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server error",
    });
  }
});

//get user information
router.get("/get-user-information", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const data = await User.findById(id).select("-password");
    return res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      message: "Internal Server error",
    });
  }
});

//update address
router.put("/update-address", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { address } = req.body;
    await User.findByIdAndUpdate(id, { address: address });
    return res.status(200).json({
      message: "Address Updated Successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server error",
    });
  }
});

module.exports = router;
