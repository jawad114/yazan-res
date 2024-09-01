import React, { useEffect, useState } from 'react';
import Card from '../views/card/card';
import { Typography, TextField, CircularProgress, Card as MuiCard, CardContent, CardMedia, Button } from '@mui/material';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosRequest from '../Components/AxiosRequest';
import Carousels from './Carousels/Carousels';
import { styled } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faShoppingBasket, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import './customScrollbar.css'

// Styled card for filters
const FilterCard = styled(MuiCard)(({ theme, selected }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  border: selected ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
  transition: 'border 0.3s',
  '&:hover': {
    border: `2px solid ${theme.palette.primary.main}`,
  },
}));



const HomeComponent = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [isOwner, setIsOwner] = useState();
  const [searchTerm, setSearchTerm] = useState(''); 
  const [selectedFilter, setSelectedFilter] = useState(''); 
  const token = localStorage.getItem('token');
  const resName = localStorage.getItem('resName');
  const name = localStorage.getItem('name');
  const [filter, setFilter] = useState([]);


  const fetchProducts = async (searchTerm = '') => {
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
      } else if (!Owner && searchTerm) {
        endpoint = `/search?q=${encodeURIComponent(searchTerm)}`;
      }

      const response = await AxiosRequest.get(endpoint, { headers });
      if (response && response.data) {
        setProducts(response.data.data || response.data); 
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

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 3 * 60 * 1000); 

    return () => clearInterval(interval);
  }, [token, resName]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await AxiosRequest.get('/allFilters');
        setFilter(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
  
    fetchFilters();
  }, []);
  
  const filterImages = filter.reduce((acc, filters) => {
    acc[filters.title] = filters.imageUrl;
    return acc;
  }, {});

  const handleOrder = () => {
    window.location.replace('/orders');
  };

  const handleOwnerOrder = () => {
    window.location.replace(`/owner`);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    fetchProducts(event.target.value);
  };

  const handleFilterSelect = (filter) => {
    if (selectedFilter === filter) {
      setSelectedFilter(''); 
      fetchProducts(''); 
    } else {
      setSelectedFilter(filter);
      fetchProducts(filter);
    }
  };

  return (
    <div className="bg-white">
      <Carousels />
      <div className="flex flex-col items-center p-4">
        {(localStorage.getItem('isClient') === 'true' || localStorage.getItem('isAdmin') === 'true') && (
          <TextField
            placeholder="البحث عن طريق اسم المتجر"
            style={{
              textAlign: 'center', // محاذاة النص إلى المركز
              direction: 'rtl',   // تحديد اتجاه الكتابة من اليمين لليسار
              width: '100%',      // لضمان ملء الحاوية
              padding: '8px',    // ضبط الحشو حسب الحاجة
            }}
            value={searchTerm}
            type="search"
            variant="outlined"
            onChange={handleSearch}
            className="w-full sm:w-[70vw] mb-4"
          />
        )}
        {isOwner && (
          <>
            <Typography
              variant="h5"
              component="h1"
              className="font-bold text-center text-gray-800 mb-3"
            >
              {name ? `${name} :` : ''}أهلاً وسهلاً
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOwnerOrder}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
            >
              طلباتي
            </Button>
          </>
        )}
        {localStorage.getItem('isAdmin') === 'true' && (
          <Typography
            variant="h5"
            component="h1"
            className="font-bold text-center text-gray-800 mb-3"
          >
             Admin :أهلاً وسهلاً
          </Typography>
        )}
        {localStorage.getItem('isClient') === 'true' && (
          <>
            <Button
            variant='contained'
              className= "bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4"
              onClick={handleOrder}
            >
              طلباتي
            </Button>
            <Typography
              variant="h5"
              component="h1"
              className="font-bold text-center mb-3"
            >
              {name ? `${name} :` : ''}أهلاً وسهلاً
            </Typography>

</>
)}
                  {!isOwner && (
<>       
<Typography 
  variant="h6" 
  component="h1" 
  className="!font-bold text-center mb-5 text-black shadow-md shadow-black rounded-lg p-2 bg-blue-100"
>
<span className="text-3xl">😎</span>عن ماذا تبحث اليوم؟
</Typography>
        <div className="flex !flex-row justify-start w-full gap-4 mb-4 px-0 overflow-x-auto custom-scrollbar transition-all duration-300">
        <div className="flex flex-nowrap w-max gap-2">
    {Object.keys(filterImages).map((filter) => (
      <FilterCard
        key={filter}
        selected={selectedFilter === filter}
        onClick={() => handleFilterSelect(filter)}
        className="flex flex-col shadow-lg bg-white rounded-lg items-center justify-center w-[20vw] min-w-[20vw] max-w-[20vw]"
      >
        <CardMedia
          component="img"
          image={filterImages[filter]}
          alt={filter}
          className="w-full h-[10vh] md:h-[20vh] object-cover"
        />
        <div className="flex items-start justify-start text-start">
          <Typography className="font-bold text-black" component="div">
            {filter}
          </Typography>
        </div>
      </FilterCard>
    ))}
  </div>
</div>
        </>
        )}
              <Typography 
  variant="h6" 
  component="h1" 
  className="!font-bold text-center mb-2 text-black shadow-md shadow-black rounded-lg p-2 bg-blue-100"
>
<span className="text-3xl"><FontAwesomeIcon icon={faCartShopping} color='black'/></span> سوق إلكتروني
</Typography>
<div className={`grid ${isOwner ? 'grid-cols-1 md:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'} gap-4 w-full`}>
{loading ? (
            <div className="flex justify-center items-center h-64">
              <CircularProgress />
            </div>
          ) : isOwner ? (
            <>
              {products.length !== 0 && (
                <Card key={products._id} product={products}/>
              )
              }
              </>
            ) :(
            products.length > 0 ? (
              products.map((product, index) => (
                <Card product={product} key={index} />
              ))
            ) : (
              <Typography variant="h5" component="h2" className="text-center col-span-full">
                لم يتم العثور على المتجر المطلوب
              </Typography>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeComponent;





