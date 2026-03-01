import React, { useEffect, useState } from 'react'
import './Player.css'
import back_arrow_icon from '../../assets/back_arrow_icon.png'
import { useParams, useNavigate } from 'react-router-dom'

const Player = () => {

  const { id } = useParams();        
  const navigate = useNavigate();    

  const [apiData, setApiData] = useState({
    name: "",
    key: "",
    published_at: "",
    type: ""
  });

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
    }
  };

  useEffect(() => {
    if (!id) return; 

    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options)
      .then(res => res.json())
      .then(res => {
        if (!res.results) return;

        
        const trailer = res.results.find(
          (video) => video.site === "YouTube" && video.type === "Trailer"
        );

        setApiData(trailer || res.results[0] || {});
      })
      .catch(err => console.error(err));
  }, [id]); 

  return (
    <div className='player'>

    
      <img
        src={back_arrow_icon}
        alt="back"
        onClick={() => navigate(-1)}
        style={{ cursor: "pointer" }}
      />

     
      {apiData?.key ? (
        <iframe
          src={`https://www.youtube.com/embed/${apiData.key}`}
          frameBorder="0"
          width='90%'
          height='90%'
          title='trailer'
          allowFullScreen
        ></iframe>
      ) : (
        <p style={{ color: "white" }}>Trailer not available</p>
      )}

      <div className="player-info">
        <p>{apiData.published_at}</p>
        <p>{apiData.name}</p>
        <p>{apiData.type}</p>
      </div>

    </div>
  )
}

export default Player