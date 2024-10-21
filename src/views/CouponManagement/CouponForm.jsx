import React, { useState, useEffect } from 'react';
import { TextField, Button, Card, Checkbox, FormControlLabel } from '@mui/material';
import AxiosRequest from '../../Components/AxiosRequest';
import { toast } from 'react-toastify';
import Select from 'react-select'; // Import react-select
import { useNavigate } from 'react-router-dom';

const CouponForm = () => {
  const [restaurantId, setRestaurantId] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [usageLimit, setUsageLimit] = useState(1);
  const [expiryDate, setExpiryDate] = useState(new Date()); // Set default expiry date to today
  const [minOrderValue, setMinOrderValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserSpecific, setIsUserSpecific] = useState(false); // New state for user-specific toggle
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [searchResults, setSearchResults] = useState([]); // State for search results
  const [selectedUsers, setSelectedUsers] = useState([]); // New state for selected users
  const resName = localStorage.getItem('resName');
  const isOwner = localStorage.getItem('isOwner') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    if (!localStorage.getItem('isAdmin') && !localStorage.getItem('isOwner')) {
        navigate('/forbidden'); // Replace with your target route
    }
  }, [isAdmin, isOwner, navigate]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        if (isOwner) {
          // Fetch the owner's restaurant ID
          const response = await AxiosRequest.get(`/get-one-res/${resName}`);
          if (response.data && response.data.data) {
            setRestaurantId(response.data.data._id); // Set the restaurant ID
          }
        } else if (isAdmin) {
          const response = await AxiosRequest.get(`/get-restaurants`);
          if (response.data && response.data.data) {
            setRestaurants(response.data.data.map(restaurant => ({
              value: restaurant._id,
              label: restaurant.restaurantName
            }))); 
          }
        }
      } catch (error) {
        console.error('Failed to fetch restaurant data:', error);
      }
    };

    fetchRestaurant();
  }, [resName, isOwner, isAdmin]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (searchTerm.trim() === '') {
          setSearchResults([]);
          return;
        }
        const response = await AxiosRequest.get('/client/searchClient', {
          params: { search: searchTerm }
        });
        if (response.data) {
          setSearchResults(response.data.map(user => ({
            value: user.id,
            label: `${user.fullName} (${user.email})`
          }))); // Transform to the format required by react-select
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    if (isUserSpecific) {
      fetchUsers();
    }
  }, [isUserSpecific, searchTerm]);

  const handleUserChange = (selectedOptions) => {
    setSelectedUsers(selectedOptions ? selectedOptions.map(option => option.value) : []);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (isUserSpecific && selectedUsers.length === 0) {
      toast.error(<div style={{ direction: 'rtl' }}>يرجى اختيار مستخدمين محددين.</div>);
      return;
    }
    setIsLoading(true);

    const couponData = {
      restaurant: restaurantId,
      discountPercentage,
      usageLimit,
      expiryDate,
      minOrderValue,
      userSpecific: isUserSpecific, // Include the userSpecific field
      specificUsers: isUserSpecific ? selectedUsers : [] // Include selected users if userSpecific
    };

    try {
      await AxiosRequest.post(`/coupon/create-coupon`, couponData);
      toast.success(<div style={{ direction: 'rtl' }}>تم إنشاء القسيمة بنجاح!</div>);
      setDiscountPercentage('');
      setUsageLimit(1);
      setExpiryDate(new Date());
      setMinOrderValue(0);
      setSelectedUsers([]); // Clear selected users
      setIsUserSpecific(false); // Reset user-specific toggle
      setSearchTerm(''); // Clear search term
      setSearchResults([]); // Clear search results
    } catch (error) {
      console.error('Error creating coupon:', error);
      toast.error(<div style={{ direction: 'rtl' }}>حدث خطأ أثناء إنشاء القسيمة. يرجى المحاولة مرة أخرى.</div>);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex h-full'>
      <Card className="max-w-md mx-auto mt-4 mb-4 p-6 shadow-lg">
        <form onSubmit={handleCreateCoupon} style={{ direction: 'rtl' }}>
          <h2 className="text-center text-2xl font-semibold mb-4">إنشاء قسيمة</h2>

          {isAdmin && (
            <Select
              value={restaurants.find(restaurant => restaurant.value === restaurantId)}
              onChange={(option) => setRestaurantId(option ? option.value : '')}
              options={restaurants}
              placeholder="اختر المطعم"
              className="mb-4"
              menuPlacement="auto"
            />
          )}
          <label>ادخل نسبة الخصم المئوية ادخل ارقام فقط</label>
          <TextField
            placeholder="نسبة الخصم"
            type="number"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            fullWidth
            margin="normal"
            required
            sx={{
              '& .MuiOutlinedInput-input:focus': {
                outline: 'none', // Removes the focus ring
                boxShadow: 'none',
              },
            }}
          />
          <label>حدد عدد مرات الأستخدام لكل شخص</label>
          <TextField
            placeholder="حد الاستخدام"
            type="number"
            value={usageLimit}
            onChange={(e) => setUsageLimit(e.target.value)}
            fullWidth
            margin="normal"
            required
            sx={{
              '& .MuiOutlinedInput-input:focus': {
                outline: 'none', // Removes the focus ring
                boxShadow: 'none',
              },
            }}
          />
          <label>تاريخ انتهاء صلاحية الاستخدام</label>
          <TextField
            placeholder="تاريخ الانتهاء"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            fullWidth
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-input:focus': {
                outline: 'none', // Removes the focus ring
                boxShadow: 'none',
              },
            }}
          />
          <label>حدد سعر الطلب الادنى لاستخدام الكوبون</label>
          <TextField
            placeholder="قيمة الطلب الدنيا"
            type="number"
            value={minOrderValue}
            onChange={(e) => setMinOrderValue(e.target.value)}
            fullWidth
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-input:focus': {
                outline: 'none', // Removes the focus ring
                boxShadow: 'none',
              },
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={isUserSpecific}
                onChange={() => setIsUserSpecific(!isUserSpecific)}
                name="userSpecific"
                color="primary"
              />
            }
            label="مخصص لمستخدمين محددين"
          />

          {isUserSpecific && (
            <>
              <TextField
                placeholder="ابحث عن المستخدمين"
                value={searchTerm}
                onChange={handleSearchChange}
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-input:focus': {
                    outline: 'none', // Removes the focus ring
                    boxShadow: 'none',
                  },
                }}
              />
              {searchResults.length > 0 &&(
              <Select
                isMulti
                value={searchResults.filter(user => selectedUsers.includes(user.value))}
                onChange={handleUserChange}
                options={searchResults}
                placeholder="اختر المستخدمين"
                className="mb-4"
                menuPlacement="auto"
              />
              )}
            </>
          )}

          <Button
            type="submit"
            color="primary"
            variant="contained"
            fullWidth
            disabled={isLoading || !restaurantId}
            className="mt-4"
          >
            {isLoading ? 'جاري الإنشاء...' : 'إنشاء قسيمة'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CouponForm;
