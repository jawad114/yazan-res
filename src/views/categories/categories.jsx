import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import styles from './categories.module.css';
import AxiosRequest from '../../Components/AxiosRequest';
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
import { useLocation,useNavigate } from 'react-router-dom';


export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [restaurantImage, setRestaurantImage] = useState('');
  const [loading, setLoading] = useState(true);
  const isOwner = localStorage.getItem('isOwner') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const location = useLocation();
  const navigate = useNavigate();

  const {resName} = useParams(); // Access the resName from state

  localStorage.setItem('resName', resName);

    useEffect(() => {
        if (!resName) {
            navigate('/forbidden'); // Replace with your target route
        }
    }, [resName, navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await AxiosRequest.get(`/restaurant-categories/${resName}`);
        if (response.data.status === "ok" ) {
          setCategories(response.data.categories);
          setRestaurantImage(response.data.restaurantImage);
          console.log('Categories Data', response.data.categories);
          console.log('Category Image', response.data.categoryImage);
        }
        else if (response.data.status === "notfound"){
          setRestaurantImage(response.data.restaurantImage);
          console.log('Restaurant Image', response.data.restaurantImage);
          console.log('Category Not Found');
        }
      } catch (error) {
          console.log(error.message || "Internal Server Error");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [resName]);

  const handleAddCategory = () => {
    window.location.replace(`/add-category/${resName}`);
  };


const alt = `${resName}'s Image`

  return (
    <>
    <img src={restaurantImage} alt={alt} className="w-full h-[20vh] md:h-[64vh] object-cover mb-4" />
    <div className='flex flex-col w-full items-center text-center justify-center'>
    {loading ? (
      <div className='flex justify-center items-center h-screen'>
      <CircularProgress/>
      </div>
    ) : (
      <>
        <h1 className='my-5'>Categories of the Restaurant : {resName}</h1>
        <div>
          {categories.length === 0 ? (
            <p className='font-bold'>Category Not Found</p>
          ) : (
            categories.map((category, index) => (
              <Container className={styles.card} key={index}>
                <div className='flex flex-col items-center gap-[2vh] justify-center'>
                <img src={category.categoryImage} alt={`${category.categoryName}'s Image`} className='w-40 md:w-[16vw] object-cover' />
                  <Typography className='fw-bold text-center'>Category: {category.categoryName}</Typography>
                  <Button 
                    variant='contained'  
                    className={styles.btn} 
                    onClick={() => { window.location.replace(`/categories/${resName}/${category.categoryName}`) }}
                  >
                    Show Dishes in this Category
                  </Button>
                </div>
              </Container>
            ))
          )}
        </div>
        {(isAdmin || isOwner) && (
          <div className='flex w-[24vw] mb-4 items-center justify-center'>
            <Button variant="contained" className='btn-global' onClick={handleAddCategory}>Add Category</Button>
          </div>
        )}
      </>
    )}
  </div>
  </>
  );
}
