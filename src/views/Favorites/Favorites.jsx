import React, { useState, useEffect } from 'react';
import { CircularProgress, Grid, Card, CardContent, Typography } from '@mui/material';
import AxiosRequest from '../../Components/AxiosRequest';
import Carousels from '../../Home/Carousels/Carousels';

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
  }, [id, isClient,token]);

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
    <div className='bg-white'>
      <Carousels/>
    <div className="flex flex-col items-center p-4">
      {isClient ? (
        <>
          <Typography variant="h4" className="mt-4 text-center mb-4 font-semibold">
          المتاجر المفضلة
          </Typography>
          {loading ? (
            <CircularProgress className="mt-8" />
          ) : (
            <>
              {favorites.length === 0 ? (
                <Typography variant="h6" className="mt-8 text-center">
                  لم تتم إضافة أي مفضلات بعد
                </Typography>
              ) : (
                <Grid container spacing={4} className="mt-8 justify-start">
                  {favorites.map((favorite) => (
                    <Grid item key={favorite._id} xs={12} sm={6} md={4} lg={3}>
                      {restaurantDetails[favorite.restaurantName] && (
                        <Card className="shadow-lg rounded-lg overflow-hidden">
                          <img
                            alt={favorite.restaurantName}
                            src={restaurantDetails[favorite.restaurantName].picture}
                            className="w-full h-40 object-cover"
                          />
                          <CardContent>
                            <Typography variant="h6" className="text-center text-gray-800">
                              {favorite.restaurantName}
                            </Typography>
                            <Typography variant="body2" className="text-center text-gray-600">
                              {restaurantDetails[favorite.restaurantName].location}
                            </Typography>
                          </CardContent>
                        </Card>
                      )}
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}
        </>
      ) : (
        <Typography variant="h6" className="mt-20 text-center text-red-500">
          سجل الدخول كعميل أولاً
        </Typography>
      )}
    </div>
    </div>
  );
};

export default Favorites;
