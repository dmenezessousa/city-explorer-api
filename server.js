const express = require("express");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");

const app = express();

app.use(cors());

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Constructor functions =======================================
class Forecast {
  constructor(item) {
    this.date = item.valid_date;
    this.description = `Low of ${item.low_temp}, high of ${item.high_temp} with ${item.weather.description}`;
  }
}

class Movie {
  constructor(item) {
    this.title = item.title;
    this.overview = item.overview;
    this.average_votes = item.vote_average;
    this.total_votes = item.vote_count;
    this.image_url = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
    this.popularity = item.popularity;
    this.released_on = item.release_date;
  }
}

// Routes Functions =====================================================
async function getWeather(req, res) {
  const { lat, lon,} = req.query;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;
  try {
    const weatherResponse = await axios.get(url);
    const weatherDataArray = weatherResponse.data.data.map((day) => {
      return new Forecast(day);
    });
    res.send(weatherDataArray);
  } catch (error) {
    res.status(500).send("Server Error ", error);
  }
}

async function getMovies(req, res) {
  const { query } = req.query;
  console.log(query);
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${query}`;
  try {
    const movieResponse = await axios.get(url);
    const movieDataArray = movieResponse.data.results.map((movie) => {
      return new Movie(movie);
    });
    res.send(movieDataArray);
  } catch (error) {
    res.status(500).send("Server Error ", error);
  }
}

// Routes  =====================================================
app.get("/", (req, res) => {
  res.send("Hello from backend");
});
app.get("/weather", getWeather);
app.get("/movies", getMovies);

app.get("*", (req, res) => {
  res.status(404).send("404 Not Found");
});
