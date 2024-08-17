import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  ListItem,
  ListItemText,
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  Button,
  Grid,
  Box
} from "@mui/material";
import { Avatar } from "@material-tailwind/react";
import { ClockIcon, PhoneArrowDownLeftIcon, PhoneArrowUpRightIcon, PhoneIcon } from "@heroicons/react/20/solid";
import CustomModal from "../modal/modal";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from '@mui/material/CircularProgress';
import AxiosRequest from "../../Components/AxiosRequest";
import { useNavigate } from 'react-router-dom';
import "./categoryDetails.module..css"
import Carousels from "../../Home/Carousels/Carousels";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import OldPhoneIcon from '../../assets/landline.png';

const CategoryDetails = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { resName, categoryName } = useParams();
  const [openM, setOpenM] = useState(false);
  const [errors, setErrors] = useState([]);
  const [imageLoading, setImageLoading] = useState(true);
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0); // State to keep track of total price
  const [selectedExtras, setSelectedExtras] = useState({}); // State to keep track of selected extras
  const [restaurantImage, setRestaurantImage] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
  const [openingHours, setOpeningHours] = useState(null);
  const [restaurantStatus, setRestaurantStatus] = useState('');
  const [restaurantContact, setRestaurantContact] = useState('');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isOwner = localStorage.getItem('isOwner') === 'true';
  const isClient = localStorage.getItem('isClient') === 'true';
  const customerId = localStorage.getItem('id');
  const token = localStorage.getItem('token');
  const [showFullDescription, setShowFullDescription] = useState(false);
const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await AxiosRequest.get(
            `/restaurant/${resName}/category/${categoryName}/dishes`
          );
          if (response && response.data && response.data.products) {
            let filteredProducts = response.data.products;
    
            // Filter products based on user role
            if (!isOwner && !isAdmin){
              filteredProducts = response.data.products.filter(product => product.visibility !== false);
            }
    
            setProducts(filteredProducts);
            setRestaurantImage(response.data.restaurantImage);
            setRestaurantContact(response.data.contact);
            setCategoryImage(response.data.categoryImage);
            setLoading(false);
            setImageLoading(false);
    
            const initialQuantities = {};
            filteredProducts.forEach((product) => {
              initialQuantities[product._id] = 1;
            });
            setQuantities(initialQuantities);
          } else {
            setRestaurantImage(response.data.restaurantImage);
            setLoading(false);
            setImageLoading(false);
          }
        } catch (error) {
          if (error.response && error.response.data && error.response.data.error) {
            if (!toast.isActive("errorToast")) {
              toast.error(error.response.data.error, { toastId: "errorToast" });
            }
          } else {
            if (!toast.isActive("errorToast")) {
              toast.error("An error occurred", { toastId: "errorToast" });
            }
          }
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
   fetchProducts();
   fetchOpeningHoursAndStatus();
  }, [resName, categoryName,isOwner,isAdmin]);

  useEffect(() => {
    if (selectedProduct) {
      setTotalPrice(calculateTotalPrice(selectedProduct._id));
    }
  }, [quantities, selectedExtras, selectedProduct]);

  useEffect(() => {
    if (selectedProduct && selectedProduct.extras && Array.isArray(selectedProduct.extras.requiredExtras) && selectedProduct.extras.requiredExtras.length > 0) {
      const firstExtraId = selectedProduct.extras.requiredExtras[0]._id;
      setSelectedExtras({ [firstExtraId]: true });
    } else {
      // Clear selection if there are no required extras
      setSelectedExtras({});
    }
  }, [selectedProduct]);

  const handleQuantityChange = (productId, change) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max(1, prevQuantities[productId] + change),
    }));
  };

  const handleReadMoreClick = () => {
    setOpenDialog(true);
  };
  
  // Add this function to handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleRequiredExtraChange = (extraId) => {
    setSelectedExtras((prevSelectedExtras) => {
      const updatedSelectedExtras = { ...prevSelectedExtras };
      selectedProduct.extras.requiredExtras.forEach((extra) => {
        updatedSelectedExtras[extra._id] = false;
      });
      updatedSelectedExtras[extraId] = true;
      return updatedSelectedExtras;
    });
  };

  const handleOptionalExtraChange = (extraId) => {
    setSelectedExtras((prevSelectedExtras) => ({
      ...prevSelectedExtras,
      [extraId]: !prevSelectedExtras[extraId],
    }));
  };

  const calculateTotalPrice = (productId) => {
    if (!selectedProduct) return 0;

    let total = selectedProduct.price * quantities[productId]; // Start with the product price
    // Add the price of the selected extras
    const allExtras = [
      ...(selectedProduct.extras.requiredExtras || []),
      ...(selectedProduct.extras.optionalExtras || [])
    ];
    allExtras.forEach((extra) => {
      if (selectedExtras[extra._id]) {
        total += extra.price * quantities[productId] || 0; // Check if extra.price is valid
      }
    });
    return total.toFixed(2); // Return the total price with 2 decimal places
  };

  const handleAddDish = () => {
    navigate(`/add-dish/${resName}/${categoryName}`);
  };

  const handleAddToCart = async (productId, price,dishImage, name, description) => {
    try {
      const resStatus = await AxiosRequest.get(`/restaurant-status/${resName}`);
      const { status, coordinates } = resStatus.data;
      console.log(status);
      if (status === 'closed' || status === 'busy') {
        toast.error(`Cannot add item to cart. Restaurant is ${status}.`);
        return;
      }
      const quantity = quantities[productId];
      const selectedRequiredExtras = selectedProduct.extras.requiredExtras.filter(extra => selectedExtras[extra._id]);
      const selectedOptionalExtras = selectedProduct.extras.optionalExtras.filter(extra => selectedExtras[extra._id]);
      const extras = selectedRequiredExtras.concat(selectedOptionalExtras).map(extra => ({ name: extra.name, price: extra.price }));
      console.log("ResName:", resName);
      const response = await AxiosRequest.post(`/add-to-cart/${customerId}`, {
        name,
        description,
        price,
        productId,
        quantity,
        dishImage,
        extras,
        orderFrom: resName,
        coordinates
      });
      toast.success('Item added successfully', {
        duration: 2000, 
      });
      handleCloseModal();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        if (!toast.isActive("errorToast")) {
          toast.error(error.response.data.error, { toastId: "errorToast" });
        }
      } else {
        if (!toast.isActive("errorToast")) {
          toast.error("An error occurred", { toastId: "errorToast" });
        }
      }
    }
  };

  const handleEdit = (product) => {
    // Navigate to the edit screen if user is admin or owner
    if (isAdmin || isOwner) {
      navigate(`/edit/${resName}/${categoryName}/${product._id}`);
    }
  };

  const handleDelete = async (productId) => {
    // Delete the product if user is admin or owner
    if (isAdmin || isOwner) {
      // Ask for confirmation before deleting
      const confirmed = window.confirm('Are you sure you want to delete this product?');

      if (confirmed) {
        try {
          // Send delete request to server
          await AxiosRequest.delete(`/delete-dish/${resName}/${categoryName}/${productId}`);
          window.alert('Item deleted successfully');
          // Reload the page to reflect changes
          window.location.reload();
        } catch (error) {
          // Error handling
          console.error('Error deleting product:', error);
        }
      } else {
        // If user cancels deletion
        console.log('Deletion canceled.');
      }
    }
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setTotalPrice(product.price * quantities[product._id]); // Set initial total price
    const initialExtras = {};
    if (product.extras.requiredExtras) {
      product.extras.requiredExtras.forEach((extra) => {
        initialExtras[extra._id] = false;
      });
    }
    if (product.extras.optionalExtras) {
      product.extras.optionalExtras.forEach((extra) => {
        initialExtras[extra._id] = false;
      });
    }
    setSelectedExtras(initialExtras);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setTotalPrice(0); // Reset total price when modal is closed
    setSelectedExtras({});
  };
  const getTextDirection = (text) => {
    const rtlCharRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB1D-\uFB4F\uFE70-\uFEFF]/;
    return rtlCharRegex.test(text) ? 'rtl' : 'ltr';
  }

  const toastStyle = {
    container: "max-w-sm mx-auto",
    toast: "bg-red-500 text-white font-bold",
  };
  const alt = `${resName}'s Image`

  const getDayName = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    return days[today];
  };
  

  const dayName = getDayName();


  const toggleVisibility = async (productId, currentVisibility) => {
    try {
      const newVisibility = !currentVisibility;
      await AxiosRequest.put(`/update-dish-visibility/${resName}/${categoryName}/${productId}`, { visibility: newVisibility },{
        headers:{
          Authorization : `Bearer ${token}`
        }
      });
      // Update local state to reflect the change
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId ? { ...product, visibility: newVisibility } : product
        )
      );
      toast.success(`Dish visibility updated to ${newVisibility ? 'visible' : 'hidden'}`);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        if (!toast.isActive("errorToast")) {
          toast.error(error.response.data.error, { toastId: "errorToast" });
        }
      } else {
        if (!toast.isActive("errorToast")) {
          toast.error("An error occurred", { toastId: "errorToast" });
        }
      }
    }
  };
  

  return (
    <div className='bg-white'>
    <img src={categoryImage} alt={alt}  className="w-full h-[36vh] md:h-[70vh] object-cover" />
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
      {restaurantStatus === 'open' ? (
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
          {restaurantStatus.charAt(0).toUpperCase() + restaurantStatus.slice(1)}
        </Typography>
      )}
    </Box>
  </Box>
)}
  {/* {restaurantContact && (
 <div className='relative flex justify-start items-center w-full  px-4 p-4' >
    <a href={`tel:${restaurantContact}`} className="text-blue-500 hover:cursor-pointer">
 <PhoneIcon width={30} color="blue"/>
 </a>
</div>
)} */}

{restaurantContact && (
        <div className="relative flex items-center justify-start w-full px-4 py-2 ">
          <a 
            href={`tel:${restaurantContact}`} 
            className="flex items-center space-x-3 hover:bg-blue-100 p-2 rounded-lg transition-colors duration-300"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full">
            <img src={OldPhoneIcon} width={30}/>
            </div>
          </a>
        </div>
      )}

 <div className="flex flex-col w-full p-5">
<div className="flex flex-col gap-4 items-center justify-center mb-2">
  <Typography
    className="fs-3 fw-bold text-center"
    variant="h4"
  >
    {categoryName}
  </Typography>
</div>
      {loading ? (
        <div className='flex items-center justify-center mx-auto'>
          <CircularProgress />
        </div>
      ) : products.length === 0 ? (
        <Typography className="my-4">لم تُضاف أي منتجات بعد في هذه الفئة</Typography>
      ) : (
        <Grid container spacing={3}>
          {errors && <p style={{ color: 'red' }}>{errors}</p>}
          {products.map((product, index) => (
<Grid key={index} item xs={12} sm={6} md={4} lg={3}>
<ListItem
  className="mt-5 mb-5 p-0 bg-light rounded-5 shadow-lg d-flex flex-column"
>
<div className="relative">
          <img
            className="object-cover w-full h-40 hover:cursor-pointer"
            onClick={() => handleOpenModal(product)}
            src={product.dishImage}
            alt={product.name}
          />
          {(isAdmin || isOwner) && (
            <div
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => toggleVisibility(product._id, product.visibility)}
            >
          {product.visibility === false ? (
                        <VisibilityOff fontSize="small"  sx={{
                          color:'blue'
                        }} />
                      ) : (
                        <Visibility fontSize="small" sx={{
                          color:'blue'
                        }}
                        />
                      )}
            </div>
          )}
        </div>
  <ListItemText
    primary={
      <div className="text-center">
        {product.name}
      </div>
    }
    secondary={
      <>
        <div className="flex flex-col p-2 items-center justify-center text-center">
          <Typography variant="body2" color="textPrimary">
            {product.description.length > 20 ? (
              <>
                {showFullDescription === product.id
                  ? product.description
                  : getTextDirection(product.description) === 'ltr'
                  ? product.description.substring(0, 20) + '...'
                  : '...' + product.description.substring(0, 20)
                }
                <div>
                  <Typography
                    component="span"
                    color="primary"
                    onClick={() => handleReadMoreClick(product.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {showFullDescription === product.id ? 'Read Less' : 'Read More'}
                  </Typography>
                </div>
              </>
            ) : (
              product.description
            )}
          </Typography>
          <Typography variant="body2" color="textPrimary">
          ₪ {parseFloat(product.price).toFixed(2)} :السعر
          </Typography>
        </div>
      </>
    }
  />
</ListItem>

<Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle className="text-center">الوصف</DialogTitle>
        <DialogContent>
          <Typography className={`${getTextDirection(product.description) === 'ltr' ? 'text-start' :'text-end'}`}>{product.description}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
          اغلق
          </Button>
        </DialogActions>
      </Dialog>
</Grid>
          ))}
        </Grid>
      )}
      {(isAdmin || isOwner) &&(
        <div className="flex items-center justify-center">
      <Button variant="contained" className="mt-4" onClick={handleAddDish}>
      اضافة منتجات جديدة
      </Button>
      </div>
      )}
      <CustomModal
        open={selectedProduct !== null}
        handleClose={handleCloseModal}
        body={
          selectedProduct && (
 <>
              <div className="flex flex-col text-start w-screen max-w-[70vw] md:max-w-[25vw] text-start justify-start h-full overflow-auto max-h-[70vh] ">
               <div className="flex items-center justify-center  mb-[4vh]">
                <img
                  className="md:w-[20vw] object-cover"
                  src={selectedProduct.dishImage}
                />
                </div>
                <ListItemText className="mb-[2vh] text-3xl">
                  {selectedProduct.name}
                </ListItemText>
                <ListItemText className="mb-[2vh] text-base">
                  {selectedProduct.description}
                </ListItemText>
                <Typography className="mb-[2vh] text-base">
                 ₪ {parseFloat(selectedProduct.price?selectedProduct.price:0).toFixed(2)} :السعر
                </Typography>

                <div >
                {selectedProduct && selectedProduct.extras && selectedProduct.extras.requiredExtras && selectedProduct.extras.requiredExtras.length > 0 ? (
                 <>
                <Typography variant="h6" className="text-start">:اضافات اجبارية قم باختيار اضافة واحدة فقط</Typography>
           {selectedProduct.extras.requiredExtras.map((extra) => (
           <div key={extra._id} className="flex items-center space-x-2">
             <input
          type="radio"
          id={extra._id}
          name="requiredExtra"
          value={extra._id}
          checked={selectedExtras[extra._id] || false}
          onChange={() => handleRequiredExtraChange(extra._id)}
          className="ml-1 mr-2"
        />
        <label htmlFor={extra._id} className="flex-1 flex justify-between items-center">
          <span>{extra.name}</span>
          <span>{extra.price ? extra.price.toFixed(2) : '0.00'} ₪</span>
        </label>
      </div>
    ))}
  </>
   ) : null}

                </div>

                <div >
                  
                  {selectedProduct && selectedProduct.extras && selectedProduct.extras.optionalExtras && selectedProduct.extras.optionalExtras.length > 0 ? (
                            <>
                            <Typography variant="h6" className="text-start">:اضافات اختيارية يمكن طلب اكثر من اضافة</Typography>
  
      {selectedProduct.extras.optionalExtras.map((extra) => (
  <div key={extra._id} className="flex items-center space-x-2">
  <input
            type="checkbox"
            id={extra._id}
            name="optionalExtra"
            value={extra._id}
            checked={selectedExtras[extra._id] || false}
            onChange={() => handleOptionalExtraChange(extra._id)}
            className="ml-1 mr-2"
          />
 <label htmlFor={extra._id} className="flex-1 flex justify-between items-center">
    <span>{extra.name}</span>
    <span>{extra.price ? extra.price.toFixed(2) : '0.00'} ₪</span>
  </label>
        </div>
        
      ))}
      </>
    ) : (
      null
    )}
                </div>
                {(isClient) && (
              <>
                <div className="flex items-center justify-center mt-[2vh]">
                  <Button onClick={() => handleQuantityChange(selectedProduct._id, -1)} disabled={quantities[selectedProduct._id] === 1}>
                    <RemoveIcon />
                  </Button>
                  <Typography className="mx-2">{quantities[selectedProduct._id]}</Typography>
                  <Button onClick={() => handleQuantityChange(selectedProduct._id, 1)}>
                    <AddIcon />
                  </Button>
                </div>
                <div className="flex items-center justify-center mt-[2vh]">
                <Typography className="text-base">
                 ₪ {totalPrice} :اجمالي السعر
                </Typography>
                </div>
                </>
                      )}

                <div className="flex flex-col gap-4 justify-center items-center mt-4 w-full">
                {(isClient) && (
                  <>
                  <Button
                    className="btn"
                    onClick={() =>
                      handleAddToCart(
                        selectedProduct._id,
                        selectedProduct.price,
                        selectedProduct.dishImage,
                        selectedProduct.name,
                        selectedProduct.description
                      )
                    }
                  >
                    أضف إلى السلة
                  </Button>
                  <Button
                        className="btn"
                        variant="contained"
                        onClick={() => navigate('/cart')}
                      >
                        عرض السلة
                      </Button>
                      </>
                      )}
                  {(isAdmin || isOwner) && (
                    <div className="flex flex-col justify-center md:flex-row md:justify-between md:space-x-[8vw] gap-4 md:gap-0  mt-4">
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEdit(selectedProduct)}
                      >
                        تعديل
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDelete(selectedProduct._id)}
                      >
                        حذف
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )
        }
        
      />
          </div>
          </div>
  );
};

export default CategoryDetails;


