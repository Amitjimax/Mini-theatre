import React, { useEffect, useState } from 'react';
import MovieGrid from '../../components/MovieGrid/MovieGrid';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const API_KEY = "c1d619ddf5bd92a89665b1ead84fc1cb"; // TMDB v3 key
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        setMovies(data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <p style={{ color: '#fff', textAlign: 'center', marginTop: '50px' }}>Loading movies...</p>;

  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh' }}>
      <h1 style={{ color: '#fff', padding: '20px' }}>Popular Movies</h1>
      <MovieGrid movies={movies} />
    </div>
  );
};

export default Movies;