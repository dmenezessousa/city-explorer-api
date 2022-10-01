const axios = require("axios");
const cache = require("./cache.js");

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

async function getMovies(req, res) {
  const { query } = req.query;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${query}`;
  try {
    const key = "movies-" + query;
    if(cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
      console.log("Cache hit");
      res.status(200).send(cache[key].data);
    }else{
      console.log("Cache miss");
      const movieResponse = await axios.get(url);
      const movieDataArray = movieResponse.data.results.map((movie) => {
        return new Movie(movie);
      });
      cache[key] = { data: movieDataArray, timestamp: Date.now() };
      res.send(movieDataArray);
    }
  } catch (error) {
    res.status(500).send("Server Error ", error);
  }
}


module.exports = getMovies;