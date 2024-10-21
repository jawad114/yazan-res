import React, { useState, useEffect,Suspense,lazy } from 'react';
import { Button, Typography, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AxiosRequest from '../../Components/AxiosRequest';
import { useNavigate } from 'react-router-dom';
import EmptyCart from '../../../src/assets/EmptyCart.jpeg';
import { ReactComponent as LoadingSpinner } from '../../../src/assets/LoadingSpinner.svg'; // Adjust path as needed
import { toast } from 'react-toastify';
const Carousels = lazy(() => import('../../Home/Carousels/Carousels'));

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [itemsCount, setItemsCount] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [receiptTriggered, setReceiptTriggered] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponFeedback, setCouponFeedback] = useState('');
  const [originalTotalPrice, setOriginalTotalPrice] = useState(0);
  const [discountedTotalPrice, setDiscountedTotalPrice] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false); // Track if a coupon is applied
  const [appliedCouponCode, setAppliedCouponCode] = useState('');
  const customerId = localStorage.getItem('id');
  const isClient = localStorage.getItem('isClient') === 'true';
  const name = localStorage.getItem('name');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isClient) return;

    const fetchCart = async () => {
      try {
        const response = await AxiosRequest.get(`/get-cart/${customerId}`);
        if (response.data.error) {
          setError(response.data.error);
        } else {
          const { cart, totalItemsCount } = response.data;
          setCart(cart);
          setItemsCount(totalItemsCount);
          const totalPrice = calculateTotalPrice(cart.flatMap(c => c.products));
          setOriginalTotalPrice(totalPrice);
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
    // Recalculate the total price whenever the cart changes
    const totalPrice = calculateTotalPrice(cart.flatMap(c => c.products));
    setOriginalTotalPrice(totalPrice);
  
    // If a coupon is applied, recalculate the discounted total price
    if (isCouponApplied) {
      const discountPercentage = (100 - (discountedTotalPrice / originalTotalPrice) * 100);
      const newTotalPrice = (totalPrice * (1 - discountPercentage / 100)).toFixed(2);
      setDiscountedTotalPrice(newTotalPrice);
    }
  }, [cart]);


  useEffect(() => {
    if (receiptTriggered && cart.length > 0) {
      const handleReceipt = () => {
        // Conditionally include discountedTotalPrice in the state if it's greater than 0
        const stateToSend = { cart };
        if (discountedTotalPrice > 0) {
          stateToSend.discountedTotalPrice = discountedTotalPrice;
          stateToSend.couponCode = appliedCouponCode;
          console.log('Sending discountedTotalPrice from cart',discountedTotalPrice);
          console.log('Coupon Code Applied',appliedCouponCode);
          console.log('State to send from cart',stateToSend);
        }
        
        navigate(`/checkout`, { state: stateToSend });
      };
      
      handleReceipt();
      setReceiptTriggered(false); // Reset trigger after handling
    }
  }, [receiptTriggered, cart, discountedTotalPrice,appliedCouponCode, navigate]);
  

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
    return totalPrice.toFixed(2);
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) return;
      await AxiosRequest.put(`/update-cart/${productId}`, { quantity, customerId });
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

  const applyCoupon = async () => {
    try {
      if (isCouponApplied) {
        setCouponFeedback('Coupon already applied. Only one coupon can be used at a time.');
        return;
      }
      
      const orderAmount = originalTotalPrice;
      const response = await AxiosRequest.post('/coupon/apply-coupon', {
        userId: customerId,
        couponCode,
        orderAmount,
        resName: orderFrom
      });
console.log('Response',response);
      if (response.status === 200) {
        console.log('In applying coupon success',response);
        const discountPercentage = response.data.discount;
        const newTotalPrice = (originalTotalPrice * (1 - discountPercentage / 100)).toFixed(2);
        setDiscountedTotalPrice(newTotalPrice);
        setAppliedCouponCode(response.data.coupon);
        // setCouponFeedback(`Coupon applied successfully! Discount: ${discountPercentage}%`);
        setCouponFeedback(`تم تطبيق القسيمة بنجاح! الخصم: ${discountPercentage}%`);

        setIsCouponApplied(true); // Set coupon applied state to true
      } else {
        setCouponFeedback(response.data.message);
        setDiscountedTotalPrice(originalTotalPrice); // Reset to original if coupon application fails
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error(<div style={{direction:'rtl'}}>{error.response.data.message}</div>)
    }
  };

  const orderFrom = cart.length > 0 && cart[0].products.length > 0 ? cart[0].products[0].orderFrom : '';

return (
  <div className='bg-white'>
     <Suspense fallback={
              <div className="flex items-center bg-white justify-center min-h-screen font-poppins">
              <LoadingSpinner width="200" height="200" />
            </div>
      }>
        <Carousels />
      </Suspense>
    <div className='p-4 md:p-6 lg:p-8 bg-white min-h-screen'>
      {!isClient ? (
        <div>        
          <Typography variant="h6" className="mt-20 text-center text-red-500">
            سجل الدخول كمستخدم أولاً
          </Typography>
        </div>
      ) : error ? (
        <div><p style={{ color: 'red' }}>{error}</p></div>
      ) : loading ? (
        <div className="flex items-center bg-white justify-center min-h-screen font-poppins">
        <LoadingSpinner width="200" height="200" />
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
                 {/* ₪ {calculateTotalPrice(cart.flatMap(c => c.products))} */}
                 <div style={{direction:'rtl'}}>
                <Typography variant="h6" className='text-right mt-4'>
                  
                {discountedTotalPrice ? (
                      <>
                          <div className="flex flex-col items-start mt-4 gap-2" >
                        <span style={{ textDecoration: 'line-through', color: 'red', marginRight: '8px' }}>
                        {/* اجمالي السعر: {originalTotalPrice} ₪ */}
                        اجمالي السعر: {calculateTotalPrice(cart.flatMap(c => c.products))} ₪          
                        </span>
                        اجمالي السعر: {discountedTotalPrice} ₪
                        </div>
                      </>
                    ) : (
                      `اجمالي السعر: ${calculateTotalPrice(cart.flatMap(c => c.products))} ₪`
                    )}
                    </Typography>
                    </div>

              </div>
              <div className='mt-4'>
                    <div  style={{direction:'rtl'}}>
                    {!isCouponApplied && (
                      <>
                      <Typography variant="h6" className='text-right mt-2 mb-2'>
                      لديك رمز قسيمة؟ استخدمه هنا.
                      </Typography>
  <div className="relative flex items-center justify-center">
    <TextField
      placeholder="رمز القسيمة"
      variant="outlined"
      value={couponCode}
      onChange={(e) => setCouponCode(e.target.value)}
      fullWidth
      sx={{
        '& .MuiOutlinedInput-input:focus': {
          outline: 'none',
          boxShadow: 'none',
        },
      }}
    />
    <Button
      variant="contained"
      color="primary"
      onClick={applyCoupon}
      sx={{ position: 'absolute', left: 6, top: 8 }}
    >
      تطبيق القسيمة
    </Button>
  </div>
  </>
)}

</div>

                    {couponFeedback && (
                      <div style={{direction:'rtl'}}>
                      <Typography variant="h6" className="mt-2 !font-bold">
                        {couponFeedback}
                      </Typography>
                      </div>
                    )}
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
            <>
            <Typography variant="body1" className='text-center mt-6'>
            السلة فارغة
          </Typography>
            <div className="flex justify-center items-start">
              <img src={EmptyCart} width={300}/>
            </div>
            </>
          )}
        </>
      )}
    </div>
  </div>
);
};

export default Cart;

