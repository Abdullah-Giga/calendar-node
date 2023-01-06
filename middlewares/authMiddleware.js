const jwt = require("jsonwebtoken");
const User = require("../models/user");
require('dotenv').config();


// Checking if the user accessing a specific route is logged in or not
const requireAuth =async (req, res, next) => {
  const token = req.cookies.jwt;
  // check if jwt exixts
  if (token) {
    // checking if it is valid

    jwt.verify(token, process.env.SECRET, (error, decodedToken) => {
      // checking if the token has been tampered with
      if (error) {
        console.log(error);
        res.redirect("/login");
      }
      // if not then we move on
      else {
        next();
      }
    });
  } else {
    // redirecting to login
    res.redirect("/login");
  }
};

// Getting the current logged in user

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  // check if jwt exixts
  if (token) {
    // checking if it is valid
    jwt.verify(token, process.env.SECRET, async (error, decodedToken) => {
      // checking if the token has been tampered with
      if (error) {
        console.log(error.message);
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        req.user = user;
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
