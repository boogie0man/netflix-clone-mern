const router = require("express").Router();

const Movies = require("../models/Movies");
const verifyToken = require("../misc/verifyToken");

// create movie
router.post("/", verifyToken, (req, res) => {
  if (req.user.isAdmin) {
    const newMovie = new Movies(req.body);
    try {
      newMovie
        .save()
        .then((data) =>
          res
            .status(200)
            .json({ data, message: "Movie created successfully...!" })
        );
    } catch (err) {
      res.status(500).json(err);
    }
  } else res.status(403).json("You are not allowed to add the item to this");
});

// update movie
router.put("/:id", verifyToken, (req, res) => {
  if (req.user.isAdmin) {
    Movies.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((data) =>
        res
          .status(200)
          .json({ data, message: "Movie updated successfully...!" })
      )
      .catch((err) => res.status(500).json(err));
  } else res.status(403).json("You are not allowed to update this data");
});

// Delete movie
router.delete("/:id", verifyToken, (req, res) => {
  if (req.user.isAdmin) {
    Movies.findByIdAndDelete(req.params.id)
      .then((data) =>
        res
          .status(200)
          .json({ data, message: "The movie has been deleted...!" })
      )
      .catch((err) => res.status(500).json(err));
  } else res.status(403).json("You are not allowed to delete this data...");
});

// get movie
router.get("/:id", verifyToken, (req, res) => {
  Movies.findById(req.params.id)
    .then((data) =>
      res
        .status(200)
        .json({ data, message: "The movie has been retrieved...!" })
    )
    .catch((err) => res.status(500).json(err));
});

// get random movie
router.get("/random", verifyToken, (req, res) => {
  const type = req.query.type;
  try {
    if (type === "movie") {
      Movies.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]).then((data) => {
        res
          .status(200)
          .json({ data, message: "random movie fetched successfully...!" });
      });
    } else {
      Movies.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]).then((data) => {
        res
          .status(200)
          .json({ data, message: "random series fetched successfully...!" });
      });
    }
  } catch (error) {
    res.status(500).json({ message: "somthing went wrong...! " });
  }
});

module.exports = router;
