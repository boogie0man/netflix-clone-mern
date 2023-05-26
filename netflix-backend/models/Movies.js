const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String },
    img: { type: String },
    imgTitle: { type: String },
    imgThumb: { type: String },
    trailer: { type: String },
    video: { type: String },
    year: { type: String },
    limit: { type: Number },
    genre: { type: String },
    isSeries: { type: boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movies", movieSchema);
