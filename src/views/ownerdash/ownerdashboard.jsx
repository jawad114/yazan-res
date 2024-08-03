import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
    Typography,
    Box,
    Paper,
    Button,
    Card,
    CardContent,
    Grid,
    FormControl,
    Select,
    MenuItem,
    TextField,
} from '@mui/material';
import { CheckCircle, Cancel, Delete, LocalShipping, Timelapse } from '@mui/icons-material';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosRequest from '../../Components/AxiosRequest';


export default function OwnerDashboard() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showPreparingSelect, setShowPreparingSelect] = useState(false);
    const [preparingTime, setPreparingTime] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [approvedOrders, setApprovedOrders] = useState([]); // State to track approved orders
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All orders');
    // const [totalOrders, setTotalOrders] = useState({
    //     'All orders': 0,
    //     'New orders': 0,
    //     'Delivered': 0,
    //     'Preparing': 0,
    //     'Declined': 0,
    //     'Completed': 0,
    // });

    const handleStatusFilterChange = (filter) => {
        setStatusFilter(filter);
    };

    const resName = localStorage.getItem('resName');



    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await AxiosRequest.get(`/orders/${resName}`);
                setOrders(response.data.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Failed to fetch orders. Please try again later.');
            }
        };

        fetchOrders();


        const interval = setInterval(() => {
            fetchOrders();
        },180000 ); // Fetch orders every 3 minutes
        return () => clearInterval(interval);

    }, [resName]);


    useEffect(() => {
        let filtered = orders;

        // Filter orders based on statusFilter and include orders with no status, Approved status, and Preparing status
        filtered = filtered.filter(order => {
            if (statusFilter === 'All orders') {
                return order.status === '' || order.status === 'No Status Yet' || order.status === 'Approved' || order.status === 'Not Approved' || order.status === 'Preparing' || order.status === 'Completed' || order.status === 'Delivered';
            }
            else if (statusFilter === 'New orders') {
                // Filter orders with status 'Approved', 'Preparing', empty status, or 'no status' within the last hour
                return (order.status === 'Approved' || order.status === 'Preparing' || order.status === '') && new Date(order.orderTime) > new Date(Date.now() - 60 * 60 * 1000);
            }
            else if (statusFilter === 'Delivered') {
                return order.status === 'Delivered' && order.status !== 'Not Approved';
            }
            else if (statusFilter === 'Preparing') {
                return order.status === 'Preparing';
            }
            else if (statusFilter === 'Declined') {
                return order.status === 'Not Approved';
            }
            else if (statusFilter === 'Completed') {
                return order.status === 'Completed';
            }
            return true; // Show all orders if no filter is applied

        });

        // Filter orders based on search term (order ID)
        filtered = filtered.filter(order => order.orderId.includes(searchTerm.toLowerCase()));
        filtered = filtered.sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime));


        setFilteredOrders(filtered);
    }, [searchTerm, orders, statusFilter]);


    // const calculateTotalOrders = useMemo(() => {
    //     const total = Object.keys(totalOrders).reduce((acc, key) => acc + totalOrders[key], 0);
    //     return total;
    // }, [totalOrders]);

    // const OrderStatusFilter = ({ statusFilter, totalOrders }) => {
    //     return (
    //         <div>
    //             <Typography variant="h6" align="center">
    //                 Total {statusFilter} Orders: {totalOrders}
    //             </Typography>
    //         </div>
    //     );
    // };


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

    const calculateTotalPrice = product => {
        let totalPrice = product.price;
        if (product.extras && product.extras.length > 0) {
            totalPrice += product.extras.reduce((acc, extra) => acc + extra.price, 0);
        }
        return totalPrice.toFixed(2);
    };

    const handleDelete = async (orderId) => {
        try {
            // Ask for confirmation before deleting
            const confirmed = window.confirm(`Are you sure you want to delete order ${orderId}?`);

            if (confirmed) {
                // Send delete request to server
                await AxiosRequest.delete(`/orders/${orderId}`);

                // Update state to remove the deleted order from the list
                setOrders((prevOrders) =>
                    prevOrders.filter((order) => order.orderId !== orderId)
                );

                // Set success message
                setSuccessMessage(`Order ${orderId} has been deleted.`);
            } else {
                // User canceled deletion
                console.log('Deletion canceled.');
            }
        } catch (error) {
            // Error handling
            console.error('Error deleting order:', error);
        }
    };


    const handleGoToRestaurantArea = () => {
        localStorage.removeItem('isClient');
        localStorage.removeItem('isAdmin');
        window.location.replace(`/${resName}`);
    };

    const handleDelivered = orderId => {
        updateOrderStatus(orderId, 'Delivered');
    };

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

    const toastStyle = {
        container: "max-w-sm mx-auto",
        toast: "bg-red-500 text-white font-bold",
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
                Orders for {resName}
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
                <Typography variant="h6"
                    component="h1"
                    gutterBottom
                    sx={{
                        color: 'black',
                        fontWeight: 'bold',
                    }}>Set Restaurant Status To:</Typography>

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
                                Open
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
                                Busy
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
                                Closed
                            </Button>
                        </Grid>
                    </Grid>

                    <Grid container classes={{ root: 'grid grid-cols-1 md:grid-rows-1' }} className='mb-4' spacing={2} justifyContent="center">
                        <Grid item>
                            <Button
                                variant="contained"
                                onClick={() => handleStatusFilterChange('All orders')}
                            >
                                All Orders
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                onClick={() => handleStatusFilterChange('New orders')}
                            >
                                New Orders
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                onClick={() => handleStatusFilterChange('Preparing')}
                            >
                                Preparing
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                onClick={() => handleStatusFilterChange('Delivered')}
                            >
                                Delivered Orders
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                onClick={() => handleStatusFilterChange('Completed')}
                            >
                                Completed Orders
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                onClick={() => handleStatusFilterChange('Declined')}
                            >
                                Declined Orders
                            </Button>
                        </Grid>
                    </Grid>
                    <Typography variant="h6" align="center">
                        Current Status Filter: {statusFilter}
                    </Typography>
                </div>

                {filteredOrders.length > 0 ? (
                    <Paper elevation={3} className="md:w-full  p-6 border border-gray-300 rounded-lg">
                        {filteredOrders.map(order => (
                            <Card key={order._id} className="md:min-w-screen mb-4">
                                <CardContent className="flex flex-col gap-4">
                                    {order.status === '' || order.status === 'Not Approved' ? (
                                        <>
                                            {order.status === 'Preparing' && order.preparingTime && (
                                                <Typography variant="h6" gutterBottom>
                                                    Preparing Time: {order.preparingTime} minutes
                                                </Typography>
                                            )}
                                            <Typography variant="h6" gutterBottom>
                                                Order ID: {order.orderId}
                                            </Typography>
                                            {order.orderLocation && order.shippingOption === 'delivery' && (
                                                <div className="flex justify-center mb-2 space-x-4">
                                                    <Button variant="contained" onClick={() => openGoogleMaps(order.orderLocation.coordinates[0], order.orderLocation.coordinates[1])}>
                                                        Open in Google Maps
                                                    </Button>
                                                    <Button variant="contained" onClick={() => openWaze(order.orderLocation.coordinates[0], order.orderLocation.coordinates[1])}>
                                                        Open in Waze
                                                    </Button>
                                                </div>
                                            )}

                                            {order.shippingInfo && (
                                                <div className="flex flex-col gap-2">
                                                    <Typography variant="body2" className="font-bold">Shipping Info:</Typography>
                                                    <div className="p-4 bg-gray-100 rounded-lg">
                                                        <Typography variant="body2">
                                                            Customer Name: {order.shippingInfo.name}<br />
                                                            Email: {order.shippingInfo.email}<br />
                                                            Address: {order.shippingOption === 'delivery' ? order.orderLocation.coordinates[0] + ', ' + order.orderLocation.coordinates[1] : ''}<br />
                                                            Phone: {order.shippingInfo.phoneNumber1}<br />
                                                            Order Type: {order.shippingOption}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-2">
                                                <Typography variant="body2" className="font-bold">Products:</Typography>
                                                {order.products.map(product => (
                                                    <div key={product._id} className="p-4 bg-gray-100 rounded-lg">
                                                        <Typography variant="body2">
                                                            Name: {product.name}<br />
                                                            Quantity: {product.quantity}<br />
                                                            Price: {product.price}<br />
                                                            Extras: {product.extras && product.extras.length > 0 ? product.extras.map(extra => extra.name).join(', ') : 'None'}<br />
                                                            Extras Price: {product.extras && product.extras.length > 0 ? product.extras.map(extra => extra.price).join(', ') : 'None'}<br />
                                                            Total Price: {calculateTotalPrice(product)}<br />
                                                            Status: {order.status ? order.status : 'No Status Yet'}<br />
                                                            Ordered At: {formatDate(order.orderTime)}
                                                        </Typography>
                                                    </div>
                                                ))}
                                            </div>
                                            <Grid container classes={{ root: 'grid grid-cols-1 md:grid-rows-1' }} className='mb-4' spacing={2} justifyContent="center">
                                                <Grid item>
                                                    <Button variant='contained' startIcon={<CheckCircle />} onClick={() => handleApprove(order.orderId)}>Approved</Button>
                                                </Grid>
                                                <Grid item>
                                                    <Button variant="contained" startIcon={<Cancel />} onClick={() => handleNotApproved(order.orderId)}>Not Approved</Button>
                                                </Grid>
                                            </Grid>
                                        </>
                                    ) : (
                                        <>
                                            {order.status === 'Preparing' && order.preparingTime && (
                                                <Typography variant="h6" gutterBottom>
                                                    Preparing Time: {order.preparingTime} minutes
                                                </Typography>
                                            )}
                                            {order.status === 'Preparing' && order.preparingStartedAt && (
                                                <Typography variant="h6" gutterBottom>
                                                    Remaining Preparing Time: {calculateRemainingPreparingTime(order)} minutes
                                                </Typography>
                                            )}
                                            <Typography variant="h6" gutterBottom>
                                                Order ID: {order.orderId}
                                            </Typography>
                                            <div className="flex flex-col gap-2">
                                                <Typography variant="body2" className="font-bold">Shipping Info:</Typography>
                                                <div className="p-4 bg-gray-100 rounded-lg">
                                                    <Typography variant="body2">
                                                        Customer Name: {order.shippingInfo.name}<br />
                                                        Email: {order.shippingInfo.email}<br />
                                                        Address: {order.shippingInfo.address}<br />
                                                        Phone: {order.shippingInfo.phoneNumber1}
                                                    </Typography>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Typography variant="body2" className="font-bold">Products:</Typography>
                                                {order.products.map(product => (
                                                    <div key={product._id} className="p-4 bg-gray-100 rounded-lg">
                                                        <Typography variant="body2">
                                                            Name: {product.name}<br />
                                                            Quantity: {product.quantity}<br />
                                                            Price: {product.price}<br />
                                                            Extras: {product.extras && product.extras.length > 0 ? product.extras.map(extra => extra.name).join(', ') : 'None'}<br />
                                                            Extras Price: {product.extras && product.extras.length > 0 ? product.extras.map(extra => extra.price).join(', ') : 'None'}<br />
                                                            Total Price: {calculateTotalPrice(product)}<br />
                                                            Status: {order.status ? order.status : 'No Status Yet'}<br />
                                                            Ordered At: {formatDate(order.orderTime)}
                                                        </Typography>
                                                    </div>
                                                ))}
                                            </div>
                                            <Grid container classes={{ root: 'grid grid-cols-1 md:grid-rows-1' }} className='mb-4' spacing={2} justifyContent="center">
                                                <Grid item>
                                                    <Button variant="contained" startIcon={<Timelapse />} onClick={() => handlePreparing(order.orderId)}>Preparing</Button>
                                                </Grid>
                                                <Grid item>
                                                    <Button variant="contained" startIcon={<Delete />} onClick={() => handleDelete(order.orderId)}>Delete</Button>
                                                </Grid>
                                                <Grid item>
                                                    <Button variant="contained" startIcon={<LocalShipping />} onClick={() => handleDelivered(order.orderId)}>Delivered</Button>
                                                </Grid>
                                                <Grid item>
                                                    <Button variant="contained" startIcon={<CheckCircle />} onClick={() => handleCompleted(order.orderId)}>Completed</Button>
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
                                                        Set Preparing Time
                                                    </Button>
                                                </FormControl>
                                            )}
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </Paper>
                ) : (
                    <Typography textAlign="center" mt={5} fontWeight="bold">
                        No orders found
                    </Typography>
                )}
                <Button className="mt-4 mb-4" variant="contained" onClick={handleGoToRestaurantArea}>
                    GO TO RESTAURANT AREA
                </Button>
            </Box>
        </Box>
    );
}
