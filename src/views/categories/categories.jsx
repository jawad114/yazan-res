import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import styles from './categories.module.css';
import AxiosRequest from '../../Components/AxiosRequest';
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
import Carousels from '../../Home/Carousels/Carousels';
import { Avatar } from "@material-tailwind/react";
import { ClockIcon } from '@heroicons/react/20/solid';
import { Phone } from '@mui/icons-material';


export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [restaurantImage, setRestaurantImage] = useState('');
  const [restaurantContact, setRestaurantContact] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState({});
  const [oldCategory, setOldCategory] = useState('');
  const [existingImageUrl, setexistingImageUrl] = useState('');
  const isOwner = localStorage.getItem('isOwner') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const [imageLoading, setImageLoading] = useState(true);
  const isClient = localStorage.getItem('isClient') === 'true';
  const [open, setOpen] = useState(false);  // State for handling login dialog
  const [openingHours, setOpeningHours] = useState(null);
  const [restaurantStatus, setRestaurantStatus] = useState('');

  const navigate = useNavigate();

  const { resName } = useParams(); // Access the resName from state

  useEffect(() => {
    if (!resName) {
      navigate('/forbidden'); // Replace with your target route
    }
  }, [resName, navigate]);

  const loggedIn = localStorage.getItem('token') !== null;

  useEffect(() => {
    if (isAdmin || isOwner || isClient || loggedIn) {
      setOpen(false);
    } else {
      setOpen(true); // Show dialog if not logged in
    }
  }, [isAdmin, isOwner, isClient, loggedIn]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateAccount = () => {
    navigate('/register-client'); // Replace with your account creation route
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await AxiosRequest.get(`/restaurant-categories/${resName}`);
        if (response.data.status === "ok") {
          setCategories(response.data.categories);
          setRestaurantImage(response.data.restaurantImage);
          setRestaurantContact(response.data.contact);
        } else if (response.data.status === "notfound") {
          setRestaurantImage(response.data.restaurantImage);
        }
      } catch (error) {
        console.log(error.message || "Internal Server Error");
      } finally {
        setLoading(false);
        setImageLoading(false);
      }
    };

    const fetchOpeningHoursAndStatus = async () => {
      try {
        const [hoursResponse, statusResponse] = await Promise.all([
          AxiosRequest.get(`/opening-hours/${resName}`),
          AxiosRequest.get(`/restaurant-status/${resName}`)
        ]);

        if (hoursResponse.status === 200) {
          setOpeningHours(hoursResponse.data.openingHours);
        }

        if (statusResponse.status === 200) {
          setRestaurantStatus(statusResponse.data.status);
        }
      } catch (error) {
        console.error('Error fetching opening hours or status:', error);
      }
    };

    fetchCategories();
    fetchOpeningHoursAndStatus();
  }, [resName]);


  

  const handleAddCategory = () => {
    navigate(`/add-category/${resName}`);
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setOldCategory(category.categoryName);
    setexistingImageUrl(category.categoryImage);
    setOpenEditDialog(true);
  };

  const handleDeleteCategory = async (categoryName) => {
    try {
      const response = await AxiosRequest.delete(`/delete-category/${resName}/${categoryName}`);
      if (response.data.status === 'ok') {
        toast.success(response.data.message);
        setCategories(categories.filter(category => category.categoryName !== categoryName));
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const handleImageUpload = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']; // Add more types as needed
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid image format. Please upload a JPG/JPEG, PNG, WEBP compressed image");
      return;
    }

    // Set the image file in the current category state
    setCurrentCategory({ ...currentCategory, categoryImage: file });
  };

  const handleUpdateCategory = async () => {
    try {
      const formData = new FormData();
      formData.append('newCategoryName', currentCategory.categoryName);
      formData.append('existingImageUrl', existingImageUrl); // Append existing image URL if available
      if (currentCategory.categoryImage) {
        formData.append('categoryImage', currentCategory.categoryImage);
      }

      const response = await AxiosRequest.put(`/update-category/${resName}/${oldCategory}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 'ok') {
        toast.success(response.data.message);

        // Update the categories state
        setCategories(categories.map(category => 
          category.categoryName === oldCategory
            ? { ...category, categoryName: currentCategory.categoryName, categoryImage: response.data.categoryImage } // Assuming the server responds with the new image URL
            : category
        ));

        setOpenEditDialog(false);
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  };

  const alt = `${resName}'s Image`;


  const getDayName = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    return days[today];
  };
  

  const dayName = getDayName();

  return (
    <div className='bg-white'>
<Carousels/>
      <div className='flex flex-col w-full items-center text-center justify-center'>
        {loading ? (
          <div className='flex justify-center items-center h-screen'>
            <CircularProgress />
          </div>
        ) : (
          <>
    {openingHours && (
  <Box 
    className='relative flex justify-between items-center w-full px-4 p-4 rounded-lg shadow-lg'
    style={{ 
      backgroundColor: restaurantStatus === 'open' ? '#d4edda' : restaurantStatus === 'busy' ? '#fff3cd' : '#f8d7da',
      border: '1px solid',
      borderColor: restaurantStatus === 'open' ? '#c3e6cb' : restaurantStatus === 'busy' ? '#ffeeba' : '#f5c6cb',
    }}
  >
    <Box className='flex flex-col justify-center'>
      <Typography
        variant='h6'
        className={restaurantStatus === 'open' ? 'text-green-600 font-bold' : restaurantStatus === 'busy' ? 'text-orange-600 font-bold' : 'text-red-600 font-bold'}
      >
        {restaurantStatus.charAt(0).toUpperCase() + restaurantStatus.slice(1)}
      </Typography>
    </Box>
    <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 z-10">
      <Avatar
        src={restaurantImage} // Replace with dynamic category image if needed
        className="w-32 h-32 border-4 border-white"
      />
    </div>
    <Box className='flex flex-col justify-center'>
      {restaurantStatus !== 'closed' ? (
        <Typography 
        variant='h6' 
        className='font-medium flex items-center'
      >
        <ClockIcon className="h-6 w-6 text-black mr-2" /> {/* Clock Icon */}
        {openingHours[dayName]?.close || 'N/A'}
      </Typography>
      ) : (
        <Typography 
          variant='h6' 
          className='font-medium'
        >
          Closed
        </Typography>
      )}
    </Box>
  </Box>
)}
    {restaurantContact && (
      <Box 
      className='relative flex justify-start items-center w-full  px-4 p-4 rounded-lg shadow-lg'
      sx={{ 
        mx: 'auto', 
        border: '1px solid #ddd',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        background: 'linear-gradient(135deg, #ff7e5f, #feb47b)', // Gradient background
        color: '#fff',
      }}
    >
      <Phone className="h-6 w-6 text-white" />
      <Typography variant="body1">
        {restaurantContact}
      </Typography>
    </Box>
)}
            <h1 className='my-5'>Menu of : {resName}</h1>
            <div>
              {categories.length === 0 ? (
                <p className='font-bold'>Category Not Found</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-[4vh]">
                  {categories.map((category, index) => (
                    <div className='flex flex-col items-center gap-4 p-4 border rounded-lg shadow-md bg-white' key={index}>
                      <img
                        src={category.categoryImage}
                        alt={`${category.categoryName}'s Image`}
                        className='w-full h-32 object-cover rounded-md'
                      />
                      <Typography className='text-lg font-semibold text-center'>Category: {category.categoryName}</Typography>
                      <Button
                        variant='contained'
                        className={styles.btn}
                        onClick={() => { navigate(`/categories/${resName}/${category.categoryName}`) }}
                      >
                        Show Items in {category.categoryName}
                      </Button>
                      {(isAdmin || isOwner) && (
                        <div className="flex space-x-2 mt-2">
                          <Button
                            variant='outlined'
                            color='primary'
                            onClick={() => handleEditCategory(category)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant='outlined'
                            color='secondary'
                            onClick={() => handleDeleteCategory(category.categoryName)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {(isAdmin || isOwner) && (
              <div className='flex w-[24vw] mb-4 items-center justify-center'>
                <Button variant="contained" className='btn-global' onClick={handleAddCategory}>Add Category</Button>
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent className='space-y-10'>
          <DialogContentText>
            To edit this category, please update the name or image and click save.
          </DialogContentText>
          <input
            type="text"
            value={currentCategory.categoryName}
            onChange={(e) => setCurrentCategory({ ...currentCategory, categoryName: e.target.value })}
            placeholder="Category Name"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files[0])}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateCategory} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className='text-center'>Alert</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You must be logged in to add items to cart.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button onClick={handleCreateAccount} color="primary">
            Create Account
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
