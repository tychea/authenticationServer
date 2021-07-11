const express = require("express");
const router = express.Router();
// const auth = require('../../middleware/auth');
const User = require("../../modals/User");

// router.get("/user", async (req, res) => {
//   const user = User.find();
//   res.status(200).json(user);
// });
//@route POST api/users/resgister
//@desc Register User
//@access Public
router.post("/register", async (req, res) => {
  //get value from body
  //making validation inside mongoose schema
  const user = new User(req.body);
  try {
    const token = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    await user.save();
    res.status(200).json({
      success: true,
      message: "User created successfully",
      token,
      refreshToken,
    });
  } catch (error) {
    // checking where the Error Come from MongoDB Unique Or Mongoose Validation Error
    // if it true mean it from Mongoose validation Error
    console.log(error);
    const errorFromValidation = "errors" in error;
    if (!errorFromValidation) {
      return res.status(400).json({
        success: false,
        message: "Email is Already in used",
      });
    }
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

//@route POST api/users/login
//@desc Login User
//@access Public
router.post("/login", async (req, res) => {
  //check if user exist
  const { email, password } = req.body;
  try {
    const user = await User.findByCredential(email, password);
    const token = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    res.status(200).json({
      success: true,
      message: "Login Success",
      token,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Invalid Credential",
    });
  }
});
module.exports = router;
