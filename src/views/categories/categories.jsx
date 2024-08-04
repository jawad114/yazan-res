import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import styles from './categories.module.css';
import AxiosRequest from '../../Components/AxiosRequest';
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';


export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [categoryImage, setCategoryImage] = useState('');
  const [loading, setLoading] = useState(true);
  const isOwner = localStorage.getItem('isOwner') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  
  const { resName } = useParams();

  localStorage.setItem('resName', resName);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await AxiosRequest.get(`/restaurant-categories/${resName}`);
        if (response.data.status === "ok") {
          setCategories(response.data.categories);
          setCategoryImage(response.data.categoryImage);
          console.log('Categories Data', response.data.categories);
          console.log('Category Image', response.data.categoryImage);
        }
      } catch (error) {
        if (error.response && error.response.data.error === 'Category not found in the specified restaurant') {
          console.log('Category Not Found');
        } else {
          console.log(error.message || "Internal Server Error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [resName]);

  const handleAddCategory = () => {
    window.location.replace(`/add-category/${resName}`);
  };


const alt = `${categories[0]} Category's Image`

  return (
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
                  <img src={categoryImage} alt={alt} className='w-40 md:w-[16vw] object-cover' />
                  <Typography className='fw-bold text-center'>Category: {category}</Typography>
                  <Button 
                    variant='contained'  
                    className={styles.btn} 
                    onClick={() => { window.location.replace(`/categories/${resName}/${category}`) }}
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
  );
}
