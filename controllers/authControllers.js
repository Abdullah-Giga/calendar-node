const User = require("../models/user");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');
require('dotenv').config();



// hande errors
const errorHandler = (err) => {
  let errors = { email: "", password: "" };

  //Login errors
  if (err.message === "incorrect email") {
    errors.email = "This email does not exists";
  }
  if (err.message === "incorrect password") {
    errors.password = "This password is incorrect";
  }

  // Validatiojn errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

// generating a jwt

const maxAge = 3 * 24 * 60 * 60; // three days in seconds

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: maxAge,
  });
};

// Sign up page
const signup= (req, res) => {
  res.render("signup");
};

// Login page
const login = (req, res) => {
  res.render("login");
};

// about page

const about = (req, res) => {
  res.render('about');
}

// // handling user image upload using multer package

// const storage = multer.diskStorage({
//   destination:(req, file, cb) => {
//     console.log(file);
//     cb(null,'Images');
//   },
//   filename:(req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname))
//   }
// })

// // middleware
// const upload = multer({storage: storage})


// New User Sign Up Handler
const signup_post = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await User.create({firstName, lastName, email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = err.message;
    res.status(400).json({ errors });
  }
};

// User Login handler
const login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = errorHandler(err);
    res.status(400).json({ errors });
  }
};

// Logout function
// changes the value of jwt to blank and expires it after 1 second
const logout= (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};


module.exports = {signup, login, about, signup_post, login_post, logout};