import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 🔥 Firebase
import { db, auth } from '../../firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

const MyList = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyList = async () => {
      const user = auth.currentUser;

      if (!user) return;

      try {
        const q = query(
          collection(db, "myList"),
          where("userId", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map(doc => doc.data());
        setMovies(data);

      } catch (err) {
        console.log(err);
      }
    };

    fetchMyList();
  }, []);

  return (
    <div style={{ padding: "20px", background: "black", minHeight: "100vh", color: "white" }}>
      <h1>My List</h1>

      {/* ❌ Empty case */}
      {movies.length === 0 && (
        <p>No movies added yet 😢</p>
      )}

      {/* ✅ Movies */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {movies.map((movie) => (
          <div 
            key={movie.id} 
            style={{ cursor: "pointer", width: "150px" }}
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt=""
                style={{ width: "100%", borderRadius: "5px" }}
              />
            )}
            <p>{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyList