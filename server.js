const express = require("express");
const cors = require("cors");
require("dotenv").config();
const data = require("./data/weather.json");

const app = express();

app.use(cors());

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello from backend");
});

app.get("/weather", (req, res) => {
  const { lat, lon, searchWeatherQuery } = req.query;

  const weatherData = data.find((item) => {
    return item.city_name.toLowerCase() === searchWeatherQuery.toLowerCase();
  });
  console.log(req.query);
  class Forecast {
    constructor(item) {
      this.date = item.valid_date;
      this.description = `Low of ${item.low_temp}, high of ${item.high_temp} with ${item.weather.description}`;
    }
  }

  if (weatherData) {
    const weatherArr = weatherData.data.map((item) => {
      return new Forecast(item);
    });
    res.send(weatherArr);
  } else {
    res.status(500).send("Sorry, something went wrong");
  }
});

app.get("*", (req, res) => {
  res.status(404).send("404 Not Found");
});
