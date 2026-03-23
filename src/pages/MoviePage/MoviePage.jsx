import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './MoviePage.css'

// 🔥 Firebase imports
import { db, auth } from '../../firebase'
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore'

const MoviePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [play, setPlay] = useState(false);
  const [similar, setSimilar] = useState([]);

  // ✅ Firebase My List
  const [saved, setSaved] = useState(false);

  // 🎥 Hover trailer
  const [hoverTrailer, setHoverTrailer] = useState(null);
  const [hoverId, setHoverId] = useState(null);

  const API_KEY = "c1d619ddf5bd92a89665b1ead84fc1cb";

  const user = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {

      // 🎬 Movie Details
      const res1 = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
      );
      const data1 = await res1.json();
      setMovie(data1);

      // 🎬 Trailer
      const res2 = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
      );
      const data2 = await res2.json();

      const trailerVideo = data2.results.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );

      setTrailer(trailerVideo);

      // 🎬 Similar Movies
      const res3 = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}`
      );
      const data3 = await res3.json();
      setSimilar(data3.results || []);

      // 🔐 Check Firebase My List
      if (user) {
        const docRef = doc(db, "myList", user.uid + "_" + id);
        const docSnap = await getDoc(docRef);
        setSaved(docSnap.exists());
      }
    };

    fetchData();
  }, [id, user]);

  // 🔐 Add / Remove My List (Firebase)
  const handleMyList = async () => {
    if (!user || !movie) return;

    const docRef = doc(db, "myList", user.uid + "_" + movie.id);

    if (saved) {
      await deleteDoc(docRef);
    } else {
      await setDoc(docRef, {
        ...movie,
        userId: user.uid
      });
    }

    setSaved(!saved);
  };

  // 🎥 Fetch trailer for hover
  const fetchHoverTrailer = async (movieId) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
      );
      const data = await res.json();

      const trailer = data.results.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );

      setHoverTrailer(trailer?.key);
      setHoverId(movieId);
    } catch (err) {
      console.log(err);
    }
  };

  if (!movie) return <p style={{ color: "white" }}>Loading...</p>;

  return (
    <div className="movie-page">

      {/* 🎬 Banner */}
      <div
        className="movie-banner"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
        }}
      >
        <div className="overlay">
          <h1>{movie.title}</h1>

          <p className="movie-info">
            ⭐ {movie.vote_average?.toFixed(1)} | 📅 {movie.release_date?.slice(0,4)} | 🎭 {movie.genres?.map(g => g.name).join(', ')}
          </p>

          <p>{movie.overview}</p>

          {/* ▶ Play */}
          {trailer && (
            <button className="play-btn" onClick={() => setPlay(true)}>
              ▶ Play Trailer
            </button>
          )}

          {/* ❤️ My List */}
          <button className="mylist-btn" onClick={handleMyList}>
            {saved ? "✔ Added to My List" : "+ Add to My List"}
          </button>
        </div>
      </div>

      {/* 🎥 Video */}
      {play && trailer && (
        <div className="video-modal">
          <span className="close-btn" onClick={() => setPlay(false)}>✖</span>
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
            title="Trailer"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {/* 🎬 More Like This */}
      <div className="similar-section">
        <h2>More Like This</h2>

        <div className="similar-grid">
          {similar.map((item) => (
            <div 
              key={item.id} 
              className="similar-card"
              onMouseEnter={() => fetchHoverTrailer(item.id)}
              onMouseLeave={() => setHoverTrailer(null)}
              onClick={() => navigate(`/movie/${item.id}`)}
            >
              {/* 🎥 Hover Video */}
              {hoverTrailer && hoverId === item.id ? (
                <iframe
                  src={`https://www.youtube.com/embed/${hoverTrailer}?autoplay=1&mute=1`}
                  title="preview"
                ></iframe>
              ) : (
                item.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                    alt=""
                  />
                )
              )}

              <p>{item.title}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default MoviePage