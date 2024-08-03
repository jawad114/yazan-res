// import React, { useState } from 'react';
// import axios from 'axios';
// import { TextField, Button, CircularProgress } from '@mui/material';
// import { useParams } from "react-router-dom";

// const UpdateHours = () => {
//   //   const [restaurantName, setRestaurantName] = useState('');
//   const [day, setDay] = useState('');
//   const [open, setOpen] = useState('');
//   const [close, setClose] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const isAdmin = localStorage.getItem('isAdmin') === 'true';
//   const isOwner = localStorage.getItem('isOwner') === 'true';
//   const resName = localStorage.getItem('resName');
//   const { restaurantName } = useParams();

//   const validTimeFormat = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

//   const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

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

//     if (!open.match(validTimeFormat) || !close.match(validTimeFormat)) {
//       setError('Invalid time format. Use HH:MM (24-hour)');
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.put(`https://yazan-4.onrender.com/update-opening-hours/${isOwner ? resName : restaurantName}/${day}`, {
//         open,
//         close
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
//         {/* {isAdmin&&( 
//         <>
//       <h4 className='mt-2'>Enter Restaurant Name</h4>
//         <input
//           placeholder="Restaurant Name"
//           name='restaurantName'
//           type="text"
//           value={restaurantName}
//           onChange={(e) => setRestaurantName(e.target.value)}
//           className='mt-2'
//         />
//         </>
//        )} */}
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
//         <h4 className='mt-4'>Enter Opening Time (HH:MM, 24-hour format)</h4>
//         <input
//           placeholder="Open"
//           type="text"
//           name='open'
//           value={open}
//           onChange={(e) => setOpen(e.target.value)}
//           className='mt-2'
//         />
//         <h4 className='mt-4'>Enter Closing Time (HH:MM, 24-hour format)</h4>
//         <input
//           placeholder="Close"
//           type="text"
//           name='close'
//           value={close}
//           onChange={(e) => setClose(e.target.value)}
//           className='mt-2'

//         />
//         <Button
//           type="submit"
//           variant="contained"
//           disabled={loading}
//           className='mt-4'
//         >
//           {loading ? <CircularProgress size={24} /> : 'Update Opening Hours'}
//         </Button>
//         {error && <p style={{ color: 'red' }} className='mt-2'>{error}</p>}
//         {successMessage && <p style={{ color: 'green' }} className='mt-2'>{successMessage}</p>}
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


import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from "react-router-dom";
import AxiosRequest from '../../Components/AxiosRequest';

const UpdateHours = () => {
  const [day, setDay] = useState('');
  const [open, setOpen] = useState(null);
  const [close, setClose] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const isOwner = localStorage.getItem('isOwner') === 'true';
  const resName = localStorage.getItem('resName');
  const { restaurantName } = useParams();

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  const handleDayClick = (selectedDay) => {
    setDay(selectedDay);
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
      const response = await AxiosRequest.put(`/update-opening-hours/${isOwner ? resName : restaurantName}/${day}`, {
        open: open ? open.getHours() + ':' + ('0' + open.getMinutes()).slice(-2) : '',
        close: close ? close.getHours() + ':' + ('0' + close.getMinutes()).slice(-2) : ''
      });
      setSuccessMessage(response.data.message);
    } catch (err) {
      setError(err.response.data.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className='mt-4'>Update Opening Hours For {isOwner ? resName : restaurantName}</h1>
      <form onSubmit={onSubmit} className="text-center p-8 min-w-screen">
        <div className='flex mt-4 flex-col md:flex-row items-center justify-center'>
          {days.map((d) => (
            <Button
              key={d}
              variant={day === d ? 'contained' : 'outlined'}
              onClick={() => handleDayClick(d)}
              style={{ margin: '4px' }}
            >
              {d}
            </Button>
          ))}
        </div>
        <div className='flex flex-col justify-center items-center'>
        <h4 className='mt-4'>Select Opening Time</h4>
        <DatePicker
          selected={open}
          onChange={(date) => setOpen(date)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={10}
          timeFormat="HH:mm"
          dateFormat="HH:mm"
          placeholderText="Select opening time"
          className='mt-2'
        />
        <h4 className='mt-4'>Select Closing Time</h4>
        <DatePicker
          selected={close}
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
          {loading ? 'Updating...' : 'Update Opening Hours'}
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
        Back
      </Button>
    </div>
  );
};

export default UpdateHours;

