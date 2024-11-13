const express = require("express");
const User = require("../models/auth_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const router = express.Router();

const JT_SECRET = "mami";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).send({
        status: "U Fail to Authenticate",
        message: "Invalid Credential",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.send({
        status: "P Failed to Authenticate",
        message: "Invalid Credential",
      });
    }
    const token = jwt.sign({ id: user._id, name: user.name }, JT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).json({
      status: "Authenticated",
      message: "User Logged In",
      token: token,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(409)
        .send({ messaage: "User with given email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    res.send({ user });
  } catch (error) {
    res.send({ message: error.message });
  }
});
router.get("/protected-route", auth, (req, res) => {
  res.send({ message: "This is a protected route" });
});

router.get("/admin", auth, (req, res) => {
  try {
    if (req.user.name != "maru") {
      return res
        .status(401)
        .send({ message: "Access denied, You are not authorized" });
    }
    res.send({ message: "Welcome to the admin dashboard!" });
  } catch (error) {
    res.send({ message: error.message });
  }
});
module.exports = router;
