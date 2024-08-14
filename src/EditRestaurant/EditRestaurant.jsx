// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import AxiosRequest from '../Components/AxiosRequest';
// import { TextField } from '@mui/material';

// export default function EditRestaurant() {
//   const { resName } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [restaurant, setRestaurant] = useState(null);
//   const [updatedName, setUpdatedName] = useState('');
//   const [updatedContact, setUpdatedContact] = useState('');
//   const [updatedLocation, setUpdatedLocation] = useState('');
//   const [restaurantImage, setRestaurantImage] = useState(null); // For storing selected file
//   const token = localStorage.getItem('token');
//   const isAdmin = localStorage.getItem('isAdmin') === 'true';
//   const isOwner = localStorage.getItem('isOwner') === 'true';
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!isAdmin && !isOwner) {
//         navigate('/forbidden'); // Replace with your target route
//     }
//   }, [isAdmin, isOwner, navigate]);

//   useEffect(() => {
//     const fetchRestaurant = async () => {
//       try {
//         let headers = {};
//         if (token) {
//           headers.Authorization = `Bearer ${token}`;
//         }
//         const response = await AxiosRequest.get(`/get-one-res/${resName}`, { headers });
//         setRestaurant(response.data);
//         setUpdatedName(response.data.restaurantName);
//         setUpdatedLocation(response.data.location);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching restaurant:', error);
//         setLoading(false);
//       }
//     };

//     fetchRestaurant();
//   }, [resName, token]);

//   const handleFileChange = (e) => {
//     setRestaurantImage(e.target.files[0]); // Store selected file
//   };

//   const handleUpdate = async () => {
//     const formData = new FormData();
//     formData.append('newRestaurantName', updatedName || '');
//     formData.append('newLocation', updatedLocation || '');
//     formData.append('newContact', updatedContact || '');
//     if (restaurantImage) {
//       formData.append('restaurantImage', restaurantImage); // Append image file
//     }

//     try {
//       const response = await AxiosRequest.put(`/update-restaurant/${resName}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       alert('Restaurant updated successfully');
//       localStorage.setItem('name', response.data.name);
//       localStorage.setItem('resName', response.data.resName);

//       // Redirect back to the home screen after updating
//       window.location.replace('/');
//     } catch (error) {
//       console.error('Error updating restaurant:', error);
//       alert('Failed to update restaurant');
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!restaurant) {
//     return <div>Restaurant not found for ID: {resName}</div>;
//   }

//   return (
//     <div>
//       <h2>Edit Restaurant</h2>
//       <form onSubmit={(e) => {
//         e.preventDefault();
//         handleUpdate();
//       }}>
//         <label>
//           Restaurant Name:
//           <input
//             type="text"
//             value={updatedName}
//             onChange={(e) => setUpdatedName(e.target.value)}
//           />
//         </label>
//         <TextField
//               label="Phone Number"
//               variant="outlined"
//               fullWidth
//               value={updatedContact}
//               sx={{
//                 '& .MuiOutlinedInput-input:focus': {
//                   outline: 'none', // Removes the focus ring
//                   boxShadow: 'none',
//                 },
//               }}
//               onChange={(e) => {
//                 const newPhoneNumber = e.target.value;
//                 if (/^\d{0,10}$/.test(newPhoneNumber)) {
//                   setUpdatedContact(newPhoneNumber);
//                 } else {
//                   alert("Please enter numbers only for the phone number 10 numbers max.");
//                 }
//               }}
//               required />
//         <label>
//           Location:
//           <input
//             type="text"
//             value={updatedLocation}
//             onChange={(e) => setUpdatedLocation(e.target.value)}
//           />
//         </label>
//         <label>
//           Restaurant Image:
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileChange}
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
import { TextField, Button, Typography, Grid, Paper, Input } from '@mui/material';
import { InsertPhotoOutlined } from '@mui/icons-material';
import { toast } from 'react-toastify';

export default function EditRestaurant() {
  const { resName } = useParams();
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedContact, setUpdatedContact] = useState('');
  const [updatedLocation, setUpdatedLocation] = useState('');
  const [restaurantImage, setRestaurantImage] = useState(null);
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isOwner = localStorage.getItem('isOwner') === 'true';
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin && !isOwner) {
      navigate('/forbidden');
    }
  }, [isAdmin, isOwner, navigate]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await AxiosRequest.get(`/get-one-res/${resName}`, { headers });
        setRestaurant(response.data);
        setUpdatedName(response.data.restaurantName);
        setUpdatedLocation(response.data.location);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [resName, token]);

  const handleFileChange = (e) => {
    setRestaurantImage(e.target.files[0]);
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('newRestaurantName', updatedName || '');
    formData.append('newLocation', updatedLocation || '');
    formData.append('newContact', updatedContact || '');
    if (restaurantImage) {
      formData.append('restaurantImage', restaurantImage);
    }

    try {
      const response = await AxiosRequest.put(`/update-restaurant/${resName}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Restaurant updated successfully');
      localStorage.setItem('name', response.data.name);
      localStorage.setItem('resName', response.data.resName);
      navigate('/');
    } catch (error) {
      console.error('Error updating restaurant:', error);
      toast.error('Failed to update restaurant');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!restaurant) {
    return <div>Restaurant not found for ID: {resName}</div>;
  }

  return (
    <Paper elevation={3} sx={{ padding: 3, maxWidth: 600, margin: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        Edit Restaurant
      </Typography>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleUpdate();
      }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Restaurant Name"
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-input:focus': {
                  outline: 'none', // Removes the focus ring
                  boxShadow: 'none',
                },
              }}
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-input:focus': {
                  outline: 'none', // Removes the focus ring
                  boxShadow: 'none',
                },
              }}
              value={updatedContact}
              onChange={(e) => {
                const newPhoneNumber = e.target.value;
                if (/^\d{0,10}$/.test(newPhoneNumber)) {
                  setUpdatedContact(newPhoneNumber);
                } else {
                  alert("Please enter numbers only for the phone number (10 digits max).");
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Location"
              variant="outlined"
              fullWidth
              value={updatedLocation}
              sx={{
                '& .MuiOutlinedInput-input:focus': {
                  outline: 'none', // Removes the focus ring
                  boxShadow: 'none',
                },
              }}
              onChange={(e) => setUpdatedLocation(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
              <Input
                type="file"
                variant="outlined"
                accept="image/*"
                sx={{
                  '& .MuiOutlinedInput-input:focus': {
                    outline: 'none', // Removes the focus ring
                    boxShadow: 'none',
                  },
                }}
                onChange={handleFileChange}
                fullWidth
              />
          </Grid>
          <Grid item xs={12}>
            <div className='flex items-center justify-center mt-4'>
            <Button variant="contained" color="primary" type="submit">
              Update
            </Button>
            </div>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
