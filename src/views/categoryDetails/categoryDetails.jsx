// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import {
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   Button,
//   Grid,
// } from "@mui/material";
// import CustomModal from "../modal/modal";
// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import CircularProgress from '@mui/material/CircularProgress';
// import AxiosRequest from "../../Components/AxiosRequest";

// const CategoryDetails = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [quantities, setQuantities] = useState({});
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const { resName, categoryName } = useParams();
//   const [openM, setOpenM] = useState(false);
//   const [errors, setErrors] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [selectedExtras, setSelectedExtras] = useState({});

//   const isAdmin = localStorage.getItem('isAdmin') === 'true';
//   const isOwner = localStorage.getItem('isOwner') === 'true';
//   const isClient = localStorage.getItem('isClient') === 'true';
//   const customerId = localStorage.getItem('id');

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await AxiosRequest.get(
//           `/restaurant/${resName}/category/${categoryName}/dishes`
//         );
//         if (response && response.data && response.data.products) {
//           setProducts(response.data.products);
//           setLoading(false);
//           const initialQuantities = {};
//           response.data.products.forEach((product) => {
//             initialQuantities[product._id] = 1;
//           });
//           setQuantities(initialQuantities);
//         }
//       } catch (error) {
//         if (error.response && error.response.data && error.response.data.error) {
//           if (!toast.isActive("errorToast")) {
//             toast.error(error.response.data.error, { toastId: "errorToast" });
//           }
//         } else {
//           if (!toast.isActive("errorToast")) {
//             toast.error("An error occurred", { toastId: "errorToast" });
//           }
//         }
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [resName, categoryName]);

//   useEffect(() => {
//     if (selectedProduct) {
//       setTotalPrice(calculateTotalPrice(selectedProduct._id));
//     }
//   }, [quantities, selectedExtras]);

//   const handleQuantityChange = (productId, change) => {
//     setQuantities((prevQuantities) => ({
//       ...prevQuantities,
//       [productId]: Math.max(1, prevQuantities[productId] + change),
//     }));
//   };

  // const handleRequiredExtraChange = (extraId) => {
  //   setSelectedExtras((prevSelectedExtras) => {
  //     const updatedSelectedExtras = { ...prevSelectedExtras };
  //     selectedProduct.extras.requiredExtras.forEach((extra) => {
  //       updatedSelectedExtras[extra._id] = false;
  //     });
  //     updatedSelectedExtras[extraId] = true;
  //     return updatedSelectedExtras;
  //   });
  // };

  // const handleOptionalExtraChange = (extraId) => {
  //   setSelectedExtras((prevSelectedExtras) => ({
  //     ...prevSelectedExtras,
  //     [extraId]: !prevSelectedExtras[extraId],
  //   }));
  // };

//   const calculateTotalPrice = (productId) => {
//     let total = selectedProduct.price * quantities[productId];
//     Object.entries(selectedExtras).forEach(([id, isSelected]) => {
//       if (isSelected) {
//         const extraPrice = selectedProduct.extras.requiredExtras.concat(selectedProduct.extras.optionalExtras).find(extra => extra._id === id).price;
//         total += extraPrice;
//       }
//     });
//     return total.toFixed(2);
//   };

//   const handleAddDish = () => {
//     window.location.replace(`/add-dish/${resName}/${categoryName}`);
//   };

//   const handleAddToCart = async (productId, price, name, description) => {
//     try {
//       const resStatus = await AxiosRequest.get(`/restaurant-status/${resName}`);
//       const { status, coordinates } = resStatus.data;
//       if (status === 'closed' || status === 'busy') {
//         toast.error(`Cannot add item to cart. Restaurant is ${status}.`);
//         return;
//       }
//       const quantity = quantities[productId];
//       const selectedRequiredExtras = selectedProduct.extras.requiredExtras.filter(extra => selectedExtras[extra._id]);
//       const selectedOptionalExtras = selectedProduct.extras.optionalExtras.filter(extra => selectedExtras[extra._id]);
//       const extras = selectedRequiredExtras.concat(selectedOptionalExtras).map(extra => ({ name: extra.name, price: extra.price }));
//       const response = await AxiosRequest.post(`/add-to-cart/${customerId}`, {
//         name,
//         description,
//         price,
//         productId,
//         quantity,
//         extras,
//         orderFrom: resName,
//         coordinates
//       });
//       setOpenM(true);
//     } catch (error) {
//       if (error.response && error.response.data && error.response.data.error) {
//         if (!toast.isActive("errorToast")) {
//           toast.error(error.response.data.error, { toastId: "errorToast" });
//         }
//       } else {
//         if (!toast.isActive("errorToast")) {
//           toast.error("An error occurred", { toastId: "errorToast" });
//         }
//       }
//     }
//   };

//   const handleEdit = (product) => {
//     if (isAdmin || isOwner) {
//       window.location.replace(`/edit/${resName}/${categoryName}/${product._id}`);
//     }
//   };

//   const handleDelete = async (productId) => {
//     if (isAdmin || isOwner) {
//       const confirmed = window.confirm('Are you sure you want to delete this product?');
//       if (confirmed) {
//         try {
//           await AxiosRequest.delete(`/delete-dish/${resName}/${categoryName}/${productId}`);
//           window.location.reload();
//         } catch (error) {
//           console.error('Error deleting product:', error);
//         }
//       } else {
//         console.log('Deletion canceled.');
//       }
//     }
//   };

//   const handleOpenModal = (product) => {
//     setSelectedProduct(product);
//     setTotalPrice(product.price * quantities[product._id]);
//     const initialExtras = {};
//     product.extras.requiredExtras.forEach((extra) => {
//       initialExtras[extra._id] = false;
//     });
//     product.extras.optionalExtras.forEach((extra) => {
//       initialExtras[extra._id] = false;
//     });
//     setSelectedExtras(initialExtras);
//   };

//   const handleCloseModal = () => {
//     setSelectedProduct(null);
//     setTotalPrice(0);
//     setSelectedExtras({});
//   };

//   return (
//     <div className="flex flex-col w-full items-center justify-center p-5">
//       <Typography
//         className="mb-5 fs-3 fw-bold"
//         textAlign={"center"}
//         variant="h4"
//       >
//         {categoryName} Dishes
//       </Typography>
//       {loading ? (
//         <div className='flex items-center justify-center mx-auto'>
//           <CircularProgress />
//         </div>
//       ) : products.length === 0 ? (
//         <Typography className="my-4">No dishes were added yet in this category</Typography>
//       ) : (
//         <Grid container spacing={3}>
//           {errors && <p style={{ color: 'red' }}>{errors}</p>}
//           {products.map((product, index) => (
//             <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
//               <ListItem
//                 className="mt-5 mb-5 p-4 bg-light rounded-5 shadow-lg d-flex flex-column"
//                 onClick={() => handleOpenModal(product)}
//               >
//                 <img width={100} className="d-block align-items-start" src={product.dishImage} />
//                 <ListItemText
//                   primary={product.name}
//                   secondary={
//                     <>
//                       <Typography variant="body2" color="textPrimary">
//                         {product.description}
//                       </Typography>
//                       <Typography variant="body2" color="textPrimary">
//                         Price: {parseFloat(product.price).toFixed(2)} ₪
//                       </Typography>
//                     </>
//                   }
//                 />
//               </ListItem>
//             </Grid>
//           ))}
//         </Grid>
//       )}
//       {(isAdmin || isOwner) && (
//         <div className="flex w-[24vw] mt-4">
//           <Button variant="contained" className="btn-global" onClick={handleAddDish}>
//             Add Dish
//           </Button>
//         </div>
//       )}

//       <CustomModal
//         open={selectedProduct !== null}
//         handleClose={handleCloseModal}
//         body={
//           selectedProduct && (
//             <>
//               <div className="flex flex-col items-start justify-center h-screen overflow-auto max-h-[70vh] ">
//                 <img
//                   className="md:mt-[40vh] md:w-[20vw] items-center"
//                   src={selectedProduct.dishImage}
//                 />
//                 <ListItemText className="mt-5 mb-2 text-3xl">
//                   {selectedProduct.name}
//                 </ListItemText>
//                 <ListItemText className="mb-3 text-base">
//                   {selectedProduct.description}
//                 </ListItemText>
//                 <Typography className="mb-3 text-base">
//                   Price: {parseFloat(selectedProduct.price).toFixed(2)} ₪
//                 </Typography>

//                 <div className="ml-4">
//                   <Typography variant="h6">Required Extras:</Typography>
//                   {selectedProduct.extras.requiredExtras.map((extra) => (
//                     <div key={extra._id}>
//                       <input
//                         type="radio"
//                         id={extra._id}
//                         name="requiredExtra"
//                         value={extra._id}
//                         checked={selectedExtras[extra._id] || false}
//                         onChange={() => handleRequiredExtraChange(extra._id)}
//                       />
//                       <label htmlFor={extra._id}>{extra.name} - {extra.price.toFixed(2)} ₪</label>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="ml-4">
//                   <Typography variant="h6">Optional Extras:</Typography>
//                   {selectedProduct.extras.optionalExtras.map((extra) => (
//                     <div key={extra._id}>
//                       <input
//                         type="checkbox"
//                         id={extra._id}
//                         name="optionalExtra"
//                         value={extra._id}
//                         checked={selectedExtras[extra._id] || false}
//                         onChange={() => handleOptionalExtraChange(extra._id)}
//                       />
//                       <label htmlFor={extra._id}>{extra.name} - {extra.price.toFixed(2)} ₪</label>
//                     </div>
//                   ))}
//                 </div>
//                 {(isClient) && (
// <>
//                 <div className="flex items-center mt-4">
//                   <Button onClick={() => handleQuantityChange(selectedProduct._id, -1)} disabled={quantities[selectedProduct._id] === 1}>
//                     <RemoveIcon />
//                   </Button>
//                   <Typography className="mx-2">{quantities[selectedProduct._id]}</Typography>
//                   <Button onClick={() => handleQuantityChange(selectedProduct._id, 1)}>
//                     <AddIcon />
//                   </Button>
//                 </div>
//                 <Typography className="mt-4 text-base">
//                   Total Price: {totalPrice} ₪
//                 </Typography>
//                 </>
//                       )}

//                 <div className="flex flex-col gap-4 justify-center items-center mt-4 w-full">
//                 {(isClient) && (
//                   <>
//                   <Button
//                     className="btn-global text-white"
//                     onClick={() =>
//                       handleAddToCart(
//                         selectedProduct._id,
//                         totalPrice,
//                         selectedProduct.name,
//                         selectedProduct.description
//                       )
//                     }
//                   >
//                     Add to Cart
//                   </Button>
//                   <Button
//                         className="btn-global w-100"
//                         variant="contained"
//                         onClick={() => window.location.replace('/cart')}
//                       >
//                         View Cart
//                       </Button>
//                       </>
//                       )}
//                   {(isAdmin || isOwner) && (
//                     <div className="flex flex-row justify-between w-[25vw] mt-4">
//                       <Button
//                         variant="outlined"
//                         color="primary"
//                         onClick={() => handleEdit(selectedProduct)}
//                       >
//                         Edit
//                       </Button>
//                       <Button
//                         variant="outlined"
//                         color="secondary"
//                         onClick={() => handleDelete(selectedProduct._id)}
//                       >
//                         Delete
//                       </Button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </>
//           )
//         }
//       />

// <CustomModal
//         body={"Item added successfully!"}
//         title={""}
//         open={openM}
//         handleClose={() => setOpenM(false)} // No action needed on close
//       />
//           </div>
//   );
// };

// export default CategoryDetails;

import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from '@mui/material/CircularProgress';
import AxiosRequest from "../../Components/AxiosRequest";

const CategoryDetails = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { resName, categoryName } = useParams();
  const [openM, setOpenM] = useState(false);
  const [errors, setErrors] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0); // State to keep track of total price
  const [selectedExtras, setSelectedExtras] = useState({}); // State to keep track of selected extras

  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isOwner = localStorage.getItem('isOwner') === 'true';
  const isClient = localStorage.getItem('isClient') === 'true';
  const customerId = localStorage.getItem('id');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await AxiosRequest.get(
          `/restaurant/${resName}/category/${categoryName}/dishes`
        );
        if (response && response.data && response.data.products) {
          setProducts(response.data.products);
          setLoading(false);
          const initialQuantities = {};
          response.data.products.forEach((product) => {
            initialQuantities[product._id] = 1;
          });
          setQuantities(initialQuantities);
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
        total += extra.price || 0; // Check if extra.price is valid
      }
    });
    return total.toFixed(2); // Return the total price with 2 decimal places
  };

  const handleAddDish = () => {
    window.location.replace(`/add-dish/${resName}/${categoryName}`);
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
      setOpenM(true);
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
      window.location.replace(`/edit/${resName}/${categoryName}/${product._id}`);
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

  return (
    <div className="flex flex-col w-full items-center justify-center p-5">
      <Typography
        className="mb-5 fs-3 fw-bold"
        textAlign={"center"}
        variant="h4"
      >
        {categoryName} Dishes
      </Typography>
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
                className="mt-5 mb-5 p-4 bg-light rounded-5  shadow-lg d-flex flex-column"
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
      {(isAdmin && isOwner) &&(
      <Button variant="contained" className="mt-4" onClick={handleAddDish}>
        Add Dish
      </Button>
      )}
      <CustomModal
        open={selectedProduct !== null}
        handleClose={handleCloseModal}
        body={
          selectedProduct && (
            <>
              <div className="flex flex-col items-start justify-start h-screen overflow-auto max-h-[70vh] ">
               <div className="flex items-center justify-center">
                <img
                  className="md:w-[20vw] object-cover items-center"
                  src={selectedProduct.dishImage}
                />
                </div>
                <ListItemText className="mt-5 mb-2 text-3xl">
                  {selectedProduct.name}
                </ListItemText>
                <ListItemText className="mb-3 text-base">
                  {selectedProduct.description}
                </ListItemText>
                <Typography className="mb-3 text-base">
                  Price: {parseFloat(selectedProduct.price?selectedProduct.price:0).toFixed(2)} ₪
                </Typography>

                <div className="ml-4">
                  <Typography variant="h6">Required Extras:</Typography>
                  {selectedProduct && selectedProduct.extras && selectedProduct.extras.requiredExtras && selectedProduct.extras.requiredExtras.length > 0 ? (
    selectedProduct.extras.requiredExtras.map((extra) => (
      <div key={extra._id}>
        <input
          type="radio"
          id={extra._id}
          name="requiredExtra"
          value={extra._id}
          checked={selectedExtras[extra._id] || false}
          onChange={() => handleRequiredExtraChange(extra._id)}
        />
        <label htmlFor={extra._id}>
          {extra.name} - {extra.price ?extra.price.toFixed(2):0} ₪
        </label>
      </div>
    ))
  ) : (
    <Typography variant="body2">No required extras available.</Typography>
  )}
                </div>

                <div className="ml-4">
                  <Typography variant="h6">Optional Extras:</Typography>
                  
                  {selectedProduct && selectedProduct.extras && selectedProduct.extras.optionalExtras && selectedProduct.extras.optionalExtras.length > 0 ? (
      selectedProduct.extras.optionalExtras.map((extra) => (
        <div key={extra._id}>
          <input
            type="checkbox"
            id={extra._id}
            name="optionalExtra"
            value={extra._id}
            checked={selectedExtras[extra._id] || false}
            onChange={() => handleOptionalExtraChange(extra._id)}
          />
          <label htmlFor={extra._id}>
            {extra.name} - {extra.price ?extra.price.toFixed(2):0} ₪
          </label>
        </div>
      ))
    ) : (
      <Typography variant="body2">No optional extras available.</Typography>
    )}
                </div>
                {(isClient) && (
<>
                <div className="flex items-center mt-4">
                  <Button onClick={() => handleQuantityChange(selectedProduct._id, -1)} disabled={quantities[selectedProduct._id] === 1}>
                    <RemoveIcon />
                  </Button>
                  <Typography className="mx-2">{quantities[selectedProduct._id]}</Typography>
                  <Button onClick={() => handleQuantityChange(selectedProduct._id, 1)}>
                    <AddIcon />
                  </Button>
                </div>
                <Typography className="mt-4 text-base">
                  Total Price: {totalPrice} ₪
                </Typography>
                </>
                      )}

                <div className="flex flex-col gap-4 justify-center items-center mt-4 w-full">
                {(isClient) && (
                  <>
                  <Button
                    className="btn-global text-white"
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
                        className="btn-global w-100"
                        variant="contained"
                        onClick={() => window.location.replace('/cart')}
                      >
                        View Cart
                      </Button>
                      </>
                      )}
                  {(isAdmin || isOwner) && (
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:gap-0 w-[25vw] mt-4">
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

<CustomModal
        body={"Item added successfully!"}
        title={""}
        open={openM}
        handleClose={() => setOpenM(false)} // No action needed on close
      />
          </div>
  );
};

export default CategoryDetails;


