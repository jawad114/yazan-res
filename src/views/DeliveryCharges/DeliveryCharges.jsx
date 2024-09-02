import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  IconButton,
  Spinner,
} from '@material-tailwind/react';
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import AxiosRequest from '../../Components/AxiosRequest';
import Delete from '@mui/icons-material/Delete';
import { Edit } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import { toast } from 'react-toastify';
import { ReactComponent as LoadingSpinner } from '../../../src/assets/LoadingSpinner.svg'; // Adjust path as needed


const DeliveryCharges = () => {
  const [city, setCity] = useState('');
  const [charge, setCharge] = useState('');
  const [deliveryCharges, setDeliveryCharges] = useState({});
  const [restaurantId, setRestaurantId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [editOldCity, setEditOldCity] = useState('');
  const [editNewCity, setEditNewCity] = useState('');
  const [editCharge, setEditCharge] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // Example state for role
  const [isOwner, setIsOwner] = useState(false); // Example state for role
const navigate = useNavigate();
  const resName = localStorage.getItem('resName'); // Get resName from params

  useEffect(() => {
    if (!localStorage.getItem('isAdmin') && !localStorage.getItem('isOwner')) {
        navigate('/forbidden'); // Replace with your target route
    }
  }, [isAdmin,isOwner, navigate]);

  useEffect(() => {
    const fetchRoleAndData = async () => {
      try {
        // Fetch user role (this is a placeholder, implement as per your auth setup)
       const Admin = localStorage.getItem('isAdmin');
       const Owner = localStorage.getItem('isOwner');
        setIsAdmin(Admin);
        setIsOwner(Owner);

        if (isAdmin) {
          // Fetch all restaurants if user is admin
          const response = await AxiosRequest.get('/get-restaurants');
          setRestaurants(response.data.data);
        } else if (isOwner) {
          // Fetch delivery charges for the specific restaurant if user is owner
          const response = await AxiosRequest.get(`/get-one-res/${resName}`);
          setDeliveryCharges(response.data.data.deliveryCharges || {});
          setRestaurantId(response.data.data._id);
        }
      } catch (error) {
        console.error('Error fetching role or data', error);
        setError('Error fetching role or data');
      } finally {
        setLoading(false);
      }
    };

    fetchRoleAndData();
  }, [isAdmin, isOwner, resName]);

  useEffect(() => {
    if (isAdmin && selectedRestaurant) {
      const fetchDeliveryCharges = async () => {
        try {
          const response = await AxiosRequest.get(`/restaurants/${selectedRestaurant}/delivery-charges`);
          setRestaurantId(selectedRestaurant);
          setDeliveryCharges(response.data.deliveryCharges || {});
        } catch (error) {
          console.error('Error fetching delivery charges', error);
          setError('Error fetching delivery charges');
        }
      };

      fetchDeliveryCharges();
    }
  }, [selectedRestaurant, isAdmin]);

  const handleAdd = async () => {
    if (city && charge) {
      try {
        await AxiosRequest.post(`/restaurants/${restaurantId}/delivery-charge`, {
          city,
          charge: parseFloat(charge),
        });

        const response = await AxiosRequest.get(`/restaurants/${restaurantId}/delivery-charges`);
        setDeliveryCharges(response.data.deliveryCharges || {});
        setCity('');
        setCharge('');
      } catch (error) {
        console.error('Error adding delivery charge', error);
        setError('Error adding delivery charge');
      }
    }
  };

  const handleUpdate = async () => {
    if (editOldCity && editNewCity && editCharge) {
      try {
        await AxiosRequest.put(`/restaurants/${restaurantId}/delivery-charge`, {
          oldCity: editOldCity,
          newCity: editNewCity,
          charge: parseFloat(editCharge),
        });

        const response = await AxiosRequest.get(`/restaurants/${restaurantId}/delivery-charges`);
        setDeliveryCharges(response.data.deliveryCharges || {});
        setIsUpdateDialogOpen(false);
        setEditOldCity('');
        setEditNewCity('');
        setEditCharge('');
      } catch (error) {
        console.error('Error updating delivery charge', error);
        setError('Error updating delivery charge');
      }
    }
  };

  const handleDelete = async (cityName) => {
    if (isOwner) {
        const enteredPassword = prompt('يرجى إدخال كلمة المرور لتأكيد الحذف:');
        
        if (enteredPassword === null) {
          return;
        }
  
        if (enteredPassword !== '11111111') {
          toast.error(<div style={{direction:'rtl'}}>كلمة المرور غير صحيحة</div>);
          return;
        }
      }
      const isConfirmed = window.confirm(`Are you sure you want to delete ?`);
      if (isConfirmed) {
    try {
      await AxiosRequest.delete(`/restaurants/${restaurantId}/delivery-charge/${cityName}`);

      const response = await AxiosRequest.get(`/restaurants/${restaurantId}/delivery-charges`);
      setDeliveryCharges(response.data.deliveryCharges || {});
    } catch (error) {
      console.error('Error deleting delivery charge', error);
      setError('Error deleting delivery charge');
    }
}
  };

  return (
    <div className="max-w-xl flex flex-col mx-auto mt-8 p-6 bg-white shadow-lg mb-4 rounded-lg">
      <Typography variant="h5" className="mb-4 text-center">
        إدارة رسوم التوصيل
      </Typography>

      {isAdmin && (
          <TextField
            select
            value={selectedRestaurant}
            onChange={(e) => setSelectedRestaurant(e.target.value)}
            // fullWidth
            style={{ direction: 'rtl' }}
            sx={{
              '& .MuiOutlinedInput-input:focus': {
                outline: 'none',
                boxShadow: 'none',
              },
              marginBottom:2
            }}
            SelectProps={{ native: true }}
            // sx={{ marginBottom: 2 }}
          >
            <option value="" disabled>اختر مطعماً</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant._id} value={restaurant._id}>
                {restaurant.restaurantName} {/* Update to match your restaurant name field */}
              </option>
            ))}
          </TextField>
        )}
          <div className='flex flex-col gap-3 items-center justify-center'>
            <TextField
              label="المدينة"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              fullWidth
              style={{ direction: 'rtl' }}
              sx={{
                '& .MuiOutlinedInput-input:focus': {
                  outline: 'none',
                  boxShadow: 'none',
                },
              }}
            />
            <TextField
              label="الرسوم"
              value={charge}
              fullWidth
              onChange={(e) => setCharge(e.target.value)}
              type="number"
              style={{ direction: 'rtl' }}
              sx={{
                '& .MuiOutlinedInput-input:focus': {
                  outline: 'none',
                  boxShadow: 'none',
                },
              }}
            />
            <Button onClick={handleAdd} className="flex-shrink-0">
              إضافة
            </Button>
          </div>

      {loading ? (
      <div className="flex items-center bg-white justify-center min-h-screen font-poppins">
      <LoadingSpinner width="200" height="200" />
    </div>
      ) : (
        <>
          <div>
            {Object.keys(deliveryCharges).length > 0 ? (
              Object.entries(deliveryCharges).map(([cityName, cityCharge]) => (
                <div key={cityName} className="flex justify-between mt-4 items-center border-b py-2" style={{ direction: 'rtl' }}>
                  <div style={{ direction: 'rtl' }}>
                    <Typography variant="body2" className="font-semibold text-right rtl-text">
                      {cityName}: ₪ {cityCharge.toFixed(2)}
                    </Typography>
                  </div>
                  <div className='flex gap-2'>
                    <IconButton
                      onClick={() => {
                        setEditOldCity(cityName);
                        setEditNewCity(cityName); // Default new city to old city
                        setEditCharge(cityCharge.toFixed(2));
                        setIsUpdateDialogOpen(true);
                      }}
                      className="text-blue-600"
                    >
                      <Edit className='w-5 h-5'/>
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(cityName)}
                      className="text-red-600"
                    >
                      <Delete className="w-5 h-5" />
                    </IconButton>
                  </div>
                </div>
              ))
            ) : (
              <Typography variant="body2" className="text-gray-500 mt-4 text-center">
                لا توجد رسوم توصيل متاحة.
              </Typography>
            )}
          </div>
        </>
      )}

      {error && (
        <Typography variant="body2" className="text-red-500 text-center mt-4">
          {error}
        </Typography>
      )}

      {/* Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onClose={() => setIsUpdateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontSize: '1.25rem' }}>
          تحديث رسوم التوصيل
        </DialogTitle>
        <DialogContent>
          <div className='flex flex-col p-4 gap-4'>
            <TextField
              label="المدينة"
              value={editNewCity}
              onChange={(e) => setEditNewCity(e.target.value)}
              style={{ direction: 'rtl' }}
              sx={{
                '& .MuiOutlinedInput-input:focus': {
                  outline: 'none',
                  boxShadow: 'none',
                },
              }}
            />
            <TextField
              label="الرسوم"
              value={editCharge}
              onChange={(e) => setEditCharge(e.target.value)}
              type="number"
              style={{ direction: 'rtl' }}
              sx={{
                '& .MuiOutlinedInput-input:focus': {
                  outline: 'none',
                  boxShadow: 'none',
                },
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsUpdateDialogOpen(false)} className='bg-red-500'>
            إلغاء
          </Button>
          <Button onClick={handleUpdate} color="primary">
            تحديث
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeliveryCharges;
