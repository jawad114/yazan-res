import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AxiosRequest from '../Components/AxiosRequest';

export default function EditRestaurant() {
  const { resName } = useParams();
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedLocation, setUpdatedLocation] = useState('');
  const token = localStorage.getItem('token');
  console.log(token);


  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        let headers = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        const response = await AxiosRequest.get(`/get-one-res/${resName}`, { headers });
        setRestaurant(response.data);
        // setUpdatedName(response.data.name);
        // setUpdatedLocation(response.data.location);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [resName]);

  const handleUpdate = async () => {
    try {
      const response = await AxiosRequest.put(`/update-restaurant/${resName}`, {
        newRestaurantName: updatedName,
        newLocation: updatedLocation
      });
      alert('Restaurant updated successfully');
      localStorage.setItem('name', response.data.name);
      localStorage.setItem('resName', response.data.resName);

      // Redirect back to the home screen after updating
      window.location.replace('/');
    } catch (error) {
      console.error('Error updating restaurant:', error);
      alert('Failed to update restaurant');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!restaurant) {
    return <div>Restaurant not found for ID: {resName}</div>;
  }

  return (
    <div>
      <h2>Edit Restaurant</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleUpdate();
      }}>
        <label>
          Restaurant Name:
          <input
            type="text"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
          />
        </label>
        <label>
          Location:
          <input
            type="text"
            value={updatedLocation}
            onChange={(e) => setUpdatedLocation(e.target.value)}
          />
        </label>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
