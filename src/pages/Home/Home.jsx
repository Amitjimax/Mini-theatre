import React, { useEffect, useState } from 'react'
import './Home.css'
import NavBar from '../../components/Navbar/Navbar'
import play_icon from '../../assets/play_icon.png'
import info_icon from '../../assets/info_icon.png'
import TitleCards from '../../components/TitleCards/TitleCards'
import Footer from '../../components/Footer/Footer'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const [banner, setBanner] = useState(null)
  const navigate = useNavigate()

  const API_KEY = "c1d619ddf5bd92a89665b1ead84fc1cb"

  // 🎬 Fetch dynamic banner
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
        )
        const data = await res.json()

        const randomMovie =
          data.results[Math.floor(Math.random() * data.results.length)]

        setBanner(randomMovie)
      } catch (err) {
        console.error(err)
      }
    }

    fetchBanner()
  }, [])

  return (
    <div className='home'>
      <NavBar />

      {/* 🎬 HERO SECTION */}
      <div className="hero">

        {/* ✅ Dynamic Background */}
        {banner && (
          <img
            src={`https://image.tmdb.org/t/p/original${banner.backdrop_path}`}
            alt=""
            className='banner-img'
          />
        )}

        <div className="hero-caption">

          {/* ✅ Dynamic Title */}
          <h1>{banner?.title}</h1>

          {/* ✅ Dynamic Description */}
          <p>
            {banner?.overview?.slice(0, 150)}...
          </p>

          <div className="hero-btns">

            {/* ▶ PLAY */}
            <button
              className='btn'
              onClick={() => navigate(`/movie/${banner?.id}`)}
            >
              <img src={play_icon} alt="" />
              Play
            </button>

            {/* ℹ MORE INFO */}
            <button
              className='btn dark-btn'
              onClick={() => navigate(`/movie/${banner?.id}`)}
            >
              <img src={info_icon} alt="" />
              More Info
            </button>
          </div>

          {/* 🔥 KEEP YOUR EXISTING */}
          <TitleCards />
        </div>
      </div>

      {/* 🎬 MORE SECTIONS */}
      <div className="more-card">
        <TitleCards title={"Blockbuster Movies"} category={"top_rated"} />
        <TitleCards title={"Only on Mini-Theatre"} category={"popular"} />
        <TitleCards title={"Upcoming"} category={"upcoming"} />
        <TitleCards title={"Top Picks for You"} category={"now_playing"} />
      </div>

      <Footer />
    </div>
  )
}

export default Home