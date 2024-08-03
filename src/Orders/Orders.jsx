import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import {
  CircularProgress,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Button,
  ButtonGroup,
  TextField,
} from '@mui/material';
import AxiosRequest from '../Components/AxiosRequest';

const Orders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all'); // Default filter is 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const customerId = localStorage.getItem('id');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await AxiosRequest.get(`/order/${customerId}`);
        setOrders(response.data.orders);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 60000); // Fetch orders every 1 minute


    return () => clearInterval(interval);
  }, [customerId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Convert to local time format
  };



  const calculateRemainingPreparingTime = (order) => {
    const preparingStartedAt = new Date(order.preparingStartedAt).toLocaleString();
    const currentTime = new Date().getTime();
    const elapsedMilliseconds = currentTime - new Date(preparingStartedAt).getTime();
    const elapsedMinutes = Math.floor(elapsedMilliseconds / (1000 * 60));
    let remainingPreparingTime = order.preparingTime - elapsedMinutes;
    if (remainingPreparingTime < 0) {
        remainingPreparingTime = 0;
    }
    return remainingPreparingTime;
};

useEffect(() => {
  const interval = setInterval(() => {
      const updatedOrders = orders.map(order => {
          if (order.status === 'Preparing') {
              const remainingPreparingTime = calculateRemainingPreparingTime(order);
              return { ...order, remainingPreparingTime };
          }
          return order;
      });
      setOrders(updatedOrders);
  }, 60000); // Update every minute

  return () => clearInterval(interval);
}, [orders]);


  const filteredOrders = orders.filter(order => {
    if (filter === 'all') {
      return order.status === '' || order.status === 'Approved' || order.status === 'Preparing' || order.status === 'Completed' || order.status === 'Not Approved';
    }
    else if(filter === 'new'){
      return (order.status === 'Approved' || order.status === 'Preparing' || order.status === '' ) && new Date(order.orderTime) > new Date(Date.now() - 60 * 60 * 1000);

    }
    else if (filter === 'delivered') {
      return order.status === 'Delivered' && order.status !== 'Not Approved';
    } else if (filter === 'declined') {
      return order.status === 'Not Approved';
    } else if (filter === 'preparing') {
      return order.status === 'Preparing';
    }
    else if (filter === 'completed') {
      return order.status === 'Completed';
  }
    return true; // Show all orders if no filter is applied
  }).filter(order =>
    order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.resName.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by order ID or restaurant name
  );

  return (
    <Box className='container flex flex-col items-center text-center mt-10'>
      <div className="orders-header mb-4">
        <h2 className="text-3xl font-bold">Your Orders</h2>
        <h4 className="text-lg"><span>Need Help? </span><Link to="/contact-us" className="text-blue-500">Contact Us</Link></h4>
      </div>
      <ButtonGroup className="filter-buttons mb-4 flex md:flex-row flex-col justify-center gap-1 md:gap-2">
        <Button className='!border !border-blue-200' onClick={() => setFilter('all')} variant={filter === 'all' ? 'contained' : 'outlined'}>All Orders</Button>
        <Button className='!border !border-blue-200' onClick={() => setFilter('new')} variant={filter === 'new' ? 'contained' : 'outlined'}>New Orders</Button>
        <Button className='!border !border-blue-200' onClick={() => setFilter('preparing')} variant={filter === 'preparing' ? 'contained' : 'outlined'}>Preparing Orders</Button>
        <Button className='!border !border-blue-200' onClick={() => setFilter('delivered')} variant={filter === 'delivered' ? 'contained' : 'outlined'}>Delivered Orders</Button>
        <Button className='!border !border-blue-200' onClick={() => setFilter('completed')} variant={filter === 'completed' ? 'contained' : 'outlined'}>Completed Orders</Button>
        <Button className='!border !border-blue-200' onClick={() => setFilter('declined')} variant={filter === 'declined' ? 'contained' : 'outlined'}>Declined Orders</Button>
      </ButtonGroup>
      <TextField
        placeholder="Search by Order ID or Restaurant Name"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        className="mb-4"
      />
      <div className="orders-content w-full overflow-auto max-h-[70vh]">
        {loading ? (
          <CircularProgress className="loading-spinner mt-8" />
        ) : filteredOrders.length > 0 ? (
          <Paper elevation={3} className="orders-list w-full max-w-3xl p-6 rounded-lg border border-gray-300 mt-8">
            <List>
              {filteredOrders.map((order) => (
                <ListItem key={order._id} divider className="order-item">
                  <ListItemText
                    primary={`Order ID: ${order.orderId}`}
                    secondary={
                      <div className="order-info flex justify-between">
                        {order.shippingInfo &&(
                        <div className="shipping-info">
                          <h4>Shipping Info</h4>
                          <Typography component="span" variant="body2">Name: {order.shippingInfo.name}</Typography><br />
                          <Typography component="span" variant="body2">Phone: {order.shippingInfo.phoneNumber1}</Typography><br />
                          <Typography component="span" variant="body2">Email: {order.shippingInfo.email}</Typography><br />

                        </div>
                        )}
                        <div className="products-info">
                          <h4>Orders Info</h4>
                          {order.products.map((product) => (
                            <div key={product._id} className="product-item">
                              <Typography component="span" variant="body2">Restaurant Name: {order.resName}</Typography><br />
                              <Typography component="span" variant="body2">Name: {product.name}</Typography><br />
                              <Typography component="span" variant="body2">Quantity: {product.quantity}</Typography><br />
                              <Typography component="span" variant="body2">Price: {product.price}</Typography><br />
                              <Typography component="span" variant="body2">Extras: {product.extras ? product.extras.map(extra => extra.name).join(', ') : 'None'}</Typography><br />
                              <Typography component="span" variant="body2">Extras Price: {product.extras ? product.extras.map(extra => extra.price).join(', ') : 'None'}</Typography><br />
                              <Typography component="span" variant="body2">Total Price: {calculateTotalPrice(product)}</Typography><br />
                              <Typography component="span" variant="body2">Ordered At: {formatDate(order.orderTime)}</Typography><br />
                            </div>
                          ))}
                        </div>
                        <div className="status-info">
                          <h4>Status Info</h4>
                          {order.status === 'Approved' && (
                            <Paper elevation={3} className="status-card accepted" style={{ backgroundColor: 'green', textAlign: 'center' }}>
                              <Typography component="span" variant="body2" style={{ fontWeight: 'bold' }}>
                                Accepted
                              </Typography><br />
                            </Paper>
                          )}
                          {order.status === 'Completed' && (
                            <Paper elevation={3} className="status-card delivered" style={{ backgroundColor: 'lightblue', textAlign: 'center' }}>
                              <Typography component="span" variant="body2" style={{ fontWeight: 'bold' }}>
                                Completed
                              </Typography><br />
                            </Paper>
                          )}


                          {order.status === 'Delivered' && (
                            <Paper elevation={3} className="status-card delivered" style={{ backgroundColor: 'lightblue', textAlign: 'center' }}>
                              <Typography component="span" variant="body2" style={{ fontWeight: 'bold' }}>
                                Delivered
                              </Typography><br />
                            </Paper>
                          )}

                          {order.status === 'Not Approved' && (
                            <Paper elevation={3} className="status-card declined" style={{ backgroundColor: 'red', textAlign: 'center' }}>
                              <Typography component="span" variant="body2" style={{ fontWeight: 'bold' }}>
                                Declined
                              </Typography><br />
                            </Paper>
                          )}

                          {order.status === 'Preparing' && order.preparingStartedAt && (
                            <Paper elevation={3} className="status-card preparing" style={{ backgroundColor: 'yellow', textAlign: 'center' }}>
                              <Typography component="span" variant="body2" style={{ fontWeight: 'bold' }}>
                                Preparing
                              </Typography><br />
                              <Typography component="span" variant="body2">Preparing Time Left:{calculateRemainingPreparingTime(order)} minutes</Typography>
                            </Paper>
                          )}

                          {!order.status && (
                            <Paper elevation={3} className="status-card no-status">
                              <Typography component="span" variant="body2">
                                No Status Yet
                              </Typography><br />
                            </Paper>
                          )}
                        </div>
                      </div>
                    }
                  />

                </ListItem>
              ))}
            </List>
          </Paper>
        ) : (
          <div className="no-orders mt-8">No orders found</div>
        )}
      </div>
    </Box>
  );
};

export default Orders;

function calculateTotalPrice(product) {
  let totalPrice = product.price;
  if (product.extras && product.extras.length > 0) {
    totalPrice += product.extras.reduce((acc, extra) => acc + extra.price, 0);
  }
  return totalPrice.toFixed(2);
}
