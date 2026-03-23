import React, { useEffect, useRef, useState } from 'react';
import './Navbar.css';
import logo from '../../assets/logo.png';
import search_icon from '../../assets/search_icon.svg';
import bell_icon from '../../assets/bell_icon.svg';
import profile_img from '../../assets/profile_img.png';
import caret_icon from '../../assets/caret_icon.svg';
import { logout } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navRef = useRef();
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [movies, setMovies] = useState([]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 80) {
        navRef.current.classList.add('nav-dark');
      } else {
        navRef.current.classList.remove('nav-dark');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch movies using TMDB v3 API
  const fetchMovies = async (query) => {
    if (!query) {
      setMovies([]);
      return;
    }
    try {
      const API_KEY = "c1d619ddf5bd92a89665b1ead84fc1cb";

      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
      );

      if (!res.ok) {
        console.error("Network response not ok");
        return;
      }

      const data = await res.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    setMovies([]);
    setSearchText("");
  };

  return (
    <div ref={navRef} className="navbar">
      {/* LEFT */}
      <div className="navbar-left">
        <img
          src={logo}
          alt="Logo"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        />
        <ul>
          <li onClick={() => navigate('/')}>Home</li>
          <li onClick={() => navigate('/tv-shows')}>TV Shows</li>
          <li onClick={() => navigate('/movies')}>Movies</li>
          <li onClick={() => navigate('/new-popular')}>New & Popular</li>
          <li onClick={() => navigate('/my-list')}>My List</li>
          <li onClick={() => navigate('/browse-by-language')}>Browse by Language</li>
        </ul>
      </div>

      {/* RIGHT */}
      <div className="navbar-right">
        {/* Search Icon */}
        <img
          src={search_icon}
          alt="Search"
          className="icons"
          onClick={handleSearchClick}
        />

        {/* Search Box */}
        {showSearch && (
          <input
            type="text"
            placeholder="Search movies..."
            className="search-box"
            value={searchText}
            onChange={(e) => {
              const value = e.target.value;
              setSearchText(value);
              fetchMovies(value);
            }}
          />
        )}

        {/* Search Results */}
        {showSearch && movies.length > 0 && (
          <div className="search-results">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="search-item"
                onClick={() => {
                  navigate(`/movie/${movie.id}`);
                  setShowSearch(false);
                  setSearchText("");
                  setMovies([]);
                }}
              >
                {movie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                  />
                )}
                <p>{movie.title}</p>
              </div>
            ))}
          </div>
        )}

        {/* Children */}
        <p style={{ cursor: 'pointer' }}>Children</p>

        {/* Bell */}
        <img src={bell_icon} alt="Notifications" className="icons" />

        {/* Profile */}
        <div
          className="navbar-profile"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <img src={profile_img} alt="Profile" className="profile" />
          <img src={caret_icon} alt="Caret" />

          {showDropdown && (
            <div className="dropdown">
              <p
                onClick={() => {
                  logout();
                  setShowDropdown(false);
                }}
              >
                Sign out of mini theatre
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;