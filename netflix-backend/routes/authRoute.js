const router = require("express").Router();
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// register route
router.post("/register", (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: crypto.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
  });

  newUser
    .save()
    .then((user) => res.status(201).json(user))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// login routes
router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        res.status(401).json({ message: "The user does not exist" });
      } else {
        const validPassword = crypto.AES.decrypt(
          user.password,
          process.env.SECRET_KEY
        ).toString(crypto.enc.Utf8);
        if (validPassword === req.body.password) {
          const { password, ...info } = user._doc;
          const accessToken = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.SECRET_KEY,
            { expiresIn: "5d" }
          );
          res.status(200).json({ ...info, accessToken });
        } else {
          res.status(401).json({ message: "Invalid password" });
        }
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
