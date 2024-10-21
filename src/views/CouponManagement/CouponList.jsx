import React, { useEffect, useState } from 'react';
import { Card, CardBody, Button, Typography } from '@material-tailwind/react';
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AxiosRequest from '../../Components/AxiosRequest';
import { toast } from 'react-toastify';
import { Edit, Delete } from '@mui/icons-material'; // Import MUI icons
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { ReactComponent as LoadingSpinner } from '../../../src/assets/LoadingSpinner.svg'; // Adjust path as needed


const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null); // For editing a coupon
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [minOrderValue, setMinOrderValue] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state
  const isOwner = localStorage.getItem('isOwner');
  const isAdmin = localStorage.getItem('isAdmin');
  const resName = localStorage.getItem('resName');
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    if (!localStorage.getItem('isAdmin') && !localStorage.getItem('isOwner')) {
        navigate('/forbidden'); // Replace with your target route
    }
  }, [isAdmin,isOwner, navigate]);

  const fetchCoupons = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      let response;
      if (isOwner) {
        response = await AxiosRequest.get(`/coupon/get-coupon-by-res/${resName}`);
      } else if (isAdmin) {
        response = await AxiosRequest.get(`/coupon/coupons`);
      }
      setCoupons(response.data);
    } catch (error) {
      console.error('فشل في جلب القسائم:', error);
    }finally {
        setLoading(false); // Set loading to false after fetching
      }
  };

  useEffect(() => {
    fetchCoupons();
  }, [isOwner, isAdmin, resName]);

  const handleEdit = (coupon) => {
    setSelectedCoupon(coupon);
    setDiscountPercentage(coupon.discountPercentage);
    setUsageLimit(coupon.usageLimit);
    setExpiryDate(new Date(coupon.expiryDate).toISOString().split('T')[0]);
    setMinOrderValue(coupon.minOrderValue);
  };

  const handleUpdate = async () => {
    try {
      const response = await AxiosRequest.put(`/coupon/update-coupon/${selectedCoupon._id}`, {
        discountPercentage,
        usageLimit,
        expiryDate,
        minOrderValue,
      });
      toast.success(<div style={{direction:'rtl'}}>تم التحديث بنجاح</div>);
      setSelectedCoupon(null);
      fetchCoupons();
    } catch (error) {
      console.error('Error updating coupon:', error);
      toast.error(<div style={{direction:'rtl'}}>فشل في تحديث القسيمة</div>);
    }
  };

  const handleDelete = async (couponId) => {
    try {
      await AxiosRequest.delete(`/coupon/delete-coupon/${couponId}`);
      toast.success(<div style={{direction:'rtl'}}>تم حذف القسيمة بنجاح</div>);
      setCoupons(coupons.filter((coupon) => coupon._id !== couponId));
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error(<div style={{direction:'rtl'}}>فشل في حذف القسيمة</div>);
    }
  };
  const handleCreateCoupon = () => {
    navigate('/create-coupon'); // Adjust the path as needed
  };

  // Group coupons by restaurant
  const groupedCoupons = coupons.reduce((acc, coupon) => {
    const restaurantName = coupon.restaurant?.restaurantName || 'مطعم غير معروف'; // Fallback if restaurant data is missing
    if (!acc[restaurantName]) {
      acc[restaurantName] = [];
    }
    acc[restaurantName].push(coupon);
    return acc;
  }, {});

return (
    <Card className="max-w-4xl mx-auto my-10 p-6 shadow-lg" style={{ direction: 'rtl' }}>
      <CardBody>
        <h2 className="text-center text-2xl font-semibold mb-4">جميع القسائم</h2>
        {loading ? (
            <div className="flex items-center bg-white justify-center min-h-screen font-poppins">
            <LoadingSpinner width="200" height="200" />
          </div>
        ) : (
          <>
            {Object.entries(groupedCoupons).map(([restaurantName, restaurantCoupons]) => (
              <div key={restaurantName}>
                  <h3 className="text-xl font-bold mb-2">{restaurantName}</h3>
                {restaurantCoupons.map((coupon) => (
                  <div key={coupon._id} className="border-b py-2">
                    <p>رمز القسيمة: {coupon.code}</p>
                    <p>نسبة الخصم: {coupon.discountPercentage} %</p>
                    <p>حد الاستخدام: {coupon.usageLimit}</p>
                    <p>تاريخ الانتهاء: {new Date(coupon.expiryDate).toLocaleDateString()}</p>
                    <p>قيمة الطلب الادنى: {coupon.minOrderValue}</p>
                    {/* Display usage count for each user */}
                    {coupon.userSpecific && (
                      <Typography variant='body2' className="font-bold">لمستخدم محدد</Typography>
                    )}
                    {coupon.userUsage.length > 0 && (
                      <div>
                        <h4 className="font-bold">استخدام القسيمة:</h4>
                        {coupon.userUsage.map((usage) => (
                          <p key={usage.userId}>
                            {`مستخدم: ${usage.userId.firstname} ${usage.userId.lastname} - عدد المرات: ${usage.count}`}
                            {console.log('User Id', usage.userId)}
                          </p>
                        ))}
                      </div>
                    )}
                    <div className='flex items-center justify-center gap-4'>
                      <Edit sx={{ color: 'blue' }} onClick={() => handleEdit(coupon)} className="mx-2 cursor-pointer" />
                      <Delete sx={{ color: 'red' }} onClick={() => handleDelete(coupon._id)} className='cursor-pointer' />
                    </div>
                  </div>
                ))}
              </div>
            ))}

            <Dialog open={Boolean(selectedCoupon)} onClose={() => setSelectedCoupon(null)} fullWidth maxWidth="sm">
              <DialogTitle>تحرير القسيمة</DialogTitle>
              <DialogContent>
                <TextField
                  placeholder="نسبة الخصم"
                  type="number"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  fullWidth
                  margin="normal"
                  style={{direction:'rtl'}}
                  sx={{
                    '& .MuiOutlinedInput-input:focus': {
                      outline: 'none',
                      boxShadow: 'none',
                    },
                  }}
                />
                <TextField
                  placeholder="حد الاستخدام"
                  type="number"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  fullWidth
                  margin="normal"
                  style={{direction:'rtl'}}
                  sx={{
                    '& .MuiOutlinedInput-input:focus': {
                      outline: 'none',
                      boxShadow: 'none',
                    },
                  }}
                />
                <TextField
                  placeholder="تاريخ الانتهاء"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  fullWidth
                  margin="normal"
                  style={{direction:'rtl'}}
                  sx={{
                    '& .MuiOutlinedInput-input:focus': {
                      outline: 'none',
                      boxShadow: 'none',
                    },
                  }}
                />
                <TextField
                  placeholder="قيمة الطلب الدنيا"
                  type="number"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(e.target.value)}
                  fullWidth
                  margin="normal"
                  style={{direction:'rtl'}}
                  sx={{
                    '& .MuiOutlinedInput-input:focus': {
                      outline: 'none',
                      boxShadow: 'none',
                    },
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button color="red" onClick={() => setSelectedCoupon(null)}>إلغاء</Button>
                <Button color="green" onClick={handleUpdate}>تحديث القسيمة</Button>
              </DialogActions>
            </Dialog>
            <div className="flex justify-center mt-6">
              <Button color="blue" onClick={handleCreateCoupon}>إنشاء قسيمة</Button>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default CouponList;
