const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.models");
const jwt = require("jsonwebtoken");

require("dotenv").config();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 1337;

mongoose
  .connect(
    `mongodb+srv://chwasiq0569:${process.env.DATABASE_PASSWORD}@cluster0.rzt9w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connected to Database!");

    app.listen(PORT, () => {
      console.log("SERVER STARTED");
    });
  })
  .catch((err) => console.log("ERR", err));

app.get("/hello", (req, res) => {
  res.send("check");
});

app.post("/api/register", async (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .then(async (user) => {
      if (user) {
        res.status(400).json({
          status: "0",
          message: "User Already Exists",
        });
      } else {
        try {
          const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          });
          console.log("user", user);
          res.status(201).json({
            status: "1",
            user: { name: user?.name, email: user?.email },
          });
        } catch (err) {
          res.json({ status: "0", err: err.message });
        }
      }
    })
    .catch((err) => {
      return res.status(400).json({
        status: "0",
        message: "Something went wrong!!",
      });
    });
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET_KEY
    );

    return res.status(200).json({
      status: "1",
      token: token,
      //   user: user,
    });
  } else {
    return res.status(400).json({
      status: "0",
      message: "Invalid Email or password!",
    });
  }
});
