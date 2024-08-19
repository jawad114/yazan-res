import React, { useEffect, useState, useRef } from 'react';
import { TextField, Modal, Button, Grid, Typography, TextareaAutosize } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMotorcycle, faPersonWalking } from '@fortawesome/free-solid-svg-icons'; // Import FontAwesome icons
import MapModal from './Map/MapModal';
import AxiosRequest from '../../Components/AxiosRequest';
import { useLocation, useNavigate } from 'react-router-dom';
import {  toast } from "react-toastify";


const RestaurantLocationModal = ({ open, onClose, location }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const { latitude, longitude } = location;
  const navigate = useNavigate();


  useEffect(() => {
    const initializeMap = () => {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: location,
        zoom: 15,
      });

      const markerInstance = new window.google.maps.Marker({
        position: location,
        map: mapInstance,
        draggable: false,
        title: 'Restaurant Location',
      });

      setMap(mapInstance);
      setMarker(markerInstance);
    };

    if (open && mapRef.current) {
      initializeMap();
    }
  }, [open, location]);

  const handleShowOnGoogleMaps = () => {

    window.open(`https://www.google.com/maps/search/?api=1&query=${longitude},${latitude}`, '_blank');
  };

  const handleShowOnWaze = () => {
    window.open(`https://www.waze.com/ul?ll=${longitude},${latitude}&navigate=yes`, '_blank');
  };


  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', maxWidth: 400, backgroundColor: '#fff', padding: 20, borderRadius: 8 }}>
        <h2>موقع المتجر</h2>
        {mapRef.current ? (
          <div ref={mapRef} style={{ width: '100%', height: 300, marginBottom: 20 }} />
        ) : null}
        <p>Latitude: {location.latitude}</p>
        <p>Longitude: {location.longitude}</p>
        <div className='flex flex-col justify-center items-center'>
          <Button onClick={handleShowOnGoogleMaps} className='mt-4' variant="contained">عرض على خرائط جوجل</Button>
          <Button onClick={handleShowOnWaze} className='mt-4' variant="contained">عرض على ويز</Button>
          <Button onClick={() => navigate('/')} className='mt-4' variant="contained">اغلق</Button>
        </div>
      </div>
    </Modal>
  );

};



const Checkout = () => {

  const [cart, setCart] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [resName, setResName] = useState('');
  const customerId = localStorage.getItem('id');
  const [shippingOption, setShippingOption] = useState('');
  const [location, setLocation] = useState({ lat: 31.7683, lng: 35.2137,address:''});
  const token = localStorage.getItem('token');
  const [selectedOption, setSelectedOption] = useState('');
  const [showMap, setShowMap] = useState(false);
  const locationData = useLocation();
  const cartReceived = locationData.state?.cart;
  const [showRestaurantLocationModal, setShowRestaurantLocationModal] = useState(false);
  const [resLocation, setResLocation] = useState(null);
  const navigate = useNavigate();
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    phoneNumber1: '',
    phoneNumber2: '',
    note:'',
    address:''
  });
console.log('Cart Data received',cartReceived);

useEffect(() => {
  const fetchCart = async () => {
    try {
      // Assuming cartReceived is provided as a prop or from some context
      console.log('Cart Data received', cartReceived);

      // Set the cart
      setCart(cartReceived);

      // If cartReceived is an array and you need to extract location and products
      if (Array.isArray(cartReceived)) {
        // Map through the array to get the unique restaurant names and products
        const productsByRestaurant = cartReceived.reduce((acc, item) => {
          const resName = item.orderFrom;
          if (!acc[resName]) {
            acc[resName] = [];
          }
          acc[resName].push(item);
          return acc;
        }, {});

        // Extract a location from the first item or as per your logic
        const firstItem = cartReceived[0];
        const location = firstItem ? firstItem.coordinates : null;

        // Update state
        setResLocation(location);
        setProducts(productsByRestaurant);
      } else {
        console.error('cartReceived is not an array');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  fetchCart();
}, [customerId, token, cartReceived]);



useEffect(() => {
  const fetchOrders = async () => {
    try {
      const response = await AxiosRequest.get(`/order/delivery/${customerId}`);
      const { order } = response.data;
      console.log('Order', order);
        const { orderLocation,shippingInfo } = order;
        console.log('Order Location', orderLocation);
        if (orderLocation && orderLocation.coordinates && orderLocation.formatted_address) {
          // Set location with latitude, longitude, and address
          setShippingInfo({
            name: shippingInfo.name || '',
            email: shippingInfo.email || '',
            phoneNumber1: shippingInfo.phoneNumber1 || '',
            phoneNumber2: shippingInfo.phoneNumber2 || '',
            note: shippingInfo.note || '',
            address:shippingInfo.address || '',
          })
          setLocation({
            lat: orderLocation.coordinates[1], 
            lng: orderLocation.coordinates[0],
            address: orderLocation.formatted_address
          });
        }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  fetchOrders();
}, [customerId]);



  // useEffect(() => {
  //   const fetchDishDetails = async () => {
  //     if (cart) {
  //       try {
  //         const productsWithDetails = await Promise.all(cart.products.map(async (product) => {
  //           const response = await AxiosRequest.get(`/dishes/${product.productId}`);
  //           return { ...product, dishDetails: response.data.data };
  //         }));
  //         setCart(prevCart => ({ ...prevCart, products: productsWithDetails }));
  //       } catch (error) {
  //         setError(error);
  //       }
  //     }
  //   };

  //   fetchDishDetails();
  // }, [cart]);

  if (error) {
    return <div><p style={{ color: 'red' }}>Error: {JSON.stringify(error.error)}</p></div>;
  }

  if (!cart) {
    return <div>Loading...</div>;
  }

  // const handleMapClick = (event) => {
  //   setLocation({
  //     lat: event.latLng.lat(),
  //     lng: event.latLng.lng(),
  //   });

  // };



  

  const handleCreateOrderButtonClick = async () => {
    if(!selectedOption){
      toast.error('الرجاء اختيار طريقة الاستلام قبل اكمال الطلب');
      return;
     }
    if (selectedOption === 'delivery') {
      setShowMap(true);
    } else if (selectedOption === 'self-pickup' || selectedOption === 'dine-in') {
      // Ensure this call is separate and only triggers after showing the modal
      await handleCreateOrder();
    }
  };
  

  const handleConfirmLocation = (newLocation) => {
    setLocation(newLocation);
    console.log('New Location',newLocation);
    setShowMap(false);
    handleCreateOrder(newLocation)
    };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    if (cart && cart.products) {
      cart.products.forEach((product) => {
        if (product.dishDetails && product.dishDetails.price) {
          totalPrice += product.quantity * product.dishDetails.price;
        }
        if (product.dishDetails && product.dishDetails.extras && product.dishDetails.extras.length > 0) {
          product.dishDetails.extras.forEach((extra) => {
            if (extra.price) {
              totalPrice += extra.price * product.quantity;
            }
          });
        }
      });
    }
    return totalPrice;
  };


  const handleQuantityChange = (productId, action) => {
    const updatedCart = { ...cart };
    const productIndex = updatedCart.products.findIndex(product => product._id === productId);

    if (action === 'increment') {
      updatedCart.products[productIndex].quantity++;
    } else if (action === 'decrement') {
      updatedCart.products[productIndex].quantity--;
      if (updatedCart.products[productIndex].quantity < 1) {
        updatedCart.products[productIndex].quantity = 1; // Ensure quantity doesn't go below 1
      }
    }

    setCart(updatedCart);
  };

  // const handleGetCurrentLocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         setLocation({
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         });
  //       },
  //       (error) => {
  //         console.error('Error getting current location:', error);
  //       },
  //       { enableHighAccuracy: true }
  //     );
  //   } else {
  //     console.error('Geolocation is not supported by this browser.');
  //   }
  // };


  const handleCloseModal = () => {
    setShowRestaurantLocationModal(false); // Close the modal
    navigate('/'); // Navigate to the desired route
  };



  const handleCreateOrder = async (currentLocation) => {
    if (
      !shippingInfo.name || 
      (shippingOption !== 'dine-in' && (!shippingInfo.email || !shippingInfo.phoneNumber1))
    ) {
      toast.error('Please fill all the fields');
      setShowRestaurantLocationModal(false);
      return;
    }
    
    if (shippingOption === 'delivery' && !currentLocation) {
      toast.error('Please select your location for delivery.');
      return;
  }
    try {
      const orderData = {
        products: products,
        shippingInfo:shippingInfo,
        shippingOption: shippingOption,
        userLocation: currentLocation,
        ...(shippingOption === 'dine-in' && tableNumber && { tableNumber: parseInt(tableNumber, 10) }) // Conditionally add tableNumber
      };      
      const response = await AxiosRequest.post(`/create-order/${customerId}`, orderData);
      toast.success('Order created successfully');
      if (selectedOption === 'self-pickup' ) {
        setShowRestaurantLocationModal(true);
      }
      else if (selectedOption === 'dine-in' || selectedOption === 'delivery') {
        navigate('/');
      }
    } catch (error) {
      console.log(error);
  
      const errorMessage = error.response?.data?.error || "An unexpected error occurred";
  
      switch (errorMessage) {
        case "Products array is empty or not provided":
          toast.error("Please provide the products for your order.");
          break;
        case "No valid restaurants found in products":
          toast.error("Restaurant name is missing in the products.");
          break;
        case "Table is not available for order":
          toast.error(`Table is not available for order at ${error.response.data.resName}.`);
          break;
        case "Restaurant is closed":
          toast.error(`The restaurant ${error.response.data.resName} is closed.`);
          break;
        case "User location is required for delivery option":
          toast.error("User location is required for the delivery option.");
          break;
        case "Invalid shipping option":
          toast.error("Invalid shipping option selected.");
          break;
        default:
          const details = error.response?.data?.details;

if (Array.isArray(details) && details.length > 0) {
  details.forEach(detail => {
    toast.error(`Error creating order for ${detail.resName}: ${detail.error}`);
    console.log(`Error creating order for ${detail.resName}: ${detail.error}`);
  });
} else {
  toast.error('An error occurred while creating the order.');
  console.log('Error:', error);
}
          break;
      }
    }
  };



  if (localStorage.getItem('token') == null) {
    return <>

      <Typography className='text-dark fw-bold mr-5 p-5'>يرجى تسجيل الدخول أولاً لتتمكن من تقديم الطلب</Typography>
      <Button onClick={() => { window.location.replace('/login-client') }} className='btn-global w-50 text-light m-3'>Login now</Button></>


  }
  else {
    return (
      <div className='bg-white'>
        <h1 className='text-center mt-4'>معلومات التوصيل</h1>
        <Grid sx={{ p: 6 }} container spacing={2}>
          <Grid item xs={12}>
            <div className='flex flex-col items-center justify-center text-center mb-4'>
              <Grid item xs={12}>
              <Button
              onClick={() => {
                setShippingOption('delivery');
                setSelectedOption('delivery');
              }}
              sx={{
                backgroundColor: selectedOption === 'delivery' ? '#3B92D6' : 'lightgray',
                color: selectedOption === 'delivery' ? '#fff' : '#000',
                '&:hover': {
                  backgroundColor: selectedOption === 'delivery' ? '#3B92D6' : '#fff',
                },
              }}
              startIcon={<FontAwesomeIcon icon={faMotorcycle} />} // Motorcycle icon for delivery
            >
              توصيل
            </Button>
            <Button
              onClick={() => {
                setShippingOption('self-pickup');
                setSelectedOption('self-pickup');
              }}
              sx={{
                backgroundColor: selectedOption === 'self-pickup' ? '#3B92D6' : 'lightgray',
                color: selectedOption === 'self-pickup' ? '#fff' : '#000',
                '&:hover': {
                  backgroundColor: selectedOption === 'self-pickup' ? '#3B92D6' : '#fff',
                },
              }}
              startIcon={<FontAwesomeIcon icon={faPersonWalking} />} // Motorcycle icon for delivery
            >
              استلام ذاتي
            </Button>
                {/* <Button
                  onClick={() => {
                    setShippingOption('dine-in')
                    setSelectedOption('dine-in')
                  }}
                  sx={{
                    backgroundColor: selectedOption === 'dine-in' ? '#4caf50' : 'transparent',
                    color: selectedOption === 'dine-in' ? '#fff' : '#000',
                    '&:hover': {
                      backgroundColor: selectedOption === 'dine-in' ? '#4caf50' : '#f1f1f1',
                    },
                  }}
                >
                  Dine In
                </Button> */}
              </Grid>
            </div>
            <TextField
              label="الاسم"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-input:focus': {
                  outline: 'none', // Removes the focus ring
                  boxShadow: 'none',
                },
              }}
              style={{
                textAlign: 'start', // محاذاة النص إلى المركز
                direction: 'rtl',   // تحديد اتجاه الكتابة من اليمين لليسار
              }}
              fullWidth
              value={shippingInfo.name}
              onChange={(e) => {
                const newName = e.target.value;
                if (newName.length <= 20) {
                  setShippingInfo({ ...shippingInfo, name: newName });
                }
              }}
              onBlur={() => {
                if (shippingInfo.name.length < 3) {
                  alert("يجب أن يكون اسم المستخدم بين 3 و 20 حرفًا");
                }
              }}
              required />

          </Grid>
          {shippingOption !== 'dine-in' && (
            <>
          <Grid item xs={12}>
            <TextField
              label="البريد الإلكتروني"
              variant="outlined"
              fullWidth
              value={shippingInfo.email}
              style={{
                textAlign: 'start', // محاذاة النص إلى المركز
                direction: 'rtl',   // تحديد اتجاه الكتابة من اليمين لليسار
              }}
              sx={{
                '& .MuiOutlinedInput-input:focus': {
                  outline: 'none', // Removes the focus ring
                  boxShadow: 'none',
                },
              }}
              onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
              required />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="رقم الهاتف"
              variant="outlined"
              fullWidth
              style={{
                textAlign: 'start', // محاذاة النص إلى المركز
                direction: 'rtl',   // تحديد اتجاه الكتابة من اليمين لليسار
              }}
              value={shippingInfo.phoneNumber1}
              sx={{
                '& .MuiOutlinedInput-input:focus': {
                  outline: 'none', // Removes the focus ring
                  boxShadow: 'none',
                },
              }}
              onChange={(e) => {
                const newPhoneNumber = e.target.value;
                if (/^\d{0,10}$/.test(newPhoneNumber)) {
                  setShippingInfo({ ...shippingInfo, phoneNumber1: newPhoneNumber });
                } else {
                  alert("يرجى إدخال الأرقام فقط لرقم الهاتف بحد أقصى 10 أرقام");
                }
              }}
              required />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="رقم هاتف 2 اختياري"
              variant="outlined"
              style={{
                textAlign: 'start', // محاذاة النص إلى المركز
                direction: 'rtl',   // تحديد اتجاه الكتابة من اليمين لليسار
              }}
              fullWidth
              value={shippingInfo.phoneNumber2}
              sx={{
                '& .MuiOutlinedInput-input:focus': {
                  outline: 'none', // Removes the focus ring
                  boxShadow: 'none',
                },
              }}
              onChange={(e) => {
                const newPhoneNumber = e.target.value;
                if (/^\d*$/.test(newPhoneNumber) || newPhoneNumber === "") {
                  setShippingInfo({ ...shippingInfo, phoneNumber2: newPhoneNumber });
                } else {
                  alert("يرجى إدخال الأرقام فقط لرقم الهاتف");
                }
              }} 
              />
          </Grid>
          </>
          )}
          {selectedOption === 'delivery' && showMap && (
            <>
              <div>
                <h1>إتمام الشراء</h1>
                <Button onClick={() => setShowMap(true)}>حدد الموقع</Button>
                {showMap && (
                  <MapModal
                    open={showMap}
                    onClose={() => setShowMap(false)}
                    location={location}
                    onConfirm={handleConfirmLocation}
                  />
                )}
              </div>
            </>
          )}
          {selectedOption === 'self-pickup' && showRestaurantLocationModal && (
            <RestaurantLocationModal
              open={showRestaurantLocationModal}
              onClose={handleCloseModal}
              location={resLocation}
            />
          )}

{selectedOption === 'delivery' && (
  <>
            <Grid item xs={12}>
            <TextField
  label="في حال حدوث عطل في الخارطة التلقائية، يرجى استخدام هذا المربع لإدخال بياناتك يدويًا"
  type="text"
  variant="outlined"
  value={shippingInfo.address}
  style={{
    textAlign: 'start', // محاذاة النص إلى المركز
    direction: 'rtl',   // تحديد اتجاه الكتابة من اليمين لليسار
  }}
  onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
  fullWidth
  multiline
  rows={6}
  sx={{
    '& .MuiOutlinedInput-input:focus': {
      outline: 'none', // Removes the focus ring
      boxShadow: 'none',
    },
  }}
/>
          </Grid>
          <Grid item xs={12}>
            <TextField
  label="طلبات خاصة"
  type="text"
  variant="outlined"
  value={shippingInfo.note}
  style={{
    textAlign: 'start', // محاذاة النص إلى المركز
    direction: 'rtl',   // تحديد اتجاه الكتابة من اليمين لليسار
  }}
  onChange={(e) => setShippingInfo({ ...shippingInfo, note: e.target.value })}
  fullWidth
  multiline
  rows={6}
  sx={{
    '& .MuiOutlinedInput-input:focus': {
      outline: 'none', // Removes the focus ring
      boxShadow: 'none',
    },
  }}
/>
          </Grid>
            </>
        )}
{/* {selectedOption === 'dine-in' && (
          <Grid item xs={12}>
            <TextField
              label="Table Number"
              type="number"
              variant="outlined"
              fullWidth
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              required
            />
          </Grid>
        )} */}

          <Grid item xs={12} >
            <div className='flex items-center justify-center mt-4'>
          <Button
  className='btn-global'
  variant="contained"
  color="primary"
  onClick={handleCreateOrderButtonClick}
>
إنشاء طلب
</Button>
</div>
            {/* <CustomModal handleClose={handleCloseModal} open={open} body={<div>
              <Typography className='text-center fs-4'>Order created successfully</Typography> <p>In This Time We Accept Cash Only</p>
              <div className='flex flex-col justify-center items-center'>
                <Button onClick={() => { window.location.replace('/'); }} className='mt-4' variant="contained">Continue Shopping </Button>
                <Button onClick={handleCloseModal} className='mt-4' variant="contained">Close</Button>
              </div>
            </div>} /> */}
          </Grid>
        </Grid>
        </div>
    );
  }
};

export default Checkout;
