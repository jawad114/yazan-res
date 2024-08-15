// import React, { useState,useEffect } from 'react';
// import { Button } from '@mui/material';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { useNavigate, useParams } from "react-router-dom";
// import AxiosRequest from '../../Components/AxiosRequest';

// const UpdateHours = () => {
//   const [day, setDay] = useState('');
//   const [open, setOpen] = useState(null);
//   const [close, setClose] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const isAdmin = localStorage.getItem('isAdmin') === 'true';
//   const isOwner = localStorage.getItem('isOwner') === 'true';
//   const navigate = useNavigate();
//   const resName = localStorage.getItem('resName');
//   const { restaurantName } = useParams();

//   const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

//   useEffect(() => {
//     if (!isAdmin && !isOwner) {
//         navigate('/forbidden'); // Replace with your target route
//     }
// }, [isAdmin, isOwner, navigate]);

//   const handleDayClick = (selectedDay) => {
//     setDay(selectedDay);
//   };

//   const handleBack = () => {
//     window.location.replace(`/`);
//   }

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccessMessage('');
//     setLoading(true);

//     try {
//       const response = await AxiosRequest.put(`/update-opening-hours/${isOwner ? resName : restaurantName}/${day}`, {
//         open: open ? open.getHours() + ':' + ('0' + open.getMinutes()).slice(-2) : '',
//         close: close ? close.getHours() + ':' + ('0' + close.getMinutes()).slice(-2) : ''
//       });
//       setSuccessMessage(response.data.message);
//     } catch (err) {
//       setError(err.response.data.error || 'An error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col justify-center items-center">
//       <h1 className='mt-4'>Update Opening Hours For {isOwner ? resName : restaurantName}</h1>
//       <form onSubmit={onSubmit} className="text-center p-8 min-w-screen">
//         <div className='flex mt-4 flex-col md:flex-row items-center justify-center'>
//           {days.map((d) => (
//             <Button
//               key={d}
//               variant={day === d ? 'contained' : 'outlined'}
//               onClick={() => handleDayClick(d)}
//               style={{ margin: '4px' }}
//             >
//               {d}
//             </Button>
//           ))}
//         </div>
//         <div className='flex flex-col justify-center items-center'>
//         <h4 className='mt-4'>Select Opening Time</h4>
//         <DatePicker
//           selected={open}
//           onChange={(date) => setOpen(date)}
//           showTimeSelect
//           showTimeSelectOnly
//           timeIntervals={10}
//           timeFormat="HH:mm"
//           dateFormat="HH:mm"
//           placeholderText="Select opening time"
//           className='mt-2'
//         />
//         <h4 className='mt-4'>Select Closing Time</h4>
//         <DatePicker
//           selected={close}
//           onChange={(date) => setClose(date)}
//           showTimeSelect
//           showTimeSelectOnly
//           timeIntervals={10}
//           timeFormat="HH:mm"
//           dateFormat="HH:mm"
//           placeholderText="Select closing time"
//           className='mt-2'
//         />
//         <Button
//           type="submit"
//           variant="contained"
//           disabled={loading}
//           className='mt-4'
//         >
//           {loading ? 'Updating...' : 'Update Opening Hours'}
//         </Button>
//         {error && <p style={{ color: 'red' }} className='mt-2'>{error}</p>}
//         {successMessage && <p style={{ color: 'green' }} className='mt-2'>{successMessage}</p>}
//         </div>
//       </form>
//       <Button
//         onClick={handleBack}
//         variant="contained"
//         className='mb-4'
//       >
//         Back
//       </Button>
//     </div>
//   );
// };

// export default UpdateHours;

import React, { useState, useEffect } from 'react';
import { Button, Typography, Paper } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, useParams } from "react-router-dom";
import AxiosRequest from '../../Components/AxiosRequest';

const UpdateHours = () => {
  const [day, setDay] = useState('');
  const [open, setOpen] = useState(null);
  const [close, setClose] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openingHours, setOpeningHours] = useState({});
  
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isOwner = localStorage.getItem('isOwner') === 'true';
  const navigate = useNavigate();
  const resName = localStorage.getItem('resName');
  const { restaurantName } = useParams();

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  useEffect(() => {
    if (!isAdmin && !isOwner) {
      navigate('/forbidden'); // Replace with your target route
    }
  }, [isAdmin, isOwner, navigate]);

  useEffect(() => {
    // Fetch opening hours when component mounts
    const fetchOpeningHours = async () => {
      try {
        const response = await AxiosRequest.get(`/opening-hours/${isOwner ? resName : restaurantName}`);
        setOpeningHours(response.data.openingHours);
      } catch (err) {
        setError(err.response.data.error || 'An error occurred');
      }
    };

    fetchOpeningHours();
  }, [isOwner, resName, restaurantName]);

  const handleDayClick = (selectedDay) => {
    setDay(selectedDay);
    if (openingHours[selectedDay]) {
      const [openHours, openMinutes] = openingHours[selectedDay].open.split(':').map(Number);
      const [closeHours, closeMinutes] = openingHours[selectedDay].close.split(':').map(Number);
      setOpen(new Date().setHours(openHours, openMinutes, 0, 0));  // Ensure it's a Date object
      setClose(new Date().setHours(closeHours, closeMinutes, 0, 0)); // Ensure it's a Date object
    } else {
      setOpen(null);
      setClose(null);
    }
  };
  

  const handleBack = () => {
    window.location.replace(`/`);
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
  
    try {
      console.log('Open',open);
      console.log('Close',close);
      const openHours = open ? `${String(new Date(open).getHours()).padStart(2, '0')}:${String(new Date(open).getMinutes()).padStart(2, '0')}` : '';
      const closeHours = close ? `${String(new Date(close).getHours()).padStart(2, '0')}:${String(new Date(close).getMinutes()).padStart(2, '0')}` : '';
      
      const response = await AxiosRequest.put(`/update-opening-hours/${isOwner ? resName : restaurantName}/${day}`, {
        open: openHours,
        close: closeHours
      });
  
      setSuccessMessage(response.data.message);
      // Refresh opening hours after updating
      const responseUpdated = await AxiosRequest.get(`/opening-hours/${isOwner ? resName : restaurantName}`);
      setOpeningHours(responseUpdated.data.openingHours);
    } catch (err) {
      setError(err.response.data.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const formatHours = (open, close) => {
    if (open === '00:00' && close === '00:00') {
      return `Closed for ${day.charAt(0).toUpperCase() + day.slice(1)}`;
    }
    return `Open: ${open} - Close: ${close}`;
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className='mt-4'>{isOwner ? resName : restaurantName} :تحديث ساعات العمل لـ</h1>
      
      <div className='mt-4'>
        <Typography variant="h6">Opening Hours for {day.charAt(0).toUpperCase() + day.slice(1)}</Typography>
        <Paper elevation={3} className='p-2 mb-2 w-full max-w-md'>
          <Typography variant="body1" className='text-center'>
            {openingHours[day] ? 
              formatHours(openingHours[day].open, openingHours[day].close)
              : 'No hours set for this day'}
          </Typography>
        </Paper>
      </div>
      
      <form onSubmit={onSubmit} className="text-center p-8 min-w-screen">
        <div className='flex mt-4 flex-col md:flex-row items-center justify-center'>
          {days.map((d) => (
            <Button
              key={d}
              variant={day === d ? 'contained' : 'outlined'}
              onClick={() => handleDayClick(d)}
              style={{ margin: '4px' }}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </Button>
          ))}
        </div>
        <div className='flex flex-col justify-center items-center'>
          <h4 className='mt-4'>اختر وقت الفتح</h4>
          <DatePicker
            selected={open ? new Date(open) : null}
            onChange={(date) => setOpen(date)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={10}
            timeFormat="HH:mm"
            dateFormat="HH:mm"
            placeholderText="Select opening time"
            className='mt-2'
          />
          <h4 className='mt-4'>اختر وقت الإغلاق</h4>
          <DatePicker
            selected={close ? new Date(close) : null}
            onChange={(date) => setClose(date)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={10}
            timeFormat="HH:mm"
            dateFormat="HH:mm"
            placeholderText="Select closing time"
            className='mt-2'
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            className='mt-4'
          >
            {loading ? 'Updating...' : 'تحديث ساعات العمل'}
          </Button>
          {error && <p style={{ color: 'red' }} className='mt-2'>{error}</p>}
          {successMessage && <p style={{ color: 'green' }} className='mt-2'>{successMessage}</p>}
        </div>
      </form>
      <Button
        onClick={handleBack}
        variant="contained"
        className='mb-4'
      >
        عودة الى الخلف
      </Button>
    </div>
  );
};

export default UpdateHours;
