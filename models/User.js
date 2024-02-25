const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userScheema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  verified: { type: Boolean, default: false },
  verificationToken: String,
});

userScheema.plugin(passportLocalMongoose);  

const User = mongoose.model("User", userScheema);

module.exports = User;
