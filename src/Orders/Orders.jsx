import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Orders.css'
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
  MenuItem,
  Select, 
  FormControl, 
  InputLabel,
  ListItemButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AxiosRequest from '../Components/AxiosRequest';

const Orders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all'); // Default filter is 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null); // State for selected order
  const customerId = localStorage.getItem('id');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [navigationApp, setNavigationApp] = useState('');

  const handleChange = (event) => {
    setNavigationApp(event.target.value);
  };

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
    const preparingStartedAt = new Date(order.preparingStartedAt).getTime();
    const currentTime = new Date().getTime();
    const elapsedMilliseconds = currentTime - preparingStartedAt;
    const elapsedMinutes = Math.floor(elapsedMilliseconds / (1000 * 60));
    let remainingPreparingTime = order.preparingTime - elapsedMinutes;
    if (remainingPreparingTime < 0) {
        remainingPreparingTime = 0;
    }
    return remainingPreparingTime;
  };
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (filterValue) => {
    setFilter(filterValue);
    setAnchorEl(null);
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
  ).sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime));

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleNavigate = (coordinates) => {
    if (navigationApp === 'google') {
      openGoogleMaps(coordinates[0], coordinates[1]);
    } else if (navigationApp === 'waze') {
      openWaze(coordinates[0], coordinates[1]);
    }
  };

  const openGoogleMaps = (latitude, longitude) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${longitude},${latitude}`, '_blank');
};

const openWaze = (latitude, longitude) => {
    window.open(`https://www.waze.com/ul?ll=${longitude},${latitude}&navigate=yes`, '_blank');
};

  const handleCloseDialog = () => {
    setSelectedOrder(null);
  };

  return (
    <Box className='flex flex-col items-center text-center mt-10'>
      <div className="orders-header mb-4">
        <h2 className="text-3xl font-bold">Your Orders</h2>
        <h4 className="text-lg"><span>Need Help? </span><Link to="/contact-us" className="text-blue-500">Contact Us</Link></h4>
      </div>
      {/* <ButtonGroup className="filter-buttons mb-4 flex md:flex-row flex-col justify-center gap-1 md:gap-2">
        <Button className='!border !border-blue-200' onClick={() => setFilter('all')} variant={filter === 'all' ? 'contained' : 'outlined'}>All Orders</Button>
        <Button className='!border !border-blue-200' onClick={() => setFilter('new')} variant={filter === 'new' ? 'contained' : 'outlined'}>New Orders</Button>
        <Button className='!border !border-blue-200' onClick={() => setFilter('preparing')} variant={filter === 'preparing' ? 'contained' : 'outlined'}>Preparing Orders</Button>
        <Button className='!border !border-blue-200' onClick={() => setFilter('delivered')} variant={filter === 'delivered' ? 'contained' : 'outlined'}>Delivered Orders</Button>
        <Button className='!border !border-blue-200' onClick={() => setFilter('completed')} variant={filter === 'completed' ? 'contained' : 'outlined'}>Completed Orders</Button>
        <Button className='!border !border-blue-200' onClick={() => setFilter('declined')} variant={filter === 'declined' ? 'contained' : 'outlined'}>Declined Orders</Button>
      </ButtonGroup> */}
      <Button
        className="filter-dropdown mb-4"
        variant="contained"
        onClick={handleMenuClick}
        endIcon={<ArrowDropDownIcon />}
      >
        {filter} Orders
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={() => handleMenuClose(filter)}>
        <MenuItem onClick={() => handleMenuClose('all')} selected={filter === 'all'}>
          All Orders
        </MenuItem>
        <MenuItem onClick={() => handleMenuClose('new')} selected={filter === 'new'}>
          New Orders
        </MenuItem>
        <MenuItem onClick={() => handleMenuClose('preparing')} selected={filter === 'preparing'}>
          Preparing Orders
        </MenuItem>
        <MenuItem onClick={() => handleMenuClose('delivered')} selected={filter === 'delivered'}>
          Delivered Orders
        </MenuItem>
        <MenuItem onClick={() => handleMenuClose('completed')} selected={filter === 'completed'}>
          Completed Orders
        </MenuItem>
        <MenuItem onClick={() => handleMenuClose('declined')} selected={filter === 'declined'}>
          Declined Orders
        </MenuItem>
      </Menu>
      <TextField
        placeholder="Search by Order ID or Restaurant Name"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 w-[80vw]"
      />
      <div className="w-full items-center flex flex-col  justify-center overflow-auto max-h-[70vh] mb-4">
        {loading ? (
          <CircularProgress className="loading-spinner mt-8" />
        ) : filteredOrders.length > 0 ? (
          <Paper elevation={3} className="w-full md:w-[80vw] flex rounded-lg border overflow-y-auto border-gray-300 mt-2">
            <List>
              {filteredOrders.map((order) => {
                // Extract orderFrom from the first product or a relevant logic
                const orderFrom = order.products.length > 0 ? order.products[0].orderFrom : 'Unknown';
        
                return (
                  <ListItemButton key={order._id} divider className="order-item" onClick={() => handleOrderClick(order)}>
                    <ListItemText
                      primary={`Restaurant: ${orderFrom}`}
                      secondary={
                        <div className="flex flex-row space-x-[40vw] md:space-x-[60vw] justify-between">
                          <Typography component="span" variant="body2">{formatDate(order.orderTime)}</Typography><br />
                          <Typography component="span" variant="body2">{calculateTotalPrice(order)}</Typography><br />
                        </div>
                      }
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Paper>
        ) : (
          <div className="no-orders mt-8">No orders found</div>
        )}
      </div>
      {selectedOrder && (
        <Dialog open={Boolean(selectedOrder)} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle className='text-center'>
            Order Details
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1">Order ID: {selectedOrder.orderId}</Typography>
            {selectedOrder.shippingOption === 'self-pickup' && (
        <Box mb={2}>
          <Typography variant="body1" className='text-center' gutterBottom>
            Restaurant Address:
          </Typography>
          <Box className='flex flex-col gap-4 items-center justify-center' mb={2} spacing={2}>
            <FormControl variant="filled" style={{ minWidth: 200, marginRight: 16 }}>
              <InputLabel id="navigation-app-label">Choose Navigation</InputLabel>
              <Select
                labelId="navigation-app-label"
                id="navigation-app"
                value={navigationApp}
                onChange={handleChange}
              >
                <MenuItem value="google">Google Maps</MenuItem>
                <MenuItem value="waze">Waze</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={() => handleNavigate(selectedOrder.orderLocation.coordinates)}
              disabled={!navigationApp}
            >
              Open
            </Button>
          </Box>
        </Box>
      )}
      {selectedOrder.shippingOption !== 'dine-in' && (
      <Typography variant="body1" gutterBottom>
        Phone: {selectedOrder.shippingInfo.phoneNumber1}<br />
        </Typography>

)}

      <Typography variant="body1" gutterBottom>
        Order Type: {selectedOrder.shippingOption}
      </Typography>
      {selectedOrder.shippingOption === 'dine-in' && (
        <Typography variant="body1" gutterBottom>
          Table Number: {selectedOrder.tableNumber}
        </Typography>
      )}
            <Typography variant="body1">Ordered At: {formatDate(selectedOrder.orderTime)}</Typography>
            {selectedOrder.products.map((product) => (
              <div key={product._id} className='mt-[4vh]'>
                <Typography variant="body1">Restaurant: {product.orderFrom}</Typography>
                <Typography component="span" variant="body2">Name: {product.name}</Typography><br />
                <Typography component="span" variant="body2">Quantity: {product.quantity}</Typography><br />
                <Typography component="span" variant="body2">Price: {product.price}</Typography><br />
                {/* <Typography component="span" variant="body2">Extras: {product.extras ? product.extras.map(extra => extra.name).join(', ') : 'None'}</Typography><br />
                <Typography component="span" variant="body2">Extras Price: {product.extras ? product.extras.reduce((acc, extra) => acc + extra.price, 0) : 0}</Typography><br /> */}
                {product.extras && product.extras.length > 0 ? (
  <>
    <Typography component="span" variant="body2">
      Extras: {product.extras.map(extra => extra.name).join(', ')}
    </Typography><br />

    <Typography component="span" variant="body2">
      Extras Price: {product.extras ? product.extras.reduce((acc, extra) => acc + extra.price, 0) : 0}
    </Typography><br />
  </>
):(
  <>
  <Typography component="span" variant="body2">
  No Extras
</Typography><br />
</>
)}
                                     <div className="status-info mt-[2vh] mb-[2vh]">
                          <Typography variant="body1">Status Info</Typography>
                          {selectedOrder.status === 'Approved' && (
                            <Paper elevation={3} className="status-card accepted" style={{ backgroundColor: 'green', textAlign: 'center' }}>
                              <Typography component="span" variant="body2" style={{ fontWeight: 'bold' }}>
                                Accepted
                              </Typography><br />
                            </Paper>
                          )}
                          {selectedOrder.status === 'Completed' && (
                            <Paper elevation={3} className="status-card delivered" style={{ backgroundColor: 'lightblue', textAlign: 'center' }}>
                              <Typography component="span" variant="body2" style={{ fontWeight: 'bold' }}>
                                Completed
                              </Typography><br />
                            </Paper>
                          )}


                          {selectedOrder.status === 'Delivered' && (
                            <Paper elevation={3} className="status-card delivered" style={{ backgroundColor: 'lightblue', textAlign: 'center' }}>
                              <Typography component="span" variant="body2" style={{ fontWeight: 'bold' }}>
                                Delivered
                              </Typography><br />
                            </Paper>
                          )}

                          {selectedOrder.status === 'Not Approved' && (
                            <Paper elevation={3} className="status-card declined" style={{ backgroundColor: 'red', textAlign: 'center' }}>
                              <Typography component="span" variant="body2" style={{ fontWeight: 'bold' }}>
                                Declined
                              </Typography><br />
                            </Paper>
                          )}

                          {selectedOrder.status === 'Preparing' && selectedOrder.preparingStartedAt && (
                            <Paper elevation={3} className="status-card preparing" style={{ backgroundColor: 'yellow', textAlign: 'center' }}>
                              <Typography component="span" variant="body2" style={{ fontWeight: 'bold' }}>
                                Preparing
                              </Typography><br />
                              <Typography component="span" variant="body2">Preparing Time Left:{calculateRemainingPreparingTime(selectedOrder)} minutes</Typography>
                            </Paper>
                          )}

                          {!selectedOrder.status && (
                            <Paper elevation={3} className="status-card no-status">
                              <Typography component="span" variant="body2">
                                No Status Yet
                              </Typography><br />
                            </Paper>
                          )}
                        </div>
              </div>
            ))}
            <Typography variant="h6" className='text-center'>Total Price: {calculateTotalPrice(selectedOrder)}</Typography>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );

  function calculateTotalPrice(order) {
    let totalPrice = 0;
    order.products.forEach(product => {
      let productTotal = product.price * product.quantity;
      totalPrice += productTotal;
      if (product.extras) {
        product.extras.forEach(extra => {
          totalPrice += extra.price * product.quantity;
        });
      }
    });

    return totalPrice.toFixed(2);
  }
};

export default Orders;
