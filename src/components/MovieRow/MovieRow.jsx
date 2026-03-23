import React, { useEffect, useState } from 'react'
import './MovieRow.css'
import { useNavigate } from 'react-router-dom'

const MovieRow = ({ title, endpoint }) => {
  const [movies, setMovies] = useState([])
  const navigate = useNavigate()

  const API_KEY = "c1d619ddf5bd92a89665b1ead84fc1cb"

  useEffect(() => {
    const fetchMovies = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/${endpoint}?api_key=${API_KEY}`
      )
      const data = await res.json()
      setMovies(data.results || [])
    }

    fetchMovies()
  }, [endpoint])

  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row-posters">
        {movies.map((movie) => (
          <img
            key={movie.id}
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt=""
            onClick={() => navigate(`/movie/${movie.id}`)}
          />
        ))}
      </div>
    </div>
  )
}

export default MovieRow