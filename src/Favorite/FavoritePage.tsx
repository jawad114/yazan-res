// import React, { useEffect, useState } from 'react';
// import { useFavoriteContext } from './FavoriteContext';
// import { Link, Navigate, useLocation } from 'react-router-dom';
// import './FavoritePage.css';

// const FavoritePage: React.FC = () => {
//     const location = useLocation();
//     const { state } = location;
//     const { favorites, addFavorite, removeFavorite } = useFavoriteContext();
//     const [isFavorite, setIsFavorite] = useState(false);

//     useEffect(() => {
//         // Set the document title when the component mounts
//         document.title = 'Welcome World';

//         if (state && state.name && state.image && state.location) {
//             addFavorite({ title: state.name, image: state.image, location: state.location });
//         }

//         // Clean up: Reset the document title when the component unmounts
//         return () => {
//             document.title = 'Your Default Title';
//         };
//     }, [state, addFavorite]);

//     useEffect(() => {
//         // Check if the current item is in favorites when the component mounts
//         if (state && state.name) {
//             setIsFavorite(favorites.some(favorite => favorite.title === state.name));
//         }
//     }, [state, favorites]);

//     const removeFromFavorites = () => {
//         if (state && state.name) {
//             removeFavorite(state.name);
//             setIsFavorite(false);
//         }
//     };

//     const toggleFavorite = () => {
//         if (state && state.name) {
//             if (isFavorite) {
//                 removeFavorite(state.name);
//                 setIsFavorite(false);
//             } else {
//                 addFavorite({ title: state.name, image: state.image, location: state.location });
//                 setIsFavorite(true);
//             }
//         }
//     };

//     if (!state || !state.name || !state.image || !state.location) {
//         return <Navigate to="/Favorite" />;
//     }

//     return (
//         <div className="favorite-container">
//             <h2 className="favorite-title">{state.name}</h2>
//             <img className={`favorite-image ${isFavorite ? 'favorite-active' : ''}`} src={state.image} alt={state.name} />
//             <p className="favorite-location">Location: {state.location}</p>

//             <button onClick={toggleFavorite} className={`favorite-button ${isFavorite ? 'favorite-active' : ''}`}>
//                 {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
//             </button>

//             {/* Place this Link component outside the return statement */}
//             <Link to="/Favorite" className='action-btn'>
//                 <button>Go to Favorites</button>
//             </Link>
//         </div>
//     );
// };

// export default FavoritePage;

// FavoritePage.tsx

import React, { useEffect, useState } from "react";
import { useFavoriteContext } from "./FavoriteContext";
import { Link, useLocation } from "react-router-dom";
import "./FavoritePage.css";

const FavoritePage: React.FC = () => {
  const location = useLocation();
  const { state } = location;
  const { favorites, addFavorite, removeFavorite } = useFavoriteContext();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    document.title = "Welcome World";

    if (state && state.name && state.image && state.location) {
      addFavorite({
        title: state.name,
        image: state.image,
        location: state.location,
      });
    }

    return () => {
      document.title = "Your Default Title";
    };
  }, [state, addFavorite]);

  useEffect(() => {
    if (state && state.name) {
      setIsFavorite(
        favorites.some((favorite) => favorite.title === state.name)
      );
    }
  }, [state, favorites]);

  return (
    <div className="favorite-container">
      <h2 className="favorite-title">Your Favorites</h2>
      {favorites.map((favorite) => (
        <div key={favorite.title} className="favorite-card">
          <img
            className="favorite-image"
            src={favorite.image}
            alt={favorite.title}
          />
          <p>{favorite.title}</p>
          <p>Location: {favorite.location || "N/A"}</p>
          <button onClick={() => removeFavorite(favorite.title)}>
            Remove from Favorites
          </button>
        </div>
      ))}
      <Link to="/">
        <button>Go to Home</button>
      </Link>
    </div>
  );
};

export default FavoritePage;
