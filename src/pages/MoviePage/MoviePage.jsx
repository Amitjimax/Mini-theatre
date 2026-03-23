import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MoviePage.css';

const MoviePage = () => {
  const { id } = useParams(); // get movie ID from URL
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const API_KEY = "c1d619ddf5bd92a89665b1ead84fc1cb"; // TMDB v3 key
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
        );

        if (!res.ok) throw new Error("Failed to fetch movie details");

        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading)
    return <p className="loading">Loading movie details...</p>;

  if (error)
    return <p className="error">{error}</p>;

  return (
    <div className="movie-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {movie && (
        <div className="movie-details">
          <div className="poster">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
              />
            ) : (
              <div className="no-poster">No Image Available</div>
            )}
          </div>

          <div className="info">
            <h1>{movie.title}</h1>
            {movie.tagline && <p className="tagline">{movie.tagline}</p>}
            {movie.overview && <p className="overview">{movie.overview}</p>}
            <p><strong>Release Date:</strong> {movie.release_date || "N/A"}</p>
            <p><strong>Rating:</strong> {movie.vote_average || "N/A"} / 10</p>
            <p><strong>Genres:</strong> {movie.genres?.map(g => g.name).join(", ") || "N/A"}</p>
            <p><strong>Runtime:</strong> {movie.runtime || "N/A"} mins</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviePage;