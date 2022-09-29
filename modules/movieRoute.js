const axios = require("axios");

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


module.exports = getMovies;