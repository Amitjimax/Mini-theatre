import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Player from './pages/Player/Player';
import MoviePage from './pages/MoviePage/MoviePage';
import MovieGrid from './components/MovieGrid/MovieGrid';
import MyList from './pages/MyList/MyList'; // ✅ ADD THIS

// Reusable page
const MovieListPage = ({ title, endpoint }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const API_KEY = "c1d619ddf5bd92a89665b1ead84fc1cb";
        const res = await fetch(
          `https://api.themoviedb.org/3/${endpoint}?api_key=${API_KEY}&language=en-US&page=1`
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
  }, [endpoint]);

  if (loading)
    return (
      <p style={{ color: '#fff', textAlign: 'center', marginTop: '50px' }}>
        Loading {title}...
      </p>
    );

  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh' }}>
      <h1 style={{ color: '#fff', padding: '20px' }}>{title}</h1>
      <MovieGrid movies={movies} />
    </div>
  );
};

const App = () => {
  const navigate = useNavigate();
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      if (!currentUser) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (authLoading) {
    return (
      <p style={{ color: '#fff', textAlign: 'center', marginTop: '50px' }}>
        Checking authentication...
      </p>
    );
  }

  return (
    <div>
      <ToastContainer theme='dark' />

      <Routes>
        {user ? (
          <>
            <Route path='/' element={<Home />} />
            <Route path='/player/:id' element={<Player />} />
            <Route path='/movie/:id' element={<MoviePage />} />

            <Route path='/tv-shows' element={<MovieListPage title="TV Shows" endpoint="tv/popular" />} />
            <Route path='/movies' element={<MovieListPage title="Movies" endpoint="movie/popular" />} />
            <Route path='/new-popular' element={<MovieListPage title="New & Popular" endpoint="movie/top_rated" />} />

            {/* ✅ ONLY THIS MyList */}
            <Route path='/mylist' element={<MyList />} />

            <Route path='/browse-by-language' element={<MovieListPage title="Browse By Language" endpoint="movie/popular" />} />
          </>
        ) : (
          <Route path='/login' element={<Login />} />
        )}
      </Routes>
    </div>
  );
};

export default App;