require("dotenv").config();
const express = require("express");
const router = express.Router();
const passport = require("passport");
const { json } = require("body-parser");
const User = require("../models/User");
const cors = require("cors");

router.use(cors());

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const exixtingUser = await User.findOne({ email });

    if (exixtingUser) {
      return res.status(400).json({ error: "user already exist" });
    }

    const newUser = new User({ username, email });
    User.register(newUser, password, async (err, user) => {
      if (err) {
        console.error("Error registering user : ", err);
        return res.status(500).json({ error: "Failed to register user" });
      }
      const verificationToken = generateToken();
      user.verificationToken = verificationToken;
      await user.save();

      user.verified = true;
      await user.save();

      res.status(201).json({
        success: true,
        message: "User register successfully",
      });
    });
  } catch (error) {
    console.error(error, "error hai bawa");
    res.status(500).json({ error: "Internal server error" });
  }
});

function generateToken() {
  return Math.random().toString(36).substr(2);
}

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    if (!user) {
      return res.json({ success: false, message: "Authentication failed" });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res
          .status(500)
          .json({ success: false, error: loginErr.message });
      }

      return res.json({ success: true, user });
    });
  })(req, res, next);
});

router.get("/check-auth", (req, res) => {
  // console.log("User Authentication", req.isAuthenticated());
  if (req.isAuthenticated()) {
    res.json({ Authenticated: true, user: req.user });
  } else {
    res.json({ Authenticated: false, user: null });
  }
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ success: false, error: error.message });
    }
    res.json({ success: true });
  });
});

router.get("/test", (req, res) => {
  res.status(201).json({ success: true, message: "All good" });
});

module.exports = router;
