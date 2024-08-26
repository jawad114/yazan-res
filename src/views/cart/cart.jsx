// import React, { useState, useEffect } from 'react';
// import { Button, Typography, IconButton } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import AxiosRequest from '../../Components/AxiosRequest';
// import { useNavigate } from 'react-router-dom';
// import Carousels from '../../Home/Carousels/Carousels';

// const Cart = () => {
//   const [cart, setCart] = useState([]);
//   const [itemsCount, setItemsCount] = useState(0);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [selectedRestaurant, setSelectedRestaurant] = useState(null);
//   const [receiptTriggered, setReceiptTriggered] = useState(false); // State to trigger receipt handling
//   const customerId = localStorage.getItem('id');
//   const isClient = localStorage.getItem('isClient') === 'true';
//   const name = localStorage.getItem('name');
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!isClient) return; // Do not fetch cart if not a client

//     setLoading(true);
//     const fetchCart = async () => {
//       try {
//         const response = await AxiosRequest.get(`/get-cart/${customerId}`);
//         if (response.data.error) {
//           setError(response.data.error);
//         } else {
//           const { cart, totalItemsCount } = response.data;
//           setCart(cart);
//           setItemsCount(totalItemsCount);
//         }
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching cart:', error);
//         setLoading(false);
//       }
//     };

//     fetchCart();
//   }, [isClient, customerId]);

//   useEffect(() => {
//     if (receiptTriggered && selectedRestaurant) {
//       const handleReceipt = () => {
//         const cartDataForRestaurant = cart.map(cartItem => ({
//           ...cartItem,
//           products: cartItem.products.filter(product => product.orderFrom === selectedRestaurant)
//         }));
//         navigate(`/checkout`, { state: { cart: cartDataForRestaurant, restaurant: selectedRestaurant } });
//       };
      
//       handleReceipt();
//       setReceiptTriggered(false); // Reset trigger after handling
//     }
//   }, [receiptTriggered, selectedRestaurant, cart, navigate]);

//   const calculateTotalPrice = (products) => {
//     let totalPrice = 0;
//     if (products) {
//       products.forEach((product) => {
//         if (product && product.price) {
//           totalPrice += product.quantity * product.price;
//         }
//         if (product && product.extras && product.extras.length > 0) {
//           product.extras.forEach((extra) => {
//             if (extra.price) {
//               totalPrice += product.quantity * extra.price;
//             }
//           });
//         }
//       });
//     }
//     return totalPrice.toFixed(2); // Ensure total price is formatted to two decimal places
//   };

  // const updateQuantity = async (productId, quantity) => {
  //   try {
  //     if (quantity <= 0) return;
  //     await AxiosRequest.put(`/update-cart/${productId}`, { quantity, customerId });
  //     setCart(prevCart => 
  //       prevCart.map(cartItem => ({
  //         ...cartItem,
  //         products: cartItem.products.map(product =>
  //           product._id === productId ? { ...product, quantity } : product
  //         )
  //       }))
  //     );
  //   } catch (error) {
  //     console.error('Error updating cart item:', error);
  //   }
  // };

//   const removeFromCart = async (productId) => {
//     try {
//       await AxiosRequest.delete(`/remove-from-cart/${productId}/${customerId}`);
//       setCart(prevCart => 
//         prevCart.map(cartItem => ({
//           ...cartItem,
//           products: cartItem.products.filter(product => product._id !== productId)
//         }))
//       );
//       window.location.reload();
//     } catch (error) {
//       console.error('Error removing product from cart:', error);
//     }
//   };

//   const clearCart = async () => {
//     try {
//       await AxiosRequest.delete(`/clear-cart/${customerId}`);
//       setCart([]);
//       window.location.reload();
//     } catch (error) {
//       console.error('Error clearing cart:', error);
//     }
//   };

//   const triggerReceipt = (restaurant) => {
//     setSelectedRestaurant(restaurant);
//     setReceiptTriggered(true);
//   };

//   // Group cart items by restaurant
//   const groupedCartItems = cart.reduce((acc, cartItem) => {
//     cartItem.products.forEach((product) => {
//       if (!acc[product.orderFrom]) {
//         acc[product.orderFrom] = [];
//       }
//       acc[product.orderFrom].push(product);
//     });
//     return acc;
//   }, {});

//   return (
//     <div className='bg-white'>
//       <Carousels/>
//       <div className='p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen'>
//         {!isClient ? (
//           <div>        
//             <Typography variant="h6" className="mt-20 text-center text-red-500">
//               سجل الدخول كمستخدم أولاً
//             </Typography>
//           </div>
//         ) : error ? (
//           <div><p style={{ color: 'red' }}>{error}</p></div>
//         ) : loading ? (
//           <div>Loading...</div>
//         ) : (
//           <>
//             <div className='flex flex-col text-end mt-[2vh]'>
//               <Typography variant="h5" gutterBottom>
//                 {name ? name : ''} :السلة الخاص بك
//               </Typography>
//               <Typography variant="h5" gutterBottom>
//                 {itemsCount} :إجمالي العناصر في السلة
//               </Typography>
//             </div>
//             {Object.keys(groupedCartItems).length > 0 ? (
//               <div>
//                 {Object.keys(groupedCartItems).map((restaurant) => (
//                   <div key={restaurant} className='border p-4 my-4 bg-white rounded-lg shadow-sm'>
//                     <Typography variant="h6" className='text-center' gutterBottom>
//                       {restaurant}
//                     </Typography>
//                     {groupedCartItems[restaurant].map((product) => (
//                       <div className='flex items-center justify-between border p-4 my-4 bg-gray-100 rounded-lg' key={product._id}>
//                         <div className='gap-4'>
//                           <IconButton onClick={() => removeFromCart(product._id)} color="error">
//                             <DeleteIcon />
//                           </IconButton>
//                         </div>
//                         <div className='flex items-start' style={{ direction: 'rtl', textAlign: 'start' }}>
//                           {product && product.dishImage && (
//                             <img
//                               src={product.dishImage}
//                               alt={product.name}
//                               className='w-16 h-16 rounded-full object-cover ml-4'
//                             />
//                           )}
//                           <div>
//                             <Typography variant="h6">
//                               {product.name}
//                             </Typography>
//                             <Typography variant="body2" color="textSecondary">
//                               {product.description}
//                             </Typography>
//                             <Typography variant="body2" color="textSecondary">
//                               {product.price} ₪
//                             </Typography>
//                             {product.extras && product.extras.length > 0 && (
//                               <div style={{ direction: 'rtl', textAlign: 'start' }}>
//                                 <Typography variant="body2" className="font-semibold">
//                                   إضافات:
//                                 </Typography>
//                                 <ul className="list-disc flex flex-col">
//                                   {product.extras.map((extra, index) => (
//                                     <li key={index}>
//                                       {extra.name} : ₪ {extra.price}
//                                     </li>
//                                   ))}
//                                 </ul>
//                               </div>
//                             )}
                           
//                             <div className='flex items-center mt-2'>
//                               <IconButton onClick={() => updateQuantity(product._id, product.quantity + 1)}>
//                                 <AddCircleOutlineIcon />
//                               </IconButton>
//                               <Typography variant="body2" className='mx-2'>
//                                 {product.quantity}
//                               </Typography>
//                               <IconButton onClick={() => updateQuantity(product._id, product.quantity - 1)} disabled={product.quantity <= 1}>
//                                 <RemoveCircleOutlineIcon />
//                               </IconButton>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                     <div className='flex items-center justify-center'>
//                           <Button onClick={() => triggerReceipt(restaurant)} variant="contained" color="primary" className='mb-3 sm:mb-0'>
//                 إتمام عملية الشراء
//                 </Button>
//                           </div>
//                           <Typography variant="h6" className='text-right mt-4'>
//                               اجمالي السعر: ₪ {calculateTotalPrice(groupedCartItems[restaurant])}
//                             </Typography>
//                   </div>
//                 ))}

//                 <div className='flex flex-col sm:flex-row justify-between mt-6'>
//                   <Button onClick={clearCart} variant="contained" color="error" className='mb-3 sm:mb-0'>
//                     افراغ السلة
//                   </Button>
//                 </div>
//               </div>
//             ) : (
//               <Typography variant="body1" className='text-center mt-6'>
//                 السلة فارغة
//               </Typography>
//             )}
//           </>
//         )}
//       </div>
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
import { Spinner } from '@material-tailwind/react';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [itemsCount, setItemsCount] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [receiptTriggered, setReceiptTriggered] = useState(false); // State to trigger receipt handling
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
          setCart(cart);
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

  useEffect(() => {
    if (receiptTriggered && cart.length > 0) {
      const handleReceipt = () => {
        navigate(`/checkout`, { state: { cart } });
      };
      
      handleReceipt();
      setReceiptTriggered(false); // Reset trigger after handling
    }
  }, [receiptTriggered, cart, navigate]);

  const calculateTotalPrice = (products) => {
    let totalPrice = 0;
    if (products) {
      products.forEach((product) => {
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
    return totalPrice.toFixed(2); // Ensure total price is formatted to two decimal places
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) return;
      
      // Update the quantity in the cart API
      await AxiosRequest.put(`/update-cart/${productId}`, { quantity, customerId });
      
      // Update the quantity in the local state
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
      setCart(prevCart => prevCart.filter(product => product._id !== productId));
      window.location.reload();
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      await AxiosRequest.delete(`/clear-cart/${customerId}`);
      setCart([]);
      window.location.reload();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const triggerReceipt = () => {
    setReceiptTriggered(true);
  };

  // Assuming all products are from the same restaurant, get the `orderFrom` from the first product
  const orderFrom = cart.length > 0 && cart[0].products.length > 0 ? cart[0].products[0].orderFrom : '';

  return (
    <div className='bg-white'>
      <Carousels />
      <div className='p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen'>
        {!isClient ? (
          <div>        
            <Typography variant="h6" className="mt-20 text-center text-red-500">
              سجل الدخول كمستخدم أولاً
            </Typography>
          </div>
        ) : error ? (
          <div><p style={{ color: 'red' }}>{error}</p></div>
        ) : loading ? (
          <div className='flex items-center justify-center'>
            <Spinner className="h-12 w-12 text-black"/>
          </div>
        ) : (
          <>
            <div className='flex flex-col text-end mt-[2vh]'>
              <Typography variant="h5" gutterBottom>
                {name ? name : ''} :السلة الخاص بك
              </Typography>
              <Typography variant="h5" gutterBottom>
                {itemsCount} :إجمالي العناصر في السلة
              </Typography>
            </div>
            {cart.length > 0 ? (
              <div>
                <div className='border p-4 my-4 bg-white rounded-lg shadow-sm'>
                  <Typography variant="h6" className='text-right !font-bold text-center mt-4'>
                     {orderFrom}
                  </Typography>
                  {cart[0].products.map((product) => (
                    <div className='flex items-center justify-between border p-4 my-4 bg-gray-100 rounded-lg' key={product._id}>
                      <div className='gap-4'>
                        <IconButton onClick={() => removeFromCart(product._id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </div>
                      <div className='flex items-start' style={{ direction: 'rtl', textAlign: 'start' }}>
                        {product && product.dishImage && (
                          <img
                            src={product.dishImage}
                            alt={product.name}
                            className='w-16 h-16 rounded-full object-cover ml-4'
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
                            <div style={{ direction: 'rtl', textAlign: 'start' }}>
                              <Typography variant="body2" className="font-semibold">
                                إضافات:
                              </Typography>
                              <ul className="list-disc flex flex-col">
                                {product.extras.map((extra, index) => (
                                  <li key={index}>
                                    {extra.name} : ₪ {extra.price}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <div className='flex items-center mt-2'>
                            <IconButton onClick={() => updateQuantity(product._id, product.quantity + 1)}>
                              <AddCircleOutlineIcon />
                            </IconButton>
                            <Typography variant="body2" className='mx-2'>
                              {product.quantity}
                            </Typography>
                            <IconButton onClick={() => updateQuantity(product._id, product.quantity - 1)} disabled={product.quantity <= 1}>
                              <RemoveCircleOutlineIcon />
                            </IconButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Typography variant="h6" className='text-right mt-4'>
                    اجمالي السعر: ₪ {calculateTotalPrice(cart.flatMap(c => c.products))}
                  </Typography>
                </div>

                <div className='flex flex-col sm:flex-row justify-between mt-6'>
                  <Button onClick={clearCart} variant="contained" color="error" className='mb-3 sm:mb-0'>
                    افراغ السلة
                  </Button>
                    <Button onClick={triggerReceipt} variant="contained" color="primary" className='mb-3 sm:mb-0'>
                      إتمام عملية الشراء
                    </Button>
                </div>
              </div>
            ) : (
              <Typography variant="body1" className='text-center mt-6'>
                السلة فارغة
              </Typography>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
