import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Grid, Card, CardContent, Typography } from '@mui/material';
import AxiosRequest from '../../Components/AxiosRequest';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [restaurantDetails, setRestaurantDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const id = localStorage.getItem('id');
  const isClient = localStorage.getItem('isClient') === 'true';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await AxiosRequest.get(`/favorites/${id}`);
        setFavorites(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setLoading(false);
      }
    };

    if (isClient) {
      fetchFavorites();
    }
  }, [id, isClient]);

  useEffect(() => {
    const fetchRestaurantDetails = async (restaurantName) => {
      try {
        let headers = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        const response = await AxiosRequest.get(`/get-one-res/${restaurantName}`, { headers });
        setRestaurantDetails((prevDetails) => ({
          ...prevDetails,
          [restaurantName]: response.data.data,
        }));
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
      }
    };

    favorites.forEach((favorite) => {
      if (!restaurantDetails[favorite.restaurantName]) {
        fetchRestaurantDetails(favorite.restaurantName);
      }
    });
  }, [favorites, restaurantDetails]);

  return (
    <div className='flex flex-col justify-center'>
      {isClient ? (
        <>
          <Typography variant="h2" className="mt-4 text-center">Favorite Restaurants</Typography>
          {loading && <CircularProgress className="mt-8 mx-auto" />}
          {!loading && favorites.length === 0 && <Typography variant="h6" className="text-center">No favorites added yet.</Typography>}
          {!loading && favorites.length > 0 && (
            <Grid container spacing={2} justifyContent="center"> 
              {favorites.map((favorite) => (
                <Grid item key={favorite._id} xs={6} sm={4} md={2}>
                  {restaurantDetails[favorite.restaurantName] && (
                    <Card>
                      <CardContent>
                        <img
                          alt={favorite.restaurantName}
                          src={restaurantDetails[favorite.restaurantName].picture}
                          className="w-full h-50"
                        />
                        <Typography variant="body1" align="center" className="mt-4">Restaurant Name: {favorite.restaurantName}</Typography>
                        <Typography variant="body2" align="center">Restaurant Location: {restaurantDetails[favorite.restaurantName].location}</Typography>
                      </CardContent>
                    </Card>
                  )}
                </Grid>
              ))}
            </Grid> 
          )}
        </>
      ) : (
        <Typography variant="h6" align="center" className="mt-20 text-red-500">Login as a Client First</Typography>
      )}
    </div>
  );
};

export default Favorites;
