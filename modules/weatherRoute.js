const axios = require("axios");
const cache = require("./cache.js");

class Forecast {
  constructor(item) {
    this.date = item.valid_date;
    this.description = `Low of ${item.low_temp}, high of ${item.high_temp} with ${item.weather.description}`;
  }
}

async function getWeather(req, res) {
  const { lat, lon } = req.query;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;
  try {
    const key = "weather-" + lat + lon;
    if(cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
      console.log("Cache hit");
      res.status(200).send(cache[key].data);
    }else{
      console.log("Cache miss");
      const weatherResponse = await axios.get(url);
      const weatherDataArray = weatherResponse.data.data.map((day) => {
        return new Forecast(day);
    });
    cache[key] = { data: weatherDataArray, timestamp: Date.now() };
    res.send(weatherDataArray);
    }
  } catch (error) {
    res.status(500).send("Server Error ", error);
  }
};


module.exports = getWeather;
