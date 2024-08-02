import React from "react";
import { useFavoriteContext } from "./FavoriteContext";

const FavoriteList: React.FC = () => {
  const { favorites, removeFavorite } = useFavoriteContext();

  return (
    <div>
      <h2>Your Favorites</h2>
      <ul>
        {favorites.map((favorite) => (
          <li key={favorite.title}>
            {favorite.title} - {favorite.location}
            <button onClick={() => removeFavorite(favorite.title)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoriteList;
