// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate, useParams } from 'react-router-dom';
// import AxiosRequest from '../Components/AxiosRequest';
// import { toast } from 'react-toastify';

// export default function EditRestaurant() {
//   const { resName,categoryName, dishId } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [dish, setDish] = useState(null);
//   const [updatedDishName, setUpdatedDishName] = useState('');
//   const [updatedPrice, setUpdatedPrice] = useState('');
//   const [updatedDescription, setUpdatedDescription] = useState('');
//   const [imageFile, setImageFile] = useState(null);
//   const token = localStorage.getItem('token');
//   console.log(token);
//   const isAdmin = localStorage.getItem('isAdmin') === 'true';
//   const isOwner = localStorage.getItem('isOwner') === 'true';
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!isAdmin && !isOwner) {
//         navigate('/forbidden'); // Replace with your target route
//     }
// }, [isAdmin, isOwner, navigate]);

//   useEffect(() => {
//     const fetchDish = async () => {
//       try {
//         let headers = {};
//         if (token) {
//           headers.Authorization = `Bearer ${token}`;
//         }
//         const response = await AxiosRequest.get(`/dishes/${dishId}`,{headers});
//         setDish(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching dish:', error);
//         setLoading(false);
//       }
//     };

//     fetchDish();
//   }, [resName, dishId]);


//   const handleUpdate = async () => {
//     try {
//       const base64Image = imageFile ? await convertToBase64(imageFile) : dish.dishImage; // Use the existing image if no new file is selected
//       let headers = {};
//       if (token) {
//         headers.Authorization = `Bearer ${token}`;
//       }
  
//       const res = await AxiosRequest.put(`/update-dish/${resName}/${categoryName}/${dishId}`, {
//         name: updatedDishName,
//         price: updatedPrice,
//         description: updatedDescription,
//         dishImage: base64Image
//       }, { headers });
  
//       console.log(res.data);
  
//       // Update the local state to reflect the changes
//       setDish({
//         ...dish,
//         name: updatedDishName,
//         price: updatedPrice,
//         description: updatedDescription,
//         dishImage: base64Image
//       });
  
//       // Optional: Show a success message
//       toast.success('Dish updated successfully');
//       navigate(-1);
//     } catch (error) {
//       console.error('Error updating dish:', error);
//       toast.error('Failed to update dish');
//     }
//   };
  

//   const convertToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = (error) => reject(error);
//     });
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!dish) {
//     return <div>Dish not found for ID: {dishId}</div>;
//   }

//   return (
//     <div>
//       <h2>Edit Dish</h2>
//       <form onSubmit={(e) => {
//         e.preventDefault();
//         handleUpdate();
//       }}>
//         <label>
//           Dish Name:
//           <input
//             type="text"
//             value={updatedDishName}
//             onChange={(e) => setUpdatedDishName(e.target.value)}
//           />
//         </label>
//         <label>
//           Price:
//           <input
//             type="number"
//             value={updatedPrice}
//             onChange={(e) => setUpdatedPrice(e.target.value)}
//           />
//         </label>
//         <label>
//           Description:
//           <input
//             type="text"
//             value={updatedDescription}
//             onChange={(e) => setUpdatedDescription(e.target.value)}
//           />
//         </label>
//         <label>
//           Dish Image:
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => setImageFile(e.target.files[0])}
//           />
//         </label>
//         <button type="submit">Update</button>
//       </form>
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import AxiosRequest from '../Components/AxiosRequest';
import { toast } from 'react-toastify';

export default function EditRestaurant() {
  const { resName, categoryName, dishId } = useParams();
  const [loading, setLoading] = useState(true);
  const [dish, setDish] = useState(null);
  const [updatedDishName, setUpdatedDishName] = useState('');
  const [updatedPrice, setUpdatedPrice] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('isAdmin') && !localStorage.getItem('isOwner')) {
      navigate('/forbidden'); // Replace with your target route
    }
  }, [navigate]);

  useEffect(() => {
    const fetchDish = async () => {
      try {
        let headers = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        const response = await AxiosRequest.get(`/dishes/${dishId}`, { headers });
        setDish(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dish:', error);
        setLoading(false);
      }
    };

    fetchDish();
  }, [dishId, token]);

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('name', updatedDishName);
      formData.append('price', updatedPrice);
      formData.append('description', updatedDescription);
      if (imageFile) {
        formData.append('dishImage', imageFile);
      }

      let headers = {
        'Content-Type': 'multipart/form-data'
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await AxiosRequest.put(`/update-dish/${resName}/${categoryName}/${dishId}`, formData, { headers });

      console.log(res.data);

      // Update the local state to reflect the changes
      setDish({
        ...dish,
        name: updatedDishName,
        price: updatedPrice,
        description: updatedDescription,
        dishImage: imageFile ? URL.createObjectURL(imageFile) : dish.dishImage
      });

      // Optional: Show a success message
      toast.success('Item updated successfully');
      navigate(-1);
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    }
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
