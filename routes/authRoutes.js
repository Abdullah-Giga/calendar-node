const { Router } = require("express");
const {signup, login, about, signup_post, login_post, logout} = require("../controllers/authControllers");

const router = Router();


// pages
router.get("/signup", signup);

router.get("/login", login);

router.get('/about', about);

// requests
router.post("/signup",signup_post);

router.post("/login", login_post);

router.get("/logout",logout);

module.exports = router;
