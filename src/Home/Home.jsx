// import React, { useEffect, useState } from 'react';
// import Card from '../views/card/card';
// import styles from './Home.module.css';
// import { Button, Typography, TextField } from '@mui/material'; // Import TextField component
// import './Home.module.css';
// import CircularProgress from '@mui/material/CircularProgress';
// import {toast} from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import AxiosRequest from '../Components/AxiosRequest';
// import Carousels from './Carousels/Carousels';


// const HomeComponent = () => {
//   const [loading, setLoading] = useState(true);
//   const [products, setProducts] = useState([]);
//   const [isOwner, setIsOwner] = useState();
//   const [searchTerm, setSearchTerm] = useState(''); // State for search term
//   const token = localStorage.getItem('token');
//   const resName = localStorage.getItem('resName');
//   const name = localStorage.getItem('name');




//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const Owner = localStorage.getItem('isOwner');
//         let endpoint = '/get-restaurants';
//         let headers = {};
//         if (token) {
//           headers.Authorization = `Bearer ${token}`;
//         }
//         if (Owner && resName) {
//           endpoint = `/get-one-res/${resName}`;
//           setIsOwner(Owner === "true");
//         }
    
//         const response = await AxiosRequest.get(endpoint, { headers });
//         if (response && response.data) {
//           setProducts(response.data.data);
//         }
//         setLoading(false);
    
//       } catch (error) {
//         if (error.response && error.response.data && error.response.data.error) {
//           if (!toast.isActive("errorToast")) {
//             toast.error(error.response.data.error, { toastId: "errorToast" });
//           }
//         } else {
//           if (!toast.isActive("errorToast")) {
//             toast.error("An error occurred", { toastId: "errorToast" });
//           }
//         }
//         setLoading(false);
//       }
//     };
    
//     fetchProducts();

//     const interval = setInterval(fetchProducts, 3 *60* 1000); // 3 minute in milliseconds

//     return () => clearInterval(interval); 
//   }, [token, resName]);




  // const handleOrder = () => {
  //   window.location.replace('/orders');
  // }

  // const handleOwnerOrder = () => {
  //   window.location.replace(`/owner`);
  // }

//   const filteredProducts = products && products.length > 0
//   ? products.filter(product =>
//       product.restaurantName && product.restaurantName.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   : [];


//   const toastStyle = {
//     container: "max-w-sm mx-auto",
//     toast: "bg-red-500 text-white font-bold",
//   };
  


//   return (
//     <div className='bg-white'>
//       <Carousels/>
//       <div className={`${styles.p4}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//         <h2 className='mt-4'>Restaurant Area</h2>
//         {(localStorage.getItem('isClient') === 'true' || localStorage.getItem('isAdmin') === 'true') && (
//           <TextField
//             placeholder="Search by restaurant name"
//             value={searchTerm}
//             type='search'
//             variant='outlined'
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className='w-[70vw] mb-4'
//           />
//         )}
//         {isOwner && (
//           <>
//             {/* Display user's name */}
//             <Typography
//   variant="h5" // Changed to a slightly larger variant for emphasis
//   component="h1"
//   gutterBottom
//   sx={{
//     fontWeight: 'bold',
//     color: '#333', // Dark gray color for better readability
//     textAlign: 'center', // Centered text
//     mb: 3, // Margin-bottom for spacing
//   }}
// >
//   Welcome Back{ name ? `: ${name}` : '' }
// </Typography>
//             <Button variant="contained" color="primary" onClick={handleOwnerOrder}>
//               View Orders
//             </Button>
//           </>
//         )}
//         {localStorage.getItem('isAdmin') === 'true' &&(
//                       <Typography
//                       variant="h5" // Changed to a slightly larger variant for emphasis
//                       component="h1"
//                       gutterBottom
//                       sx={{
//                         fontWeight: 'bold',
//                         color: '#333', // Dark gray color for better readability
//                         textAlign: 'center', // Centered text
//                         mb: 3, // Margin-bottom for spacing
//                       }}
//                     >
//            Welcome Back: Admin 
//          </Typography>
//         )

//         }
//         {localStorage.getItem('isClient') === 'true' && (
//           <>
//             <Button
//               className={`Btn2 ${isOwner ? 'newCssClass' : ''}`}
//               onClick={handleOrder}
//               sx={{
//                 backgroundColor: '#87cefa',
//                 color: '#000',
//                 '&:hover': {
//                   backgroundColor: '#add8e6',
//                   fontWeight: 'bold',
//                 },
//                 fontWeight: 'bold',
//               }}
//             >
//               My Orders
//             </Button>
//             {/* Display user's name */}
//             <Typography className='' variant="h5" component="h1" gutterBottom>
//               Welcome Back: {name ? name : ''}
//             </Typography>
//           </>
//         )}
//         <div className={styles.containerr}>
//           {loading ? (
//             <div className={styles.loadingContainer}>
//                <CircularProgress/>
//                </div>
          // ) : (
          //   isOwner ? (
          //     <>
          //     {products.length != 0 && (
          //       <Card key={products._id} product={products}/>
          //     )
          //     }
          //     </>
          //   ) : (
//               searchTerm === '' ? (
//                 products.length != 0 && (
//                   <>
//                     {products.map((product, index) => (
//                       <Card key={index} product={product} />
//                     ))}
//                   </>
//                 )
//               ) : (
//                 filteredProducts.length > 0 ? (
//                   filteredProducts.map((product, index) => (
//                     <Card key={index} product={product}/>
//                   ))
//                 ) : (
//                   <Typography variant="body1">No restaurants found for "{searchTerm}"</Typography>
//                 )
//               )
//             )
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default HomeComponent;





import React, { useEffect, useState } from 'react';
import Card from '../views/card/card';
import { Typography, TextField, CircularProgress, Card as MuiCard, CardContent, CardMedia, Button } from '@mui/material';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosRequest from '../Components/AxiosRequest';
import Carousels from './Carousels/Carousels';
import { styled } from '@mui/material/styles';

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

const filterImages = {
  Pizza: 'https://img.freepik.com/free-photo/pizza-pizza-filled-with-tomatoes-salami-olives_140725-1200.jpg?t=st=1723412148~exp=1723412748~hmac=2c9ce93a60185d8f1ba982bc2cdfe94ab6cd4d8fe24ef94f0eba66b293b892cb',
  Burger: 'https://img.freepik.com/free-photo/tasty-burger-isolated-white-background-fresh-hamburger-fastfood-with-beef-cheese_90220-1063.jpg?t=st=1723412251~exp=1723415851~hmac=5d3735b2ba878286996d8d583fc7d2ec647f81e141d38d5902edccf725f17376&w=740',
  Drinks: 'https://img.freepik.com/free-vector/soda-can-concept-illustration_114360-26889.jpg?t=st=1723412486~exp=1723416086~hmac=9963c421549ead18be0c30e65be752e393dae5162c0a278a3a78b55a44d097e6&w=740',
  Sushi: 'https://img.freepik.com/free-photo/side-view-mix-sushi-rolls-tray-with-ginger-wasabi_141793-14242.jpg?t=st=1723412536~exp=1723416136~hmac=8c1dd207a681ec2063a10b5e86b682036b50ff69c104cb2cbc0254c62cdc4fff&w=900'
};

const HomeComponent = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [isOwner, setIsOwner] = useState();
  const [searchTerm, setSearchTerm] = useState(''); 
  const [selectedFilter, setSelectedFilter] = useState(''); 
  const token = localStorage.getItem('token');
  const resName = localStorage.getItem('resName');
  const name = localStorage.getItem('name');

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
      console.log('Fetching data from', endpoint,headers);
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
        <h2 className="mt-4 text-2xl font-bold">Restaurant Area</h2>
        {(localStorage.getItem('isClient') === 'true' || localStorage.getItem('isAdmin') === 'true') && (
          <TextField
            placeholder="Search by restaurant name"
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
              Welcome Back{name ? `: ${name}` : ''}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOwnerOrder}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
            >
              View Orders
            </Button>
          </>
        )}
        {localStorage.getItem('isAdmin') === 'true' && (
          <Typography
            variant="h5"
            component="h1"
            className="font-bold text-center text-gray-800 mb-3"
          >
            Welcome Back: Admin 
          </Typography>
        )}
        {localStorage.getItem('isClient') === 'true' && (
          <>
            <Button
            variant='contained'
              className= "bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4"
              onClick={handleOrder}
            >
              My Orders
            </Button>
            <Typography
              variant="h5"
              component="h1"
              className="font-bold text-center mb-3"
            >
              Welcome Back{name ? `: ${name}` : ''}
            </Typography>

</>
)}
                  {!isOwner && (
<>       
<Typography 
  variant="h6" 
  component="h1" 
  className="font-bold text-center mb-5 text-blue-500 shadow-md rounded-lg p-2 bg-blue-50 via-white to-blue-50"
>
  What's your taste? <span className="text-3xl">😋</span>
</Typography>
        <div className="flex !flex-row flex-wrap justify-start gap-2 mb-4 px-0">
          {Object.keys(filterImages).map((filter) => (
            <FilterCard
              key={filter}
              selected={selectedFilter === filter}
              onClick={() => handleFilterSelect(filter)}
              className="flex flex-col  shadow-lg bg-white rounded-lg items-center justify-center w-[20vw]"
            >
              <CardMedia
                component="img"
                image={filterImages[filter]}
                alt={filter}
                className="w-full h-[10vh] md:h-[20vh] object-cover"
              />
              <div className='flex items-start justify-start text-start'>
                <Typography className='font-bold text-black' component="div">
                  {filter}
                </Typography>
              </div>
            </FilterCard>
          ))}
        </div>
        </>
        )}
<div className={`grid ${isOwner ? 'grid-cols-1 md:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'} gap-4 w-full`}>
{loading ? (
            <div className="flex justify-center items-center h-64">
              <CircularProgress />
            </div>
          ) : isOwner ? (
            <>
              {products.length != 0 && (
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
                No restaurants found
              </Typography>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeComponent;





