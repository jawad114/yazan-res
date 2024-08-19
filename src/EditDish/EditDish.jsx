// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import AxiosRequest from '../Components/AxiosRequest';
// import { toast } from 'react-toastify';

// export default function EditRestaurant() {
//   const { resName, categoryName, dishId } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [dish, setDish] = useState(null);
//   const [updatedDishName, setUpdatedDishName] = useState('');
//   const [updatedPrice, setUpdatedPrice] = useState('');
//   const [updatedDescription, setUpdatedDescription] = useState('');
//   const [imageFile, setImageFile] = useState(null);
//   const token = localStorage.getItem('token');
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!localStorage.getItem('isAdmin') && !localStorage.getItem('isOwner')) {
//       navigate('/forbidden'); // Replace with your target route
//     }
//   }, [navigate]);

//   useEffect(() => {
//     const fetchDish = async () => {
//       try {
//         let headers = {};
//         if (token) {
//           headers.Authorization = `Bearer ${token}`;
//         }
//         const response = await AxiosRequest.get(`/dishes/${dishId}`, { headers });
//         setDish(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching dish:', error);
//         setLoading(false);
//       }
//     };

//     fetchDish();
//   }, [dishId, token]);

//   const handleUpdate = async () => {
//     try {
//       const formData = new FormData();
//       formData.append('name', updatedDishName);
//       formData.append('price', updatedPrice);
//       formData.append('description', updatedDescription);
//       if (imageFile) {
//         formData.append('dishImage', imageFile);
//       }

//       let headers = {
//         'Content-Type': 'multipart/form-data'
//       };
//       if (token) {
//         headers.Authorization = `Bearer ${token}`;
//       }

//       const res = await AxiosRequest.put(`/update-dish/${resName}/${categoryName}/${dishId}`, formData, { headers });

//       console.log(res.data);

//       // Update the local state to reflect the changes
//       setDish({
//         ...dish,
//         name: updatedDishName,
//         price: updatedPrice,
//         description: updatedDescription,
//         dishImage: imageFile ? URL.createObjectURL(imageFile) : dish.dishImage
//       });

//       // Optional: Show a success message
//       toast.success('Item updated successfully');
//       navigate(-1);
//     } catch (error) {
//       console.error('Error updating item:', error);
//       toast.error('Failed to update item');
//     }
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
import { useNavigate, useParams } from 'react-router-dom';
import AxiosRequest from '../Components/AxiosRequest';
import { toast } from 'react-toastify';
import { Input, TextField } from '@mui/material';
import { Button } from '@material-tailwind/react';

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
      navigate('/forbidden');
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

      setDish({
        ...dish,
        name: updatedDishName,
        price: updatedPrice,
        description: updatedDescription,
        dishImage: imageFile ? URL.createObjectURL(imageFile) : dish.dishImage
      });

      toast.success('Item updated successfully');
      navigate(-1);
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (!dish) {
    return <div className="text-center text-red-500">Dish not found for ID: {dishId}</div>;
  }

  return (
    <div>
    <div className="max-w-xl flex flex-col mx-auto mt-8 p-6 bg-white shadow-lg mb-4 rounded-lg">
      <h2 className="text-2xl text-center font-semibold text-gray-800 mb-6">تعديل المنتج</h2>
      <form 
        className="space-y-6" 
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}>
        <div>
          <TextField
            type="text"
            variant="outlined"
            fullWidth
            label='اسم المنتج'
            value={updatedDishName}
            style={{
              textAlign: 'center', // محاذاة النص إلى المركز
              direction: 'rtl',   // تحديد اتجاه الكتابة من اليمين لليسار
            }}
            onChange={(e) => setUpdatedDishName(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-input:focus': {
                outline: 'none', // Removes the focus ring
                boxShadow: 'none',
              },
            }}
          />
        </div>
        <div>
          <TextField
            type="number"
            value={updatedPrice}
            variant="outlined"
            label="السعر"
            onChange={(e) => setUpdatedPrice(e.target.value)}
            fullWidth
            style={{
              textAlign: 'center', // محاذاة النص إلى المركز
              direction: 'rtl',   // تحديد اتجاه الكتابة من اليمين لليسار
            }}
            inputProps={{ min: 0 }}
            sx={{
              '& .MuiOutlinedInput-input:focus': {
                outline: 'none', // Removes the focus ring
                boxShadow: 'none',
              },
            }}
          />
        </div>
        <div>
          <TextField
            value={updatedDescription}
            variant="outlined"
            label='وصف المنتج'
            onChange={(e) => setUpdatedDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            style={{
              textAlign: 'center', // محاذاة النص إلى المركز
              direction: 'rtl',   // تحديد اتجاه الكتابة من اليمين لليسار
            }}
            sx={{
              '& .MuiOutlinedInput-input:focus': {
                outline: 'none', // Removes the focus ring
                boxShadow: 'none',
              },
            }}
            />
        </div>
        <div>
          <label className="block text-gray-700 text-center font-medium mb-2">
            :صورة المنتج
          </label>
          <Input
            type="file"
            accept="image/*"
            variant="outlined"
            onChange={(e) => setImageFile(e.target.files[0])}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-input:focus': {
                outline: 'none', // Removes the focus ring
                boxShadow: 'none',
              },
            }}
            />
        </div>
        <div className='flex items-center justify-center'>
        <Button 
          type="submit" 
          >
          Update
        </Button>
        </div>
      </form>
    </div>
    </div>
  );
}
