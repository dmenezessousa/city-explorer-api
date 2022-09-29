const express = require("express");
const cors = require("cors");
require("dotenv").config();

const getWeather = require("./modules/weatherRoute");
const getMovies = require("./modules/movieRoute");

const app = express();

app.use(cors());

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// Routes  =====================================================
app.get("/", (req, res) => {
  res.send("Hello from backend");
});
app.get("/weather", getWeather);
app.get("/movies", getMovies);

app.get("*", (req, res) => {
  res.status(404).send("404 Not Found");
});
