import React, { useEffect, useState, useMemo } from 'react';
import {
    Typography,
    CircularProgress,
    Box,
    Paper,
    Button,
    Card,
    CardContent,
    Grid,
    FormControl,
    Select,
    Menu,
    MenuItem,
    TextField,
    IconButton,
} from '@mui/material';
import { CheckCircle, Cancel, Delete, LocalShipping, Timelapse,Share, ShareOutlined, ShareRounded } from '@mui/icons-material';
import ShareIcon from '@mui/icons-material/Share';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosRequest from '../../Components/AxiosRequest';
import { useNavigate } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Avatar } from '@material-tailwind/react';
import { ReactComponent as LoadingSpinner } from '../../../src/assets/LoadingSpinner.svg'; // Adjust path as needed


export default function OwnerDashboard() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [showPreparingSelect, setShowPreparingSelect] = useState(false);
    const [preparingTime, setPreparingTime] = useState('');
    const [currentStatus, setCurrentStatus] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [approvedOrders, setApprovedOrders] = useState([]); // State to track approved orders
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('New orders');
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const [totalOrders, setTotalOrders] = useState({
        'All orders': 0,
        'New orders': 0,
        'Delivered': 0,
        'Preparing': 0,
        'Declined': 0,
        'Completed': 0,
    });

    const handleStatusFilterChange = (filter) => {
        setStatusFilter(filter);
        setAnchorEl(null); // Close the dropdown after selecting a filter
      };
    
      const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      };
    const resName = localStorage.getItem('resName'); 

    useEffect(() => {
        if (!resName) {
            navigate('/forbidden'); // Replace with your target route
        }
    }, [resName, navigate]);

    useEffect(() => {
        // Function to reload the page
        const reloadPage = () => {
          window.location.reload();
        };
    
        // Set an interval to reload the page every 5 minutes (300000 ms)
        const intervalId = setInterval(reloadPage, 300000); // 300000 ms = 5 minutes
    
        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
      }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                console.log('ResName in fetchOrders',resName);
                const response = await AxiosRequest.get(`/orders/${resName}`);
                setOrders(response.data.orders);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Failed to fetch orders. Please try again later.');
                setLoading(false);
            }
        };

        fetchOrders();


        const interval = setInterval(() => {
            fetchOrders();
        },180000 ); // Fetch orders every 3 minutes
        return () => clearInterval(interval);

    }, [resName]);

    useEffect(() => {
        // Fetch opening hours when component mounts
        const fetchCurrentStatus = async () => {
            setLoading(true);
          try {
            const response = await AxiosRequest.get(`/restaurant-status/${resName}`);
            setCurrentStatus(response.data.status);
            setLoading(false);
          } catch (err) {
            setError(err.response.data.error || 'An error occurred');
            setLoading(false);
          }
        };
    
        fetchCurrentStatus();
      }, [resName]);


// useEffect(() => {
//     let filtered = orders;

//     // Filter orders based on statusFilter
//     filtered = filtered.filter(order => {
//         // Handle empty status or invalid status values
//         const status = order.status || '';

//         switch(statusFilter) {
//             case 'All orders':
//                 return ['No Status Yet', 'Approved', 'Not Approved', 'Preparing', 'Completed', 'Delivered'].includes(status) || status === '';
//             case 'New orders':
//                 return (['Approved', 'Preparing', ''].includes(status)) && new Date(order.orderTime) > new Date(Date.now() - 60 * 60 * 1000);
//             case 'Delivered':
//                 return status === 'Delivered';
//             case 'Preparing':
//                 return status === 'Preparing';
//             case 'Declined':
//                 return status === 'Not Approved';
//             case 'Completed':
//                 return status === 'Completed';
//             default:
//                 return true; // Show all orders if no filter is applied
//         }
//     });

//     // Filter orders based on search term (order ID)
//     filtered = filtered.filter(order => order.orderId.toLowerCase().includes(searchTerm.toLowerCase()));

//     // Sort orders by orderTime in descending order
//     filtered = filtered.sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime));

//     setFilteredOrders(filtered);
// }, [searchTerm, orders, statusFilter]);


useEffect(() => {
    let filtered = orders;

    // Filter orders based on statusFilter and calculate counts for each filter
    const allOrders = filtered.filter(order => order.status === '' || order.status === 'No Status Yet' || order.status === 'Approved' || order.status === 'Not Approved' || order.status === 'Preparing' || order.status === 'Completed' || order.status === 'Delivered');
    const newOrders = filtered.filter(order => (order.status === 'Approved' || order.status === 'Preparing' || order.status === '') && new Date(order.orderTime) > new Date(Date.now() - 60 * 60 * 1000));
    const deliveredOrders = filtered.filter(order => order.status === 'Delivered' && order.status !== 'Not Approved');
    const preparingOrders = filtered.filter(order => order.status === 'Preparing');
    const declinedOrders = filtered.filter(order => order.status === 'Not Approved');
    const completedOrders = filtered.filter(order => order.status === 'Completed');

    setTotalOrders({
        'All orders': allOrders.length,
        'New orders': newOrders.length,
        'Delivered': deliveredOrders.length,
        'Preparing': preparingOrders.length,
        'Declined': declinedOrders.length,
        'Completed': completedOrders.length,
    });

    // Apply the filter based on statusFilter
    if (statusFilter === 'All orders') {
        filtered = allOrders;
    } else if (statusFilter === 'New orders') {
        filtered = newOrders;
    } else if (statusFilter === 'Delivered') {
        filtered = deliveredOrders;
    } else if (statusFilter === 'Preparing') {
        filtered = preparingOrders;
    } else if (statusFilter === 'Declined') {
        filtered = declinedOrders;
    } else if (statusFilter === 'Completed') {
        filtered = completedOrders;
    }

    // Filter orders based on search term (order ID)
    filtered = filtered.filter(order => order.orderId.includes(searchTerm.toLowerCase()));

    // Sort orders by order time in descending order
    filtered = filtered.sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime));

    // Set the filtered orders
    setFilteredOrders(filtered);

}, [searchTerm, orders, statusFilter]);

// const getUniqueProductNames = (products) => {
//     const uniqueNames = new Set();
//     products.forEach(product => uniqueNames.add(product.name));
//     return Array.from(uniqueNames);
// };

const groupProductsByNameAndExtras = (products) => {
    const grouped = {};
console.log('Products in group',products);
    products.forEach(product => {
        const productKey = `${product.name}-${product.extras ? product.extras.map(extra => extra.name).join(',') : ''}`;

        if (!grouped[productKey]) {
            grouped[productKey] = {
                quantity: 0,
                extras: new Set()
            };
        }
        grouped[productKey].quantity += product.quantity;
        if (product.extras) {
            product.extras.forEach(extra => grouped[productKey].extras.add(extra.name));
        }
    });

    return grouped;
};

const formatProductDetails = (groupedProducts) => {
    return Object.keys(groupedProducts).map(key => {
        const [productName] = key.split('-');
        const { quantity, extras } = groupedProducts[key];
        const extrasList = Array.from(extras).join(', ');

        return `\nالمنتجات:${productName}\nعدد: ${quantity}${extrasList ? `\nاضافات:${extrasList}` : ''}\n`;
    }).join('\n');
};


    const handleShare = async (order) => {
        if (navigator.share) {
            const groupedProducts = groupProductsByNameAndExtras(order.products);
            const productDetails = formatProductDetails(groupedProducts);
            // const test = `\nتفاصيل الطلب\n\nرقم الطلبية: ${order.orderId}\nالعميل: ${order.shippingInfo.name}\nهاتف:${order.shippingInfo.phoneNumber1}${order.shippingInfo.phoneNumber2 ? `\n2 هاتف: ${order.shippingInfo.phoneNumber2}` : ''}\n${productDetails}\nاجمالي المبلغ: ₪ ${calculateOrderTotal(order)}${order.shippingInfo.address ? `\nالعنوان التفصيلي: ${order.shippingInfo.address}` : ''}${order.orderLocation.formatted_address ? `\nالعنوان:${order.orderLocation.formatted_address}` : ''}${order.shippingInfo.note ? `\nطلبات خاصة:${order.shippingInfo.note}` : ''}`
            const test = `
            تفاصيل الطلب
            
            رقم الطلبية: ${order.orderId}
            العميل: ${order.shippingInfo.name}
            هاتف: ${order.shippingInfo.phoneNumber1}${order.shippingInfo.phoneNumber2 ? `\n2 هاتف: ${order.shippingInfo.phoneNumber2}` : ''}
            
            ${productDetails}
            
            اجمالي المبلغ: ₪ ${calculateOrderTotal(order)}
            
            ${order.shippingInfo.address ? `\nالعنوان التفصيلي: ${order.shippingInfo.address}` : ''}
            ${order.orderLocation.formatted_address ? `\nالعنوان: ${order.orderLocation.formatted_address}` : ''}
            ${order.shippingInfo.note ? `\nطلبات خاصة: ${order.shippingInfo.note}` : ''}
            `;
                console.log(test);
            console.log(test);
            try {
                await navigator.share({
                    text: test
                });
                console.log('Share successful');
            } catch (error) {
                console.error('Share failed', error);
            }
        } else {
            console.warn('Web Share API not supported');
        }
    };
    

    const updateOrderStatus = async (orderId, status, preparingTime = null) => {
        try {
            await AxiosRequest.put(`/orders/${orderId}`, { status, preparingTime });
            // Update the order status locally
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.orderId === orderId ? { ...order, status, preparingTime } : order
                )
            );
            setSuccessMessage(`Order ${orderId} has been ${status.toLowerCase()}.`);
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const handleApprove = orderId => {
        updateOrderStatus(orderId, 'Approved');
        setApprovedOrders(prevApprovedOrders => [...prevApprovedOrders, orderId]); // Add orderId to approvedOrders
    };

    const handleNotApproved = orderId => {
        updateOrderStatus(orderId, 'Not Approved');
    };

    // const calculateTotalPrice = product => {
    //     let totalPrice = product.quantity * product.price;
    //     if (product.extras && product.extras.length > 0) {
    //         totalPrice += product.quantity * product.extras.reduce((acc, extra) => acc + extra.price, 0);
    //     }
    //     return totalPrice.toFixed(2);
    // };

    const calculateTotalPrice = product => {
        let totalPrice = product.quantity * product.price;
        if (product.extras && product.extras.length > 0) {
            totalPrice += product.quantity * product.extras.reduce((acc, extra) => acc + extra.price, 0);
        }
        
        return parseFloat(totalPrice.toFixed(2)); // Convert to float for accurate summation
    };
    
    // Function to calculate the order total
    function calculateOrderTotal(order) {
        let orderTotal = 0;
        
        // Iterate over each product and sum up the total price
        order.products.forEach(product => {
            orderTotal += calculateTotalPrice(product);
        });
         // Apply discount if applicable
         if (order.discountApplied && order.discount) {
            const discountAmount = (orderTotal * order.discount) / 100;
            orderTotal -= discountAmount;
        }
        if (order.deliveryCharges && typeof order.deliveryCharges === 'number') {
            orderTotal += order.deliveryCharges;
          }
        
        return parseFloat(orderTotal.toFixed(2)); // Ensure the total is formatted to 2 decimal places
    }

    // const handleDelete = async (orderId) => {
    //     try {
    //         // Ask for confirmation before deleting
    //         const confirmed = window.confirm(`Are you sure you want to delete order ${orderId}?`);

    //         if (confirmed) {
    //             // Send delete request to server
    //             await AxiosRequest.delete(`/orders/${orderId}`);

    //             // Update state to remove the deleted order from the list
    //             setOrders((prevOrders) =>
    //                 prevOrders.filter((order) => order.orderId !== orderId)
    //             );

    //             // Set success message
    //             setSuccessMessage(`Order ${orderId} has been deleted.`);
    //         } else {
    //             // User canceled deletion
    //             console.log('Deletion canceled.');
    //         }
    //     } catch (error) {
    //         // Error handling
    //         console.error('Error deleting order:', error);
    //     }
    // };


    const handleGoToRestaurantArea = () => {
        localStorage.removeItem('isClient');
        localStorage.removeItem('isAdmin');
        window.location.replace(`/${resName}`);
    };

    // const handleDelivered = orderId => {
    //     updateOrderStatus(orderId, 'Delivered');
    // };

    const handleCompleted = orderId => {
        updateOrderStatus(orderId, 'Completed');
    };

    const handlePreparing = async orderId => {
        setSelectedOrderId(orderId);
        setShowPreparingSelect(true);
    };

    const formatDate = dateString => {
        const date = new Date(dateString);
        return date.toLocaleString(); // Convert to local time format
    };

    const handleSetPreparingTime = async () => {
        updateOrderStatus(selectedOrderId, 'Preparing', parseInt(preparingTime));
        setShowPreparingSelect(false);
        setPreparingTime('');
        setSelectedOrderId(null);
    };

    const handleStatus = async (newStatus) => {
        try {
            toast.info(`Setting Status To ${newStatus}`, { autoClose: 2000 }); // Show info toast for 5 seconds
            setTimeout(async () => { // Delay execution of the rest of the function
                const response = await AxiosRequest.put(`/change-restaurant-status/${resName}/${newStatus}`);
                toast.success(`Status Set To ${newStatus} Successfully`);
                window.location.reload();
            }, 2000);
        } catch (err) {
            console.error(`Error Setting Status To ${newStatus} `, err);
        }
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
    

    const openGoogleMaps = (latitude, longitude) => {
        window.open(`https://www.google.com/maps/search/?api=1&query=${longitude},${latitude}`, '_blank');
    };

    const openWaze = (latitude, longitude) => {
        window.open(`https://www.waze.com/ul?ll=${longitude},${latitude}&navigate=yes`, '_blank');
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



    return (
        <Box className='min-w-screen flex flex-col items-center justify-center text-center'>
            <Typography className='mt-4' variant="h4" component="h1" gutterBottom>
                {resName} سجل طلبات
            </Typography>
            {successMessage && <div className="success-message">{successMessage}</div>}
            <Box className='flex overflow-auto flex-col items-center'>
                <TextField
                    placeholder="Search Order ID"
                    variant="outlined"
                    type='search'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-[50vw] mb-4'
                />
                {!loading?(
                    <Typography
    variant="h6"
    gutterBottom
    sx={{
        color: 'black',
        fontWeight: 'bold',
    }}
>
    <span
        style={{
            color: currentStatus === 'open' ? 'green' :
                   currentStatus === 'closed' ? 'red' :
                   currentStatus === 'busy' ? 'darkorange' :
                   'black' // default color if no match
        }}
    >
        {` ${currentStatus.toUpperCase()} : حالة المتجر الحالية`}
    </span>
</Typography>

           
                ):null
            }
                <Typography variant="h6"
                    gutterBottom
                    sx={{
                        color: 'black',
                        fontWeight: 'bold',
                    }}>:تعيين حالة المطعم إلى</Typography>

                <div>

                    <Grid container classes={{ root: 'grid grid-cols-1 md:grid-rows-1' }} className='mb-4' spacing={2} justifyContent="center">
                        <Grid item>

                            <Button
                                onClick={() => handleStatus('open')}
                                sx={{
                                    bgcolor: '#2c7337', // Green color
                                    '&:hover': {
                                        bgcolor: '#00441b', // Darker green color on hover
                                    },
                                    color: 'white',
                                    fontWeight: 'bold',
                                    py: 2,
                                    borderRadius: 'md',
                                }}
                            >
                                مفتوح
                            </Button>

                        </Grid>
                        <Grid item>

                            <Button
                                onClick={() => handleStatus('busy')}
                                sx={{
                                    bgcolor: 'darkorange',
                                    '&:hover': {
                                        bgcolor: 'orange', // Light orange color
                                    },
                                    color: 'white',
                                    fontWeight: 'bold',
                                    py: 2,
                                    borderRadius: 'md',
                                }}
                            >
                                مشغول
                            </Button>

                        </Grid>
                        <Grid item>
                            <Button
                                onClick={() => handleStatus('closed')}
                                sx={{
                                    bgcolor: 'red',
                                    '&:hover': {
                                        bgcolor: 'salmon', // Light orange color
                                    },
                                    color: 'white',
                                    fontWeight: 'bold',
                                    py: 2,
                                    borderRadius: 'md',
                                }}
                            >
                                مغلق
                            </Button>
                        </Grid>
                    </Grid>

                    <div className='mb-2'>
                <Typography variant="h6" align="center">
                    Total {statusFilter.split(' ')[0]} Orders: {totalOrders[statusFilter]}
                </Typography>
            </div>
                    <Grid container justifyContent="center" className='mb-4'>
        <Button
          variant="contained"
          onClick={handleClick}
          endIcon={<ArrowDropDownIcon />}
        >
          {statusFilter}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleStatusFilterChange('All orders')}>({totalOrders['All orders']}) جميع الطلبات</MenuItem>
          <MenuItem onClick={() => handleStatusFilterChange('New orders')}>({totalOrders['New orders']}) طلبات جديدة</MenuItem>
          <MenuItem onClick={() => handleStatusFilterChange('Preparing')}>({totalOrders['Preparing']}) طلبات قيد الحضير</MenuItem>
          {/* <MenuItem onClick={() => handleStatusFilterChange('Delivered')}>Delivered Orders</MenuItem> */}
          <MenuItem onClick={() => handleStatusFilterChange('Completed')}>({totalOrders['Completed']}) طلبات جاهزة</MenuItem>
          <MenuItem onClick={() => handleStatusFilterChange('Declined')}>({totalOrders['Declined']}) طلبات مرفوضة</MenuItem>
        </Menu>
      </Grid>
                    <Typography variant="h6" align="center">
                        {statusFilter} :فلتر الحالة الحالية
                    </Typography>
                </div>

                {loading ? (
                <div className="flex items-center bg-white justify-center min-h-screen font-poppins">
                <LoadingSpinner width="200" height="200" />
              </div>
        ) :filteredOrders.length > 0 ? (
                    <Paper elevation={3} className="md:w-full  p-6 border border-gray-300 rounded-lg">
                        {filteredOrders.map(order => (
                            <Card key={order._id} className="md:min-w-screen mb-4 relative">
                                {order.shippingOption === 'delivery' && (
                                    <IconButton
                onClick={() => handleShare(order)}
                style={{ position: 'absolute', top: 8, right: 8 }}
                color="primary"
            >
                <ShareRounded />
            </IconButton>
                                )}
                                <CardContent className="flex flex-col gap-4">
                                    {order.status === '' || order.status === 'Not Approved' ? (
                                        <>
                                            {order.status === 'Preparing' && order.preparingTime && (
                                                <Typography variant="h6" gutterBottom>
                                                   {order.preparingTime} :الوقت المقدر لتجهيز الطلب
                                                </Typography>
                                            )}
                                            <Typography variant="h6" gutterBottom>
                                                {order.orderId} :رقم الطلبية
                                            </Typography>
                                            <Typography variant='h6'>
                                            {order.status ? order.status : 'قيد الانتضار'} :حالة الطلب<br />
                                            </Typography>
                                            {order.orderLocation && order.shippingOption === 'delivery' && (
                                                <div className="flex justify-center mb-2 space-x-4">
                                                    <Button variant="contained" onClick={() => openGoogleMaps(order.orderLocation.coordinates[0], order.orderLocation.coordinates[1])}>
                                                    اذهب عن طريق خارطة جوجل
                                                    </Button>
                                                    <Button variant="contained" onClick={() => openWaze(order.orderLocation.coordinates[0], order.orderLocation.coordinates[1])}>
                                                    اذهب عن طريق خارطة ويز
                                                    </Button>
                                                </div>
                                            )}

                                            {order.shippingInfo && (
                                                <div className="flex flex-col gap-2">
                                                    <Typography variant="body2" className="font-bold">:تفاصيل الشحن</Typography>
                                                    <div className="p-4 bg-gray-100 rounded-lg text-end" style={{direction:'rtl'}} >
                                                        <Typography variant="body2">
                                                       اسم العميل: {order.shippingInfo.name}<br />
                                                            {order.shippingOption !=='dine-in' && (
                                                        <Typography variant="body2">
                                                        هاتف: {order.shippingInfo.phoneNumber1}<br />
                                                        {order.shippingInfo?.phoneNumber2 &&(
                                                            <>
                                                        هاتف 2: {order.shippingInfo.phoneNumber2}<br />
                                                        </>
                                                        )}
                                                        البريد الإلكتروني: {order.shippingInfo.email}<br />
                                                        </Typography>
                                                        )}
                                                        {order.shippingOption === 'delivery' && (
                                                            <>
                                                            {order.orderLocation?.formatted_address && (
                                                              <Typography variant="body2">
                                                            العنوان: {order.orderLocation.formatted_address}<br />
                                                            </Typography>
                                                            )}
                                                            {order?.deliveryCity &&(
                                                   <Typography variant="body2" gutterBottom>
                                                            مدينة التسليم: {order.deliveryCity}<br/>
                                                              </Typography>
                                                                    )}
                                                            {order?.deliveryCharges && (
                                                              <Typography variant="body2">
                                                            رسوم التوصيل: ₪ {order.deliveryCharges}<br />
                                                            </Typography>
                                                            )}
                                                             {order?.discountApplied && (
                                                              <Typography variant="body2">
                                                            خصم: % {order.discount}<br />
                                                            </Typography>
                                                            )}
                                                             {order.shippingInfo?.address && (
                                                              <Typography variant="body2">
                                                            العنوان التفصيلي: {order.shippingInfo.address}<br />
                                                            </Typography>
                                                            )}
                                                             {order.shippingInfo?.note && (
                                                             <Typography variant="body2">
                                                             طلبات خاصة: {order.shippingInfo.note}<br />
                                                             </Typography>
                                                            )}
                                                            </>
                                                        )}

                                                  طريقة الاستلام: {order.shippingOption === 'self-pickup' ? 'استلام ذاتي' : 'ارساليات'}<br/>  
                                                                {order.shippingOption === 'dine-in' &&(
                                                                <Typography variant="body2">
                                                                رقم الطاولة: {order.tableNumber}<br/>
                                                                </Typography>
                                                            )}
                                                        تم الطلب في: {formatDate(order.orderTime)}<br/>
                                                        اجمالي المبلغ: ₪ {calculateOrderTotal(order)}<br />
                                                        </Typography>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-2">
                                                <Typography variant="body2" className="font-bold">:المنتجات</Typography>
                                                {order.products.map(product => (
                                                    <div key={product._id} className="p-4 bg-gray-100 flex flex-col gap-4  rounded-lg">
                                                        <div className='flex items-center justify-center'>
                                                        <Avatar src={product.dishImage} variant='circular' size='xl' className='mb-2 object-cover'/>
                                                        </div>
                                                        <Typography variant="body2" className='text-end' style={{direction:'rtl'}}>
                                                        المنتج: {product.name}<br />
                                                        {product.description && (
                                                            <>
                                                    وصف: {product.description}<br/>
                                                    </>
                                                          )}
                                                        العدد: {product.quantity}<br />
                                                        السعر: ₪ {product.price}<br />
                                                        {product.extras && product.extras.length > 0 ? (
                                                       <>
                                        اضافات: {product.extras.map(extra => extra.name).join(', ')}
                                                   <br />
                                    سعر الاضافات: ₪ {product.extras.map(extra => extra.price).join(' ,₪  ')}
                                                  <br />
                                             </>
                                                   ) : null}
                                                        </Typography>
                                                    </div>
                                                ))}
                                            </div>
                                            <Grid container classes={{ root: 'grid grid-cols-1 md:grid-rows-1' }} className='mb-4' spacing={2} justifyContent="center">
                                                <Grid item>
                                                    <Button variant='contained' startIcon={<CheckCircle />} onClick={() => handleApprove(order.orderId)}>قبول الطلب</Button>
                                                </Grid>
                                                <Grid item>
                                                    <Button variant="contained" startIcon={<Cancel />} onClick={() => handleNotApproved(order.orderId)}>رفض الطلب</Button>
                                                </Grid>
                                            </Grid>

                                        </>
                                    ) : (
                                        <>
                                            {order.status === 'Preparing' && order.preparingTime && (
                                                <Typography variant="h6" gutterBottom className='bg-yellow-500'>
                                                {order.preparingTime} :الوقت المقدر لتجهيز الطلبية
                                                </Typography>
                                            )}
                                            {order.status === 'Preparing' && order.preparingStartedAt && (
                                                <Typography variant="h6" gutterBottom >
                                                {calculateRemainingPreparingTime(order)} :الوقت المتبقي للتحضير
                                                </Typography>
                                            )}
                                            <Typography variant="h6" gutterBottom>
                                            {order.orderId} :رقم الطلب
                                            </Typography>
                                            <Typography variant="h6" gutterBottom>
                                            {order.status ? order.status : 'قيد الانتضار'} :حالة الطلب<br />
                                            </Typography>
                                            <div className="flex flex-col gap-2">
                                                <Typography variant="body2" className="font-bold">:تفاصيل الشحن</Typography>
                                                <div className="p-4 bg-gray-100 rounded-lg text-end" style={{direction:'rtl'}}>
                                                    <Typography variant="body2">
                                                    اسم العميل: {order.shippingInfo.name}<br />
                                                        {order.shippingOption !=='dine-in' &&(
                                                        <Typography variant="body2">
                                                        الهاتف: {order.shippingInfo.phoneNumber1}<br />
                                                        البريد الإلكتروني: {order.shippingInfo.email}<br />
                                                        </Typography>
                                                        )}
                                                        {order.shippingOption === 'delivery' && (
                                                            <>
                                                            {order.orderLocation?.formatted_address && (
                                                              <Typography variant="body2">
                                                            العنوان: {order.orderLocation.formatted_address}<br />
                                                            </Typography>
                                                            )}
                                                   {order?.deliveryCity &&(
                                                   <Typography variant="body1" gutterBottom>
                                                            مدينة التسليم: {order.deliveryCity}<br/>
                                                              </Typography>
                                                                    )}
            
                                                            {order?.deliveryCharges && (
                                                              <Typography variant="body2">
                                                            رسوم التوصيل: ₪ {order.deliveryCharges}<br />
                                                            </Typography>
                                                            )}
                                                            {order?.discountApplied && (
                                                              <Typography variant="body2">
                                                            خصم: % {order.discount}<br />
                                                            </Typography>
                                                            )}
                                                             {order.shippingInfo?.address && (
                                                              <Typography variant="body2">
                                                            العنوان التفصيلي: {order.shippingInfo.address}<br />
                                                            </Typography>
                                                            )}
                                                             {order.shippingInfo?.note && (
                                                             <Typography variant="body2">
                                                             طلبات خاصة: {order.shippingInfo.note}<br />
                                                             </Typography>
                                                            )}
                                                            </>
                                                        )}
                                                          طريقة الاستلام: {order.shippingOption === 'self-pickup' ? 'استلام ذاتي' : 'ارساليات'}<br/>                                                    

                                                            {order.shippingOption === 'dine-in' &&(
                                                                <Typography variant="body2">
                                                                {order.tableNumber} :رقم الطاولة
                                                                <br/>
                                                                </Typography>
                                                            )}
                                                            تم الطلب في: {formatDate(order.orderTime)}<br/>
                                                          اجمالي المبلغ: ₪ {calculateOrderTotal(order)}<br />
                                                    </Typography>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Typography variant="body2" className="font-bold">:المنتجات</Typography>
                                                {order.products.map(product => (
                                                    <div key={product._id} className="p-4 bg-gray-100 rounded-lg">
                                                         <div className='flex items-center justify-center'>
                                                        <Avatar src={product.dishImage} variant='circular' size='xl' className='mb-2 object-cover'/>
                                                        </div>
                                                        <Typography variant="body2" className='text-end' style={{direction:'rtl'}}>
                                                        المنتج: {product.name}<br />
                                                        {product.description && (
                                                            <>
                                                    وصف: {product.description}<br/>
                                                    </>
                                                          )}
                                                        العدد: {product.quantity}<br />
                                                        السعر: ₪ {product.price}<br />
                                                        {product.extras && product.extras.length > 0 ? (
                                                       <>
                                        اضافات: {product.extras.map(extra => extra.name).join(', ')}
                                                   <br />
                                    سعر الاضافات: ₪ {product.extras.map(extra => extra.price).join(' ,₪  ')}
                                                  <br />
                                             </>
                                                   ) : null}
                                                        {/* حالة الطلب: {order.status ? order.status : 'قيد الانتضار'}<br />
                                                        تم الطلب في: {formatDate(order.orderTime)} */}
                                                        </Typography>
                                                    </div>
                                                ))}
                                            </div>
                                            <Grid container classes={{ root: 'grid grid-cols-1 md:grid-rows-1' }} className='mb-4' spacing={2} justifyContent="center">
                                               {order.status !== 'Completed' && ( 
                                                <Grid item>
                                                    <Button variant="contained" startIcon={<Timelapse />} onClick={() => handlePreparing(order.orderId)}>البدء بالتحضير</Button>
                                                </Grid>
                                                )}
                                                {/* <Grid item>
                                                    <Button variant="contained" startIcon={<Delete />} onClick={() => handleDelete(order.orderId)}>Delete</Button>
                                                </Grid>
                                                <Grid item>
                                                    <Button variant="contained" startIcon={<LocalShipping />} onClick={() => handleDelivered(order.orderId)}>Delivered</Button>
                                                </Grid> */}
                                                <Grid item>
                                                    <Button variant="contained" startIcon={<CheckCircle />} onClick={() => handleCompleted(order.orderId)}>الطب جاهز</Button>
                                                </Grid>

                                            </Grid>
                                            {showPreparingSelect && (
                                                <FormControl fullWidth>
                                                    <Select
                                                        labelId="preparing-time-label"
                                                        id="preparing-time"
                                                        value={preparingTime}
                                                        onChange={(e) => setPreparingTime(e.target.value)}
                                                        fullWidth
                                                    >
                                                        <MenuItem value={10}>10 minutes</MenuItem>
                                                        <MenuItem value={15}>15 minutes</MenuItem>
                                                        <MenuItem value={20}>20 minutes</MenuItem>
                                                        <MenuItem value={25}>25 minutes</MenuItem>
                                                        <MenuItem value={30}>30 minutes</MenuItem>
                                                        <MenuItem value={35}>35 minutes</MenuItem>
                                                        <MenuItem value={40}>40 minutes</MenuItem>
                                                        <MenuItem value={45}>45 minutes</MenuItem>
                                                        <MenuItem value={50}>50 minutes</MenuItem>
                                                        <MenuItem value={55}>55 minutes</MenuItem>
                                                        <MenuItem value={60}>60 minutes</MenuItem>
                                                    </Select>
                                                    <Button
                                                        variant="contained"
                                                        onClick={handleSetPreparingTime}
                                                    >
                                                        تعيين وقت التحضير
                                                    </Button>
                                                </FormControl>
                                            )}
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </Paper>
                ) : !loading &&(
                    <Typography textAlign="center" mt={5} fontWeight="bold">
                       لم يتم العثور على طلبات
                    </Typography>
                )}
                <Button className="mt-4 mb-4" variant="contained" onClick={handleGoToRestaurantArea}>
                انتقل الى الإعدادات
                </Button>
            </Box>
        </Box>
    );
}
