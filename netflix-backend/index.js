const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const port = 8080;

const authRoutes = require("./routes/authRoute");
const UserRoutes = require("./routes/UserRoute");
const MoviesRoute = require("./routes/MoviesRoute");

app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console(err));

app.use("/auth", authRoutes);
app.use("/user", UserRoutes);
app.use("/movies", MoviesRoute);

app.listen(port, () => {
  console.log("Connected to port:", port);
});
