import React, { useState, useEffect,Suspense,lazy,useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { Avatar } from '@material-tailwind/react';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AxiosRequest from '../Components/AxiosRequest';
import { ReactComponent as LoadingSpinner } from '../../src/assets/LoadingSpinner.svg'; // Adjust path as needed
const Carousels = lazy(() => import('../Home/Carousels/Carousels'));


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
  const isClient = localStorage.getItem('isClient') === 'true';
  const navigate = useNavigate();


  useEffect(() => {
    if (!isClient) {
        navigate('/forbidden'); // Replace with your target route
    }
}, [isClient,navigate]);

  const handleChange = (event) => {
    setNavigationApp(event.target.value);
  };

  const fetchOrders = useCallback(async () => {
    try {
      const response = await AxiosRequest.get(`/order/${customerId}`);
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchOrders(); // Fetch orders immediately on mount

    const interval = setInterval(() => {
      fetchOrders(); // Fetch orders every 1 minute
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchOrders]);

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
    order.products.some(product =>product.orderFrom.toLowerCase().includes(searchQuery.toLowerCase())) // Filter by order ID or restaurant name
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
    window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_blank');
};

const openWaze = (latitude, longitude) => {
    window.open(`https://www.waze.com/ul?ll=${latitude},${longitude}&navigate=yes`, '_blank');
};

  const handleCloseDialog = () => {
    setSelectedOrder(null);
  };

  return (
    <div className='bg-white'>
      <Suspense fallback={
              <div className="flex items-center bg-white justify-center min-h-screen font-poppins">
              <LoadingSpinner width="200" height="200" />
            </div>
      }>
        <Carousels />
      </Suspense>
    <Box className='flex flex-col items-center text-center mt-10'>
      <div className="orders-header mb-4">
        <h2 className="text-3xl font-bold">طلباتك</h2>
        <h4 className="text-lg"><span>تريد مساعدة؟  </span><Link to="/contact-us" className="text-blue-500">تواصل معنا</Link></h4>
      </div>
      <Button
        className="filter-dropdown mb-4"
        variant="contained"
        onClick={handleMenuClick}
        endIcon={<ArrowDropDownIcon />}
      >
        {filter} الطلبات
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={() => handleMenuClose(filter)}>
        <MenuItem onClick={() => handleMenuClose('all')} selected={filter === 'all'}>
        جميع الطلبات
        </MenuItem>
        <MenuItem onClick={() => handleMenuClose('new')} selected={filter === 'new'}>
        طلبات جديدة
        </MenuItem>
        <MenuItem onClick={() => handleMenuClose('preparing')} selected={filter === 'preparing'}>
        طلبات قيد التحضير
        </MenuItem>
        <MenuItem onClick={() => handleMenuClose('delivered')} selected={filter === 'delivered'}>
        طلبات تم ارسالها
        </MenuItem>
        <MenuItem onClick={() => handleMenuClose('completed')} selected={filter === 'completed'}>
        طلبات جاهزة
        </MenuItem>
        <MenuItem onClick={() => handleMenuClose('declined')} selected={filter === 'declined'}>
        طلبات مرفوضة
        </MenuItem>
      </Menu>
      <TextField
        placeholder="البحث حسب رقم الطلب أو اسم المتجر"
        variant="outlined"
        style={{
          textAlign: 'center', // محاذاة النص إلى المركز
          direction: 'rtl',   // تحديد اتجاه الكتابة من اليمين لليسار
        }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 w-[80vw]"
      />
      <div className="w-full items-center flex flex-col  justify-center overflow-auto max-h-[70vh] mb-4">
        {loading ? (
                <div className="flex items-center bg-white justify-center min-h-screen font-poppins">
                  <LoadingSpinner width="200" height="200" />
          </div>
        ) : filteredOrders.length > 0 ? (
          <Paper elevation={3} className="w-full md:w-[80vw] p-0 flex rounded-lg border overflow-y-auto border-gray-300 mt-2">
            <List>
              {filteredOrders.map((order) => {
                // Extract orderFrom from the first product or a relevant logic
                const orderFrom = order.products.length > 0 ? order.products[0].orderFrom : 'Unknown';
        
                return (
                  <ListItemButton key={order._id} divider className="order-item" onClick={() => handleOrderClick(order)}>
                    <ListItemText
                      primary={`${orderFrom}: المتجر`}
                      secondary={
                        <div className="flex flex-row space-x-[40vw] md:space-x-[60vw] justify-between">
                          <Typography component="span" variant="body2">{formatDate(order.orderTime)}</Typography><br />
                          <Typography component="span" variant="body2">{calculateTotalPrice(order)} ₪</Typography><br />
                        </div>
                      }
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Paper>
        ) : (
          <div className="no-orders mt-8">لم يتم العثور على طلبات</div>
        )}
      </div>
      {selectedOrder && (
        <Dialog open={Boolean(selectedOrder)} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle className='text-center'>
          تفاصيل الطلب
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers style={{direction:'rtl'}}>
            <Typography variant="body1" className='text-end'>رقم الطلب: {selectedOrder.orderId}</Typography>
            <Typography variant="body1" className='text-end'>اسم العميل: {selectedOrder.shippingInfo.name}</Typography>
            {selectedOrder.shippingOption === 'self-pickup' && (
        <Box mb={2}>
          <Typography variant="body1" className='text-center' gutterBottom>
          عنوان المتجر
          </Typography>
          <Box className='flex flex-col gap-4 items-center justify-center' mb={2} spacing={2}>
            <FormControl variant="filled" style={{ minWidth: 200, marginRight: 16 }}>
              <InputLabel id="navigation-app-label">استخدم الخارطة للوصول الى المتجر</InputLabel>
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
              اذهب
            </Button>
          </Box>
        </Box>
      )}
      {selectedOrder.shippingOption !== 'dine-in' && (
        <>
        <div className='flex justify-start' style={{direction:'rtl'}}>
        <Typography variant="body1" className='text-end' gutterBottom>
      رقم الهاتف: {selectedOrder.shippingInfo.phoneNumber1}<br />
        </Typography>
        </div>
        <div className='flex justify-start' style={{direction:'rtl'}}>
        <Typography variant="body1" className='text-end'>إيميل: {selectedOrder.shippingInfo.email}</Typography><br/>
        </div>
        <div className='flex justify-start' style={{direction:'rtl'}}>
{selectedOrder.shippingInfo.phoneNumber2 &&(
      <Typography variant="body1" className='text-end' gutterBottom>
      رقم الهاتف 2: {selectedOrder.shippingInfo.phoneNumber2}<br />
      </Typography>  
)}
</div>
        </>

)}
      {selectedOrder.shippingOption === 'delivery' && (
        <>
        <div className='flex justify-start' style={{direction:'rtl'}}>
        {selectedOrder.shippingInfo?.note &&(
          <Typography variant="body1" className='text-start' gutterBottom>
            طلبات خاصة: {selectedOrder.shippingInfo.note}
          </Typography>
        )}
        </div>
        <div className='flex justify-start' style={{direction:'rtl'}}>
        {selectedOrder?.deliveryCity &&(
          <Typography variant="body1" className='text-start' gutterBottom>
            مدينة التسليم: {selectedOrder.deliveryCity}
          </Typography>
        )}
        </div>
        <div className='flex justify-start' style={{direction:'rtl'}}>
        {selectedOrder?.deliveryCharges &&(
          <Typography variant="body1" className='text-start' gutterBottom>
            رسوم التوصيل: ₪ {selectedOrder.deliveryCharges}
          </Typography>
        )}
                </div>
                <div className='flex justify-start' style={{direction:'rtl'}}>
          {selectedOrder?.discountApplied &&(
          <Typography variant="body1" className='text-start' gutterBottom>
            خصم: % {selectedOrder.discount}
          </Typography>
        )}
        </div>
        </>
      )}
        <div className='flex justify-start' style={{direction:'rtl'}}>
        <Typography variant="body1" className='text-start' gutterBottom>
      طريقة استلام الطلب : {selectedOrder.shippingOption === 'self-pickup' ? 'استلام ذاتي' : 'ارساليات'}
      </Typography>
      </div>
      <div className='flex justify-start' style={{direction:'rtl'}}>
      {selectedOrder.shippingOption === 'dine-in' && (
        <Typography variant="body1" className='text-end' gutterBottom>
          رقم الطلولة: {selectedOrder.tableNumber}
        </Typography>
      )}
            </div>
            <div className='flex justify-start' style={{direction:'rtl'}}>
            <Typography variant="body1" className='text-end'>تم الطلب في: {formatDate(selectedOrder.orderTime)}</Typography>
            </div>
   {selectedOrder.products.map((product) => (
  <div key={product._id} className='mt-[4vh] text-start'>
    <div className='flex items-center justify-start !text-start' style={{direction:'rtl'}}>
      <Avatar src={product.dishImage} variant='circular' size='lg' color='black' className='ml-4' />
      <div className='text-end'>
        <Typography component="span" variant="body2"> اسم المتجر: {product.orderFrom}</Typography><br/>
        <Typography component="span" variant="body2"> المنتج: {product.name}</Typography><br />
        <Typography component="span" variant="body2"> العدد: {product.quantity}</Typography><br />
        <Typography component="span" variant="body2"> السعر: ₪ {product.price}</Typography><br />
        {product.extras && product.extras.length > 0 ? (
          <>
            <Typography component="span" variant="body2">
            اضافات: {product.extras.map(extra => extra.name).join(', ')}
            </Typography><br />
            <Typography component="span" variant="body2">
            سعر الاضافات: ₪ {product.extras.reduce((acc, extra) => acc + extra.price, 0)} 
            </Typography><br />
          </>
        ) : (
          <>
          <Typography component="span" variant="body2" className='text-end'>
            لايوجد اضافات
          </Typography><br />
          </>
        )}
      </div>
    </div>
  </div>
))}
  <div className="status-info mt-[2vh] mb-[2vh]">
      <Typography variant="body1" className='text-end'>حالة الطلب</Typography>
      {selectedOrder.status === 'Approved' && (
        <Paper elevation={3} className="status-card accepted" style={{ backgroundColor: 'green', textAlign: 'start' }}>
          <Typography component="span" variant="body2" className='text-end' style={{ fontWeight: 'bold' }}>
            تم قبول الطلب
          </Typography><br />
        </Paper>
      )}
      {selectedOrder.status === 'Completed' && (
        <Paper elevation={3} className="status-card delivered" style={{ backgroundColor: 'lightblue', textAlign: 'start' }}>
          <Typography component="span" variant="body2" className='text-end' style={{ fontWeight: 'bold' }}>
            الطلب جاهز
          </Typography><br />
        </Paper>
      )}
      {selectedOrder.status === 'Delivered' && (
        <Paper elevation={3} className="status-card delivered" style={{ backgroundColor: 'lightblue', textAlign: 'start' }}>
          <Typography component="span" variant="body2" className='text-end' style={{ fontWeight: 'bold' }}>
            تم الارسال
          </Typography><br />
        </Paper>
      )}
      {selectedOrder.status === 'Not Approved' && (
        <Paper elevation={3} className="status-card declined" style={{ backgroundColor: 'red', textAlign: 'start' }}>
          <Typography component="span" variant="body2" className='text-end' style={{ fontWeight: 'bold' }}>
            طلب مرفوض
          </Typography><br />
        </Paper>
      )}
      {selectedOrder.status === 'Preparing' && selectedOrder.preparingStartedAt && (
        <Paper elevation={3} className="status-card preparing" style={{ backgroundColor: 'yellow', textAlign: 'start' }}>
          <Typography component="span" variant="body2" className='text-end' style={{ fontWeight: 'bold' }}>
            طلب قيد التجهيز
          </Typography><br />
          <Typography component="span" variant="body2" className='text-end'>
            Preparing Time Left: {calculateRemainingPreparingTime(selectedOrder)} minutes
          </Typography>
        </Paper>
      )}
      {!selectedOrder.status && (
        <Paper elevation={3} className="status-card no-status text-end">
          <Typography component="span" variant="body2" className='text-end'>
            الطلب قيد الانتظار
          </Typography><br />
        </Paper>
      )}
    </div>


            <Typography variant="body2" className='text-center !font-bold'>السعر الإجمالي: ₪ {calculateTotalPrice(selectedOrder)}</Typography>
          </DialogContent>
        </Dialog>
      )}
    </Box>
    </div>
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
        // Apply discount if applicable
        if (order.discountApplied && order.discount) {
          const discountAmount = (totalPrice * order.discount) / 100;
          totalPrice -= discountAmount;
      }
    if (order.deliveryCharges && typeof order.deliveryCharges === 'number') {
      totalPrice += order.deliveryCharges;
    }


    return totalPrice.toFixed(2);
  }
};

export default Orders;
