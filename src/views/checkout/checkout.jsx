import React, { useEffect, useState, useRef } from 'react';
import { TextField, Modal, Button, Grid, Typography } from '@mui/material';
import axios from 'axios';
import CustomModal from '../modal/modal';
import MapModal from './Map/MapModal';
import AxiosRequest from '../../Components/AxiosRequest';


const mapContainerStyle = {
  width: '100%',
  height: '40vh',
};

const center = {
  lat: 31.7683,
  lng: 35.2137,
};

const RestaurantLocationModal = ({ open, onClose, location }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const { latitude, longitude } = location;

  console.log('Latitude', latitude)
  console.log('Location', longitude)

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
        <h2>Restaurant Location</h2>
        {mapRef.current ? (
          <div ref={mapRef} style={{ width: '100%', height: 300, marginBottom: 20 }} />
        ) : null}
        <p>Latitude: {location.latitude}</p>
        <p>Longitude: {location.longitude}</p>
        <div className='flex flex-col justify-center items-center'>
          <Button onClick={handleShowOnGoogleMaps} className='mt-4' variant="contained">Show on Google Maps</Button>
          <Button onClick={handleShowOnWaze} className='mt-4' variant="contained">Show on Waze</Button>
          <Button onClick={onClose} className='mt-4' variant="contained">Close</Button>
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
  const [totalAmount, setTotalAmount] = useState(0);
  const [status, setStatus] = useState('');
  const [resName, setResName] = useState('');
  const customerId = localStorage.getItem('id');
  const [shippingOption, setShippingOption] = useState('');
  const [location, setLocation] = useState({ lat: 31.7683, lng: 35.2137 });
  const token = localStorage.getItem('token');
  const [selectedOption, setSelectedOption] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [showRestaurantLocationModal, setShowRestaurantLocationModal] = useState(false);
  const [resLocation, setResLocation] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    phoneNumber1: '',
    phoneNumber2: ''
  });


  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await AxiosRequest.get(`/get-cart/${customerId}`);
        setCart(response.data.cart);
        setResName(response.data.cart.orderFrom);
        setResLocation(response.data.cart.coordinates);
        setProducts(response.data.cart.products);
      }


      catch (error) {
        // Inside the catch block of your fetchCart function
        console.error('Error fetching cart:', error);
        setError(error.response ? error.response.data : error.message);
        setLoading(false); // Set loading to false in case of error

      }
    };

    fetchCart();
  }, [customerId, token]);


  useEffect(() => {
    const fetchDishDetails = async () => {
      if (cart) {
        try {
          const productsWithDetails = await Promise.all(cart.products.map(async (product) => {
            const response = await AxiosRequest.get(`/dishes/${product.productId}`);
            return { ...product, dishDetails: response.data.data };
          }));
          setCart(prevCart => ({ ...prevCart, products: productsWithDetails }));
        } catch (error) {
          setError(error);
        }
      }
    };

    fetchDishDetails();
  }, [cart]);

  if (error) {
    return <div><p style={{ color: 'red' }}>Error: {JSON.stringify(error.error)}</p></div>;
  }

  if (!cart) {
    return <div>Loading...</div>;
  }

  const handleMapClick = (event) => {
    setLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });

  };

  const handleCreateOrderButtonClick = () => {
    if (selectedOption === 'delivery') {
      setShowMap(true);
    }
    else if (selectedOption === 'self-pickup') {
      setShowRestaurantLocationModal(true);
      handleCreateOrder()
    }
  }

  const handleConfirmLocation = (newLocation) => {
    setLocation(newLocation);
    setShowMap(false);
    handleCreateOrder();
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

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting current location:', error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };


  const handleCloseModal = () => {
    setOpen(false);
  };




  const handleCreateOrder = async () => {
    if (!shippingInfo.name || !shippingInfo.email || !shippingInfo.phoneNumber1) {
      alert('Please fill all the fields')
      setShowRestaurantLocationModal(false);
      return;
    }
    if (!location) {
      alert('Please select your location')
      return
    }
    try {
      const orderData = {
        products: products,
        status: status,
        shippingInfo: shippingInfo,
        shippingOption: shippingOption,
        resName: resName,
        userLocation: location
      };
      console.log('Order Data', orderData)
      const response = await AxiosRequest.post(`/create-order/${customerId}`, orderData);
      console.log('Order created successfully:', response.data.order);
      console.log('Order created successfully');
      setOpen(true);

      // Optionally, you can reset the form fields here
    } catch (error) {
      console.error('Error creating order:', error.message);
    }
  };




  if (localStorage.getItem('token') == null) {
    return <>

      <Typography className='text-dark fw-bold mr-5 p-5'>Please login first to be able to place an order</Typography>
      <Button onClick={() => { window.location.replace('/login-client') }} className='btn-global w-50 text-light m-3'>Login now</Button></>


  }
  else {
    return (
      <>
        <h1>Delivery Info</h1><Grid sx={{ p: 6 }} container spacing={2}>
          <Grid item xs={12}>
            <div className='flex flex-col items-center justify-center mb-4'>
              <Grid item xs={12}>
                <Button
                  onClick={() => {
                    setShippingOption('delivery')
                    setSelectedOption('delivery')
                  }}
                  sx={{
                    backgroundColor: selectedOption === 'delivery' ? '#4caf50' : 'transparent',
                    color: selectedOption === 'delivery' ? '#fff' : '#000',
                    '&:hover': {
                      backgroundColor: selectedOption === 'delivery' ? '#4caf50' : '#f1f1f1',
                    },
                  }}
                >
                  Delivery
                </Button>
                <Button
                  onClick={() => {
                    setShippingOption('self-pickup')
                    setSelectedOption('self-pickup')
                  }}
                  sx={{
                    backgroundColor: selectedOption === 'self-pickup' ? '#4caf50' : 'transparent',
                    color: selectedOption === 'self-pickup' ? '#fff' : '#000',
                    '&:hover': {
                      backgroundColor: selectedOption === 'self-pickup' ? '#4caf50' : '#f1f1f1',
                    },
                  }}
                >
                  Self-Pickup
                </Button>
              </Grid>
            </div>
            <TextField
              label="Name"
              variant="outlined"
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
                  alert("The username must be between 3 and 20 characters.");
                }
              }}
              required />

          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={shippingInfo.email}
              onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
              required />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              value={shippingInfo.phoneNumber1}
              onChange={(e) => {
                const newPhoneNumber = e.target.value;
                if (/^\d{0,10}$/.test(newPhoneNumber)) {
                  setShippingInfo({ ...shippingInfo, phoneNumber1: newPhoneNumber });
                } else {
                  alert("Please enter numbers only for the phone number 10 numbers max.");
                }
              }}
              required />


          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone Number 2 is optional"
              variant="outlined"
              fullWidth
              value={shippingInfo.phoneNumber2}
              onChange={(e) => {
                const newPhoneNumber = e.target.value;
                if (/^\d*$/.test(newPhoneNumber) || newPhoneNumber === "") {
                  setShippingInfo({ ...shippingInfo, phoneNumber2: newPhoneNumber });
                } else {
                  alert("Please enter numbers only for the phone number.");
                }
              }} />
          </Grid>
          {selectedOption === 'delivery' && showMap && (
            <>
              <div>
                <h1>Checkout</h1>
                <Button onClick={() => setShowMap(true)}>Select Location</Button>
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
              onClose={() => setShowRestaurantLocationModal(false)}
              location={resLocation}
            />
          )}


          <Grid item xs={12}>
            <Button className='btn-global' variant="contained" color="primary" onClick={handleCreateOrderButtonClick}>
              Create Order
            </Button>
            <CustomModal handleClose={handleCloseModal} open={open} body={<div>
              <Typography className='text-center fs-4'>Order created successfully</Typography> <p>In This Time We Accept Cash Only</p>
              <div className='flex flex-col justify-center items-center'>
                <Button onClick={() => { window.location.replace('/'); }} className='mt-4' variant="contained">Continue Shopping </Button>
                <Button onClick={handleCloseModal} className='mt-4' variant="contained">Close</Button>
              </div>
            </div>} />
          </Grid>
        </Grid></>
    );
  }
};

export default Checkout;
