// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { Container, Typography, Button, Box,Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,IconButton } from '@mui/material';
// import styles from './categories.module.css';
// import AxiosRequest from '../../Components/AxiosRequest';
// import { toast } from 'react-toastify';
// import CircularProgress from '@mui/material/CircularProgress';
// import { useLocation,useNavigate } from 'react-router-dom';
// import CloseIcon from '@mui/icons-material/Close';



// export default function Categories() {
//   const [categories, setCategories] = useState([]);
//   const [restaurantImage, setRestaurantImage] = useState('');
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const isOwner = localStorage.getItem('isOwner') === 'true';
//   const isAdmin = localStorage.getItem('isAdmin') === 'true';
//   const isClient = localStorage.getItem('isClient') === 'true';

//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const {resName} = useParams(); // Access the resName from state

//   localStorage.setItem('resName', resName);

//     useEffect(() => {
//         if (!resName) {
//             navigate('/forbidden'); // Replace with your target route
//         }
//     }, [resName, navigate]);

//     const loggedIn = localStorage.getItem('token') !== null;


//     useEffect(() => {
//       if (isAdmin || isOwner || isClient || loggedIn) {
//           setIsLoggedIn(true);
//       } else {
//           setIsLoggedIn(false);
//           setOpen(true); // Show dialog if not logged in
//       }
//   }, [isAdmin, isOwner, isClient, loggedIn]);

//   const handleClose = () => {
//       setOpen(false);
//   };

//   const handleCreateAccount = () => {
//     navigate('/register-client'); // Replace with your account creation route
// };


//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await AxiosRequest.get(`/restaurant-categories/${resName}`);
//         if (response.data.status === "ok" ) {
//           setCategories(response.data.categories);
//           setRestaurantImage(response.data.restaurantImage);
//           console.log('Categories Data', response.data.categories);
//           console.log('Category Image', response.data.categoryImage);
//         }
//         else if (response.data.status === "notfound"){
//           setRestaurantImage(response.data.restaurantImage);
//           console.log('Restaurant Image', response.data.restaurantImage);
//           console.log('Category Not Found');
//         }
//       } catch (error) {
//           console.log(error.message || "Internal Server Error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategories();
//   }, [resName]);

//   const handleAddCategory = () => {
//     navigate(`/add-category/${resName}`);
//   };


// const alt = `${resName}'s Image`

//   return (
//     <>
//     <img src={restaurantImage} alt={alt} className="w-full h-[20vh] md:h-[64vh] object-cover mb-4" />
//     <div className='flex flex-col w-full items-center text-center justify-center'>
//     {loading ? (
//       <div className='flex justify-center items-center h-screen'>
//       <CircularProgress/>
//       </div>
//     ) : (
//       <>
//         <h1 className='my-5'>Menu of : {resName}</h1>
//         <div>
//           {categories.length === 0 ? (
//             <p className='font-bold'>Category Not Found</p>
//           ) : (
//             categories.map((category, index) => (
//               <>
//               <Container className={styles.card} key={index}>
//                 <div className='flex flex-col items-center gap-[2vh] justify-center'>
//                 <img src={category.categoryImage} alt={`${category.categoryName}'s Image`} className='w-40 md:w-[16vw] object-cover' />
//                   <Typography className='fw-bold text-center'>Category: {category.categoryName}</Typography>
//                   <Button 
//                     variant='contained'  
//                     className={styles.btn} 
//                     onClick={() => { navigate(`/categories/${resName}/${category.categoryName}`) }}
//                   >
//                     Show Dishes in this Category
//                   </Button>
//                 </div>
//               </Container>
//               <Dialog open={open} onClose={handleClose}>
//                 <DialogTitle sx={{ textAlign: 'center', position: 'relative' }}>
//                     <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//                         Notice
//                     </Typography>
//                     <IconButton
//                         aria-label="close"
//                         onClick={handleClose}
//                         sx={{
//                             position: 'absolute',
//                             right: 8,
//                             top: 8,
//                             color: (theme) => theme.palette.grey[500],
//                         }}
//                     >
//                         <CloseIcon className='text-black'/>
//                     </IconButton>
//                 </DialogTitle>
//                 <DialogContent sx={{ textAlign: 'center' }}>
//                     <DialogContentText className='text-black' sx={{ fontSize: '1.2em', marginBottom: '20px' }}>
//                         Account is necessary to place an order
//                     </DialogContentText>
//                     <DialogActions sx={{ justifyContent: 'center' }}>
//                         <Button
//                             onClick={handleCreateAccount}
//                             variant="contained"
//                             color="primary"
//                             sx={{ fontWeight: 'bold' }}
//                         >
//                             Create an account now
//                         </Button>
//                     </DialogActions>
//                 </DialogContent>
//             </Dialog>
//            </>
//             ))
//           )}
//         </div>
//         {(isAdmin || isOwner) && (
//           <div className='flex w-[24vw] mb-4 items-center justify-center'>
//             <Button variant="contained" className='btn-global' onClick={handleAddCategory}>Add Category</Button>
//           </div>
//         )}
//       </>
//     )}
//   </div>
//   </>
//   );
// }

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import styles from './categories.module.css';
import AxiosRequest from '../../Components/AxiosRequest';
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
import { useLocation, useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [restaurantImage, setRestaurantImage] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState({});
  const [oldCategory, setOldCategory] = useState('');
  const isOwner = localStorage.getItem('isOwner') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isClient = localStorage.getItem('isClient') === 'true';
  const [open, setOpen] = useState(false);  // State for handling login dialog

  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { resName } = useParams(); // Access the resName from state

  localStorage.setItem('resName', resName);

  useEffect(() => {
    if (!resName) {
      navigate('/forbidden'); // Replace with your target route
    }
  }, [resName, navigate]);

  const loggedIn = localStorage.getItem('token') !== null;

  useEffect(() => {
    if (isAdmin || isOwner || isClient || loggedIn) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
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
        } else if (response.data.status === "notfound") {
          setRestaurantImage(response.data.restaurantImage);
        }
      } catch (error) {
        console.log(error.message || "Internal Server Error");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [resName]);

  const handleAddCategory = () => {
    navigate(`/add-category/${resName}`);
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    console.log('Edit Category', category.categoryName);
    setOldCategory(category.categoryName);
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

  const handleImageUpload = async (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']; // Add more types as needed
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid image format. Please upload a JPG/JPEG, PNG, WEBP compressed image");
      return;
    }

    try {
      const resizedImage = await resizeImage(file, 400, 400); // Resize image to 100x100 (adjust as needed)
      const base64String = await convertToBase64(resizedImage);
      setCurrentCategory({ ...currentCategory, categoryImage: base64String });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleUpdateCategory = async () => {
    try {
      const response = await AxiosRequest.put(`/update-category/${resName}/${oldCategory}`, {
        newCategoryName: currentCategory.categoryName,
        categoryImage: currentCategory.categoryImage,
      });
  
      if (response.data.status === 'ok') {
        toast.success(response.data.message);
  
        // Update the categories state
        setCategories(categories.map(category => 
          category.categoryName === oldCategory
            ? { ...category, categoryName: currentCategory.categoryName, categoryImage: currentCategory.categoryImage }
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

  return (
    <>
      <img src={restaurantImage} alt={alt} className="w-full h-[20vh] md:h-[64vh] object-cover mb-4" />
      <div className='flex flex-col w-full items-center text-center justify-center'>
        {loading ? (
          <div className='flex justify-center items-center h-screen'>
            <CircularProgress />
          </div>
        ) : (
          <>
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
        <DialogTitle>Access Denied</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You must be logged in to view this page.
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
    </>
  );
}

// Helper functions for image handling
const resizeImage = (file, maxWidth, maxHeight) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height *= maxWidth / width;
          width = maxWidth;
        } else {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(blob => {
        resolve(blob);
      }, 'image/jpeg');
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
  });
};

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

