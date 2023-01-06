const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require('./routes/eventRoutes');
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middlewares/authMiddleware");
require('dotenv').config();


const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// Server connection port and mondoDB connection string
const port = process.env.PORT;
const uri = process.env.URI;

// connecting mongoDB and starting server
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    app.listen(port, () => {
      console.log(`Server started on port : ${port}`);
      console.log("Connected to database");
    })
  )
  .catch((err) => console.log(err));

// routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
// app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));
app.use(authRoutes);
app.use(eventRoutes);


// 404 Page
app.use((req, res) => {
  res.status(404).render('404');
})
