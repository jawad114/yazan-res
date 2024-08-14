// import React, { useState, useEffect } from 'react';
// import { Button, Typography, IconButton } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import AxiosRequest from '../../Components/AxiosRequest';
// import { useNavigate } from 'react-router-dom';

// const Cart = () => {
//   const [cart, setCart] = useState(null);
//   const [itemsCount, setItemsCount] = useState(0);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const customerId = localStorage.getItem('id');
//   const isClient = localStorage.getItem('isClient') === 'true';
//   const name = localStorage.getItem('name');
//   const navigate = useNavigate();

//   useEffect(() => {
//     setLoading(true);
//     const fetchCart = async () => {
//       try {
//         const response = await AxiosRequest.get(`/get-cart/${customerId}`);
//         if (response.data.error === "Cart not found") {
//           setError("Cart not found");
//         } else if (response.data.error === "Internal Server Error") {
//           setError("Internal Server Error");
//         } else {
//           const { cart, totalItemsCount } = response.data;
//           const productsWithIds = cart.products.map(product => ({
//             ...product,
//             _id: product.productId // Assuming productId is the MongoDB ObjectId
//           }));
//           setCart({ ...cart, products: productsWithIds });
//           setItemsCount(totalItemsCount);
//         }
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching cart:', error);
//         setLoading(false);
//       }
//     };

//     fetchCart();
//   }, []);

//   const calculateTotalPrice = () => {
//     let totalPrice = 0;
//     if (cart && cart.products) {
//       cart.products.forEach((product) => {
//         if (product && product.price) {
//           totalPrice += product.quantity * product.price;
//         }
//         if (product && product.extras && product.extras.length > 0) {
//           product.extras.forEach((extra) => {
//             if (extra.price) {
//               totalPrice += extra.price;
//             }
//           });
//         }
//       });
//     }
//     return totalPrice.toFixed(2); // Ensure total price is formatted to two decimal places
//   };

//   const updateQuantity = async (productId, quantity) => {
//     try {
//       if (quantity <= 0) return; // Prevent setting quantity to 0 or negative values
//       await AxiosRequest.put(`/update-cart/${productId}`, { quantity, customerId });
//       // Update local state
//       setCart(prevCart => ({
//         ...prevCart,
//         products: prevCart.products.map(product =>
//           product._id === productId ? { ...product, quantity } : product
//         )
//       }));
//     } catch (error) {
//       console.error('Error updating cart item:', error);
//     }
//   };

//   const removeFromCart = async (productId) => {
//     try {
//       await AxiosRequest.delete(`/remove-from-cart/${productId}/${customerId}`);
//       setCart(prevCart => ({
//         ...prevCart,
//         products: prevCart.products.filter(product => product._id !== productId)
//       }));
//       window.location.reload(); // Reload the page after clearing the cart
//     } catch (error) {
//       console.error('Error removing product from cart:', error);
//     }
//   };

//   const clearCart = async () => {
//     try {
//       await AxiosRequest.delete(`/clear-cart/${customerId}`);
//       setCart(null);
//       window.location.reload(); // Reload the page after clearing the cart
//     } catch (error) {
//       console.error('Error clearing cart:', error);
//     }
//   };

//   return (
//     <div className='p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen'>
//       {!isClient ? (
//         <div><p style={{ color: 'red' }}>Login as a Client First</p></div>
//       ) : error ? (
//         <div><p style={{ color: 'red' }}>{error}</p></div>
//       ) : loading ? (
//         <div>Loading...</div>
//       ) : (
//         <>
//           <div className='flex flex-col text-start mt-[2vh]'>
//             <Typography variant="h5" gutterBottom>
//               Your Cart: {name ? name : ''}
//             </Typography>
//             <Typography variant="h5" gutterBottom>
//               Total Items in Cart: {itemsCount}
//             </Typography>
//           </div>
//           {cart && cart.products.length > 0 ? (
//             <div>
//               {cart.products.map((product) => (
//                 <div className='flex items-center justify-between border p-4 my-4 bg-white rounded-lg shadow-sm' key={product._id}>
//                   <div className='flex items-start'>
//                     {product && product.dishImage && (
//                       <img
//                         src={product.dishImage}
//                         alt={product.name}
//                         className='w-16 h-16 rounded-full object-cover mr-4'
//                       />
//                     )}
//                     <div>
//                       <Typography variant="h6">
//                         {product ? product.name : 'Loading...'}
//                       </Typography>
//                       <Typography variant="body2" color="textSecondary">
//                         {product ? 'Description: ' + product.description : 'Loading...'}
//                       </Typography>
//                       <Typography variant="body2" color="textSecondary">
//                         Price: {product && product.price} ₪
//                       </Typography>
//                       {product && product.extras && product.extras.length > 0 && (
//                         <div>
//                           <Typography variant="body2" className='font-semibold'>Extras:</Typography>
//                           <ul className='list-disc ml-4'>
//                             {product.extras.map((extra, index) => (
//                               <li key={index}>{extra.name}: {extra.price} ₪</li>
//                             ))}
//                           </ul>
//                         </div>
//                       )}
//                       <div className='flex items-center mt-2'>
//                         <IconButton onClick={() => updateQuantity(product._id, product.quantity - 1)} disabled={product.quantity <= 1}>
//                           <RemoveCircleOutlineIcon />
//                         </IconButton>
//                         <Typography variant="body2" className='mx-2'>
//                           Quantity: {product.quantity}
//                         </Typography>
//                         <IconButton onClick={() => updateQuantity(product._id, product.quantity + 1)}>
//                           <AddCircleOutlineIcon />
//                         </IconButton>
//                       </div>
//                     </div>
//                   </div>
//                   <IconButton onClick={() => removeFromCart(product._id)} color="error">
//                     <DeleteIcon />
//                   </IconButton>
//                 </div>
//               ))}
//               <Typography variant="h6" className='text-right mt-4'>
//                 Total Price: {calculateTotalPrice()} ₪
//               </Typography>
//               <div className='flex flex-col sm:flex-row justify-between mt-6'>
//                 <Button onClick={clearCart} variant="contained" color="error" className='mb-3 sm:mb-0'>
//                   Clear Cart
//                 </Button>
//                 <Button onClick={() => { navigate(`/checkout`) }} variant="contained" color="primary" className='mb-3 sm:mb-0'>
//                   Checkout
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <Typography variant="body1" className='text-center mt-6'>
//               Cart is empty
//             </Typography>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Cart;

import React, { useState, useEffect } from 'react';
import { Button, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AxiosRequest from '../../Components/AxiosRequest';
import { useNavigate } from 'react-router-dom';
import Carousels from '../../Home/Carousels/Carousels';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [itemsCount, setItemsCount] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const customerId = localStorage.getItem('id');
  const isClient = localStorage.getItem('isClient') === 'true';
  const name = localStorage.getItem('name');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isClient) return; // Do not fetch cart if not a client

    setLoading(true);
    const fetchCart = async () => {
      try {
        const response = await AxiosRequest.get(`/get-cart/${customerId}`);
        if (response.data.error) {
          setError(response.data.error);
        } else {
          const { cart, totalItemsCount } = response.data;
          setCart(cart); // Set the array of cart objects
          setItemsCount(totalItemsCount);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setLoading(false);
      }
    };

    fetchCart();
  }, [isClient, customerId]);

  // Calculate the total price of all products across all carts
  const calculateTotalPrice = () => {
    let totalPrice = 0;
    cart.forEach((cartItem) => {
      if (cartItem && cartItem.products) {
        cartItem.products.forEach((product) => {
          if (product && product.price) {
            totalPrice += product.quantity * product.price;
          }
          if (product && product.extras && product.extras.length > 0) {
            product.extras.forEach((extra) => {
              if (extra.price) {
                totalPrice += product.quantity * extra.price;
              }
            });
          }
        });
      }
    });
    return totalPrice.toFixed(2); // Ensure total price is formatted to two decimal places
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) return; // Prevent setting quantity to 0 or negative values
      await AxiosRequest.put(`/update-cart/${productId}`, { quantity, customerId });
      // Update local state
      setCart(prevCart => 
        prevCart.map(cartItem => ({
          ...cartItem,
          products: cartItem.products.map(product =>
            product._id === productId ? { ...product, quantity } : product
          )
        }))
      );
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await AxiosRequest.delete(`/remove-from-cart/${productId}/${customerId}`);
      setCart(prevCart => 
        prevCart.map(cartItem => ({
          ...cartItem,
          products: cartItem.products.filter(product => product._id !== productId)
        }))
      );
      // Reload the page after removing a product
      window.location.reload();
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      await AxiosRequest.delete(`/clear-cart/${customerId}`);
      setCart([]);
      // Reload the page after clearing the cart
      window.location.reload();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return (
    <div className='bg-white'>
    <Carousels/>
    <div className='p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen'>
      {!isClient ? (
        <div>        
        <Typography variant="h6" className="mt-20 text-center text-red-500">
        Login as a Client First
      </Typography>
      </div>
      ) : error ? (
        <div><p style={{ color: 'red' }}>{error}</p></div>
      ) : loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className='flex flex-col text-start mt-[2vh]'>
            <Typography variant="h5" gutterBottom>
              Your Cart: {name ? name : ''}
            </Typography>
            <Typography variant="h5" gutterBottom>
              Total Items in Cart: {itemsCount}
            </Typography>
          </div>
          {cart.length > 0 ? (
            <div>
              {cart.map((cartItem) => (
                cartItem.products.map((product) => (
                  <div className='flex items-center justify-between border p-4 my-4 bg-white rounded-lg shadow-sm' key={product._id}>
                    <div className='flex items-start'>
                      {product && product.dishImage && (
                        <img
                          src={product.dishImage}
                          alt={product.name}
                          className='w-16 h-16 rounded-full object-cover mr-4'
                        />
                      )}
                      <div>
                        <Typography variant="h6">
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {product.description}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {product.price} ₪
                        </Typography>
                        {product.extras && product.extras.length > 0 && (
                          <div>
                            <Typography variant="body2" className='font-semibold'>Extras:</Typography>
                            <ul className='list-disc ml-4'>
                              {product.extras.map((extra, index) => (
                                <li key={index}>{extra.name}: {extra.price} ₪</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <Typography variant="body2" color="textSecondary">
                          {product.orderFrom || 'Not Found'}
                        </Typography>
                        <div className='flex items-center mt-2'>
                          <IconButton onClick={() => updateQuantity(product._id, product.quantity - 1)} disabled={product.quantity <= 1}>
                            <RemoveCircleOutlineIcon />
                          </IconButton>
                          <Typography variant="body2" className='mx-2'>
                            {product.quantity}
                          </Typography>
                          <IconButton onClick={() => updateQuantity(product._id, product.quantity + 1)}>
                            <AddCircleOutlineIcon />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                    <IconButton onClick={() => removeFromCart(product._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </div>
                ))
              ))}
              <Typography variant="h6" className='text-right mt-4'>
                Total Price: {calculateTotalPrice()} ₪
              </Typography>
              <div className='flex flex-col sm:flex-row justify-between mt-6'>
                <Button onClick={clearCart} variant="contained" color="error" className='mb-3 sm:mb-0'>
                  Clear Cart
                </Button>
                <Button onClick={() => { navigate(`/checkout`, { state: { cart } })}} variant="contained" color="primary" className='mb-3 sm:mb-0'>
                  Checkout
                </Button>
              </div>
            </div>
          ) : (
            <Typography variant="body1" className='text-center mt-6'>
              Cart is empty
            </Typography>
          )}
        </>
      )}
    </div>
    </div>
  );
};

export default Cart;
