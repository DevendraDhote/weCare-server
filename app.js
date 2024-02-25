require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const port = process.env.PORT;
app.use(cors());
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose.connect(
  process.env.DATABASE_URL,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;

const passport = require("passport");
const LocalStrategey = require("passport-local").Strategy;
const session = require("express-session");

const User = require("./models/User");

const MongoStore = require("connect-mongo");
app.use(
  session({
    secret: "abcd1234",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl:
        "mongodb+srv://devendra:Dev0000@cluster0.lsp88y3.mongodb.net/userLoggedIn",
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategey(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
db.on("error", console.error.bind(console, "MongoDb connection error"));
db.once("open", () => {
  console.log("Connected to MongoDb");
});

const authRouter = require("./routes/auth");

app.use("/", authRouter);

app.get("/", (req, res) => {
  res.json(`API is running on ${port}`);  
});

app.listen(port, () => {
  console.log(`Api is running on port ${port}`);
});
