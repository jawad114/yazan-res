// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FavoriteBorder, Favorite } from '@mui/icons-material';
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import AxiosRequest from '../../Components/AxiosRequest';

// const Status = ({ status }) => {
//   let backgroundColor;
//   let statusText;


//   switch (status) {
//     case 'open':
//       backgroundColor = 'green';
//       statusText = 'Open';
//       break;
//     case 'busy':
//       backgroundColor = 'orange';
//       statusText = 'Busy';
//       break;
//     case 'closed':
//       backgroundColor = 'red';
//       statusText = 'Closed';
//       break;
//     default:
//       backgroundColor = 'gray';
//       statusText = 'Unknown';
//   }

//   const statusStyle = {
//     backgroundColor,
//     color: '#fff',
//     padding: '6px 12px',
//     borderRadius: '6px',
//     textTransform: 'uppercase',
//     fontWeight: 'bold',
//     fontSize: '14px',
//   };
//   return (
//     <div style={statusStyle}>
//       <span style={{ color: '#fff', fontWeight: 'bold' }}>{statusText}</span>
//     </div>
//   );
// };

// export default function Card({ product }) {
//   const { picture, status, restaurantName, location } = product;
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);
//   const [isRemovingFromFavorites, setIsRemovingFromFavorites] = useState(false);
//   const id = localStorage.getItem('id');

//   useEffect(() => {
//     const fetchFavorites = async () => {
//       try {
//         const response = await AxiosRequest.get(`/favorites/${id}`);
//         const favorites = response.data.map(favorite => favorite.restaurantName);
//         setIsFavorite(favorites.includes(restaurantName));
//       } catch (error) {
//         console.error('Error fetching favorites:', error);
//       }
//     };

//     fetchFavorites();
//   }, [restaurantName]);

//   const addToFavorites = async () => {
//     try {
//       setIsAddingToFavorites(true);
//       await AxiosRequest.post(`/add-to-favorites/${id}`, { restaurantName });
//       setIsFavorite(true);
//       toast.success('Restaurant added to favorites successfully');
//     } catch (error) {
//       console.error('Error adding restaurant to favorites:', error);
//       toast.error('Failed to add restaurant to favorites');
//     } finally {
//       setIsAddingToFavorites(false);
//     }
//   };

//   const removeFromFavorites = async () => {
//     try {
//       setIsRemovingFromFavorites(true);
//       await AxiosRequest.delete(`/remove-from-favorites/${id}`, { data: { restaurantName } });
//       setIsFavorite(false);
//       toast.success('Restaurant removed from favorites successfully', { autoClose: 2000 });
//     } catch (error) {
//       console.error('Error removing restaurant from favorites:', error);
//       toast.error('Failed to remove restaurant from favorites');
//     } finally {
//       setIsRemovingFromFavorites(false);
//     }
//   };

//   const handleShowCategories = () => {
//     window.location.replace(`/categories/${restaurantName}`);
//   };

//   const handleUpdateHours = () => {
//     window.location.replace(`/update-opening-hours/${restaurantName}`);
//   };

//   const handleEdit = () => {
//     window.location.replace(`/edit/${restaurantName}`);
//   };

//   const handleDelete = async () => {
//     // Ask for confirmation before deleting
//     const confirmed = window.confirm('Are you sure you want to delete this restaurant?');

//     if (confirmed) {
//       try {
//         // Send delete request to server
//         await AxiosRequest.delete(`/delete-restaurant/${restaurantName}`);

//         // Show success message
//         toast.success('Restaurant deleted successfully', { autoClose: 2000 });

//         // Redirect to home page
//         window.location.replace('/');
//       } catch (error) {
//         // Log error to console
//         console.error('Error deleting restaurant:', error);

//         // Show error message
//         toast.error('Failed to delete restaurant');
//       }
//     } else {
//       // If user cancels deletion
//       console.log('Deletion canceled.');
//     }
//   };


//   // const handleStatus = async (newStatus) => {
//   //   try {
//   //     const response = await axios.put(`https://yazan-4.onrender.com/change-restaurant-status/${restaurantName}/${newStatus}`);
//   //     toast.success(`Status Set To ${newStatus} Successfully`, { autoClose: 3000 });
//   //     window.location.reload();
//   //   } catch (err) {
//   //     console.error(`Error Setting Status To ${newStatus} `, err);
//   //   }

//   // };

//   const handleStatus = async (newStatus) => {
//     try {
//       toast.info(`Setting Status To ${newStatus}`, { autoClose: 2000 }); // Show info toast for 5 seconds
//       setTimeout(async () => { // Delay execution of the rest of the function
//         const response = await AxiosRequest.put(`/change-restaurant-status/${restaurantName}/${newStatus}`);
//         toast.success(`Status Set To ${newStatus} Successfully`);
//         window.location.reload();
//       }, 2000);
//     } catch (err) {
//       console.error(`Error Setting Status To ${newStatus} `, err);
//     }
//   };


//   const isAdmin = localStorage.getItem('isAdmin') === 'true';
//   const isOwner = localStorage.getItem('isOwner') === 'true';
//   const isClient = localStorage.getItem('isClient') === 'true';

//   const toastStyle = {
//     container: "max-w-sm mx-auto",
//     toast: "bg-red-500 text-white font-bold",
//   };


//   return (
//     <div className="flex bg-white rounded-xl items-center justify-center shadow-lg mt-4">
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         style={toastStyle}
//       />
//       <div className="max-w-md">
//         <div className='grid'>
//           <img className='object-cover w-full md:h-40 h-30' src={picture} alt={restaurantName} />
//         </div>

//         <div className="flex flex-col justify-start items-center p-4">
//           <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mt-2">{restaurantName}</div>
//           <p className="mt-2 font-bold text-gray-800">Location: {location}</p>
//           <Status status={status} />
//           {/* <p className="mt-2 font-bold text-gray-800">Status: {!status ? '' : status}</p> */}
//           <div className="flex flex-wrap">

//             {isClient && (
//               <button
//                 className={`btn-global ${isAddingToFavorites || isRemovingFromFavorites ? 'opacity-50 cursor-not-allowed' : ''} mt-2`}
//                 onClick={isFavorite ? removeFromFavorites : addToFavorites}
//                 disabled={isAddingToFavorites || isRemovingFromFavorites}
//               >
//                 {isAddingToFavorites ? 'Adding to Favorites...' : isRemovingFromFavorites ? 'Removing from Favorites...' : (
//                   isFavorite ? <Favorite className="text-red-500" /> : <FavoriteBorder className="text-white-500" />
//                 )}
//               </button>
//             )}
//             <button className="btn-global mt-2" onClick={handleShowCategories}>Show Categories</button>
//             {isAdmin && (
//               <>
//                 <button className="btn-global mt-2" onClick={handleEdit}>Edit</button>
//                 <button className="btn-global mt-2" onClick={handleDelete}>Delete</button>
//                 <button className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 w-full rounded" onClick={() => handleStatus('open')}>Open</button>
//                 <button className="mt-2 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 w-full rounded" onClick={() => handleStatus('busy')}>Busy</button>
//                 <button className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 w-full rounded" onClick={() => handleStatus('closed')}>Closed</button>
//                 <button className="btn-global mt-2" onClick={handleUpdateHours}>Update Opening Hours</button>
//               </>
//             )}
//             {isOwner && (
//               <>
//                 <button className="btn-global mt-2" onClick={handleEdit}>Edit</button>
//                 <button className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 w-full rounded" onClick={() => handleStatus('open')}>Open</button>
//                 <button className="mt-2 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 w-full rounded" onClick={() => handleStatus('busy')}>Busy</button>
//                 <button className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 w-full rounded" onClick={() => handleStatus('closed')}>Closed</button>

//                 <button className="btn-global mt-2" onClick={handleUpdateHours}>Update Opening Hours</button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { FavoriteBorder, Favorite } from '@mui/icons-material';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosRequest from '../../Components/AxiosRequest';

const Status = ({ status }) => {
  let backgroundColor;
  let statusText;

  switch (status) {
    case 'open':
      backgroundColor = 'green';
      statusText = 'Open';
      break;
    case 'busy':
      backgroundColor = 'orange';
      statusText = 'Busy';
      break;
    case 'closed':
      backgroundColor = 'red';
      statusText = 'Closed';
      break;
    default:
      backgroundColor = 'gray';
      statusText = 'Unknown';
  }

  const statusStyle = {
    backgroundColor,
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '6px',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '14px',
  };
  return (
    <div style={statusStyle}>
      <span style={{ color: '#fff', fontWeight: 'bold' }}>{statusText}</span>
    </div>
  );
};

export default function Card({ product }) {
  const { picture, status, restaurantName, location } = product;
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);
  const [isRemovingFromFavorites, setIsRemovingFromFavorites] = useState(false);
  const id = localStorage.getItem('id');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await AxiosRequest.get(`/favorites/${id}`);
        const favorites = response.data.map(favorite => favorite.restaurantName);
        setIsFavorite(favorites.includes(restaurantName));
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [restaurantName, id]);

  const addToFavorites = async () => {
    try {
      setIsAddingToFavorites(true);
      const response = await AxiosRequest.post(`/add-to-favorites/${id}`, { restaurantName });
      setIsFavorite(true);
      if(response.status === 201){
      toast.success('Restaurant added to favorites successfully');
      }
    } catch (error) {
      console.error('Error adding restaurant to favorites:', error);
      toast.error('Failed to add restaurant to favorites');
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  const removeFromFavorites = async () => {
    try {
      setIsRemovingFromFavorites(true);
      const response = await AxiosRequest.delete(`/remove-from-favorites/${id}`, { data: { restaurantName } });
      setIsFavorite(false);
      if(response.status === 201){
      toast.success('Restaurant removed from favorites successfully');
      }
    } catch (error) {
      console.error('Error removing restaurant from favorites:', error);
      toast.error('Failed to remove restaurant from favorites');
    } finally {
      setIsRemovingFromFavorites(false);
    }
  };

  const handleShowCategories = () => {
    window.location.replace(`/categories/${restaurantName}`);
  };

  const handleUpdateHours = () => {
    window.location.replace(`/update-opening-hours/${restaurantName}`);
  };

  const handleEdit = () => {
    window.location.replace(`/edit/${restaurantName}`);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this restaurant?');

    if (confirmed) {
      try {
        await AxiosRequest.delete(`/delete-restaurant/${restaurantName}`);
        toast.success('Restaurant deleted successfully');
        window.location.replace('/');
      } catch (error) {
        console.error('Error deleting restaurant:', error);
        toast.error('Failed to delete restaurant');
      }
    } else {
      console.log('Deletion canceled.');
    }
  };

  const handleStatus = async (newStatus) => {
    try {
      toast.info(`Setting Status To ${newStatus}`);
      setTimeout(async () => {
        await AxiosRequest.put(`/change-restaurant-status/${restaurantName}/${newStatus}`);
        toast.success(`Status Set To ${newStatus} Successfully`);
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error(`Error Setting Status To ${newStatus} `, err);
      toast.error(`Failed to set status to ${newStatus}`);
    }
  };

  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isOwner = localStorage.getItem('isOwner') === 'true';
  const isClient = localStorage.getItem('isClient') === 'true';

  return (
    <div className="flex bg-white rounded-xl items-center justify-center shadow-lg mt-4">
      <div className="max-w-md">
        <div className='grid'>
          <img className='object-cover w-full md:h-40 h-30' src={picture} alt={restaurantName} />
        </div>

        <div className="flex flex-col justify-start items-center p-4">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mt-2">{restaurantName}</div>
          <p className="mt-2 font-bold text-gray-800">Location: {location}</p>
          <Status status={status} />
          <div className="flex flex-wrap">
            {isClient && (
              <button
                className={`btn-global ${isAddingToFavorites || isRemovingFromFavorites ? 'opacity-50 cursor-not-allowed' : ''} mt-2`}
                onClick={isFavorite ? removeFromFavorites : addToFavorites}
                disabled={isAddingToFavorites || isRemovingFromFavorites}
              >
                {isAddingToFavorites ? 'Adding to Favorites...' : isRemovingFromFavorites ? 'Removing from Favorites...' : (
                  isFavorite ? <Favorite className="text-red-500" /> : <FavoriteBorder className="text-white-500" />
                )}
              </button>
            )}
            <button className="btn-global mt-2" onClick={handleShowCategories}>Show Categories</button>
            {isAdmin && (
              <>
                <button className="btn-global mt-2" onClick={handleEdit}>Edit</button>
                <button className="btn-global mt-2" onClick={handleDelete}>Delete</button>
                <button className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 w-full rounded" onClick={() => handleStatus('open')}>Open</button>
                <button className="mt-2 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 w-full rounded" onClick={() => handleStatus('busy')}>Busy</button>
                <button className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 w-full rounded" onClick={() => handleStatus('closed')}>Closed</button>
                <button className="btn-global mt-2" onClick={handleUpdateHours}>Update Opening Hours</button>
              </>
            )}
            {isOwner && (
              <>
                <button className="btn-global mt-2" onClick={handleEdit}>Edit</button>
                <button className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 w-full rounded" onClick={() => handleStatus('open')}>Open</button>
                <button className="mt-2 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 w-full rounded" onClick={() => handleStatus('busy')}>Busy</button>
                <button className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 w-full rounded" onClick={() => handleStatus('closed')}>Closed</button>
                <button className="btn-global mt-2" onClick={handleUpdateHours}>Update Opening Hours</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
