import React, { useEffect, useState } from 'react';
import Card from '../views/card/card';
import styles from './Home.module.css';
import { Button, Typography, TextField } from '@mui/material'; // Import TextField component
import './Home.module.css';
import CircularProgress from '@mui/material/CircularProgress';
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosRequest from '../Components/AxiosRequest';
import Carousels from './Carousels/Carousels';


const HomeComponent = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [isOwner, setIsOwner] = useState();
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const token = localStorage.getItem('token');
  const resName = localStorage.getItem('resName');
  const name = localStorage.getItem('name');




  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const Owner = localStorage.getItem('isOwner');
        let endpoint = '/get-restaurants';
        let headers = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        if (Owner && resName) {
          endpoint = `/get-one-res/${resName}`;
          setIsOwner(Owner === "true");
        }
    
        const response = await AxiosRequest.get(endpoint, { headers });
        if (response && response.data) {
          setProducts(response.data.data);
        }
        setLoading(false);
    
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          if (!toast.isActive("errorToast")) {
            toast.error(error.response.data.error, { toastId: "errorToast" });
          }
        } else {
          if (!toast.isActive("errorToast")) {
            toast.error("An error occurred", { toastId: "errorToast" });
          }
        }
        setLoading(false);
      }
    };
    
    fetchProducts();

    const interval = setInterval(fetchProducts, 3 *60* 1000); // 3 minute in milliseconds

    return () => clearInterval(interval); 
  }, [token, resName]);




  const handleOrder = () => {
    window.location.replace('/orders');
  }

  const handleOwnerOrder = () => {
    window.location.replace(`/owner`);
  }

  const filteredProducts = products && products.length > 0
  ? products.filter(product =>
      product.restaurantName && product.restaurantName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];


  const toastStyle = {
    container: "max-w-sm mx-auto",
    toast: "bg-red-500 text-white font-bold",
  };
  


  return (
    <div className='bg-white'>
      <Carousels/>
      <div className={`${styles.p4}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 className='mt-4'>Restaurant Area</h2>
        {(localStorage.getItem('isClient') === 'true' || localStorage.getItem('isAdmin') === 'true') && (
          <TextField
            placeholder="Search by restaurant name"
            value={searchTerm}
            type='search'
            variant='outlined'
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-[70vw] mb-4'
          />
        )}
        {isOwner && (
          <>
            {/* Display user's name */}
            <Typography
  variant="h5" // Changed to a slightly larger variant for emphasis
  component="h1"
  gutterBottom
  sx={{
    fontWeight: 'bold',
    color: '#333', // Dark gray color for better readability
    textAlign: 'center', // Centered text
    mb: 3, // Margin-bottom for spacing
  }}
>
  Welcome Back{ name ? `: ${name}` : '' }
</Typography>
            <Button variant="contained" color="primary" onClick={handleOwnerOrder}>
              View Orders
            </Button>
          </>
        )}
        {localStorage.getItem('isAdmin') === 'true' &&(
                      <Typography
                      variant="h5" // Changed to a slightly larger variant for emphasis
                      component="h1"
                      gutterBottom
                      sx={{
                        fontWeight: 'bold',
                        color: '#333', // Dark gray color for better readability
                        textAlign: 'center', // Centered text
                        mb: 3, // Margin-bottom for spacing
                      }}
                    >
           Welcome Back: Admin 
         </Typography>
        )

        }
        {localStorage.getItem('isClient') === 'true' && (
          <>
            <Button
              className={`Btn2 ${isOwner ? 'newCssClass' : ''}`}
              onClick={handleOrder}
              sx={{
                backgroundColor: '#87cefa',
                color: '#000',
                '&:hover': {
                  backgroundColor: '#add8e6',
                  fontWeight: 'bold',
                },
                fontWeight: 'bold',
              }}
            >
              My Orders
            </Button>
            {/* Display user's name */}
            <Typography className='' variant="h5" component="h1" gutterBottom>
              Welcome Back: {name ? name : ''}
            </Typography>
          </>
        )}
        <div className={styles.containerr}>
          {loading ? (
            <div className={styles.loadingContainer}>
               <CircularProgress/>
               </div>
          ) : (
            isOwner ? (
              <>
              {products.length != 0 && (
                <Card key={products._id} product={products}/>
              )
              }
              </>
            ) : (
              searchTerm === '' ? (
                products.length != 0 && (
                  <>
                    {products.map((product, index) => (
                      <Card key={index} product={product} />
                    ))}
                  </>
                )
              ) : (
                filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => (
                    <Card key={index} product={product}/>
                  ))
                ) : (
                  <Typography variant="body1">No restaurants found for "{searchTerm}"</Typography>
                )
              )
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeComponent;
