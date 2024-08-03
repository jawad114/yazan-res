import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import styles from './categories.module.css';
import AxiosRequest from '../../Components/AxiosRequest';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
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
          setLoading(false);
        } else {
          setError(response.data.error || "Unknown error occurred");
          setLoading(false);
        }
      } catch (error) {
        setError(error.message || "Internal Server Error");
        setLoading(false);
      }
    };

    fetchCategories();
  }, [resName]);

  const handleAddCategory = () => {
    window.location.replace(`/add-category/${resName}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <div className='flex flex-col w-full items-center text-center justify-center'>
      <h1 className='my-5'>Categories of the Restaurant : {resName}</h1>
      <div>
        {categories.map((category, index) => (
          <Container className={styles.card} key={index}>
            <Typography className='fw-bold mb-4 text-center'>Category: {category}</Typography>
            <Button variant='contained' className='btn-global' onClick={() => { window.location.replace(`/categories/${resName}/${category}`) }}>Show Dishes in this Category</Button>
          </Container>
        ))}
      </div>
      {(isAdmin || isOwner) ? (
      <div className='flex w-[24vw] mb-4'>
        <Button variant="contained" className='btn-global' onClick={handleAddCategory}>Add Category</Button>
      </div>
    ) : null}
    </div>
  );
}
