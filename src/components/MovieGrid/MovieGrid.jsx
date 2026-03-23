import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieGrid.css';

const MovieGrid = ({ movies }) => {
  const navigate = useNavigate();

  if (!movies || movies.length === 0) return <p style={{ color: '#fff' }}>No movies found.</p>;

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="movie-card"
          onClick={() => navigate(`/movie/${movie.id}`)}
        >
          {movie.poster_path ? (
            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
          ) : (
            <div className="no-poster">No Image</div>
          )}
          <p>{movie.title}</p>
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;