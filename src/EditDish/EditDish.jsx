import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AxiosRequest from '../Components/AxiosRequest';

export default function EditRestaurant() {
  const { resName,categoryName, dishId } = useParams();
  const [loading, setLoading] = useState(true);
  const [dish, setDish] = useState(null);
  const [updatedDishName, setUpdatedDishName] = useState('');
  const [updatedPrice, setUpdatedPrice] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const token = localStorage.getItem('token');
  console.log(token);

  useEffect(() => {
    const fetchDish = async () => {
      try {
        let headers = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        const response = await AxiosRequest.get(`/dishes/${dishId}`,{headers});
        setDish(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dish:', error);
        setLoading(false);
      }
    };

    fetchDish();
  }, [resName, dishId]);

  const handleUpdate = async () => {
    try {
      const base64Image = await convertToBase64(imageFile);
      let headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
     const res= await AxiosRequest.put(`/update-dish/${resName}/${categoryName}/${dishId}`, {
        name: updatedDishName,
        price: updatedPrice,
        description: updatedDescription,
        dishImage: base64Image
      }, { headers });
      console.log(res.data)
      // Redirect back to the home screen after updating
      window.location.replace('/');
    } catch (error) {
      console.error('Error updating dish:', error);
      alert('Failed to update dish');
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!dish) {
    return <div>Dish not found for ID: {dishId}</div>;
  }

  return (
    <div>
      <h2>Edit Dish</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleUpdate();
      }}>
        <label>
          Dish Name:
          <input
            type="text"
            value={updatedDishName}
            onChange={(e) => setUpdatedDishName(e.target.value)}
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            value={updatedPrice}
            onChange={(e) => setUpdatedPrice(e.target.value)}
          />
        </label>
        <label>
          Description:
          <input
            type="text"
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
          />
        </label>
        <label>
          Dish Image:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </label>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
