import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Grid,
} from "@mui/material";
import CustomModal from "../modal/modal";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from '@mui/material/CircularProgress';
import AxiosRequest from "../../Components/AxiosRequest";
import { useNavigate } from 'react-router-dom';
import "./categoryDetails.module..css"

const CategoryDetails = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { resName, categoryName } = useParams();
  const [openM, setOpenM] = useState(false);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0); // State to keep track of total price
  const [selectedExtras, setSelectedExtras] = useState({}); // State to keep track of selected extras
  const [restaurantImage, setRestaurantImage] = useState('');

  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isOwner = localStorage.getItem('isOwner') === 'true';
  const isClient = localStorage.getItem('isClient') === 'true';
  const customerId = localStorage.getItem('id');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Res Name in Category Details',resName)
        const response = await AxiosRequest.get(
          `/restaurant/${resName}/category/${categoryName}/dishes`
        );
        if (response && response.data && response.data.products) {
          setProducts(response.data.products);
          setRestaurantImage(response.data.restaurantImage);
          setLoading(false);
          const initialQuantities = {};
          response.data.products.forEach((product) => {
            initialQuantities[product._id] = 1;
          });
          setQuantities(initialQuantities);
        }
        else{
          setRestaurantImage(response.data.restaurantImage);
          setLoading(false);
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
      }
    };

    fetchProducts();
  }, [resName, categoryName]);

  useEffect(() => {
    if (selectedProduct) {
      setTotalPrice(calculateTotalPrice(selectedProduct._id));
    }
  }, [quantities, selectedExtras, selectedProduct]);

  // useEffect(() => {
  //   let timer;
  //   if (openM) {
  //     timer = setTimeout(() => {
  //       setOpenM(false);
  //       handleCloseModal();
  //     }, 2000); // Change the duration as needed
  //   }

  //   // Cleanup timer on component unmount or when `openM` changes
  //   return () => clearTimeout(timer);
  // }, [openM]);

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

  const handleAddToCart = async (productId, price, name, description) => {
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
        extras,
        orderFrom: resName,
        coordinates
      });
      toast.success('Item added successfully');
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

  const toastStyle = {
    container: "max-w-sm mx-auto",
    toast: "bg-red-500 text-white font-bold",
  };
  const alt = `${resName}'s Image`

  return (
    <>
        <img src={restaurantImage} alt={alt}  className="w-full h-[20vh] md:h-[64vh] object-cover mb-4" />
    <div className="flex flex-col w-full p-5">
<div className="flex flex-col gap-4 items-center justify-center mb-5">
  <Typography
    className="fs-3 fw-bold"
    textAlign="center"
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
        <Typography className="my-4">No dishes were added yet in this category</Typography>
      ) : (
        <Grid container spacing={3}>
          {errors && <p style={{ color: 'red' }}>{errors}</p>}
          {products.map((product, index) => (
            <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
              <ListItem
                className="mt-5 mb-5 p-4 bg-light rounded-5  shadow-lg d-flex flex-column hover:cursor-pointer"
                onClick={() => handleOpenModal(product)}
              >
                <img width={100} className="d-block align-items-start" src={product.dishImage} />
                <ListItemText
                   primary={
                    <div className="text-center">
                      {product.name}
                    </div>
                  }
                  secondary={
                    <>
              <div className="flex flex-col items-center justify-center text-center">
                  <Typography variant="body2" color="textPrimary">
                        {product.description}
                      </Typography>
                      <Typography variant="body2" color="textPrimary">
                        Price: {parseFloat(product.price).toFixed(2)} ₪
                      </Typography>
                      </div>
                    </>
                  }
                />
              </ListItem>

            </Grid>
          ))}
        </Grid>
      )}
      {(isAdmin || isOwner) &&(
        <div className="flex items-center justify-center">
      <Button variant="contained" className="mt-4" onClick={handleAddDish}>
        Add Items
      </Button>
      </div>
      )}
      <CustomModal
        open={selectedProduct !== null}
        handleClose={handleCloseModal}
        body={
          selectedProduct && (
            <>
              <div className="flex flex-col text-start w-screen max-w-[70vw] md:max-w-[25vw] text-start justify-start h-screen overflow-auto max-h-[70vh] ">
               <div className="flex items-center justify-center mb-[4vh]">
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
                  Price: {parseFloat(selectedProduct.price?selectedProduct.price:0).toFixed(2)} ₪
                </Typography>

                <div >
                  <Typography variant="h6">Required Extras:</Typography>
                  {selectedProduct && selectedProduct.extras && selectedProduct.extras.requiredExtras && selectedProduct.extras.requiredExtras.length > 0 ? (
    selectedProduct.extras.requiredExtras.map((extra) => (
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
    ))
  ) : (
    <Typography variant="body2">No required extras available.</Typography>
  )}
                </div>

                <div >
                  <Typography variant="h6">Optional Extras:</Typography>
                  
                  {selectedProduct && selectedProduct.extras && selectedProduct.extras.optionalExtras && selectedProduct.extras.optionalExtras.length > 0 ? (
      selectedProduct.extras.optionalExtras.map((extra) => (
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
      ))
    ) : (
      <Typography variant="body2">No optional extras available.</Typography>
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
                  Total Price: {totalPrice} ₪
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
                        totalPrice,
                        selectedProduct.name,
                        selectedProduct.description
                      )
                    }
                  >
                    Add to Cart
                  </Button>
                  <Button
                        className="btn"
                        variant="contained"
                        onClick={() => navigate('/cart')}
                      >
                        View Cart
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
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDelete(selectedProduct._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )
        }
        
      />

{/* <CustomModal
        body={"Item added successfully!"}
        title={""}
        open={openM}
        handleClose={() => setOpenM(false)} // No action needed on close
      /> */}
          </div>
          </>
  );
};

export default CategoryDetails;


