import React, { useState, useEffect } from 'react';
import { FavoriteBorder, Favorite, DeliveryDining, DeliveryDiningOutlined,RestaurantMenu, RestaurantMenuOutlined } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faMotorcycle,faUtensils } from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './card.css';
import AxiosRequest from '../../Components/AxiosRequest';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@mui/material';
import { useCallback } from 'react';
import Discount from '../../assets/coupon.png'

const Status = ({ status }) => {
  let backgroundColor;
  let statusText;

  switch (status) {
    case 'open':
      backgroundColor = 'green';
      statusText = 'مفتوح';
      break;
    case 'busy':
      backgroundColor = 'orange';
      statusText = 'مشغول';
      break;
    case 'closed':
      backgroundColor = 'red';
      statusText = 'مغلق';
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
  const { picture, status, restaurantName,_id, location, availableOptions } = product;
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);
  const [isRemovingFromFavorites, setIsRemovingFromFavorites] = useState(false);
  const [hasCoupon, setHasCoupon] = useState(false); // State to check for coupons
  const id = localStorage.getItem('id');
  const navigate = useNavigate();

  const fetchFavorites = useCallback(async () => {
    try {
      const response = await AxiosRequest.get(`/favorites/${id}`);
      const favorites = response.data.map(favorite => favorite.restaurantName);
      setIsFavorite(favorites.includes(restaurantName));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  }, [restaurantName, id]);

  const fetchCoupons = useCallback(async () => {
    try {
      const response = await AxiosRequest.get(`/coupon/coupons`); // Ensure the correct endpoint
      const coupons = response.data;
      const couponAvailable = coupons.some(coupon => coupon.restaurant._id === _id); // Adjust as needed
      setHasCoupon(couponAvailable);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  }, [_id]);

  // Use the memoized function in useEffect
  useEffect(() => {
    fetchFavorites();
    fetchCoupons();
  }, [fetchFavorites, fetchCoupons]);

  const addToFavorites = async () => {
    try {
      setIsAddingToFavorites(true);
      const response = await AxiosRequest.post(`/add-to-favorites/${id}`, { restaurantName });
      setIsFavorite(true);
      if (response.status === 201) {
        toast.success(<div style={{direction:'rtl'}}>تمّ اضافة المتجر الى المفضلة</div>);
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
      if (response.status === 201) {
        toast.success(<div style={{direction:'rtl'}}>تم حذف المتجر من المفضلة</div>);
      }
    } catch (error) {
      console.error('Error removing restaurant from favorites:', error);
      toast.error('Failed to remove restaurant from favorites');
    } finally {
      setIsRemovingFromFavorites(false);
    }
  };

  const handleShowCategories = () => {
    navigate(`/categories/${restaurantName}`, { state: { resName: restaurantName } });
  };

  const handleUpdateHours = () => {
    navigate(`/update-opening-hours/${restaurantName}`, { state: { resName: restaurantName } });
  };

  const handleEdit = () => {
    navigate(`/edit/${restaurantName}`, { state: { resName: restaurantName } });
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this restaurant?');

    if (confirmed) {
      try {
        await AxiosRequest.delete(`/delete-restaurant/${restaurantName}`);
        toast.success('Restaurant deleted successfully');
        window.location.reload();
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

  const handleUpdateDelivery = async (isDeliveryAvailable) => {
    try {
      toast.info(`Updating Delivery Availability`);
      const response = await AxiosRequest.put(`/update-available-options/${restaurantName}`, {
        availableOptions: {
          ...availableOptions,
          delivery: isDeliveryAvailable,
        },
      });
      if (response.status === 200) {
        toast.success('Delivery availability updated successfully');
        window.location.reload(); // Reload to reflect changes
      }
    } catch (error) {
      console.error('Error updating delivery availability:', error);
      toast.error('Failed to update delivery availability');
    }
  };

  const handleUpdateDineIn = async (isDineInAvailable) => {
    try {
      toast.info(`Updating Dine-in Availability`);
      const response = await AxiosRequest.put(`/update-available-options/${restaurantName}`, {
        availableOptions: {
          ...availableOptions,
          'dine-in': isDineInAvailable,
        },
      });
      if (response.status === 200) {
        toast.success('Dine-in availability updated successfully');
        window.location.reload(); // Reload to reflect changes
      }
    } catch (error) {
      console.error('Error updating dine-in availability:', error);
      toast.error('Failed to update dine-in availability');
    }
  };

  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isOwner = localStorage.getItem('isOwner') === 'true';
  const isClient = localStorage.getItem('isClient') === 'true';

  return (
    <div className="relative flex bg-white rounded-xl items-center justify-center shadow-lg mt-4">
      <div className="max-w-md">
        <div className="grid">
          <img  onClick={handleShowCategories} loading='lazy' className="object-cover w-screen md:h-40 h-30 hover:cursor-pointer" src={picture} alt={restaurantName} />
          {isClient && (
            <>
            <div className="absolute top-2 right-2">
              <span onClick={isFavorite ? removeFromFavorites : addToFavorites} className="cursor-pointer">
                {isFavorite ? <Favorite className="text-red-500" /> : <FavoriteBorder className="text-gray-500" />}
              </span>
            </div>
            </>
          )}
          {(!isAdmin && !isOwner)&&(
            <>
           {hasCoupon && (
            <div className="absolute top-2 left-2">
                <img src={Discount}  alt="Discount" />
            </div>
          )}
          </>
          )}
           {(isOwner || isAdmin) && (  
            <>       
  <div className="absolute top-2 right-2">
        <Avatar onClick={() => handleUpdateDelivery(!availableOptions['delivery'])} className='cursor-pointer' sx={{ bgcolor:'white',width: 32, height: 32 }}>
        {availableOptions['delivery'] ? (
      <DeliveryDining sx={{color:'green'}} />
    ) : (
      <DeliveryDiningOutlined sx={{color:'red'}}/>
    )}
    </Avatar>
  </div>
  
  <div className="absolute top-12 right-2">
    <Avatar onClick={() => handleUpdateDineIn(!availableOptions['dine-in'])} className='cursor-pointer' sx={{ bgcolor:'white',width: 32, height: 32 }}>
    {availableOptions['dine-in'] ? (
      <RestaurantMenu sx={{color:'green'}} />
    ) : (
      <RestaurantMenuOutlined sx={{color:'red'}} />
    )}
    </Avatar>
  </div>
  </>
           )}
  </div>

        <div className="flex flex-col justify-start items-center p-4">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mt-2">{restaurantName}</div>
          <div className="mt-2 mb-2 flex items-center text-sm font-bold text-gray-800">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
            <span>{location}</span>
          </div>
          <Status status={status} />
          <div className="flex flex-wrap items-center justify-center">
            <button className="btn mt-2" onClick={handleShowCategories}>عرض الفئات</button>
            {isAdmin && (
              <>
                <button className="btn mt-2" onClick={handleEdit}>تعديل</button>
                <button className="btn mt-2" onClick={handleDelete}>حذف</button>
                <button className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 w-full rounded" onClick={() => handleStatus('open')}>مفتوح</button>
                <button className="mt-2 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 w-full rounded" onClick={() => handleStatus('busy')}>مشغول</button>
                <button className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 w-full rounded" onClick={() => handleStatus('closed')}>مغلق</button>
                <button className="btn mt-2" onClick={handleUpdateHours}>تحديث ساعات العمل</button>
              </>
            )}
            {isOwner && (
              <>
                <button className="btn mt-2" onClick={handleEdit}>تعديل</button>
                <button className="mt-2  bg-green-500 hover:bg-green-700 text-white font-bold py-2 w-full rounded" onClick={() => handleStatus('open')}>مفتوح</button>
                <button className="mt-2 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 w-full rounded" onClick={() => handleStatus('busy')}>مشغول</button>
                <button className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 w-full rounded" onClick={() => handleStatus('closed')}>مغلق</button>
                <button className="btn mt-2" onClick={handleUpdateHours}>تحديث ساعات العمل</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
