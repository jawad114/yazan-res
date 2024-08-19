import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, Card, CardContent, Grid } from '@mui/material';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import AxiosRequest from '../../Components/AxiosRequest';
import { useNavigate } from 'react-router-dom';

const Finance = () => {
  const [restaurantName, setRestaurantName] = useState('');
  const [completedOrders, setCompletedOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [showCalculateRevenue, setshowCalculateRevenue] = useState(null);
  const [error, setError] = useState(null);
  const [rejected, setRejected] = useState(null);
  const [displayedOrder, setDisplayedOrder] = useState(null);
  const [currentPeriod, setCurrentPeriod] = useState(null);
  const isOwner = localStorage.getItem('isOwner') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const resName = localStorage.getItem('resName');
  const periods = ['today', 'yesterday', 'thisWeek', 'lastWeek', 'thisMonth', 'lastMonth', 'lastTwoMonths'];
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
const navigate = useNavigate();


useEffect(() => {
  console.log('isAdmin:', isAdmin);
  console.log('isOwner:', isOwner);

  if (!isAdmin && !isOwner) {
    console.log('Redirecting to /forbidden');
    navigate('/forbidden');
  }
}, [isAdmin, isOwner, navigate]);


  const handlePeriodButtonClick = async (period) => {
    try {
      setSelectedPeriod(period);
      const response = await AxiosRequest.post(`/api/orders/completed`, { period, restaurantName: isOwner ? resName : restaurantName });
      setCompletedOrders(response.data);
      setDisplayedOrder(true);
      setTotalRevenue(null);
      setshowCalculateRevenue(true);
      setRejected(null);
      setShowDetails(null);
      setCurrentPeriod(period);
      setError(response.data.length === 0 ? `No completed orders found in the ${period} period.` : null);
      if (response.data.length === 0) {
        setshowCalculateRevenue(null);
      }
    } catch (err) {
      console.error('Error fetching completed orders:', err);
      setError('Failed to fetch completed orders. Please try again later.');
    }
  };

  const handleCalculateRevenue = async () => {
    try {
      const response = await AxiosRequest.post(`/api/revenue`, { period: currentPeriod, restaurantName: isOwner ? resName : restaurantName });
      setTotalRevenue(response.data.totalRevenue);
      setError(response.data.totalRevenue === 0 || response.data.totalRevenue === undefined ? 'No revenue found in this date range.' : null);
      setshowCalculateRevenue(null);
    } catch (err) {
      console.error('Error calculating total revenue:', err);
      setError('Failed to calculate total revenue. Please try again later.');
    }
  };

  const handleRejectedOrders = async () => {
    try {
      const response = await AxiosRequest.post(`/api/orders/rejected`, { period: currentPeriod, restaurantName: isOwner ? resName : restaurantName });
      setCompletedOrders(response.data);
      setshowCalculateRevenue(null);
      setRejected(true);
      setShowDetails(null);
      setError(response.data.length === 0 ? `No rejected orders found in the ${currentPeriod} period.` : null);
    } catch (err) {
      console.error('Error fetching rejected orders:', err);
      setError('Failed to fetch rejected orders. Please try again later.');
    }
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
      <Box className="flex justify-center items-center h-full">
      <div className="flex flex-col items-center p-2">
        <Grid container spacing={2} justifyContent="center" className='!w-screen'>
        <div className="flex flex-col justify-center items-center mt-4 ml-2">

          <Grid item xs={20}>
          <div className='flex flex-col items-center justify-center'>
            <Typography variant="h4" gutterBottom className="text-lg mt-4 mb-4">
               {isAdmin ? '' : `${resName} :`}إدارة المال
            </Typography>
            {!isOwner && (
            <Grid item xs={16}>
              <TextField
                placeholder="اسم المتجر"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="mb-4 mt-10 w-[70vw]"
                sx={{
                  '& .MuiOutlinedInput-input:focus': {
                    outline: 'none', // Removes the focus ring
                    boxShadow: 'none',
                  },
                }}
                style={{
                  textAlign: 'center', // محاذاة النص إلى المركز
                  direction: 'rtl',   // تحديد اتجاه الكتابة من اليمين لليسار
                }}
              />
            </Grid>
          )}
            </div>

            {currentPeriod && (
              <div className='flex items-center justify-center'>
              <Button variant="contained" onClick={handleRejectedOrders} className="mb-2"  sx={{
                backgroundColor:  'red' 
              }}>
                {currentPeriod}: عرض الطلبات المرفوضة لـ
              </Button>
              </div>
            )}
          </Grid>
          </div>
           <div className="flex flex-col md:flex-row md:overflow-auto items-center mt-4 mb-4 ml-2">
            <Typography variant="h6">
            فلتر
            </Typography>
            {periods.map((period) => (
              <div className="p-2">
              <Button key={period} variant="contained" onClick={() => handlePeriodButtonClick(period)}
               sx={{
                backgroundColor: selectedPeriod === period ? 'green' : 'blue'
              }}>
                {period}
              </Button>
              </div>
            ))}
          </div>
          <Grid item xs={12}>
            {error && <Typography color="error">{error}</Typography>}
          </Grid>
          {completedOrders.length > 0 && (
            <Grid item xs={12}>
              <div className='flex items-center justify-center'>
              <Typography variant="h5" gutterBottom >
                {rejected ? 'طلبات مرفوضة' : 'طلبات جاهزة'}
              </Typography>
              </div>
              <Card className="mb-2">
                <CardContent>
                  <div className='overflow-auto'>
                  <table className="w-full">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="p-2">رقم الطلب</th>
                        <th className="p-2">المتجر</th>
                        <th className="p-2">السعر</th>
                        <th className="p-2">الاسم</th>
                        <th className="p-2">العدد</th>
                        <th className="p-2">اضافات</th>
                        <th className="p-2">سعر الاضافات</th>
                        <th className="p-2">حالة الطلب</th>
                        <th className="p-2">{rejected? 'Declined At': 'Completed At'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedOrders.map((order) =>
                        order.products.map((product) => (
                          <tr key={product._id}>
                            <td className="p-2">{order.orderId}</td>
                            <td className="p-2">{product.orderFrom}</td>
                            <td className="p-2">{product.price} ₪</td>
                            <td className="p-2">{product.name}</td>
                            <td className="p-2">{product.quantity}</td>
                            <td className="p-2">{product.extras && product.extras.length > 0 ? product.extras.map(extra => extra.name).join(', ') : 'None'}</td>
                            <td className="p-2">{product.extras && product.extras.length > 0 ? `${product.extras.map(extra => extra.price).join(', ')} ₪` : 'None'}</td>
                            <td className="p-2">{order.status ? order.status : 'No Status Yet'}</td>
                            <td className="p-2">{rejected ? formatDate(order.declinedAt) : formatDate(order.completedAt)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  </div>
                </CardContent>
              </Card>
            </Grid>
            
          )}
          <div className='mt-4'>
          {showCalculateRevenue && (
            <Button variant="contained" onClick={handleCalculateRevenue} className="mb-2 ml-2"  
            sx={{
              backgroundColor:  'green'          
              }}>
            💰 حساب الإيرادات 💰
       </Button>
          )}
       {totalRevenue !== null && displayedOrder && !rejected && (
        <Grid item xs={12}>
      <Typography variant="h5" gutterBottom>
      🍽️ إيرادات المتجر
         </Typography>
         <Typography variant="h5" gutterBottom>
         ₪ {totalRevenue} :إجمالي الإيرادات هو
       </Typography>
     </Grid>
    )}
    </div>

    </Grid>
 </div>
</Box>
);
};

export default Finance;
