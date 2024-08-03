import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Typography } from '@mui/material'; // Import Typography component
import AxiosRequest from '../../Components/AxiosRequest';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [itemsCount, setItemsCount] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const customerId = localStorage.getItem('id');
  const isClient = localStorage.getItem('isClient') === 'true';
  const name = localStorage.getItem('name');

  useEffect(() => {
    setLoading(true);
    const fetchCart = async () => {
      try {
        const response = await AxiosRequest.get(`/get-cart/${customerId}`);
        if (response.data.error === "Cart not found") {
          setError("Cart not found");
        } else if (response.data.error === "Internal Server Error") {
          setError("Internal Server Error");
        } else {
          const { cart, totalItemsCount } = response.data;
          const productsWithIds = cart.products.map(product => ({
            ...product,
            _id: product.productId // Assuming productId is the MongoDB ObjectId
          }));
          setCart({ ...cart, products: productsWithIds });
          setItemsCount(totalItemsCount);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setLoading(false);
      }
    };
    

    fetchCart();
  }, []);

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    if (cart && cart.products) {
      cart.products.forEach((product) => {
        if (product && product.price) {
          totalPrice += product.quantity * product.price;
        }
        if (product && product.extras && product.extras.length > 0) {
          product.extras.forEach((extra) => {
            if (extra.price) {
              totalPrice += extra.price;
            }
          });
        }
      });
    }
    return totalPrice.toFixed(2); // Ensure total price is formatted to two decimal places
  };

  const removeFromCart = async (productId) => {
    try {
      await AxiosRequest.delete(`/remove-from-cart/${productId}/${customerId}`);
      setCart(prevCart => ({
        ...prevCart,
        products: prevCart.products.filter(product => product._id !== productId)
      }));
      window.location.reload(); // Reload the page after clearing the cart

    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      await AxiosRequest.delete(`/clear-cart/${customerId}`);
      setCart(null);
      window.location.reload(); // Reload the page after clearing the cart

    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return (
    <div className='p-5'>

      {!isClient ? (
        <div><p style={{ color: 'red' }}>Login as a Client First</p></div>
      ) : error ? (
        <div><p style={{ color: 'red' }}>{error}</p></div>
      ) : loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Typography variant="h4" component="h1" gutterBottom>
            Your Cart: {name ? name : ''}
          </Typography>
          <h1>Total Items in Cart : {itemsCount}</h1>
          {cart && cart.products.length > 0 ? (
            <div>
              {cart.products.map((product) => (
                <div className='border p-4 my-4' key={product._id}>
                  <h3>{product ? product.name : 'Loading...'}</h3>
                  <p>{product ? 'Description: ' + product.description : 'Loading...'}</p>
                  <p>Price: {product  && product.price} ₪</p>
                  {product && product.extras && product.extras.length > 0 && (
                    <div>
                      <h4>Extras:</h4>
                      <ul>
                        {product.extras.map((extra, index) => (
                          <li key={index}>{extra.name}: {extra.price} ₪</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {product.dishDetails && product.dishDetails.dishImage && (
                    <img
                      src={product.dishDetails.dishImage}
                      alt={product.dishDetails.name}
                      className='w-24 h-24'
                    />
                  )}
                  <p>Quantity: {product.quantity}</p>
                  <Button onClick={() => removeFromCart(product._id)} variant="contained" color="primary">Remove from Cart</Button>
                </div>
              ))}
              <h1>Total Price: {calculateTotalPrice()} ₪</h1>
              <Button onClick={clearCart} variant="contained" color="secondary" className='my-3'>Clear Cart</Button>
              <Button onClick={() => { window.location.replace(`/checkout`) }} variant="contained" color="primary" className='w-full my-3'>Checkout</Button>
            </div>
          ) : (
            <p>Cart is empty</p>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
