const router = require("express").Router();
const crypto = require("crypto-js");

const User = require("../models/User");
const verifyToken = require("../misc/verifyToken");

// update user
router.put("/:id", verifyToken, (req, res) => {
  if (req.params.id === req.user.id) {
    if (req.body.password) {
      req.body.password = crypto.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString();
    }

    try {
      User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        .then((user) => {
          res.status(200).json({ message: "User updated", data: user });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } catch (err) {
      res.status(500).json(err);
    }
  } else
    res.status(403).json("You are not allowed to update this user's profile");
});

// delete the user
router.delete("/:id", verifyToken, (req, res) => {
  if (req.params.id === req.user.id) {
    try {
      User.findByIdAndDelete(req.params.id)
        .then((user) => {
          res.status(200).json({ message: "User deleted", data: user });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } catch (err) {
      res.status(500).json(err);
    }
  } else
    res.status(403).json("You are not allowed to delete this user's profile");
});

// get the user
router.get("/find/:id", verifyToken, (req, res) => {
  if (req.params.id === req.user.id) {
    try {
      User.findById(req.params.id)
        .then((user) => {
          res.status(200).json({ message: "User found", data: user });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } catch (err) {
      res.status(500).json(err);
    }
  } else
    res.status(403).json("You are not allowed to view this user's profile");
});

// get all the users
router.get("/", verifyToken, (req, res) => {
  const query = req.query.search;
  try {
    console.log(!query || !query.length);
    if (!query || !query.length) {
      // Add a check for query existence and length
      User.find()
        .then((users) => {
          res.status(200).json({ message: "Users found", data: users });
        })
        .catch((err) => {
          res.status(400).json({ error: err.message });
        });
    } else {
      User.find()
        .sort({ _id: -1 })
        .limit(2)
        .then((users) => {
          res
            .status(200)
            .json({ message: "Users found", data: users.reverse() });
        })
        .catch((err) => {
          res.status(400).json({ error: err.message });
        });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get users statistics
router.get("/stats", verifyToken, (req, res) => {
  const today = new Date();
  const lastYear = today.setFullYear(today.getFullYear() - 1);
  const monthArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  try {
    User.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          count: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ message: e, status: "Somthing went wrong!" });
  }
});

module.exports = router;
