import React, { useEffect, useRef, useState } from 'react'
import './TitleCards.css'
import cards_data from '../../assets/cards/Cards_data'

const TitleCards = ({ title, category }) => {
  const [apiData, setApiData] = useState([]);
  const cardsRef = useRef(null);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
    }
  };

  const handlewheel = (event) => {
    event.preventDefault();
    if (cardsRef.current) {
      cardsRef.current.scrollLeft += event.deltaY;
    }
  };

  useEffect(() => {
    // ✅ fetch data
    fetch(
      `https://api.themoviedb.org/3/movie/${category?category:"now_playing"}?language=en-US&page=1`,
      options
    )
      .then((res) => res.json())
      .then((res) => setApiData(res.results))
      .catch((err) => console.error(err));

    // ✅ add event safely
    const currentRef = cardsRef.current;
    if (currentRef) {
      currentRef.addEventListener('wheel', handlewheel);
    }

    // ✅ cleanup (VERY IMPORTANT)
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('wheel', handlewheel);
      }
    };
  }, []);

  return (
    <div className="title-cards">
      <h2>{title ? title : "Popular on Mini Theater"}</h2>

      <div className="card-list" ref={cardsRef}>
        {apiData.map((card) => (
          <div className="card" key={card.id}>
            <img
              src={`https://image.tmdb.org/t/p/w500` + card.backdrop_path}
              alt={card.original_title}
            />
            <p>{card.original_title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TitleCards;