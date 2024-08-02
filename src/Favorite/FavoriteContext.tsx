// // FavoriteContext.tsx
// import React, { createContext, useContext, useState, ReactNode } from 'react';

// interface FavoriteItem {
//   title: string;
//   image: string;
//   location: string;
// }

// interface FavoriteContextProps {
//   favorites: FavoriteItem[];
//   addFavorite: (item: FavoriteItem) => void;
//   removeFavorite: (title: string) => void;
//   getFavoritesCount: () => number;
// }

// const FavoriteContext = createContext<FavoriteContextProps | undefined>(undefined);

// interface FavoriteProviderProps {
//   children: ReactNode;
// }

// export const FavoriteProvider: React.FC<FavoriteProviderProps> = ({ children }) => {
//   const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

//   const addFavorite = (item: FavoriteItem) => {
//     // Check if the item is already in favorites
//     if (!favorites.some((fav) => fav.title === item.title)) {
//       setFavorites((prevFavorites) => [...prevFavorites, item]);
//       // Add your logic to store the favorite item details (item) in localStorage or elsewhere
//     }
//   };

//   const removeFavorite = (title: string) => {
//     setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.title !== title));
//     // Add your logic to remove the favorite item details from localStorage or elsewhere
//   };

//   const getFavoritesCount = () => favorites.length;

//   const contextValue: FavoriteContextProps = {
//     favorites,
//     addFavorite,
//     removeFavorite,
//     getFavoritesCount,
//   };

//   return <FavoriteContext.Provider value={contextValue}>{children}</FavoriteContext.Provider>;
// };

// export const useFavoriteContext = () => {
//   const context = useContext(FavoriteContext);
//   if (!context) {
//     throw new Error('useFavoriteContext must be used within a FavoriteProvider');
//   }
//   return context;
// };

// FavoriteContext.tsx

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";

interface FavoriteItem {
  title: string;
  image: string;
  location: string;
}

interface FavoriteContextProps {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (title: string) => void;
  getFavoritesCount: () => number;
}

const FavoriteContext = createContext<FavoriteContextProps | undefined>(
  undefined
);

const favoriteReducer = (
  state: FavoriteItem[],
  action: { type: string; payload?: any }
): FavoriteItem[] => {
  switch (action.type) {
    case "ADD_FAVORITE":
      if (!state.some((fav) => fav.title === action.payload.title)) {
        return [...state, action.payload];
      }
      return state;

    case "REMOVE_FAVORITE":
      return state.filter((fav) => fav.title !== action.payload);

    default:
      return state;
  }
};

export const FavoriteProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const storedFavorites = localStorage.getItem("favorites");
  const initialFavorites: FavoriteItem[] = storedFavorites
    ? JSON.parse(storedFavorites)
    : [];

  const [favorites, dispatch] = useReducer(favoriteReducer, initialFavorites);

  useEffect(() => {
    // Update localStorage when favorites change
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (item: FavoriteItem) => {
    dispatch({ type: "ADD_FAVORITE", payload: item });
  };

  const removeFavorite = (title: string) => {
    dispatch({ type: "REMOVE_FAVORITE", payload: title });
  };

  const getFavoritesCount = () => favorites.length;

  const contextValue: FavoriteContextProps = {
    favorites,
    addFavorite,
    removeFavorite,
    getFavoritesCount,
  };

  return (
    <FavoriteContext.Provider value={contextValue}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavoriteContext = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error(
      "useFavoriteContext must be used within a FavoriteProvider"
    );
  }
  return context;
};
